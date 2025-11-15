import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-slate-300 overflow-hidden">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-emerald-600/10 to-blue-600/10" 
           style={{
             backgroundSize: '400% 400%',
             animation: 'gradient-shift 20s ease infinite'
           }}></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '3s'}}></div>
      
      <div className="container-custom py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="animate-fade-in-up">
            <h3 className="text-white font-bold text-lg mb-4 gradient-text">{t('common.appName')}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              The trusted platform connecting talented Tunisian freelancers with clients. Secure, free, and easy to use.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center hover-lift shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center hover-lift shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center hover-lift shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:gradient-text transition-all hover-lift inline-block">{t('nav.jobs')}</Link></li>
              <li><Link to="/signup" className="hover:gradient-text transition-all hover-lift inline-block">{t('nav.howItWorks')}</Link></li>
              <li><Link to="/about" className="hover:gradient-text transition-all hover-lift inline-block">{t('nav.about')}</Link></li>
            </ul>
          </div>

          {/* For Clients */}
          <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <h4 className="text-white font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/create-job" className="hover:gradient-text transition-all hover-lift inline-block">Post a Job</Link></li>
              <li><Link to="/jobs" className="hover:gradient-text transition-all hover-lift inline-block">Browse Freelancers</Link></li>
              <li><Link to="/signup" className="hover:gradient-text transition-all hover-lift inline-block">Get Started</Link></li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <h4 className="text-white font-semibold mb-4">For Freelancers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:gradient-text transition-all hover-lift inline-block">Find Jobs</Link></li>
              <li><Link to="/signup" className="hover:gradient-text transition-all hover-lift inline-block">Create Profile</Link></li>
              <li><Link to="/dashboard" className="hover:gradient-text transition-all hover-lift inline-block">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-8 pt-8 text-center text-sm text-slate-400">
          <p className="animate-fade-in-up">&copy; {currentYear} {t('common.appName')}. All rights reserved. Made with <span className="text-emerald-400 animate-pulse-glow">❤️</span> for Tunisia 🇹🇳</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
