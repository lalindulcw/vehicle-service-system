<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Customer;
use App\Models\Vehicle;
use App\Models\Mechanic;
use App\Models\Part;
use App\Services\BookingService;
use App\Http\Requests\BookingRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Exception;

class BookingController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Booking::class);

        $query = Booking::with(['customer', 'vehicle', 'mechanic', 'parts']);

        // Roles filters: Mechanics can only see their assigned bookings!
        if (auth()->user()->hasRole('Mechanic')) {
            $query->whereHas('mechanic', function ($q) {
                $q->where('name', auth()->user()->name);
            });
        }

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('customer', function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('vehicle', function ($sub) use ($search) {
                    $sub->where('registration_no', 'like', "%{$search}%");
                })
                ->orWhere('status', 'like', "%{$search}%");
            });
        }

        // Filter by Status
        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        // Sorting
        $sortField = $request->input('sort_field', 'scheduled_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $bookings = $query->paginate(10)->withQueryString();

        // Metadata for dropdowns
        $customers = Customer::select('id', 'name')->get();
        $vehicles = Vehicle::select('id', 'registration_no', 'customer_id', 'make', 'model')->get();
        $mechanics = Mechanic::select('id', 'name', 'specialization')->get();
        $parts = Part::select('id', 'name', 'sku', 'price', 'stock')->get();

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
            'customers' => $customers,
            'vehicles' => $vehicles,
            'mechanics' => $mechanics,
            'parts' => $parts,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction']),
        ]);
    }

    public function store(BookingRequest $request): RedirectResponse
    {
        Gate::authorize('create', Booking::class);

        try {
            $this->bookingService->createBooking($request->validated());
            return redirect()->route('bookings.index')->with('success', 'Service booking created successfully.');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function update(BookingRequest $request, Booking $booking): RedirectResponse
    {
        Gate::authorize('update', $booking);

        try {
            $this->bookingService->updateBooking($booking, $request->validated());
            return redirect()->route('bookings.index')->with('success', 'Booking updated successfully.');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function updateStatus(Request $request, Booking $booking): RedirectResponse
    {
        Gate::authorize('update', $booking);

        $request->validate([
            'status' => 'required|in:pending,in_progress,completed,cancelled'
        ]);

        try {
            $this->bookingService->updateBooking($booking, [
                'status' => $request->input('status')
            ]);
            return redirect()->back()->with('success', 'Job status updated to ' . ucfirst($request->input('status')) . '.');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        Gate::authorize('delete', $booking);

        if ($booking->invoice()->exists()) {
            return redirect()->route('bookings.index')->with('error', 'Cannot delete booking. An invoice has already been generated.');
        }

        $booking->parts()->detach();
        $booking->delete();

        return redirect()->route('bookings.index')->with('success', 'Booking deleted.');
    }

    /**
     * Show Calendar/Schedule Timeline.
     */
    public function calendar(): Response
    {
        Gate::authorize('viewAny', Booking::class);

        $query = Booking::with(['customer', 'vehicle', 'mechanic']);

        if (auth()->user()->hasRole('Mechanic')) {
            $query->whereHas('mechanic', function ($q) {
                $q->where('name', auth()->user()->name);
            });
        }

        $bookings = $query->get()->map(function ($booking) {
            return [
                'id' => $booking->id,
                'title' => ($booking->vehicle->registration_no) . ' - ' . ($booking->mechanic ? $booking->mechanic->name : 'Unassigned'),
                'start' => $booking->scheduled_at->toIso8601String(),
                'end' => $booking->scheduled_at->copy()->addMinutes(90)->toIso8601String(),
                'status' => $booking->status,
                'customer' => $booking->customer->name,
                'vehicle' => "{$booking->vehicle->make} {$booking->vehicle->model}",
                'mechanic' => $booking->mechanic ? $booking->mechanic->name : 'Unassigned',
                'notes' => $booking->notes,
            ];
        });

        return Inertia::render('Bookings/Calendar', [
            'events' => $bookings
        ]);
    }
}
