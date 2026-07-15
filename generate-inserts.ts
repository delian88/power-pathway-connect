import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const scheduleItems = await prisma.scheduleItem.findMany();
  const settings = await prisma.siteSettings.findFirst();

  let sql = '';

  if (settings) {
    const escapedHeroText = settings.heroText ? `'${settings.heroText.replace(/'/g, "\\'")}'` : 'NULL';
    const escapedHeroSubText = settings.heroSubText ? `'${settings.heroSubText.replace(/'/g, "\\'")}'` : 'NULL';
    
    // Just a basic insert for the required fields for SiteSettings
    sql += `INSERT INTO \`SiteSettings\` (\`id\`, \`heroText\`, \`heroSubText\`, \`updatedAt\`) VALUES (${settings.id}, ${escapedHeroText}, ${escapedHeroSubText}, NOW()) ON DUPLICATE KEY UPDATE \`heroText\` = VALUES(\`heroText\`), \`heroSubText\` = VALUES(\`heroSubText\`), \`updatedAt\` = NOW();\n\n`;
  }

  if (scheduleItems.length > 0) {
    sql += `INSERT INTO \`ScheduleItem\` (\`id\`, \`day\`, \`timeRange\`, \`title\`, \`location\`, \`speaker\`, \`createdAt\`, \`updatedAt\`) VALUES\n`;
    const values = scheduleItems.map(item => {
      const id = `'${item.id}'`;
      const day = item.day;
      const timeRange = `'${item.timeRange.replace(/'/g, "\\'")}'`;
      const title = `'${item.title.replace(/'/g, "\\'")}'`;
      const location = item.location ? `'${item.location.replace(/'/g, "\\'")}'` : 'NULL';
      const speaker = item.speaker ? `'${item.speaker.replace(/'/g, "\\'")}'` : 'NULL';
      return `(${id}, ${day}, ${timeRange}, ${title}, ${location}, ${speaker}, NOW(), NOW())`;
    });
    sql += values.join(',\n') + ';\n';
  }

  fs.writeFileSync('C:\\Users\\PC\\.gemini\\antigravity-ide\\brain\\0c97c2e2-062a-40e8-be98-98e52fef1d37\\inserts.sql', sql);
  console.log('Inserts generated successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
