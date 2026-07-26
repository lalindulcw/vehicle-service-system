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
    Coins
} from 'lucide-react';

export default function Index({ invoices, uninvoicedBookings, filters }) {
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [payingInvoice, setPayingInvoice] = useState(null);

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
        <AuthenticatedLayout header="Billing & Invoicing">
            <Head title="Billing" />

            {/* Layout Split: Left (Generated Invoices), Right (Uninvoiced Completed Jobs queue) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Generated Invoices Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        {/* Filters */}
                        <div className="flex gap-1 w-full sm:w-auto">
                            {['all', 'pending', 'paid'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusFilterChange(status)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                                        selectedStatus === status 
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                                        : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <form onSubmit={runSearch} className="relative w-full sm:max-w-xs">
                            <input
                                type="text"
                                placeholder="Search INV no, customer..."
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs focus:ring-indigo-500"
                            />
                            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        </form>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
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
                                                <td className="py-4 pl-6">
                                                    <Link 
                                                        href={route('invoices.show', invoice.id)}
                                                        className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:text-indigo-500 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1 transition-colors"
                                                    >
                                                        <Receipt className="h-3.5 w-3.5" />
                                                        {invoice.invoice_no}
                                                    </Link>
                                                </td>
                                                <td className="py-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        {invoice.booking.customer.name}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {invoice.booking.vehicle.registration_no}
                                                    </div>
                                                </td>
                                                <td className="py-4 font-extrabold text-slate-900 dark:text-white">
                                                    {formatCurrency(invoice.total_amount)}
                                                </td>
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                                        invoice.status === 'paid' 
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse'
                                                    }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${invoice.status === 'paid' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                        {invoice.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {invoice.status === 'pending' && (
                                                            <button
                                                                onClick={() => openPayModal(invoice)}
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-sm shadow-emerald-500/10"
                                                            >
                                                                Process Pay
                                                            </button>
                                                        )}
                                                        <Link
                                                            href={route('invoices.show', invoice.id)}
                                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors"
                                                            title="Print/View Invoice"
                                                        >
                                                            <FileText className="h-4.5 w-4.5" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-10 text-slate-400">
                                                No invoices recorded.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {invoices.links.length > 3 && (
                            <div className="h-16 flex items-center justify-between px-6 border-t border-slate-200 dark:border-slate-800">
                                <span className="text-xs text-slate-400">
                                    Showing {invoices.from} to {invoices.to} of {invoices.total} invoices
                                </span>
                                <div className="flex gap-2">
                                    {invoices.links.map((link, idx) => (
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
                </div>

                {/* Right Side: Uninvoiced Completed Jobs queue */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <h3 className="text-base font-bold mb-1.5 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-500" />
                            Completed Jobs Queue
                        </h3>
                        <p className="text-xs text-slate-400 mb-4">Select finished maintenance jobs to generate invoices</p>

                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                            {uninvoicedBookings.length > 0 ? (
                                uninvoicedBookings.map(booking => (
                                    <div key={booking.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-mono text-xs font-bold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                                                    {booking.vehicle.registration_no}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-semibold">
                                                    {new Date(booking.scheduled_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">{booking.customer.name}</h4>
                                            <p className="text-xs text-slate-400 truncate">{booking.vehicle.make} {booking.vehicle.model}</p>
                                        </div>

                                        <button
                                            onClick={() => handleGenerateInvoice(booking.id)}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                        >
                                            <CircleDollarSign className="h-4 w-4" />
                                            Generate Invoice
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-400 text-xs italic">
                                    No completed jobs awaiting billing.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Process Modal */}
            {isPayModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-lg">Process Invoice Payment</h3>
                            <button onClick={closePayModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col gap-1">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Amount Due</span>
                                <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                                    {formatCurrency(payingInvoice.total_amount)}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono mt-1">Invoice: {payingInvoice.invoice_no}</span>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Method</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'cash', label: 'Cash' },
                                        { id: 'card', label: 'Card' },
                                        { id: 'bank_transfer', label: 'Bank' }
                                    ].map(method => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setData('payment_method', method.id)}
                                            className={`py-3.5 rounded-xl text-xs font-bold border transition-all ${
                                                data.payment_method === method.id 
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                                                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-500'
                                            }`}
                                        >
                                            {method.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={closePayModal}
                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
                                >
                                    <CheckCircle className="h-4.5 w-4.5" />
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
