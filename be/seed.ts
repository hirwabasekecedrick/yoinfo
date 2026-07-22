import dotenv from "dotenv";
dotenv.config();
import { Prisma } from '@prisma/client';
import { prisma } from './src/config/db';
import bcrypt from 'bcrypt';

const TAGS = [
  { name: 'teknoloji', label: '#Teknoloji' },
  { name: 'ai', label: '#AI' },
  { name: 'ict', label: '#ICT' },
  { name: 'ubucuruzi', label: '#Ubucuruzi' },
  { name: 'business', label: '#Business' },
  { name: 'dukore', label: '#Dukore' },
  { name: 'imydagaduro', label: '#Imyidagaduro' },
  { name: 'entertainment', label: '#Entertainment' },
  { name: 'music', label: '#Music' },
  { name: 'siporo', label: '#Siporo' },
  { name: 'sports', label: '#Sports' },
  { name: 'football', label: '#Football' },
  { name: 'uburezi', label: '#Uburezi' },
  { name: 'education', label: '#Education' },
  { name: 'amashuri', label: '#Amashuri' },
  { name: 'ubuzima', label: '#Ubuzima' },
  { name: 'health', label: '#Health' },
  { name: 'politiki', label: '#Politiki' },
  { name: 'politics', label: '#Politics' },
  { name: 'amakuru', label: '#Amakuru' },
  { name: 'news', label: '#News' },
  { name: 'ibirori', label: '#Ibirori' },
  { name: 'events', label: '#Events' },
  { name: 'kwamamaza', label: '#Kwamamaza' },
  { name: 'ubuhinzi', label: '#Ubuhinzi' },
  { name: 'agriculture', label: '#Agriculture' },
  { name: 'umuco', label: '#Umuco' },
  { name: 'culture', label: '#Culture' },
  { name: 'rwanda', label: '#Rwanda' },
  { name: 'ubukerarugendo', label: '#Ubukerarugendo' },
  { name: 'tourism', label: '#Tourism' },
  { name: 'visitrwanda', label: '#VisitRwanda' },
  { name: 'ubuhinga', label: '#Ubuhinga' },
  { name: 'innovation', label: '#Innovation' },
  { name: 'muriRwanda', label: '#MuriRwanda' },
  { name: 'community', label: '#Community' },
  { name: 'abaturage', label: '#Abaturage' },
  { name: 'urubyiruko', label: '#Urubyiruko' },
  { name: 'youth', label: '#Youth' },
  { name: 'abakiribato', label: '#AbakiriBato' },
];

