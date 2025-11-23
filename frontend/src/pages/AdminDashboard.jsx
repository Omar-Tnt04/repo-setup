import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { GlassCard, GradientText, Button } from '../components/UI';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [userFilters, setUserFilters] = useState({
    page: 1,
    limit: 10,
    role: '',
    search: ''
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    if (user && user.role === 'admin') {
      fetchAnalytics();
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, userFilters]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics/users');
      setAnalytics(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users', {
        params: userFilters
      });
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Users error:', err);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      fetchUsers();
      if (activeTab === 'overview') {
        fetchAnalytics();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
      if (activeTab === 'overview') {
        fetchAnalytics();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-blue-900">
        <div className="card max-w-md text-center">
          <h2 className="text-2xl font-bold gradient-text mb-4">Access Denied</h2>
          <p className="text-slate-300">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neonBlue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 min-h-screen">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-2"><GradientText>Admin Dashboard</GradientText></h1>
        <p className="text-gray-400">Manage users and view platform analytics</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 animate-fade-in-up">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-white/10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 font-semibold transition-all ${
            activeTab === 'overview'
              ? 'border-b-2 border-neonBlue text-neonBlue'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 font-semibold transition-all ${
            activeTab === 'users'
              ? 'border-b-2 border-neonBlue text-neonBlue'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab('charts')}
          className={`pb-3 px-4 font-semibold transition-all ${
            activeTab === 'charts'
              ? 'border-b-2 border-neonBlue text-neonBlue'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Growth Charts
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && analytics && (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard className="hover:border-neonBlue/50 transition-all duration-300 animate-fade-in-up p-6" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Users</p>
                  <p className="text-3xl font-bold"><GradientText>{analytics.summary.totalUsers}</GradientText></p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-neonBlue to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-neonBlue/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="hover:border-neonBlue/50 transition-all duration-300 animate-fade-in-up p-6" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Clients</p>
                  <p className="text-3xl font-bold text-neonBlue">{analytics.summary.totalClients}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-neonBlue to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-neonBlue/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="hover:border-neonBlue/50 transition-all duration-300 animate-fade-in-up p-6" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Freelancers</p>
                  <p className="text-3xl font-bold text-emerald-400">{analytics.summary.totalFreelancers}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-neonBlue rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="hover:border-neonBlue/50 transition-all duration-300 animate-fade-in-up p-6" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Active Users</p>
                  <p className="text-3xl font-bold text-green-400">{analytics.summary.activeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Recent Registrations */}
          <GlassCard className="animate-fade-in-up p-6" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl font-bold text-white mb-4">Recent Registrations</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentRegistrations.map((user, index) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-gray-300">{user.email}</td>
                      <td className="py-3 px-4 text-gray-300">{user.full_name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'client' ? 'bg-neonBlue/20 text-neonBlue' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          {/* Filters */}
          <GlassCard className="mb-6 animate-fade-in-up p-6" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by email or name..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors flex-1"
                value={userFilters.search}
                onChange={(e) => setUserFilters({ ...userFilters, search: e.target.value, page: 1 })}
              />
              <select
                className="w-full md:w-48 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors [&>option]:bg-slate-900"
                value={userFilters.role}
                onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value, page: 1 })}
              >
                <option value="">All Roles</option>
                <option value="client">Clients</option>
                <option value="freelancer">Freelancers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </GlassCard>

          {/* Users Table */}
          <GlassCard className="animate-fade-in-up p-6" style={{ animationDelay: '0.3s' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Registered</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-gray-300">{user.email}</td>
                      <td className="py-3 px-4 text-gray-300">{user.full_name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'client' ? 'bg-neonBlue/20 text-neonBlue' : 
                          user.role === 'freelancer' ? 'bg-emerald-500/20 text-emerald-400' : 
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className="px-3 py-1 rounded bg-neonBlue/20 text-neonBlue hover:bg-neonBlue/30 transition-colors text-sm"
                          >
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                  Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalUsers} total users)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserFilters({ ...userFilters, page: userFilters.page - 1 })}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 rounded bg-neonBlue/20 text-neonBlue hover:bg-neonBlue/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setUserFilters({ ...userFilters, page: userFilters.page + 1 })}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 rounded bg-neonBlue/20 text-neonBlue hover:bg-neonBlue/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && analytics && (
        <div>
          {/* Daily Registrations */}
          <GlassCard className="mb-6 animate-fade-in-up p-6" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-white mb-4">Daily Registrations (Last 30 Days)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Total</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Clients</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Freelancers</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.registrationsByDate.map((day, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-gray-300">{new Date(day.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-white font-semibold">{day.count}</td>
                      <td className="py-3 px-4 text-neonBlue">{day.clients}</td>
                      <td className="py-3 px-4 text-emerald-400">{day.freelancers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Monthly Registrations */}
          <GlassCard className="animate-fade-in-up p-6" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-bold text-white mb-4">Monthly Registrations (Last 12 Months)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Month</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Total</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Clients</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Freelancers</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.registrationsByMonth.map((month, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-gray-300">{month.month}</td>
                      <td className="py-3 px-4 text-white font-semibold">{month.count}</td>
                      <td className="py-3 px-4 text-neonBlue">{month.clients}</td>
                      <td className="py-3 px-4 text-emerald-400">{month.freelancers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
