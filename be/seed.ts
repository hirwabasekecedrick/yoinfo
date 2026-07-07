import dotenv from "dotenv";
dotenv.config();
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

async function main() {
  console.log('Seeding database...');
  
  // Clear existing data for a clean slate
  await prisma.postTag.deleteMany();
  await prisma.link.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Seed tags
  for (const tag of TAGS) {
    await prisma.tag.create({ data: tag });
  }
  console.log(`Seeded ${TAGS.length} tags`);

  const password = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Designer',
      password,
      role: 'POSTER',
      posts: {
        create: [
          { content: 'Just joined InfoPulse! Excited to share my latest UI designs here. The dark mode is absolutely stunning! ✨' },
          { content: 'Does anyone have good resources on implementing Framer Motion with Next.js 15? Asking for a friend.' }
        ]
      }
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Engineer',
      password,
      role: 'POSTER',
      posts: {
        create: [
          { content: 'Shipping the new API endpoints today. Prisma + SQLite makes local development a breeze.' }
        ]
      }
    }
  });

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
