const { GoogleGenerativeAI } = require('@google/generative-ai');
const { query } = require('../config/db');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Get AI-powered job recommendations for freelancer
// @access  Private (Freelancer only)
exports.getJobRecommendations = async (userId) => {
  try {
    // Get freelancer profile and skills
    const users = await query(
      `SELECT full_name, bio, location, rating, total_jobs_completed 
       FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      throw new Error('User not found');
    }

    const user = users[0];

    // Get user skills
    const userSkills = await query(
      'SELECT skill_name, proficiency_level FROM user_skills WHERE user_id = ?',
      [userId]
    );

    const skills = userSkills.map(s => `${s.skill_name} (${s.proficiency_level})`).join(', ');

    // Get recent jobs the freelancer has completed (for context)
    const completedJobs = await query(
      `SELECT j.category, j.title 
       FROM submissions s
       JOIN jobs j ON s.job_id = j.id
       WHERE s.freelancer_id = ? AND s.status = 'approved'
       ORDER BY s.submitted_at DESC
       LIMIT 5`,
      [userId]
    );

    const jobHistory = completedJobs.map(j => `${j.category}: ${j.title}`).join(', ');

    // Get all open jobs
    const openJobs = await query(
      `SELECT 
        j.id,
        j.title,
        j.description,
        j.category,
        j.budget,
        GROUP_CONCAT(DISTINCT js.skill_name) as required_skills
       FROM jobs j
       LEFT JOIN job_skills js ON j.id = js.job_id
       WHERE j.status = 'open'
       GROUP BY j.id
       ORDER BY j.created_at DESC
       LIMIT 50`
    );

    if (openJobs.length === 0) {
      return [];
    }

    // Prepare job list for AI
    const jobList = openJobs.map((job, index) => 
      `${index + 1}. ID: ${job.id} | Title: ${job.title} | Category: ${job.category} | Budget: ${job.budget} TND | Skills: ${job.required_skills || 'N/A'} | Description: ${job.description.substring(0, 150)}...`
    ).join('\n');

    // Create AI prompt
    const prompt = `
You are an AI job recommendation system for a freelance platform.

Freelancer Profile:
- Name: ${user.full_name}
- Skills: ${skills || 'No skills listed'}
- Bio: ${user.bio || 'No bio'}
- Location: ${user.location || 'Tunisia'}
- Rating: ${user.rating}/5.00
- Completed Jobs: ${user.total_jobs_completed}
- Recent Work: ${jobHistory || 'No history'}

Available Jobs:
${jobList}

Task: Recommend the TOP 10 most suitable jobs for this freelancer based on:
1. Skill match (most important)
2. Experience level and rating
3. Past work categories
4. Job budget alignment

Respond ONLY with a JSON array of job IDs in order of relevance (best match first).
Format: [1, 5, 3, 8, ...]

Do not include any explanation, just the array.
`;

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse AI response
    let recommendedJobIds = [];
    try {
      // Extract JSON array from response
      const jsonMatch = text.match(/\[[\d,\s]+\]/);
      if (jsonMatch) {
        recommendedJobIds = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback: return jobs sorted by skill match
      return openJobs.slice(0, 10).map(job => ({
        ...job,
        required_skills: job.required_skills ? job.required_skills.split(',') : [],
        match_score: 0.5 // Default score
      }));
    }

    // Get recommended jobs in order
    const recommendedJobs = recommendedJobIds
      .map(id => openJobs.find(job => job.id === id))
      .filter(job => job !== undefined)
      .slice(0, 10);

    // Add match scores
    recommendedJobs.forEach((job, index) => {
      job.required_skills = job.required_skills ? job.required_skills.split(',') : [];
      job.match_score = ((10 - index) / 10).toFixed(2); // Score from 1.0 to 0.1
      job.ai_recommended = true;
    });

    return recommendedJobs;
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    
    // Fallback: return recent open jobs if AI fails
    const fallbackJobs = await query(
      `SELECT 
        j.id,
        j.title,
        j.description,
        j.category,
        j.budget,
        GROUP_CONCAT(DISTINCT js.skill_name) as required_skills
       FROM jobs j
       LEFT JOIN job_skills js ON j.id = js.job_id
       WHERE j.status = 'open'
       GROUP BY j.id
       ORDER BY j.created_at DESC
       LIMIT 10`
    );

    return fallbackJobs.map(job => ({
      ...job,
      required_skills: job.required_skills ? job.required_skills.split(',') : [],
      match_score: 0.5,
      ai_recommended: false
    }));
  }
};

// @desc    Generate job description suggestions using AI
// @access  Helper function
exports.generateJobDescriptionSuggestions = async (title, category) => {
  try {
    const prompt = `
You are a job posting assistant for a freelance platform in Tunisia.

Generate a professional, clear job description for:
Title: ${title}
Category: ${category}

The description should:
- Be concise (100-200 words)
- Clearly state what needs to be done
- Include expected deliverables
- Be professional but friendly
- Be culturally appropriate for Tunisia
- Support multilingual context (Arabic, French, English)

Provide only the description text, no extra formatting.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return response.text().trim();
  } catch (error) {
    console.error('AI Description Generation Error:', error);
    return null;
  }
};

// @desc    Analyze freelancer skills and suggest improvements
// @access  Helper function
exports.analyzeFreelancerProfile = async (userId) => {
  try {
    // Get freelancer data
    const users = await query(
      'SELECT full_name, bio, rating, total_jobs_completed FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return null;
    }

    const user = users[0];

    const userSkills = await query(
      'SELECT skill_name, proficiency_level FROM user_skills WHERE user_id = ?',
      [userId]
    );

    const skills = userSkills.map(s => `${s.skill_name} (${s.proficiency_level})`).join(', ');

    // Get popular skills in the market
    const popularSkills = await query(
      `SELECT skill_name, COUNT(*) as demand 
       FROM job_skills 
       GROUP BY skill_name 
       ORDER BY demand DESC 
       LIMIT 20`
    );

    const marketSkills = popularSkills.map(s => s.skill_name).join(', ');

    const prompt = `
Analyze this freelancer profile and provide personalized suggestions:

Profile:
- Name: ${user.full_name}
- Current Skills: ${skills || 'No skills listed'}
- Bio: ${user.bio || 'No bio'}
- Rating: ${user.rating}/5.00
- Completed Jobs: ${user.total_jobs_completed}

High-Demand Skills in Market: ${marketSkills}

Provide 3-5 actionable suggestions to improve their profile and increase job opportunities.
Be specific, encouraging, and practical. Keep it under 150 words.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return response.text().trim();
  } catch (error) {
    console.error('AI Profile Analysis Error:', error);
    return null;
  }
};

module.exports = exports;
