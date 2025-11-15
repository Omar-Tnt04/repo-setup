import React from 'react';
import { useAuth } from '../context/AuthContext';

const FreelancerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold gradient-text mb-6 animate-fade-in-up">Freelancer Dashboard</h1>
      <p className="text-slate-300 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Welcome, {user?.full_name}!</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card hover-lift animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Available Jobs</h3>
          <p className="text-3xl font-bold gradient-text">0</p>
        </div>
        <div className="card hover-lift animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">My Submissions</h3>
          <p className="text-3xl font-bold text-yellow-400">0</p>
        </div>
        <div className="card hover-lift animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-emerald-400">{user?.total_jobs_completed || 0}</p>
        </div>
        <div className="card hover-lift animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">Rating</h3>
          <p className="text-3xl font-bold gradient-text">{user?.rating || '0.00'}</p>
        </div>
      </div>
      <p className="mt-6 text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>Full dashboard with AI recommendations, job listings, and submission tracking coming soon.</p>
    </div>
  );
};

export default FreelancerDashboard;
