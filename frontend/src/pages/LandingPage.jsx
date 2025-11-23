import React from 'react';
import { ArrowRight, CheckCircle, Star, Zap, Shield, Globe, Code, Palette, BarChart3 } from 'lucide-react';
import { Button, GlassCard, GradientText, TechBadge } from '../components/UI';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="space-y-32 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-neonBlue animate-pulse" />
            <span className="text-sm text-gray-300">The #1 Marketplace for Tunisian Talent</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Find the perfect <br />
            <GradientText>freelance services</GradientText> <br />
            for your business
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Connect with top-tier developers, designers, and experts. 
            Secure payments, verified talent, and seamless collaboration.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link to="/jobs">
              <Button variant="primary" className="w-full md:w-auto group">
                Find Work <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </Link>
            <Link to="/freelancers">
              <Button variant="secondary" className="w-full md:w-auto">
                Hire Talent
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-white/5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {[
              { label: 'Active Freelancers', value: '12k+' },
              { label: 'Completed Projects', value: '85k+' },
              { label: 'Customer Satisfaction', value: '99%' },
              { label: 'Total Revenue', value: '$12M+' },
            ].map((stat, i) => (
              <div key={i}>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FreelanceHub?</h2>
            <p className="text-gray-400">Everything you need to scale your team or career.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Secure Payments', desc: 'Funds are held safely until you approve the work.', color: 'text-neonBlue' },
              { icon: Zap, title: 'Fast Hiring', desc: 'Find the right talent in minutes, not days.', color: 'text-neonPurple' },
              { icon: Star, title: 'Top Quality', desc: 'Access the top 1% of talent in the region.', color: 'text-neonPink' },
            ].map((feature, i) => (
              <GlassCard key={i} className="p-8 hover:bg-white/10 transition-colors group">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Categories</h2>
              <p className="text-gray-400">Explore the most in-demand skills.</p>
            </div>
            <Button variant="ghost" className="hidden md:block">View All Categories</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Code, name: 'Development', count: '1.2k jobs', color: 'from-blue-500 to-cyan-500' },
              { icon: Palette, name: 'Design', count: '850 jobs', color: 'from-purple-500 to-pink-500' },
              { icon: BarChart3, name: 'Marketing', count: '600 jobs', color: 'from-orange-500 to-red-500' },
              { icon: Globe, name: 'Translation', count: '400 jobs', color: 'from-green-500 to-emerald-500' },
            ].map((cat, i) => (
              <GlassCard key={i} className="p-6 group cursor-pointer hover:border-white/20">
                <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${cat.color} opacity-20 mb-6 group-hover:opacity-30 transition-opacity relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <cat.icon size={40} className="text-white opacity-80" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.count}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CS324 Deliverables Section */}
      <section className="px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neonPurple/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <TechBadge label="Course Project" color="bg-neonPurple" />
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">CS324 Project Deliverables</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              This platform demonstrates the implementation of modern web technologies 
              and software engineering principles required for the CS324 course.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Code className="text-neonBlue" /> Frontend Architecture
              </h3>
              <ul className="space-y-4">
                {[
                  'React 18 with TypeScript for type safety',
                  'Tailwind CSS for utility-first styling',
                  'Framer Motion for complex animations',
                  'Glassmorphism design system implementation',
                  'Responsive layouts for all devices'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle size={18} className="text-neonBlue mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="text-neonPurple" /> Backend & Infrastructure
              </h3>
              <ul className="space-y-4">
                {[
                  'Node.js & Express RESTful API',
                  'MongoDB Atlas for scalable data storage',
                  'JWT Authentication & Authorization',
                  'Real-time updates with Socket.io',
                  'Stripe Payment Gateway Integration'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle size={18} className="text-neonPurple mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <GlassCard className="max-w-5xl mx-auto p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-neonBlue/10 via-neonPurple/10 to-neonPink/10" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers and clients building the future of work together.
            </p>
            <Link to="/signup">
              <Button variant="primary" className="!px-8 !py-4 text-lg">
                Create Your Account
              </Button>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};

export default LandingPage;
