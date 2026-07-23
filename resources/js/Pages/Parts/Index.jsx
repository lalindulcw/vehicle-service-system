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
    Settings,
    Tag,
    Coins,
    Boxes,
    AlertTriangle,
    Grid,
    List,
    AlertCircle,
    Info
} from 'lucide-react';

export default function Index({ parts, filters, stats }) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Admin or Advisor can modify parts
    const canModify = user.roles.includes('Admin') || user.roles.includes('Service Advisor');
    const isAdmin = user.roles.includes('Admin');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPart, setEditingPart] = useState(null);
    const [partToDelete, setPartToDelete] = useState(null);
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    const { data, setData, post, put, errors, processing, reset, clearErrors } = useForm({
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

            {/* Premium Mini-Statistics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-350">
                {/* Stat 1: Total Stock */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Unique Parts</span>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stats.total}</h4>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center z-10 shadow-sm">
                        <Boxes className="h-5 w-5" />
                    </div>
                    <div className="absolute right-0 bottom-0 h-20 w-20 bg-indigo-500/5 rounded-tl-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Stat 2: Low Stock Warnings */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Low Stock Alerts</span>
                        <h4 className={`text-3xl font-black ${stats.low_stock > 0 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
                            {stats.low_stock}
                        </h4>
                    </div>
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center z-10 shadow-sm ${
                        stats.low_stock > 0 ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                    }`}>
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="absolute right-0 bottom-0 h-20 w-20 bg-amber-500/5 rounded-tl-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Stat 3: Out of Stock */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Out of Stock Parts</span>
                        <h4 className={`text-3xl font-black ${stats.out_of_stock > 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                            {stats.out_of_stock}
                        </h4>
                    </div>
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center z-10 shadow-sm ${
                        stats.out_of_stock > 0 ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                    }`}>
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="absolute right-0 bottom-0 h-20 w-20 bg-rose-500/5 rounded-tl-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                
                {/* Search Bar with Quick Clear Button */}
                <form onSubmit={runSearch} className="relative w-full md:max-w-md">
                    <input
                        type="text"
                        placeholder="Search part name or SKU..."
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
                                router.get(route('parts.index'), {}, { preserveState: true });
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

                    {canModify && (
                        <button
                            onClick={openCreateModal}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                        >
                            <Plus className="h-4.5 w-4.5" />
                            Add Part
                        </button>
                    )}
                </div>
            </div>

            {/* Grid View Mode */}
            {viewMode === 'grid' && (
                <>
                    {parts.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-300">
                            {parts.data.map((part) => {
                                const isOutOfStock = part.stock === 0;
                                const isLowStock = part.stock <= part.min_stock_threshold && part.stock > 0;
                                
                                return (
                                    <div 
                                        key={part.id}
                                        className={`bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${
                                            isOutOfStock 
                                            ? 'border-rose-500/30 dark:border-rose-500/20' 
                                            : isLowStock 
                                            ? 'border-amber-500/30 dark:border-amber-500/20' 
                                            : 'border-slate-200 dark:border-slate-800/80'
                                        }`}
                                    >
                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                                                        {part.name}
                                                    </h3>
                                                    <span className="text-[10px] font-mono tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md uppercase">
                                                        SKU: {part.sku}
                                                    </span>
                                                </div>
                                                
                                                {/* Stock Threshold Alerts Badges */}
                                                {isOutOfStock ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                                        <AlertCircle className="h-3 w-3" />
                                                        Out of Stock
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                        In Stock
                                                    </span>
                                                )}
                                            </div>

                                            {/* Price Badge */}
                                            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                                                <Coins className="h-4 w-4 text-indigo-500 shrink-0" />
                                                <span className="font-extrabold text-sm text-slate-950 dark:text-slate-100">
                                                    {formatCurrency(part.price)}
                                                </span>
                                            </div>

                                            {/* Stock Indicator Progress Bar */}
                                            <div className="pt-2 space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Boxes className="h-3.5 w-3.5" />
                                                        Stock Level
                                                    </span>
                                                    <span className="text-slate-900 dark:text-white font-extrabold">
                                                        {part.stock} Units
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-850">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            isOutOfStock 
                                                            ? 'bg-rose-500' 
                                                            : isLowStock 
                                                            ? 'bg-amber-500' 
                                                            : 'bg-indigo-600'
                                                        }`} 
                                                        style={{ width: `${Math.min((part.stock / 40) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center text-[9px] text-slate-400 pt-0.5">
                                                    <span>Min Limit: {part.min_stock_threshold} units</span>
                                                    {isLowStock && <span className="text-amber-500 font-medium">Reorder required</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions Tray */}
                                        {canModify && (
                                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-855 flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openEditModal(part)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 hover:text-indigo-600 rounded-xl transition-all"
                                                    title="Edit Part details"
                                                >
                                                    <Edit className="h-4.5 w-4.5" />
                                                </button>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => setPartToDelete(part)}
                                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 text-rose-500 hover:text-rose-600 rounded-xl transition-all"
                                                        title="Delete from stock record"
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
                                <Boxes className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">No Spare Parts Registered</h3>
                            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                                Add automotive parts to your workshop inventory database. You can track prices, minimum stock alerts, and deduct quantity automatically during service invoice checkouts.
                            </p>
                            {canModify && (
                                <button
                                    onClick={openCreateModal}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                                >
                                    Register First Part
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
                                    <th className="py-4 pl-6 cursor-pointer" onClick={() => sortBy('sku')}>
                                        <div className="flex items-center gap-1.5">
                                            SKU / Part No.
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </div>
                                    </th>
                                    <th className="py-4 cursor-pointer" onClick={() => sortBy('name')}>
                                        <div className="flex items-center gap-1.5">
                                            Name
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </div>
                                    </th>
                                    <th className="py-4 cursor-pointer text-right" onClick={() => sortBy('price')}>
                                        <div className="flex items-center justify-end gap-1.5">
                                            Unit Price
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </div>
                                    </th>
                                    <th className="py-4 cursor-pointer text-center" onClick={() => sortBy('stock')}>
                                        <div className="flex items-center justify-center gap-1.5">
                                            Stock Level
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </div>
                                    </th>
                                    <th className="py-4 text-center">Status</th>
                                    {canModify && <th className="py-4 pr-6 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {parts.data.length > 0 ? (
                                    parts.data.map((part) => {
                                        const isOutOfStock = part.stock === 0;
                                        const isLowStock = part.stock <= part.min_stock_threshold && part.stock > 0;
                                        
                                        return (
                                            <tr key={part.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors text-sm">
                                                <td className="py-4 pl-6 font-mono font-bold text-slate-900 dark:text-white uppercase">
                                                    {part.sku}
                                                </td>
                                                <td className="py-4 font-semibold text-slate-950 dark:text-slate-100">
                                                    {part.name}
                                                </td>
                                                <td className="py-4 text-right font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(part.price)}
                                                </td>
                                                <td className="py-4 text-center font-extrabold text-slate-950 dark:text-slate-100">
                                                    {part.stock} units
                                                </td>
                                                <td className="py-4 text-center">
                                                    {isOutOfStock ? (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                                            Out of Stock
                                                        </span>
                                                    ) : isLowStock ? (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                            In Stock
                                                        </span>
                                                    )}
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
                                                                    onClick={() => setPartToDelete(part)}
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
                                        <td colSpan={canModify ? 6 : 5} className="text-center py-16 text-slate-400">
                                            <div className="flex flex-col items-center space-y-2">
                                                <AlertCircle className="h-6 w-6 text-slate-300" />
                                                <span>No parts match the search criteria.</span>
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
            {parts.links.length > 3 && (
                <div className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                    <span className="text-xs text-slate-400">
                        Showing {parts.from} to {parts.to} of {parts.total} parts
                    </span>
                    <div className="flex gap-2">
                        {parts.links.map((link, idx) => {
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
            {partToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="mx-auto h-16 w-16 bg-rose-50 dark:bg-rose-500/10 text-rose-600 flex items-center justify-center rounded-3xl border border-rose-500/10">
                            <Trash2 className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-extrabold text-lg">Confirm Delete Part</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Are you sure you want to delete part <span className="font-bold text-slate-900 dark:text-white">"{partToDelete.name}"</span>? This action cannot be undone and will verify that it is not used in active booking invoices.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setPartToDelete(null)}
                                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    router.delete(route('parts.destroy', partToDelete.id), {
                                        onSuccess: () => setPartToDelete(null)
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
                                {editingPart ? 'Edit Stock Registry' : 'Register New Spare Part'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Part Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Part / Item Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. Front Brake Pads"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Settings className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                                {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
                            </div>

                            {/* SKU */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">SKU / Code Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.sku}
                                        onChange={e => setData('sku', e.target.value)}
                                        placeholder="e.g. BRK-FRT-PRU"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase"
                                    />
                                    <Tag className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
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
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Coins className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                </div>
                                {errors.price && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.price}</p>}
                            </div>

                            {/* Stock & Threshold */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Initial Stock Qty</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            value={data.stock}
                                            onChange={e => setData('stock', e.target.value)}
                                            placeholder="e.g. 20"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <Boxes className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.stock && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.stock}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Min Stock Alert Limit</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            value={data.min_stock_threshold}
                                            onChange={e => setData('min_stock_threshold', e.target.value)}
                                            placeholder="5"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <AlertTriangle className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3.5" />
                                    </div>
                                    {errors.min_stock_threshold && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.min_stock_threshold}</p>}
                                </div>
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
