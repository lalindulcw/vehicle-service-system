import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    User, 
    Car, 
    Calendar as CalendarIcon,
    Wrench,
    Plus,
    X,
    Info,
    CheckCircle2,
    AlertCircle,
    ArrowLeft
} from 'lucide-react';

export default function Calendar({ events }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Date navigation helpers
    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Calculate calendar grid days
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // day of week of 1st day (0 = Sun, 6 = Sat)
    const totalDays = new Date(year, month + 1, 0).getDate(); // total days in current month
    const prevTotalDays = new Date(year, month, 0).getDate(); // total days in prev month

    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Populate calendar grid days array
    const calendarDays = [];

    // 1. Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        calendarDays.push({
            day: prevTotalDays - i,
            isCurrentMonth: false,
            dateObj: new Date(year, month - 1, prevTotalDays - i)
        });
    }

    // 2. Current month days
    for (let i = 1; i <= totalDays; i++) {
        calendarDays.push({
            day: i,
            isCurrentMonth: true,
            dateObj: new Date(year, month, i)
        });
    }

    // 3. Next month leading days to complete grid (pad to 42 items for 6 weeks grid)
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push({
            day: i,
            isCurrentMonth: false,
            dateObj: new Date(year, month + 1, i)
        });
    }

    // Format Date object to YYYY-MM-DD local string (Timezone-safe)
    const formatDateKey = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // Filter events for a specific day
    const getEventsForDay = (date) => {
        const dateKey = formatDateKey(date);
        return events.filter(e => e.date_str === dateKey);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            case 'in_progress':
                return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
            case 'cancelled':
                return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
            default:
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
        }
    };

    return (
        <AuthenticatedLayout header="Workshop Schedule Calendar">
            <Head title="Calendar" />

            {/* Back to list and header */}
            <div className="flex justify-between items-center mb-6">
                <Link
                    href={route('bookings.index')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Bookings
                </Link>
            </div>

            {/* Header controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/10">
                        <CalendarIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">{monthNames[month]} {year}</h2>
                        <p className="text-xs text-slate-400 font-bold block pt-0.5">Interactive service booking planner</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={prevMonth}
                        className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 transition-colors"
                        title="Previous Month"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={() => setCurrentDate(new Date())}
                        className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                        Today
                    </button>
                    <button 
                        onClick={nextMonth}
                        className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 transition-colors"
                        title="Next Month"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8 animate-in fade-in duration-300">
                {/* Day Names Row */}
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20">
                    {dayNames.map(day => (
                        <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-slate-200 dark:divide-slate-800 border-l border-t border-transparent">
                    {calendarDays.map((dayItem, idx) => {
                        const dayEvents = getEventsForDay(dayItem.dateObj);
                        const isToday = formatDateKey(new Date()) === formatDateKey(dayItem.dateObj);

                        return (
                            <div 
                                key={idx} 
                                className={`min-h-[120px] p-2.5 flex flex-col justify-between transition-colors hover:bg-slate-50/30 dark:hover:bg-slate-800/10 ${
                                    dayItem.isCurrentMonth 
                                    ? 'bg-transparent' 
                                    : 'bg-slate-50/40 dark:bg-slate-950/10 text-slate-400 opacity-60'
                                }`}
                            >
                                {/* Date Number */}
                                <div className="flex justify-end">
                                    <span className={`text-xs font-black h-7 w-7 flex items-center justify-center rounded-xl transition-all ${
                                        isToday 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105' 
                                        : 'text-slate-500 dark:text-slate-400'
                                    }`}>
                                        {dayItem.day}
                                    </span>
                                </div>

                                {/* Events List */}
                                <div className="flex-1 overflow-y-auto space-y-1.5 mt-2 custom-scrollbar pr-0.5 max-h-[85px]">
                                    {dayEvents.map(event => (
                                        <button
                                            key={event.id}
                                            onClick={() => setSelectedEvent(event)}
                                            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[10px] font-bold truncate transition-all border hover:scale-[1.02] flex items-center gap-1.5 ${getStatusStyles(event.status)}`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                                event.status === 'completed' ? 'bg-emerald-500' :
                                                event.status === 'in_progress' ? 'bg-indigo-500' :
                                                event.status === 'cancelled' ? 'bg-rose-500' :
                                                'bg-amber-500'
                                            }`} />
                                            <span className="truncate">{event.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Detail Modal Popup */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-indigo-500" />
                                <h3 className="font-bold text-base">Booking Summary</h3>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4 text-sm">
                            {/* Schedule Date Time */}
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Scheduled Date & Time</span>
                                <div className="flex items-center gap-2 font-semibold">
                                    <Clock className="h-4.5 w-4.5 text-indigo-500" />
                                    {new Date(selectedEvent.start).toLocaleString('en-LK', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </div>
                            </div>

                            {/* Customer & Vehicle */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Customer</span>
                                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                                        <User className="h-4.5 w-4.5 text-slate-400" />
                                        {selectedEvent.customer}
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Vehicle</span>
                                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                                        <Car className="h-4.5 w-4.5 text-slate-400" />
                                        {selectedEvent.vehicle}
                                    </div>
                                </div>
                            </div>

                            {/* Mechanic & Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Mechanic</span>
                                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                                        <Wrench className="h-4.5 w-4.5 text-slate-400" />
                                        {selectedEvent.mechanic}
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Job Status</span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold capitalize mt-1 border ${getStatusStyles(selectedEvent.status)}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${
                                            selectedEvent.status === 'completed' ? 'bg-emerald-500' :
                                            selectedEvent.status === 'in_progress' ? 'bg-indigo-500' :
                                            selectedEvent.status === 'cancelled' ? 'bg-rose-500' :
                                            'bg-amber-500'
                                        }`} />
                                        {selectedEvent.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            {/* Customer description note */}
                            {selectedEvent.notes && (
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Symptoms / Notes</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-850 leading-relaxed italic">
                                        "{selectedEvent.notes}"
                                    </p>
                                </div>
                            )}

                            {/* Footer links */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href={route('bookings.index', { search: selectedEvent.title.split(' ')[0] })}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold text-center block transition-all hover:scale-[1.02] shadow-lg shadow-indigo-600/20"
                                >
                                    Manage Job Card
                                </Link>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
