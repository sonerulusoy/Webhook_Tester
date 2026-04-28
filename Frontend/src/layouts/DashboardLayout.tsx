import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Zap,
  Webhook
} from 'lucide-react';
import clsx from 'clsx';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Users, label: 'Customers', path: '/dashboard/customers' },
    { icon: Webhook, label: 'Webhooks', path: '/dashboard/webhooks' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-background text-textMain">
      {/* Sidebar */}
      <aside className="w-64 border-r border-surfaceBorder bg-surface/30 backdrop-blur-md flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-surfaceBorder gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">SaaS App</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-textMuted hover:bg-surface hover:text-textMain"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surfaceBorder">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 glass-panel rounded-none border-t-0 border-x-0 border-b border-surfaceBorder flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="glass-input w-full pl-10 py-2 h-10 text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-textMuted hover:text-textMain transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-surfaceBorder cursor-pointer" />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8 relative">
           {/* Abstract background blobs for main content */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-6xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
