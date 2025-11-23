import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Twitter, Linkedin, Globe } from 'lucide-react';
import { Button, GlassCard, GradientText } from './UI';
import { Link, useLocation } from 'react-router-dom';

export const Layout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Find Work', path: '/jobs' },
    { name: 'Hire Talent', path: '/freelancers' },
    { name: 'Why Us', path: '/about' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-neonPurple/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neonBlue/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neonPurple/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-neonPink/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 z-50">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neonBlue to-neonPurple flex items-center justify-center shadow-lg shadow-neonBlue/20">
                <span className="text-xl font-bold text-white">F</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Freelance<span className="text-neonBlue">Hub</span></span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neonBlue transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="!px-4 !py-2">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" className="!px-4 !py-2">Sign Up</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden z-50 p-2 text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl z-40 transition-transform duration-300 md:hidden flex flex-col items-center justify-center gap-8 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white hover:text-neonBlue transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-4 w-64">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full">Log In</Button>
            </Link>
            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-20 min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-lg mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neonBlue to-neonPurple flex items-center justify-center">
                  <span className="text-lg font-bold text-white">F</span>
                </div>
                <span className="text-lg font-bold">FreelanceHub</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting elite Tunisian talent with global opportunities. The future of work is here.
              </p>
              <div className="flex gap-4">
                {[Github, Twitter, Linkedin, Globe].map((Icon, i) => (
                  <a key={i} href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Platform</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                {['Browse Jobs', 'Find Freelancers', 'Enterprise Solutions', 'Pricing', 'Success Stories'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-neonBlue transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                {['Blog', 'Community', 'Help Center', 'API Documentation', 'Guidelines'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-neonBlue transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">Subscribe for the latest opportunities and updates.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neonBlue w-full"
                />
                <button className="p-2 rounded-lg bg-neonBlue/20 text-neonBlue hover:bg-neonBlue hover:text-white transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2024 FreelanceHub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
