import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Search, 
    ChevronLeft, 
    ChevronRight, 
    History, 
    User, 
    Clock, 
    Activity,
    Info,
    X
} from 'lucide-react';

export default function Index({ logs, filters }) {
    const [searchVal, setSearchVal] = useState(filters.search || '');
    const [selectedProperties, setSelectedProperties] = useState(null);

    const runSearch = (e) => {
        e.preventDefault();
        router.get(route('logs.index'), { search: searchVal }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout header="System Audit Trail">
            <Head title="Audit Trail" />

            {/* Header / Search bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h3 className="text-base font-bold flex items-center gap-2">
                        <History className="h-5 w-5 text-indigo-500" />
                        Activity Logs & Actions
                    </h3>
                    <p className="text-xs text-slate-400">Track user operations and database changes sequentially</p>
                </div>

                <form onSubmit={runSearch} className="relative w-full sm:max-w-xs">
                    <input
                        type="text"
                        placeholder="Search logs by action, description..."
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs focus:ring-indigo-500"
                    />
                    <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                </form>
            </div>

            {/* Logs Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                <th className="py-4 pl-6">Timestamp</th>
                                <th className="py-4">Operator</th>
                                <th className="py-4">Action</th>
                                <th className="py-4">Description</th>
                                <th className="py-4 pr-6 text-right">Data Payload</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {logs.data.length > 0 ? (
                                logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors text-sm">
                                        <td className="py-4 pl-6 text-slate-500 dark:text-slate-400 font-mono text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-4 w-4 text-indigo-500" />
                                                {new Date(log.created_at).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2 font-semibold">
                                                <User className="h-4 w-4 text-slate-400" />
                                                {log.user ? log.user.name : 'System Scheduler'}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-200/20">
                                                <Activity className="h-3.5 w-3.5" />
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-4 text-slate-600 dark:text-slate-300 font-medium">
                                            {log.description}
                                        </td>
                                        <td className="py-4 pr-6 text-right">
                                            {log.properties ? (
                                                <button
                                                    onClick={() => setSelectedProperties(log.properties)}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-600 hover:underline"
                                                >
                                                    <Info className="h-4 w-4" />
                                                    View Details
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">No payload</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-slate-400">
                                        No activity logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {logs.links.length > 3 && (
                    <div className="h-16 flex items-center justify-between px-6 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-xs text-slate-400">
                            Showing {logs.from} to {logs.to} of {logs.total} log events
                        </span>
                        <div className="flex gap-2">
                            {logs.links.map((link, idx) => (
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

            {/* Properties JSON Viewer Modal popup */}
            {selectedProperties && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-base">Metadata Data Payload</h3>
                            <button onClick={() => setSelectedProperties(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <pre className="text-xs font-mono bg-slate-950 text-emerald-400 p-5 rounded-2xl border border-slate-800 overflow-x-auto max-h-[300px] leading-relaxed custom-scrollbar">
                                {JSON.stringify(
                                    typeof selectedProperties === 'string' ? JSON.parse(selectedProperties) : selectedProperties, 
                                    null, 
                                    4
                                )}
                            </pre>
                            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                                <button
                                    onClick={() => setSelectedProperties(null)}
                                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
