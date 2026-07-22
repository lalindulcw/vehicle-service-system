<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use App\Models\Customer;
use App\Models\Vehicle;
use App\Models\Mechanic;
use App\Models\Part;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Create Permissions
        $permissions = [
            'manage customers',
            'manage vehicles',
            'manage bookings',
            'manage mechanics',
            'manage inventory',
            'manage billing',
            'view logs'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // 3. Create Roles and Assign Permissions
        $adminRole = Role::create(['name' => 'Admin']);
        $adminRole->givePermissionTo(Permission::all());

        $advisorRole = Role::create(['name' => 'Service Advisor']);
        $advisorRole->givePermissionTo([
            'manage customers',
            'manage vehicles',
            'manage bookings',
            'manage billing'
        ]);

        $mechanicRole = Role::create(['name' => 'Mechanic']);

        // 4. Create Users and Assign Roles
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole($adminRole);

        $advisor = User::create([
            'name' => 'John Service Advisor',
            'email' => 'advisor@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $advisor->assignRole($advisorRole);

        $mechanic1 = User::create([
            'name' => 'Mike Master Mechanic',
            'email' => 'mechanic@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $mechanic1->assignRole($mechanicRole);

        $mechanic2 = User::create([
            'name' => 'Sarah Engine Specialist',
            'email' => 'sarah@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $mechanic2->assignRole($mechanicRole);

        // 5. Seed Core Data (Customers, Vehicles, Mechanics, Parts, Bookings)
        
        // Mechanics
        $m1 = Mechanic::create([
            'name' => 'Mike Master Mechanic',
            'employee_id' => 'EMP001',
            'specialization' => 'Suspension & Alignment',
            'contact' => '+94771234567'
        ]);

        $m2 = Mechanic::create([
            'name' => 'Sarah Engine Specialist',
            'employee_id' => 'EMP002',
            'specialization' => 'Engine Tuning & Diagnostics',
            'contact' => '+94777654321'
        ]);

        $m3 = Mechanic::create([
            'name' => 'Alex Electrician',
            'employee_id' => 'EMP003',
            'specialization' => 'Auto Electricals & AC',
            'contact' => '+94711122334'
        ]);

        // Customers & Vehicles
        $c1 = Customer::create([
            'name' => 'Kamal Perera',
            'email' => 'kamal@gmail.com',
            'phone' => '+94712233445',
            'address' => '123 Galle Road, Colombo 03',
            'notes' => 'Prefers morning service appointments'
        ]);

        $v1 = Vehicle::create([
            'customer_id' => $c1->id,
            'registration_no' => 'WP CAD-1234',
            'make' => 'Toyota',
            'model' => 'Prius',
            'year' => 2018,
            'vin' => 'JTDKB3FU9J1234567',
            'mileage' => 85000
        ]);

        $c2 = Customer::create([
            'name' => 'Nimal Silva',
            'email' => 'nimal@gmail.com',
            'phone' => '+94778899001',
            'address' => '45 Kandy Road, Kiribathgoda',
            'notes' => 'Repeat VIP customer'
        ]);

        $v2 = Vehicle::create([
            'customer_id' => $c2->id,
            'registration_no' => 'WP CAR-9988',
            'make' => 'Honda',
            'model' => 'Civic',
            'year' => 2020,
            'vin' => '1HGFC2F85LH998877',
            'mileage' => 45000
        ]);

        $c3 = Customer::create([
            'name' => 'Priya Fernando',
            'email' => 'priya@gmail.com',
            'phone' => '+94761122334',
            'address' => '77 Negombo Road, Wattala',
            'notes' => 'Requires invoice copies to office email'
        ]);

        $v3 = Vehicle::create([
            'customer_id' => $c3->id,
            'registration_no' => 'WP CBB-5566',
            'make' => 'Suzuki',
            'model' => 'Wagon R',
            'year' => 2017,
            'vin' => 'MH34S-123456',
            'mileage' => 110000
        ]);

        // Parts Inventory
        $p1 = Part::create([
            'name' => 'Engine Oil 4L (Toyota Genuine)',
            'sku' => 'OIL-TOY-4L',
            'price' => 12500.00,
            'stock' => 15,
            'min_stock_threshold' => 5
        ]);

        $p2 = Part::create([
            'name' => 'Oil Filter (C-110)',
            'sku' => 'FLT-OIL-C110',
            'price' => 2500.00,
            'stock' => 25,
            'min_stock_threshold' => 10
        ]);

        $p3 = Part::create([
            'name' => 'Front Brake Pads Set (Toyota Prius)',
            'sku' => 'BRK-FRT-PRU',
            'price' => 8500.00,
            'stock' => 3, // LOW STOCK for testing dashboard alerts!
            'min_stock_threshold' => 5
        ]);

        $p4 = Part::create([
            'name' => 'Cabin Air Filter',
            'sku' => 'FLT-CAB-WAGR',
            'price' => 3200.00,
            'stock' => 12,
            'min_stock_threshold' => 4
        ]);

        $p5 = Part::create([
            'name' => 'Spark Plug (Denso Iridium)',
            'sku' => 'SPK-PLG-DEN',
            'price' => 4500.00,
            'stock' => 20,
            'min_stock_threshold' => 8
        ]);

        // Bookings
        // Today's Bookings
        $b1 = Booking::create([
            'customer_id' => $c1->id,
            'vehicle_id' => $v1->id,
            'mechanic_id' => $m1->id,
            'scheduled_at' => Carbon::today()->setHour(9)->setMinute(0),
            'status' => 'in_progress',
            'labor_cost' => 3500.00,
            'notes' => 'Routine 85k mileage service'
        ]);

        $b1->parts()->attach($p1->id, ['quantity' => 1, 'unit_price' => $p1->price]);
        $b1->parts()->attach($p2->id, ['quantity' => 1, 'unit_price' => $p2->price]);

        $b2 = Booking::create([
            'customer_id' => $c2->id,
            'vehicle_id' => $v2->id,
            'mechanic_id' => $m2->id,
            'scheduled_at' => Carbon::today()->setHour(13)->setMinute(30),
            'status' => 'pending',
            'labor_cost' => 5000.00,
            'notes' => 'Engine misfiring issue'
        ]);

        // Yesterday's completed booking with invoice
        $b3 = Booking::create([
            'customer_id' => $c3->id,
            'vehicle_id' => $v3->id,
            'mechanic_id' => $m1->id,
            'scheduled_at' => Carbon::yesterday()->setHour(10)->setMinute(00),
            'status' => 'completed',
            'labor_cost' => 4500.00,
            'notes' => 'Brake replacement'
        ]);
        $b3->parts()->attach($p3->id, ['quantity' => 1, 'unit_price' => $p3->price]);

        // Create invoice for completed booking
        Invoice::create([
            'booking_id' => $b3->id,
            'invoice_no' => 'INV-2026-0001',
            'total_labor' => 4500.00,
            'total_parts' => 8500.00,
            'total_amount' => 13000.00,
            'status' => 'paid',
            'payment_method' => 'card',
            'paid_at' => Carbon::yesterday()->setHour(11)->setMinute(30)
        ]);

        // Logs
        ActivityLog::create([
            'user_id' => $advisor->id,
            'action' => 'CREATE_BOOKING',
            'description' => "Created booking #{$b1->id} for customer {$c1->name}",
            'properties' => json_encode(['booking_id' => $b1->id])
        ]);

        ActivityLog::create([
            'user_id' => $advisor->id,
            'action' => 'GENERATE_INVOICE',
            'description' => "Generated Invoice INV-2026-0001 for Booking #{$b3->id}",
            'properties' => json_encode(['invoice_no' => 'INV-2026-0001'])
        ]);
    }
}
