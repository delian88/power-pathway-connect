import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: {
        whyAttendCard1ImgUrl: "/image.png"
      }
    });
    console.log("Successfully updated whyAttendCard1ImgUrl to /image.png");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
