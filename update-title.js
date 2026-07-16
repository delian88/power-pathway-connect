import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: {
        transformationHubFeature4Title: "Stakeholders"
      }
    });
    console.log("Successfully updated transformationHubFeature4Title");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
