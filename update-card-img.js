import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: {
        // Using a similar networking/connections image from Unsplash
        whyAttendCard1ImgUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
      }
    });
    console.log("Successfully updated whyAttendCard1ImgUrl");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
