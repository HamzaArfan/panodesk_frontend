'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Building2, 
  FolderOpen, 
  Route, 
  MessageSquare, 
  Mail, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  ChevronDown
} from 'lucide-react';
import { METADATA } from '../constants';
import Logo from './Logo';

const DashboardLayout = ({ children, activeTab = 'overview' }) => {
  const router = useRouter();
  const { user, logout, canManageUsers, canManageOrganizations, canManageProjects, canManageTours } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, id: 'overview' },
    ...(canManageUsers() ? [{ name: 'Users', href: '/dashboard/users', icon: Users, id: 'users' }] : []),
    ...(canManageOrganizations() ? [{ name: 'Organizations', href: '/dashboard/organizations', icon: Building2, id: 'organizations' }] : []),
    ...(canManageProjects() ? [{ name: 'Projects', href: '/dashboard/projects', icon: FolderOpen, id: 'projects' }] : []),
    ...(canManageTours() && user?.role !== 'ORGANIZATION_MANAGER' ? [{ name: 'Tours', href: '/dashboard/tours', icon: Route, id: 'tours' }] : []),
    { name: 'Comments', href: '/dashboard/comments', icon: MessageSquare, id: 'comments' },
    { name: 'Invitations', href: '/dashboard/invitations', icon: Mail, id: 'invitations' },
  ];


  const getRoleColor = (role) => {
    switch (role) {
      case 'super-admin': return 'bg-red-100 text-red-800';
      case 'system-user': return 'bg-blue-100 text-blue-800';
      case 'organization-manager': return 'bg-green-100 text-green-800';
      case 'reviewer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRole = (role) => {
    return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white shadow-lg">
          <div className="flex items-center flex-shrink-0 px-6">
            <div className="flex-shrink-0">
              <Logo size={32} />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">{METADATA.title}</span>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className={`${
                      isActive
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    } group flex items-center px-3 py-2 text-sm font-medium border-l-4 rounded-r-md transition-colors duration-200 w-full text-left`}
                  >
                    <Icon className={`${
                      isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5`} />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 z-40 ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 transition-opacity duration-300 ${sidebarOpen ? 'opacity-75' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between flex-shrink-0 px-6 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Logo size={32} />
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`${
                    isActive
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } group flex items-center px-3 py-2 text-sm font-medium border-l-4 rounded-r-md transition-colors duration-200 w-full text-left`}
                >
                  <Icon className={`${
                    isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 h-5 w-5`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  type="button"
                  className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="hidden sm:block text-gray-700 font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-300 ring-opacity-5">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                          <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                          <p className="text-gray-500">{user?.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 inline mr-2" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 