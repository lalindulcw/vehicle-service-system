<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Customer;
use App\Models\Vehicle;
use App\Models\Mechanic;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;
use Exception;

class BookingConflictTest extends TestCase
{
    use RefreshDatabase;

    protected BookingService $bookingService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bookingService = new BookingService();
    }

    public function test_cannot_double_book_mechanic_at_same_time()
    {
        // 1. Create dummy data
        $customer = Customer::create([
            'name' => 'John Doe',
            'phone' => '123456789'
        ]);

        $vehicle1 = Vehicle::create([
            'customer_id' => $customer->id,
            'registration_no' => 'WP ABC-1234',
            'make' => 'Toyota',
            'model' => 'Allion',
            'year' => 2015,
            'mileage' => 120000
        ]);

        $vehicle2 = Vehicle::create([
            'customer_id' => $customer->id,
            'registration_no' => 'WP XYZ-9988',
            'make' => 'Honda',
            'model' => 'Vezel',
            'year' => 2017,
            'mileage' => 75000
        ]);

        $mechanic = Mechanic::create([
            'name' => 'Mike Mechanic',
            'employee_id' => 'EMP111',
            'contact' => '123'
        ]);

        $time = Carbon::now()->addDay()->setHour(10)->setMinute(00)->setSecond(0);

        // 2. Create first booking
        $this->bookingService->createBooking([
            'customer_id' => $customer->id,
            'vehicle_id' => $vehicle1->id,
            'mechanic_id' => $mechanic->id,
            'scheduled_at' => $time,
            'status' => 'pending',
            'labor_cost' => 1500
        ]);

        $this->assertDatabaseHas('bookings', [
            'vehicle_id' => $vehicle1->id,
            'mechanic_id' => $mechanic->id
        ]);

        // 3. Try to book same mechanic close to the time (e.g. 10:30, within the 90 minutes buffer)
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('The selected mechanic is already booked close to this time slot.');

        $this->bookingService->createBooking([
            'customer_id' => $customer->id,
            'vehicle_id' => $vehicle2->id,
            'mechanic_id' => $mechanic->id,
            'scheduled_at' => $time->copy()->addMinutes(30),
            'status' => 'pending',
            'labor_cost' => 2000
        ]);
    }
}
