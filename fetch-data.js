import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching live database content to hardcode into the build...');
  try {
    const settings = await prisma.siteSettings.findFirst();
    const landingData = {
      // Add other stuff here if needed, but the main one is settings
    };

    const data = {
      settings: settings || null,
      timestamp: new Date().toISOString()
    };

    const outputPath = path.join(process.cwd(), 'src', 'lib', 'hardcoded-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log('Successfully saved database content to src/lib/hardcoded-data.json');
  } catch (error) {
    console.error('Error fetching data from database:', error);
    // Write an empty object so the build doesn't fail if DB is down
    const outputPath = path.join(process.cwd(), 'src', 'lib', 'hardcoded-data.json');
    if (!fs.existsSync(outputPath)) {
        fs.writeFileSync(outputPath, JSON.stringify({ settings: null }, null, 2));
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
