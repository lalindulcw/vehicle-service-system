<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\ActivityLog;
use App\Models\Part;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;

class BookingService
{
    /**
     * Create a new booking with conflict checking.
     */
    public function createBooking(array $data): Booking
    {
        return DB::transaction(function () use ($data) {
            $scheduledAt = Carbon::parse($data['scheduled_at']);
            $mechanicId = $data['mechanic_id'] ?? null;
            $vehicleId = $data['vehicle_id'];

            // 1. Validate Conflicts
            $this->validateConflicts($scheduledAt, $mechanicId, $vehicleId);

            // 2. Create Booking
            $booking = Booking::create([
                'customer_id' => $data['customer_id'],
                'vehicle_id' => $vehicleId,
                'mechanic_id' => $mechanicId,
                'scheduled_at' => $scheduledAt,
                'status' => $data['status'] ?? 'pending',
                'labor_cost' => $data['labor_cost'] ?? 0.00,
                'notes' => $data['notes'] ?? null,
            ]);

            // 3. Attach parts if any
            if (!empty($data['parts'])) {
                foreach ($data['parts'] as $partData) {
                    $part = Part::findOrFail($partData['part_id']);
                    // Check stock
                    if ($part->stock < $partData['quantity']) {
                        throw new Exception("Insufficient stock for part: {$part->name}");
                    }
                    $booking->parts()->attach($part->id, [
                        'quantity' => $partData['quantity'],
                        'unit_price' => $partData['price'] ?? $part->price,
                    ]);
                }
            }

            // 4. Log Activity
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'CREATE_BOOKING',
                'description' => "Created booking #{$booking->id} for Vehicle registration {$booking->vehicle->registration_no}.",
                'properties' => ['booking_id' => $booking->id]
            ]);

            return $booking;
        });
    }

    /**
     * Update an existing booking.
     */
    public function updateBooking(Booking $booking, array $data): Booking
    {
        return DB::transaction(function () use ($booking, $data) {
            $scheduledAt = isset($data['scheduled_at']) ? Carbon::parse($data['scheduled_at']) : $booking->scheduled_at;
            $mechanicId = array_key_exists('mechanic_id', $data) ? $data['mechanic_id'] : $booking->mechanic_id;
            $vehicleId = $data['vehicle_id'] ?? $booking->vehicle_id;
            $oldStatus = $booking->status;

            // Validate conflict only if scheduled time, mechanic, or vehicle changes
            if (
                $scheduledAt->ne($booking->scheduled_at) ||
                $mechanicId !== $booking->mechanic_id ||
                $vehicleId !== $booking->vehicle_id
            ) {
                $this->validateConflicts($scheduledAt, $mechanicId, $vehicleId, $booking->id);
            }

            // Update details
            $booking->update([
                'customer_id' => $data['customer_id'] ?? $booking->customer_id,
                'vehicle_id' => $vehicleId,
                'mechanic_id' => $mechanicId,
                'scheduled_at' => $scheduledAt,
                'status' => $data['status'] ?? $booking->status,
                'labor_cost' => $data['labor_cost'] ?? $booking->labor_cost,
                'notes' => $data['notes'] ?? $booking->notes,
            ]);

            // Sync parts if provided
            if (isset($data['parts'])) {
                // If the booking was already completed, stock deduction was done. We'll handle sync carefully.
                // Reset sync: detach and re-attach (only if status isn't already completed, or handle adjustments)
                $booking->parts()->detach();
                foreach ($data['parts'] as $partData) {
                    $part = Part::findOrFail($partData['part_id']);
                    $booking->parts()->attach($part->id, [
                        'quantity' => $partData['quantity'],
                        'unit_price' => $partData['price'] ?? $part->price,
                    ]);
                }
            }

            // Handle transition to completed (deduct stock)
            if ($booking->status === 'completed' && $oldStatus !== 'completed') {
                $this->deductPartsStock($booking);
            }

            // Log Activity
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'UPDATE_BOOKING',
                'description' => "Updated booking #{$booking->id} (Status: {$oldStatus} -> {$booking->status}).",
                'properties' => ['booking_id' => $booking->id, 'old_status' => $oldStatus, 'new_status' => $booking->status]
            ]);

            return $booking;
        });
    }

    /**
     * Validate scheduling conflicts.
     */
    protected function validateConflicts(Carbon $time, ?int $mechanicId, int $vehicleId, ?int $ignoreBookingId = null): void
    {
        $bufferMinutes = 90; // 1.5 hours service buffer
        $start = $time->copy()->subMinutes($bufferMinutes);
        $end = $time->copy()->addMinutes($bufferMinutes);

        // 1. Check Mechanic double-booking
        if ($mechanicId) {
            $mechanicConflict = Booking::where('mechanic_id', $mechanicId)
                ->whereIn('status', ['pending', 'in_progress'])
                ->whereBetween('scheduled_at', [$start, $end])
                ->when($ignoreBookingId, function ($query) use ($ignoreBookingId) {
                    return $query->where('id', '!=', $ignoreBookingId);
                })
                ->exists();

            if ($mechanicConflict) {
                throw new Exception("The selected mechanic is already booked close to this time slot.");
            }
        }

        // 2. Check Vehicle double-booking
        $vehicleConflict = Booking::where('vehicle_id', $vehicleId)
            ->whereIn('status', ['pending', 'in_progress'])
            ->whereBetween('scheduled_at', [$start, $end])
            ->when($ignoreBookingId, function ($query) use ($ignoreBookingId) {
                return $query->where('id', '!=', $ignoreBookingId);
            })
            ->exists();

        if ($vehicleConflict) {
            throw new Exception("This vehicle has another active booking scheduled close to this time slot.");
        }
    }

    /**
     * Deduct inventory stock for parts used in a completed booking.
     */
    protected function deductPartsStock(Booking $booking): void
    {
        foreach ($booking->parts as $part) {
            $quantityUsed = $part->pivot->quantity;
            if ($part->stock < $quantityUsed) {
                throw new Exception("Cannot complete job. Insufficient inventory for part: {$part->name} (Available: {$part->stock}, Needed: {$quantityUsed})");
            }
            $part->decrement('stock', $quantityUsed);
        }
    }
}
