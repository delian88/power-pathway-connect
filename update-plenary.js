import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: {
        confGuideTrack1EventTitle: "Theme:",
        confGuideTrack1EventDesc: "Developing Practical Roadmaps for State Electricity Market Implementation",
        confGuideTrack2EventTitle: "",
        confGuideTrack2EventDesc: "",
        confGuideTrack2Date: ""
      }
    });
    console.log("Successfully updated plenary event title and description");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
