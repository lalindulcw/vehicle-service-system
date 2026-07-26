import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Printer, 
    ArrowLeft, 
    Receipt, 
    Calendar, 
    User, 
    Car, 
    Wrench,
    CheckCircle2,
    Clock
} from 'lucide-react';

export default function Show({ invoice }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const handlePrint = () => {
        window.print();
    };

    const booking = invoice.booking;

    return (
        <AuthenticatedLayout header="Invoice Details">
            <Head title={`Invoice ${invoice.invoice_no}`} />

            {/* Print Header Controls (Hidden during print) */}
            <div className="flex justify-between items-center mb-6 print:hidden">
                <Link
                    href={route('invoices.index')}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Invoices
                </Link>

                <button
                    onClick={handlePrint}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                >
                    <Printer className="h-5 w-5" />
                    Print / Export PDF
                </button>
            </div>

            {/* Invoice Sheet container */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm max-w-4xl mx-auto print:border-0 print:shadow-none print:p-0 print:bg-white print:text-black">
                {/* Print Layout Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white print:bg-black">
                                <Car className="h-6 w-6" />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight text-indigo-600 dark:text-white print:text-black">
                                VMS Pro Service Center
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                            123 Galle Road, Colombo 03, Sri Lanka.<br />
                            Phone: +94 11 234 5678 | Email: support@vmspro.com
                        </p>
                    </div>

                    <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Receipt Invoice</span>
                        <h1 className="text-2xl font-extrabold font-mono text-slate-800 dark:text-white print:text-black mb-2">
                            {invoice.invoice_no}
                        </h1>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize print:border print:border-black ${
                            invoice.status === 'paid' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                            {invoice.status}
                        </span>
                    </div>
                </div>

                {/* Metadata Split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bill To:</h4>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white print:text-black">
                                <User className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                                {booking.customer.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Email: {booking.customer.email || 'N/A'}<br />
                                Phone: {booking.customer.phone}
                            </div>
                            {booking.customer.address && (
                                <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mt-1">
                                    Address: {booking.customer.address}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="sm:text-right">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Service Details:</h4>
                        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 sm:inline-block sm:text-left">
                            <div className="flex items-center gap-2 font-semibold">
                                <Car className="h-4 w-4 text-slate-400" />
                                Vehicle: <span className="font-bold text-slate-700 dark:text-slate-200 print:text-black">{booking.vehicle.registration_no}</span>
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 pl-6">
                                {booking.vehicle.make} {booking.vehicle.model} ({booking.vehicle.year})
                            </div>
                            <div className="flex items-center gap-2 font-semibold mt-1">
                                <Wrench className="h-4 w-4 text-slate-400" />
                                Mechanic: <span className="font-semibold text-slate-700 dark:text-slate-200 print:text-black">{booking.mechanic ? booking.mechanic.name : 'Unassigned'}</span>
                            </div>
                            <div className="flex items-center gap-2 font-semibold mt-1">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                Date: <span>{new Date(invoice.created_at).toLocaleDateString('en-LK', { dateStyle: 'long' })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing details table */}
                <div className="py-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="pb-3">Description</th>
                                <th className="pb-3 text-right">Qty</th>
                                <th className="pb-3 text-right">Unit Price</th>
                                <th className="pb-3 pr-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {/* Labor item */}
                            <tr className="text-sm">
                                <td className="py-4 font-semibold text-slate-800 dark:text-slate-200 print:text-black">
                                    Professional Labor & Service Fee
                                </td>
                                <td className="py-4 text-right text-slate-400">1</td>
                                <td className="py-4 text-right text-slate-500 dark:text-slate-400">{formatCurrency(invoice.total_labor)}</td>
                                <td className="py-4 pr-4 text-right font-bold text-slate-800 dark:text-white print:text-black">
                                    {formatCurrency(invoice.total_labor)}
                                </td>
                            </tr>

                            {/* Parts items */}
                            {booking.parts.map((part) => (
                                <tr key={part.id} className="text-sm">
                                    <td className="py-4 text-slate-600 dark:text-slate-300 print:text-black">
                                        Spare Part: {part.name}
                                        <span className="block text-xs text-slate-400 font-mono">{part.sku}</span>
                                    </td>
                                    <td className="py-4 text-right text-slate-500 dark:text-slate-400">{part.pivot.quantity}</td>
                                    <td className="py-4 text-right text-slate-500 dark:text-slate-400">{formatCurrency(part.pivot.unit_price)}</td>
                                    <td className="py-4 pr-4 text-right font-bold text-slate-800 dark:text-white print:text-black">
                                        {formatCurrency(part.pivot.quantity * part.pivot.unit_price)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Subtotals & Grand Total */}
                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-full sm:max-w-xs space-y-3 text-sm">
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                            <span>Labor Fee:</span>
                            <span className="font-semibold">{formatCurrency(invoice.total_labor)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                            <span>Parts Total:</span>
                            <span className="font-semibold">{formatCurrency(invoice.total_parts)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-extrabold border-t border-slate-200 dark:border-slate-800 pt-3 text-slate-900 dark:text-white print:text-black">
                            <span>Grand Total:</span>
                            <span>{formatCurrency(invoice.total_amount)}</span>
                        </div>
                    </div>
                </div>

                {/* Stamps / Paid Info */}
                {invoice.status === 'paid' && (
                    <div className="mt-12 flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-6 rounded-2xl print:border print:border-black print:bg-white">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">Invoice Paid & Cleared</h4>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Method: <span className="uppercase font-semibold">{invoice.payment_method}</span> | Date: {new Date(invoice.paid_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="hidden sm:block font-mono border-2 border-dashed border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-500 font-extrabold uppercase px-4 py-2 rounded-xl rotate-12 text-sm select-none">
                            PAID
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
