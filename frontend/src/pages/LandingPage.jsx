import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: '💰',
      title: t('landing.features.freePosting.title'),
      description: t('landing.features.freePosting.description'),
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      icon: '🔒',
      title: t('landing.features.securePayment.title'),
      description: t('landing.features.securePayment.description'),
      gradient: 'from-emerald-400 to-green-500'
    },
    {
      icon: '🤖',
      title: t('landing.features.aiMatch.title'),
      description: t('landing.features.aiMatch.description'),
      gradient: 'from-teal-400 to-cyan-500'
    },
    {
      icon: '💬',
      title: t('landing.features.realTimeChat.title'),
      description: t('landing.features.realTimeChat.description'),
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      icon: '🌍',
      title: t('landing.features.multilingual.title'),
      description: t('landing.features.multilingual.description'),
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: '⚡',
      title: t('landing.features.zeroScams.title'),
      description: t('landing.features.zeroScams.description'),
      gradient: 'from-cyan-400 to-teal-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Post or Find Jobs',
      description: 'Clients post jobs for free. Freelancers browse and find work that matches their skills.',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      number: '02',
      title: 'Complete & Submit Work',
      description: 'Freelancers complete the job and submit their work with descriptions and files.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      number: '03',
      title: 'Review & Pay Securely',
      description: 'Clients review work, and upon approval, payment is released securely via Stripe.',
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-blue-900" 
             style={{
               backgroundSize: '400% 400%',
               animation: 'gradient-shift 15s ease infinite'
             }}></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Large Background Logo */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img 
              src="/logo.png" 
              alt="Tunisian Top Freelancers" 
              className="w-96 h-96 md:w-[500px] md:h-[500px] object-contain opacity-100 animate-pulse-glow animate-float blur-sm"
              style={{animationDuration: '8s'}}
            />
          </div>
          
          <div className="animate-fade-in-up relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              {t('landing.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto drop-shadow-lg">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/signup?role=client" className="btn-primary group">
                <span className="flex items-center gap-2">
                  {t('landing.hero.ctaClient')}
                  <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link to="/signup?role=freelancer" className="btn text-white backdrop-blur-md bg-white/10 border-2 border-white hover:bg-white/20 shadow-2xl px-8 py-4 rounded-lg font-semibold text-lg transition-all">
                <span className="flex items-center gap-2">
                  {t('landing.hero.ctaFreelancer')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 animate-scale-in">
            {[
              { number: '1000+', label: 'Active Freelancers' },
              { number: '500+', label: 'Projects Completed' },
              { number: '99%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6 hover-lift">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{t('landing.features.title')}</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Discover why thousands of professionals choose our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card hover-lift group animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`text-6xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                <h3 className="text-2xl font-bold mb-3 group-hover:gradient-text transition-all relative text-slate-200">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              How It Works
            </h2>
            <p className="text-xl text-slate-300">Simple, fast, and secure process</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-500 transform -translate-y-1/2"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative animate-scale-in" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="card text-center hover-lift neon-glow">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${step.color} text-white text-2xl font-bold mb-6 shadow-2xl relative z-10 animate-pulse-glow`}>
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 gradient-text">
                    {step.title}
                  </h3>
                  <p className="text-slate-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-emerald-900 to-cyan-900"
             style={{
               backgroundSize: '400% 400%',
               animation: 'gradient-shift 15s ease infinite'
             }}></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in-up">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-10 drop-shadow-lg animate-fade-in-up">
            Join thousands of Tunisian freelancers and clients today!
          </p>
          <Link to="/signup" className="btn text-purple-700 bg-white hover:bg-gray-100 shadow-2xl text-xl px-10 py-4 rounded-lg font-semibold animate-scale-in inline-flex items-center gap-3">
            {t('common.signup')} - It's Free!
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
