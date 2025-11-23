import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard, GradientText, Button, TechBadge, StatusIndicator } from '../components/UI';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Calendar, Clock, Shield, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState('');

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const jobRes = await api.get(`/jobs/${id}`);
        setJob(jobRes.data.data);

        // If client or freelancer, fetch submissions
        // Note: In a real app, backend should filter this based on permissions
        // For now, we'll just try to fetch and handle errors if not allowed
        try {
            const subRes = await api.get(`/submissions?job_id=${id}`);
            setSubmissions(subRes.data.data || []);
        } catch (err) {
            // Ignore if 403 or 404
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id]);

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/submissions', {
        job_id: id,
        description: submissionText,
        attachments: ['mock_file.zip'] // Mock attachment
      });
      alert('Work submitted successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error submitting work:', error);
      alert('Failed to submit work.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReleaseEscrow = async (submissionId) => {
    if (!window.confirm('Are you sure you want to accept this work and release funds? This cannot be undone.')) return;
    
    try {
      await api.post('/payments/release-escrow', {
        job_id: id,
        submission_id: submissionId
      });
      alert('Funds released successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error releasing escrow:', error);
      alert('Failed to release funds.');
    }
  };

  if (loading) return <div className="text-center py-20 text-white">Loading...</div>;
  if (!job) return <div className="text-center py-20 text-white">Job not found</div>;

  const isClient = user?.role === 'client' && user?._id === job.client_id?._id; // Assuming populated
  // Fallback check if client_id is just a string
  const isClientFallback = user?.role === 'client' && user?._id === job.client_id;
  const isOwner = isClient || isClientFallback;
  
  const isFreelancer = user?.role === 'freelancer';

  return (
    <div className="container-custom py-12 max-w-5xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-white">{job.title}</h1>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <span className="flex items-center gap-1"><Clock size={16}/> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Calendar size={16}/> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    <TechBadge label={job.category} color="bg-neonPurple" />
                </div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-bold text-white flex items-center justify-end gap-1">
                    {job.budget} <span className="text-neonBlue text-lg">{job.currency}</span>
                </div>
                <div className="flex items-center justify-end gap-2 mt-1">
                    <Shield size={14} className={job.escrow_status === 'funded' ? 'text-emerald-400' : 'text-amber-400'} />
                    <span className={`text-sm font-medium ${job.escrow_status === 'funded' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        Escrow: {job.escrow_status?.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <GlassCard className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
                    {job.description}
                </div>
            </GlassCard>

            {/* Submissions Section */}
            {(isOwner || isFreelancer) && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Submissions</h3>
                    
                    {submissions.length === 0 ? (
                        <GlassCard className="p-6 text-center text-gray-400">
                            No submissions yet.
                        </GlassCard>
                    ) : (
                        submissions.map((sub) => (
                            <GlassCard key={sub._id} className="p-6 border-l-4 border-l-neonBlue">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-white">Submission from Freelancer</h4>
                                        <p className="text-xs text-gray-500">{new Date(sub.createdAt).toLocaleString()}</p>
                                    </div>
                                    <StatusIndicator status={sub.status === 'approved' ? 'active' : 'pending'} />
                                </div>
                                <p className="text-gray-300 mb-4">{sub.description}</p>
                                
                                {/* Attachments Mock */}
                                <div className="flex gap-2 mb-6">
                                    {sub.attachments?.map((file, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-sm text-neonBlue border border-white/10">
                                            <FileText size={16} />
                                            <span>{file}</span>
                                            <Download size={14} className="ml-1 cursor-pointer hover:text-white" />
                                        </div>
                                    ))}
                                </div>

                                {isOwner && sub.status === 'pending' && job.escrow_status === 'funded' && (
                                    <div className="flex gap-4">
                                        <Button 
                                            onClick={() => handleReleaseEscrow(sub._id)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            Accept & Release Funds
                                        </Button>
                                        <Button variant="secondary">Request Changes</Button>
                                    </div>
                                )}
                                
                                {sub.status === 'approved' && (
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 flex items-center gap-2">
                                        <CheckCircle size={20} />
                                        <span>Work accepted and funds released!</span>
                                    </div>
                                )}
                            </GlassCard>
                        ))
                    )}
                </div>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Action Card */}
            <GlassCard className="p-6">
                {isFreelancer ? (
                    <>
                        <h3 className="text-lg font-bold text-white mb-4">Submit Proposal</h3>
                        {job.escrow_status !== 'funded' ? (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 mb-4 text-sm">
                                <AlertCircle size={16} className="inline mr-2" />
                                Waiting for client to fund escrow.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitWork} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <textarea 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-neonBlue outline-none"
                                        rows="4"
                                        placeholder="Describe your work..."
                                        value={submissionText}
                                        onChange={(e) => setSubmissionText(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Attachments</label>
                                    <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center text-gray-500 text-sm hover:border-neonBlue/50 transition-colors cursor-pointer">
                                        Click to upload files
                                    </div>
                                </div>
                                <Button type="submit" disabled={submitting} className="w-full">
                                    {submitting ? 'Submitting...' : 'Submit Work'}
                                </Button>
                            </form>
                        )}
                    </>
                ) : isOwner ? (
                    <>
                        <h3 className="text-lg font-bold text-white mb-4">Manage Job</h3>
                        {job.escrow_status === 'unfunded' ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
                                    <AlertCircle size={16} className="inline mr-2" />
                                    Escrow not funded. Freelancers cannot submit work.
                                </div>
                                <Button className="w-full bg-neonBlue hover:bg-blue-600">Fund Escrow Now</Button>
                            </div>
                        ) : (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
                                <Shield size={16} />
                                Escrow Funded & Secure
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-400">
                        Please login as a freelancer to apply.
                    </div>
                )}
            </GlassCard>

            {/* Safety Info */}
            <GlassCard className="p-6">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Shield size={18} className="text-neonPurple" />
                    Safety First
                </h4>
                <ul className="text-sm text-gray-400 space-y-2">
                    <li>• Payment is held in secure escrow</li>
                    <li>• 0% Commission for all parties</li>
                    <li>• Release funds only when satisfied</li>
                    <li>• 24/7 Dispute resolution support</li>
                </ul>
            </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
