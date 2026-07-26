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
    Info
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

    // 3. Next month leading days to complete grid (multiples of 7, let's pad to 42 items for 6 weeks)
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push({
            day: i,
            isCurrentMonth: false,
            dateObj: new Date(year, month + 1, i)
        });
    }

    // Filter events for a specific day
    const getEventsForDay = (date) => {
        return events.filter(e => {
            const eventDate = new Date(e.start);
            return eventDate.getFullYear() === date.getFullYear() &&
                   eventDate.getMonth() === date.getMonth() &&
                   eventDate.getDate() === date.getDate();
        });
    };

    return (
        <AuthenticatedLayout header="Schedule Calendar">
            <Head title="Calendar" />

            {/* Header controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 p-2.5 rounded-xl">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{monthNames[month]} {year}</h2>
                        <p className="text-xs text-slate-400">Interactive service booking timeline</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={prevMonth}
                        className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={() => setCurrentDate(new Date())}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Today
                    </button>
                    <button 
                        onClick={nextMonth}
                        className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Day Names Row */}
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    {dayNames.map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-slate-200 dark:divide-slate-800 border-l border-t border-transparent">
                    {calendarDays.map((dayItem, idx) => {
                        const dayEvents = getEventsForDay(dayItem.dateObj);
                        const isToday = new Date().toDateString() === dayItem.dateObj.toDateString();

                        return (
                            <div 
                                key={idx} 
                                className={`min-h-[110px] p-2 flex flex-col transition-colors ${
                                    dayItem.isCurrentMonth 
                                    ? 'bg-transparent' 
                                    : 'bg-slate-50/40 dark:bg-slate-950/20 text-slate-400'
                                }`}
                            >
                                {/* Date Number */}
                                <div className="flex justify-end mb-1">
                                    <span className={`text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full ${
                                        isToday 
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                                        : 'text-slate-500'
                                    }`}>
                                        {dayItem.day}
                                    </span>
                                </div>

                                {/* Events List */}
                                <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-0.5 max-h-[80px]">
                                    {dayEvents.map(event => (
                                        <button
                                            key={event.id}
                                            onClick={() => setSelectedEvent(event)}
                                            className={`w-full text-left px-2 py-1 rounded-lg text-[10px] font-bold truncate transition-all hover:scale-[1.02] ${
                                                event.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                                event.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                                                event.status === 'cancelled' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                            }`}
                                        >
                                            {event.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Detail Modal popup */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-indigo-500" />
                                <h3 className="font-bold text-base">Booking Details</h3>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4 text-sm">
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time & Date</span>
                                <div className="flex items-center gap-2 font-semibold">
                                    <Clock className="h-4.5 w-4.5 text-indigo-500" />
                                    {new Date(selectedEvent.start).toLocaleString('en-LK', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </div>
                            </div>

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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mechanic</span>
                                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                                        <Wrench className="h-4.5 w-4.5 text-slate-400" />
                                        {selectedEvent.mechanic}
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize mt-1 ${
                                        selectedEvent.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                        selectedEvent.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                                        selectedEvent.status === 'cancelled' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                        'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                    }`}>
                                        {selectedEvent.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            {selectedEvent.notes && (
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Notes / Symptoms</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 leading-relaxed">
                                        {selectedEvent.notes}
                                    </p>
                                </div>
                            )}

                            {/* Footer actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href={route('bookings.index', { search: selectedEvent.title.split(' ')[0] })}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold text-center block transition-colors"
                                >
                                    Manage Job Card
                                </Link>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850"
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
