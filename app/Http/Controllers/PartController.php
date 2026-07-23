<?php

namespace App\Http\Controllers;

use App\Models\Part;
use App\Http\Requests\PartRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class PartController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Part::class);

        $query = Part::query();

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $parts = $query->paginate(10)->withQueryString();

        return Inertia::render('Parts/Index', [
            'parts' => $parts,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
        ]);
    }

    public function store(PartRequest $request): RedirectResponse
    {
        Gate::authorize('create', Part::class);

        $part = Part::create($request->validated());

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'CREATE_PART',
            'description' => "Added part: {$part->name} (SKU: {$part->sku}) to inventory.",
            'properties' => ['part_id' => $part->id, 'sku' => $part->sku]
        ]);

        return redirect()->route('parts.index')->with('success', 'Part added to inventory successfully.');
    }

    public function update(PartRequest $request, Part $part): RedirectResponse
    {
        Gate::authorize('update', $part);

        $oldStock = $part->stock;
        $part->update($request->validated());

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'UPDATE_PART',
            'description' => "Updated part: {$part->name} (Stock changed from {$oldStock} to {$part->stock}).",
            'properties' => ['part_id' => $part->id, 'old_stock' => $oldStock, 'new_stock' => $part->stock]
        ]);

        return redirect()->route('parts.index')->with('success', 'Part updated successfully.');
    }

    public function destroy(Part $part): RedirectResponse
    {
        Gate::authorize('delete', $part);

        // Check if part is used in any booking
        if (\DB::table('booking_parts')->where('part_id', $part->id)->exists()) {
            return redirect()->route('parts.index')->with('error', 'Cannot delete part. It has been used in service bookings.');
        }

        $name = $part->name;
        $sku = $part->sku;
        $part->delete();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'DELETE_PART',
            'description' => "Deleted part: {$name} (SKU: {$sku})",
            'properties' => ['name' => $name, 'sku' => $sku]
        ]);

        return redirect()->route('parts.index')->with('success', 'Part deleted from inventory.');
    }
}
