import { Head, Link } from '@inertiajs/react';
import { Car, LogIn, UserPlus } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="VMS Pro - Vehicle Service System" />
            
            {/* Real Professional Automotive Themed Welcome Portal */}
            <div 
                className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans overflow-hidden"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1600')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                {/* Real-photo backdrop glassmorphism overlay to ensure text readability */}
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[3px] z-0 pointer-events-none" />
                
                {/* Header/Navbar */}
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

                {/* Main Content Card (Glassmorphic Container matching the internal theme) */}
                <main className="flex-1 flex items-center justify-center p-6 relative z-10">
                    <div className="max-w-md w-full bg-slate-900/75 border border-slate-800/80 p-8 rounded-2xl shadow-2xl backdrop-blur-md space-y-6 text-center">
                        
                        {/* Logo and Subtitle */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="bg-indigo-600/10 text-indigo-400 p-4 rounded-full border border-indigo-500/20">
                                <Car className="h-8 w-8" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                                Vehicle Service System
                            </h1>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                Welcome to the VMS Pro administrative portal. Manage bookings, schedule mechanics, track parts inventory, and generate billing invoices in one unified workspace.
                            </p>
                        </div>

                        {/* Standard CTA Buttons */}
                        <div className="flex flex-col gap-3 pt-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/15"
                                >
                                    Access Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/15"
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Log in to Portal
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Register Advisor Account
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </main>

                {/* Simple Professional Footer */}
                <footer className="w-full text-center py-6 border-t border-slate-900 text-[11px] text-slate-500 relative z-10">
                    VMS Pro Vehicle Service Center Management System • Local Workspace Active
                </footer>

            </div>
        </>
    );
}
