import { ReactNode } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, Calendar, Users, Settings, LogOut, Menu, X,
  Bell, Search, ChevronDown, Package, BarChart, FileText,
  MapPin, Music, Ticket, Heart
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../lib/store';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, mobileMenuOpen, toggleMobileMenu } = useUIStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Role-based navigation
  const getNavItems = () => {
    const rolePathMap: Record<string, string> = {
      admin: '/admin',
      organizer: '/organizer',
      artist: '/artist',
      venue_owner: '/venue-owner',
      attendee: '/attendee',
    };
    
    const basePath = rolePathMap[user?.role || ''] || '/';
    const base = { icon: LayoutDashboard, label: 'Dashboard', path: basePath };

    switch (user?.role) {
      case 'admin':
        return [
          base,
          { icon: Users, label: 'Users', path: '/admin/users' },
          { icon: Calendar, label: 'Events', path: '/admin/events' },
          { icon: FileText, label: 'Approvals', path: '/admin/approvals' },
          { icon: BarChart, label: 'Reports', path: '/admin/reports' },
          { icon: Settings, label: 'Settings', path: '/admin/settings' },
        ];
      case 'organizer':
        return [
          base,
          { icon: Calendar, label: 'My Events', path: '/organizer/events' },
          { icon: Ticket, label: 'Bookings', path: '/organizer/bookings' },
          { icon: Music, label: 'Artists', path: '/organizer/artists' },
          { icon: MapPin, label: 'Venues', path: '/organizer/venues' },
          { icon: BarChart, label: 'Analytics', path: '/organizer/analytics' },
          { icon: Settings, label: 'Settings', path: '/organizer/settings' },
        ];
      case 'artist':
        return [
          base,
          { icon: Calendar, label: 'Performances', path: '/artist/performances' },
          { icon: Bell, label: 'Invitations', path: '/artist/invitations' },
          { icon: Package, label: 'Portfolio', path: '/artist/portfolio' },
          { icon: BarChart, label: 'Earnings', path: '/artist/earnings' },
          { icon: Settings, label: 'Settings', path: '/artist/settings' },
        ];
      case 'venue_owner':
        return [
          base,
          { icon: MapPin, label: 'My Venues', path: '/venue-owner/venues' },
          { icon: Calendar, label: 'Bookings', path: '/venue-owner/bookings' },
          { icon: BarChart, label: 'Analytics', path: '/venue-owner/analytics' },
          { icon: Settings, label: 'Settings', path: '/venue-owner/settings' },
        ];
      case 'attendee':
        return [
          base,
          { icon: Ticket, label: 'My Tickets', path: '/attendee/tickets' },
          { icon: Heart, label: 'Wishlist', path: '/attendee/wishlist' },
          { icon: Calendar, label: 'History', path: '/attendee/history' },
          { icon: Settings, label: 'Settings', path: '/attendee/settings' },
        ];
      default:
        return [base];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Eventory
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden md:block">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r transition-all duration-300 overflow-y-auto ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </nav>
        </aside>

        {/* Sidebar - Mobile */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={toggleMobileMenu}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Menu</h2>
              </div>
              <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={toggleMobileMenu}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}