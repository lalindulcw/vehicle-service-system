<?php

namespace App\Http\Controllers;

use App\Models\Mechanic;
use App\Http\Requests\MechanicRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class MechanicController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Mechanic::class);

        $query = Mechanic::query();

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%")
                  ->orWhere('specialization', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $mechanics = $query->paginate(10)->withQueryString();

        return Inertia::render('Mechanics/Index', [
            'mechanics' => $mechanics,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
            'stats' => [
                'total' => Mechanic::count(),
                'specializations' => Mechanic::distinct('specialization')->whereNotNull('specialization')->where('specialization', '!=', '')->count(),
                'recent' => Mechanic::where('created_at', '>=', now()->subDays(7))->count(),
            ]
        ]);
    }

    public function store(MechanicRequest $request): RedirectResponse
    {
        Gate::authorize('create', Mechanic::class);

        $mechanic = Mechanic::create($request->validated());

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'CREATE_MECHANIC',
            'description' => "Registered mechanic: {$mechanic->name} (ID: {$mechanic->employee_id})",
            'properties' => ['mechanic_id' => $mechanic->id, 'employee_id' => $mechanic->employee_id]
        ]);

        return redirect()->route('mechanics.index')->with('success', 'Mechanic registered successfully.');
    }

    public function update(MechanicRequest $request, Mechanic $mechanic): RedirectResponse
    {
        Gate::authorize('update', $mechanic);

        $mechanic->update($request->validated());

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'UPDATE_MECHANIC',
            'description' => "Updated mechanic: {$mechanic->name}",
            'properties' => ['mechanic_id' => $mechanic->id]
        ]);

        return redirect()->route('mechanics.index')->with('success', 'Mechanic updated successfully.');
    }

    public function destroy(Mechanic $mechanic): RedirectResponse
    {
        Gate::authorize('delete', $mechanic);

        if ($mechanic->bookings()->exists()) {
            return redirect()->route('mechanics.index')->with('error', 'Cannot delete mechanic. Reassign active bookings first.');
        }

        $name = $mechanic->name;
        $empId = $mechanic->employee_id;
        $mechanic->delete();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'DELETE_MECHANIC',
            'description' => "Deleted mechanic: {$name} (ID: {$empId})",
            'properties' => ['name' => $name, 'employee_id' => $empId]
        ]);

        return redirect()->route('mechanics.index')->with('success', 'Mechanic deleted successfully.');
    }
}
