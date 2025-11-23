import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { GlassCard, Button, GradientText } from '../components/UI';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login failed');
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
              <GradientText>{t('auth.welcomeBack')}</GradientText>
            </h2>
            <p className="text-gray-400">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/signup" className="text-neonBlue hover:text-neonPurple transition-colors font-semibold">
                {t('common.signup')}
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-neonBlue focus:ring-neonBlue"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-neonBlue hover:text-neonPurple transition-colors font-medium">
                  {t('auth.forgotPassword')}
                </a>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Loading...
                </>
              ) : (
                t('common.login')
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400 bg-white/5 p-4 rounded-lg border border-white/5">
            <p className="font-semibold text-gray-300 mb-2">Demo Accounts (Password: Test@123):</p>
            <p className="mt-1">Client: client1@example.com</p>
            <p>Freelancer: freelancer1@example.com</p>
          </div>
      </GlassCard>
    </div>
  );
};

export default Login;
