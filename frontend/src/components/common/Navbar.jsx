import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = isLanding 
    ? "text-gray-600 hover:text-finpay-teal transition-all hover-lift font-medium"
    : "text-slate-300 hover:gradient-text transition-all hover-lift font-medium";

  return (
    <nav className={`${isLanding ? 'bg-white/80 border-gray-100' : 'glass-effect border-cyan-500/20'} border-b sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover-lift group">
            <img 
              src="/logo.png" 
              alt="Tunisian Top Freelancers" 
              className="w-16 h-16 md:w-20 md:h-20 object-contain transition-transform group-hover:scale-110 drop-shadow-lg"
            />
            <span className={`font-bold text-xl md:text-2xl hidden sm:block ${isLanding ? 'text-finpay-dark' : 'gradient-text'}`}>
              {t('common.appName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/jobs" className={navLinkClass}>
              {t('nav.jobs')}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLinkClass}>
                  {t('nav.dashboard')}
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition-all hover-lift font-medium">
                    Admin Panel
                  </Link>
                )}
                <Link to="/messages" className={`${navLinkClass} relative`}>
                  {t('nav.messages')}
                  {/* Notification Badge Example */}
                  {/* <span className="absolute -top-1 -right-2 w-5 h-5 bg-gradient-to-br from-cyan-500 to-emerald-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse-glow">3</span> */}
                </Link>
                {user?.role === 'client' && (
                  <Link to="/create-job" className="btn-primary">
                    <span className="flex items-center gap-2">
                      {t('nav.postJob')}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="flex items-center space-x-2 hover-lift">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
                      <span className="text-white font-medium text-sm">
                        {user?.full_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className={`${isLanding ? 'text-gray-500 hover:text-red-500' : 'text-slate-300 hover:text-red-400'} transition-colors hover-lift font-medium`}>
                    {t('common.logout')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClass}>
                  {t('common.login')}
                </Link>
                <Link to="/signup" className={isLanding ? "bg-finpay-teal text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all" : "btn-primary"}>
                  {t('common.signup')}
                </Link>
              </>
            )}

            {/* Language Switcher */}
            <div className={`flex items-center space-x-1 border-l pl-4 ${isLanding ? 'border-gray-200' : 'border-slate-600'}`}>
              <button
                onClick={() => changeLanguage('ar')}
                className={`px-2 py-1 rounded text-sm transition-all ${
                  i18n.language === 'ar' 
                    ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg' 
                    : isLanding ? 'text-gray-400 hover:bg-gray-100' : 'text-slate-400 hover:bg-slate-700 hover-lift'
                }`}
              >
                ع
              </button>
              <button
                onClick={() => changeLanguage('fr')}
                className={`px-2 py-1 rounded text-sm transition-all ${
                  i18n.language === 'fr' 
                    ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-700 hover-lift'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded text-sm transition-all ${
                  i18n.language === 'en' 
                    ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-700 hover-lift'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-all hover-lift"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-cyan-500/20 animate-fade-in-up">
            <div className="flex flex-col space-y-3">
              <Link to="/jobs" className="text-slate-300 hover:gradient-text transition-all font-medium p-2 rounded-lg hover:bg-slate-800/50">
                {t('nav.jobs')}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-slate-300 hover:gradient-text transition-all font-medium p-2 rounded-lg hover:bg-slate-800/50">
                    {t('nav.dashboard')}
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition-all font-medium p-2 rounded-lg hover:bg-purple-900/30">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/messages" className="text-slate-300 hover:gradient-text transition-all font-medium p-2 rounded-lg hover:bg-slate-800/50">
                    {t('nav.messages')}
                  </Link>
                  {user?.role === 'client' && (
                    <Link to="/create-job" className="btn-primary text-center">
                      {t('nav.postJob')}
                    </Link>
                  )}
                  <Link to="/profile" className="text-slate-300 hover:gradient-text transition-all font-medium p-2 rounded-lg hover:bg-slate-800/50">
                    {t('common.profile')}
                  </Link>
                  <button onClick={handleLogout} className="text-red-400 text-left font-medium p-2 rounded-lg hover:bg-red-900/30 hover:text-red-300">
                    {t('common.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-slate-300 hover:gradient-text transition-all font-medium p-2 rounded-lg hover:bg-slate-800/50">
                    {t('common.login')}
                  </Link>
                  <Link to="/signup" className="btn-primary text-center">
                    {t('common.signup')}
                  </Link>
                </>
              )}
              <div className="flex space-x-2 pt-2 border-t border-cyan-500/20">
                <button
                  onClick={() => changeLanguage('ar')}
                  className={`px-3 py-1 rounded transition-all ${
                    i18n.language === 'ar' 
                      ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg' 
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => changeLanguage('fr')}
                  className={`px-3 py-1 rounded transition-all ${
                    i18n.language === 'fr' 
                      ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg' 
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  Français
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1 rounded transition-all ${
                    i18n.language === 'en' 
                      ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg' 
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
