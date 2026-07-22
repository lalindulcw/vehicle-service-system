import { Link } from '@inertiajs/react';
import { Car } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div 
            className="relative flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 font-sans overflow-hidden"
            style={{
                backgroundImage: "url('/assets/images/garage_portal_bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            {/* Real photo backdrop overlay */}
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-0 pointer-events-none" />

            {/* Glowing Accent Effects */}
            <div className="absolute top-0 -left-40 h-[400px] w-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-0 -right-40 h-[400px] w-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <div className="relative z-10 w-full flex flex-col items-center space-y-6">
                
                {/* Custom Brand Logo */}
                <div className="flex flex-col items-center space-y-2">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-600/20">
                            <Car className="h-6 w-6" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            VMS Pro
                        </span>
                    </Link>
                </div>

                {/* Form Wrapper Glassmorphic Card */}
                <div className="w-full sm:max-w-md bg-slate-900/80 border border-slate-800 px-8 py-8 shadow-2xl rounded-2xl backdrop-blur-md text-slate-100 overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}
