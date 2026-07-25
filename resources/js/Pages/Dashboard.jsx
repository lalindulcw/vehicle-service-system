import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Calendar, 
    Play, 
    AlertTriangle, 
    CircleDollarSign, 
    ArrowUpRight, 
    Clock, 
    User, 
    Car,
    Activity
} from 'lucide-react';

export default function Dashboard({ stats, lowStockParts, recentBookings, revenueData }) {
    // Format currency to LKR
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Calculate maximum amount for chart scaling
    const maxAmount = Math.max(...revenueData.map(d => d.amount), 1000);

    return (
        <AuthenticatedLayout
            header="Dashboard Overview"
        >
            <Head title="Dashboard" />

            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Bookings Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-slate-400">Today's Bookings</span>
                        <div className="bg-indigo-50 dark:bg-indigo-950 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400">
                            <Calendar className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold">{stats.todays_bookings}</div>
                </div>

                {/* Active Jobs Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-slate-400">Active Jobs</span>
                        <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400">
                            <Play className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold">{stats.active_jobs}</div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-slate-400">Low Stock Alerts</span>
                        <div className={`p-3 rounded-2xl ${
                            stats.low_stock_alerts > 0 
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 animate-pulse' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold">{stats.low_stock_alerts}</div>
                </div>

                {/* Daily Revenue */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-slate-400">Daily Revenue</span>
                        <div className="bg-violet-50 dark:bg-violet-950 p-3 rounded-2xl text-violet-600 dark:text-violet-400">
                            <CircleDollarSign className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold truncate">{formatCurrency(stats.daily_revenue)}</div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Trend Graph */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Revenue Trend</h3>
                            <p className="text-xs text-slate-400">Last 7 days daily earnings</p>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-950 px-3 py-1.5 rounded-xl text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 text-xs font-semibold">
                            <Activity className="h-4 w-4" />
                            Trend Active
                        </div>
                    </div>

                    {/* SVG Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2">
                        {revenueData.map((d, index) => {
                            // Calculate height percentage
                            const heightPercent = maxAmount > 0 ? (d.amount / maxAmount) * 100 : 0;
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                                    {/* Tooltip on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] sm:text-xs px-2.5 py-1.5 rounded-xl absolute -translate-y-16 pointer-events-none shadow-lg z-10 font-bold whitespace-nowrap">
                                        {formatCurrency(d.amount)}
                                    </div>
                                    {/* Chart Bar */}
                                    <div 
                                        style={{ height: `${Math.max(heightPercent, 4)}%` }} 
                                        className={`w-full rounded-t-xl transition-all duration-500 hover:brightness-110 ${
                                            d.amount > 0 
                                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-lg shadow-indigo-500/20' 
                                            : 'bg-slate-100 dark:bg-slate-800'
                                        }`}
                                    />
                                    {/* X-axis Label */}
                                    <span className="text-[10px] sm:text-xs font-semibold text-slate-400 mt-3 truncate w-full text-center">
                                        {d.date}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Low Stock Warning Container */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Low Stock Alerts
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3.5 custom-scrollbar pr-1 max-h-[250px]">
                        {lowStockParts.length > 0 ? (
                            lowStockParts.map(part => (
                                <div key={part.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                                    <div>
                                        <h4 className="text-sm font-semibold truncate max-w-[140px]">{part.name}</h4>
                                        <p className="text-xs text-slate-400 font-mono">{part.sku}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                                            {part.stock} left
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                                <span className="text-sm font-medium">All parts are well-stocked.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bookings Queue */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold">Upcoming Schedule Queue</h3>
                        <p className="text-xs text-slate-400">List of scheduled maintenance tasks</p>
                    </div>
                    <Link 
                        href={route('bookings.index')} 
                        className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                        View Calendar
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="pb-3 pl-4">Time</th>
                                <th className="pb-3">Customer</th>
                                <th className="pb-3">Vehicle</th>
                                <th className="pb-3">Mechanic</th>
                                <th className="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentBookings.length > 0 ? (
                                recentBookings.map((booking) => (
                                    <tr key={booking.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="py-4 pl-4 font-semibold text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-indigo-500" />
                                                {new Date(booking.scheduled_at).toLocaleString('en-LK', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-400" />
                                                {booking.customer.name}
                                            </div>
                                        </td>
                                        <td className="py-4 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Car className="h-4 w-4 text-slate-400" />
                                                {booking.vehicle.registration_no}
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-500 dark:text-slate-400">
                                            {booking.mechanic ? booking.mechanic.name : 'Unassigned'}
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                                booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                                booking.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                                                booking.status === 'cancelled' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                            }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${
                                                    booking.status === 'completed' ? 'bg-emerald-500' :
                                                    booking.status === 'in_progress' ? 'bg-indigo-500' :
                                                    booking.status === 'cancelled' ? 'bg-rose-500' :
                                                    'bg-amber-500'
                                                }`} />
                                                {booking.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-400 font-medium">
                                        No bookings scheduled for today.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
