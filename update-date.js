import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: {
        confGuideTrack1Date: "THURSDAY, 8 OCTOBER 2026"
      }
    });
    console.log("Successfully updated confGuideTrack1Date");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
