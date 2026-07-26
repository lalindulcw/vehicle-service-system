<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Gate;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        // Only Admins can view activity logs!
        if (!auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized action. Only system administrators can view the audit trail.');
        }

        $query = ActivityLog::with('user')->orderBy('id', 'desc');

        // Search logs
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($sub) use ($search) {
                      $sub->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $logs = $query->paginate(15)->withQueryString();

        return Inertia::render('Logs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search'])
        ]);
    }
}
