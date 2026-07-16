import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: {
        sponsorshipCtaDesc: "Join industry leaders in shaping Nigeria electricity future. Limited sponsorship opportunities available."
      }
    });
    console.log("Successfully updated sponsorship CTA text");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
