import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const event = await prisma.event.create({
    data: {
      title: '2-Day National Workshop on the Electricity Act 2023 (As Amended)',
      description: 'Empowering the States: Reviewing the Electricity Act 2023',
      content: 'Deep dive into the decentralisation and autonomy provisions of the Electricity Act 2023, with a strong focus on helping each State understand that they now have full autonomy on electricity matters within their jurisdiction by virtue of the law.\n\nEducate, enlighten, and teach participants on the practical implications of the Act for electricity generation, transmission, distribution, and regulation at the state level.\n\nProvide clear guidance on how States can establish and implement their own electricity markets, regulatory frameworks, and infrastructure development strategies using the full autonomy granted by the Electricity Act 2023 (as amended).\n\nFacilitate knowledge exchange on the provisions of the Act, regulatory alignment, and the practical steps required for States to fully exercise their autonomy on electricity matters.',
      date: new Date('2026-08-15T09:00:00Z'),
      type: 'workshop',
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-1200004e0e58?q=80&w=2000&auto=format&fit=crop'
    }
  });
  console.log('Created:', event.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
