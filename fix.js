import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'info@nutech2025@gmail.com';
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
    console.log(`Admin user ${email} already exists. Updating password just in case...`);
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: { passwordHash }
    });
  }

  const email2 = 'info.nutech2025@gmail.com';
  const existingAdmin2 = await prisma.user.findUnique({ where: { email: email2 } });
  if (!existingAdmin2) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: email2,
        passwordHash,
        role: 'admin',
      }
    });
    console.log(`Created admin user: ${email2}`);
  }

  console.log('Done fixing users.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
