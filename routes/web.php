<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\MechanicController;
use App\Http\Controllers\PartController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\ActivityLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Profile CRUD
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Customers
    Route::resource('customers', CustomerController::class)->except(['create', 'show', 'edit']);

    // Vehicles
    Route::resource('vehicles', VehicleController::class)->except(['create', 'show', 'edit']);

    // Mechanics
    Route::resource('mechanics', MechanicController::class)->except(['create', 'show', 'edit']);

    // Parts Inventory
    Route::resource('parts', PartController::class)->except(['create', 'show', 'edit']);

    // Service Bookings & Job Cards
    Route::get('bookings/calendar', [BookingController::class, 'calendar'])->name('bookings.calendar');
    Route::post('bookings/{booking}/status', [BookingController::class, 'updateStatus'])->name('bookings.status');
    Route::resource('bookings', BookingController::class)->except(['create', 'show', 'edit']);

    // Invoices & Billing
    Route::post('invoices/{invoice}/pay', [InvoiceController::class, 'pay'])->name('invoices.pay');
    Route::resource('invoices', InvoiceController::class)->except(['create', 'edit', 'update', 'destroy']);

    // AI Service Advisor
    Route::get('ai/advisor', [AIController::class, 'index'])->name('ai.advisor');
    Route::post('ai/analyze', [AIController::class, 'analyze'])->name('ai.analyze');

    // Activity Logs / Audit Trail (Admin only)
    Route::get('logs', [ActivityLogController::class, 'index'])->name('logs.index');
});

require __DIR__.'/auth.php';

