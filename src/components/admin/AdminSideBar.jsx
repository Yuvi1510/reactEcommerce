import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image, 
  Package, 
  ShoppingBag, 
  Users,
  ChevronLeft,
  ChevronRight,
  Store
} from 'lucide-react';
import { useState } from 'react';

export default function AdminSideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'emerald' },
    { path: '/admin/carousel', label: 'Carousel', icon: Image, color: 'purple' },
    { path: '/admin/products', label: 'Products', icon: Package, color: 'blue' },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag, color: 'orange' },
    { path: '/admin/users', label: 'Users', icon: Users, color: 'pink' },
    { path: '/admin/stores', label: 'Stores', icon: Store, color: 'yellow' }
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-gray-900 to-gray-800 h-screen fixed top-0 left-0 transition-all duration-300 z-50 shadow-xl`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Admin Panel
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const colorClasses = {
                emerald: 'hover:bg-emerald-500/20 text-emerald-400',
                purple: 'hover:bg-purple-500/20 text-purple-400',
                blue: 'hover:bg-blue-500/20 text-blue-400',
                orange: 'hover:bg-orange-500/20 text-orange-400',
                pink: 'hover:bg-pink-500/20 text-pink-400'
              };
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? `bg-gradient-to-r from-${item.color}-500/20 to-${item.color}-500/10 text-${item.color}-400 font-semibold` 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon className="w-5 h-5" />
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          {!isCollapsed && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-3">
              <p className="text-xs font-semibold text-emerald-400 mb-1">Admin Access</p>
              <p className="text-xs text-gray-500">Full control panel</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}