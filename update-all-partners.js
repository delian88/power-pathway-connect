import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    const originalPlatinum = [
      { name: "the Federal Ministry of Power", logo: "", category: "PLATINUM" },
      { name: "Federal Ministry of Justice", logo: "", category: "PLATINUM" },
      { name: "Nigerian Electricity Regulatory Commission", logo: "", category: "PLATINUM" },
      { name: "Nigeria Governors' Forum", logo: "", category: "PLATINUM" },
    ];

    const newPlatinum = [
      "Nigeria Delta Power Holding Company (NDPHC)", 
      "Nigeria Sovereign Investment Authority (NSIA)", 
      "Bureau for Public Enterprises (BPE)", 
      "Lagos State Government", 
      "Akwa Ibom State Government", 
      "Delta State Government", 
      "Rivers State Government"
    ].map(name => ({ name, logo: "", category: "PLATINUM" }));

    const gold = [
      "Transcorp Power", 
      "Geregu Power", 
      "Dangote Group", 
      "BUA Group"
    ].map(name => ({ name, logo: "", category: "GOLD" }));

    const silver = [
      "Bank of Industry", 
      "Ikeja Electricity Transmission Company Limited", 
      "Rural Electrification Agency (REA)"
    ].map(name => ({ name, logo: "", category: "SILVER" }));

    const allPartners = [...originalPlatinum, ...newPlatinum, ...gold, ...silver];

    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: {
        sponsorshipPartners: allPartners
      }
    });
    console.log("Successfully updated all partners");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
