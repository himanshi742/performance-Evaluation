const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Models
const Company = require('./models/Company');
const User = require('./models/User');
const FeedbackCycle = require('./models/FeedbackCycle');
const FeedbackSubmission = require('./models/FeedbackSubmission');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Seeding...');

    // 1. Clear existing data to prevent duplicates on multiple runs
    await Company.deleteMany({});
    await User.deleteMany({});
    await FeedbackCycle.deleteMany({});
    await FeedbackSubmission.deleteMany({});

    // Default password for all seed users
    const passwordHash = await bcrypt.hash('PilotPass123!', 10);

    // =========================================================================
    // SCENARIO 1: Ashoka Textiles (Multi-tiered structure)
    // =========================================================================
    const ashoka = await Company.create({
      name: 'Ashoka Textiles',
      domain: 'ashokatextiles.com'
    });

    // HR Lead (Kavita)
    const kavita = await User.create({
      companyId: ashoka._id,
      name: 'Kavita Mehta',
      email: 'kavita@ashokatextiles.com',
      passwordHash,
      role: 'HR_ADMIN',
      designation: 'HR Lead',
      department: 'Human Resources'
    });

    // Top Level: COO
    const coo = await User.create({
      companyId: ashoka._id,
      name: 'Vikramaditya Roy',
      email: 'vikram@ashokatextiles.com',
      passwordHash,
      role: 'FOUNDER',
      designation: 'Chief Operating Officer'
    });

    // Middle Layer: Rohan (Reports to COO)
    const rohan = await User.create({
      companyId: ashoka._id,
      name: 'Rohan Verma',
      email: 'rohan@ashokatextiles.com',
      passwordHash,
      role: 'MANAGER',
      designation: 'VP of Production',
      department: 'Operations',
      managerId: coo._id
    });

    // Manager: Priya (Reports to Rohan)
    const priya = await User.create({
      companyId: ashoka._id,
      name: 'Priya Sharma',
      email: 'priya@ashokatextiles.com',
      passwordHash,
      role: 'MANAGER',
      designation: 'Quality Control Lead',
      department: 'Quality Assurance',
      managerId: rohan._id
    });



    // Priya's 6 Team Members
    const priyaTeamNames = ['Aarav Patel', 'Diya Iyer', 'Kabir Singh', 'Ananya Roy', 'Rohan Das', 'Meera Joshi'];
    const priyaTeam = [];

    for (let i = 0; i < priyaTeamNames.length; i++) {
      const emp = await User.create({
        companyId: ashoka._id,
        name: priyaTeamNames[i],
        email: `team${i + 1}@ashokatextiles.com`,
        passwordHash,
        role: 'EMPLOYEE',
        designation: 'QA Specialist',
        department: 'Quality Assurance',
        managerId: priya._id
      });
      priyaTeam.push(emp);
    }

    // Create the Active Cycle
    const currentCycle = await FeedbackCycle.create({
      companyId: ashoka._id,
      title: 'July 2026',
      month: 7,
      year: 2026,
      status: 'ACTIVE',
      dueDate: new Date('2026-07-31')
    });

    // Create some existing submissions for Ashoka
    // Rohan submits feedback for Priya
    await FeedbackSubmission.create({
      companyId: ashoka._id,
      cycleId: currentCycle._id,
      reviewerId: rohan._id,
      revieweeId: priya._id,
      status: 'SUBMITTED',
      submittedAt: new Date(),
      ratings: [
        { parameterId: 'ownership', score: 5, reason: 'Drove new ISO compliance standard adoption.' },
        { parameterId: 'communication', score: 4, reason: 'Clear guidance provided to direct reports.' },
        { parameterId: 'quality_of_work', score: 5, reason: 'Flawless QA documentation.' },
        { parameterId: 'teamwork', score: 5, reason: 'Mentored new junior inspectors.' },
        { parameterId: 'problem_solving', score: 4, reason: 'Quick workaround for material shortages.' }
      ]
    });

    // Priya submits feedback for 4 out of her 6 reports (Leaving 2 pending for Kavita's HR View)
    for (let i = 0; i < 4; i++) {
      await FeedbackSubmission.create({
        companyId: ashoka._id,
        cycleId: currentCycle._id,
        reviewerId: priya._id,
        revieweeId: priyaTeam[i]._id,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        ratings: [
          { parameterId: 'ownership', score: 4, reason: 'Consistently meets inspection targets.' },
          { parameterId: 'communication', score: 3, reason: 'Needs minor improvement in shift handovers.' },
          { parameterId: 'quality_of_work', score: 5, reason: 'Attention to detail is outstanding.' },
          { parameterId: 'teamwork', score: 4, reason: 'Helpful attitude during peak loads.' },
          { parameterId: 'problem_solving', score: 4, reason: 'Identifies yarn inconsistencies early.' }
        ]
      });
    }

    // =========================================================================
    // SCENARIO 2: Bright Path Consulting (Flat structure)
    // =========================================================================
    const brightPath = await Company.create({
      name: 'Bright Path Consulting',
      domain: 'brightpath.com'
    });

    // Founder
    const founder = await User.create({
      companyId: brightPath._id,
      name: 'Siddharth Rao',
      email: 'siddharth@brightpath.com',
      passwordHash,
      role: 'FOUNDER',
      designation: 'Managing Director'
    });

    // 8 Direct Reports to Founder (No Middle Layer)
    const bpTeamNames = [
  'Amitav Ghosh',
  'Bhavna Kulkarni',
  'Chirag Kapoor',
  'Devika Nair',
  'Esha Gupta',
  'Farhan Qureshi',
  'Gaurav Taneja',
  'Harini Rao'
];

const bpEmails = [
  'amitav@brightpath.com',
  'bhavna@brightpath.com',
  'chirag@brightpath.com',
  'devika@brightpath.com',
  'esha@brightpath.com',
  'farhan@brightpath.com',
  'gaurav@brightpath.com',
  'harini@brightpath.com'
];

for (let i = 0; i < bpTeamNames.length; i++) {
  await User.create({
    companyId: brightPath._id,
    name: bpTeamNames[i],
    email: bpEmails[i],
    passwordHash,
    role: 'EMPLOYEE',
    designation: 'Management Consultant',
    department: 'Strategy',
    managerId: founder._id
  });
}

    await FeedbackCycle.create({
      companyId: brightPath._id,
      title: 'July 2026',
      month: 7,
      year: 2026,
      status: 'ACTIVE',
      dueDate: new Date('2026-07-31')
    });

    console.log('\n✅ Seeding Finished Successfully!');
    console.log('----------------------------------------------------');
    console.log('Use these credentials to test later:');
    console.log('Ashoka HR (Kavita) : kavita@ashokatextiles.com  | PilotPass123!');
    console.log('Ashoka Mgr (Priya) : priya@ashokatextiles.com   | PilotPass123!');
    console.log('Bright Path Founder: siddharth@brightpath.com   | PilotPass123!');
    console.log('----------------------------------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
}

seedDatabase();