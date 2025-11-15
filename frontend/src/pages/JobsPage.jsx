import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const JobsPage = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minBudget: 0,
    maxBudget: 10000
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // This would be an API call to get jobs
      // For now, using mock data based on seed.sql
      const mockJobs = [
        {
          id: 1,
          title: 'Développement d\'une application mobile e-commerce',
          description: 'Nous cherchons un développeur mobile expérimenté pour créer une application e-commerce complète.',
          category: 'Mobile Development',
          budget: 5000,
          deadline: '2025-06-30',
          status: 'open',
          client_name: 'Ahmed Ben Salem',
          required_skills: ['React Native', 'Node.js', 'MongoDB', 'Payment Integration']
        },
        {
          id: 2,
          title: 'Création d\'un logo et identité visuelle',
          description: 'Startup cherche designer créatif pour logo moderne et charte graphique complète.',
          category: 'Graphic Design',
          budget: 800,
          deadline: '2025-05-15',
          status: 'open',
          client_name: 'Fatma Gharbi',
          required_skills: ['Adobe Illustrator', 'Photoshop', 'Branding', 'UI/UX']
        },
        {
          id: 3,
          title: 'Rédaction de contenu SEO pour blog tech',
          description: 'Besoin de rédacteur spécialisé en technologie pour 20 articles SEO optimisés.',
          category: 'Content Writing',
          budget: 1200,
          deadline: '2025-07-15',
          status: 'open',
          client_name: 'Mohamed Trabelsi',
          required_skills: ['SEO Writing', 'Technical Writing', 'WordPress', 'French/Arabic']
        },
        {
          id: 4,
          title: 'Développement site web vitrine entreprise',
          description: 'Création d\'un site web professionnel pour entreprise de services.',
          category: 'Web Development',
          budget: 2500,
          deadline: '2025-06-01',
          status: 'open',
          client_name: 'Ahmed Ben Salem',
          required_skills: ['React', 'Tailwind CSS', 'Responsive Design', 'SEO']
        },
        {
          id: 5,
          title: 'Gestion des réseaux sociaux - 3 mois',
          description: 'Recherche community manager pour gérer Facebook, Instagram et LinkedIn.',
          category: 'Digital Marketing',
          budget: 1500,
          deadline: '2025-08-30',
          status: 'open',
          client_name: 'Fatma Gharbi',
          required_skills: ['Social Media', 'Content Creation', 'Analytics', 'Facebook Ads']
        },
        {
          id: 6,
          title: 'Montage vidéo pour chaîne YouTube',
          description: 'Besoin d\'éditeur vidéo pour 10 vidéos YouTube (lifestyle/voyage).',
          category: 'Video Editing',
          budget: 900,
          deadline: '2025-06-20',
          status: 'open',
          client_name: 'Mohamed Trabelsi',
          required_skills: ['Adobe Premiere Pro', 'After Effects', 'Color Grading', 'YouTube SEO']
        }
      ];
      
      setJobs(mockJobs);
      setError('');
    } catch (err) {
      setError('Failed to load jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         job.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || job.category === filters.category;
    const matchesBudget = job.budget >= filters.minBudget && job.budget <= filters.maxBudget;
    
    return matchesSearch && matchesCategory && matchesBudget;
  });

  const categories = [...new Set(jobs.map(job => job.category))];

  if (loading) {
    return (
      <div className="container-custom py-8 min-h-screen">
        <div className="text-center">
          <div className="spinner w-16 h-16 border-4 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 min-h-screen">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold gradient-text mb-2">Browse Jobs</h1>
        <p className="text-slate-300">Find your next project and start earning</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 animate-fade-in-up">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search jobs..."
              className="input w-full"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <select
              className="input w-full"
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Min Budget (TND)</label>
            <input
              type="number"
              placeholder="0"
              className="input w-full"
              value={filters.minBudget}
              onChange={(e) => setFilters({ ...filters, minBudget: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Max Budget (TND)</label>
            <input
              type="number"
              placeholder="10000"
              className="input w-full"
              value={filters.maxBudget}
              onChange={(e) => setFilters({ ...filters, maxBudget: parseFloat(e.target.value) || 10000 })}
            />
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job, index) => (
          <div 
            key={job.id} 
            className="card hover-lift animate-fade-in-up group"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            {/* Header */}
            <div className="mb-4 pb-4 border-b border-slate-700">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-200 group-hover:gradient-text transition-all flex-1">
                  {job.title}
                </h3>
                <span className="ml-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
                  {job.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm">Posted by {job.client_name}</p>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-sm mb-4 line-clamp-2">{job.description}</p>

            {/* Job Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-700">
              <div>
                <p className="text-slate-400 text-xs mb-1">Budget</p>
                <p className="text-cyan-400 font-bold text-lg">{job.budget} TND</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Deadline</p>
                <p className="text-slate-200 font-semibold">{new Date(job.deadline).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-400 text-xs mb-1">Category</p>
                <p className="text-emerald-300 font-medium">{job.category}</p>
              </div>
            </div>

            {/* Required Skills */}
            <div className="mb-4">
              <p className="text-slate-400 text-xs mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.slice(0, 4).map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {job.required_skills.length > 4 && (
                  <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">
                    +{job.required_skills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link 
                to={`/jobs/${job.id}`}
                className="flex-1 btn-primary text-center text-sm"
              >
                View Details
              </Link>
              <button className="px-4 py-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg transition-all font-medium text-sm">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="card text-center py-12 animate-fade-in-up">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-200 mb-2">No Jobs Found</h3>
          <p className="text-slate-400">Try adjusting your search filters</p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="card text-center">
          <p className="text-slate-400 text-sm mb-1">Total Jobs</p>
          <p className="text-3xl font-bold gradient-text">{jobs.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-slate-400 text-sm mb-1">Categories</p>
          <p className="text-3xl font-bold gradient-text">{categories.length}</p>
        </div>
        <div className="card text-center">
          <p className="text-slate-400 text-sm mb-1">Avg Budget</p>
          <p className="text-3xl font-bold gradient-text">
            {jobs.length > 0 ? Math.round(jobs.reduce((sum, job) => sum + job.budget, 0) / jobs.length) : 0} TND
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