const INVESTMENTS = [
  {
    title: 'Kigali Tech Hub Expansion',
    category: 'Technology',
    summary: 'A state-of-the-art technology hub in the heart of Kigali, offering co-working spaces and incubation programs for startups.',
    description: 'This project aims to build a world-class tech hub in Kigali that will serve as a catalyst for Rwanda\'s digital transformation. The facility will include co-working spaces, meeting rooms, a conference center, and incubation programs for early-stage tech startups. The hub will also host regular hackathons, workshops, and networking events to foster innovation and collaboration in the Rwandan tech ecosystem.',
    minInvestment: 50000,
    maxInvestment: 500000,
    location: 'Kigali, Rwanda',
    status: 'Open',
    roi: '15-20% annually',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    title: 'Nyungwe Eco-Lodge Development',
    category: 'Tourism',
    summary: 'An eco-friendly luxury lodge near Nyungwe Forest National Park targeting high-end eco-tourists.',
    description: 'Develop a 20-room luxury eco-lodge on the edge of Nyungwe Forest National Park. The lodge will feature solar power, rainwater harvesting, locally sourced materials, and farm-to-table dining. It will offer guided forest treks, canopy walks, and birdwatching experiences. Targeting high-end eco-tourists willing to pay premium prices for sustainable luxury.',
    minInvestment: 100000,
    maxInvestment: 1000000,
    location: 'Nyungwe, Rwanda',
    status: 'Open',
    roi: '18-25% annually',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    title: 'Smart Agriculture Irrigation System',
    category: 'Agriculture',
    summary: 'IoT-powered precision irrigation systems for smallholder farmers in Rwanda.',
    description: 'Deploy smart irrigation systems across 5,000 hectares of farmland in Rwanda\'s agricultural zones. Using IoT sensors and satellite data, the system optimizes water usage, reduces waste by 40%, and increases crop yields by 25%. The project partners with local cooperatives and provides training on modern farming techniques.',
    minInvestment: 25000,
    maxInvestment: 250000,
    location: 'Huye, Rwanda',
    status: 'Open',
    roi: '12-18% annually',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    title: 'Kigali Digital Payment Platform',
    category: 'Fintech',
    summary: 'A mobile-first digital payment platform designed for Rwanda\'s growing informal economy.',
    description: 'Build a comprehensive digital payment platform tailored for Rwanda\'s informal sector. The platform will enable micro-merchants, market vendors, and service providers to accept digital payments via mobile money, QR codes, and NFC. Features include instant settlement, micro-loans, and business analytics dashboards.',
    minInvestment: 75000,
    maxInvestment: 750000,
    location: 'Kigali, Rwanda',
    status: 'Open',
    roi: '20-30% annually',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    title: 'Lake Kivu Fish Farming Initiative',
    category: 'Agriculture',
    summary: 'Sustainable fish farming operations on Lake Kivu to meet growing protein demand.',
    description: 'Establish modern fish farming cages on Lake Kivu using sustainable aquaculture practices. The project will produce tilapia and catfish for domestic consumption, reducing Rwanda\'s fish import dependency. Includes training local fishermen in modern aquaculture techniques and establishing cold chain logistics.',
    minInvestment: 30000,
    maxInvestment: 300000,
    location: 'Rubavu, Rwanda',
    status: 'Closing Soon',
    roi: '14-22% annually',
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    title: 'Rwanda Health Connect Telemedicine',
    category: 'Healthcare',
    summary: 'Telemedicine platform connecting rural patients with specialists in Kigali.',
    description: 'Launch a telemedicine platform that connects patients in rural health centers with specialists in Kigali hospitals. The platform includes video consultations, electronic health records, prescription management, and AI-assisted diagnosis. Initial deployment at 50 health centers across 5 provinces.',
    minInvestment: 40000,
    maxInvestment: 400000,
    location: 'Nationwide, Rwanda',
    status: 'Open',
    roi: '16-24% annually',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    title: 'Green Brick Manufacturing',
    category: 'Manufacturing',
    summary: 'Eco-friendly compressed earth brick production using volcanic ash from Rwanda.',
    description: 'Establish a factory producing compressed earth bricks using volcanic ash and laterite soil, an environmentally friendly alternative to fired clay bricks. The bricks are stronger, cheaper to produce, and have a 70% lower carbon footprint. Target capacity: 10 million bricks per year.',
    minInvestment: 60000,
    maxInvestment: 500000,
    location: 'Musanze, Rwanda',
    status: 'Open',
    roi: '15-20% annually',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    title: 'Imigongo Art Export Cooperative',
    category: 'Creative Arts',
    summary: 'Scaling traditional Imigongo cow dung art production for international luxury markets.',
    description: 'Scale the production of traditional Imigongo art by establishing a cooperative of 200+ artisans. The project will modernize production techniques while preserving traditional methods, build an e-commerce platform for direct international sales, and partner with luxury interior design firms in Europe and North America.',
    minInvestment: 15000,
    maxInvestment: 150000,
    location: 'Nyakarambi, Rwanda',
    status: 'Open',
    roi: '25-35% annually',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    title: 'Kigali Electric Bus Fleet',
    category: 'Transport',
    summary: 'Introducing a fleet of electric buses for Kigali\'s public transportation network.',
    description: 'Deploy 50 electric buses across Kigali\'s major routes, reducing carbon emissions and commute costs. The project includes charging infrastructure, route optimization software, and a mobile ticketing app. Partnership with the Rwanda Transport Development Agency for route licensing.',
    minInvestment: 200000,
    maxInvestment: 2000000,
    location: 'Kigali, Rwanda',
    status: 'Coming Soon',
    roi: '10-15% annually',
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    title: 'Coffee Processing Micro-Factory',
    category: 'Agriculture',
    summary: 'Community-owned coffee processing facility adding value at origin.',
    description: 'Build a micro coffee processing factory in the Rusizi district that enables local cooperatives to wash, dry, roast, and package coffee at origin. Currently, most Rwandan coffee is exported as green beans — this project captures more value locally. Capacity: 200 tons of green coffee per year.',
    minInvestment: 35000,
    maxInvestment: 350000,
    location: 'Rusizi, Rwanda',
    status: 'Open',
    roi: '18-28% annually',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    title: 'Youth Coding Academy',
    category: 'Education',
    summary: 'A coding bootcamp and talent pipeline connecting Rwandan youth with global tech employers.',
    description: 'Establish a 6-month coding bootcamp in Kigali that trains 500 young Rwandans per year in software development, data science, and AI. Partners with global tech companies for job placement. Revenue comes from employer placement fees and corporate training contracts.',
    minInvestment: 20000,
    maxInvestment: 200000,
    location: 'Kigali, Rwanda',
    status: 'Open',
    roi: '22-30% annually',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    title: 'Rwanda Solar Mini-Grid Network',
    category: 'Energy',
    summary: 'Solar-powered mini-grids for off-grid communities in rural Rwanda.',
    description: 'Deploy 100 solar-powered mini-grids across off-grid communities in Rwanda, providing reliable electricity to 50,000+ households. Each mini-grid includes battery storage, smart metering, and maintenance training for local technicians. Revenue from per-kWh billing and government subsidies.',
    minInvestment: 80000,
    maxInvestment: 800000,
    location: 'Nationwide, Rwanda',
    status: 'Open',
    roi: '12-18% annually',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=500&fit=crop',
    featured: false,
  },
];

