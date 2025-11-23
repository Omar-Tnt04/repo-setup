import React from 'react';
import { GlassCard, GradientText } from '../components/UI';

const MessagesPage = () => {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in-up"><GradientText>Messages</GradientText></h1>
      <GlassCard className="p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-gray-300">Real-time chat interface with Socket.io - To be implemented.</p>
      </GlassCard>
    </div>
  );
};

export default MessagesPage;
