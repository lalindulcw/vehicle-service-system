import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
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
    Briefcase
} from 'lucide-react';

export default function Index({ mechanics, filters }) {
    const { auth } = usePage().props;
    const user = auth.user;
    
    // Only Admin can modify
    const isAdmin = user.roles.includes('Admin');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMechanic, setEditingMechanic] = useState(null);
    const [searchVal, setSearchVal] = useState(filters.search || '');

    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
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

    const deleteMechanic = (id) => {
        if (confirm('Are you sure you want to remove this mechanic?')) {
            router.delete(route('mechanics.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Mechanic Registry">
            <Head title="Mechanics" />

            {/* Top controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                <form onSubmit={runSearch} className="relative w-full sm:max-w-md">
                    <input
                        type="text"
                        placeholder="Search name, specialization or ID..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    />
                    <Search className="h-5 w-5 text-slate-400 absolute left-4 top-3.5" />
                    <button type="submit" className="hidden">Search</button>
                </form>

                {isAdmin && (
                    <button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                    >
                        <Plus className="h-5 w-5" />
                        Add Mechanic
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
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
                                        <td className="py-4 pl-6">
                                            <span className="font-mono font-bold text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded">
                                                {mechanic.employee_id}
                                            </span>
                                        </td>
                                        <td className="py-4 font-bold text-slate-900 dark:text-white">
                                            {mechanic.name}
                                        </td>
                                        <td className="py-4 font-medium">
                                            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                                <Briefcase className="h-4 w-4 text-slate-400" />
                                                {mechanic.specialization || 'General Services'}
                                            </span>
                                        </td>
                                        <td className="py-4 font-semibold text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                {mechanic.contact}
                                            </div>
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
                                                        onClick={() => deleteMechanic(mechanic.id)}
                                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 hover:text-rose-600 rounded-xl transition-colors"
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
                                    <td colSpan={isAdmin ? '5' : '4'} className="text-center py-10 text-slate-400">
                                        No mechanics found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {mechanics.links.length > 3 && (
                    <div className="h-16 flex items-center justify-between px-6 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-xs text-slate-400">
                            Showing {mechanics.from} to {mechanics.to} of {mechanics.total} mechanics
                        </span>
                        <div className="flex gap-2">
                            {mechanics.links.map((link, idx) => (
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
                                {editingMechanic ? 'Edit Mechanic Details' : 'Register New Mechanic'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Enter name"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <User className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
                            </div>

                            {/* Employee ID */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Employee ID</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.employee_id}
                                        onChange={e => setData('employee_id', e.target.value)}
                                        placeholder="e.g. EMP001"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs uppercase"
                                    />
                                    <Shield className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.employee_id && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.employee_id}</p>}
                            </div>

                            {/* Specialization */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Specialization</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.specialization}
                                        onChange={e => setData('specialization', e.target.value)}
                                        placeholder="e.g. Drivetrain, Auto AC, Tuning"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Briefcase className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.specialization && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.specialization}</p>}
                            </div>

                            {/* Contact */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Number / Email</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.contact}
                                        onChange={e => setData('contact', e.target.value)}
                                        placeholder="+947XXXXXXXX"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Phone className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.contact && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.contact}</p>}
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
