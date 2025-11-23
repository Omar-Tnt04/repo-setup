import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard, GradientText } from '../components/UI';

const FreelancerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in-up"><GradientText>Freelancer Dashboard</GradientText></h1>
      <p className="text-gray-300 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Welcome, {user?.full_name}!</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="hover:border-neonBlue/50 transition-all duration-300 animate-fade-in-up p-6" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold text-white mb-2">Available Jobs</h3>
          <p className="text-3xl font-bold"><GradientText>0</GradientText></p>
        </GlassCard>
        <GlassCard className="hover:border-neonBlue/50 transition-all duration-300 animate-fade-in-up p-6" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-semibold text-white mb-2">My Submissions</h3>
          <p className="text-3xl font-bold text-yellow-400">0</p>
        </GlassCard>
        <GlassCard className="hover:border-neonBlue/50 transition-all duration-300 animate-fade-in-up p-6" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold text-white mb-2">Completed</h3>
          <p className="text-3xl font-bold text-emerald-400">{user?.total_jobs_completed || 0}</p>
        </GlassCard>
        <GlassCard className="hover:border-neonBlue/50 transition-all duration-300 animate-fade-in-up p-6" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-lg font-semibold text-white mb-2">Rating</h3>
          <p className="text-3xl font-bold"><GradientText>{user?.rating || '0.00'}</GradientText></p>
        </GlassCard>
      </div>
      <p className="mt-6 text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>Full dashboard with AI recommendations, job listings, and submission tracking coming soon.</p>
    </div>
  );
};

export default FreelancerDashboard;
