const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Club = require('../models/Club');
const Event = require('../models/Event');
const Post = require('../models/Post');

// Sample Clubs Data
const clubs = [
  {
    name: "Coding Club",
    description: "Learn programming and participate in hackathons",
    logo: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
    category: "Technical",
    members: 156,
    achievements: [
      "Won Inter-College Hackathon 2023",
      "Organized 20+ technical workshops",
      "500+ students trained"
    ],
    president: "John Doe",
    vicePresident: "Jane Smith",
    email: "codingclub@college.edu",
    socialMedia: {
      instagram: "@codingclub",
      linkedin: "coding-club-college"
    },
    founded: "2018"
  },
  {
    name: "Photography Club",
    description: "Capture moments and enhance your photography skills",
    logo: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400",
    category: "Arts",
    members: 89,
    achievements: [
      "Annual Photography Exhibition 2023",
      "50+ photo walks organized",
      "Winner of State-level Photo Contest"
    ],
    president: "Sarah Johnson",
    vicePresident: "Mike Chen",
    email: "photoclub@college.edu",
    socialMedia: {
      instagram: "@collegephotoclub",
      linkedin: "photography-club"
    },
    founded: "2019"
  },
  {
    name: "Dance Club",
    description: "Express yourself through various dance forms",
    logo: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400",
    category: "Cultural",
    members: 124,
    achievements: [
      "1st Place in Inter-College Dance Fest 2023",
      "Performed at 15+ college events",
      "Choreographed 25+ performances"
    ],
    president: "Priya Sharma",
    vicePresident: "Rahul Kumar",
    email: "danceclub@college.edu",
    socialMedia: {
      instagram: "@collegedanceclub",
      linkedin: "dance-club-college"
    },
    founded: "2017"
  },
  {
    name: "Robotics Club",
    description: "Build robots and explore automation, AI, and innovative engineering",
    logo: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400",
    category: "Technical",
    members: 78,
    achievements: [
      "National Robotics Championship Finalists",
      "Built 10+ functional robots",
      "Published 3 research papers"
    ],
    president: "Alex Thompson",
    vicePresident: "Emily Davis",
    email: "robotics@college.edu",
    socialMedia: {
      instagram: "@roboticsclub",
      linkedin: "robotics-club-college"
    },
    founded: "2020"
  },
  {
    name: "Drama Club",
    description: "Perform on stage and develop acting, directing, and theatrical skills",
    logo: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
    category: "Arts",
    members: 92,
    achievements: [
      "Performed 12 successful plays",
      "Best Drama Club Award 2023",
      "Hosted State-level Theater Festival"
    ],
    president: "David Lee",
    vicePresident: "Sophie Brown",
    email: "dramaclub@college.edu",
    socialMedia: {
      instagram: "@dramaclub",
      linkedin: "drama-club"
    },
    founded: "2016"
  },
  {
    name: "Debate Society",
    description: "Sharpen your argumentation and public speaking through competitive debates",
    logo: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400",
    category: "Cultural",
    members: 65,
    achievements: [
      "Won Inter-State Debate Competition",
      "Organized 30+ debate sessions",
      "Best Speaker Awards at multiple events"
    ],
    president: "Aisha Patel",
    vicePresident: "James Wilson",
    email: "debate@college.edu",
    socialMedia: {
      instagram: "@debatesociety",
      linkedin: "debate-society"
    },
    founded: "2019"
  }
];

