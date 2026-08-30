import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const setting = await prisma.siteSettings.findFirst();
  if (setting) {
    await prisma.siteSettings.update({
      where: { id: setting.id },
      data: { 
        headerDateText: "Wednesday 21 October to Thursday 22 October 2026",
        infoBarDateText: "Wednesday 21 October to Thursday 22 October 2026",
        scheduleDates: [
          "Wednesday 21 October",
          "Thursday 22 October 2026",
          "Feb 4",
          "Feb 5"
        ],
        confGuideTrack1Date: "THURSDAY 22 OCTOBER 2026",
        confGuideTrack3Date: "Thursday 22 October 2026",
        agendaDays: [
          { "date": "Wednesday 21 October" },
          { "date": "Thursday 22 October 2026" }
        ]
      },
    });
    console.log('Successfully updated dates in DB');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
