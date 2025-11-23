import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { GlassCard, Button, GradientText } from '../components/UI';

const Signup = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    location: '',
    role: searchParams.get('role') || 'freelancer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]">
      <GlassCard className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-neonBlue to-neonPurple flex items-center justify-center shadow-lg shadow-neonBlue/20">
                <span className="text-3xl font-bold text-white">F</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              <GradientText>{t('auth.createAccount')}</GradientText>
            </h2>
            <p className="text-gray-400">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-neonBlue hover:text-neonPurple transition-colors font-semibold">
                {t('common.login')}
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.role')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'client' })}
                  className={`p-4 border rounded-xl text-center transition-all duration-300 ${
                    formData.role === 'client'
                      ? 'border-neonBlue bg-neonBlue/10 text-neonBlue shadow-lg shadow-neonBlue/20'
                      : 'border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  {t('auth.client')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                  className={`p-4 border rounded-xl text-center transition-all duration-300 ${
                    formData.role === 'freelancer'
                      ? 'border-neonPurple bg-neonPurple/10 text-neonPurple shadow-lg shadow-neonPurple/20'
                      : 'border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  {t('auth.freelancer')}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.fullName')}
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.phone')}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors"
                placeholder="+216 XX XXX XXX"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.location')}
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors"
                placeholder="Tunis, Tunisia"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </>
              ) : (
                t('common.signup')
              )}
            </Button>
          </form>
      </GlassCard>
    </div>
  );
};

export default Signup;
