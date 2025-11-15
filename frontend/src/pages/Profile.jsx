import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container-custom py-8 max-w-3xl">
      <h1 className="text-3xl font-bold gradient-text mb-6 animate-fade-in-up">My Profile</h1>
      <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
            <p className="text-lg text-slate-200">{user?.full_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <p className="text-lg text-slate-200">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
            <p className="text-lg capitalize text-slate-200">{user?.role}</p>
          </div>
          {user?.role === 'freelancer' && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Rating</label>
              <p className="text-lg gradient-text">{user?.rating || '0.00'} / 5.00</p>
            </div>
          )}
        </div>
      </div>
      <p className="mt-6 text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Full profile editing, photo upload, and skills management coming soon.</p>
    </div>
  );
};

export default Profile;
