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
    Settings,
    Tag,
    Coins,
    Boxes,
    AlertTriangle
} from 'lucide-react';

export default function Index({ parts, filters }) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Admin or Advisor can modify
    const canModify = user.roles.includes('Admin') || user.roles.includes('Service Advisor');
    const isAdmin = user.roles.includes('Admin');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPart, setEditingPart] = useState(null);
    const [searchVal, setSearchVal] = useState(filters.search || '');

    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
        name: '',
        sku: '',
        price: '',
        stock: '',
        min_stock_threshold: '5'
    });

    const openCreateModal = () => {
        setEditingPart(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (part) => {
        setEditingPart(part);
        setData({
            name: part.name,
            sku: part.sku,
            price: part.price,
            stock: part.stock,
            min_stock_threshold: part.min_stock_threshold
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPart(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPart) {
            put(route('parts.update', editingPart.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('parts.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const runSearch = (e) => {
        e.preventDefault();
        router.get(route('parts.index'), { 
            search: searchVal,
            sort_field: filters.sort_field,
            sort_direction: filters.sort_direction
        }, { preserveState: true });
    };

    const sortBy = (field) => {
        const direction = filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        router.get(route('parts.index'), { 
            search: searchVal,
            sort_field: field,
            sort_direction: direction
        }, { preserveState: true });
    };

    const deletePart = (id) => {
        if (confirm('Are you sure you want to delete this part from inventory?')) {
            router.delete(route('parts.destroy', id));
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <AuthenticatedLayout header="Spare Parts Inventory">
            <Head title="Inventory" />

            {/* Top controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                <form onSubmit={runSearch} className="relative w-full sm:max-w-md">
                    <input
                        type="text"
                        placeholder="Search part name or SKU..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    />
                    <Search className="h-5 w-5 text-slate-400 absolute left-4 top-3.5" />
                    <button type="submit" className="hidden">Search</button>
                </form>

                {canModify && (
                    <button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                    >
                        <Plus className="h-5 w-5" />
                        Add Part to Stock
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="py-4 pl-6 cursor-pointer" onClick={() => sortBy('sku')}>
                                    <div className="flex items-center gap-1.5">
                                        SKU / Part No.
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </div>
                                </th>
                                <th className="py-4 cursor-pointer" onClick={() => sortBy('name')}>
                                    <div className="flex items-center gap-1.5">
                                        Part Name
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </div>
                                </th>
                                <th className="py-4 cursor-pointer" onClick={() => sortBy('price')}>
                                    <div className="flex items-center gap-1.5">
                                        Unit Price
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </div>
                                </th>
                                <th className="py-4 cursor-pointer" onClick={() => sortBy('stock')}>
                                    <div className="flex items-center gap-1.5">
                                        Stock Level
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </div>
                                </th>
                                <th className="py-4">Threshold</th>
                                {canModify && <th className="py-4 pr-6 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {parts.data.length > 0 ? (
                                parts.data.map((part) => {
                                    const isLowStock = part.stock < part.min_stock_threshold;
                                    return (
                                        <tr key={part.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors text-sm">
                                            <td className="py-4 pl-6">
                                                <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                    {part.sku}
                                                </span>
                                            </td>
                                            <td className="py-4 font-bold text-slate-900 dark:text-white">
                                                {part.name}
                                            </td>
                                            <td className="py-4 font-bold text-indigo-600 dark:text-indigo-400">
                                                {formatCurrency(part.price)}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                        isLowStock 
                                                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse' 
                                                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    }`}>
                                                        {part.stock} items
                                                    </span>
                                                    {isLowStock && (
                                                        <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
                                                            <AlertTriangle className="h-3.5 w-3.5" />
                                                            Low
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 text-xs font-semibold text-slate-400">
                                                {part.min_stock_threshold} min
                                            </td>
                                            {canModify && (
                                                <td className="py-4 pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(part)}
                                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 hover:text-indigo-600 rounded-xl transition-colors"
                                                        >
                                                            <Edit className="h-4.5 w-4.5" />
                                                        </button>
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => deletePart(part.id)}
                                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 hover:text-rose-600 rounded-xl transition-colors"
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
                                    <td colSpan={canModify ? '6' : '5'} className="text-center py-10 text-slate-400">
                                        No parts found in inventory.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {parts.links.length > 3 && (
                    <div className="h-16 flex items-center justify-between px-6 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-xs text-slate-400">
                            Showing {parts.from} to {parts.to} of {parts.total} parts
                        </span>
                        <div className="flex gap-2">
                            {parts.links.map((link, idx) => (
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
                                {editingPart ? 'Edit Part Details' : 'Add New Spare Part'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Part Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. Front Brake Pads Set"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Tag className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
                            </div>

                            {/* SKU */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">SKU / Catalog No.</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.sku}
                                        onChange={e => setData('sku', e.target.value)}
                                        placeholder="e.g. BRK-FRT-PRU"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs uppercase"
                                    />
                                    <Settings className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.sku && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.sku}</p>}
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Unit Price (LKR)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Coins className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                                {errors.price && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.price}</p>}
                            </div>

                            {/* Stock & Min Threshold */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Initial Stock</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            value={data.stock}
                                            onChange={e => setData('stock', e.target.value)}
                                            placeholder="0"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Boxes className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                    </div>
                                    {errors.stock && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.stock}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Low Stock Threshold</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            value={data.min_stock_threshold}
                                            onChange={e => setData('min_stock_threshold', e.target.value)}
                                            placeholder="5"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <AlertTriangle className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                    </div>
                                    {errors.min_stock_threshold && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.min_stock_threshold}</p>}
                                </div>
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
                                    {editingPart ? 'Save Changes' : 'Add to Stock'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