const BUSINESSES = [
  {
    name: 'Inema Arts Center',
    tagline: 'Contemporary Rwandan art gallery and creative space',
    category: 'Art & Design',
    description: 'Inema Arts Center is a contemporary art gallery and creative space in Kigali that showcases Rwandan and African art. Founded in 2012, Inema has become a cultural landmark, hosting exhibitions, workshops, and residency programs for artists from across the continent.',
    phone: '+250 788 123 456',
    email: 'info@inemaarts.com',
    website: 'https://inemaarts.com',
    address: 'KG 561 St, Kigali',
    city: 'Kigali',
    country: 'Rwanda',
    registrationNumber: 'RW-2012-ART-001',
    certifications: 'Rwanda Arts Initiative Certified',
    services: ['Art Exhibitions', 'Art Workshops', 'Artist Residencies', 'Corporate Art Consulting', 'Art Sales'],
    operatingHours: JSON.stringify({
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '10:00 AM - 5:00 PM',
      sunday: 'Closed',
    }),
    primaryCTA: 'Visit Gallery',
    rating: 4.8,
    reviewCount: 245,
    featured: true,
    teamMembers: JSON.stringify([
      { name: 'Emmanuel Nkuranga', role: 'Co-Founder & Director' },
      { name: 'Innocent Nkurunziza', role: 'Co-Founder & Artist' },
    ]),
  },
  {
    name: 'Rwanda Eco-Lodges',
    tagline: 'Sustainable luxury accommodation across Rwanda',
    category: 'Hospitality',
    description: 'Rwanda Eco-Lodges operates a network of sustainable luxury accommodations near Rwanda\'s national parks. Each lodge is designed with locally sourced materials, powered by solar energy, and offers farm-to-table dining experiences.',
    phone: '+250 788 234 567',
    email: 'reservations@rwandaecolodges.rw',
    website: 'https://rwandaecolodges.rw',
    address: 'KN 5 Ave, Kigali',
    city: 'Kigali',
    country: 'Rwanda',
    registrationNumber: 'RW-2018-HOS-045',
    certifications: 'Green Globe Certified, Rwanda Tourism Board Licensed',
    services: ['Luxury Accommodation', 'Guided Safaris', 'Cultural Experiences', 'Conference Facilities', 'Wedding Venues'],
    operatingHours: JSON.stringify({
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7',
    }),
    primaryCTA: 'Book Now',
    rating: 4.9,
    reviewCount: 189,
    featured: true,
    teamMembers: JSON.stringify([
      { name: 'Clare Akamanzi', role: 'CEO' },
      { name: 'Jean-Pierre Ndikumana', role: 'Head of Operations' },
    ]),
  },
  {
    name: 'Kigali Coffee House',
    tagline: 'Specialty Rwandan coffee experience in the heart of Kigali',
    category: 'Food & Beverage',
    description: 'Kigali Coffee House is a specialty coffee shop that sources beans directly from Rwandan cooperatives. We roast in-house daily and serve single-origin pour-overs, espresso drinks, and coffee-based cocktails. Our space doubles as a co-working hub with high-speed WiFi.',
    phone: '+250 788 345 678',
    email: 'hello@kigalicoffee.rw',
    website: 'https://kigalicoffee.rw',
    address: 'KG 7 Ave, Kigali',
    city: 'Kigali',
    country: 'Rwanda',
    registrationNumber: 'RW-2020-FB-112',
    certifications: 'Specialty Coffee Association Member',
    services: ['Specialty Coffee', 'Barista Training', 'Co-Working Space', 'Coffee Tasting Events', 'Wholesale Beans'],
    operatingHours: JSON.stringify({
      monday: '7:00 AM - 9:00 PM',
      tuesday: '7:00 AM - 9:00 PM',
      wednesday: '7:00 AM - 9:00 PM',
      thursday: '7:00 AM - 9:00 PM',
      friday: '7:00 AM - 10:00 PM',
      saturday: '8:00 AM - 10:00 PM',
      sunday: '8:00 AM - 6:00 PM',
    }),
    primaryCTA: 'Order Online',
    rating: 4.7,
    reviewCount: 312,
    featured: false,
    teamMembers: JSON.stringify([
      { name: 'David Mugisha', role: 'Founder & Head Barista' },
    ]),
  },
  {
    name: 'SafeMotos',
    tagline: 'Rwanda\'s safest motorcycle taxi platform',
    category: 'Transport',
    description: 'SafeMotos is a technology-driven motorcycle taxi platform that prioritizes passenger safety through GPS tracking, driver training, helmet provision, and insurance coverage. Operating in Kigali with plans to expand to secondary cities.',
    phone: '+250 788 456 789',
    email: 'support@safemotos.rw',
    website: 'https://safemotos.rw',
    address: 'KG 11 Ave, Kigali',
    city: 'Kigali',
    country: 'Rwanda',
    registrationNumber: 'RW-2016-TRN-078',
    certifications: 'Rwanda Utilities Regulatory Authority Licensed',
    services: ['Safe Motorcycle Transport', 'Delivery Services', 'Driver Training', 'Fleet Management', 'Insurance Coverage'],
    operatingHours: JSON.stringify({
      monday: '5:00 AM - 11:00 PM',
      tuesday: '5:00 AM - 11:00 PM',
      wednesday: '5:00 AM - 11:00 PM',
      thursday: '5:00 AM - 11:00 PM',
      friday: '5:00 AM - 12:00 AM',
      saturday: '5:00 AM - 12:00 AM',
      sunday: '6:00 AM - 10:00 PM',
    }),
    primaryCTA: 'Download App',
    rating: 4.5,
    reviewCount: 567,
    featured: true,
    teamMembers: JSON.stringify([
      { name: 'Zachary Bardon', role: 'Co-Founder & CEO' },
      { name: 'Gilles Bireth', role: 'Co-Founder & COO' },
    ]),
  },
  {
    name: 'HeHe Labs',
    tagline: 'Rwanda\'s leading digital innovation studio',
    category: 'Technology',
    description: 'HeHe Labs is a Kigali-based digital innovation studio that builds mobile apps, web platforms, and IoT solutions for businesses across Africa. We specialize in fintech, agritech, and healthtech solutions, with a focus on products that solve real African problems.',
    phone: '+250 788 567 890',
    email: 'info@helabs.rw',
    website: 'https://helabs.rw',
    address: 'KG 9 Ave, Kigali',
    city: 'Kigali',
    country: 'Rwanda',
    registrationNumber: 'RW-2015-TEC-034',
    certifications: 'Microsoft Partner, Google Developer Agency',
    services: ['Mobile App Development', 'Web Platform Development', 'IoT Solutions', 'UI/UX Design', 'Technical Consulting', 'Cloud Infrastructure'],
    operatingHours: JSON.stringify({
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed',
    }),
    primaryCTA: 'Start a Project',
    rating: 4.6,
    reviewCount: 89,
    featured: false,
    teamMembers: JSON.stringify([
      { name: 'Innocent Ibeto', role: 'Founder & CTO' },
      { name: 'Alice Musabende', role: 'Head of Design' },
      { name: 'Patrick Nshimiyimana', role: 'Lead Developer' },
    ]),
  },
  {
    name: 'Azizi Life Experiences',
    tagline: 'Authentic Rwandan cultural experiences and artisan crafts',
    category: 'Tourism',
    description: 'Azizi Life offers immersive cultural experiences in rural Rwanda, including coffee farming experiences, traditional cooking classes, basket weaving workshops, and village tours. Our artisan boutique in Kigali sells handmade crafts directly from rural artisans.',
    phone: '+250 788 678 901',
    email: 'book@azizilife.com',
    website: 'https://azizilife.com',
    address: 'KG 24 Ave, Kigali',
    city: 'Kigali',
    country: 'Rwanda',
    registrationNumber: 'RW-2014-TRN-056',
    certifications: 'Rwanda Tourism Board Licensed, TripAdvisor Certificate of Excellence',
    services: ['Cultural Experiences', 'Coffee Farm Tours', 'Cooking Classes', 'Artisan Craft Shop', 'Group Retreats', 'Corporate Team Building'],
    operatingHours: JSON.stringify({
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: 'Closed',
    }),
    primaryCTA: 'Book Experience',
    rating: 4.9,
    reviewCount: 421,
    featured: true,
    teamMembers: JSON.stringify([
      { name: 'Jado Dusabe', role: 'Founder & Director' },
      { name: 'Aimable Nsengiyumva', role: 'Experiences Manager' },
    ]),
  },
];

