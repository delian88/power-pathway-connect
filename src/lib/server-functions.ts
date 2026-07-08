import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";

export const getLandingDataFn = createServerFn({ method: "GET" }).handler(async () => {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  const events = await db.event.findMany({ orderBy: { date: 'desc' }, take: 10 });
  return JSON.parse(JSON.stringify({ settings, events }));
});
