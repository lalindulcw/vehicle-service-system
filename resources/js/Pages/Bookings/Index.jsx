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
    MinusCircle
} from 'lucide-react';

export default function Index({ bookings, customers, vehicles, mechanics, parts, filters }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const canModify = user.roles.includes('Admin') || user.roles.includes('Service Advisor');
    const isMechanic = user.roles.includes('Mechanic');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

    // State to hold parts assigned in modal
    const [selectedParts, setSelectedParts] = useState([]);

    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
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
            scheduled_at: booking.scheduled_at.replace(' ', 'T').substring(0, 16), // format to datetime-local
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
            router.put(route('bookings.update', editingBooking.id), payload, {
                onSuccess: () => closeModal()
            });
        } else {
            router.post(route('bookings.store'), payload, {
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

    const handleStatusFilterChange = (status) => {
        setSelectedStatus(status);
        router.get(route('bookings.index'), { 
            search: searchVal,
            status: status,
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

    const deleteBooking = (id) => {
        if (confirm('Are you sure you want to delete this booking?')) {
            router.delete(route('bookings.destroy', id));
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Filter vehicles in modal based on selected customer
    const filteredVehicles = vehicles.filter(v => v.customer_id === parseInt(data.customer_id));

    return (
        <AuthenticatedLayout header="Service Bookings & Job Cards">
            <Head title="Bookings" />

            {/* Quick status bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => handleStatusFilterChange(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                                selectedStatus === status 
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3 w-full sm:w-auto justify-end">
                    <form onSubmit={runSearch} className="relative w-full sm:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search owner or reg no..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:ring-indigo-500"
                        />
                        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                    </form>

                    {canModify && (
                        <button
                            onClick={openCreateModal}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
                        >
                            <Plus className="h-4 w-4" />
                            New Booking
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Global Error Banner */}
                {errors.error && (
                    <div className="bg-rose-500 text-white text-xs font-bold px-6 py-4 flex items-center justify-between">
                        <span>Error: {errors.error}</span>
                        <button onClick={() => clearErrors()} className="text-white hover:opacity-80">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="py-4 pl-6 cursor-pointer" onClick={() => sortBy('scheduled_at')}>
                                    <div className="flex items-center gap-1.5">
                                        Date & Time
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </div>
                                </th>
                                <th className="py-4">Vehicle & Owner</th>
                                <th className="py-4">Assigned Mechanic</th>
                                <th className="py-4">Labor Cost</th>
                                <th className="py-4">Parts Utilized</th>
                                <th className="py-4">Status</th>
                                <th className="py-4 pr-6 text-right">Actions</th>
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
                                                    {new Date(booking.scheduled_at).toLocaleString('en-LK', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    {booking.vehicle.registration_no}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {booking.customer.name} • {booking.vehicle.make} {booking.vehicle.model}
                                                </div>
                                            </td>
                                            <td className="py-4 text-slate-600 dark:text-slate-300 font-medium">
                                                {booking.mechanic ? (
                                                    <div>
                                                        <div>{booking.mechanic.name}</div>
                                                        <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                                            {booking.mechanic.specialization}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded-lg">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="py-4 font-bold">
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
                                                {/* Status dropdown/select */}
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
                                                    <option value="pending" className="text-slate-900 bg-white">Pending</option>
                                                    <option value="in_progress" className="text-slate-900 bg-white">In Progress</option>
                                                    <option value="completed" className="text-slate-900 bg-white">Completed</option>
                                                    <option value="cancelled" className="text-slate-900 bg-white">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="py-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {canModify && (
                                                        <>
                                                            <button
                                                                onClick={() => openEditModal(booking)}
                                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 hover:text-indigo-600 rounded-xl transition-colors"
                                                            >
                                                                <Edit className="h-4.5 w-4.5" />
                                                            </button>
                                                            {!hasInvoice && (
                                                                <button
                                                                    onClick={() => deleteBooking(booking.id)}
                                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 hover:text-rose-600 rounded-xl transition-colors"
                                                                >
                                                                    <Trash2 className="h-4.5 w-4.5" />
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-slate-400">
                                        No service bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {bookings.links.length > 3 && (
                    <div className="h-16 flex items-center justify-between px-6 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-xs text-slate-400">
                            Showing {bookings.from} to {bookings.to} of {bookings.total} bookings
                        </span>
                        <div className="flex gap-2">
                            {bookings.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${
                                        link.active 
                                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                                    } ${!link.url && 'pointer-events-none opacity-50'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

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
                                            <option value="">Select Customer</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <User className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
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
                                            <option value="">Select Vehicle</option>
                                            {filteredVehicles.map(v => (
                                                <option key={v.id} value={v.id}>{v.registration_no} ({v.make} {v.model})</option>
                                            ))}
                                        </select>
                                        <Car className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
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
                                            <option value="">Assign Later (Pending)</option>
                                            {mechanics.map(m => (
                                                <option key={m.id} value={m.id}>{m.name} ({m.specialization})</option>
                                            ))}
                                        </select>
                                        <Wrench className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
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
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500"
                                        />
                                        <Calendar className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
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
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <Settings className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
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
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500"
                                        />
                                        <DollarSign className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                    </div>
                                    {errors.labor_cost && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.labor_cost}</p>}
                                </div>
                            </div>

                            {/* Spare Parts Selection (Job Card feature) */}
                            <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
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
                                        <option value="">Choose spare part to add...</option>
                                        {parts.map(p => (
                                            <option key={p.id} value={p.id} disabled={p.stock <= 0}>
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
                                                        className="text-rose-500 hover:text-rose-600"
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
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500"
                                />
                                {errors.notes && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.notes}</p>}
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                                >
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
