<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Part;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $today = Carbon::today();

        // 1. Today's bookings count
        $todaysBookingsQuery = Booking::whereDate('scheduled_at', $today);
        if (auth()->user()->hasRole('Mechanic')) {
            $todaysBookingsQuery->whereHas('mechanic', function ($q) {
                $q->where('name', auth()->user()->name);
            });
        }
        $todaysBookingsCount = $todaysBookingsQuery->count();

        // 2. Active jobs (status in_progress)
        $activeJobsQuery = Booking::where('status', 'in_progress');
        if (auth()->user()->hasRole('Mechanic')) {
            $activeJobsQuery->whereHas('mechanic', function ($q) {
                $q->where('name', auth()->user()->name);
            });
        }
        $activeJobsCount = $activeJobsQuery->count();

        // 3. Low stock alerts (stock < min_stock_threshold)
        $lowStockParts = Part::whereColumn('stock', '<', 'min_stock_threshold')
            ->select('id', 'name', 'sku', 'stock', 'min_stock_threshold')
            ->get();
        $lowStockCount = $lowStockParts->count();

        // 4. Daily revenue summary (Paid invoices today)
        $dailyRevenue = Invoice::where('status', 'paid')
            ->whereDate('paid_at', $today)
            ->sum('total_amount');

        // Recent bookings (limited to 5)
        $recentBookingsQuery = Booking::with(['customer', 'vehicle', 'mechanic'])
            ->orderBy('scheduled_at', 'asc');
        if (auth()->user()->hasRole('Mechanic')) {
            $recentBookingsQuery->whereHas('mechanic', function ($q) {
                $q->where('name', auth()->user()->name);
            });
        } else {
            $recentBookingsQuery->whereDate('scheduled_at', '>=', $today);
        }
        $recentBookings = $recentBookingsQuery->limit(5)->get();

        // Revenue graph data (last 7 days of paid invoices)
        $revenueData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $revenue = Invoice::where('status', 'paid')
                ->whereDate('paid_at', $date)
                ->sum('total_amount');
            
            $revenueData[] = [
                'date' => $date->format('M d'),
                'amount' => (float)$revenue
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'todays_bookings' => $todaysBookingsCount,
                'active_jobs' => $activeJobsCount,
                'low_stock_alerts' => $lowStockCount,
                'daily_revenue' => (float)$dailyRevenue,
            ],
            'lowStockParts' => $lowStockParts,
            'recentBookings' => $recentBookings,
            'revenueData' => $revenueData,
        ]);
    }
}
