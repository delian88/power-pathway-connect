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
    const existingCount = await db.registration.count({
      where: { email: data.email }
    });

    if (existingCount >= 2) {
      throw new Error("You cannot use that email. It has already been registered the maximum number of times.");
    }

    const lastReg = await db.registration.findFirst({
      where: { id: { startsWith: 'NEW2023-' } },
      orderBy: { createdAt: 'desc' }
    });
    
    let nextNumber = 1;
    if (lastReg && lastReg.id) {
      const parts = lastReg.id.split('-');
      if (parts.length === 2) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num)) {
          nextNumber = num + 1;
        }
      }
    }
    
    const nextId = `NEW2023-${String(nextNumber).padStart(3, '0')}`;

    const reg = await db.registration.create({
      data: {
        id: nextId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        organization: data.organization,
        jobTitle: data.jobTitle,
        ticketType: data.ticketType,
        address: data.address,
        city: data.city,
        country: data.country,
        zipCode: data.zipCode,
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
        html: `
<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);'>
  <div style='background: #008753; color: #fff; padding: 20px; text-align: center;'>
    <h2 style='margin: 0; font-size: 24px;'>New Registration Alert</h2>
    <p style='margin: 5px 0 0; color: #D4AF37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;'>National Electricity Workshop 2023</p>
  </div>
  <div style='padding: 30px; background: #fff;'>
    <p style='font-size: 16px; line-height: 1.5; margin-top: 0;'>A new attendee has just registered. Here are their details:</p>
    
    <table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; width: 35%; color: #0F1A1C;'>Registration ID</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>${nextId}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Name</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>${data.firstName} ${data.lastName}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Email</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'><a href="mailto:${data.email}" style="color: #008753;">${data.email}</a></td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Phone</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>${data.phone}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Organization</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>${data.organization}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Job Title</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>${data.jobTitle}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Ticket Type</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'><span style='background: #e6f3ee; color: #008753; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 13px;'>${data.ticketType}</span></td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Gender</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>${data.gender}</td>
      </tr>
      <tr>
        <td style='padding: 12px 15px; background: #f9f9f9; border-bottom: 1px solid #eee; font-weight: bold; color: #0F1A1C;'>Address</td>
        <td style='padding: 12px 15px; border-bottom: 1px solid #eee;'>${data.address}<br>${data.city}, ${data.country} ${data.zipCode}</td>
      </tr>
    </table>
    
    <div style='margin-top: 30px; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 20px;'>
      <p style='font-size: 13px; color: #888; margin: 0;'>Automated message from NIES 2023 System</p>
    </div>
  </div>
</div>`
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

export const getReportsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const reports = await db.report.findMany({
      orderBy: { year: 'desc' }
    });
    return JSON.parse(JSON.stringify(reports));
  });

export const createReportFn = createServerFn({ method: "POST" })
  .validator((data: { year: string, title: string, description: string, size: string, fileUrl: string }) => data)
  .handler(async ({ data }) => {
    const report = await db.report.create({
      data: {
        year: data.year,
        title: data.title,
        description: data.description,
        size: data.size,
        fileUrl: data.fileUrl,
      }
    });
    return JSON.parse(JSON.stringify(report));
  });

export const updateReportFn = createServerFn({ method: "POST" })
  .validator((data: { id: string, year: string, title: string, description: string, size: string, fileUrl: string }) => data)
  .handler(async ({ data }) => {
    const report = await db.report.update({
      where: { id: data.id },
      data: {
        year: data.year,
        title: data.title,
        description: data.description,
        size: data.size,
        fileUrl: data.fileUrl,
      }
    });
    return JSON.parse(JSON.stringify(report));
  });

export const deleteReportFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await db.report.delete({
      where: { id: data.id }
    });
    return { success: true };
  });

export const getSponsorCodesFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const codes = await db.sponsorCode.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return JSON.parse(JSON.stringify(codes));
  });

export const verifySponsorCodeFn = createServerFn({ method: "POST" })
  .validator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    const sponsor = await db.sponsorCode.findUnique({
      where: { code: data.code }
    });
    
    if (!sponsor || sponsor.status !== 'active') {
      throw new Error("Invalid or inactive sponsor code");
    }
    
    return JSON.parse(JSON.stringify(sponsor));
  });

export const createSponsorCodeFn = createServerFn({ method: "POST" })
  .validator((data: { code: string, sponsorName: string, package: string, logoUrl: string, status: string }) => data)
  .handler(async ({ data }) => {
    const sponsor = await db.sponsorCode.create({
      data: {
        code: data.code,
        sponsorName: data.sponsorName,
        package: data.package,
        logoUrl: data.logoUrl,
        status: data.status,
      }
    });
    return JSON.parse(JSON.stringify(sponsor));
  });

export const updateSponsorCodeFn = createServerFn({ method: "POST" })
  .validator((data: { id: string, code: string, sponsorName: string, package: string, logoUrl: string, status: string }) => data)
  .handler(async ({ data }) => {
    const sponsor = await db.sponsorCode.update({
      where: { id: data.id },
      data: {
        code: data.code,
        sponsorName: data.sponsorName,
        package: data.package,
        logoUrl: data.logoUrl,
        status: data.status,
      }
    });
    return JSON.parse(JSON.stringify(sponsor));
  });

export const deleteSponsorCodeFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await db.sponsorCode.delete({
      where: { id: data.id }
    });
    return { success: true };
  });
