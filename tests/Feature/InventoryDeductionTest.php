<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Customer;
use App\Models\Vehicle;
use App\Models\Mechanic;
use App\Models\Part;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;
use Exception;

class InventoryDeductionTest extends TestCase
{
    use RefreshDatabase;

    protected BookingService $bookingService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bookingService = new BookingService();
    }

    public function test_inventory_deducts_when_booking_completed()
    {
        // 1. Setup mock data
        $customer = Customer::create([
            'name' => 'Jane Smith',
            'phone' => '987654321'
        ]);

        $vehicle = Vehicle::create([
            'customer_id' => $customer->id,
            'registration_no' => 'WP CAD-4455',
            'make' => 'Nissan',
            'model' => 'Leaf',
            'year' => 2019,
            'mileage' => 60000
        ]);

        $part = Part::create([
            'name' => 'Cabin Filter',
            'sku' => 'CAB-NSS-01',
            'price' => 3000,
            'stock' => 10,
            'min_stock_threshold' => 3
        ]);

        $time = Carbon::now()->addDay()->setHour(11)->setMinute(0);

        // 2. Create booking with parts attached
        $booking = $this->bookingService->createBooking([
            'customer_id' => $customer->id,
            'vehicle_id' => $vehicle->id,
            'scheduled_at' => $time,
            'status' => 'pending',
            'labor_cost' => 1000,
            'parts' => [
                ['part_id' => $part->id, 'quantity' => 2, 'price' => 3000]
            ]
        ]);

        $this->assertEquals(10, $part->fresh()->stock); // Stock should NOT be deducted yet (it's pending)

        // 3. Mark booking as completed
        $this->bookingService->updateBooking($booking, [
            'status' => 'completed'
        ]);

        // 4. Verify stock is decremented
        $this->assertEquals(8, $part->fresh()->stock); // 10 - 2 = 8
    }
}
