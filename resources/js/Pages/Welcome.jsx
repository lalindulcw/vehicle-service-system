import { Head, Link } from '@inertiajs/react';
import { 
    Car, 
    Wrench, 
    ShieldCheck, 
    BrainCircuit, 
    ArrowRight, 
    Coins, 
    CalendarRange 
} from 'lucide-react';

export default function Welcome({ auth }) {
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        
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
                                        <Link
                                            href={route('register')}
                                            className="border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold px-8 py-4 rounded-2xl text-sm text-center transition-all"
                                        >
                                            Create Advisor Account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Interactive UI Mockup Card / Graphic */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/10 rounded-[32px] blur-3xl pointer-events-none" />
                            <div className="relative bg-slate-900/60 border border-slate-800 p-8 rounded-[32px] shadow-2xl backdrop-blur-xl space-y-6">
                                
                                {/* Abstract wireframe of dashboard stats */}
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-rose-500" />
                                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500">SYSTEM STATUS: ACTIVE</span>
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

                                {/* Abstract vehicle wireframe drawing */}
                                <div className="h-44 border border-slate-800 bg-slate-950/80 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 to-transparent pointer-events-none" />
                                    <Wrench className="h-12 w-12 text-indigo-500/40 animate-bounce" />
                                    <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-600">VMS_DIAGNOSTICS_LOG.SYS</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Features Grid */}
                    <div className="mt-28 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Feature 1 */}
                        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-3">
                            <div className="bg-indigo-500/10 text-indigo-400 p-2.5 rounded-xl inline-block">
                                <CalendarRange className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-base">Schedule Guard</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Automate appointment checking to prevent double-booking mechanics and bays with a strict 90-minute buffer.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-3">
                            <div className="bg-violet-500/10 text-violet-400 p-2.5 rounded-xl inline-block">
                                <Wrench className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-base">Inventory Deduction</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Auto-deduct stock quantities on job completion and receive flashing dashboard warning badges when stock falls.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-3">
                            <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl inline-block">
                                <Coins className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-base">Billing Transactions</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Generate unique invoice numbers, automatically calculate labor/parts costs, and print/export PDF receipts.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl space-y-3">
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

                {/* Footer */}
                <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-900 text-center text-xs text-slate-500 relative z-10">
                    VMS Pro Vehicle Service Center Systems • Designed for Internship Assessments • Local Environment active
                </footer>

            </div>
        </>
    );
}
