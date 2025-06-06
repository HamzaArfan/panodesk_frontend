'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  Users, 
  Building2, 
  FolderOpen, 
  Route, 
  MessageSquare, 
  Mail,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';
import { usersAPI, organizationsAPI, projectsAPI, toursAPI, commentsAPI, invitationsAPI } from '../../lib/api';

function DashboardContent() {
  const { user, canManageUsers, canManageOrganizations, canManageProjects, canManageTours } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    organizations: 0,
    projects: 0,
    tours: 0,
    comments: 0,
    invitations: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const promises = [];
      
      if (canManageUsers()) {
        promises.push(usersAPI.getAll({ limit: 1 }).then(res => ({ users: res.data.total || 0 })));
      }
      if (canManageOrganizations()) {
        promises.push(organizationsAPI.getAll({ limit: 1 }).then(res => ({ organizations: res.data.total || 0 })));
      }
      if (canManageProjects()) {
        promises.push(projectsAPI.getAll({ limit: 1 }).then(res => ({ projects: res.data.total || 0 })));
      }
      if (canManageTours()) {
        promises.push(toursAPI.getAll({ limit: 1 }).then(res => ({ tours: res.data.total || 0 })));
      }
      
      promises.push(commentsAPI.getAll({ limit: 1 }).then(res => ({ comments: res.data.total || 0 })));
      promises.push(invitationsAPI.getAll({ limit: 1 }).then(res => ({ invitations: res.data.total || 0 })));

      const results = await Promise.allSettled(promises);
      const newStats = { ...stats };
      
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          Object.assign(newStats, result.value);
        }
      });
      
      setStats(newStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '...' : value.toLocaleString()}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  const getRoleDisplayInfo = () => {
    switch (user?.role) {
      case 'super-admin':
        return {
          title: 'Super Administrator',
          description: 'Full system access and control',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };
      case 'system-user':
        return {
          title: 'System User',
          description: 'Manage all organizational data',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'organization-manager':
        return {
          title: 'Organization Manager',
          description: 'Manage your organization and projects',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'reviewer':
        return {
          title: 'Reviewer',
          description: 'Review and comment on projects',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        };
      default:
        return {
          title: 'User',
          description: 'Standard access',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const roleInfo = getRoleDisplayInfo();

  const quickActions = [
    ...(canManageUsers() ? [{
      name: 'Manage Users',
      description: 'View and manage user accounts',
      href: '/dashboard/users',
      icon: Users,
      color: 'bg-blue-500'
    }] : []),
    ...(canManageOrganizations() ? [{
      name: 'Organizations',
      description: 'Manage organizations and members',
      href: '/dashboard/organizations',
      icon: Building2,
      color: 'bg-green-500'
    }] : []),
    ...(canManageProjects() ? [{
      name: 'Projects',
      description: 'View and manage projects',
      href: '/dashboard/projects',
      icon: FolderOpen,
      color: 'bg-purple-500'
    }] : []),
    ...(canManageTours() ? [{
      name: 'Tours',
      description: 'Manage tour content',
      href: '/dashboard/tours',
      icon: Route,
      color: 'bg-indigo-500'
    }] : []),
    {
      name: 'Comments',
      description: 'View and moderate comments',
      href: '/dashboard/comments',
      icon: MessageSquare,
      color: 'bg-orange-500'
    },
    {
      name: 'Invitations',
      description: 'Manage user invitations',
      href: '/dashboard/invitations',
      icon: Mail,
      color: 'bg-pink-500'
    }
  ];

  return (
    <DashboardLayout activeTab="overview">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-indigo-100 text-lg mb-4">
                Here's what's happening with your system today.
              </p>
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${roleInfo.bgColor} ${roleInfo.color} bg-opacity-20 text-white`}>
                <Activity className="w-4 h-4 mr-2" />
                {roleInfo.title}
              </div>
            </div>
            <div className="hidden md:block">
              <Calendar className="w-16 h-16 text-indigo-200" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {canManageUsers() && (
            <StatCard
              title="Total Users"
              value={stats.users}
              icon={Users}
              color="bg-blue-500"
              description="Registered users"
            />
          )}
          {canManageOrganizations() && (
            <StatCard
              title="Organizations"
              value={stats.organizations}
              icon={Building2}
              color="bg-green-500"
              description="Active organizations"
            />
          )}
          {canManageProjects() && (
            <StatCard
              title="Projects"
              value={stats.projects}
              icon={FolderOpen}
              color="bg-purple-500"
              description="Total projects"
            />
          )}
          {canManageTours() && (
            <StatCard
              title="Tours"
              value={stats.tours}
              icon={Route}
              color="bg-indigo-500"
              description="Published tours"
            />
          )}
          <StatCard
            title="Comments"
            value={stats.comments}
            icon={MessageSquare}
            color="bg-orange-500"
            description="Total comments"
          />
          <StatCard
            title="Invitations"
            value={stats.invitations}
            icon={Mail}
            color="bg-pink-500"
            description="Pending invites"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.name}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => window.location.href = action.href}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                        {action.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role Information */}
        <div className={`${roleInfo.bgColor} rounded-xl p-6 border border-gray-200`}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-lg ${roleInfo.color} bg-opacity-10`}>
                <Activity className={`w-6 h-6 ${roleInfo.color}`} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${roleInfo.color}`}>
                Your Role: {roleInfo.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1 mb-4">
                {roleInfo.description}
              </p>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Available Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {canManageUsers() && <li>• Manage users and roles</li>}
                  {canManageOrganizations() && <li>• Manage organizations and members</li>}
                  {canManageProjects() && <li>• Create and manage projects</li>}
                  {canManageTours() && <li>• Create and edit tours</li>}
                  <li>• View and manage comments</li>
                  <li>• Send and manage invitations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm text-gray-600">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}