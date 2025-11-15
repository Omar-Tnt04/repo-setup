import React from 'react';
import { useParams } from 'react-router-dom';

const JobDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold gradient-text mb-6 animate-fade-in-up">Job Details</h1>
      <p className="text-slate-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Job details page for job ID: {id} - To be implemented with full job information, submission form, etc.</p>
    </div>
  );
};

export default JobDetails;
