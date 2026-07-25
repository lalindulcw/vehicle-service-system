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
    Mail,
    Phone,
    MapPin,
    FileText
} from 'lucide-react';

export default function Index({ customers, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchVal, setSearchVal] = useState(filters.search || '');

    // Form setup using Inertia's useForm hook
    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
    });

    // Handle open/close modal
    const openCreateModal = () => {
        setEditingCustomer(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (customer) => {
        setEditingCustomer(customer);
        setData({
            name: customer.name,
            email: customer.email || '',
            phone: customer.phone,
            address: customer.address || '',
            notes: customer.notes || ''
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
        reset();
    };

    // Form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCustomer) {
            put(route('customers.update', editingCustomer.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('customers.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    // Search and Sort helpers
    const handleSearchChange = (e) => {
        setSearchVal(e.target.value);
    };

    const runSearch = (e) => {
        e.preventDefault();
        router.get(route('customers.index'), { 
            search: searchVal,
            sort_field: filters.sort_field,
            sort_direction: filters.sort_direction
        }, { preserveState: true });
    };

    const sortBy = (field) => {
        const direction = filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        router.get(route('customers.index'), { 
            search: searchVal,
            sort_field: field,
            sort_direction: direction
        }, { preserveState: true });
    };

    const deleteCustomer = (id) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            router.delete(route('customers.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Customer Database">
            <Head title="Customers" />

            {/* Top Bar (Actions, Search) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                <form onSubmit={runSearch} className="relative w-full sm:max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name, email, phone..."
                        value={searchVal}
                        onChange={handleSearchChange}
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
                    Add Customer
                </button>
            </div>

            {/* Customers Table Container */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="py-4 pl-6 cursor-pointer" onClick={() => sortBy('name')}>
                                    <div className="flex items-center gap-1.5">
                                        Name
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </div>
                                </th>
                                <th className="py-4">Contact</th>
                                <th className="py-4">Address</th>
                                <th className="py-4">Notes</th>
                                <th className="py-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {customers.data.length > 0 ? (
                                customers.data.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors text-sm">
                                        <td className="py-4 pl-6 font-bold text-slate-900 dark:text-white">
                                            {customer.name}
                                        </td>
                                        <td className="py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                    <Mail className="h-3 w-3" />
                                                    {customer.email || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-semibold">
                                                    <Phone className="h-3 w-3 text-indigo-500" />
                                                    {customer.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                                            {customer.address || 'N/A'}
                                        </td>
                                        <td className="py-4 text-slate-400 max-w-[220px] truncate">
                                            {customer.notes || '—'}
                                        </td>
                                        <td className="py-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(customer)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 hover:text-indigo-600 rounded-xl transition-colors"
                                                >
                                                    <Edit className="h-4.5 w-4.5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteCustomer(customer.id)}
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
                                    <td colSpan="5" className="text-center py-10 text-slate-400">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination bar */}
                {customers.links.length > 3 && (
                    <div className="h-16 flex items-center justify-between px-6 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-xs text-slate-400">
                            Showing {customers.from} to {customers.to} of {customers.total} customers
                        </span>
                        <div className="flex gap-2">
                            {customers.links.map((link, idx) => {
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
            </div>

            {/* Add / Edit Drawer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-lg">
                                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Form */}
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
                                        placeholder="Enter customer name"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <User className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="customer@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Mail className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        placeholder="+947XXXXXXXX"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Phone className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.phone && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phone}</p>}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Home Address</label>
                                <div className="relative">
                                    <textarea
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        placeholder="Enter customer address"
                                        rows="2"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <MapPin className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                                {errors.address && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.address}</p>}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Customer Notes / Preferences</label>
                                <div className="relative">
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        placeholder="Add special instructions, e.g. preferred mechanic, VIP customer..."
                                        rows="2"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <FileText className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                                {errors.notes && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.notes}</p>}
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
                                    {editingCustomer ? 'Save Changes' : 'Create Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
