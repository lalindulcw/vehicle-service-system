<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Invoice;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Exception;

class InvoiceService
{
    /**
     * Generate an invoice for a completed booking.
     */
    public function generateInvoice(int $bookingId, array $data = []): Invoice
    {
        return DB::transaction(function () use ($bookingId, $data) {
            $booking = Booking::with('parts')->findOrFail($bookingId);

            // Verify booking isn't already invoiced
            if ($booking->invoice()->exists()) {
                throw new Exception("An invoice has already been generated for this booking.");
            }

            // Calculate totals
            $totalLabor = $booking->labor_cost;
            $totalParts = 0.00;

            foreach ($booking->parts as $part) {
                $totalParts += $part->pivot->quantity * $part->pivot->unit_price;
            }

            $totalAmount = $totalLabor + $totalParts;

            // Generate unique sequential invoice number (INV-YYYY-XXXX)
            $invoiceNo = $this->generateInvoiceNumber();

            // Create Invoice
            $invoice = Invoice::create([
                'booking_id' => $booking->id,
                'invoice_no' => $invoiceNo,
                'total_labor' => $totalLabor,
                'total_parts' => $totalParts,
                'total_amount' => $totalAmount,
                'status' => $data['status'] ?? 'pending',
                'payment_method' => $data['payment_method'] ?? null,
                'paid_at' => (isset($data['status']) && $data['status'] === 'paid') ? Carbon::now() : null,
            ]);

            // Log activity
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'GENERATE_INVOICE',
                'description' => "Generated Invoice {$invoiceNo} for Booking #{$booking->id} (Total: LKR {$totalAmount}).",
                'properties' => ['invoice_id' => $invoice->id, 'invoice_no' => $invoiceNo]
            ]);

            return $invoice;
        });
    }

    /**
     * Mark an invoice as paid.
     */
    public function markAsPaid(Invoice $invoice, string $paymentMethod): Invoice
    {
        return DB::transaction(function () use ($invoice, $paymentMethod) {
            $invoice->update([
                'status' => 'paid',
                'payment_method' => $paymentMethod,
                'paid_at' => Carbon::now(),
            ]);

            // Log activity
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'PAY_INVOICE',
                'description' => "Invoice {$invoice->invoice_no} marked as Paid via " . ucfirst($paymentMethod) . ".",
                'properties' => ['invoice_id' => $invoice->id, 'invoice_no' => $invoice->invoice_no]
            ]);

            return $invoice;
        });
    }

    /**
     * Generate unique sequential invoice number.
     */
    protected function generateInvoiceNumber(): string
    {
        $year = Carbon::now()->year;
        
        // Find last invoice generated this year
        $lastInvoice = Invoice::where('invoice_no', 'like', "INV-{$year}-%")
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = 1;
        if ($lastInvoice) {
            // Extract number part
            $parts = explode('-', $lastInvoice->invoice_no);
            if (count($parts) === 3) {
                $nextNumber = (int)$parts[2] + 1;
            }
        }

        $paddedNumber = str_pad((string)$nextNumber, 4, '0', STR_PAD_LEFT);

        return "INV-{$year}-{$paddedNumber}";
    }
}
