-- Seed Data for Tunisian Top Freelancers Platform
-- Test data for development and testing

-- Insert sample clients (password for all: Test@123)
INSERT INTO users (email, password_hash, full_name, role, bio, phone, location, preferred_language, is_verified, is_active) VALUES
('client1@example.com', '$2b$10$rX8gEJZkx9Q0Y6aKWKHc5OYJZvH3pKZjJ5w7c5pZP.N5xH0Y6gHfq', 'Ahmed Ben Salem', 'client', 'Entrepreneur looking for talented freelancers', '+216 20 123 456', 'Tunis, Tunisia', 'fr', TRUE, TRUE),
('client2@example.com', '$2b$10$rX8gEJZkx9Q0Y6aKWKHc5OYJZvH3pKZjJ5w7c5pZP.N5xH0Y6gHfq', 'Fatma Gharbi', 'client', 'Marketing manager at tech startup', '+216 22 789 012', 'Sfax, Tunisia', 'ar', TRUE, TRUE),
('client3@example.com', '$2b$10$rX8gEJZkx9Q0Y6aKWKHc5OYJZvH3pKZjJ5w7c5pZP.N5xH0Y6gHfq', 'Mohamed Trabelsi', 'client', 'Small business owner', '+216 24 456 789', 'Sousse, Tunisia', 'en', TRUE, TRUE);

-- Insert sample freelancers (password for all: Test@123)
INSERT INTO users (email, password_hash, full_name, role, bio, phone, location, preferred_language, rating, total_jobs_completed, is_verified, is_active) VALUES
('freelancer1@example.com', '$2b$10$rX8gEJZkx9Q0Y6aKWKHc5OYJZvH3pKZjJ5w7c5pZP.N5xH0Y6gHfq', 'Youssef Mansour', 'freelancer', 'Full-stack developer with 5 years experience', '+216 25 111 222', 'Tunis, Tunisia', 'en', 4.80, 15, TRUE, TRUE),
('freelancer2@example.com', '$2b$10$rX8gEJZkx9Q0Y6aKWKHc5OYJZvH3pKZjJ5w7c5pZP.N5xH0Y6gHfq', 'Salma Karoui', 'freelancer', 'Graphic designer and UI/UX specialist', '+216 26 333 444', 'Ariana, Tunisia', 'fr', 4.95, 28, TRUE, TRUE),
('freelancer3@example.com', '$2b$10$rX8gEJZkx9Q0Y6aKWKHc5OYJZvH3pKZjJ5w7c5pZP.N5xH0Y6gHfq', 'Amine Bouazizi', 'freelancer', 'Content writer and translator (AR/FR/EN)', '+216 27 555 666', 'Monastir, Tunisia', 'ar', 4.60, 42, TRUE, TRUE),
('freelancer4@example.com', '$2b$10$rX8gEJZkx9Q0Y6aKWKHc5OYJZvH3pKZjJ5w7c5pZP.N5xH0Y6gHfq', 'Nadia Slimani', 'freelancer', 'Social media manager and digital marketer', '+216 28 777 888', 'Nabeul, Tunisia', 'fr', 4.70, 19, TRUE, TRUE),
('freelancer5@example.com', '$2b$10$rX8gEJZkx9Q0Y6aKWKHc5OYJZvH3pKZjJ5w7c5pZP.N5xH0Y6gHfq', 'Karim Jlassi', 'freelancer', 'Video editor and animator', '+216 29 999 000', 'Bizerte, Tunisia', 'en', 4.50, 11, TRUE, TRUE);

-- Insert user skills for freelancers
INSERT INTO user_skills (user_id, skill_name, proficiency_level) VALUES
-- Youssef (freelancer1) - Developer
(5, 'JavaScript', 'expert'),
(5, 'React', 'expert'),
(5, 'Node.js', 'advanced'),
(5, 'MySQL', 'advanced'),
(5, 'Python', 'intermediate'),
-- Salma (freelancer2) - Designer
(6, 'Photoshop', 'expert'),
(6, 'Illustrator', 'expert'),
(6, 'Figma', 'advanced'),
(6, 'UI/UX Design', 'expert'),
(6, 'Branding', 'advanced'),
-- Amine (freelancer3) - Writer
(7, 'Content Writing', 'expert'),
(7, 'Translation', 'expert'),
(7, 'SEO', 'advanced'),
(7, 'Copywriting', 'advanced'),
-- Nadia (freelancer4) - Marketing
(8, 'Social Media Marketing', 'expert'),
(8, 'Facebook Ads', 'advanced'),
(8, 'Instagram Marketing', 'expert'),
(8, 'Content Strategy', 'advanced'),
(8, 'Google Analytics', 'intermediate'),
-- Karim (freelancer5) - Video
(9, 'Video Editing', 'expert'),
(9, 'Adobe Premiere Pro', 'expert'),
(9, 'After Effects', 'advanced'),
(9, 'Motion Graphics', 'advanced');

