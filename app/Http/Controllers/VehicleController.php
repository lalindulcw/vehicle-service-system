<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Customer;
use App\Http\Requests\VehicleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class VehicleController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Vehicle::class);

        $query = Vehicle::with('customer');

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('registration_no', 'like', "%{$search}%")
                  ->orWhere('make', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($subQuery) use ($search) {
                      $subQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $vehicles = $query->paginate(10)->withQueryString();
        $customers = Customer::select('id', 'name', 'phone')->get();

        return Inertia::render('Vehicles/Index', [
            'vehicles' => $vehicles,
            'customers' => $customers,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
        ]);
    }

    public function store(VehicleRequest $request): RedirectResponse
    {
        Gate::authorize('create', Vehicle::class);

        $vehicle = Vehicle::create($request->validated());

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'CREATE_VEHICLE',
            'description' => "Registered vehicle {$vehicle->registration_no} ({$vehicle->make} {$vehicle->model}) for customer {$vehicle->customer->name}.",
            'properties' => ['vehicle_id' => $vehicle->id, 'registration_no' => $vehicle->registration_no]
        ]);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle registered successfully.');
    }

    public function update(VehicleRequest $request, Vehicle $vehicle): RedirectResponse
    {
        Gate::authorize('update', $vehicle);

        $vehicle->update($request->validated());

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'UPDATE_VEHICLE',
            'description' => "Updated vehicle {$vehicle->registration_no}.",
            'properties' => ['vehicle_id' => $vehicle->id, 'registration_no' => $vehicle->registration_no]
        ]);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        Gate::authorize('delete', $vehicle);

        if ($vehicle->bookings()->exists()) {
            return redirect()->route('vehicles.index')->with('error', 'Cannot delete vehicle. Delete associated bookings first.');
        }

        $regNo = $vehicle->registration_no;
        $vehicle->delete();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'DELETE_VEHICLE',
            'description' => "Deleted vehicle {$regNo}.",
            'properties' => ['registration_no' => $regNo]
        ]);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle deleted successfully.');
    }
}
