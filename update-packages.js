import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const currentSettings = await prisma.siteSettings.findFirst();
  if (currentSettings) {
    const packages = [
      {
        name: "PLATINUM SPONSOR",
        subtitle: "",
        price: "",
        isPopular: true,
        features: "Recognition as Platinum Sponsor, Opportunity to deliver a goodwill address during the Opening Ceremony, Executive speaking opportunity during a technical session (subject to programme approval), Premium exhibition space, Corporate logo on all event branding and publicity materials, Logo on participant bags banners and backdrop, Full-page advertisement in the Workshop Brochure, Branding on delegate materials and certificates, Corporate promotional video played during breaks, Opportunity to distribute promotional materials, Recognition in all press releases, Featured interview during media engagements, Five (5) complimentary delegate passes, VIP seating for senior executives, Post-event recognition in the Workshop Report"
      },
      {
        name: "GOLD SPONSOR",
        subtitle: "",
        price: "",
        isPopular: false,
        features: "Recognition as Gold Sponsor, Premium exhibition booth, Logo on all major event branding materials, Half-page advertisement in the Workshop Brochure, Opportunity to distribute corporate materials, Recognition during Opening and Closing Ceremonies, Logo on Workshop website and digital platforms, Corporate branding on selected Workshop materials, Three (3) complimentary delegate passes, VIP seating for senior representatives, Recognition in the Workshop Report"
      },
      {
        name: "SILVER SPONSOR",
        subtitle: "",
        price: "",
        isPopular: false,
        features: "Recognition as Silver Sponsor, Standard exhibition booth, Logo on event banners and promotional materials, Quarter-page advertisement in the Workshop Brochure, Opportunity to display corporate promotional materials, Recognition during the Closing Ceremony, Corporate logo on Workshop website, Two (2) complimentary delegate passes, Inclusion in the Workshop Report"
      }
    ];

    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: {
        sponsorshipPackages: packages
      }
    });
    console.log("Successfully updated sponsorship packages");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
