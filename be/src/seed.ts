import { prisma } from './config/db';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Seeding database...');
  
  // Clear existing data for a clean slate
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

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
