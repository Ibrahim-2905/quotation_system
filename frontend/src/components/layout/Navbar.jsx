import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, FileText, LayoutDashboard, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Quotations', href: '/quotations', icon: FileText },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl border-b border-blue-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-3 group"
          >
            <div className="bg-white p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">QuotationPro</h1>
              <p className="text-blue-100 text-xs">Business Solutions</p>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu - Improved */}
          <div className="flex items-center space-x-3">
            {/* User Info - Simplified */}
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-sm font-semibold text-white leading-tight">
                  {user?.name}
                </span>
                <span className="text-xs text-blue-200 leading-tight max-w-[150px] truncate">
                  {user?.email}
                </span>
              </div>
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-blue-500"></div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-white text-blue-600 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium group shadow-lg"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accent line */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 w-full"></div>
    </nav>
  );
};

export default Navbar;