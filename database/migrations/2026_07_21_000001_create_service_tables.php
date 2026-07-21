<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Customers Table
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone');
            $table->text('address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 2. Vehicles Table
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('restrict');
            $table->string('registration_no')->unique();
            $table->string('make');
            $table->string('model');
            $table->integer('year');
            $table->string('vin')->nullable();
            $table->integer('mileage');
            $table->timestamps();
        });

        // 3. Mechanics Table
        Schema::create('mechanics', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('employee_id')->unique();
            $table->string('specialization')->nullable();
            $table->string('contact');
            $table->timestamps();
        });

        // 4. Parts (Inventory) Table
        Schema::create('parts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2);
            $table->integer('stock');
            $table->integer('min_stock_threshold')->default(5);
            $table->timestamps();
        });

        // 5. Bookings Table
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('restrict');
            $table->foreignId('vehicle_id')->constrained()->onDelete('restrict');
            $table->foreignId('mechanic_id')->nullable()->constrained()->onDelete('restrict');
            $table->dateTime('scheduled_at');
            $table->string('status')->default('pending'); // pending, in_progress, completed, cancelled
            $table->decimal('labor_cost', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Index for performance and checking conflict
            $table->index(['scheduled_at', 'mechanic_id']);
        });

        // 6. Booking Parts (Pivot with quantity/price) Table
        Schema::create('booking_parts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('part_id')->constrained()->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->timestamps();
        });

        // 7. Invoices Table
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('restrict');
            $table->string('invoice_no')->unique();
            $table->decimal('total_labor', 10, 2);
            $table->decimal('total_parts', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->string('status')->default('pending'); // paid, pending
            $table->string('payment_method')->nullable(); // cash, card, bank_transfer
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        // 8. Activity Logs (Audit Trail) Table
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('action');
            $table->text('description');
            $table->text('properties')->nullable(); // to log changes
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('booking_parts');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('parts');
        Schema::dropIfExists('mechanics');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('customers');
    }
};
