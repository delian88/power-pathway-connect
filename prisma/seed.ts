import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'info.nutech2025@gmail.com';
  const password = 'Admin@webmaster$1';
  
  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'admin',
      }
    });
    console.log(`Created admin user: ${email}`);
  } else {
    console.log(`Admin user ${email} already exists.`);
  }

  const existingSettings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        id: 1,
        heroText: 'Your Strategic Global Partner for Meetings and Events',
        heroSubText: 'Proven global experience, professionalism, and innovative meetings solutions. Our Team is Committed to Your Success.',
        logoUrl: '/favicon.ico', // Defaulting to the uploaded logo
        contactEmail: 'info@nutech2025@gmail.com',
        contactPhone: '+1-800-555-1234',
        address: '123 Tech Lane, Innovation City, CA 90210'
      }
    });
    console.log('Created default site settings.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
