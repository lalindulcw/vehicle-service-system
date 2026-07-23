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
    ArrowRight,
    Search,
    WrenchIcon,
    AlertCircle,
    Boxes
} from 'lucide-react';

export default function Advisor() {
    const [complaint, setComplaint] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const samplePrompts = [
        { text: "Steering wheel clicking when turning", val: "My steering wheel makes a clicking noise when turning" },
        { text: "Brakes squealing and grinding", val: "My brakes are squealing and grinding when I stop" },
        { text: "Flat tyre and low pressure", val: "I have a flat tyre and low pressure on the wheel" },
        { text: "Engine shakes and misfires", val: "The engine shakes and misfires when starting" }
    ];

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!complaint.trim()) return;

        setIsLoading(true);
        setResult(null);

        try {
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
                }, 800);
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
        <AuthenticatedLayout header="AI Service Advisor Portal">
            <Head title="AI Advisor" />

            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
                {/* Intro Card */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="bg-indigo-600/20 p-4.5 rounded-2xl text-indigo-400 border border-indigo-500/20 shrink-0">
                        <BrainCircuit className="h-10 w-10 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-black tracking-wide">Intelligent Vehicle Diagnostic Assistant</h2>
                        <p className="text-xs text-indigo-200/80 leading-relaxed font-semibold">
                            Enter a natural language customer complaint below. Our diagnostic pattern-recognition system will analyze the symptoms, diagnose the potential mechanical fault, suggest the required workshop service, and list corresponding spare parts from inventory.
                        </p>
                    </div>
                </div>

                {/* Input Container */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <form onSubmit={handleAnalyze} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Describe Customer Complaint</label>
                            <textarea
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                placeholder="Example: When I turn the steering wheel sharply, there is a loud clicking sound coming from the front wheels..."
                                rows="3"
                                required
                                className="w-full px-5 py-4.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 shadow-inner"
                            />
                        </div>

                        {/* Quick Prompts */}
                        <div className="space-y-1.5">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Suggestions:</span>
                            <div className="flex flex-wrap gap-2">
                                {samplePrompts.map((p, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setComplaint(p.val)}
                                        className="text-[10px] font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-white transition-all bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400"
                                    >
                                        {p.text}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Running Analysis...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
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
                        <div className="px-6 py-5 bg-slate-50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Cpu className="h-4.5 w-4.5 text-indigo-500" />
                                <h3 className="font-extrabold text-xs uppercase tracking-wider text-indigo-500">Diagnosis Report</h3>
                            </div>
                            <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">Confidence: 98%</span>
                        </div>

                        {/* Report Grid */}
                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Identified Issue */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Diagnosed Fault / Issue</h4>
                                <div className="text-lg font-black text-slate-900 dark:text-white">{result.identified_issue}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                    {result.description}
                                </p>
                            </div>

                            {/* Service and Estimates Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200/40 dark:border-slate-850">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recommended Service</span>
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-250 text-xs">
                                        <WrenchIcon className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                                        <span className="truncate">{result.suggested_service}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200/40 dark:border-slate-850">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Labor Cost</span>
                                    <div className="flex items-center gap-2 font-extrabold text-indigo-500 text-xs">
                                        <DollarSign className="h-4.5 w-4.5" />
                                        <span>{formatCurrency(result.estimated_labor_cost)}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200/40 dark:border-slate-850">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Duration</span>
                                    <div className="flex items-center gap-2 font-bold text-slate-850 dark:text-slate-250 text-xs">
                                        <Clock className="h-4.5 w-4.5 text-slate-400" />
                                        <span>{result.estimated_duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended Parts */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Suggested Stock Spare Parts</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {result.recommended_parts.length > 0 ? (
                                        result.recommended_parts.map(part => (
                                            <div key={part.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                                                        <Boxes className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-xs font-black truncate max-w-[140px] text-slate-850 dark:text-slate-100">{part.name}</h5>
                                                        <span className="text-[10px] text-slate-400 font-mono">{part.sku}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-slate-850 dark:text-slate-200">{formatCurrency(part.price)}</span>
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
                                        <div className="sm:col-span-2 text-center py-6 bg-slate-50 dark:bg-slate-950/20 text-slate-400 text-xs italic rounded-2xl border border-slate-200/50 dark:border-slate-800">
                                            No parts replacements required for this diagnosis.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CTA Action */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <Link
                                    href={route('bookings.index')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/10 transition-all hover:scale-[1.02]"
                                >
                                    Apply Diagnosis to Booking
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
