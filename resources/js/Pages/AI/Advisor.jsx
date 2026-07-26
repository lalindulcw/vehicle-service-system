import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Cpu, 
    Send, 
    Wrench, 
    Clock, 
    DollarSign, 
    Settings, 
    AlertTriangle, 
    CheckCircle,
    BrainCircuit,
    ArrowRight
} from 'lucide-react';

export default function Advisor() {
    const [complaint, setComplaint] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!complaint.trim()) return;

        setIsLoading(true);
        setResult(null);

        try {
            // Call Laravel API
            const response = await fetch(route('ai.analyze'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ complaint })
            });

            if (response.ok) {
                const data = await response.json();
                // Simulate a slight AI typing delay for visual aesthetics
                setTimeout(() => {
                    setResult(data);
                    setIsLoading(false);
                }, 1000);
            } else {
                alert('Analysis failed. Please try again.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error during AI analysis:', error);
            setIsLoading(false);
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
        <AuthenticatedLayout header="AI Service Advisor">
            <Head title="AI Advisor" />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Intro Card */}
                <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl border border-indigo-950/20 shadow-xl flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="bg-indigo-600/30 p-4 rounded-2xl text-indigo-400 border border-indigo-500/20 shrink-0">
                        <BrainCircuit className="h-10 w-10 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-1.5">Intelligent Vehicle Diagnostic Assistant</h2>
                        <p className="text-sm text-indigo-200/80 leading-relaxed">
                            Type or paste a natural language customer complaint (e.g. "My brakes are squealing and grinding when I stop at red lights") below. The AI pattern-recognition system will analyze the symptoms, diagnose the potential mechanical issue, suggest appropriate parts from stock, and estimate labor rates.
                        </p>
                    </div>
                </div>

                {/* Input Container */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <form onSubmit={handleAnalyze} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Describe Customer Complaint</label>
                            <textarea
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                placeholder="Example: When I turn the steering wheel sharply, there is a loud clicking or popping sound coming from the front wheels..."
                                rows="3"
                                required
                                className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Running Analysis...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4.5 w-4.5" />
                                        Run AI Diagnostics
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Diagnostics Output Card */}
                {result && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Header Banner */}
                        <div className="px-6 py-5 bg-indigo-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Cpu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="font-bold text-sm uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Diagnosis Report</h3>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Confidence: High</span>
                        </div>

                        {/* Report Grid */}
                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Identified Issue */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosed Fault / Issue</h4>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">{result.identified_issue}</div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                                    {result.description}
                                </p>
                            </div>

                            {/* Service and Estimates Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recommended Service</span>
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                                        <Wrench className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                                        <span className="truncate">{result.suggested_service}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Labor Cost</span>
                                    <div className="flex items-center gap-2 font-extrabold text-indigo-600 dark:text-indigo-400">
                                        <DollarSign className="h-4.5 w-4.5" />
                                        <span>{formatCurrency(result.estimated_labor_cost)}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Duration</span>
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                                        <Clock className="h-4.5 w-4.5 text-slate-400" />
                                        <span>{result.estimated_duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended Parts */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Suggested Stock Spare Parts</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {result.recommended_parts.length > 0 ? (
                                        result.recommended_parts.map(part => (
                                            <div key={part.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                                                <div>
                                                    <h5 className="text-sm font-bold truncate max-w-[160px]">{part.name}</h5>
                                                    <span className="text-[10px] text-slate-400 font-mono">{part.sku}</span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold">{formatCurrency(part.price)}</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                        part.low_stock 
                                                        ? 'bg-rose-500/10 text-rose-500' 
                                                        : 'bg-emerald-500/10 text-emerald-500'
                                                    }`}>
                                                        {part.low_stock ? 'Low Stock' : 'In Stock'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="sm:col-span-2 text-center py-4 bg-slate-50 dark:bg-slate-800/20 text-slate-400 text-xs italic rounded-2xl">
                                            No parts replacements required for this diagnosis.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CTA Action */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <Link
                                    href={route('bookings.index')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-sm flex items-center gap-1.5 shadow-lg shadow-indigo-500/10 transition-colors"
                                >
                                    Apply Diagnosis to Booking
                                    <ArrowRight className="h-4.5 w-4.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
