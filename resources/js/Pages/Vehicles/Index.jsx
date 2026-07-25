import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
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
    Gauge
} from 'lucide-react';

export default function Index({ vehicles, customers, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [searchVal, setSearchVal] = useState(filters.search || '');

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
        if (confirm('Are you sure you want to delete this vehicle?')) {
            router.delete(route('vehicles.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Vehicle Database">
            <Head title="Vehicles" />

            {/* Top controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                <form onSubmit={runSearch} className="relative w-full sm:max-w-md">
                    <input
                        type="text"
                        placeholder="Search reg no, make, model or owner..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    />
                    <Search className="h-5 w-5 text-slate-400 absolute left-4 top-3.5" />
                    <button type="submit" className="hidden">Search</button>
                </form>

                <button
                    onClick={openCreateModal}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                >
                    <Plus className="h-5 w-5" />
                    Add Vehicle
                </button>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
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
                                <th className="py-4">VIN</th>
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
                                        <td className="py-4 pl-6">
                                            <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                                {vehicle.registration_no}
                                            </span>
                                        </td>
                                        <td className="py-4 font-bold text-slate-900 dark:text-white">
                                            {vehicle.make} {vehicle.model}
                                            <span className="block text-xs text-slate-400 font-medium">{vehicle.year}</span>
                                        </td>
                                        <td className="py-4">
                                            <div className="font-semibold">{vehicle.customer.name}</div>
                                            <div className="text-xs text-slate-400">{vehicle.customer.phone}</div>
                                        </td>
                                        <td className="py-4 font-mono text-xs text-slate-400">
                                            {vehicle.vin || '—'}
                                        </td>
                                        <td className="py-4 font-bold">
                                            <div className="flex items-center gap-1.5">
                                                <Gauge className="h-4 w-4 text-slate-400" />
                                                {vehicle.mileage.toLocaleString()} km
                                            </div>
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
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 hover:text-rose-600 rounded-xl transition-colors"
                                                >
                                                    <Trash2 className="h-4.5 w-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-slate-400">
                                        No vehicles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {vehicles.links.length > 3 && (
                    <div className="h-16 flex items-center justify-between px-6 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-xs text-slate-400">
                            Showing {vehicles.from} to {vehicles.to} of {vehicles.total} vehicles
                        </span>
                        <div className="flex gap-2">
                            {vehicles.links.map((link, idx) => (
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

            {/* Add / Edit Drawer */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-lg">
                                {editingVehicle ? 'Edit Vehicle Details' : 'Register New Vehicle'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh] custom-scrollbar">
                            {/* Owner */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Owner / Customer</label>
                                <div className="relative">
                                    <select
                                        required
                                        value={data.customer_id}
                                        onChange={e => setData('customer_id', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select Owner</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                                        ))}
                                    </select>
                                    <User className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
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
                                        placeholder="e.g. WP CAB-1234"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs uppercase"
                                    />
                                    <Hash className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.registration_no && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.registration_no}</p>}
                            </div>

                            {/* Make & Model */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Make / Brand</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            value={data.make}
                                            onChange={e => setData('make', e.target.value)}
                                            placeholder="e.g. Toyota"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Car className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
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
                                            placeholder="e.g. Prius"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Settings className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                    </div>
                                    {errors.model && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.model}</p>}
                                </div>
                            </div>

                            {/* Year & Mileage */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Year</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            value={data.year}
                                            onChange={e => setData('year', e.target.value)}
                                            placeholder="e.g. 2018"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Calendar className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                    </div>
                                    {errors.year && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.year}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Mileage (km)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            value={data.mileage}
                                            onChange={e => setData('mileage', e.target.value)}
                                            placeholder="e.g. 85000"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Gauge className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                    </div>
                                    {errors.mileage && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.mileage}</p>}
                                </div>
                            </div>

                            {/* VIN */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chassis / VIN Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.vin}
                                        onChange={e => setData('vin', e.target.value)}
                                        placeholder="Enter chassis number (optional)"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs uppercase"
                                    />
                                    <Hash className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.vin && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.vin}</p>}
                            </div>

                            {/* Submit */}
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
