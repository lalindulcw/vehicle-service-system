<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Booking;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Exception;

class InvoiceController extends Controller
{
    protected InvoiceService $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Invoice::class);

        $query = Invoice::with(['booking.customer', 'booking.vehicle']);

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('invoice_no', 'like', "%{$search}%")
                  ->orWhereHas('booking.customer', function ($sub) use ($search) {
                      $sub->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('booking.vehicle', function ($sub) use ($search) {
                      $sub->where('registration_no', 'like', "%{$search}%");
                  });
            });
        }

        // Filter status
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $invoices = $query->paginate(10)->withQueryString();

        // Get completed bookings that do NOT have invoices yet, to populate "Generate Invoice" list
        $uninvoicedBookings = Booking::with(['customer', 'vehicle'])
            ->where('status', 'completed')
            ->whereDoesntHave('invoice')
            ->get();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'uninvoicedBookings' => $uninvoicedBookings,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    public function show(Invoice $invoice): Response
    {
        Gate::authorize('view', $invoice);

        $invoice->load(['booking.customer', 'booking.vehicle', 'booking.mechanic', 'booking.parts']);

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', Invoice::class);

        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'status' => 'nullable|in:pending,paid',
            'payment_method' => 'nullable|string',
        ]);

        try {
            $invoice = $this->invoiceService->generateInvoice(
                $request->input('booking_id'),
                $request->only(['status', 'payment_method'])
            );
            return redirect()->route('invoices.show', $invoice->id)->with('success', 'Invoice generated successfully.');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function pay(Request $request, Invoice $invoice): RedirectResponse
    {
        Gate::authorize('update', $invoice);

        $request->validate([
            'payment_method' => 'required|string|in:cash,card,bank_transfer'
        ]);

        try {
            $this->invoiceService->markAsPaid($invoice, $request->input('payment_method'));
            return redirect()->back()->with('success', 'Invoice payment processed successfully.');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
