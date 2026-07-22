import { Head, Link } from '@inertiajs/react';
import { 
    Car, 
    CalendarRange, 
    Wrench, 
    Coins, 
    ShieldCheck, 
    ArrowRight 
} from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome - VMS Pro" />
            
            {/* Premium, High-End Automotive Web Portal */}
            <div 
                className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans overflow-hidden"
                style={{
                    backgroundImage: "url('/assets/images/garage_portal_bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                {/* Real-photo backdrop glassmorphism overlay to ensure text readability */}
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-0 pointer-events-none" />
                
                {/* Top Header Navbar */}
                <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/60 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-600/20">
                            <Car className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            VMS Pro
                        </span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/10"
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
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/10"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero / Main Section */}
                <main className="max-w-7xl w-full mx-auto px-6 py-12 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    
                    {/* Left Column: Title & Feature Summary */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-400">
                            <Car className="h-4 w-4" />
                            Official Workshop Management Portal
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                            Vehicle Service <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                                Center Management
                            </span>
                        </h1>
                        <p className="text-slate-400 text-sm sm:text-base max-w-lg leading-relaxed">
                            A centralized administrative dashboard tailored for auto workshops to orchestrate bookings, assign mechanics without scheduling conflicts, track parts inventory, and process invoices.
                        </p>

                        {/* Visual checklist of features to show professionalism */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-500/10 text-indigo-400 p-1.5 rounded-lg">
                                    <CalendarRange className="h-4 w-4" />
                                </div>
                                <span className="text-xs text-slate-300 font-medium">Conflict-Free Bookings</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-500/10 text-indigo-400 p-1.5 rounded-lg">
                                    <Wrench className="h-4 w-4" />
                                </div>
                                <span className="text-xs text-slate-300 font-medium">Parts Inventory Control</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-500/10 text-indigo-400 p-1.5 rounded-lg">
                                    <Coins className="h-4 w-4" />
                                </div>
                                <span className="text-xs text-slate-300 font-medium">Billing & PDF Invoices</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-500/10 text-indigo-400 p-1.5 rounded-lg">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <span className="text-xs text-slate-300 font-medium">Role-Based Access Control</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Portal Access Box */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md space-y-6">
                            <div className="space-y-1.5">
                                <h2 className="text-xl font-bold tracking-tight text-white">Access Portal</h2>
                                <p className="text-xs text-slate-400">
                                    Sign in or register your account to access the diagnostic dashboard.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/15"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="h-4.5 w-4.5" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/15"
                                        >
                                            Log In to Account
                                            <ArrowRight className="h-4.5 w-4.5" />
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                                        >
                                            Register Advisor Account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </main>

                {/* Simple Professional Footer */}
                <footer className="w-full text-center py-6 border-t border-slate-900 text-[11px] text-slate-500 relative z-10">
                    VMS Pro Vehicle Service Center Management System • Designed for Intern App • Local Active
                </footer>

            </div>
        </>
    );
}
