import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { GlassCard, GradientText, Button } from '../components/UI';

const JobsPage = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    currency: '',
    minBudget: 0,
    maxBudget: 10000
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs');
      setJobs(res.data.data.jobs || []);
      setError('');
    } catch (err) {
      console.error('Failed to load jobs, using mock data for demo');
      // Mock data with currency
      const mockJobs = [
        {
          _id: '1',
          title: 'Développement d\'une application mobile e-commerce',
          description: 'Nous cherchons un développeur mobile expérimenté pour créer une application e-commerce complète.',
          category: 'Mobile Development',
          budget: 5000,
          currency: 'TND',
          deadline: '2025-06-30',
          status: 'open',
          client_id: { full_name: 'Ahmed Ben Salem' },
          required_skills: ['React Native', 'Node.js', 'MongoDB', 'Payment Integration']
        },
        {
          _id: '2',
          title: 'International Marketing Campaign',
          description: 'Startup seeking expert for European market entry strategy.',
          category: 'Digital Marketing',
          budget: 1200,
          currency: 'EUR',
          deadline: '2025-05-15',
          status: 'open',
          client_id: { full_name: 'Global Tech SARL' },
          required_skills: ['Marketing Strategy', 'English', 'French', 'SEO']
        }
      ];
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Mobile Development',
    'Web Development',
    'Graphic Design',
    'Content Writing',
    'Digital Marketing',
    'Video Editing',
    'Translation'
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                          job.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === '' || job.category === filters.category;
    const matchesCurrency = filters.currency === '' || job.currency === filters.currency;
    const matchesBudget = job.budget >= filters.minBudget && job.budget <= filters.maxBudget;
    
    return matchesSearch && matchesCategory && matchesCurrency && matchesBudget;
  });

  if (loading) {
    return (
      <div className="container-custom py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neonBlue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 min-h-screen">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-2"><GradientText>Browse Jobs</GradientText></h1>
        <p className="text-gray-400">Find your next project and start earning</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 animate-fade-in-up">
          {error}
        </div>
      )}

      {/* Filters */}
      <GlassCard className="mb-6 animate-fade-in-up p-6" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors [&>option]:bg-slate-900"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors [&>option]:bg-slate-900"
              value={filters.currency}
              onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
            >
              <option value="">All Currencies</option>
              <option value="TND">TND</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Min Budget</label>
            <input
              type="number"
              placeholder="0"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors"
              value={filters.minBudget}
              onChange={(e) => setFilters({ ...filters, minBudget: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Max Budget</label>
            <input
              type="number"
              placeholder="10000"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors"
              value={filters.maxBudget}
              onChange={(e) => setFilters({ ...filters, maxBudget: parseFloat(e.target.value) || 10000 })}
            />
          </div>
        </div>
      </GlassCard>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job, index) => (
          <GlassCard 
            key={job._id || job.id} 
            className="hover:border-neonBlue/50 transition-all duration-300 animate-fade-in-up group p-6"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            {/* Header */}
            <div className="mb-4 pb-4 border-b border-white/10">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-neonBlue transition-colors flex-1">
                  {job.title}
                </h3>
                <span className="ml-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20">
                  {job.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm">Posted by {job.client_id?.full_name || job.client_name || 'Anonymous'}</p>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{job.description}</p>

            {/* Job Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-white/10">
              <div>
                <p className="text-gray-400 text-xs mb-1">Budget</p>
                <p className="text-neonBlue font-bold text-lg">{job.budget} {job.currency || 'TND'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Deadline</p>
                <p className="text-white font-semibold">{new Date(job.deadline).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs mb-1">Category</p>
                <p className="text-neonPurple font-medium">{job.category}</p>
              </div>
            </div>

            {/* Required Skills */}
            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {job.required_skills?.slice(0, 4).map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-neonBlue/10 text-neonBlue rounded text-xs font-medium border border-neonBlue/20"
                  >
                    {skill}
                  </span>
                ))}
                {job.required_skills?.length > 4 && (
                  <span className="px-2 py-1 bg-white/5 text-gray-400 rounded text-xs border border-white/10">
                    +{job.required_skills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link 
                to={`/jobs/${job._id || job.id}`}
                className="flex-1"
              >
                <Button variant="primary" className="w-full text-sm">
                  View Details
                </Button>
              </Link>
              <Button variant="outline" className="text-sm">
                Apply Now
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <GlassCard className="text-center py-12 animate-fade-in-up p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No Jobs Found</h3>
          <p className="text-gray-400">Try adjusting your search filters</p>
        </GlassCard>
      )}

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <GlassCard className="text-center p-6">
          <p className="text-gray-400 text-sm mb-1">Total Jobs</p>
          <p className="text-3xl font-bold"><GradientText>{jobs.length}</GradientText></p>
        </GlassCard>
        <GlassCard className="text-center p-6">
          <p className="text-gray-400 text-sm mb-1">Categories</p>
          <p className="text-3xl font-bold"><GradientText>{categories.length}</GradientText></p>
        </GlassCard>
        <GlassCard className="text-center p-6">
          <p className="text-gray-400 text-sm mb-1">Avg Budget</p>
          <p className="text-3xl font-bold">
            <GradientText>
              {jobs.length > 0 ? Math.round(jobs.reduce((sum, job) => sum + job.budget, 0) / jobs.length) : 0} TND
            </GradientText>
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default JobsPage;
