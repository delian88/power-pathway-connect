import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAgenda() {
  console.log("Deleting old schedule items...");
  await prisma.scheduleItem.deleteMany({});

  const items = [
    // DAY ONE
    {
      day: 1,
      timeRange: "8:00 AM – 9:00 AM",
      title: "Registration and Networking Breakfast",
      description: null
    },
    {
      day: 1,
      timeRange: "9:00 AM – 9:20 AM",
      title: "Opening Ceremony",
      description: "<ul><li>National Anthem</li><li>Opening Prayer</li><li>Welcome Remarks by the Permanent Secretary / Workshop Chair</li></ul>"
    },
    {
      day: 1,
      timeRange: "9:20 AM – 9:40 AM",
      title: "Goodwill Messages",
      description: "<ul><li>Chairman, Nigerian Governors’ Forum</li><li>Development Partner Representative</li><li>Chairman, Nigerian Electricity Regulatory Commission (NERC)</li></ul>"
    },
    {
      day: 1,
      timeRange: "9:40 AM – 10:10 AM",
      title: "Keynote Address",
      speaker: "Honourable Minister of Power",
      description: "<strong>The Electricity Act 2023: A New Era of State-Led Electricity Development</strong>"
    },
    {
      day: 1,
      timeRange: "10:10 AM – 10:40 AM",
      title: "Special Address",
      speaker: "His Excellency, The Vice President of the Federal Republic of Nigeria",
      description: "<strong>The Strategic Vision for State Electricity Markets in Nigeria</strong>"
    },
    {
      day: 1,
      timeRange: "10:40 AM – 11:00 AM",
      title: "Coffee Break",
      description: null
    },
    {
      day: 1,
      timeRange: "11:00 AM – 12:30 PM",
      title: "Panel 1",
      description: "<strong>Understanding State Electricity Autonomy under the Electricity Act</strong><br/><br/><em>Discussion Areas:</em><ul><li>Key provisions of the Electricity Act 2023</li><li>Division of Federal and State powers</li><li>Constitutional implications</li><li>Licensing and regulatory authority</li><li>Transition pathways for States</li></ul><br/><em>Panelists:</em><ul><li>Nigerian Electricity Regulatory Commission (NERC)</li><li>Attorney-General of a pioneering State</li><li>Energy Law Expert</li><li>State Electricity Regulator</li><li>Federal Ministry of Power</li></ul>"
    },
    {
      day: 1,
      timeRange: "12:30 PM – 1:30 PM",
      title: "Lunch",
      description: null
    },
    {
      day: 1,
      timeRange: "1:30 PM – 3:00 PM",
      title: "Panel 2",
      description: "<strong>Building Functional State Electricity Markets</strong><br/><br/><em>Discussion Areas:</em><ul><li>Establishing State Electricity Regulatory Commissions</li><li>Licensing frameworks</li><li>Tariff-setting considerations</li><li>Consumer protection mechanisms</li><li>Market governance</li></ul><br/><em>Panelists:</em><ul><li>Lagos State Electricity Regulatory Commission</li><li>Ekiti State Electricity Bureau</li><li>Nigerian Electricity Regulatory Commission (NERC)</li><li>Electricity Market Experts</li></ul>"
    },
    {
      day: 1,
      timeRange: "3:00 PM – 3:15 PM",
      title: "Tea Break",
      description: null
    },
    {
      day: 1,
      timeRange: "3:15 PM – 4:45 PM",
      title: "Governors’ Roundtable",
      description: "<strong>Theme: State Perspectives on Electricity Sector Reform</strong><br/><br/><em>Participants:</em><ul><li>Selected Governors</li><li>Deputy Governors</li><li>Commissioners for Energy</li></ul><br/><em>Discussion:</em><ul><li>Opportunities and challenges</li><li>State reform priorities</li><li>Investment requirements</li></ul>"
    },
    {
      day: 1,
      timeRange: "4:45 PM – 5:15 PM",
      title: "Fireside Chat",
      description: "Lessons from Early Movers: Experiences of States Implementing Electricity Reforms"
    },
    {
      day: 1,
      timeRange: "5:15 PM",
      title: "Close of Day One",
      description: null
    },
    {
      day: 1,
      timeRange: "7:00 PM – 9:00 PM",
      title: "Networking Dinner",
      speaker: "Distinguished Energy Sector Leader",
      description: null
    },

    // DAY TWO
    {
      day: 2,
      timeRange: "8:30 AM – 9:00 AM",
      title: "Arrival and Networking",
      description: null
    },
    {
      day: 2,
      timeRange: "9:00 AM – 10:30 AM",
      title: "Panel 3",
      description: "<strong>Financing State Electricity Development</strong><br/><br/><em>Discussion Areas:</em><ul><li>Infrastructure financing</li><li>Public-Private Partnerships</li><li>Green financing</li><li>Development finance opportunities</li><li>Risk mitigation instruments</li></ul><br/><em>Panelists:</em><ul><li>World Bank</li><li>African Development Bank (AfDB)</li><li>Africa Finance Corporation (AFC)</li><li>InfraCredit</li><li>Commercial Banks</li><li>Bank of Industry (BOI)</li></ul>"
    },
    {
      day: 2,
      timeRange: "10:30 AM – 10:45 AM",
      title: "Coffee Break",
      description: null
    },
    {
      day: 2,
      timeRange: "10:45 AM – 12:15 PM",
      title: "Panel 4",
      description: "<strong>Unlocking Investment Opportunities in State Electricity Markets</strong><br/><br/><em>Discussion Areas:</em><ul><li>Embedded Generation</li><li>Mini-grids</li><li>Renewable Energy Projects</li><li>Industrial Clusters</li><li>Captive Power Opportunities</li></ul><br/><em>Panelists:</em><ul><li>Private Investors</li><li>Renewable Energy Developers</li><li>Distribution Companies (DisCos)</li><li>Generation Companies (GenCos)</li></ul>"
    },
    {
      day: 2,
      timeRange: "12:15 PM – 1:15 PM",
      title: "Lunch",
      description: null
    },
    {
      day: 2,
      timeRange: "1:15 PM – 2:45 PM",
      title: "Facilitated State Implementation Workshop (Plenary Session)",
      description: "<strong>Theme: Developing Practical Roadmaps for State Electricity Market Implementation</strong><br/><br/><em>Format:</em> A professionally facilitated plenary session where all participants remain in the main conference hall. Moderators will guide structured discussions while allowing contributions from State Governments, regulators, investors, development partners and electricity sector stakeholders.<br/><br/><em>Focus Areas:</em><ol><li>Establishing State Electricity Regulatory Institutions.</li><li>Designing State Electricity Markets and Licensing Frameworks.</li><li>Financing and Investment Readiness.</li><li>Rural Electrification and Renewable Energy Deployment.</li></ol><br/><em>Expected Outputs:</em><ul><li>Priority implementation actions for States.</li><li>Identification of key challenges and practical solutions.</li><li>Best practice recommendations.</li><li>Consensus recommendations for inclusion in the National Workshop Communiqué.</li></ul>"
    },
    {
      day: 2,
      timeRange: "2:45 PM – 3:00 PM",
      title: "Tea Break",
      description: null
    },
    {
      day: 2,
      timeRange: "3:00 PM – 4:00 PM",
      title: "Presentation and Validation of Plenary Outcomes",
      description: "<em>Activities:</em><ul><li>Presentation of consolidated recommendations by the Lead Facilitator.</li><li>Reflections by expert panelists.</li><li>Validation of recommendations by participants.</li><li>Agreement on immediate, medium and long-term implementation priorities.</li></ul><br/><em>Outputs:</em><ul><li>Validated recommendations.</li><li>Agreed implementation priorities.</li><li>Inputs into the National Workshop Communiqué.</li></ul>"
    },
    {
      day: 2,
      timeRange: "4:00 PM – 4:45 PM",
      title: "Adoption of Communiqué",
      description: "<em>Key Outputs:</em><ul><li>Agreed State Electricity Implementation Roadmap.</li><li>Recommendations to State Governments.</li><li>Recommendations to the Federal Government.</li><li>Recommendations to Investors and Development Partners.</li></ul>"
    },
    {
      day: 2,
      timeRange: "4:45 PM – 5:15 PM",
      title: "Closing Ceremony",
      description: "<em>Remarks by:</em><ul><li>Representative of Development Partners</li><li>Chairman, Nigerian Governors’ Forum</li><li>Honourable Minister of Power</li></ul>"
    },
    {
      day: 2,
      timeRange: "5:15 PM – 5:30 PM",
      title: "Closing Address",
      speaker: "His Excellency, The Vice President of the Federal Republic of Nigeria",
      description: null
    }
  ];

  console.log(`Inserting ${items.length} schedule items...`);
  
  for (const item of items) {
    await prisma.scheduleItem.create({ data: item });
  }
  
  console.log("Successfully seeded the agenda!");
}

seedAgenda()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
