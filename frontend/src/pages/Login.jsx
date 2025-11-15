import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card animate-scale-in">
          <div className="text-center mb-8">
            <img 
              src="/logo.png" 
              alt="Tunisian Top Freelancers" 
              className="w-20 h-20 mx-auto mb-4 object-contain"
            />
            <h2 className="text-3xl font-bold gradient-text mb-2">
              {t('auth.welcomeBack')}
            </h2>
            <p className="text-slate-300">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold hover-lift inline-block">
                {t('common.signup')}
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm animate-fade-in-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="example@email.com"
                value={formData.email}
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
                  className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-slate-600 rounded bg-slate-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium hover-lift inline-block">
                  {t('auth.forgotPassword')}
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5 border-2 mr-2"></div>
                  Loading...
                </>
              ) : (
                t('common.login')
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400 bg-slate-800/50 p-4 rounded-lg">
            <p className="font-semibold text-slate-300 mb-2">Demo Accounts (Password: Test@123):</p>
            <p className="mt-1">Client: client1@example.com</p>
            <p>Freelancer: freelancer1@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
