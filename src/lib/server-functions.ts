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
        address: data.address,
        gender: data.gender,
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

      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NIES2023:${reg.id}`;

      // Email to the user
      await transporter.sendMail({
        from: '"National Electricity Workshop" <nutech2025@gmail.com>',
        to: data.email,
        subject: 'Registration Confirmation - National Electricity Workshop',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Registration Confirmation</title>
        </head>
        <body style='font-family: Arial, sans-serif; background-color: #f8f9fa; color: #333; margin: 0; padding: 20px;'>
            <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 5px solid #008753;'>
                <h2 style='color: #0F1A1C; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; margin-top: 0;'>Registration Confirmed</h2>
                <p style='font-size: 16px;'>Dear <strong>${data.firstName}</strong>,</p>
                <p style='font-size: 16px; line-height: 1.5;'>Thank you for registering for the <strong>2-DAY NATIONAL WORKSHOP ON THE ELECTRICITY ACT 2023</strong>.</p>
                <div style='background-color: #f1f8f5; border-left: 4px solid #008753; padding: 15px; margin: 20px 0;'>
                    <h3 style='margin-top: 0; color: #008753;'>Your Event Pass</h3>
                    <p style='margin: 5px 0;'><strong>Ticket Type:</strong> ${data.ticketType}</p>
                    <p style='margin: 5px 0;'><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                    <p style='margin: 5px 0;'><strong>Registration ID:</strong> ${reg.id}</p>
                </div>
                <div style='text-align: center; margin: 30px 0;'>
                    <p style='font-size: 14px; color: #666; margin-bottom: 10px;'>Please present this QR code at the event for check-in:</p>
                    <img src='${qrCodeUrl}' alt='QR Code' style='border: 1px solid #ddd; padding: 10px; border-radius: 8px; background: #fff;' />
                </div>
                <p style='font-size: 16px; line-height: 1.5;'>We have received your details and our team will be in touch with you shortly with further updates.</p>
                <br>
                <p style='font-size: 14px; color: #777; border-top: 1px solid #f0f0f0; padding-top: 20px;'>
                    Best regards,<br>
                    <strong>National Electricity Workshop Team</strong>
                </p>
            </div>
        </body>
        </html>`
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
