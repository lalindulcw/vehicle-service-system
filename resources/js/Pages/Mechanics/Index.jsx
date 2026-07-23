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
    User,
    Shield,
    Phone,
    Briefcase,
    Grid,
    List,
    Clock,
    Wrench,
    Award,
    AlertCircle
} from 'lucide-react';

export default function Index({ mechanics, filters, stats }) {
    const { auth } = usePage().props;
    const user = auth.user;
    
    // Only Admin can modify mechanics
    const isAdmin = user.roles.includes('Admin');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMechanic, setEditingMechanic] = useState(null);
    const [mechanicToDelete, setMechanicToDelete] = useState(null);
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    const { data, setData, post, put, errors, processing, reset, clearErrors } = useForm({
        name: '',
        employee_id: '',
        specialization: '',
        contact: ''
    });

    const openCreateModal = () => {
        setEditingMechanic(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (mechanic) => {
        setEditingMechanic(mechanic);
        setData({
            name: mechanic.name,
            employee_id: mechanic.employee_id,
            specialization: mechanic.specialization || '',
            contact: mechanic.contact
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMechanic(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingMechanic) {
            put(route('mechanics.update', editingMechanic.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('mechanics.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const runSearch = (e) => {
        e.preventDefault();
        router.get(route('mechanics.index'), { 
            search: searchVal,
            sort_field: filters.sort_field,
            sort_direction: filters.sort_direction
        }, { preserveState: true });
    };

    const sortBy = (field) => {
        const direction = filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        router.get(route('mechanics.index'), { 
            search: searchVal,
            sort_field: field,
            sort_direction: direction
        }, { preserveState: true });
    };

    const getSpecColor = (spec) => {
        const lower = spec.toLowerCase();
        if (lower.includes('engine')) return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
        if (lower.includes('brake') || lower.includes('suspension')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        if (lower.includes('hybrid') || lower.includes('electric')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        if (lower.includes('electrical') || lower.includes('wiring')) return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    };

    return (
        <AuthenticatedLayout header="Mechanic Registry">
            <Head title="Mechanics" />

            {/* Premium Mini-Statistics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-350">
                {/* Stat 1: Total Mechanics */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Mechanics</span>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats.total}</h4>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center z-10 shadow-sm">
                        <Wrench className="h-5 w-5" />
                    </div>
                    <div className="absolute right-0 bottom-0 h-20 w-20 bg-indigo-500/5 rounded-tl-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Stat 2: Specializations */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Distinct Specialities</span>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats.specializations}</h4>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center z-10 shadow-sm">
                        <Award className="h-5 w-5" />
                    </div>
                    <div className="absolute right-0 bottom-0 h-20 w-20 bg-emerald-500/5 rounded-tl-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Stat 3: Recent Additions */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">New Registrations</span>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats.recent}</h4>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center z-10 shadow-sm">
                        <User className="h-5 w-5" />
                    </div>
                    <div className="absolute right-0 bottom-0 h-20 w-20 bg-amber-500/5 rounded-tl-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                
                {/* Search Bar with Quick Clear Button */}
                <form onSubmit={runSearch} className="relative w-full md:max-w-md">
                    <input
                        type="text"
                        placeholder="Search name, specialization or ID..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                    />
                    <Search className="h-5 w-5 text-slate-400 absolute left-4 top-3.5" />
                    {searchVal && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchVal('');
                                router.get(route('mechanics.index'), {}, { preserveState: true });
                            }}
                            className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <button type="submit" className="hidden">Search</button>
                </form>

                {/* View Toggles & Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    
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

                    {isAdmin && (
                        <button
                            onClick={openCreateModal}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                        >
                            <Plus className="h-4.5 w-4.5" />
                            Add Mechanic
                        </button>
                    )}
                </div>
            </div>

            {/* Grid View Mode */}
            {viewMode === 'grid' && (
                <>
                    {mechanics.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-300">
                            {mechanics.data.map((mechanic) => (
                                <div 
                                    key={mechanic.id}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm hover:shadow-lg dark:hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                                >
                                    <div className="space-y-4">
                                        {/* Header Initials Card */}
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/10">
                                                {mechanic.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                                                    {mechanic.name}
                                                </h3>
                                                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                                                    EMP ID: #{mechanic.employee_id}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Specialization Badge */}
                                        <div className="pt-2">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${getSpecColor(mechanic.specialization)}`}>
                                                <Shield className="h-3 w-3 shrink-0" />
                                                {mechanic.specialization || 'General Mechanic'}
                                            </span>
                                        </div>

                                        {/* Contact Details */}
                                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2 text-xs text-slate-900 dark:text-slate-250 font-medium">
                                                <Phone className="h-3.5 w-3.5 text-indigo-500" />
                                                <span>{mechanic.contact}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Tray */}
                                    {isAdmin && (
                                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-855 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>Added {new Date(mechanic.created_at).toLocaleDateString()}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => openEditModal(mechanic)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 hover:text-indigo-600 rounded-xl transition-all"
                                                    title="Edit Record"
                                                >
                                                    <Edit className="h-4.5 w-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => setMechanicToDelete(mechanic)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 text-rose-500 hover:text-rose-600 rounded-xl transition-all"
                                                    title="Remove Mechanic"
                                                >
                                                    <Trash2 className="h-4.5 w-4.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Premium Empty State */
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center max-w-xl mx-auto mb-8 shadow-sm flex flex-col items-center space-y-4">
                            <div className="h-16 w-16 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/10">
                                <Wrench className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">No Mechanics Registered</h3>
                            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                                Register workshop mechanics and outline their technical specialities. You can then assign active workshop service bookings to them.
                            </p>
                            {isAdmin && (
                                <button
                                    onClick={openCreateModal}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                                >
                                    Register First Mechanic
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
                                    <th className="py-4 pl-6 cursor-pointer" onClick={() => sortBy('employee_id')}>
                                        <div className="flex items-center gap-1.5">
                                            Emp ID
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </div>
                                    </th>
                                    <th className="py-4 cursor-pointer" onClick={() => sortBy('name')}>
                                        <div className="flex items-center gap-1.5">
                                            Name
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </div>
                                    </th>
                                    <th className="py-4">Specialization</th>
                                    <th className="py-4">Contact</th>
                                    {isAdmin && <th className="py-4 pr-6 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {mechanics.data.length > 0 ? (
                                    mechanics.data.map((mechanic) => (
                                        <tr key={mechanic.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors text-sm">
                                            <td className="py-4 pl-6 font-mono font-bold text-slate-900 dark:text-white">
                                                {mechanic.employee_id}
                                            </td>
                                            <td className="py-4 font-bold text-slate-950 dark:text-slate-100">
                                                {mechanic.name}
                                            </td>
                                            <td className="py-4">
                                                <span className="font-semibold text-slate-700 dark:text-slate-350">
                                                    {mechanic.specialization || 'General'}
                                                </span>
                                            </td>
                                            <td className="py-4 font-semibold text-indigo-600 dark:text-indigo-400">
                                                {mechanic.contact}
                                            </td>
                                            {isAdmin && (
                                                <td className="py-4 pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(mechanic)}
                                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 hover:text-indigo-600 rounded-xl transition-colors"
                                                        >
                                                            <Edit className="h-4.5 w-4.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => setMechanicToDelete(mechanic)}
                                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 text-rose-500 hover:text-rose-600 rounded-xl transition-colors"
                                                        >
                                                            <Trash2 className="h-4.5 w-4.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isAdmin ? 5 : 4} className="text-center py-16 text-slate-400">
                                            <div className="flex flex-col items-center space-y-2">
                                                <AlertCircle className="h-6 w-6 text-slate-300" />
                                                <span>No mechanics match the search criteria.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination controls */}
            {mechanics.links.length > 3 && (
                <div className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                    <span className="text-xs text-slate-400">
                        Showing {mechanics.from} to {mechanics.to} of {mechanics.total} mechanics
                    </span>
                    <div className="flex gap-2">
                        {mechanics.links.map((link, idx) => {
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
            {mechanicToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="mx-auto h-16 w-16 bg-rose-50 dark:bg-rose-500/10 text-rose-600 flex items-center justify-center rounded-3xl border border-rose-500/10">
                            <Trash2 className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-extrabold text-lg">Confirm Delete Mechanic</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Are you sure you want to delete mechanic <span className="font-bold text-slate-900 dark:text-white">"{mechanicToDelete.name}"</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setMechanicToDelete(null)}
                                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    router.delete(route('mechanics.destroy', mechanicToDelete.id), {
                                        onSuccess: () => setMechanicToDelete(null)
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

            {/* Add / Edit Drawer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-lg">
                                {editingMechanic ? 'Edit Mechanic Record' : 'Register New Mechanic'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Employee ID */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Employee ID</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.employee_id}
                                        onChange={e => setData('employee_id', e.target.value)}
                                        placeholder="e.g. EMP-1001"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Shield className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                                {errors.employee_id && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.employee_id}</p>}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Enter full name"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <User className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                                {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
                            </div>

                            {/* Specialization */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Specialization Area</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.specialization}
                                        onChange={e => setData('specialization', e.target.value)}
                                        placeholder="Engine, Electrical, Hybrid, Suspension..."
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Briefcase className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                                {errors.specialization && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.specialization}</p>}
                            </div>

                            {/* Contact */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.contact}
                                        onChange={e => setData('contact', e.target.value)}
                                        placeholder="+947XXXXXXXX"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Phone className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                                {errors.contact && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.contact}</p>}
                            </div>

                            {/* Footer Submit with Processing Spinner */}
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
                                    {editingMechanic ? 'Save Changes' : 'Register Mechanic'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
