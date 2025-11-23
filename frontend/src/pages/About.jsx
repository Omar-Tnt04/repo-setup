import React from 'react';
import { GlassCard, GradientText, Button } from '../components/UI';
import { Globe, Clock, Award, Code, Zap, GraduationCap, Languages, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const features = [
    {
      icon: <GraduationCap size={32} className="text-neonBlue" />,
      title: "Academic Excellence",
      description: "Tunisia is renowned for its rigorous engineering education system, producing thousands of highly skilled IT graduates annually who excel in problem-solving and algorithmic thinking."
    },
    {
      icon: <Languages size={32} className="text-neonPurple" />,
      title: "Polyglot Professionals",
      description: "Our freelancers are naturally multilingual, fluent in Arabic, French, and English. This linguistic versatility ensures seamless communication with global teams."
    },
    {
      icon: <Clock size={32} className="text-neonPink" />,
      title: "Strategic Time Zone",
      description: "Located in GMT+1, Tunisia shares working hours with Europe and offers a convenient overlap with the Americas and Asia, enabling real-time collaboration."
    },
    {
      icon: <TrendingUp size={32} className="text-emerald-400" />,
      title: "Competitive Advantage",
      description: "Experience the perfect balance of premium code quality and cost-effectiveness. Tunisian talent delivers enterprise-grade solutions that optimize your budget."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Why <GradientText>Tunisian Talent?</GradientText>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover the Mediterranean's tech hub. Tunisia combines a rich history of mathematical excellence with a vibrant, modern startup ecosystem.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <GlassCard 
              key={index} 
              className="p-8 hover:border-neonBlue/30 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Stats Section */}
        <GlassCard className="p-12 mb-20 text-center relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-neonBlue/10 via-neonPurple/10 to-neonPink/10 opacity-50" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                    <h4 className="text-4xl font-bold text-white mb-2">#1</h4>
                    <p className="text-neonBlue font-medium">Innovation Index (North Africa)</p>
                </div>
                <div>
                    <h4 className="text-4xl font-bold text-white mb-2">8,000+</h4>
                    <p className="text-neonPurple font-medium">IT Graduates Annually</p>
                </div>
                <div>
                    <h4 className="text-4xl font-bold text-white mb-2">GMT+1</h4>
                    <p className="text-neonPink font-medium">Ideal Time Zone</p>
                </div>
            </div>
        </GlassCard>

        {/* Mission Section */}
        <div className="mb-20 animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our <GradientText>Mission</GradientText></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              To provide a trusted, zero-commission platform for Tunisian freelancers to work with both local and international clients, backed by legal and secure Tunisian payment infrastructure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <GlassCard className="p-6">
                <div className="w-12 h-12 rounded-full bg-neonBlue/20 flex items-center justify-center mb-4 text-neonBlue">
                   <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">0% Commission</h3>
                <p className="text-gray-400">No fee for client or freelancer. Clients pay exactly what they set, freelancers get everything (minus processor fees).</p>
             </GlassCard>
             <GlassCard className="p-6">
                <div className="w-12 h-12 rounded-full bg-neonPurple/20 flex items-center justify-center mb-4 text-neonPurple">
                   <Award size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Escrow</h3>
                <p className="text-gray-400">Funds are held securely via regulated Tunisian PSPs (Konnect, Paymee) and released only when work is approved.</p>
             </GlassCard>
             <GlassCard className="p-6">
                <div className="w-12 h-12 rounded-full bg-neonPink/20 flex items-center justify-center mb-4 text-neonPink">
                   <Globe size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Global Reach</h3>
                <p className="text-gray-400">Connecting Tunisian talent with entrepreneurs, startups, and agencies worldwide.</p>
             </GlassCard>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to scale your team?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/freelancers">
                <Button variant="primary" className="px-8 py-4 text-lg w-full sm:w-auto">
                Hire Tunisian Talent
                </Button>
            </Link>
            <Link to="/signup">
                <Button variant="secondary" className="px-8 py-4 text-lg w-full sm:w-auto">
                Join as a Freelancer
                </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
