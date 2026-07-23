import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
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
    Car,
    Hash,
    Calendar,
    Settings,
    Gauge,
    Grid,
    List,
    Shield,
    AlertTriangle,
    PlusCircle,
    Sliders
} from 'lucide-react';

export default function Index({ vehicles, customers, filters, stats }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
        customer_id: '',
        registration_no: '',
        make: '',
        model: '',
        year: '',
        vin: '',
        mileage: ''
    });

    const openCreateModal = () => {
        setEditingVehicle(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (vehicle) => {
        setEditingVehicle(vehicle);
        setData({
            customer_id: vehicle.customer_id,
            registration_no: vehicle.registration_no,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            vin: vehicle.vin || '',
            mileage: vehicle.mileage
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingVehicle(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingVehicle) {
            put(route('vehicles.update', editingVehicle.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('vehicles.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const runSearch = (e) => {
        e.preventDefault();
        router.get(route('vehicles.index'), { 
            search: searchVal,
            sort_field: filters.sort_field,
            sort_direction: filters.sort_direction
        }, { preserveState: true });
    };

    const sortBy = (field) => {
        const direction = filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        router.get(route('vehicles.index'), { 
            search: searchVal,
            sort_field: field,
            sort_direction: direction
        }, { preserveState: true });
    };

    const deleteVehicle = (id) => {
        if (confirm('Are you sure you want to delete this vehicle? All bookings will be verified.')) {
            router.delete(route('vehicles.destroy', id));
        }
    };

    // Helper for manufacturer logo color gradients
    const getMakeGradient = (make) => {
        const lower = make.toLowerCase();
        if (lower.includes('toyota')) return 'from-red-500 to-rose-600';
        if (lower.includes('honda')) return 'from-blue-500 to-indigo-600';
        if (lower.includes('nissan')) return 'from-gray-500 to-slate-700';
        if (lower.includes('bmw')) return 'from-sky-500 to-blue-700';
        if (lower.includes('benz') || lower.includes('mercedes')) return 'from-zinc-600 to-neutral-800';
        return 'from-indigo-500 to-purple-600';
    };

    return (
        <AuthenticatedLayout header="Vehicle Fleet Database">
            <Head title="Vehicles" />

            {/* Premium Mini-Statistics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {/* Stat 1: Total Fleet */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Registered Fleet</span>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats.total}</h4>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center z-10 shadow-sm">
                        <Car className="h-5 w-5" />
                    </div>
                    <div className="absolute right-0 bottom-0 h-20 w-20 bg-indigo-500/5 rounded-tl-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Stat 2: High Mileage */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">High Mileage (&gt;100k)</span>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats.high_mileage}</h4>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center z-10 shadow-sm">
                        <Gauge className="h-5 w-5" />
                    </div>
                    <div className="absolute right-0 bottom-0 h-20 w-20 bg-amber-500/5 rounded-tl-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Stat 3: Recent Registrations */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">New This Week</span>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats.recent}</h4>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center z-10 shadow-sm">
                        <PlusCircle className="h-5 w-5" />
                    </div>
                    <div className="absolute right-0 bottom-0 h-20 w-20 bg-emerald-500/5 rounded-tl-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                
                {/* Search Bar */}
                <form onSubmit={runSearch} className="relative w-full md:max-w-md">
                    <input
                        type="text"
                        placeholder="Search reg no, make, model or owner..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm animate-in"
                    />
                    <Search className="h-5 w-5 text-slate-400 absolute left-4 top-3.5" />
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

                    <button
                        onClick={openCreateModal}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                    >
                        <Plus className="h-4.5 w-4.5" />
                        Add Vehicle
                    </button>
                </div>
            </div>

            {/* Grid View Mode */}
            {viewMode === 'grid' && (
                <>
                    {vehicles.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-300">
                            {vehicles.data.map((vehicle) => (
                                <div 
                                    key={vehicle.id}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm hover:shadow-lg dark:hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                                >
                                    <div className="space-y-4">
                                        {/* Header: Reg & Make */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${getMakeGradient(vehicle.make)} flex items-center justify-center text-white font-semibold shadow-md`}>
                                                    <Car className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-extrabold text-sm tracking-wider text-indigo-500 uppercase bg-indigo-500/5 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/10 inline-block">
                                                        {vehicle.registration_no}
                                                    </h3>
                                                    <p className="text-xs text-slate-400 font-bold block pt-1">
                                                        {vehicle.make} {vehicle.model}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                                {vehicle.year}
                                            </span>
                                        </div>

                                        {/* Info Grid */}
                                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                                            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1.5">
                                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                                    Owner:
                                                </span>
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {vehicle.customer ? vehicle.customer.name : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1.5">
                                                    <Shield className="h-3.5 w-3.5 text-slate-400" />
                                                    Chassis (VIN):
                                                </span>
                                                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                                                    {vehicle.vin || '—'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Mileage Progress representation */}
                                        <div className="pt-2 space-y-1">
                                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Gauge className="h-3.5 w-3.5 text-indigo-500" />
                                                    Odometer
                                                </span>
                                                <span className="text-slate-900 dark:text-white font-extrabold">{vehicle.mileage.toLocaleString()} KM</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-850">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" 
                                                    style={{ width: `${Math.min((vehicle.mileage / 180000) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Tray */}
                                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-end gap-1.5">
                                        <button
                                            onClick={() => openEditModal(vehicle)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 hover:text-indigo-600 rounded-xl transition-all"
                                            title="Edit vehicle details"
                                        >
                                            <Edit className="h-4.5 w-4.5" />
                                        </button>
                                        <button
                                            onClick={() => deleteVehicle(vehicle.id)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 text-rose-500 hover:text-rose-600 rounded-xl transition-all"
                                            title="Delete vehicle record"
                                        >
                                            <Trash2 className="h-4.5 w-4.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Premium Empty State */
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center max-w-xl mx-auto mb-8 shadow-sm flex flex-col items-center space-y-4">
                            <div className="h-16 w-16 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/10">
                                <Car className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">No Vehicles Registered</h3>
                            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                                Connect owner profiles to vehicles. Once a vehicle is added to the fleet, you can assign service advisory bookings, schedule mechanics and issue bills.
                            </p>
                            <button
                                onClick={openCreateModal}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                            >
                                Register First Vehicle
                            </button>
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
                                    <th className="py-4 pl-6 cursor-pointer" onClick={() => sortBy('registration_no')}>
                                        <div className="flex items-center gap-1.5">
                                            Reg. Number
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </div>
                                    </th>
                                    <th className="py-4 cursor-pointer" onClick={() => sortBy('make')}>
                                        <div className="flex items-center gap-1.5">
                                            Make & Model
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </div>
                                    </th>
                                    <th className="py-4">Owner</th>
                                    <th className="py-4">VIN (Chassis)</th>
                                    <th className="py-4 cursor-pointer" onClick={() => sortBy('mileage')}>
                                        <div className="flex items-center gap-1.5">
                                            Mileage
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </div>
                                    </th>
                                    <th className="py-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {vehicles.data.length > 0 ? (
                                    vehicles.data.map((vehicle) => (
                                        <tr key={vehicle.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors text-sm">
                                            <td className="py-4 pl-6 font-mono font-bold tracking-wider text-slate-900 dark:text-white uppercase">
                                                {vehicle.registration_no}
                                            </td>
                                            <td className="py-4 text-slate-700 dark:text-slate-300 font-medium">
                                                {vehicle.make} {vehicle.model} ({vehicle.year})
                                            </td>
                                            <td className="py-4 font-semibold text-slate-900 dark:text-slate-200">
                                                {vehicle.customer ? vehicle.customer.name : 'N/A'}
                                            </td>
                                            <td className="py-4 font-mono text-slate-400 text-xs">
                                                {vehicle.vin || '—'}
                                            </td>
                                            <td className="py-4 font-bold text-slate-900 dark:text-white">
                                                {vehicle.mileage.toLocaleString()} KM
                                            </td>
                                            <td className="py-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(vehicle)}
                                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 hover:text-indigo-600 rounded-xl transition-colors"
                                                    >
                                                        <Edit className="h-4.5 w-4.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteVehicle(vehicle.id)}
                                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 text-rose-500 hover:text-rose-600 rounded-xl transition-colors"
                                                    >
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-16 text-slate-400">
                                            <div className="flex flex-col items-center space-y-2">
                                                <Sliders className="h-6 w-6 text-slate-300" />
                                                <span>No vehicles match the search criteria.</span>
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
            {vehicles.links.length > 3 && (
                <div className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                    <span className="text-xs text-slate-400">
                        Showing {vehicles.from} to {vehicles.to} of {vehicles.total} vehicles
                    </span>
                    <div className="flex gap-2">
                        {vehicles.links.map((link, idx) => {
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
                                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
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
                                {editingVehicle ? 'Edit Vehicle Registry' : 'Register New Vehicle'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Owner */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Vehicle Owner</label>
                                <div className="relative">
                                    <select
                                        required
                                        value={data.customer_id}
                                        onChange={e => setData('customer_id', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="" disabled className="dark:bg-slate-900">Select Customer...</option>
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id} className="dark:bg-slate-900">
                                                {c.name} ({c.phone})
                                            </option>
                                        ))}
                                    </select>
                                    <User className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                                {errors.customer_id && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.customer_id}</p>}
                            </div>

                            {/* Reg No */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Registration Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.registration_no}
                                        onChange={e => setData('registration_no', e.target.value)}
                                        placeholder="e.g. WP-CAD-1234"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase"
                                    />
                                    <Hash className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                                {errors.registration_no && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.registration_no}</p>}
                            </div>

                            {/* Make & Model */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Make / Manufacturer</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            value={data.make}
                                            onChange={e => setData('make', e.target.value)}
                                            placeholder="Toyota, Honda..."
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Car className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.make && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.make}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Model</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            value={data.model}
                                            onChange={e => setData('model', e.target.value)}
                                            placeholder="Prius, Civic..."
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Settings className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.model && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.model}</p>}
                                </div>
                            </div>

                            {/* Year & Mileage */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Manufacture Year</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            value={data.year}
                                            onChange={e => setData('year', e.target.value)}
                                            placeholder="YYYY"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Calendar className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.year && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.year}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Odometer (KM)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            value={data.mileage}
                                            onChange={e => setData('mileage', e.target.value)}
                                            placeholder="KM"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Gauge className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.mileage && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.mileage}</p>}
                                </div>
                            </div>

                            {/* VIN */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chassis Number / VIN</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.vin}
                                        onChange={e => setData('vin', e.target.value)}
                                        placeholder="17-Digit Chassis Number"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Hash className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                                {errors.vin && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.vin}</p>}
                            </div>

                            {/* Footer Submit */}
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
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                                >
                                    {editingVehicle ? 'Save Changes' : 'Register Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
