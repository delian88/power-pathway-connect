import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";

export const getLandingDataFn = createServerFn({ method: "GET" }).handler(async () => {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  const events = await db.event.findMany({ orderBy: { date: 'desc' }, take: 10 });
  const scheduleItems = await db.scheduleItem.findMany({ orderBy: [{ day: 'asc' }, { timeRange: 'asc' }] });
  return JSON.parse(JSON.stringify({ settings, events, scheduleItems }));
});

export const getSiteSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  return settings ? JSON.parse(JSON.stringify(settings)) : null;
});
