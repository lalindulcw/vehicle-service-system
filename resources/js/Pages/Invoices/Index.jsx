import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    ArrowUpDown,
    Receipt,
    Clock,
    User,
    Car,
    FileText,
    CircleDollarSign,
    CheckCircle,
    ArrowRightCircle,
    X,
    Coins,
    Grid,
    List,
    AlertCircle,
    DollarSign,
    CreditCard
} from 'lucide-react';

export default function Index({ invoices, uninvoicedBookings, filters, stats }) {
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [payingInvoice, setPayingInvoice] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    // Pay Form using Inertia useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        payment_method: 'cash'
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const runSearch = (e) => {
        e.preventDefault();
        router.get(route('invoices.index'), { 
            search: searchVal,
            status: selectedStatus,
            sort_field: filters.sort_field,
            sort_direction: filters.sort_direction
        }, { preserveState: true });
    };

    const handleStatusFilterChange = (status) => {
        setSelectedStatus(status);
        router.get(route('invoices.index'), { 
            search: searchVal,
            status: status,
            sort_field: filters.sort_field,
            sort_direction: filters.sort_direction
        }, { preserveState: true });
    };

    const sortBy = (field) => {
        const direction = filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc';
        router.get(route('invoices.index'), { 
            search: searchVal,
            status: selectedStatus,
            sort_field: field,
            sort_direction: direction
        }, { preserveState: true });
    };

    const handleGenerateInvoice = (bookingId) => {
        router.post(route('invoices.store'), { booking_id: bookingId });
    };

    const openPayModal = (invoice) => {
        setPayingInvoice(invoice);
        setIsPayModalOpen(true);
    };

    const closePayModal = () => {
        setIsPayModalOpen(false);
        setPayingInvoice(null);
        reset();
    };

    const handlePaySubmit = (e) => {
        e.preventDefault();
        post(route('invoices.pay', payingInvoice.id), {
            onSuccess: () => closePayModal()
        });
    };

    return (
        <AuthenticatedLayout header="Billing & Invoicing Panel">
            <Head title="Billing" />

            {/* Premium Mini-Statistics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8 animate-in fade-in duration-350">
                {/* Stat 1: Total Invoiced */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Invoices</span>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</h4>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center z-10">
                        <Receipt className="h-4.5 w-4.5" />
                    </div>
                </div>

                {/* Stat 2: Total Revenue */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
                        <h4 className="text-2xl font-black text-emerald-500">{formatCurrency(stats.revenue)}</h4>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center z-10">
                        <Coins className="h-4.5 w-4.5" />
                    </div>
                </div>

                {/* Stat 3: Paid */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Paid Invoices</span>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white">{stats.paid}</h4>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-emerald-500 flex items-center justify-center z-10">
                        <CheckCircle className="h-4.5 w-4.5" />
                    </div>
                </div>

                {/* Stat 4: Pending */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 z-10">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Unpaid Balance</span>
                        <h4 className="text-2xl font-black text-amber-500">{stats.pending}</h4>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center z-10">
                        <Clock className="h-4.5 w-4.5" />
                    </div>
                </div>
            </div>

            {/* Layout Split: Left (Generated Invoices), Right (Uninvoiced Completed Jobs queue) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Side: Generated Invoices Table / Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        {/* Filters */}
                        <div className="flex gap-1.5 w-full sm:w-auto">
                            {['all', 'pending', 'paid'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusFilterChange(status)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                                        selectedStatus === status 
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                                        : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        {/* Search & Toggle view */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <form onSubmit={runSearch} className="relative flex-1 sm:max-w-xs">
                                <input
                                    type="text"
                                    placeholder="Search INV no, owner..."
                                    value={searchVal}
                                    onChange={(e) => setSearchVal(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                />
                                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                                {searchVal && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchVal('');
                                            router.get(route('invoices.index'), { status: selectedStatus }, { preserveState: true });
                                        }}
                                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-650"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </form>

                            {/* Grid/Table Toggle */}
                            <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex gap-0.5 border border-slate-200 dark:border-slate-800">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-lg transition-all ${
                                        viewMode === 'grid' 
                                        ? 'bg-white dark:bg-slate-800 text-indigo-500 shadow-sm' 
                                        : 'text-slate-400 hover:text-slate-650'
                                    }`}
                                    title="Grid View"
                                >
                                    <Grid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-1.5 rounded-lg transition-all ${
                                        viewMode === 'table' 
                                        ? 'bg-white dark:bg-slate-800 text-indigo-500 shadow-sm' 
                                        : 'text-slate-400 hover:text-slate-650'
                                    }`}
                                    title="Table List View"
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table View */}
                    {viewMode === 'table' && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-6 animate-in fade-in duration-300">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/20">
                                            <th className="py-4 pl-6 cursor-pointer" onClick={() => sortBy('invoice_no')}>
                                                <div className="flex items-center gap-1.5">
                                                    Invoice No.
                                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                                </div>
                                            </th>
                                            <th className="py-4">Customer & Vehicle</th>
                                            <th className="py-4 cursor-pointer" onClick={() => sortBy('total_amount')}>
                                                <div className="flex items-center gap-1.5">
                                                    Total Amount
                                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                                </div>
                                            </th>
                                            <th className="py-4">Status</th>
                                            <th className="py-4 pr-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {invoices.data.length > 0 ? (
                                            invoices.data.map((invoice) => (
                                                <tr key={invoice.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors text-sm">
                                                    <td className="py-4 pl-6 font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                                        {invoice.invoice_no}
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="font-bold text-slate-950 dark:text-slate-100">
                                                            {invoice.booking.customer.name}
                                                        </div>
                                                        <div className="text-xs text-slate-400 uppercase font-medium">
                                                            {invoice.booking.vehicle.registration_no}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 font-black text-slate-950 dark:text-slate-100">
                                                        {formatCurrency(invoice.total_amount)}
                                                    </td>
                                                    <td className="py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                                            invoice.status === 'paid' 
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                        }`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${invoice.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                            {invoice.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <Link
                                                                href={route('invoices.show', invoice.id)}
                                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors bg-indigo-500/5 dark:bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/10"
                                                            >
                                                                <FileText className="h-3.5 w-3.5" />
                                                                View Slip
                                                            </Link>
                                                            {invoice.status === 'pending' && (
                                                                <button
                                                                    onClick={() => openPayModal(invoice)}
                                                                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-all bg-emerald-500/10 px-3 py-1.5 rounded-xl"
                                                                >
                                                                    <Coins className="h-3.5 w-3.5" />
                                                                    Pay Bill
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-16 text-slate-400">
                                                    <div className="flex flex-col items-center space-y-2">
                                                        <AlertCircle className="h-6 w-6 text-slate-300" />
                                                        <span>No invoices registered.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Grid View */}
                    {viewMode === 'grid' && (
                        <>
                            {invoices.data.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-in fade-in duration-300">
                                    {invoices.data.map((invoice) => (
                                        <div 
                                            key={invoice.id}
                                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group hover:-translate-y-1"
                                        >
                                            <div className="space-y-4">
                                                {/* Header */}
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-0.5">
                                                        <span className="text-[10px] font-mono tracking-wider bg-indigo-500/5 text-indigo-500 px-2 py-0.5 rounded border border-indigo-500/10 uppercase block">
                                                            {invoice.invoice_no}
                                                        </span>
                                                    </div>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                                        invoice.status === 'paid' 
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                    }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${invoice.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                        {invoice.status}
                                                    </span>
                                                </div>

                                                {/* Details */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <User className="h-4 w-4 text-slate-400 shrink-0" />
                                                        <span className="font-bold text-slate-950 dark:text-slate-100">{invoice.booking.customer.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Car className="h-4 w-4 text-slate-400 shrink-0" />
                                                        <span className="font-mono text-slate-650 dark:text-slate-350">{invoice.booking.vehicle.registration_no}</span>
                                                    </div>
                                                </div>

                                                {/* Bill total */}
                                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                    <span className="text-xs text-slate-400 font-bold">Total Bill:</span>
                                                    <span className="text-lg font-black text-slate-950 dark:text-slate-100">{formatCurrency(invoice.total_amount)}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                                                <span className="text-[10px] text-slate-450 font-bold">
                                                    {invoice.paid_at ? `Paid ${new Date(invoice.paid_at).toLocaleDateString()}` : 'Payment Pending'}
                                                </span>
                                                
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route('invoices.show', invoice.id)}
                                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-500 hover:text-indigo-650 rounded-xl transition-all"
                                                        title="View Slip"
                                                    >
                                                        <FileText className="h-4.5 w-4.5" />
                                                    </Link>
                                                    {invoice.status === 'pending' && (
                                                        <button
                                                            onClick={() => openPayModal(invoice)}
                                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-850 text-emerald-500 hover:text-emerald-600 rounded-xl transition-all"
                                                            title="Process Payment"
                                                        >
                                                            <Coins className="h-4.5 w-4.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                                    No invoices generated.
                                </div>
                            )}
                        </>
                    )}

                    {/* Pagination Controls */}
                    {invoices.links.length > 3 && (
                        <div className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                            <span className="text-xs text-slate-400">
                                Showing {invoices.from} to {invoices.to} of {invoices.total} invoices
                            </span>
                            <div className="flex gap-2">
                                {invoices.links.map((link, idx) => {
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
                                                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Uninvoiced Completed Jobs queue */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="space-y-1">
                        <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">Uninvoiced Completed Jobs</h3>
                        <p className="text-xs text-slate-400 font-medium">Completed tasks awaiting bill generation</p>
                    </div>

                    <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                        {uninvoicedBookings.length > 0 ? (
                            uninvoicedBookings.map((booking) => (
                                <div 
                                    key={booking.id}
                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-250/60 dark:border-slate-800 flex flex-col justify-between space-y-3"
                                >
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="font-extrabold text-indigo-500 uppercase tracking-wider bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                                                {booking.vehicle.registration_no}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold">
                                                {new Date(booking.scheduled_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="font-bold text-slate-900 dark:text-white pt-1">
                                            Owner: {booking.customer.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            Vehicle: {booking.vehicle.make} {booking.vehicle.model}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleGenerateInvoice(booking.id)}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 transition-all hover:scale-[1.01]"
                                    >
                                        <Receipt className="h-4 w-4" />
                                        Generate Invoice
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400 text-xs italic">
                                No completed jobs in invoice queue.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pay Invoice Glassmorphic Modal */}
            {isPayModalOpen && payingInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="mx-auto h-14 w-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center rounded-2xl border border-emerald-500/10">
                            <CircleDollarSign className="h-7 w-7" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-extrabold text-lg">Process Bill Payment</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Settle invoice <span className="font-bold text-slate-900 dark:text-white">"{payingInvoice.invoice_no}"</span> for customer <span className="font-bold text-slate-900 dark:text-white">"{payingInvoice.booking.customer.name}"</span>.
                            </p>
                            <div className="text-xl font-black text-slate-950 dark:text-white pt-2">
                                Amount: {formatCurrency(payingInvoice.total_amount)}
                            </div>
                        </div>

                        <form onSubmit={handlePaySubmit} className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Payment Method</label>
                                <div className="relative">
                                    <select
                                        value={data.payment_method}
                                        onChange={e => setData('payment_method', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:ring-indigo-500"
                                    >
                                        <option value="cash" className="dark:bg-slate-900">Cash Payment</option>
                                        <option value="card" className="dark:bg-slate-900">Credit/Debit Card</option>
                                        <option value="bank_transfer" className="dark:bg-slate-900">Bank Wire Transfer</option>
                                    </select>
                                    <CreditCard className="h-4.5 w-4.5 text-slate-400 absolute left-3 top-3" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={closePayModal}
                                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                                >
                                    {processing && (
                                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    )}
                                    Confirm Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
