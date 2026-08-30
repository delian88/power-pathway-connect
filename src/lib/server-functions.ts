import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";

export const getLandingDataFn = createServerFn({ method: "GET" }).handler(async () => {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  const events = await db.event.findMany({ orderBy: { date: 'desc' }, take: 10 });
  const scheduleItems = await db.scheduleItem.findMany({ orderBy: [{ day: 'asc' }, { createdAt: 'asc' }] });
  return JSON.parse(JSON.stringify({ settings, events, scheduleItems }));
});

let siteSettingsPromise: Promise<any> | null = null;
let siteSettingsCacheTime = 0;

export const getSiteSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (siteSettingsPromise && (now - siteSettingsCacheTime < 2000)) {
    return siteSettingsPromise;
  }
  
  siteSettingsPromise = (async () => {
    const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
  })();
  siteSettingsCacheTime = now;
  
  return siteSettingsPromise;
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

    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'nutech2025@gmail.com',
          pass: 'owrh saib zyan sluf'
        }
      });

      // Email to the user
      await transporter.sendMail({
        from: '"National Electricity Workshop" <nutech2025@gmail.com>',
        to: data.email,
        subject: 'Registration Confirmation - National Electricity Workshop',
        html: `<h2>Dear ${data.firstName},</h2>
               <p>Thank you for registering for the 2-DAY NATIONAL WORKSHOP ON THE ELECTRICITY ACT 2023.</p>
               <p>We have received your details and our team will be in touch with you shortly.</p>
               <br>
               <p>Best regards,<br>National Electricity Workshop Team</p>`
      });

      // Email to the admin
      await transporter.sendMail({
        from: '"National Electricity Workshop" <nutech2025@gmail.com>',
        to: 'nutech2025@gmail.com',
        subject: `New Registration: ${data.firstName} ${data.lastName}`,
        html: `<h2>New Registration Received</h2>
               <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
               <p><strong>Email:</strong> ${data.email}</p>
               <p><strong>Phone:</strong> ${data.phone}</p>
               <p><strong>Organization:</strong> ${data.organization}</p>
               <p><strong>Job Title:</strong> ${data.jobTitle}</p>
               <p><strong>Ticket Type:</strong> ${data.ticketType}</p>`
      });
    } catch (e) {
      console.error("Failed to send email", e);
    }

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
