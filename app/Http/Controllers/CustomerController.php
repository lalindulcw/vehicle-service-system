<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Http\Requests\CustomerRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Customer::class);

        $query = Customer::query();

        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $customers = $query->paginate(10)->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
            'stats' => [
                'total' => Customer::count(),
                'recent' => Customer::where('created_at', '>=', now()->subDays(7))->count(),
                'has_notes' => Customer::whereNotNull('notes')->where('notes', '!=', '')->count(),
            ]
        ]);
    }

    public function store(CustomerRequest $request): RedirectResponse
    {
        Gate::authorize('create', Customer::class);

        $customer = Customer::create($request->validated());

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'CREATE_CUSTOMER',
            'description' => "Created customer: {$customer->name}",
            'properties' => ['customer_id' => $customer->id]
        ]);

        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
    }

    public function update(CustomerRequest $request, Customer $customer): RedirectResponse
    {
        Gate::authorize('update', $customer);

        $customer->update($request->validated());

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'UPDATE_CUSTOMER',
            'description' => "Updated customer: {$customer->name}",
            'properties' => ['customer_id' => $customer->id]
        ]);

        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        Gate::authorize('delete', $customer);

        // Check if customer has vehicles
        if ($customer->vehicles()->exists()) {
            return redirect()->route('customers.index')->with('error', 'Cannot delete customer. Delete associated vehicles first.');
        }

        $customerName = $customer->name;
        $customer->delete();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'DELETE_CUSTOMER',
            'description' => "Deleted customer: {$customerName}",
            'properties' => ['customer_name' => $customerName]
        ]);

        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
    }
}
