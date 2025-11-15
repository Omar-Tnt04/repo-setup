-- Tunisian Top Freelancers Platform Database Schema
-- MySQL Database Schema
-- Created: 2025-11-11

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS job_skills;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('client', 'freelancer', 'admin') NOT NULL DEFAULT 'freelancer',
    profile_photo VARCHAR(500),
    bio TEXT,
    phone VARCHAR(50),
    location VARCHAR(255),
    preferred_language ENUM('ar', 'fr', 'en') DEFAULT 'fr',
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_jobs_completed INT DEFAULT 0,
    total_jobs_posted INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jobs Table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'TND',
    deadline DATE,
    status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
    visibility ENUM('public', 'private') DEFAULT 'public',
    required_skills TEXT,
    attachments TEXT,
    location_required BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    views_count INT DEFAULT 0,
    submissions_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_client (client_id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_created (created_at),
    FULLTEXT idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Skills Table (Many-to-Many relationship)
CREATE TABLE job_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_job (job_id),
    INDEX idx_skill (skill_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Skills Table (Many-to-Many relationship)
CREATE TABLE user_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_skill (user_id, skill_name),
    INDEX idx_user (user_id),
    INDEX idx_skill (skill_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Submissions Table
CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    freelancer_id INT NOT NULL,
    description TEXT NOT NULL,
    attachments TEXT,
    status ENUM('pending', 'approved', 'rejected', 'revision_requested') DEFAULT 'pending',
    client_feedback TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_job (job_id),
    INDEX idx_freelancer (freelancer_id),
    INDEX idx_status (status),
    INDEX idx_submitted (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments Table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    client_id INT NOT NULL,
    freelancer_id INT NOT NULL,
    submission_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'TND',
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    status ENUM('pending', 'held', 'released', 'refunded', 'failed') DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_fee DECIMAL(10, 2) DEFAULT 0.00,
    net_amount DECIMAL(10, 2),
    escrow_released_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    INDEX idx_job (job_id),
    INDEX idx_client (client_id),
    INDEX idx_freelancer (freelancer_id),
    INDEX idx_status (status),
    INDEX idx_stripe_intent (stripe_payment_intent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages Table
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text TEXT NOT NULL,
    attachments TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_job (job_id),
    INDEX idx_sender (sender_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_created (created_at),
    INDEX idx_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create a view for job statistics
CREATE OR REPLACE VIEW job_statistics AS
SELECT 
    j.id AS job_id,
    j.title,
    j.client_id,
    j.budget,
    j.status,
    COUNT(DISTINCT s.id) AS total_submissions,
    COUNT(DISTINCT CASE WHEN s.status = 'approved' THEN s.id END) AS approved_submissions,
    COUNT(DISTINCT m.id) AS total_messages,
    j.views_count,
    j.created_at
FROM jobs j
LEFT JOIN submissions s ON j.id = s.job_id
LEFT JOIN messages m ON j.id = m.job_id
GROUP BY j.id, j.title, j.client_id, j.budget, j.status, j.views_count, j.created_at;

-- Create a view for user statistics
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id AS user_id,
    u.email,
    u.full_name,
    u.role,
    u.rating,
    COUNT(DISTINCT CASE WHEN u.role = 'client' THEN j.id END) AS jobs_posted,
    COUNT(DISTINCT CASE WHEN u.role = 'freelancer' THEN s.id END) AS submissions_made,
    COUNT(DISTINCT CASE WHEN u.role = 'freelancer' AND s.status = 'approved' THEN s.id END) AS approved_submissions,
    SUM(CASE WHEN u.role = 'freelancer' AND p.status = 'released' THEN p.net_amount ELSE 0 END) AS total_earnings,
    u.created_at
FROM users u
LEFT JOIN jobs j ON u.id = j.client_id
LEFT JOIN submissions s ON u.id = s.freelancer_id
LEFT JOIN payments p ON u.id = p.freelancer_id
GROUP BY u.id, u.email, u.full_name, u.role, u.rating, u.created_at;

-- Stored Procedure: Update Job Status when submission is approved
DELIMITER //
CREATE PROCEDURE approve_submission(
    IN p_submission_id INT,
    IN p_rating INT,
    IN p_feedback TEXT
)
BEGIN
    DECLARE v_job_id INT;
    DECLARE v_freelancer_id INT;
    
    -- Start transaction
    START TRANSACTION;
    
    -- Get job and freelancer info
    SELECT job_id, freelancer_id INTO v_job_id, v_freelancer_id
    FROM submissions
    WHERE id = p_submission_id;
    
    -- Update submission
    UPDATE submissions 
    SET status = 'approved',
        rating = p_rating,
        client_feedback = p_feedback,
        reviewed_at = CURRENT_TIMESTAMP
    WHERE id = p_submission_id;
    
    -- Update job status
    UPDATE jobs 
    SET status = 'completed',
        completed_at = CURRENT_TIMESTAMP
    WHERE id = v_job_id;
    
    -- Update freelancer stats
    UPDATE users 
    SET total_jobs_completed = total_jobs_completed + 1
    WHERE id = v_freelancer_id;
    
    COMMIT;
END //
DELIMITER ;

-- Stored Procedure: Calculate and update user rating
DELIMITER //
CREATE PROCEDURE update_user_rating(IN p_user_id INT)
BEGIN
    DECLARE v_avg_rating DECIMAL(3, 2);
    
    SELECT AVG(rating) INTO v_avg_rating
    FROM submissions
    WHERE freelancer_id = p_user_id AND rating IS NOT NULL;
    
    UPDATE users
    SET rating = COALESCE(v_avg_rating, 0.00)
    WHERE id = p_user_id;
END //
DELIMITER ;

-- Trigger: Update job submissions count
DELIMITER //
CREATE TRIGGER after_submission_insert
AFTER INSERT ON submissions
FOR EACH ROW
BEGIN
    UPDATE jobs
    SET submissions_count = submissions_count + 1
    WHERE id = NEW.job_id;
END //
DELIMITER ;

-- Trigger: Update user rating after submission rating
DELIMITER //
CREATE TRIGGER after_submission_rating
AFTER UPDATE ON submissions
FOR EACH ROW
BEGIN
    IF NEW.rating IS NOT NULL AND (OLD.rating IS NULL OR OLD.rating != NEW.rating) THEN
        CALL update_user_rating(NEW.freelancer_id);
    END IF;
END //
DELIMITER ;

-- Insert default admin user (password: Admin@123 - CHANGE THIS!)
-- Password hash for 'Admin@123'
INSERT INTO users (email, password_hash, full_name, role, is_verified, is_active)
VALUES (
    'admin@tunisiantopfreelancers.com',
    '$2b$10$rX8gEJZkx9Q0Y6aKWKHc5OYJZvH3pKZjJ5w7c5pZP.N5xH0Y6gHfq',
    'Platform Administrator',
    'admin',
    TRUE,
    TRUE
);

-- Success message
SELECT 'Database schema created successfully!' AS status;
