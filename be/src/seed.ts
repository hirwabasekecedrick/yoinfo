import { prisma } from './config/db';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.business.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.link.deleteMany();
  await prisma.post.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  // Create users
  const poster1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Designer',
      password,
      role: 'POSTER',
    },
  });

  const poster2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Engineer',
      password,
      role: 'POSTER',
    },
  });

  // Create tags
  const tags = await Promise.all(
    ['Technology', 'Healthcare', 'Finance', 'Education', 'Agriculture', 'Energy', 'Real Estate', 'Retail', 'Tourism', 'Manufacturing'].map(name =>
      prisma.tag.create({ data: { name: name.toLowerCase().replace(/\s+/g, '_'), label: name } })
    )
  );

  // Create sample investments
  const investmentData = [
    {
      title: 'Green Valley Residential Complex',
      category: 'Real Estate',
      summary: 'A premium 200-unit residential development in the heart of the city. Sustainable design with solar panels, green spaces, and modern amenities.',
      minInvestment: 50000,
      maxInvestment: 500000,
      location: 'Kigali',
      status: 'Open',
      roi: '18-24%',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
      featured: true,
      authorId: poster1.id,
    },
    {
      title: 'AgriTech Smart Farming Platform',
      category: 'Technology',
      summary: 'AI-powered precision agriculture platform helping farmers optimize crop yields. Currently operating in 5 countries with 10,000+ active users.',
      minInvestment: 25000,
      maxInvestment: 250000,
      location: 'Nairobi',
      status: 'Open',
      roi: '25-35%',
      imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
      featured: true,
      authorId: poster2.id,
    },
    {
      title: 'Solar Energy Farm Expansion',
      category: 'Energy',
      summary: 'Expanding existing 5MW solar farm to 20MW capacity. Long-term power purchase agreements already secured with national utility.',
      minInvestment: 100000,
      maxInvestment: 1000000,
      location: 'Arusha',
      status: 'Closing Soon',
      roi: '12-16%',
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
      authorId: poster1.id,
    },
    {
      title: 'Organic Coffee Export Business',
      category: 'Agriculture',
      summary: 'Fair-trade certified organic coffee farm with direct European buyer relationships. 500 hectares of prime arabica growing land.',
      minInvestment: 30000,
      maxInvestment: 200000,
      location: 'Kampala',
      status: 'Open',
      roi: '20-30%',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop',
      authorId: poster2.id,
    },
    {
      title: 'Digital Health Clinic Chain',
      category: 'Healthcare',
      summary: 'Network of tech-enabled walk-in clinics providing affordable healthcare. 12 locations operational, seeking Series A to expand.',
      minInvestment: 75000,
      maxInvestment: 750000,
      location: 'Dar es Salaam',
      status: 'Open',
      roi: '22-28%',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
      authorId: poster1.id,
    },
    {
      title: 'TechHub Co-Working Spaces',
      category: 'Real Estate',
      summary: 'Premium co-working and innovation spaces in growing tech ecosystems. Membership model with 85% occupancy rate.',
      minInvestment: 40000,
      maxInvestment: 300000,
      location: 'Kigali',
      status: 'Open',
      roi: '15-20%',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
      authorId: poster2.id,
    },
    {
      title: 'EduTech Learning Platform',
      category: 'Education',
      summary: 'Online learning platform serving 50,000+ students across Africa. Gamified curriculum aligned with national education standards.',
      minInvestment: 20000,
      maxInvestment: 150000,
      location: 'Lagos',
      status: 'Open',
      roi: '30-40%',
      imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop',
      authorId: poster1.id,
    },
    {
      title: 'Boutique Eco-Resort',
      category: 'Tourism',
      summary: 'Luxury 30-room eco-resort on pristine lakefront property. Already generating revenue with 4.8-star rating.',
      minInvestment: 150000,
      maxInvestment: 800000,
      location: 'Zanzibar',
      status: 'Closing Soon',
      roi: '14-18%',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
      authorId: poster2.id,
    },
    {
      title: 'Micro-Finance Digital Wallet',
      category: 'Finance',
      summary: 'Mobile-first financial services platform targeting unbanked populations. 200,000+ active users, processing $5M monthly.',
      minInvestment: 50000,
      maxInvestment: 400000,
      location: 'Nairobi',
      status: 'Open',
      roi: '25-35%',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      authorId: poster1.id,
    },
    {
      title: 'Smart Manufacturing Plant',
      category: 'Manufacturing',
      summary: 'IoT-enabled consumer goods manufacturing facility. Automated production lines with 40% cost advantage.',
      minInvestment: 200000,
      maxInvestment: 1500000,
      location: 'Addis Ababa',
      status: 'Coming Soon',
      roi: '16-22%',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
      authorId: poster2.id,
    },
    {
      title: 'Fashion Retail Chain Expansion',
      category: 'Retail',
      summary: 'Fast-growing African fashion brand with 8 retail outlets. Plans to open 20 more locations.',
      minInvestment: 35000,
      maxInvestment: 250000,
      location: 'Accra',
      status: 'Open',
      roi: '20-28%',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      authorId: poster1.id,
    },
    {
      title: 'Water Purification Initiative',
      category: 'Technology',
      summary: 'Solar-powered water purification units serving rural communities. Social impact investment with government subsidy backing.',
      minInvestment: 15000,
      maxInvestment: 100000,
      location: 'Mombasa',
      status: 'Coming Soon',
      roi: '8-12%',
      imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=400&fit=crop',
      authorId: poster2.id,
    },
  ];

  for (const data of investmentData) {
    await prisma.investment.create({ data });
  }

  // Create sample businesses
  const businessData = [
    {
      name: 'TechNova Solutions',
      tagline: 'Building the future of African tech, one solution at a time.',
      category: 'Technology',
      description: 'Full-stack software development company specializing in mobile apps, web platforms, and AI solutions.',
      logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop',
      phone: '+250 788 123 456',
      email: 'hello@technova.rw',
      website: 'https://technova.rw',
      city: 'Kigali',
      country: 'Rwanda',
      services: ['Mobile Development', 'Web Development', 'AI/ML Solutions', 'Cloud Infrastructure', 'UI/UX Design'],
      rating: 4.8,
      reviewCount: 124,
      featured: true,
      authorId: poster1.id,
    },
    {
      name: 'GreenLeaf Health',
      tagline: 'Affordable healthcare for everyone, everywhere.',
      category: 'Healthcare',
      description: 'Network of modern clinics providing quality healthcare with telemedicine capabilities.',
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=100&h=100&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=300&fit=crop',
      phone: '+254 722 987 654',
      email: 'info@greenleafhealth.co.ke',
      city: 'Nairobi',
      country: 'Kenya',
      services: ['General Practice', 'Telemedicine', 'Lab Services', 'Pharmacy', 'Maternal Care'],
      rating: 4.6,
      reviewCount: 89,
      featured: true,
      authorId: poster2.id,
    },
    {
      name: 'Savanna Finance',
      tagline: 'Smart money management for the modern African.',
      category: 'Finance',
      description: 'Digital-first financial services including savings, investments, and micro-loans.',
      logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&h=300&fit=crop',
      phone: '+255 754 321 098',
      email: 'support@savannafinance.tz',
      city: 'Dar es Salaam',
      country: 'Tanzania',
      services: ['Savings Accounts', 'Micro-Loans', 'Investment Plans', 'Mobile Payments', 'Insurance'],
      rating: 4.4,
      reviewCount: 67,
      authorId: poster1.id,
    },
    {
      name: 'BrightMinds Academy',
      tagline: 'Empowering the next generation through quality education.',
      category: 'Education',
      description: 'Premium K-12 school with international curriculum and STEM focus.',
      logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c8f1?w=100&h=100&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=300&fit=crop',
      phone: '+256 772 456 789',
      email: 'admissions@brightminds.ac.ug',
      city: 'Kampala',
      country: 'Uganda',
      services: ['Primary Education', 'Secondary Education', 'STEM Programs', 'After-School Activities'],
      rating: 4.9,
      reviewCount: 203,
      authorId: poster2.id,
    },
    {
      name: 'UrbanBite Restaurant',
      tagline: 'A taste of Africa in every bite.',
      category: 'Hospitality',
      description: 'Award-winning restaurant celebrating African cuisine with a modern twist.',
      logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=300&fit=crop',
      phone: '+233 20 123 4567',
      email: 'reservations@urbanbite.gh',
      city: 'Accra',
      country: 'Ghana',
      services: ['Fine Dining', 'Catering', 'Private Events', 'Cooking Classes', 'Delivery'],
      rating: 4.7,
      reviewCount: 312,
      authorId: poster1.id,
    },
    {
      name: 'AfroCraft Manufacturing',
      tagline: 'Quality African-made products for global markets.',
      category: 'Manufacturing',
      description: 'ISO-certified manufacturing facility producing consumer goods with sustainable practices.',
      logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop',
      coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop',
      phone: '+234 803 456 7890',
      email: 'info@afrocraft.ng',
      city: 'Lagos',
      country: 'Nigeria',
      services: ['Consumer Goods', 'Packaging', 'Private Label', 'Quality Assurance', 'Export Logistics'],
      rating: 4.3,
      reviewCount: 45,
      authorId: poster2.id,
    },
  ];

  for (const data of businessData) {
    await prisma.business.create({ data });
  }

  // Create sample posts
  await prisma.post.create({
    data: {
      content: 'Just joined InfoPulse! Excited to share updates and connect with the community.',
      authorId: poster1.id,
    },
  });

  await prisma.post.create({
    data: {
      content: 'Shipping new API endpoints today. Prisma makes database work a breeze.',
      authorId: poster2.id,
    },
  });

  console.log(`Seeded: ${investmentData.length} investments, ${businessData.length} businesses, 2 users, 2 posts, ${tags.length} tags`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
