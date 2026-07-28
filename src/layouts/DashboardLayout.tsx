import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, LayoutDashboard,
  Activity, Settings, Bell, Menu,
  Search, User, ChevronRight, LogOut,
  GitBranch, Box
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userAvatar');
    navigate('/', { replace: true });
  };

  // Load profile data from localStorage
  const avatar = localStorage.getItem('userAvatar');
  const firstName = localStorage.getItem('userFirstName') || 'John';
  const lastName = localStorage.getItem('userLastName') || 'Doe';
  const email = localStorage.getItem('userEmail') || 'john@example.com';

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
      setShowProfileMenu(false);
    };
    if (showNotifications || showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications, showProfileMenu]);

  const mockNotifications = [
    { id: 1, title: 'Deployment Successful', desc: 'nexus-frontend deployed to production.', time: '5m ago' },
    { id: 2, title: 'High CPU Usage', desc: 'Database node db-01 is at 92% CPU.', time: '1h ago', urgent: true },
    { id: 3, title: 'New Login', desc: 'Login detected from new IP address.', time: '2h ago' },
  ];

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Deployments', href: '/dashboard/deployments', icon: GitBranch },
    { name: 'Cloud Resources', href: '/dashboard/resources', icon: Cloud },
    { name: 'Containers', href: '/dashboard/containers', icon: Box },
    { name: 'Monitoring', href: '/dashboard/monitoring', icon: Activity },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      {/* Sidebar Desktop */}
      <motion.aside
        initial={{ width: 256 }}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="hidden md:flex flex-col border-r border-border bg-black/60 backdrop-blur-2xl z-20 relative transition-all duration-300"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
          <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <Cloud className="h-8 w-8 text-primary shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-lg font-bold text-gradient whitespace-nowrap"
                >
                  NexusCloud
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md hover:bg-white/5 text-muted">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
          )}
          {!sidebarOpen && (
             <button onClick={() => setSidebarOpen(true)} className="absolute -right-3 top-6 bg-border rounded-full p-0.5 z-30">
               <ChevronRight className="h-4 w-4 text-white" />
             </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary border border-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                    : "text-muted hover:bg-white/5 hover:text-white border border-transparent"
                )}
                title={!sidebarOpen ? item.name : undefined}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  />
                )}
                <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted group-hover:text-white")} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
                      className="whitespace-nowrap font-medium text-sm"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted hover:bg-white/5 hover:text-danger transition-colors group"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0, width: 0 }}
                   className="whitespace-nowrap font-medium text-sm group-hover:text-danger"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative aurora-bg">
        {/* Animated background noise */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        {/* Top Header */}
        <header className="h-16 border-b border-border/50 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden text-muted hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex items-center max-w-md w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input 
                type="text" 
                placeholder="Search resources, deployments, logs..." 
                className="w-full bg-black/20 border border-border rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="relative p-2 text-muted hover:text-white transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse-slow"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 border-b border-border/50 flex justify-between items-center">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      <button className="text-xs text-primary hover:text-primary/80 transition-colors">Mark all as read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {mockNotifications.map((notif) => (
                        <div key={notif.id} className="p-4 border-b border-border/30 hover:bg-white/5 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={cn("text-sm font-medium", notif.urgent ? "text-danger" : "text-white")}>{notif.title}</h4>
                            <span className="text-xs text-muted group-hover:text-white/70 transition-colors">{notif.time}</span>
                          </div>
                          <p className="text-xs text-muted leading-relaxed">{notif.desc}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-border/50 bg-white/[0.02]">
                      <Link to="/dashboard/settings" className="text-sm text-primary hover:text-primary/80 transition-colors">View all notifications</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <div 
                onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px] cursor-pointer"
              >
                <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="User Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-muted" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 border-b border-border/50">
                      <p className="font-medium text-white truncate">{firstName} {lastName}</p>
                      <p className="text-xs text-muted truncate">{email}</p>
                    </div>
                    <div className="p-2">
                      <Link 
                        to="/dashboard/settings" 
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-white hover:bg-white/5 rounded-md transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </Link>
                    </div>
                    <div className="p-2 border-t border-border/50">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 hover:text-danger rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 z-0 relative">
           <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
           >
             {children}
           </motion.div>
        </main>
      </div>
    </div>
  );
}
