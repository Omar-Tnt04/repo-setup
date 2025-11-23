import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GradientText, Button } from '../components/UI';
import api from '../services/api';
import { DollarSign, Calendar, Briefcase, CreditCard } from 'lucide-react';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    budget: '',
    currency: 'TND',
    deadline: '',
    paymentProvider: 'konnect'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Job
      const jobResponse = await api.post('/jobs', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: Number(formData.budget),
        currency: formData.currency,
        deadline: formData.deadline,
        payment_provider: formData.paymentProvider
      });

      const jobId = jobResponse.data.data._id;

      // 2. Initiate Escrow Funding
      const fundResponse = await api.post('/payments/fund-escrow', {
        job_id: jobId,
        provider: formData.paymentProvider
      });

      // 3. Redirect to Payment (Mock)
      const paymentUrl = fundResponse.data.data.payment_url;
      // In a real app, this would be window.location.href = paymentUrl;
      // For this demo, we'll navigate to our internal mock page
      // We need to extract the transaction ID or just use the URL if it's internal
      // Assuming the backend returns a full URL, we might need to parse it or just use the ID
      
      // Let's assume we just navigate to a success/payment page for now
      // Or better, let's create a MockPayment page
      const transactionId = fundResponse.data.data.transaction_id;
      navigate(`/mock-payment/${transactionId}?provider=${formData.paymentProvider}&amount=${formData.budget}&currency=${formData.currency}`);

    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12 max-w-3xl">
      <div className="text-center mb-10 animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-4"><GradientText>Post a New Job</GradientText></h1>
        <p className="text-gray-400">Find the perfect Tunisian talent for your project. 0% Commission.</p>
      </div>

      <GlassCard className="p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Job Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors"
              placeholder="e.g. React Developer needed for E-commerce site"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Category</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <select
                name="category"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors [&>option]:bg-slate-900"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Writing">Writing</option>
                <option value="Translation">Translation</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Description</label>
            <textarea
              name="description"
              required
              rows="5"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors"
              placeholder="Describe your project requirements, deliverables, and timeline..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Budget & Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Budget</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-3.5 text-gray-500" size={20} />
                <input
                  type="number"
                  name="budget"
                  required
                  min="1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors"
                  placeholder="0.00"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Currency</label>
              <select
                name="currency"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors [&>option]:bg-slate-900"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="TND">TND (Tunisian Dinar)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Deadline</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <input
                type="date"
                name="deadline"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors [color-scheme:dark]"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Payment Provider */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Secure Escrow Provider</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['konnect', 'paymee', 'paymaster', 'zitouna', 'gpg'].map((provider) => (
                <div
                  key={provider}
                  onClick={() => setFormData({ ...formData, paymentProvider: provider })}
                  className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${
                    formData.paymentProvider === provider
                      ? 'bg-neonBlue/10 border-neonBlue text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <CreditCard size={24} />
                  <span className="capitalize font-medium">{provider}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Funds are held securely in escrow and only released when you approve the work.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg mt-8"
          >
            {loading ? 'Processing...' : 'Proceed to Secure Payment'}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
};

export default CreateJob;
