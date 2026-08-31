import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.siteSettings.update({
    where: { id: 1 },
    data: { emailEnabled: true, smtpHost: 'smtp.gmail.com', smtpPort: 465, smtpUser: 'nutech2025@gmail.com', smtpPass: 'dzae szth wwmr xmba' }
  });
  console.log('SMTP updated');
}
main();
