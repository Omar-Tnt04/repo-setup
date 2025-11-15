import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card animate-scale-in">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Tunisian Top Freelancers" className="w-20 h-20 mx-auto mb-4 object-contain" />
            <h2 className="text-3xl font-bold gradient-text mb-2">
              {t('auth.createAccount')}
            </h2>
            <p className="text-slate-300">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold hover-lift inline-block">
                {t('common.login')}
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm animate-fade-in-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('auth.role')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'client' })}
                  className={`p-4 border-2 rounded-lg text-center transition-all hover-lift ${
                    formData.role === 'client'
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-neon-cyan'
                      : 'border-slate-600 hover:border-slate-500 text-slate-300 bg-slate-800/50'
                  }`}
                >
                  {t('auth.client')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                  className={`p-4 border-2 rounded-lg text-center transition-all hover-lift ${
                    formData.role === 'freelancer'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-neon-emerald'
                      : 'border-slate-600 hover:border-slate-500 text-slate-300 bg-slate-800/50'
                  }`}
                >
                  {t('auth.freelancer')}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-slate-300 mb-2">
                {t('auth.fullName')}
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className="input"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                {t('auth.phone')}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input"
                placeholder="+216 XX XXX XXX"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">
                {t('auth.location')}
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="input"
                placeholder="Tunis, Tunisia"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                {t('auth.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5 border-2 mr-2"></div>
                  Creating Account...
                </>
              ) : (
                t('common.signup')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
