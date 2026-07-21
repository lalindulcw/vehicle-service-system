import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Car, 
    Wrench, 
    ShieldCheck, 
    BrainCircuit, 
    ArrowRight, 
    Coins, 
    CalendarRange,
    Play,
    Pause,
    Maximize,
    Volume2,
    X,
    Sparkles
} from 'lucide-react';

export default function Welcome({ auth }) {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState('advisor');

    return (
        <>
            <Head title="VMS Pro - Vehicle Service System" />
            
            {/* Custom Automotive Themed Premium UI */}
            <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
                
                {/* Glow Effects */}
                <div className="absolute top-0 -left-40 h-[600px] w-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 -right-40 h-[600px] w-[600px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
                
                {/* Header/Navbar */}
                <header className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-600/30">
                            <Car className="h-6 w-6" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            VMS Pro
                        </span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-2xl text-sm transition-all hover:scale-[1.02] shadow-lg shadow-indigo-600/20"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-2xl text-sm transition-all hover:scale-[1.02] shadow-lg shadow-indigo-600/20"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Hero Text */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-400">
                                <BrainCircuit className="h-4.5 w-4.5 animate-pulse" />
                                Smart Service Assistant Enabled
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight">
                                Professional <br />
                                <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                                    Vehicle Service
                                </span> <br />
                                Management.
                            </h1>
                            <p className="text-slate-400 text-base sm:text-lg max-w-lg leading-relaxed">
                                Streamline your automotive workshop operations with an intelligent digital workspace. Manage appointments, schedule mechanics without conflicts, track spare parts stock, generate invoices, and consult our built-in AI advisor for diagnostics.
                            </p>
                            
                            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-indigo-600/20"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="h-4.5 w-4.5" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-indigo-600/20"
                                        >
                                            Sign In to Garage
                                            <ArrowRight className="h-4.5 w-4.5" />
                                        </Link>
                                        <button
                                            onClick={() => setIsVideoPlaying(true)}
                                            className="border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold px-8 py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Play className="h-4.5 w-4.5 text-indigo-500 fill-indigo-500" />
                                            Watch System Demo
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Interactive UI Mockup Card with video showcase */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/10 rounded-[32px] blur-3xl pointer-events-none" />
                            <div className="relative bg-slate-900/60 border border-slate-800 p-8 rounded-[32px] shadow-2xl backdrop-blur-xl space-y-6">
                                
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-rose-500" />
                                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500">WORKSHOP_OVERVIEW.SYS</span>
                                </div>

                                {/* Custom Visual Player Box */}
                                <div 
                                    onClick={() => setIsVideoPlaying(true)}
                                    className="h-56 border border-slate-800 bg-slate-950/80 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10" />
                                    
                                    {/* Simulated video background frame */}
                                    <div className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-700 bg-[url('https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?q=80&w=1000')] bg-cover bg-center" />

                                    {/* Glowing Play Circle */}
                                    <div className="z-20 bg-indigo-600/90 text-white p-5 rounded-full shadow-xl shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-300">
                                        <Play className="h-7 w-7 fill-white" />
                                    </div>

                                    <div className="absolute bottom-3 left-4 right-4 z-20 flex justify-between items-center text-xs">
                                        <span className="font-bold tracking-wide flex items-center gap-1.5">
                                            <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                                            VMS Pro Video Tour
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
                                            04:32
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-800/80">
                                        <span className="text-[10px] font-bold text-slate-500 block uppercase">Workshops Active</span>
                                        <span className="text-2xl font-extrabold text-indigo-400">98.4%</span>
                                    </div>
                                    <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-800/80">
                                        <span className="text-[10px] font-bold text-slate-500 block uppercase">Low Stock Alerts</span>
                                        <span className="text-2xl font-extrabold text-amber-500">2 Items</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Features Grid */}
                    <div className="mt-28 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Feature 1 */}
                        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-3 hover:border-indigo-500/25 transition-all">
                            <div className="bg-indigo-500/10 text-indigo-400 p-2.5 rounded-xl inline-block">
                                <CalendarRange className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-base">Schedule Guard</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Automate appointment checking to prevent double-booking mechanics and bays with a strict 90-minute buffer.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-3 hover:border-violet-500/25 transition-all">
                            <div className="bg-violet-500/10 text-violet-400 p-2.5 rounded-xl inline-block">
                                <Wrench className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-base">Inventory Deduction</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Auto-deduct stock quantities on job completion and receive flashing dashboard warning badges when stock falls.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-3 hover:border-emerald-500/25 transition-all">
                            <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl inline-block">
                                <Coins className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-base">Billing Transactions</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Generate unique invoice numbers, automatically calculate labor/parts costs, and print/export PDF receipts.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-3 hover:border-rose-500/25 transition-all">
                            <div className="bg-rose-500/10 text-rose-400 p-2.5 rounded-xl inline-block">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-base">Spatie Guard RBAC</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Protect critical API resources using specific authorization gates for Admin, Advisors, and Mechanic staff.
                            </p>
                        </div>

                    </div>
                </main>

                {/* Video / Showcase Modal */}
                {isVideoPlaying && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                        <div className="bg-slate-950 w-full max-w-4xl rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-900 bg-slate-900/40">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-indigo-400" />
                                    <span className="font-bold text-sm">System Walkthrough & Demo Tour</span>
                                </div>
                                <button 
                                    onClick={() => setIsVideoPlaying(false)}
                                    className="p-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Custom Video Player UI */}
                            <div className="relative aspect-video bg-black flex items-center justify-center group/player">
                                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                
                                {/* Simulated loop walkthrough image/clip */}
                                <img 
                                    src="https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?q=80&w=1200" 
                                    alt="Walkthrough Frame"
                                    className="w-full h-full object-cover opacity-80"
                                />

                                {/* Simulated HUD Diagnostics Overlay */}
                                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between pointer-events-none">
                                    <div className="flex justify-between items-start">
                                        <div className="bg-slate-900/80 border border-slate-850 px-3 py-1 rounded-lg text-[10px] font-mono text-indigo-400 tracking-wider">
                                            DEMO_MODE: PLAYING
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="max-w-md bg-slate-950/80 border border-slate-850 p-4 rounded-xl backdrop-blur-sm">
                                            <h4 className="font-bold text-xs text-indigo-400 mb-1">AI Advisor Feature Tour</h4>
                                            <p className="text-[10px] text-slate-400 leading-normal">
                                                In the demo video, we showcase entering natural language complaints and resolving parts SKU allocations automatically.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom controls (overlay during hover) */}
                                <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-xs opacity-0 group-hover/player:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center gap-3">
                                        <button className="text-white hover:text-indigo-400">
                                            <Pause className="h-4.5 w-4.5 fill-white" />
                                        </button>
                                        <button className="text-white hover:text-indigo-400">
                                            <Volume2 className="h-4.5 w-4.5" />
                                        </button>
                                        <span className="text-[10px] text-slate-400 font-mono">01:45 / 04:32</span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="flex-1 mx-6 h-1 bg-slate-800 rounded-full overflow-hidden relative">
                                        <div className="absolute top-0 bottom-0 left-0 w-[40%] bg-indigo-500" />
                                    </div>

                                    <button className="text-white hover:text-indigo-400">
                                        <Maximize className="h-4.5 w-4.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-900 text-center text-xs text-slate-500 relative z-10">
                    VMS Pro Vehicle Service Center Systems • Designed for Internship Assessments • Local Environment active
                </footer>

            </div>
        </>
    );
}
