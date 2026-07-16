import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: {
        whyAttendCard2ImgUrl: "/image copy.png",
        whyAttendCard3ImgUrl: "/image copy 2.png"
      }
    });
    console.log("Successfully updated whyAttendCard2ImgUrl and whyAttendCard3ImgUrl");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
