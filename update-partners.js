import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    let partners = currentSettings.sponsorshipPartners || [];
    if (!Array.isArray(partners)) {
      partners = [];
    }
    
    // Add dummy GOLD partners
    partners.push({ name: "Gold Sponsor 1", logo: "", category: "GOLD" });
    partners.push({ name: "Gold Sponsor 2", logo: "", category: "GOLD" });
    
    // Add dummy SILVER partners
    partners.push({ name: "Silver Sponsor 1", logo: "", category: "SILVER" });
    partners.push({ name: "Silver Sponsor 2", logo: "", category: "SILVER" });

    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: {
        sponsorshipPartners: partners
      }
    });
    console.log("Successfully added GOLD and SILVER partner placeholders");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
