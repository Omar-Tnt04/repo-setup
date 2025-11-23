import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const currentYear = new Date().getFullYear();

  const footerClass = isLanding 
    ? "relative bg-finpay-light text-finpay-black overflow-hidden border-t border-gray-200"
    : "relative bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-slate-300 overflow-hidden";

  const textClass = isLanding ? "text-gray-600" : "text-slate-400";
  const titleClass = isLanding ? "text-finpay-black font-semibold mb-4" : "text-white font-semibold mb-4";
  const linkClass = isLanding ? "hover:text-finpay-teal transition-all inline-block" : "hover:gradient-text transition-all hover-lift inline-block";

  return (
    <footer className={footerClass}>
      {/* Animated Background Effect - Only for dark theme */}
      {!isLanding && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-emerald-600/10 to-blue-600/10" 
             style={{
               backgroundSize: '400% 400%',
               animation: 'gradient-shift 20s ease infinite'
             }}></div>
      )}
      
      {/* Floating Orbs - Only for dark theme */}
      {!isLanding && (
        <>
          <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '3s'}}></div>
        </>
      )}
      
      <div className="container-custom py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="animate-fade-in-up">
            <h3 className={`${isLanding ? 'text-finpay-teal' : 'gradient-text'} font-bold text-lg mb-4`}>{t('common.appName')}</h3>
            <p className={`text-sm ${textClass} leading-relaxed`}>
              The trusted platform connecting talented Tunisian freelancers with clients. Secure, free, and easy to use.
            </p>
            <div className="flex space-x-3 mt-4">
              {/* Social Icons */}
              {/* ... (Keep existing icons but maybe adjust colors if needed, but they are colored buttons so it's fine) */}
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center hover-lift shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* ... other icons ... */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <h4 className={titleClass}>Quick Links</h4>
            <ul className={`space-y-2 text-sm ${textClass}`}>
              <li><Link to="/jobs" className={linkClass}>{t('nav.jobs')}</Link></li>
              <li><Link to="/signup" className={linkClass}>{t('nav.howItWorks')}</Link></li>
              <li><Link to="/about" className={linkClass}>{t('nav.about')}</Link></li>
            </ul>
          </div>

          {/* For Clients */}
          <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <h4 className={titleClass}>For Clients</h4>
            <ul className={`space-y-2 text-sm ${textClass}`}>
              <li><Link to="/create-job" className={linkClass}>Post a Job</Link></li>
              <li><Link to="/jobs" className={linkClass}>Browse Freelancers</Link></li>
              <li><Link to="/signup" className={linkClass}>Get Started</Link></li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <h4 className={titleClass}>For Freelancers</h4>
            <ul className={`space-y-2 text-sm ${textClass}`}>
              <li><Link to="/jobs" className={linkClass}>Find Jobs</Link></li>
              <li><Link to="/signup" className={linkClass}>Create Profile</Link></li>
              <li><Link to="/dashboard" className={linkClass}>Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className={`border-t ${isLanding ? 'border-gray-200' : 'border-slate-700/50'} mt-8 pt-8 text-center text-sm ${textClass}`}>
          <p className="animate-fade-in-up">&copy; {currentYear} {t('common.appName')}. All rights reserved. Made with <span className="text-emerald-400 animate-pulse-glow">❤️</span> for Tunisia 🇹🇳</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
