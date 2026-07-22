import { Head, Link } from '@inertiajs/react';
import { Car, LogIn, UserPlus } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="VMS Pro - Vehicle Service System" />
            
            {/* Minimalist, Professional and Clean Human-Designed Portal Layout */}
            <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans">
                
                {/* Clean Top Navbar */}
                <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md">
                            <Car className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            VMS Pro
                        </span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
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
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-slate-800/50 border border-slate-700/60 p-8 rounded-2xl shadow-xl space-y-6 text-center">
                        
                        {/* Logo and Subtitle */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="bg-indigo-600/10 text-indigo-400 p-4 rounded-full border border-indigo-500/20">
                                <Car className="h-8 w-8" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Vehicle Service System
                            </h1>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Welcome to the VMS Pro administrative portal. Manage bookings, schedule mechanics, track parts inventory, and generate billing invoices in one unified workspace.
                            </p>
                        </div>

                        {/* Standard CTA Buttons */}
                        <div className="flex flex-col gap-3 pt-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    Access Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                                    >
                                        <LogIn className="h-4.5 w-4.5" />
                                        Log in to Portal
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="w-full bg-slate-750 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <UserPlus className="h-4.5 w-4.5" />
                                        Register Advisor Account
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </main>

                {/* Simple Professional Footer */}
                <footer className="w-full text-center py-6 border-t border-slate-800 text-[11px] text-slate-500">
                    VMS Pro Vehicle Service Center Management System • Local Workspace Active
                </footer>

            </div>
        </>
    );
}
