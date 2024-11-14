import React, { useState } from 'react';
import { 
  Book, 
  Menu, 
  X, 
  Search, 
  User, 
  Bell, 
  LayoutDashboard, 
  Users, 
  BookOpen,
  Tags,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Navigation items based on role
  const navigationItems = {
    admin: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Books', href: '/admin/books', icon: BookOpen },
      { name: 'Genres', href: '/admin/genres', icon: Tags },
    ],
    author: [
      { name: 'Dashboard', href: '/author/dashboard', icon: LayoutDashboard },
      { name: 'My Books', href: '/author/books', icon: BookOpen },
    ]
  };

  const items = navigationItems[userRole] || [];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl text-gray-800">
                {userRole === 'admin' ? 'Admin Portal' : 'Author Portal'}
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <div className="relative group">
                <button className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-lg" onClick={()=>handleLogout()}>
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-600">Logout</span>
                </button>
                {/* Dropdown Menu */}
              
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              );
            })}
            
            {/* Mobile Profile Options */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <a
                onClick={()=>handleLogout()}

                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
              >
                <User className="h-5 w-5" />
                <span>Logout</span>
              </a>
            
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;