-- Insert sample jobs
INSERT INTO jobs (client_id, title, description, category, budget, currency, deadline, status, required_skills) VALUES
(2, 'Logo Design for Tech Startup', 'Need a modern, professional logo for my new tech startup. Should include source files and multiple variations. Colors: Blue and white theme preferred.', 'Design', 250.00, 'TND', DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'open', 'Logo Design, Illustrator, Branding'),
(3, 'Social Media Content Calendar', 'Create a 30-day social media content calendar for my restaurant. Include post ideas, captions in French and Arabic, and suggested posting times.', 'Marketing', 180.00, 'TND', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'open', 'Social Media Marketing, Content Strategy'),
(2, 'Website Landing Page Development', 'Build a responsive landing page for my product launch. Must be mobile-friendly with contact form integration. Provide source code.', 'Development', 450.00, 'TND', DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'open', 'HTML, CSS, JavaScript, React'),
(4, 'Product Description Translation', 'Translate 50 product descriptions from French to Arabic. E-commerce website. Need native Arabic speaker with good writing skills.', 'Writing', 120.00, 'TND', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'open', 'Translation, Arabic, French'),
(3, 'Instagram Reel Editing', 'Edit 10 short Instagram reels (15-30 seconds each) with transitions, music, and text overlays. Raw footage will be provided.', 'Video', 200.00, 'TND', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'open', 'Video Editing, Instagram, Adobe Premiere'),
(2, 'Business Presentation Design', 'Create a professional PowerPoint presentation (20 slides) for investor pitch. Include custom graphics and animations.', 'Design', 300.00, 'TND', DATE_ADD(CURDATE(), INTERVAL 8 DAY), 'open', 'PowerPoint, Graphic Design, Presentation Design'),
(4, 'SEO Blog Articles Writing', 'Write 5 SEO-optimized blog articles (800-1000 words each) about digital marketing topics in French. Include keywords research.', 'Writing', 350.00, 'TND', DATE_ADD(CURDATE(), INTERVAL 12 DAY), 'open', 'SEO, Content Writing, French'),
(3, 'Facebook Ads Campaign Setup', 'Set up and optimize a Facebook Ads campaign for my online store. Include audience targeting and ad creatives guidance.', 'Marketing', 280.00, 'TND', DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'open', 'Facebook Ads, Digital Marketing');

-- Insert job skills
INSERT INTO job_skills (job_id, skill_name) VALUES
-- Job 1: Logo Design
(1, 'Logo Design'),
(1, 'Illustrator'),
(1, 'Branding'),
-- Job 2: Social Media
(2, 'Social Media Marketing'),
(2, 'Content Strategy'),
-- Job 3: Landing Page
(3, 'HTML'),
(3, 'CSS'),
(3, 'JavaScript'),
(3, 'React'),
-- Job 4: Translation
(4, 'Translation'),
(4, 'Arabic'),
(4, 'French'),
-- Job 5: Video
(5, 'Video Editing'),
(5, 'Adobe Premiere'),
-- Job 6: Presentation
(6, 'PowerPoint'),
(6, 'Graphic Design'),
-- Job 7: Blog
(7, 'SEO'),
(7, 'Content Writing'),
-- Job 8: Ads
(8, 'Facebook Ads'),
(8, 'Digital Marketing');

-- Insert some sample submissions
INSERT INTO submissions (job_id, freelancer_id, description, status) VALUES
(1, 6, 'Hi! I have created 3 logo variations for your tech startup. Attached are PNG and AI files with different color schemes. Let me know if you need any revisions!', 'pending'),
(2, 8, 'Here is your complete 30-day social media calendar with posts in both French and Arabic. Includes hashtags and optimal posting times based on your restaurant niche.', 'approved'),
(4, 7, 'Completed translation of all 50 product descriptions from French to Arabic. Native speaker with e-commerce experience. Files attached.', 'approved');

-- Insert sample payments
INSERT INTO payments (job_id, client_id, freelancer_id, submission_id, amount, currency, status, transaction_fee, net_amount, stripe_payment_intent_id) VALUES
(2, 3, 8, 2, 180.00, 'TND', 'released', 9.00, 171.00, 'pi_test_1234567890'),
(4, 4, 7, 3, 120.00, 'TND', 'released', 6.00, 114.00, 'pi_test_0987654321');

-- Insert sample messages
INSERT INTO messages (job_id, sender_id, receiver_id, message_text, is_read) VALUES
(1, 6, 2, 'Hello! I am interested in your logo design project. I have 5 years of experience in branding. Can we discuss your vision?', TRUE),
(1, 2, 6, 'Hi Salma! Yes, I would love to work with you. I am looking for something modern and clean. Do you have a portfolio?', TRUE),
(3, 5, 2, 'Hi Ahmed, I can build your landing page using React. Do you have any design mockups or should I create them?', TRUE),
(3, 2, 5, 'I have wireframes ready. Let me share them with you. Can you integrate with Mailchimp for the contact form?', FALSE);

-- Update some statistics
UPDATE users SET total_jobs_posted = 2 WHERE id = 2;
UPDATE users SET total_jobs_posted = 3 WHERE id = 3;
UPDATE users SET total_jobs_posted = 3 WHERE id = 4;

-- Update job view counts
UPDATE jobs SET views_count = FLOOR(RAND() * 50) + 10 WHERE id > 0;

-- Success message
SELECT 'Seed data inserted successfully!' AS status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_jobs FROM jobs;
SELECT COUNT(*) AS total_submissions FROM submissions;
