'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
    router.push('/dashboard/projects');
  }, [router]);

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
      case 'SUPER_ADMIN':
        return {
          title: 'Super Administrator',
          description: 'Full system access and control',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };
      case 'SYSTEM_USER':
        return {
          title: 'System User',
          description: 'Manage all organizational data',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'ORGANIZATION_MANAGER':
        return {
          title: 'Organization Manager',
          description: 'Manage your organization and projects',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'REVIEWER':
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

  return null;
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}