const USERS = [
  {
    email: 'alice@example.com',
    name: 'Alice Designer',
    password: 'password123',
    role: 'POSTER' as const,
  },
  {
    email: 'bob@example.com',
    name: 'Bob Engineer',
    password: 'password123',
    role: 'POSTER' as const,
  },
  {
    email: 'charlie@example.com',
    name: 'Charlie Investor',
    password: 'password123',
    role: 'USER' as const,
  },
  {
    email: 'admin@infopulse.rw',
    name: 'InfoPulse Admin',
    password: 'admin123',
    role: 'ADMIN' as const,
  },
];

const POSTS = [
  {
    authorIndex: 0,
    content: 'Just joined InfoPulse! Excited to share my latest UI designs here. The green and white theme is absolutely stunning! ✨',
    tagNames: ['teknoloji', 'design', 'innovation'],
  },
  {
    authorIndex: 0,
    content: 'Does anyone have good resources on implementing Framer Motion with Next.js 15? Asking for a friend.',
    tagNames: ['teknoloji', 'ai'],
  },
  {
    authorIndex: 1,
    content: 'Shipping the new API endpoints today. Prisma + PostgreSQL makes backend development a breeze.',
    tagNames: ['teknoloji', 'business'],
  },
  {
    authorIndex: 2,
    content: 'Looking at the Rwanda tech startup ecosystem — the growth in Kigali has been incredible over the past 2 years. Any investors here interested in agritech?',
    tagNames: ['business', 'ubucuruzi', 'rwanda'],
  },
  {
    authorIndex: 3,
    content: 'Welcome to InfoPulse! We are building the platform for Rwandan news, business, and investment opportunities. Stay tuned for exciting updates.',
    tagNames: ['amakuru', 'news', 'rwanda'],
  },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data in correct order (respect foreign key constraints)
  await prisma.postTag.deleteMany();
  await prisma.link.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.business.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Seed tags
  const createdTags: Record<string, { id: string }> = {};
  for (const tag of TAGS) {
    const created = await prisma.tag.create({ data: tag });
    createdTags[tag.name] = created;
  }
  console.log(`Seeded ${TAGS.length} tags`);

  // Seed users
  const password = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  const createdUsers = [];
  for (const userData of USERS) {
    const hash = userData.password === 'admin123' ? adminPassword : password;
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hash,
        role: userData.role,
      },
    });
    createdUsers.push(user);
  }
  console.log(`Seeded ${createdUsers.length} users`);

  // Seed posts
  for (const postData of POSTS) {
    const tagConnects = postData.tagNames
      .filter(name => createdTags[name])
      .map(name => ({ tagId: createdTags[name].id }));

    await prisma.post.create({
      data: {
        content: postData.content,
        authorId: createdUsers[postData.authorIndex].id,
        tags: tagConnects.length ? { create: tagConnects } : undefined,
      },
    });
  }
  console.log(`Seeded ${POSTS.length} posts`);

  // Seed investments (assign to first 3 users as authors)
  for (let i = 0; i < INVESTMENTS.length; i++) {
    const authorIndex = i % 3;
    const inv = INVESTMENTS[i];
    await prisma.investment.create({
      data: {
        title: inv.title,
        category: inv.category,
        summary: inv.summary,
        description: inv.description || null,
        minInvestment: inv.minInvestment,
        maxInvestment: inv.maxInvestment,
        location: inv.location,
        status: inv.status,
        roi: inv.roi,
        imageUrl: inv.imageUrl || null,
        featured: inv.featured,
        authorId: createdUsers[authorIndex].id,
      },
    });
  }
  console.log(`Seeded ${INVESTMENTS.length} investments`);

  // Seed businesses (assign to first 3 users as authors)
  for (let i = 0; i < BUSINESSES.length; i++) {
    const authorIndex = i % 3;
    const biz = BUSINESSES[i];
    await prisma.business.create({
      data: {
        name: biz.name,
        tagline: biz.tagline,
        category: biz.category,
        description: biz.description,
        phone: biz.phone,
        email: biz.email,
        website: biz.website,
        address: biz.address,
        city: biz.city,
        country: biz.country,
        registrationNumber: biz.registrationNumber,
        certifications: biz.certifications,
        services: biz.services,
        operatingHours: biz.operatingHours || Prisma.JsonNull,
        primaryCTA: biz.primaryCTA,
        rating: biz.rating,
        reviewCount: biz.reviewCount,
        featured: biz.featured,
        teamMembers: biz.teamMembers || Prisma.JsonNull,
        authorId: createdUsers[authorIndex].id,
      },
    });
  }
  console.log(`Seeded ${BUSINESSES.length} businesses`);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
