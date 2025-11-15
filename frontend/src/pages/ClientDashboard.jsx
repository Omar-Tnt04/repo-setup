import React from 'react';
import { useAuth } from '../context/AuthContext';

const ClientDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold gradient-text mb-6 animate-fade-in-up">Client Dashboard</h1>
      <p className="text-slate-300 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Welcome, {user?.full_name}!</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover-lift animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold gradient-text">0</p>
        </div>
        <div className="card hover-lift animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Pending Submissions</h3>
          <p className="text-3xl font-bold text-yellow-400">0</p>
        </div>
        <div className="card hover-lift animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Completed Jobs</h3>
          <p className="text-3xl font-bold text-emerald-400">0</p>
        </div>
      </div>
      <p className="mt-6 text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>Full dashboard implementation with job management, submission reviews, and payments coming soon.</p>
    </div>
  );
};

export default ClientDashboard;
