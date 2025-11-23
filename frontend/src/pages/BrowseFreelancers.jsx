import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { GlassCard, GradientText, Button } from '../components/UI';

const BrowseFreelancers = () => {
  const { t } = useTranslation();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    skill: '',
    minRating: 0
  });

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      // This would be an API call to get freelancers
      // For now, using mock data
      const mockFreelancers = [
        {
          id: 1,
          full_name: 'Youssef Mansour',
          bio: 'Full-stack developer with 5 years experience',
          rating: 4.80,
          total_jobs_completed: 15,
          location: 'Tunis, Tunisia',
          skills: ['JavaScript', 'React', 'Node.js', 'MySQL', 'Python']
        },
        {
          id: 2,
          full_name: 'Salma Karoui',
          bio: 'Graphic designer and UI/UX specialist',
          rating: 4.95,
          total_jobs_completed: 28,
          location: 'Ariana, Tunisia',
          skills: ['Photoshop', 'Illustrator', 'Figma', 'UI/UX Design', 'Branding']
        },
        {
          id: 3,
          full_name: 'Amine Bouazizi',
          bio: 'Content writer and translator (AR/FR/EN)',
          rating: 4.60,
          total_jobs_completed: 42,
          location: 'Monastir, Tunisia',
          skills: ['Content Writing', 'Translation', 'SEO', 'Copywriting']
        },
        {
          id: 4,
          full_name: 'Nadia Slimani',
          bio: 'Social media manager and digital marketer',
          rating: 4.70,
          total_jobs_completed: 19,
          location: 'Nabeul, Tunisia',
          skills: ['Social Media Marketing', 'Facebook Ads', 'Instagram Marketing', 'Content Strategy']
        },
        {
          id: 5,
          full_name: 'Karim Jlassi',
          bio: 'Video editor and animator',
          rating: 4.50,
          total_jobs_completed: 11,
          location: 'Bizerte, Tunisia',
          skills: ['Video Editing', 'Adobe Premiere Pro', 'After Effects', 'Motion Graphics']
        }
      ];
      
      setFreelancers(mockFreelancers);
      setError('');
    } catch (err) {
      setError('Failed to load freelancers');
      console.error('Error fetching freelancers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = freelancer.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         freelancer.bio.toLowerCase().includes(filters.search.toLowerCase());
    const matchesSkill = !filters.skill || freelancer.skills.some(skill => 
      skill.toLowerCase().includes(filters.skill.toLowerCase())
    );
    const matchesRating = freelancer.rating >= filters.minRating;
    
    return matchesSearch && matchesSkill && matchesRating;
  });

  if (loading) {
    return (
      <div className="container-custom py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neonBlue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading freelancers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 min-h-screen">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-2"><GradientText>Browse Freelancers</GradientText></h1>
        <p className="text-gray-400">Find talented freelancers for your projects</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 animate-fade-in-up">
          {error}
        </div>
      )}

      {/* Filters */}
      <GlassCard className="mb-6 animate-fade-in-up p-6" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name or skills..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Skill</label>
            <input
              type="text"
              placeholder="e.g., JavaScript, Design..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors"
              value={filters.skill}
              onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Rating</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors [&>option]:bg-slate-900"
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
            >
              <option value={0}>All Ratings</option>
              <option value={4.0}>4.0+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={4.8}>4.8+ Stars</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Freelancers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFreelancers.map((freelancer, index) => (
          <GlassCard 
            key={freelancer.id} 
            className="hover:border-neonBlue/50 transition-all duration-300 animate-fade-in-up group p-6"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            {/* Avatar */}
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-neonBlue to-neonPurple rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-neonBlue/20">
                {freelancer.full_name.charAt(0)}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-xl font-bold text-white group-hover:text-neonBlue transition-colors">
                  {freelancer.full_name}
                </h3>
                <p className="text-gray-400 text-sm">{freelancer.location}</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{freelancer.bio}</p>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-yellow-400 font-semibold">{freelancer.rating.toFixed(2)}</span>
              </div>
              <div className="text-gray-400 text-sm">
                {freelancer.total_jobs_completed} jobs completed
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.slice(0, 4).map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-neonBlue/10 text-neonBlue rounded text-xs font-medium border border-neonBlue/20"
                  >
                    {skill}
                  </span>
                ))}
                {freelancer.skills.length > 4 && (
                  <span className="px-2 py-1 bg-white/5 text-gray-400 rounded text-xs border border-white/10">
                    +{freelancer.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link 
                to={`/freelancer/${freelancer.id}`}
                className="flex-1"
              >
                <Button variant="primary" className="w-full text-sm">
                  View Profile
                </Button>
              </Link>
              <Button variant="outline" className="text-sm">
                Contact
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredFreelancers.length === 0 && (
        <GlassCard className="text-center py-12 animate-fade-in-up p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No Freelancers Found</h3>
          <p className="text-gray-400">Try adjusting your search filters</p>
        </GlassCard>
      )}

      {/* Quick Actions */}
      <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <p className="text-gray-400 mb-4">Can't find what you're looking for?</p>
        <Link to="/create-job">
          <Button variant="primary" className="inline-block">
            Post a Job
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BrowseFreelancers;
