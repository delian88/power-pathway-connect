import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    if (currentSettings.heroText) {
      let updatedText = currentSettings.heroText;
      // If it has (AS AMENDED without closing bracket, fix it
      if (updatedText.includes("(AS AMENDED") && !updatedText.includes("(AS AMENDED)")) {
        updatedText = updatedText.replace("(AS AMENDED", "(AS AMENDED)");
      }
      
      await prisma.siteSettings.update({
        where: { id: currentSettings.id },
        data: {
          heroText: updatedText
        }
      });
      console.log("Successfully fixed heroText closing bracket");
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
