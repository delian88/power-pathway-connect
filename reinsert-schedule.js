import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const scheduleData = [
  // DAY 1
  {
    day: 1,
    timeRange: "Morning",
    title: "Opening Ceremony"
  },
  {
    day: 1,
    timeRange: "Morning",
    title: "Goodwill Messages"
  },
  {
    day: 1,
    timeRange: "Morning",
    title: "Keynote Address",
    speaker: "Honourable Minister of Power",
    description: "The Electricity Act 2023: A New Era of State-Led Electricity Development"
  },
  {
    day: 1,
    timeRange: "Morning",
    title: "Special Address",
    speaker: "His Excellency, The Vice President of the Federal Republic of Nigeria",
    description: "The Strategic Vision for State Electricity Markets in Nigeria"
  },
  {
    day: 1,
    timeRange: "Morning",
    title: "SESSION I - Panel 1",
    description: "Understanding State Electricity Autonomy under the Electricity Act"
  },
  {
    day: 1,
    timeRange: "Afternoon",
    title: "SESSION II - Panel 2",
    description: "Building Functional State Electricity Markets"
  },
  {
    day: 1,
    timeRange: "Afternoon",
    title: "SESSION III - Governors’ Roundtable",
    description: "Theme: State Perspectives on Electricity Sector Reform"
  },
  {
    day: 1,
    timeRange: "Evening",
    title: "Fireside Chat",
    description: "Lessons from Early Movers: Experiences of States Implementing Electricity Reforms"
  },
  // DAY 2
  {
    day: 2,
    timeRange: "Morning",
    title: "SESSION IV - Panel 3",
    description: "Financing State Electricity Development"
  },
  {
    day: 2,
    timeRange: "Morning",
    title: "SESSION V - Panel 4",
    description: "Unlocking Investment Opportunities in State Electricity Markets"
  },
  {
    day: 2,
    timeRange: "Afternoon",
    title: "SESSION VI - Facilitated State Implementation Workshop (Plenary Session)",
    description: "Theme: Developing Practical Roadmaps for State Electricity Market Implementation"
  },
  {
    day: 2,
    timeRange: "Afternoon",
    title: "SESSION VII",
    description: "Presentation and Validation of Plenary Outcomes"
  },
  {
    day: 2,
    timeRange: "Afternoon",
    title: "SESSION VIII",
    description: "Adoption of Communiqué"
  },
  {
    day: 2,
    timeRange: "Evening",
    title: "Closing Ceremony",
    description: "Closing Address"
  }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('Deleting old schedule items...');
  await prisma.scheduleItem.deleteMany({});
  
  console.log('Inserting new items sequentially to preserve chronological ordering...');
  for (const item of scheduleData) {
    await prisma.scheduleItem.create({ data: item });
    await sleep(200); // 200ms delay to ensure distinct createdAt timestamps
  }
  
  console.log('Successfully reinserted schedule items!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