// Seed Database
const seedDatabase = async () => {
  try {
    console.log('🔄 Starting database seed...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/club-portal';
    console.log('📡 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Club.deleteMany();
    await Event.deleteMany();
    await Post.deleteMany();
    console.log('✅ Cleared existing data');

    // Insert Clubs
    console.log('📝 Creating clubs...');
    const createdClubs = await Club.insertMany(clubs);
    console.log(`✅ ${createdClubs.length} clubs created`);

    // Create Events for each club
    const events = [
      {
        title: "Tech Hackathon 2024",
        description: "24-hour coding competition with exciting prizes",
        date: new Date('2024-02-15'),
        time: "9:00 AM - 6:00 PM",
        venue: "Auditorium Hall",
        clubId: createdClubs[0]._id,
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400",
        category: "Technical",
        registrations: 145
      },
      {
        title: "Photography Workshop",
        description: "Learn advanced photography techniques",
        date: new Date('2024-02-18'),
        time: "2:00 PM - 5:00 PM",
        venue: "Room 301",
        clubId: createdClubs[1]._id,
        image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400",
        category: "Workshop",
        registrations: 67
      },
      {
        title: "Dance Performance",
        description: "Annual dance showcase featuring various styles",
        date: new Date('2024-02-20'),
        time: "6:00 PM - 8:00 PM",
        venue: "Main Auditorium",
        clubId: createdClubs[2]._id,
        image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400",
        category: "Performance",
        registrations: 201
      },
      {
        title: "Robotics Competition",
        description: "Showcase your robot and compete with others",
        date: new Date('2024-02-25'),
        time: "10:00 AM - 4:00 PM",
        venue: "Engineering Block",
        clubId: createdClubs[3]._id,
        image: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400",
        category: "Competition",
        registrations: 89
      },
      {
        title: "Annual Drama Performance",
        description: "A captivating theatrical experience",
        date: new Date('2024-02-28'),
        time: "6:00 PM - 8:30 PM",
        venue: "Theatre Hall",
        clubId: createdClubs[4]._id,
        image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
        category: "Performance",
        registrations: 201
      },
      {
        title: "Debate Championship",
        description: "Inter-department debate competition",
        date: new Date('2024-03-02'),
        time: "1:00 PM - 5:00 PM",
        venue: "Conference Room",
        clubId: createdClubs[5]._id,
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400",
        category: "Competition",
        registrations: 54
      }
    ];

    console.log('📝 Creating events...');
    const createdEvents = await Event.insertMany(events);
    console.log(`✅ ${createdEvents.length} events created`);

    // Create Posts for each club
    const posts = [
      {
        title: "Welcome to Coding Club!",
        content: "We're excited to have you join our community of passionate programmers. Get ready for an amazing journey of learning and innovation!",
        clubId: createdClubs[0]._id,
        author: "John Doe",
        tags: ["welcome", "introduction"],
        likes: 45
      },
      {
        title: "Photography Tips for Beginners",
        content: "Master the basics of photography with our comprehensive guide. Learn about composition, lighting, and camera settings.",
        clubId: createdClubs[1]._id,
        author: "Sarah Johnson",
        tags: ["tips", "beginner"],
        likes: 32
      },
      {
        title: "Dance Practice Schedule",
        content: "Join us every Tuesday and Thursday from 5 PM to 7 PM for regular practice sessions. All levels welcome!",
        clubId: createdClubs[2]._id,
        author: "Priya Sharma",
        tags: ["schedule", "practice"],
        likes: 28
      },
      {
        title: "Robotics Workshop Announcement",
        content: "Learn the fundamentals of robotics and automation. Hands-on experience with Arduino and Raspberry Pi.",
        clubId: createdClubs[3]._id,
        author: "Alex Thompson",
        tags: ["workshop", "arduino"],
        likes: 41
      },
      {
        title: "Auditions for Spring Play",
        content: "We're holding auditions for our upcoming spring production. All students are welcome to participate!",
        clubId: createdClubs[4]._id,
        author: "David Lee",
        tags: ["audition", "theater"],
        likes: 37
      },
      {
        title: "Debate Competition Registration Open",
        content: "Register now for the inter-college debate championship. Topics will be announced soon.",
        clubId: createdClubs[5]._id,
        author: "Aisha Patel",
        tags: ["competition", "registration"],
        likes: 29
      }
    ];

    console.log('📝 Creating posts...');
    const createdPosts = await Post.insertMany(posts);
    console.log(`✅ ${createdPosts.length} posts created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - ${createdClubs.length} clubs`);
    console.log(`   - ${createdEvents.length} events`);
    console.log(`   - ${createdPosts.length} posts`);
    console.log('\n✨ You can now start your server and test the API!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase()