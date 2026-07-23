import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Calendar, 
    Play, 
    AlertTriangle, 
    CircleDollarSign, 
    ArrowUpRight, 
    Clock, 
    User, 
    Car,
    Activity,
    Boxes,
    Wrench,
    TrendingUp
} from 'lucide-react';

export default function Dashboard({ stats, lowStockParts, recentBookings, revenueData }) {
    const { auth } = usePage().props;
    
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
        <AuthenticatedLayout header="Workshop Dashboard Overview">
            <Head title="Dashboard" />

            {/* Welcome Banner Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-sm mb-8 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-1 z-10 text-center sm:text-left">
                    <h2 className="text-lg font-black tracking-wide">Welcome back, {auth.user.name}!</h2>
                    <p className="text-xs text-indigo-200/80 font-semibold leading-relaxed">
                        VMS Pro Service Hub is fully synchronized. Keep track of workshop jobs, parts stock, and daily billing revenue.
                    </p>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-2xl text-[10px] font-bold text-indigo-400 z-10 uppercase tracking-widest">
                    {new Date().toLocaleDateString('en-LK', { dateStyle: 'medium' })}
                </div>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Bookings Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Bookings</span>
                        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.todays_bookings}</div>
                </div>

                {/* Active Jobs Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Jobs</span>
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400">
                            <Play className="h-5 w-5 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.active_jobs}</div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Alerts</span>
                        <div className={`p-3 rounded-2xl ${
                            stats.low_stock_alerts > 0 
                            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse' 
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                        }`}>
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">{stats.low_stock_alerts}</div>
                </div>

                {/* Daily Revenue */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Revenue</span>
                        <div className="bg-violet-50 dark:bg-violet-500/10 p-3 rounded-2xl text-violet-600 dark:text-violet-400">
                            <CircleDollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-emerald-500 truncate">{formatCurrency(stats.daily_revenue)}</div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Trend Graph */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Revenue Trend</h3>
                            <p className="text-xs text-slate-400">Last 7 days daily earnings from invoicing</p>
                        </div>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl text-emerald-500 flex items-center gap-1.5 text-xs font-bold">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Trend Syncing
                        </div>
                    </div>

                    {/* SVG Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2">
                        {revenueData.map((d, index) => {
                            // Calculate height percentage
                            const heightPercent = maxAmount > 0 ? (d.amount / maxAmount) * 100 : 0;
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                                    {/* Tooltip on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] px-2.5 py-1.5 rounded-xl absolute -translate-y-16 pointer-events-none shadow-lg z-10 font-bold whitespace-nowrap border border-slate-850">
                                        {formatCurrency(d.amount)}
                                    </div>
                                    {/* Chart Bar */}
                                    <div 
                                        style={{ height: `${Math.max(heightPercent, 4)}%` }} 
                                        className={`w-full rounded-t-xl transition-all duration-500 hover:brightness-110 ${
                                            d.amount > 0 
                                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-md shadow-indigo-500/10' 
                                            : 'bg-slate-50 dark:bg-slate-850'
                                        }`}
                                    />
                                    {/* X-axis Label */}
                                    <span className="text-[10px] font-bold text-slate-400 mt-3 truncate w-full text-center">
                                        {d.date}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Low Stock Warning Container */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
                        Low Stock Alerts
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3.5 custom-scrollbar pr-1 max-h-[250px]">
                        {lowStockParts.length > 0 ? (
                            lowStockParts.map(part => {
                                const stockPercent = (part.stock / part.min_stock_threshold) * 100;
                                return (
                                    <div key={part.id} className="p-4 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-xs font-black truncate max-w-[140px] text-slate-850 dark:text-slate-100">{part.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-mono">{part.sku}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                part.stock === 0 
                                                ? 'bg-rose-500/10 text-rose-500 animate-pulse' 
                                                : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                                {part.stock === 0 ? 'Out of Stock' : `${part.stock} Left`}
                                            </span>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                                            <div 
                                                className={`h-1.5 rounded-full ${part.stock === 0 ? 'w-0' : 'bg-amber-500'}`}
                                                style={{ width: `${Math.min(stockPercent, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10 space-y-2">
                                <Boxes className="h-7 w-7 text-slate-300" />
                                <span className="text-xs font-semibold italic text-slate-400">All warehouse parts are well-stocked.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bookings Queue */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Upcoming Schedule Queue</h3>
                        <p className="text-xs text-slate-400">List of scheduled maintenance tasks</p>
                    </div>
                    <Link 
                        href={route('bookings.index')} 
                        className="text-xs font-bold text-indigo-500 hover:text-indigo-650 flex items-center gap-1 hover:underline"
                    >
                        View Bookings Manager
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-250 dark:border-slate-800 text-slate-450 text-xs font-extrabold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/20">
                                <th className="py-3.5 pl-4">Scheduled Time</th>
                                <th className="py-3.5">Customer</th>
                                <th className="py-3.5">Vehicle</th>
                                <th className="py-3.5">Mechanic</th>
                                <th className="py-3.5 pl-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentBookings.length > 0 ? (
                                recentBookings.map((booking) => (
                                    <tr key={booking.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                        <td className="py-4 pl-4 font-semibold text-slate-650 dark:text-slate-350">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-indigo-500" />
                                                {new Date(booking.scheduled_at_formatted ? booking.scheduled_at_formatted.replace(' ', 'T') : booking.scheduled_at).toLocaleString('en-LK', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4 font-bold text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-405 shrink-0" />
                                                {booking.customer.name}
                                            </div>
                                        </td>
                                        <td className="py-4 font-semibold">
                                            <div className="flex items-center gap-2 text-indigo-500 uppercase font-mono bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 inline-block text-xs">
                                                <Car className="h-3.5 w-3.5 text-slate-400 shrink-0 inline mr-1" />
                                                {booking.vehicle.registration_no}
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-650 dark:text-slate-350 font-medium">
                                            {booking.mechanic ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Wrench className="h-4 w-4 text-slate-400 shrink-0" />
                                                    {booking.mechanic.name}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="py-4 pl-4">
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
                                    <td colSpan="5" className="text-center py-8 text-slate-400 font-semibold italic">
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
