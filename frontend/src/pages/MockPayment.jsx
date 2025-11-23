import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { GlassCard, Button, GradientText } from '../components/UI';
import { CheckCircle, AlertCircle, Shield } from 'lucide-react';
import api from '../services/api';

const MockPayment = () => {
  const { transactionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending'); // pending, processing, success, error

  const provider = searchParams.get('provider');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');

  const handleConfirmPayment = async () => {
    setStatus('processing');
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Call backend to confirm payment (Simulating Webhook)
      await api.post('/payments/confirm', {
        transaction_id: transactionId,
        status: 'success'
      });

      setStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <GlassCard className="max-w-md w-full p-8 text-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink" />

        <div className="mb-8">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Shield size={40} className="text-neonBlue" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Secure Payment Gateway</h2>
          <p className="text-gray-400">Simulating {provider?.toUpperCase()} Interface</p>
        </div>

        <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/5">
          <p className="text-sm text-gray-400 mb-1">Total Amount</p>
          <h3 className="text-3xl font-bold text-white">
            {amount} <span className="text-lg text-neonBlue">{currency}</span>
          </h3>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
            <span className="text-gray-400">Platform Fee</span>
            <span className="text-emerald-400 font-medium">0% (Free)</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-400">Processor Fee</span>
            <span className="text-gray-300">Included</span>
          </div>
        </div>

        {status === 'pending' && (
          <div className="space-y-4">
            <Button onClick={handleConfirmPayment} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700">
              Confirm Payment
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)} className="w-full">
              Cancel Transaction
            </Button>
          </div>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center py-4">
            <div className="w-10 h-10 border-4 border-neonBlue border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-300">Processing secure transaction...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-fade-in-up">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
            <p className="text-gray-400">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-fade-in-up">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Failed</h3>
            <p className="text-gray-400 mb-4">Something went wrong.</p>
            <Button onClick={() => setStatus('pending')} variant="secondary">Try Again</Button>
          </div>
        )}
        
        <div className="mt-8 text-xs text-gray-500">
          <p>Encrypted via 256-bit SSL. This is a secure sandbox environment.</p>
        </div>
      </GlassCard>
    </div>
  );
};

export default MockPayment;
