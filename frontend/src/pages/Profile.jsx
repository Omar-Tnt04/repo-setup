import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard, GradientText } from '../components/UI';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container-custom py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in-up"><GradientText>My Profile</GradientText></h1>
      <GlassCard className="p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <p className="text-lg text-white">{user?.full_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <p className="text-lg text-white">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
            <p className="text-lg capitalize text-white">{user?.role}</p>
          </div>
          {user?.role === 'freelancer' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Rating</label>
              <p className="text-lg font-bold"><GradientText>{user?.rating || '0.00'} / 5.00</GradientText></p>
            </div>
          )}
        </div>
      </GlassCard>
      <p className="mt-6 text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Full profile editing, photo upload, and skills management coming soon.</p>
    </div>
  );
};

export default Profile;
