import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const setting = await prisma.siteSettings.findFirst();
  if (setting) {
    await prisma.siteSettings.update({
      where: { id: setting.id },
      data: { 
        aboutVenuesCount: 1,
        aboutVenues: [
          {
            title: "Presidential Banquet Hall - Aso Villa",
            location: "State House Banquet Hall, Presidential Villa, Abuja",
            desc: "The prestigious Presidential Banquet Hall will host the official opening ceremony and keynote sessions.",
            imgUrl: "https://images.unsplash.com/photo-1577977699317-5e94b29bb804?auto=format&fit=crop&w=800&q=80"
          }
        ]
      },
    });
    console.log('Successfully updated venues in DB');
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
