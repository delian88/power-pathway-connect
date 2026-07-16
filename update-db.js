import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Updating database content...');
  
  // 1. Update SiteSettings
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    let partners = Array.isArray(currentSettings.sponsorshipPartners) ? currentSettings.sponsorshipPartners : [];
    
    // Add categories to existing partners if they don't have one (fallback to Platinum)
    partners = partners.map(p => ({
      ...p,
      category: p.category || 'Platinum'
    }));

    // Update settings
    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: {
        transformationHubFeature1Desc: "Direct access to ministers, governors, regulators, and industry CEOs driving Nigeria's electricity agenda.",
        transformationHubFeature4Desc: "Join ministers, governors, CEOs, and experts representing 36 states in Nigeria and FCT.",
        
        confGuideTrack1Title: "Plenary Session",
        confGuideTrack1Subtitle: "Facilitated State implementation workshop",
        confGuideTrack2Title: "Technical Sessions",
        confGuideTrack2Subtitle: "Sessions I, II, III, IV, V",
        
        ourApproachCard1ImgUrl: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=800&q=80",
        ourApproachCard2ImgUrl: "https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7f?auto=format&fit=crop&w=800&q=80",
        ourApproachCard3ImgUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        
        sponsorshipPartners: partners
      }
    });
    console.log('SiteSettings updated.');
  }

  // 2. Schedule Items
  // Delete existing
  await prisma.scheduleItem.deleteMany({});
  
  // Insert new Day 1
  const day1Items = [
    { day: 1, timeRange: "Morning", title: "Opening Ceremony", description: "Goodwill Messages" },
    { day: 1, timeRange: "Morning", title: "Keynote Address: The Electricity Act 2023", description: "A New Era of State-Led Electricity Development\nSpeaker: Honourable Minister of Power" },
    { day: 1, timeRange: "Morning", title: "Special Address", description: "The Strategic Vision for State Electricity Markets in Nigeria\nSpeaker: His Excellency, The Vice President of the Federal Republic of Nigeria" },
    { day: 1, timeRange: "Afternoon", title: "SESSION I - Panel 1", description: "Understanding State Electricity Autonomy under the Electricity Act" },
    { day: 1, timeRange: "Afternoon", title: "SESSION II - Panel 2", description: "Building Functional State Electricity Markets" },
    { day: 1, timeRange: "Late Afternoon", title: "SESSION III - Governors' Roundtable", description: "Theme: State Perspectives on Electricity Sector Reform" },
    { day: 1, timeRange: "Evening", title: "Fireside Chat", description: "Lessons from Early Movers: Experiences of States Implementing Electricity Reforms" }
  ];
  
  // Insert new Day 2
  const day2Items = [
    { day: 2, timeRange: "Morning", title: "SESSION IV - Panel 3", description: "Financing State Electricity Development" },
    { day: 2, timeRange: "Morning", title: "SESSION V - Panel 4", description: "Unlocking Investment Opportunities in State Electricity Markets" },
    { day: 2, timeRange: "Afternoon", title: "SESSION VI - Facilitated State Implementation Workshop (Plenary Session)", description: "Theme: Developing Practical Roadmaps for State Electricity Market Implementation" },
    { day: 2, timeRange: "Afternoon", title: "SESSION VII", description: "Presentation and Validation of Plenary Outcomes" },
    { day: 2, timeRange: "Late Afternoon", title: "SESSION VIII", description: "Adoption of Communiqué" },
    { day: 2, timeRange: "Evening", title: "Closing Ceremony", description: "Closing Address" }
  ];

  await prisma.scheduleItem.createMany({
    data: [...day1Items, ...day2Items]
  });
  console.log('Schedule items updated.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
