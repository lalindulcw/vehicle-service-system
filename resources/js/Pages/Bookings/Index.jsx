import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight, 
    ArrowUpDown,
    X,
    Calendar,
    Clock,
    User,
    Car,
    Wrench,
    Settings,
    DollarSign,
    PlusCircle,
    MinusCircle,
    Grid,
    List,
    AlertCircle,
    Info,
    CheckCircle2
} from 'lucide-react';

export default function Index({ bookings, customers, vehicles, mechanics, parts, filters, stats }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const canModify = user.roles.includes('Admin') || user.roles.includes('Service Advisor');
    const isMechanic = user.roles.includes('Mechanic');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    // State to hold parts assigned in modal
    const [selectedParts, setSelectedParts] = useState([]);

    const { data, setData, post, put, errors, processing, reset, clearErrors } = useForm({
        customer_id: '',
        vehicle_id: '',
        mechanic_id: '',
        scheduled_at: '',
        status: 'pending',
        labor_cost: '0.00',
        notes: '',
        parts: [] // Array of { part_id, quantity }
    });

    const openCreateModal = () => {
        setEditingBooking(null);
        setSelectedParts([]);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (booking) => {
        setEditingBooking(booking);
        
        // Map pre-assigned parts
        const mappedParts = booking.parts.map(p => ({
            part_id: p.id,
            quantity: p.pivot.quantity,
            price: p.pivot.unit_price,
            name: p.name
        }));
        setSelectedParts(mappedParts);

        setData({
            customer_id: booking.customer_id,
            vehicle_id: booking.vehicle_id,
            mechanic_id: booking.mechanic_id || '',
            scheduled_at: (booking.scheduled_at_formatted || booking.scheduled_at).replace(' ', 'T').substring(0, 16), // format to datetime-local
            status: booking.status,
            labor_cost: booking.labor_cost,
            notes: booking.notes || '',
            parts: mappedParts
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBooking(null);
        setSelectedParts([]);
        reset();
    };

    const handlePartAdd = (partId) => {
        if (!partId) return;
        const part = parts.find(p => p.id === parseInt(partId));
        if (!part) return;

        // Check if already added
        if (selectedParts.some(p => p.part_id === part.id)) {
            return;
        }

        const newParts = [...selectedParts, { part_id: part.id, name: part.name, quantity: 1, price: part.price }];
        setSelectedParts(newParts);
        setData('parts', newParts);
    };

    const handlePartQuantityChange = (partId, qty) => {
        const updated = selectedParts.map(p => {
            if (p.part_id === partId) {
                return { ...p, quantity: Math.max(parseInt(qty) || 1, 1) };
            }
            return p;
        });
        setSelectedParts(updated);
        setData('parts', updated);
    };

    const handlePartRemove = (partId) => {
        const updated = selectedParts.filter(p => p.part_id !== partId);
        setSelectedParts(updated);
        setData('parts', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Prepare submitted payload
        const payload = {
            ...data,
            parts: selectedParts.map(p => ({ part_id: p.part_id, quantity: p.quantity, price: p.price }))
        };

        if (editingBooking) {
            put(route('bookings.update', editingBooking.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('bookings.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleStatusChange = (id, newStatus) => {
        router.post(route('bookings.status', id), { status: newStatus });
    };

    const runSearch = (e) => {
        e.preventDefault();
        router.get(route('bookings.index'), { 
            search: searchVal,
            status: selectedStatus,
            sort_field: filters.sort_field,
            sort_direction: filters.sort_direction
        }, { preserveState: true });
    };

    const sortBy = (field) => {
        const direction = filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        router.get(route('bookings.index'), { 
            search: searchVal,
            status: selectedStatus,
            sort_field: field,
            sort_direction: direction
        }, { preserveState: true });
    };

    const filterByStatus = (status) => {
        setSelectedStatus(status);
        router.get(route('bookings.index'), { 
            search: searchVal,
            status: status,
            sort_field: filters.sort_field,
            sort_direction: filters.sort_direction
        }, { preserveState: true });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Filter vehicles by selected customer in form
    const filteredVehicles = data.customer_id 
        ? vehicles.filter(v => v.customer_id === parseInt(data.customer_id))
        : [];

    return (
        <AuthenticatedLayout header="Service Bookings & Job Cards">
            <Head title="Bookings" />

            {/* Premium Mini-Statistics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8 animate-in fade-in duration-350">
                {/* Stat 1: Total Jobs */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</h4>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center z-10">
                        <Calendar className="h-4.5 w-4.5" />
                    </div>
                </div>

                {/* Stat 2: Pending */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending Queue</span>
                        <h4 className="text-2xl font-black text-amber-500">{stats.pending}</h4>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center z-10">
                        <Clock className="h-4.5 w-4.5" />
                    </div>
                </div>

                {/* Stat 3: In Progress */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">In Progress</span>
                        <h4 className="text-2xl font-black text-indigo-500">{stats.in_progress}</h4>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center z-10">
                        <Wrench className="h-4.5 w-4.5" />
                    </div>
                </div>

                {/* Stat 4: Completed */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                        <h4 className="text-2xl font-black text-emerald-500">{stats.completed}</h4>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center z-10">
                        <CheckCircle2 className="h-4.5 w-4.5" />
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                
                {/* Search Bar & Filter by Status */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-xl">
                    <form onSubmit={runSearch} className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search reg no or customer name..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                        <Search className="h-5 w-5 text-slate-400 absolute left-4 top-3.5" />
                        {searchVal && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchVal('');
                                    router.get(route('bookings.index'), { status: selectedStatus }, { preserveState: true });
                                }}
                                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </form>

                    <select
                        value={selectedStatus}
                        onChange={(e) => filterByStatus(e.target.value)}
                        className="py-3 pl-4 pr-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* View Toggles & Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    
                    {/* Calendar link */}
                    <Link
                        href={route('bookings.calendar')}
                        className="p-3 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-500 dark:hover:text-white bg-white dark:bg-slate-900 text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                        <Calendar className="h-4.5 w-4.5" />
                        Calendar View
                    </Link>

                    {/* Grid/Table Switcher */}
                    <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex gap-1 border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-xl transition-all ${
                                viewMode === 'grid' 
                                ? 'bg-white dark:bg-slate-800 text-indigo-500 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                            }`}
                            title="Grid Card View"
                        >
                            <Grid className="h-4.5 w-4.5" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-xl transition-all ${
                                viewMode === 'table' 
                                ? 'bg-white dark:bg-slate-800 text-indigo-500 shadow-sm' 
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                            }`}
                            title="List Table View"
                        >
                            <List className="h-4.5 w-4.5" />
                        </button>
                    </div>

                    {canModify && (
                        <button
                            onClick={openCreateModal}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                        >
                            <Plus className="h-4.5 w-4.5" />
                            Book Service
                        </button>
                    )}
                </div>
            </div>

            {/* Grid View Mode */}
            {viewMode === 'grid' && (
                <>
                    {bookings.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-300">
                            {bookings.data.map((booking) => {
                                const hasInvoice = booking.invoice !== null;
                                return (
                                    <div 
                                        key={booking.id}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm hover:shadow-lg dark:hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                                    >
                                        <div className="space-y-4">
                                            {/* Header: Date Badge & Status */}
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                    <Clock className="h-4 w-4 text-indigo-500" />
                                                    <span>
                                                        {new Date(booking.scheduled_at_formatted ? booking.scheduled_at_formatted.replace(' ', 'T') : booking.scheduled_at).toLocaleString('en-LK', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>

                                                {/* Status selector directly on card */}
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold capitalize border-0 cursor-pointer focus:ring-0 ${
                                                        booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                                        booking.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                                                        booking.status === 'cancelled' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                        'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                    }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>

                                            {/* Vehicle & Customer details */}
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Car className="h-4 w-4 text-slate-400" />
                                                    <h3 className="font-extrabold text-sm tracking-wider text-indigo-500 uppercase bg-indigo-500/5 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/10 inline-block">
                                                        {booking.vehicle.registration_no}
                                                    </h3>
                                                </div>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                                                    {booking.vehicle.make} {booking.vehicle.model}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium">
                                                    Owner: {booking.customer.name}
                                                </p>
                                            </div>

                                            {/* Mechanic Assignment */}
                                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                                                <div className="flex justify-between items-center">
                                                    <span className="flex items-center gap-1 text-slate-400 font-medium">
                                                        <Wrench className="h-3.5 w-3.5" />
                                                        Mechanic:
                                                    </span>
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                        {booking.mechanic ? booking.mechanic.name : 'Unassigned'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Labor Cost */}
                                            <div className="flex justify-between items-center text-xs pt-1">
                                                <span className="flex items-center gap-1 text-slate-400 font-medium">
                                                    <DollarSign className="h-3.5 w-3.5" />
                                                    Labor Cost:
                                                </span>
                                                <span className="font-extrabold text-slate-900 dark:text-white">
                                                    {formatCurrency(booking.labor_cost)}
                                                </span>
                                            </div>

                                            {/* Parts Utilized */}
                                            <div className="pt-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850">
                                                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Parts Utilized</span>
                                                {booking.parts.length > 0 ? (
                                                    <div className="space-y-1 max-h-[80px] overflow-y-auto pr-0.5 custom-scrollbar">
                                                        {booking.parts.map(p => (
                                                            <div key={p.id} className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                                <span className="truncate max-w-[130px]">• {p.name}</span>
                                                                <span className="font-bold">x{p.pivot.quantity}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 italic font-medium block">No spare parts attached</span>
                                                )}
                                            </div>

                                            {/* Notes / customer complaints */}
                                            {booking.notes && (
                                                <div className="text-[11px] text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 italic leading-relaxed">
                                                    "{booking.notes}"
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        {canModify && (
                                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-855 flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openEditModal(booking)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 hover:text-indigo-600 rounded-xl transition-all"
                                                    title="Edit Booking Card"
                                                >
                                                    <Edit className="h-4.5 w-4.5" />
                                                </button>
                                                {!hasInvoice && (
                                                    <button
                                                        onClick={() => setBookingToDelete(booking)}
                                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 text-rose-500 hover:text-rose-600 rounded-xl transition-all"
                                                        title="Delete Booking Record"
                                                    >
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Premium Empty State */
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center max-w-xl mx-auto mb-8 shadow-sm flex flex-col items-center space-y-4">
                            <div className="h-16 w-16 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/10">
                                <Calendar className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">No Service Bookings</h3>
                            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                                Schedule service bookings and job cards for customer vehicles. Assign tasks to available workshop mechanics, attach spare parts, and update progress live.
                            </p>
                            {canModify && (
                                <button
                                    onClick={openCreateModal}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                                >
                                    Create First Booking
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Table View Mode */}
            {viewMode === 'table' && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8 animate-in fade-in duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/20">
                                    <th className="py-4 pl-6 cursor-pointer" onClick={() => sortBy('scheduled_at')}>
                                        <div className="flex items-center gap-1.5">
                                            Scheduled Time
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </div>
                                    </th>
                                    <th className="py-4">Vehicle & Owner</th>
                                    <th className="py-4">Assigned Mechanic</th>
                                    <th className="py-4 text-right">Labor Cost</th>
                                    <th className="py-4">Parts Utilized</th>
                                    <th className="py-4">Status</th>
                                    {canModify && <th className="py-4 pr-6 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {bookings.data.length > 0 ? (
                                    bookings.data.map((booking) => {
                                        const hasInvoice = booking.invoice !== null;
                                        return (
                                            <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors text-sm">
                                                <td className="py-4 pl-6 font-semibold">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4 text-indigo-500" />
                                                        {new Date(booking.scheduled_at_formatted ? booking.scheduled_at_formatted.replace(' ', 'T') : booking.scheduled_at).toLocaleString('en-LK', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                                        {booking.vehicle.registration_no}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {booking.customer.name} • {booking.vehicle.make} {booking.vehicle.model}
                                                    </div>
                                                </td>
                                                <td className="py-4 text-slate-650 dark:text-slate-300 font-semibold">
                                                    {booking.mechanic ? (
                                                        <div>
                                                            <div>{booking.mechanic.name}</div>
                                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                                                {booking.mechanic.specialization}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded-lg">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-right font-extrabold text-slate-900 dark:text-white">
                                                    {formatCurrency(booking.labor_cost)}
                                                </td>
                                                <td className="py-4">
                                                    {booking.parts.length > 0 ? (
                                                        <div className="space-y-0.5">
                                                            {booking.parts.map(p => (
                                                                <div key={p.id} className="text-xs text-slate-400 truncate max-w-[150px]">
                                                                    • {p.name} (x{p.pivot.quantity})
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">—</span>
                                                    )}
                                                </td>
                                                <td className="py-4">
                                                    <select
                                                        value={booking.status}
                                                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border-0 cursor-pointer focus:ring-0 ${
                                                            booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                                            booking.status === 'in_progress' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                                                            booking.status === 'cancelled' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                            'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                        }`}
                                                    >
                                                        <option value="pending" className="text-slate-905 bg-white">Pending</option>
                                                        <option value="in_progress" className="text-slate-905 bg-white">In Progress</option>
                                                        <option value="completed" className="text-slate-905 bg-white">Completed</option>
                                                        <option value="cancelled" className="text-slate-905 bg-white">Cancelled</option>
                                                    </select>
                                                </td>
                                                {canModify && (
                                                    <td className="py-4 pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditModal(booking)}
                                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 hover:text-indigo-600 rounded-xl transition-colors"
                                                            >
                                                                <Edit className="h-4.5 w-4.5" />
                                                            </button>
                                                            {!hasInvoice && (
                                                                <button
                                                                    onClick={() => setBookingToDelete(booking)}
                                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 text-rose-500 hover:text-rose-600 rounded-xl transition-colors"
                                                                >
                                                                    <Trash2 className="h-4.5 w-4.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={canModify ? 7 : 6} className="text-center py-16 text-slate-400">
                                            <div className="flex flex-col items-center space-y-2">
                                                <AlertCircle className="h-6 w-6 text-slate-300" />
                                                <span>No service bookings match the criteria.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            {bookings.links.length > 3 && (
                <div className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                    <span className="text-xs text-slate-400">
                        Showing {bookings.from} to {bookings.to} of {bookings.total} bookings
                    </span>
                    <div className="flex gap-2">
                        {bookings.links.map((link, idx) => {
                            if (link.label.includes('Previous')) {
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 ${!link.url && 'pointer-events-none opacity-50'}`}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Link>
                                );
                            }
                            if (link.label.includes('Next')) {
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 ${!link.url && 'pointer-events-none opacity-50'}`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                );
                            }
                            return (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                                        link.active 
                                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-855'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Custom Glassmorphic Deletion Modal */}
            {bookingToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="mx-auto h-16 w-16 bg-rose-50 dark:bg-rose-500/10 text-rose-600 flex items-center justify-center rounded-3xl border border-rose-500/10">
                            <Trash2 className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-extrabold text-lg">Confirm Delete Booking</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Are you sure you want to delete the service booking for vehicle <span className="font-bold text-slate-900 dark:text-white">"{bookingToDelete.vehicle.registration_no}"</span> scheduled at {new Date(bookingToDelete.scheduled_at).toLocaleDateString()}? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setBookingToDelete(null)}
                                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    router.delete(route('bookings.destroy', bookingToDelete.id), {
                                        onSuccess: () => setBookingToDelete(null)
                                    });
                                }}
                                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.02]"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create / Edit Drawer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-lg">
                                {editingBooking ? 'Edit Booking / Job Card' : 'Create Service Booking'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Error Alert Box */}
                        {errors.error && (
                            <div className="mx-6 mt-4 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold rounded-2xl flex items-center gap-2">
                                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                                <span>{errors.error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh] custom-scrollbar">
                            {/* Customer & Vehicle Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Customer</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={data.customer_id}
                                            onChange={e => {
                                                setData(d => ({ ...d, customer_id: e.target.value, vehicle_id: '' }));
                                            }}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500"
                                        >
                                            <option value="" className="dark:bg-slate-900">Select Customer</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.id} className="dark:bg-slate-900">{c.name}</option>
                                            ))}
                                        </select>
                                        <User className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.customer_id && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.customer_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Vehicle</label>
                                    <div className="relative">
                                        <select
                                            required
                                            disabled={!data.customer_id}
                                            value={data.vehicle_id}
                                            onChange={e => setData('vehicle_id', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500"
                                        >
                                            <option value="" className="dark:bg-slate-900">Select Vehicle</option>
                                            {filteredVehicles.map(v => (
                                                <option key={v.id} value={v.id} className="dark:bg-slate-900">{v.registration_no} ({v.make} {v.model})</option>
                                            ))}
                                        </select>
                                        <Car className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.vehicle_id && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.vehicle_id}</p>}
                                </div>
                            </div>

                            {/* Mechanic & Date Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assign Mechanic</label>
                                    <div className="relative">
                                        <select
                                            value={data.mechanic_id}
                                            onChange={e => setData('mechanic_id', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500"
                                        >
                                            <option value="" className="dark:bg-slate-900">Assign Later (Pending)</option>
                                            {mechanics.map(m => (
                                                <option key={m.id} value={m.id} className="dark:bg-slate-900">{m.name} ({m.specialization})</option>
                                            ))}
                                        </select>
                                        <Wrench className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.mechanic_id && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.mechanic_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Scheduled Date & Time</label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            required
                                            value={data.scheduled_at}
                                            onChange={e => setData('scheduled_at', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <Calendar className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.scheduled_at && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.scheduled_at}</p>}
                                </div>
                            </div>

                            {/* Status & Labor Cost */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Job Status</label>
                                    <div className="relative">
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500"
                                        >
                                            <option value="pending" className="dark:bg-slate-900">Pending</option>
                                            <option value="in_progress" className="dark:bg-slate-900">In Progress</option>
                                            <option value="completed" className="dark:bg-slate-900">Completed</option>
                                            <option value="cancelled" className="dark:bg-slate-900">Cancelled</option>
                                        </select>
                                        <Settings className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.status && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.status}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estimated Labor Cost (LKR)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={data.labor_cost}
                                            onChange={e => setData('labor_cost', e.target.value)}
                                            placeholder="0.00"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <DollarSign className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.labor_cost && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.labor_cost}</p>}
                                </div>
                            </div>

                            {/* Spare Parts Selection (Job Card feature) */}
                            <div className="border border-slate-200 dark:border-slate-850 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Utilized Spare Parts (Job Card)</label>
                                
                                <div className="flex gap-2 mb-4">
                                    <select
                                        id="modal-part-select"
                                        defaultValue=""
                                        onChange={(e) => {
                                            handlePartAdd(e.target.value);
                                            e.target.value = ""; // reset select
                                        }}
                                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-indigo-500"
                                    >
                                        <option value="" className="dark:bg-slate-900">Choose spare part to add...</option>
                                        {parts.map(p => (
                                            <option key={p.id} value={p.id} disabled={p.stock <= 0} className="dark:bg-slate-900">
                                                {p.name} - {formatCurrency(p.price)} (Stock: {p.stock})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Part Lines */}
                                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                                    {selectedParts.length > 0 ? (
                                        selectedParts.map((partLine) => (
                                            <div key={partLine.part_id} className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                                                <div className="font-bold flex-1 truncate max-w-[200px]">{partLine.name}</div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-slate-400">Qty:</span>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={partLine.quantity}
                                                            onChange={(e) => handlePartQuantityChange(partLine.part_id, e.target.value)}
                                                            className="w-14 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-center font-bold"
                                                        />
                                                    </div>
                                                    <div className="font-bold text-indigo-600 dark:text-indigo-400 min-w-[70px] text-right">
                                                        {formatCurrency(partLine.price * partLine.quantity)}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePartRemove(partLine.part_id)}
                                                        className="text-rose-500 hover:text-rose-600 transition-colors"
                                                    >
                                                        <MinusCircle className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-slate-400 italic">No parts added to this job card.</div>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description / Symptoms</label>
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Enter natural language customer complaints or job notes..."
                                    rows="3"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.notes && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.notes}</p>}
                            </div>

                            {/* Submit with Spinner */}
                            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                                >
                                    {processing && (
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    )}
                                    {editingBooking ? 'Save Changes' : 'Create Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
