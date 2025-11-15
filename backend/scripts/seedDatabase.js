require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Job, Submission, Payment, Message } = require('../models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tunisian_freelancers';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Submission.deleteMany({});
    await Payment.deleteMany({});
    await Message.deleteMany({});
    console.log('✅ Cleared existing data');

    // Hash password for demo accounts
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Test@123', salt);

    // Create clients
    const clients = await User.create([
      {
        email: 'client1@example.com',
        password_hash: hashedPassword,
        full_name: 'Ahmed Ben Salem',
        role: 'client',
        location: 'Tunis, Tunisia',
        phone: '+216 20 123 456',
        bio: 'Entrepreneur looking for talented freelancers for my projects',
        preferred_language: 'fr'
      },
      {
        email: 'client2@example.com',
        password_hash: hashedPassword,
        full_name: 'Fatma Gharbi',
        role: 'client',
        location: 'Sfax, Tunisia',
        phone: '+216 25 654 321',
        bio: 'Startup founder seeking creative professionals',
        preferred_language: 'fr'
      },
      {
        email: 'client3@example.com',
        password_hash: hashedPassword,
        full_name: 'Mohamed Trabelsi',
        role: 'client',
        location: 'Sousse, Tunisia',
        phone: '+216 22 789 012',
        bio: 'Digital agency manager',
        preferred_language: 'fr'
      }
    ]);
    console.log('✅ Created 3 clients');

    // Create freelancers
    const freelancers = await User.create([
      {
        email: 'freelancer1@example.com',
        password_hash: hashedPassword,
        full_name: 'Youssef Mansour',
        role: 'freelancer',
        location: 'Tunis, Tunisia',
        phone: '+216 98 111 222',
        bio: 'Full-stack developer with 5 years experience in web and mobile development',
        rating: 4.80,
        total_jobs_completed: 15,
        preferred_language: 'fr',
        skills: [
          { skill_name: 'JavaScript', proficiency_level: 'expert' },
          { skill_name: 'React', proficiency_level: 'expert' },
          { skill_name: 'Node.js', proficiency_level: 'advanced' },
          { skill_name: 'MongoDB', proficiency_level: 'advanced' },
          { skill_name: 'Python', proficiency_level: 'intermediate' }
        ]
      },
      {
        email: 'freelancer2@example.com',
        password_hash: hashedPassword,
        full_name: 'Salma Karoui',
        role: 'freelancer',
        location: 'Ariana, Tunisia',
        phone: '+216 97 333 444',
        bio: 'Graphic designer and UI/UX specialist passionate about creating beautiful interfaces',
        rating: 4.95,
        total_jobs_completed: 28,
        preferred_language: 'fr',
        skills: [
          { skill_name: 'Photoshop', proficiency_level: 'expert' },
          { skill_name: 'Illustrator', proficiency_level: 'expert' },
          { skill_name: 'Figma', proficiency_level: 'expert' },
          { skill_name: 'UI/UX Design', proficiency_level: 'expert' },
          { skill_name: 'Branding', proficiency_level: 'advanced' }
        ]
      },
      {
        email: 'freelancer3@example.com',
        password_hash: hashedPassword,
        full_name: 'Amine Bouazizi',
        role: 'freelancer',
        location: 'Monastir, Tunisia',
        phone: '+216 55 555 666',
        bio: 'Content writer and translator (Arabic/French/English) specialized in SEO',
        rating: 4.60,
        total_jobs_completed: 42,
        preferred_language: 'fr',
        skills: [
          { skill_name: 'Content Writing', proficiency_level: 'expert' },
          { skill_name: 'Translation', proficiency_level: 'expert' },
          { skill_name: 'SEO', proficiency_level: 'advanced' },
          { skill_name: 'Copywriting', proficiency_level: 'advanced' }
        ]
      },
      {
        email: 'freelancer4@example.com',
        password_hash: hashedPassword,
        full_name: 'Nadia Slimani',
        role: 'freelancer',
        location: 'Nabeul, Tunisia',
        phone: '+216 29 777 888',
        bio: 'Social media manager and digital marketer with proven results',
        rating: 4.70,
        total_jobs_completed: 19,
        preferred_language: 'fr',
        skills: [
          { skill_name: 'Social Media Marketing', proficiency_level: 'expert' },
          { skill_name: 'Facebook Ads', proficiency_level: 'advanced' },
          { skill_name: 'Instagram Marketing', proficiency_level: 'advanced' },
          { skill_name: 'Content Strategy', proficiency_level: 'advanced' }
        ]
      },
      {
        email: 'freelancer5@example.com',
        password_hash: hashedPassword,
        full_name: 'Karim Jlassi',
        role: 'freelancer',
        location: 'Bizerte, Tunisia',
        phone: '+216 54 999 000',
        bio: 'Video editor and motion graphics animator for creative projects',
        rating: 4.50,
        total_jobs_completed: 11,
        preferred_language: 'fr',
        skills: [
          { skill_name: 'Video Editing', proficiency_level: 'expert' },
          { skill_name: 'Adobe Premiere Pro', proficiency_level: 'expert' },
          { skill_name: 'After Effects', proficiency_level: 'advanced' },
          { skill_name: 'Motion Graphics', proficiency_level: 'advanced' }
        ]
      }
    ]);
    console.log('✅ Created 5 freelancers with skills');

    // Create jobs
    const jobs = await Job.create([
      {
        client_id: clients[0]._id,
        title: "Développement d'une application mobile e-commerce",
        description: "Nous cherchons un développeur mobile expérimenté pour créer une application e-commerce complète avec panier, paiement en ligne et gestion des commandes.",
        category: 'Mobile Development',
        budget: 5000,
        currency: 'TND',
        deadline: new Date('2025-06-30'),
        status: 'open',
        required_skills: ['React Native', 'Node.js', 'MongoDB', 'Payment Integration'],
        views_count: 24
      },
      {
        client_id: clients[1]._id,
        title: "Création d'un logo et identité visuelle",
        description: "Startup cherche designer créatif pour logo moderne et charte graphique complète incluant carte de visite, en-tête de lettre.",
        category: 'Graphic Design',
        budget: 800,
        currency: 'TND',
        deadline: new Date('2025-05-15'),
        status: 'open',
        required_skills: ['Adobe Illustrator', 'Photoshop', 'Branding', 'UI/UX'],
        views_count: 18
      },
      {
        client_id: clients[2]._id,
        title: 'Rédaction de contenu SEO pour blog tech',
        description: 'Besoin de rédacteur spécialisé en technologie pour 20 articles SEO optimisés (1000-1500 mots chacun).',
        category: 'Content Writing',
        budget: 1200,
        currency: 'TND',
        deadline: new Date('2025-07-15'),
        status: 'open',
        required_skills: ['SEO Writing', 'Technical Writing', 'WordPress', 'French/Arabic'],
        views_count: 31
      },
      {
        client_id: clients[0]._id,
        title: 'Développement site web vitrine entreprise',
        description: "Création d'un site web professionnel pour entreprise de services avec présentation, portfolio, formulaire de contact.",
        category: 'Web Development',
        budget: 2500,
        currency: 'TND',
        deadline: new Date('2025-06-01'),
        status: 'open',
        required_skills: ['React', 'Tailwind CSS', 'Responsive Design', 'SEO'],
        views_count: 42
      },
      {
        client_id: clients[1]._id,
        title: 'Gestion des réseaux sociaux - 3 mois',
        description: 'Recherche community manager pour gérer Facebook, Instagram et LinkedIn (3 posts/semaine, engagement, analytics).',
        category: 'Digital Marketing',
        budget: 1500,
        currency: 'TND',
        deadline: new Date('2025-08-30'),
        status: 'open',
        required_skills: ['Social Media', 'Content Creation', 'Analytics', 'Facebook Ads'],
        views_count: 27
      },
      {
        client_id: clients[2]._id,
        title: 'Montage vidéo pour chaîne YouTube',
        description: 'Besoin d\'éditeur vidéo pour 10 vidéos YouTube (lifestyle/voyage) avec intro/outro, musique, effets.',
        category: 'Video Editing',
        budget: 900,
        currency: 'TND',
        deadline: new Date('2025-06-20'),
        status: 'open',
        required_skills: ['Adobe Premiere Pro', 'After Effects', 'Color Grading', 'YouTube SEO'],
        views_count: 15
      }
    ]);
    console.log('✅ Created 6 jobs');

    // Create submissions
    const submissions = await Submission.create([
      {
        job_id: jobs[0]._id,
        freelancer_id: freelancers[0]._id,
        description: "Bonjour, je suis développeur full-stack avec 5 ans d'expérience en React Native. J'ai déjà créé 3 applications e-commerce similaires. Je peux livrer en 8 semaines.",
        status: 'pending',
        submitted_at: new Date('2025-01-10')
      },
      {
        job_id: jobs[1]._id,
        freelancer_id: freelancers[1]._id,
        description: "Bonjour! Designer UI/UX avec portfolio de +50 logos. Je propose 3 concepts initiaux et révisions illimitées. Délai: 2 semaines.",
        status: 'approved',
        client_feedback: 'Excellent travail, très créatif!',
        rating: 5,
        submitted_at: new Date('2025-01-08')
      },
      {
        job_id: jobs[2]._id,
        freelancer_id: freelancers[2]._id,
        description: "Rédacteur tech depuis 4 ans. Spécialisé en SEO avec résultats prouvés (augmentation trafic +150%). 20 articles en 4 semaines.",
        status: 'pending',
        submitted_at: new Date('2025-01-12')
      }
    ]);
    console.log('✅ Created 3 submissions');

    // Create payments
    const payments = await Payment.create([
      {
        job_id: jobs[1]._id,
        submission_id: submissions[1]._id,
        client_id: clients[1]._id,
        freelancer_id: freelancers[1]._id,
        amount: 800,
        currency: 'TND',
        stripe_payment_intent_id: 'pi_demo_1234567890',
        status: 'released',
        released_at: new Date('2025-01-20')
      }
    ]);
    console.log('✅ Created 1 payment');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('Clients:');
    console.log('  - client1@example.com / Test@123');
    console.log('  - client2@example.com / Test@123');
    console.log('  - client3@example.com / Test@123');
    console.log('\nFreelancers:');
    console.log('  - freelancer1@example.com / Test@123 (Developer)');
    console.log('  - freelancer2@example.com / Test@123 (Designer)');
    console.log('  - freelancer3@example.com / Test@123 (Writer)');
    console.log('  - freelancer4@example.com / Test@123 (Marketer)');
    console.log('  - freelancer5@example.com / Test@123 (Video Editor)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
