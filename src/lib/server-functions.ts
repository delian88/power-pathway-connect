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

export const submitRegistrationFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const reg = await db.registration.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        organization: data.organization,
        jobTitle: data.jobTitle,
        ticketType: data.ticketType,
      }
    });
    return JSON.parse(JSON.stringify(reg));
  });

export const getRegistrationsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const regs = await db.registration.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return JSON.parse(JSON.stringify(regs));
  });

export const updateRegistrationStatusFn = createServerFn({ method: "POST" })
  .validator((data: { id: string, status: string }) => data)
  .handler(async ({ data }) => {
    const reg = await db.registration.update({
      where: { id: data.id },
      data: { status: data.status }
    });
    return JSON.parse(JSON.stringify(reg));
  });
