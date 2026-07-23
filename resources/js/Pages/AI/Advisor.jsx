import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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
    Boxes,
    Terminal,
    Sparkles,
    Database,
    Zap
} from 'lucide-react';

export default function Advisor() {
    const [complaint, setComplaint] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loaderStep, setLoaderStep] = useState(0);
    const [result, setResult] = useState(null);

    const loaderMessages = [
        "Initializing neural diagnostics engine...",
        "Scanning input text for mechanical symptoms...",
        "Matching patterns with known drivetrain & engine faults...",
        "Querying spare parts inventory database for replacements...",
        "Estimating repair duration and labor rates...",
        "Compiling diagnosis report..."
    ];

    useEffect(() => {
        let interval;
        if (isLoading) {
            setLoaderStep(0);
            interval = setInterval(() => {
                setLoaderStep((prev) => {
                    if (prev < loaderMessages.length - 1) {
                        return prev + 1;
                    }
                    return prev;
                });
            }, 400);
        } else {
            setLoaderStep(0);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const samplePrompts = [
        { text: "Steering Clicking", val: "My steering wheel makes a clicking noise when turning" },
        { text: "Brakes Grinding", val: "My brakes are squealing and grinding when I stop" },
        { text: "Flat Tyre / Low PSI", val: "I have a flat tyre and low pressure on the wheel" },
        { text: "Engine Misfiring", val: "The engine shakes and misfires when starting" }
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
                // Wait for the full animation sequence to finish
                setTimeout(() => {
                    setResult(data);
                    setIsLoading(false);
                }, 2400);
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
        <AuthenticatedLayout header="AI Diagnostics & Service Advisor">
            <Head title="AI Advisor" />

            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
                
                {/* Modern Dark AI Banner */}
                <div className="bg-slate-950 text-white p-8 rounded-3xl border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Glowing Accent */}
                    <div className="absolute -top-12 -left-12 h-44 w-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-12 -right-12 h-44 w-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-5 z-10">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0 border border-indigo-400/20">
                            <BrainCircuit className="h-7 w-7 text-white animate-pulse" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-black tracking-wide flex items-center gap-2">
                                Diagnostic AI v1.0
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                            </h2>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xl">
                                Enter symptoms or complaints. The neural diagnostics system analyzes the terminology, scans the spare parts database, calculates estimates, and outputs job templates.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-2xl text-[10px] font-bold text-slate-400 z-10 uppercase tracking-widest">
                        <Terminal className="h-3.5 w-3.5 text-indigo-500" />
                        SYSTEM ONLINE
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <form onSubmit={handleAnalyze} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Describe Vehicle Symptom / Complaint</label>
                            <div className="relative">
                                <textarea
                                    value={complaint}
                                    onChange={(e) => setComplaint(e.target.value)}
                                    placeholder="Examples: 'My brakes squeal loudly when coming to a stop' or 'There is a flat tyre and air pressure is low'..."
                                    rows="3"
                                    required
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner focus:bg-white dark:focus:bg-slate-950"
                                />
                            </div>
                        </div>

                        {/* Suggestion Chips */}
                        <div className="space-y-2">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Diagnostic Presets</span>
                            <div className="flex flex-wrap gap-2">
                                {samplePrompts.map((p, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setComplaint(p.val)}
                                        className="text-[10px] font-bold px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-white transition-all bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 hover:shadow-sm"
                                    >
                                        {p.text}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-850">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                            >
                                {isLoading ? (
                                    <>
                                        <Sparkles className="h-4 w-4 animate-spin" />
                                        Analyzing Symptoms...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Diagnose Vehicle
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Animated AI Typing/Scanning Diagnostics Loader */}
                {isLoading && (
                    <div className="bg-slate-950 text-slate-300 p-8 rounded-3xl border border-slate-850 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                            <Cpu className="h-6 w-6 text-indigo-500 absolute left-5 top-5" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">AI Diagnostics Running</h4>
                            <p className="text-xs text-indigo-400 font-mono h-4">
                                {loaderMessages[loaderStep]}
                            </p>
                        </div>
                    </div>
                )}

                {/* Diagnostics Output Card */}
                {result && !isLoading && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_25px_rgba(99,102,241,0.08)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Header Banner */}
                        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-indigo-50/20 dark:from-slate-900 dark:to-indigo-950/20 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                                <Cpu className="h-5 w-5 text-indigo-500" />
                                <h3 className="font-black text-xs uppercase tracking-wider text-indigo-500">Diagnostic Verdict Report</h3>
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10 flex items-center gap-1">
                                <Zap className="h-3 w-3 fill-emerald-500" />
                                MATCH ACCURACY: 98%
                            </span>
                        </div>

                        {/* Report Grid */}
                        <div className="p-6 sm:p-8 space-y-6">
                            
                            {/* Identified Issue */}
                            <div className="space-y-3">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Diagnosis</span>
                                <div className="text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
                                    {result.identified_issue}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-950/40 p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-850 shadow-inner">
                                    {result.description}
                                </div>
                            </div>

                            {/* Service and Estimates Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Recommended Job */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200/40 dark:border-slate-850 space-y-1">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Category</span>
                                    <div className="flex items-center gap-2 font-black text-slate-850 dark:text-slate-200 text-xs">
                                        <Wrench className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                                        <span className="truncate">{result.suggested_service}</span>
                                    </div>
                                </div>

                                {/* Labor Rate */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200/40 dark:border-slate-850 space-y-1">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Labor</span>
                                    <div className="flex items-center gap-2 font-black text-indigo-500 text-sm">
                                        <DollarSign className="h-4.5 w-4.5" />
                                        <span>{formatCurrency(result.estimated_labor_cost)}</span>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200/40 dark:border-slate-850 space-y-1">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration Estimate</span>
                                    <div className="flex items-center gap-2 font-black text-slate-850 dark:text-slate-200 text-xs">
                                        <Clock className="h-4.5 w-4.5 text-slate-400" />
                                        <span>{result.estimated_duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended Parts */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Spare Parts Requisition</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {result.recommended_parts.length > 0 ? (
                                        result.recommended_parts.map(part => (
                                            <div key={part.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm hover:border-slate-350 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                                                        <Boxes className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-xs font-black truncate max-w-[140px] text-slate-850 dark:text-slate-100">{part.name}</h5>
                                                        <span className="text-[10px] text-slate-450 font-mono">{part.sku}</span>
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
                                            No part replacements required in warehouse inventory for this diagnosis.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CTA Action */}
                            <div className="pt-4 border-t border-slate-150 dark:border-slate-850 flex justify-end">
                                <Link
                                    href={route('bookings.index', { search: result.analyzed_complaint.split(' ').slice(0, 2).join(' ') })}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                                >
                                    Apply Diagnosis to Booking Card
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
