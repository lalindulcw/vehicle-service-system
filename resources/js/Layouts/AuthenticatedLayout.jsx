import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Users, 
    Car, 
    Wrench, 
    Settings, 
    Calendar, 
    Clock, 
    Receipt, 
    SearchCode, 
    History, 
    User, 
    LogOut,
    Menu,
    X,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // Helpers to check roles
    const isAdmin = user.roles.includes('Admin');
    const isAdvisor = user.roles.includes('Service Advisor');
    const isMechanic = user.roles.includes('Mechanic');

    // Show toast notifications on flash messages
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Navigation items based on roles
    const navItems = [
        { 
            name: 'Dashboard', 
            href: route('dashboard'), 
            icon: LayoutDashboard, 
            active: route().current('dashboard'),
            roles: ['Admin', 'Service Advisor', 'Mechanic']
        },
        { 
            name: 'Customers', 
            href: route('customers.index'), 
            icon: Users, 
            active: route().current('customers.*'),
            roles: ['Admin', 'Service Advisor']
        },
        { 
            name: 'Vehicles', 
            href: route('vehicles.index'), 
            icon: Car, 
            active: route().current('vehicles.*'),
            roles: ['Admin', 'Service Advisor']
        },
        { 
            name: 'Mechanics', 
            href: route('mechanics.index'), 
            icon: Wrench, 
            active: route().current('mechanics.*'),
            roles: ['Admin', 'Service Advisor']
        },
        { 
            name: 'Parts Inventory', 
            href: route('parts.index'), 
            icon: Settings, 
            active: route().current('parts.*'),
            roles: ['Admin', 'Service Advisor', 'Mechanic']
        },
        { 
            name: 'Service Bookings', 
            href: route('bookings.index'), 
            icon: Clock, 
            active: route().current('bookings.index') || route().current('bookings.store') || route().current('bookings.update'),
            roles: ['Admin', 'Service Advisor', 'Mechanic']
        },
        { 
            name: 'Calendar View', 
            href: route('bookings.calendar'), 
            icon: Calendar, 
            active: route().current('bookings.calendar'),
            roles: ['Admin', 'Service Advisor', 'Mechanic']
        },
        { 
            name: 'Billing & Invoices', 
            href: route('invoices.index'), 
            icon: Receipt, 
            active: route().current('invoices.*'),
            roles: ['Admin', 'Service Advisor']
        },
        { 
            name: 'AI Service Advisor', 
            href: route('ai.advisor'), 
            icon: SearchCode, 
            active: route().current('ai.advisor'),
            roles: ['Admin', 'Service Advisor', 'Mechanic']
        },
        { 
            name: 'Audit Trail', 
            href: route('logs.index'), 
            icon: History, 
            active: route().current('logs.index'),
            roles: ['Admin']
        },
    ];

    const filteredNavItems = navItems.filter(item => {
        return item.roles.some(role => user.roles.includes(role));
    });

    return (
        <div className="flex h-screen bg-gray-550 dark:bg-slate-950 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">
            {/* Desktop Left Sidebar */}
            <aside 
                className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 text-white transition-all duration-300 ${
                    isSidebarOpen ? 'w-64' : 'w-20'
                }`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20">
                            <Car className="h-6 w-6" />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent truncate">
                                VMS Pro
                            </span>
                        )}
                    </Link>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
                    {filteredNavItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                item.active 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon className={`h-5 w-5 shrink-0 ${item.active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                            {isSidebarOpen && <span>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                {/* User footer info */}
                <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-semibold text-white">
                            {user.name.charAt(0)}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold truncate">{user.name}</p>
                                <p className="text-xs text-indigo-400 font-medium truncate capitalize">
                                    {user.roles.join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Drawer Navigation overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside 
                className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 md:hidden ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl">
                            <Car className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-lg text-white">VMS Pro</span>
                    </div>
                    <button onClick={() => setIsMobileOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
                    {filteredNavItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                item.active 
                                ? 'bg-indigo-600 text-white' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold truncate">{user.name}</p>
                            <p className="text-xs text-indigo-400 capitalize">{user.roles.join(', ')}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
                {/* Top Navbar */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Sidebar toggle button (desktop) */}
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden md:flex text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        
                        {/* Sidebar toggle button (mobile) */}
                        <button 
                            onClick={() => setIsMobileOpen(true)}
                            className="md:hidden text-slate-500 dark:text-slate-400 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Route header title */}
                        {header && <div className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">{header}</div>}
                    </div>

                    {/* Right utilities */}
                    <div className="flex items-center gap-4">
                        {/* User profile dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2.5 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="hidden sm:inline text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                                        {user.name}
                                    </span>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <LogOut className="h-4 w-4" />
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Sub-view Content container */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    {children}
                </main>
            </div>

            {/* Notification Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-bounce">
                    <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-white ${
                        toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}>
                        {toast.type === 'success' ? (
                            <CheckCircle className="h-6 w-6" />
                        ) : (
                            <AlertCircle className="h-6 w-6" />
                        )}
                        <div className="font-semibold text-sm">{toast.message}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
