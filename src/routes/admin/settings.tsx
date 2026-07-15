import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const getSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  return settings ? JSON.parse(JSON.stringify(settings)) : null;
});

export const updateSettingsFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    let finalLogoUrl = data.logoUrl;
    
    async function saveImg(base64, filename) {
      if (!base64 || !filename) return undefined;
      try {
        const fs = await import("fs");
        const path = await import("path");
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const publicDir = path.join(process.cwd(), 'public');
        const filePath = path.join(publicDir, filename);
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
        fs.writeFileSync(filePath, buffer);
        return `/${filename}`;
      } catch (e) {
        console.error("Failed to save image", e);
        return undefined;
      }
    }
    
    if (data.whyAttendCard1ImgBase64) {
      const url = await saveImg(data.whyAttendCard1ImgBase64, data.whyAttendCard1ImgFileName);
      if (url) data.whyAttendCard1ImgUrl = url;
    }
    if (data.whyAttendCard2ImgBase64) {
      const url = await saveImg(data.whyAttendCard2ImgBase64, data.whyAttendCard2ImgFileName);
      if (url) data.whyAttendCard2ImgUrl = url;
    }
    if (data.whyAttendCard3ImgBase64) {
      const url = await saveImg(data.whyAttendCard3ImgBase64, data.whyAttendCard3ImgFileName);
      if (url) data.whyAttendCard3ImgUrl = url;
    }

    if (data.ourApproachCard1ImgBase64) {
      const url = await saveImg(data.ourApproachCard1ImgBase64, data.ourApproachCard1ImgFileName);
      if (url) data.ourApproachCard1ImgUrl = url;
    }
    if (data.ourApproachCard2ImgBase64) {
      const url = await saveImg(data.ourApproachCard2ImgBase64, data.ourApproachCard2ImgFileName);
      if (url) data.ourApproachCard2ImgUrl = url;
    }
    if (data.ourApproachCard3ImgBase64) {
      const url = await saveImg(data.ourApproachCard3ImgBase64, data.ourApproachCard3ImgFileName);
      if (url) data.ourApproachCard3ImgUrl = url;
    }

    if (data.aboutHeroImgBase64) {
      const url = await saveImg(data.aboutHeroImgBase64, data.aboutHeroImgFileName);
      if (url) data.aboutHeroImgUrl = url;
    }
    if (data.agendaHeroImgBase64) {
      const url = await saveImg(data.agendaHeroImgBase64, data.agendaHeroImgFileName);
      if (url) data.agendaHeroImgUrl = url;
    }
    if (data.agendaBrochureBase64) {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
        const base64Data = data.agendaBrochureBase64.replace(/^data:application\/pdf;base64,/, "").replace(/^data:.*?;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const filePath = path.join(publicDir, data.agendaBrochureFileName);
        fs.writeFileSync(filePath, buffer);
        data.agendaBrochureUrl = `/${data.agendaBrochureFileName}`;
      } catch (e) {
        console.error("Failed to save brochure", e);
      }
    }

    // If a file was uploaded as base64, save it to the public directory
    if (data.logoBase64 && data.logoFileName) {
      try {
        const fs = await import("fs");
        const path = await import("path");
        
        const base64Data = data.logoBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const publicDir = path.join(process.cwd(), 'public');
        const filePath = path.join(publicDir, data.logoFileName);
        
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, buffer);
        finalLogoUrl = `/${data.logoFileName}`;
      } catch (e) {
        console.error("Failed to save image locally", e);
      }
    }

    if (data.faviconBase64) {
      const url = await saveImg(data.faviconBase64, data.faviconFileName);
      if (url) data.faviconUrl = url;
    }
    if (data.convenerLogo1Base64) {
      const url = await saveImg(data.convenerLogo1Base64, data.convenerLogo1FileName);
      if (url) data.convenerLogo1Url = url;
    }
    if (data.convenerLogo2Base64) {
      const url = await saveImg(data.convenerLogo2Base64, data.convenerLogo2FileName);
      if (url) data.convenerLogo2Url = url;
    }

    let finalSliderImages = data.heroSliderImages;

    // Handle new slider images uploads
    if (data.sliderImagesBase64 && data.sliderImagesBase64.length > 0) {
      try {
        const fs = await import("fs");
        const path = await import("path");
        const publicDir = path.join(process.cwd(), 'public');
        
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }

        const uploadedUrls = [];
        for (let i = 0; i < data.sliderImagesBase64.length; i++) {
          const b64 = data.sliderImagesBase64[i];
          const fName = data.sliderImagesFileNames[i];
          const base64Data = b64.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, 'base64');
          const filePath = path.join(publicDir, fName);
          fs.writeFileSync(filePath, buffer);
          uploadedUrls.push(`/${fName}`);
        }
        
        // Append new images or replace depending on logic. We'll append here.
        let existing = [];
        if (finalSliderImages) {
           try { existing = JSON.parse(finalSliderImages); } catch (e) {}
        }
        finalSliderImages = JSON.stringify([...existing, ...uploadedUrls]);

      } catch (e) {
         console.error("Failed to save slider images locally", e);
      }
    }

    let finalSpeakers = data.featuredSpeakers || [];
    for (let i = 0; i < finalSpeakers.length; i++) {
      const sp = finalSpeakers[i];
      if (sp.imgBase64 && sp.imgFileName) {
        try {
          const fs = await import("fs");
          const path = await import("path");
          const publicDir = path.join(process.cwd(), 'public');
          if (!fs.existsSync(publicDir)) {
             fs.mkdirSync(publicDir, { recursive: true });
          }
          const base64Data = sp.imgBase64.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, 'base64');
          const filePath = path.join(publicDir, sp.imgFileName);
          fs.writeFileSync(filePath, buffer);
          sp.imgUrl = `/${sp.imgFileName}`;
        } catch(e) {
          console.error("Failed to save speaker image", e);
        }
        delete sp.imgBase64;
        delete sp.imgFileName;
      }
    }

    let finalVenues = data.aboutVenues || [];
    for (let i = 0; i < finalVenues.length; i++) {
      const v = finalVenues[i];
      if (v.imgBase64 && v.imgFileName) {
        try {
          const fs = await import("fs");
          const path = await import("path");
          const publicDir = path.join(process.cwd(), 'public');
          if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
          const base64Data = v.imgBase64.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, 'base64');
          const filePath = path.join(publicDir, v.imgFileName);
          fs.writeFileSync(filePath, buffer);
          v.imgUrl = `/${v.imgFileName}`;
          delete v.imgBase64;
          delete v.imgFileName;
        } catch (e) {
          console.error("Failed to save venue image", e);
        }
      }
    }

    let finalSponsorshipPartners = data.sponsorshipPartners || [];
    for (let i = 0; i < finalSponsorshipPartners.length; i++) {
      const p = finalSponsorshipPartners[i];
      if (p.imgBase64 && p.imgFileName) {
        try {
          const fs = await import("fs");
          const path = await import("path");
          const publicDir = path.join(process.cwd(), 'public');
          if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
          const base64Data = p.imgBase64.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, 'base64');
          const filePath = path.join(publicDir, p.imgFileName);
          fs.writeFileSync(filePath, buffer);
          p.logoUrl = `/${p.imgFileName}`;
          delete p.imgBase64;
          delete p.imgFileName;
        } catch (e) {
          console.error("Failed to save partner logo", e);
        }
      }
    }

    const payload = {
      appNameFirstPart: data.appNameFirstPart,
      appNameSecondPart: data.appNameSecondPart,
      convenerTitle: data.convenerTitle,
      aboutWorkshopText: data.aboutWorkshopText,
      aboutTargetParticipantsText: data.aboutTargetParticipantsText,
      aboutWhySponsorText: data.aboutWhySponsorText,
      aboutSponsorshipPackagesText: data.aboutSponsorshipPackagesText,
      aboutBrandingOpportunitiesText: data.aboutBrandingOpportunitiesText,
      aboutExpectedOutcomesText: data.aboutExpectedOutcomesText,
      aboutPartnerWithUsText: data.aboutPartnerWithUsText,
      heroText: data.heroText,
      heroSubText: data.heroSubText,
      heroBadgeText: data.heroBadgeText,
      logoUrl: finalLogoUrl,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
      eventFee: Number(data.eventFee),
      smtpHost: data.smtpHost,
      smtpPort: data.smtpPort ? Number(data.smtpPort) : null,
      smtpUser: data.smtpUser,
      smtpPass: data.smtpPass,
      emailEnabled: Boolean(data.emailEnabled),
      headerPatronageText: data.headerPatronageText,
      headerPresidentText: data.headerPresidentText,
      headerLocationText: data.headerLocationText,
      headerLocationSubText: data.headerLocationSubText,
      headerDateText: data.headerDateText,
      heroSliderImages: finalSliderImages,
      transformationHubTitle: data.transformationHubTitle,
      transformationHubDescription: data.transformationHubDescription,
      infoBarDateText: data.infoBarDateText,
      infoBarLocationText: data.infoBarLocationText,
      infoBarThemeText: data.infoBarThemeText,
      heroBadgeText: data.heroBadgeText,
      partnerNames: data.partnerNames,
      transformationHubFeature1Title: data.transformationHubFeature1Title,
      transformationHubFeature1Desc: data.transformationHubFeature1Desc,
      transformationHubFeature2Title: data.transformationHubFeature2Title,
      transformationHubFeature2Desc: data.transformationHubFeature2Desc,
      transformationHubFeature3Title: data.transformationHubFeature3Title,
      transformationHubFeature3Desc: data.transformationHubFeature3Desc,
      transformationHubFeature4Title: data.transformationHubFeature4Title,
      transformationHubFeature4Desc: data.transformationHubFeature4Desc,
      scheduleTitle: data.scheduleTitle,
      scheduleDescription: data.scheduleDescription,
      scheduleDaysCount: parseInt(data.scheduleDaysCount) || 4,
      scheduleDates: data.scheduleDates || [],
      whyAttendTitle: data.whyAttendTitle,
      whyAttendSubtitle: data.whyAttendSubtitle,
      whyAttendCard1Title: data.whyAttendCard1Title,
      whyAttendCard1Desc: data.whyAttendCard1Desc,
      whyAttendCard2Title: data.whyAttendCard2Title,
      whyAttendCard2Desc: data.whyAttendCard2Desc,
      whyAttendCard3Title: data.whyAttendCard3Title,
      whyAttendCard3Desc: data.whyAttendCard3Desc,
      confGuideTitle: data.confGuideTitle,
      confGuideSubtitle: data.confGuideSubtitle,
      confGuideTrack1Title: data.confGuideTrack1Title,
      confGuideTrack1Subtitle: data.confGuideTrack1Subtitle,
      confGuideTrack1Date: data.confGuideTrack1Date,
      confGuideTrack1EventTitle: data.confGuideTrack1EventTitle,
      confGuideTrack1EventDesc: data.confGuideTrack1EventDesc,
      confGuideTrack2Title: data.confGuideTrack2Title,
      confGuideTrack2Subtitle: data.confGuideTrack2Subtitle,
      confGuideTrack2Date: data.confGuideTrack2Date,
      confGuideTrack2EventTitle: data.confGuideTrack2EventTitle,
      confGuideTrack2EventDesc: data.confGuideTrack2EventDesc,
      confGuideTrack3Title: data.confGuideTrack3Title,
      confGuideTrack3Subtitle: data.confGuideTrack3Subtitle,
      confGuideTrack3Date: data.confGuideTrack3Date,
      confGuideTrack3EventTitle: data.confGuideTrack3EventTitle,
      confGuideTrack3EventDesc: data.confGuideTrack3EventDesc,
      featuredSpeakersTitle: data.featuredSpeakersTitle,
      featuredSpeakersSubtitle: data.featuredSpeakersSubtitle,
      featuredSpeakersTitle: data.featuredSpeakersTitle,
      featuredSpeakersSubtitle: data.featuredSpeakersSubtitle,
      featuredSpeakersCount: data.featuredSpeakersCount,
      featuredSpeakers: finalSpeakers,
      ourApproachTitle: data.ourApproachTitle,
      ourApproachCard1Title: data.ourApproachCard1Title,
      ourApproachCard1Desc: data.ourApproachCard1Desc,
      ourApproachCard2Title: data.ourApproachCard2Title,
      ourApproachCard2Desc: data.ourApproachCard2Desc,
      ourApproachCard3Title: data.ourApproachCard3Title,
      ourApproachCard3Desc: data.ourApproachCard3Desc,
      aboutHeroBadgeText: data.aboutHeroBadgeText,
      aboutHeroTitle: data.aboutHeroTitle,
      aboutHeroSubtitle: data.aboutHeroSubtitle,
      aboutMissionTitle: data.aboutMissionTitle,
      aboutMissionSubtitle: data.aboutMissionSubtitle,
      aboutMissionCardTitle: data.aboutMissionCardTitle,
      aboutMissionCardDesc: data.aboutMissionCardDesc,
      aboutVisionCardTitle: data.aboutVisionCardTitle,
      aboutVisionCardDesc: data.aboutVisionCardDesc,
      aboutVenuesTitle: data.aboutVenuesTitle,
      aboutVenuesSubtitle: data.aboutVenuesSubtitle,
      aboutVenuesCount: data.aboutVenuesCount,
      aboutVenues: finalVenues,
      aboutVenuesWarningText: data.aboutVenuesWarningText,
      aboutCtaTitle: data.aboutCtaTitle,
      aboutCtaSubtitle: data.aboutCtaSubtitle,
      agendaHeroTitle: data.agendaHeroTitle,
      agendaHeroSubtitle: data.agendaHeroSubtitle,
      agendaHeroDesc: data.agendaHeroDesc,
      agendaSectionTitle: data.agendaSectionTitle,
      agendaSectionSubtitle: data.agendaSectionSubtitle,
      agendaDaysCount: data.agendaDaysCount,
      agendaDays: data.agendaDays,
      sponsorshipHeroTagline: data.sponsorshipHeroTagline,
      sponsorshipHeroTitle: data.sponsorshipHeroTitle,
      sponsorshipHeroDesc: data.sponsorshipHeroDesc,
      sponsorshipPartnersTitle: data.sponsorshipPartnersTitle,
      sponsorshipPartnersDesc: data.sponsorshipPartnersDesc,
      sponsorshipPartners: finalSponsorshipPartners,
      sponsorshipPackagesTitle: data.sponsorshipPackagesTitle,
      sponsorshipPackagesDesc: data.sponsorshipPackagesDesc,
      sponsorshipPackages: data.sponsorshipPackages,
      sponsorshipCtaTitle: data.sponsorshipCtaTitle,
      sponsorshipCtaDesc: data.sponsorshipCtaDesc,
      contactPageTagline: data.contactPageTagline,
      contactPageTitle: data.contactPageTitle,
      contactPageDesc: data.contactPageDesc,
      ...(data.whyAttendCard1ImgUrl && { whyAttendCard1ImgUrl: data.whyAttendCard1ImgUrl }),
      ...(data.whyAttendCard2ImgUrl && { whyAttendCard2ImgUrl: data.whyAttendCard2ImgUrl }),
      ...(data.whyAttendCard3ImgUrl && { whyAttendCard3ImgUrl: data.whyAttendCard3ImgUrl }),
      ...(data.ourApproachCard1ImgUrl && { ourApproachCard1ImgUrl: data.ourApproachCard1ImgUrl }),
      ...(data.ourApproachCard2ImgUrl && { ourApproachCard2ImgUrl: data.ourApproachCard2ImgUrl }),
      ...(data.ourApproachCard3ImgUrl && { ourApproachCard3ImgUrl: data.ourApproachCard3ImgUrl }),
      ...(data.aboutHeroImgUrl && { aboutHeroImgUrl: data.aboutHeroImgUrl }),
      ...(data.agendaHeroImgUrl && { agendaHeroImgUrl: data.agendaHeroImgUrl }),
      ...(data.agendaBrochureUrl && { agendaBrochureUrl: data.agendaBrochureUrl }),
      ...(data.faviconUrl && { faviconUrl: data.faviconUrl }),
      ...(data.convenerLogo1Url && { convenerLogo1Url: data.convenerLogo1Url }),
      ...(data.convenerLogo2Url && { convenerLogo2Url: data.convenerLogo2Url }),
    };

    const updated = await db.siteSettings.upsert({
      where: { id: 1 },
      update: payload,
      create: { id: 1, ...payload }
    });

    return JSON.parse(JSON.stringify(updated));
  });

export const Route = createFileRoute("/admin/settings")({
  loader: async () => await getSettingsFn(),
  component: SettingsPage,
});

function SettingsPage() {
  const settings = Route.useLoaderData();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    appNameFirstPart: settings?.appNameFirstPart || "National Electricity",
    appNameSecondPart: settings?.appNameSecondPart || "Workshop",
    convenerTitle: settings?.convenerTitle || "CONVENER",
    aboutWorkshopText: settings?.aboutWorkshopText || "",
    aboutTargetParticipantsText: settings?.aboutTargetParticipantsText || "",
    aboutWhySponsorText: settings?.aboutWhySponsorText || "",
    aboutSponsorshipPackagesText: settings?.aboutSponsorshipPackagesText || "",
    aboutBrandingOpportunitiesText: settings?.aboutBrandingOpportunitiesText || "",
    aboutExpectedOutcomesText: settings?.aboutExpectedOutcomesText || "",
    aboutPartnerWithUsText: settings?.aboutPartnerWithUsText || "",
    heroText: settings?.heroText || "",
    heroSubText: settings?.heroSubText || "",
    logoUrl: settings?.logoUrl || "",
    contactEmail: settings?.contactEmail || "",
    contactPhone: settings?.contactPhone || "",
    address: settings?.address || "",
    eventFee: settings?.eventFee || 0,
    smtpHost: settings?.smtpHost || "",
    smtpPort: settings?.smtpPort || "",
    smtpUser: settings?.smtpUser || "",
    smtpPass: settings?.smtpPass || "",
    emailEnabled: settings?.emailEnabled || false,
    headerPatronageText: settings?.headerPatronageText || "",
    headerPresidentText: settings?.headerPresidentText || "",
    headerLocationText: settings?.headerLocationText || "",
    headerLocationSubText: settings?.headerLocationSubText || "",
    headerDateText: settings?.headerDateText || "",
    transformationHubTitle: settings?.transformationHubTitle || "",
    transformationHubDescription: settings?.transformationHubDescription || "",
    infoBarDateText: settings?.infoBarDateText || "",
    infoBarLocationText: settings?.infoBarLocationText || "",
    infoBarThemeText: settings?.infoBarThemeText || "",
    heroBadgeText: settings?.heroBadgeText || "",
    partnerNames: settings?.partnerNames || "",
    transformationHubFeature1Title: settings?.transformationHubFeature1Title || "",
    transformationHubFeature1Desc: settings?.transformationHubFeature1Desc || "",
    transformationHubFeature2Title: settings?.transformationHubFeature2Title || "",
    transformationHubFeature2Desc: settings?.transformationHubFeature2Desc || "",
    transformationHubFeature3Title: settings?.transformationHubFeature3Title || "",
    transformationHubFeature3Desc: settings?.transformationHubFeature3Desc || "",
    transformationHubFeature4Title: settings?.transformationHubFeature4Title || "",
    transformationHubFeature4Desc: settings?.transformationHubFeature4Desc || "",
    scheduleTitle: settings?.scheduleTitle || "",
    scheduleDescription: settings?.scheduleDescription || "",
    scheduleDaysCount: settings?.scheduleDaysCount || 4,
    scheduleDates: Array.isArray(settings?.scheduleDates) 
      ? settings.scheduleDates 
      : ["Feb 2", "Feb 3", "Feb 4", "Feb 5"],
    whyAttendTitle: settings?.whyAttendTitle || "",
    whyAttendSubtitle: settings?.whyAttendSubtitle || "",
    whyAttendCard1Title: settings?.whyAttendCard1Title || "",
    whyAttendCard1Desc: settings?.whyAttendCard1Desc || "",
    whyAttendCard2Title: settings?.whyAttendCard2Title || "",
    whyAttendCard2Desc: settings?.whyAttendCard2Desc || "",
    whyAttendCard3Title: settings?.whyAttendCard3Title || "",
    whyAttendCard3Desc: settings?.whyAttendCard3Desc || "",
    confGuideTitle: settings?.confGuideTitle || "",
    confGuideSubtitle: settings?.confGuideSubtitle || "",
    confGuideTrack1Title: settings?.confGuideTrack1Title || "",
    confGuideTrack1Subtitle: settings?.confGuideTrack1Subtitle || "",
    confGuideTrack1Date: settings?.confGuideTrack1Date || "",
    confGuideTrack1EventTitle: settings?.confGuideTrack1EventTitle || "",
    confGuideTrack1EventDesc: settings?.confGuideTrack1EventDesc || "",
    confGuideTrack2Title: settings?.confGuideTrack2Title || "",
    confGuideTrack2Subtitle: settings?.confGuideTrack2Subtitle || "",
    confGuideTrack2Date: settings?.confGuideTrack2Date || "",
    confGuideTrack2EventTitle: settings?.confGuideTrack2EventTitle || "",
    confGuideTrack2EventDesc: settings?.confGuideTrack2EventDesc || "",
    confGuideTrack3Title: settings?.confGuideTrack3Title || "",
    confGuideTrack3Subtitle: settings?.confGuideTrack3Subtitle || "",
    confGuideTrack3Date: settings?.confGuideTrack3Date || "",
    confGuideTrack3EventTitle: settings?.confGuideTrack3EventTitle || "",
    confGuideTrack3EventDesc: settings?.confGuideTrack3EventDesc || "",
    featuredSpeakersTitle: settings?.featuredSpeakersTitle || "",
    featuredSpeakersSubtitle: settings?.featuredSpeakersSubtitle || "",
    featuredSpeakersCount: settings?.featuredSpeakersCount || 4,
    featuredSpeakers: Array.isArray(settings?.featuredSpeakers) ? settings.featuredSpeakers : [],
    ourApproachTitle: settings?.ourApproachTitle || "",
    ourApproachCard1Title: settings?.ourApproachCard1Title || "",
    ourApproachCard1Desc: settings?.ourApproachCard1Desc || "",
    ourApproachCard2Desc: settings?.ourApproachCard2Desc || "",
    ourApproachCard3Title: settings?.ourApproachCard3Title || "",
    ourApproachCard3Desc: settings?.ourApproachCard3Desc || "",
    aboutHeroBadgeText: settings?.aboutHeroBadgeText || "",
    aboutHeroTitle: settings?.aboutHeroTitle || "",
    aboutHeroSubtitle: settings?.aboutHeroSubtitle || "",
    aboutMissionTitle: settings?.aboutMissionTitle || "",
    aboutMissionSubtitle: settings?.aboutMissionSubtitle || "",
    aboutMissionCardTitle: settings?.aboutMissionCardTitle || "",
    aboutMissionCardDesc: settings?.aboutMissionCardDesc || "",
    aboutVisionCardTitle: settings?.aboutVisionCardTitle || "",
    aboutVisionCardDesc: settings?.aboutVisionCardDesc || "",
    aboutVenuesTitle: settings?.aboutVenuesTitle || "",
    aboutVenuesSubtitle: settings?.aboutVenuesSubtitle || "",
    aboutVenuesCount: settings?.aboutVenuesCount || 2,
    aboutVenues: Array.isArray(settings?.aboutVenues) ? settings.aboutVenues : [],
    aboutVenuesWarningText: settings?.aboutVenuesWarningText || "",
    aboutCtaTitle: settings?.aboutCtaTitle || "",
    aboutCtaSubtitle: settings?.aboutCtaSubtitle || "",
    agendaHeroTitle: settings?.agendaHeroTitle || "",
    agendaHeroSubtitle: settings?.agendaHeroSubtitle || "",
    agendaHeroDesc: settings?.agendaHeroDesc || "",
    agendaSectionTitle: settings?.agendaSectionTitle || "",
    agendaSectionSubtitle: settings?.agendaSectionSubtitle || "",
    agendaDaysCount: settings?.agendaDaysCount || 4,
    agendaDays: Array.isArray(settings?.agendaDays) ? settings.agendaDays : [],
    sponsorshipHeroTagline: settings?.sponsorshipHeroTagline || "",
    sponsorshipHeroTitle: settings?.sponsorshipHeroTitle || "",
    sponsorshipHeroDesc: settings?.sponsorshipHeroDesc || "",
    sponsorshipPartnersTitle: settings?.sponsorshipPartnersTitle || "",
    sponsorshipPartnersDesc: settings?.sponsorshipPartnersDesc || "",
    sponsorshipPartners: Array.isArray(settings?.sponsorshipPartners) ? settings.sponsorshipPartners : [],
    sponsorshipPackagesTitle: settings?.sponsorshipPackagesTitle || "",
    sponsorshipPackagesDesc: settings?.sponsorshipPackagesDesc || "",
    sponsorshipPackages: Array.isArray(settings?.sponsorshipPackages) ? settings.sponsorshipPackages : [],
    sponsorshipCtaTitle: settings?.sponsorshipCtaTitle || "",
    sponsorshipCtaDesc: settings?.sponsorshipCtaDesc || "",
    contactPageTagline: settings?.contactPageTagline || "",
    contactPageTitle: settings?.contactPageTitle || "",
    contactPageDesc: settings?.contactPageDesc || "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [convenerLogo1File, setConvenerLogo1File] = useState<File | null>(null);
  const [convenerLogo2File, setConvenerLogo2File] = useState<File | null>(null);
  const [sliderFiles, setSliderFiles] = useState<FileList | null>(null);
  const [featuredSpeakerFiles, setFeaturedSpeakerFiles] = useState<{ [key: number]: File }>({});
  const [aboutVenueFiles, setAboutVenueFiles] = useState<{ [key: number]: File }>({});
  const [ourApproachCard1File, setOurApproachCard1File] = useState<File | null>(null);
  const [ourApproachCard2File, setOurApproachCard2File] = useState<File | null>(null);
  const [ourApproachCard3File, setOurApproachCard3File] = useState<File | null>(null);
  const [aboutHeroFile, setAboutHeroFile] = useState<File | null>(null);
  const [agendaHeroFile, setAgendaHeroFile] = useState<File | null>(null);
  const [agendaBrochureFile, setAgendaBrochureFile] = useState<File | null>(null);
  const [sponsorshipPartnerFiles, setSponsorshipPartnerFiles] = useState<{ [key: number]: File }>({});
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSliderFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSliderFiles(e.target.files);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let logoBase64 = null;
      let logoFileName = null;
      
      if (file) {
        logoFileName = file.name;
        logoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      let sliderImagesBase64: string[] = [];
      let sliderImagesFileNames: string[] = [];
      
      if (sliderFiles) {
        for (let i = 0; i < sliderFiles.length; i++) {
          const sFile = sliderFiles[i];
          sliderImagesFileNames.push(sFile.name);
          const b64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(sFile);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
          sliderImagesBase64.push(b64);
        }
      }

      let updatedSpeakers = [...formData.featuredSpeakers];
      for (let i = 0; i < formData.featuredSpeakersCount; i++) {
        if (!updatedSpeakers[i]) updatedSpeakers[i] = { name: "" };
        const sFile = featuredSpeakerFiles[i];
        if (sFile) {
          const b64 = await new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.onerror = e => reject(e);
            r.readAsDataURL(sFile);
          });
          updatedSpeakers[i] = { ...updatedSpeakers[i], imgFileName: sFile.name, imgBase64: b64 };
        }
      }

      let updatedVenues = [...formData.aboutVenues];
      for (let i = 0; i < formData.aboutVenuesCount; i++) {
        if (!updatedVenues[i]) updatedVenues[i] = { title: "", location: "", desc: "" };
        const vFile = aboutVenueFiles[i];
        if (vFile) {
          const b64 = await new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.onerror = e => reject(e);
            r.readAsDataURL(vFile);
          });
          updatedVenues[i] = { ...updatedVenues[i], imgFileName: vFile.name, imgBase64: b64 };
        }
      }

      let updatedSponsorshipPartners = [...formData.sponsorshipPartners];
      for (let i = 0; i < updatedSponsorshipPartners.length; i++) {
        const pFile = sponsorshipPartnerFiles[i];
        if (pFile) {
          const b64 = await new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.onerror = e => reject(e);
            r.readAsDataURL(pFile);
          });
          updatedSponsorshipPartners[i] = { ...updatedSponsorshipPartners[i], imgFileName: pFile.name, imgBase64: b64 };
        }
      }

      await updateSettingsFn({
        data: {
          ...formData,
          featuredSpeakers: updatedSpeakers,
          aboutVenues: updatedVenues,
          sponsorshipPartners: updatedSponsorshipPartners,
          logoBase64,
          logoFileName,
          sliderImagesBase64,
          sliderImagesFileNames,
          ...(ourApproachCard1File && {
            ourApproachCard1ImgFileName: ourApproachCard1File.name,
            ourApproachCard1ImgBase64: await new Promise((resolve) => {
              const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(ourApproachCard1File);
            })
          }),
          ...(ourApproachCard2File && {
            ourApproachCard2ImgFileName: ourApproachCard2File.name,
            ourApproachCard2ImgBase64: await new Promise((resolve) => {
              const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(ourApproachCard2File);
            })
          }),
          ...(ourApproachCard3File && {
            ourApproachCard3ImgFileName: ourApproachCard3File.name,
            ourApproachCard3ImgBase64: await new Promise((resolve) => {
              const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(ourApproachCard3File);
            })
          }),
          ...(aboutHeroFile && {
            aboutHeroImgFileName: aboutHeroFile.name,
            aboutHeroImgBase64: await new Promise((resolve) => {
              const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(aboutHeroFile);
            })
          }),
          ...(agendaHeroFile && {
            agendaHeroImgFileName: agendaHeroFile.name,
            agendaHeroImgBase64: await new Promise((resolve) => {
              const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(agendaHeroFile);
            })
          }),
          ...(agendaBrochureFile && {
            agendaBrochureFileName: agendaBrochureFile.name,
            agendaBrochureBase64: await new Promise((resolve) => {
              const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(agendaBrochureFile);
            })
          }),
          ...(faviconFile && {
            faviconFileName: faviconFile.name,
            faviconBase64: await new Promise((resolve) => {
              const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(faviconFile);
            })
          }),
          ...(convenerLogo1File && {
            convenerLogo1FileName: convenerLogo1File.name,
            convenerLogo1Base64: await new Promise((resolve) => {
              const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(convenerLogo1File);
            })
          }),
          ...(convenerLogo2File && {
            convenerLogo2FileName: convenerLogo2File.name,
            convenerLogo2Base64: await new Promise((resolve) => {
              const r = new FileReader(); r.onload = () => resolve(r.result); r.readAsDataURL(convenerLogo2File);
            })
          }),
        }
      });

      toast.success("Settings updated successfully!");
      router.invalidate();
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-[#263566]">Site Settings</h1>
      
      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-border/60">
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">General App Settings</h2>
          <div>
            <Label>App Name (Line 1)</Label>
            <Input value={formData.appNameFirstPart} onChange={e => setFormData({...formData, appNameFirstPart: e.target.value})} placeholder="National Electricity" />
          </div>
          <div>
            <Label>App Name (Line 2)</Label>
            <Input value={formData.appNameSecondPart} onChange={e => setFormData({...formData, appNameSecondPart: e.target.value})} placeholder="Workshop" />
          </div>
          <div>
            <Label>Main Logo</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div>
            <Label>Favicon</Label>
            <Input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setFaviconFile(e.target.files[0]); }} />
          </div>
          <div>
            <Label>Right Side Title (Convener)</Label>
            <Input value={formData.convenerTitle} onChange={e => setFormData({...formData, convenerTitle: e.target.value})} placeholder="CONVENER" />
          </div>
          <div>
            <Label>Right Side Logo 1</Label>
            <Input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setConvenerLogo1File(e.target.files[0]); }} />
          </div>
          <div>
            <Label>Right Side Logo 2</Label>
            <Input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setConvenerLogo2File(e.target.files[0]); }} />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">About Page Extra Content</h2>
          <div>
            <Label>About the Workshop</Label>
            <Textarea value={formData.aboutWorkshopText || ""} onChange={e => setFormData({...formData, aboutWorkshopText: e.target.value})} rows={5} />
          </div>
          <div>
            <Label>Target Participants</Label>
            <Textarea value={formData.aboutTargetParticipantsText || ""} onChange={e => setFormData({...formData, aboutTargetParticipantsText: e.target.value})} rows={8} />
          </div>
          <div>
            <Label>Why Sponsor</Label>
            <Textarea value={formData.aboutWhySponsorText || ""} onChange={e => setFormData({...formData, aboutWhySponsorText: e.target.value})} rows={5} />
          </div>
          <div>
            <Label>Sponsorship Packages</Label>
            <Textarea value={formData.aboutSponsorshipPackagesText || ""} onChange={e => setFormData({...formData, aboutSponsorshipPackagesText: e.target.value})} rows={10} />
          </div>
          <div>
            <Label>Branding Opportunities</Label>
            <Textarea value={formData.aboutBrandingOpportunitiesText || ""} onChange={e => setFormData({...formData, aboutBrandingOpportunitiesText: e.target.value})} rows={5} />
          </div>
          <div>
            <Label>Expected Outcomes</Label>
            <Textarea value={formData.aboutExpectedOutcomesText || ""} onChange={e => setFormData({...formData, aboutExpectedOutcomesText: e.target.value})} rows={5} />
          </div>
          <div>
            <Label>Partner With Us</Label>
            <Textarea value={formData.aboutPartnerWithUsText || ""} onChange={e => setFormData({...formData, aboutPartnerWithUsText: e.target.value})} rows={5} />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Header Banner</h2>
          <div>
            <Label>Patronage Text</Label>
            <Input value={formData.headerPatronageText} onChange={e => setFormData({...formData, headerPatronageText: e.target.value})} placeholder="UNDER THE HIGH PATRONAGE OF..." />
          </div>
          <div>
            <Label>President Text</Label>
            <Input value={formData.headerPresidentText} onChange={e => setFormData({...formData, headerPresidentText: e.target.value})} />
          </div>
          <div>
            <Label>Location Text</Label>
            <Input value={formData.headerLocationText} onChange={e => setFormData({...formData, headerLocationText: e.target.value})} />
          </div>
          <div>
            <Label>Location Sub Text</Label>
            <Input value={formData.headerLocationSubText} onChange={e => setFormData({...formData, headerLocationSubText: e.target.value})} />
          </div>
          <div>
            <Label>Date Text</Label>
            <Input value={formData.headerDateText} onChange={e => setFormData({...formData, headerDateText: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Info Bar</h2>
          <div>
            <Label>Info Bar Date Text</Label>
            <Input value={formData.infoBarDateText} onChange={e => setFormData({...formData, infoBarDateText: e.target.value})} placeholder="Mar 15-18, 2027" />
          </div>
          <div>
            <Label>Info Bar Location Text</Label>
            <Input value={formData.infoBarLocationText} onChange={e => setFormData({...formData, infoBarLocationText: e.target.value})} placeholder="Abuja, Nigeria" />
          </div>
          <div>
            <Label>Info Bar Theme Text</Label>
            <Input value={formData.infoBarThemeText} onChange={e => setFormData({...formData, infoBarThemeText: e.target.value})} placeholder="Sustainable Energy Future" />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Partners Section</h2>
          <div>
            <Label>Partner Names (comma-separated)</Label>
            <Input value={formData.partnerNames} onChange={e => setFormData({...formData, partnerNames: e.target.value})} placeholder="HEOSL, Africa Oil & Gas, Energy Republic, ICRC, ECOWAS, GIZ" />
            <p className="text-xs text-gray-500 mt-1">Enter the names of the partners separated by commas.</p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Hero Section</h2>
          <div>
            <Label>Hero Badge Text</Label>
            <Input value={formData.heroBadgeText} onChange={e => setFormData({...formData, heroBadgeText: e.target.value})} placeholder="Africa's Premier Energy Event" />
          </div>
          <div>
            <Label>Hero Main Text</Label>
            <Input value={formData.heroText} onChange={e => setFormData({...formData, heroText: e.target.value})} />
          </div>
          <div>
            <Label>Hero Sub Text</Label>
            <Textarea value={formData.heroSubText} onChange={e => setFormData({...formData, heroSubText: e.target.value})} rows={3} />
          </div>
          <div>
            <Label>Upload Slider Images</Label>
            <Input type="file" accept="image/*" multiple onChange={handleSliderFilesChange} />
            <p className="text-xs text-gray-500 mt-1">Select multiple images to append to the hero background slider.</p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Transformation Hub Section</h2>
          <div>
            <Label>Title</Label>
            <Input value={formData.transformationHubTitle} onChange={e => setFormData({...formData, transformationHubTitle: e.target.value})} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.transformationHubDescription} onChange={e => setFormData({...formData, transformationHubDescription: e.target.value})} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 border p-3 rounded">
              <Label>Feature 1 Title (e.g. High-Level Engagement)</Label>
              <Input value={formData.transformationHubFeature1Title} onChange={e => setFormData({...formData, transformationHubFeature1Title: e.target.value})} />
              <Label>Feature 1 Description</Label>
              <Textarea value={formData.transformationHubFeature1Desc} onChange={e => setFormData({...formData, transformationHubFeature1Desc: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2 border p-3 rounded">
              <Label>Feature 2 Title (e.g. Strategic Insights)</Label>
              <Input value={formData.transformationHubFeature2Title} onChange={e => setFormData({...formData, transformationHubFeature2Title: e.target.value})} />
              <Label>Feature 2 Description</Label>
              <Textarea value={formData.transformationHubFeature2Desc} onChange={e => setFormData({...formData, transformationHubFeature2Desc: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2 border p-3 rounded">
              <Label>Feature 3 Title (e.g. Official Government Event)</Label>
              <Input value={formData.transformationHubFeature3Title} onChange={e => setFormData({...formData, transformationHubFeature3Title: e.target.value})} />
              <Label>Feature 3 Description</Label>
              <Textarea value={formData.transformationHubFeature3Desc} onChange={e => setFormData({...formData, transformationHubFeature3Desc: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2 border p-3 rounded">
              <Label>Feature 4 Title (e.g. 5,000+ Participants)</Label>
              <Input value={formData.transformationHubFeature4Title} onChange={e => setFormData({...formData, transformationHubFeature4Title: e.target.value})} />
              <Label>Feature 4 Description</Label>
              <Textarea value={formData.transformationHubFeature4Desc} onChange={e => setFormData({...formData, transformationHubFeature4Desc: e.target.value})} rows={2} />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Event Schedule Section</h2>
          <div>
            <Label>Title</Label>
            <Input value={formData.scheduleTitle} onChange={e => setFormData({...formData, scheduleTitle: e.target.value})} placeholder="Event Schedule" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={formData.scheduleDescription} onChange={e => setFormData({...formData, scheduleDescription: e.target.value})} rows={2} placeholder="Four days of transformative discussions, networking, and deal-making" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Number of Days</Label>
              <Input 
                type="number" 
                min="1" 
                max="10"
                value={formData.scheduleDaysCount} 
                onChange={e => {
                  const newCount = parseInt(e.target.value) || 1;
                  setFormData({...formData, scheduleDaysCount: newCount});
                }} 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: formData.scheduleDaysCount }).map((_, i) => (
              <div key={i}>
                <Label>Day {i + 1} Date</Label>
                <Input 
                  value={formData.scheduleDates[i] || ""} 
                  onChange={e => {
                    const newDates = [...formData.scheduleDates];
                    newDates[i] = e.target.value;
                    setFormData({...formData, scheduleDates: newDates});
                  }} 
                  placeholder={`e.g. Feb ${i + 2}`} 
                />
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-[#F8F9FA] rounded-lg border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Manage Schedule Items</h3>
              <p className="text-sm text-gray-500">Add, edit, or remove the actual events (times, titles, speakers) for each day.</p>
            </div>
            <Button type="button" variant="outline" onClick={() => router.navigate({ to: "/admin/schedule" })}>
              Go to Schedule Manager →
            </Button>
          </div>
        </div>
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Conference Guide Section</h2>
          <div>
            <Label>Section Title</Label>
            <Input value={formData.confGuideTitle} onChange={e => setFormData({...formData, confGuideTitle: e.target.value})} placeholder="Conference Guide" />
          </div>
          <div>
            <Label>Section Subtitle</Label>
            <Textarea value={formData.confGuideSubtitle} onChange={e => setFormData({...formData, confGuideSubtitle: e.target.value})} rows={2} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2 border p-3 rounded">
              <h3 className="font-bold">Track 1 (Plenary Sessions)</h3>
              <Label>Track Title</Label>
              <Input value={formData.confGuideTrack1Title} onChange={e => setFormData({...formData, confGuideTrack1Title: e.target.value})} />
              <Label>Track Subtitle</Label>
              <Input value={formData.confGuideTrack1Subtitle} onChange={e => setFormData({...formData, confGuideTrack1Subtitle: e.target.value})} />
              <Label>Event Date/Time</Label>
              <Input value={formData.confGuideTrack1Date} onChange={e => setFormData({...formData, confGuideTrack1Date: e.target.value})} />
              <Label>Event Title</Label>
              <Input value={formData.confGuideTrack1EventTitle} onChange={e => setFormData({...formData, confGuideTrack1EventTitle: e.target.value})} />
              <Label>Event Description</Label>
              <Textarea value={formData.confGuideTrack1EventDesc} onChange={e => setFormData({...formData, confGuideTrack1EventDesc: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2 border p-3 rounded">
              <h3 className="font-bold">Track 2 (Technical Sessions)</h3>
              <Label>Track Title</Label>
              <Input value={formData.confGuideTrack2Title} onChange={e => setFormData({...formData, confGuideTrack2Title: e.target.value})} />
              <Label>Track Subtitle</Label>
              <Input value={formData.confGuideTrack2Subtitle} onChange={e => setFormData({...formData, confGuideTrack2Subtitle: e.target.value})} />
              <Label>Event Date/Time</Label>
              <Input value={formData.confGuideTrack2Date} onChange={e => setFormData({...formData, confGuideTrack2Date: e.target.value})} />
              <Label>Event Title</Label>
              <Input value={formData.confGuideTrack2EventTitle} onChange={e => setFormData({...formData, confGuideTrack2EventTitle: e.target.value})} />
              <Label>Event Description</Label>
              <Textarea value={formData.confGuideTrack2EventDesc} onChange={e => setFormData({...formData, confGuideTrack2EventDesc: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2 border p-3 rounded">
              <h3 className="font-bold">Track 3 (Networking Events)</h3>
              <Label>Track Title</Label>
              <Input value={formData.confGuideTrack3Title} onChange={e => setFormData({...formData, confGuideTrack3Title: e.target.value})} />
              <Label>Track Subtitle</Label>
              <Input value={formData.confGuideTrack3Subtitle} onChange={e => setFormData({...formData, confGuideTrack3Subtitle: e.target.value})} />
              <Label>Event Date/Time</Label>
              <Input value={formData.confGuideTrack3Date} onChange={e => setFormData({...formData, confGuideTrack3Date: e.target.value})} />
              <Label>Event Title</Label>
              <Input value={formData.confGuideTrack3EventTitle} onChange={e => setFormData({...formData, confGuideTrack3EventTitle: e.target.value})} />
              <Label>Event Description</Label>
              <Textarea value={formData.confGuideTrack3EventDesc} onChange={e => setFormData({...formData, confGuideTrack3EventDesc: e.target.value})} rows={2} />
            </div>
          </div>
        </div>
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Why Attend Section</h2>
          <div>
            <Label>Section Title</Label>
            <Input value={formData.whyAttendTitle} onChange={e => setFormData({...formData, whyAttendTitle: e.target.value})} placeholder="Why Attend NIES 2027?" />
          </div>
          <div>
            <Label>Section Subtitle</Label>
            <Textarea value={formData.whyAttendSubtitle} onChange={e => setFormData({...formData, whyAttendSubtitle: e.target.value})} rows={2} placeholder="Discover unparalleled opportunities..." />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2 border p-3 rounded">
              <h3 className="font-bold">Card 1 (Left)</h3>
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={e => e.target.files && setWhyAttendCard1File(e.target.files[0])} />
              <Label>Title</Label>
              <Input value={formData.whyAttendCard1Title} onChange={e => setFormData({...formData, whyAttendCard1Title: e.target.value})} placeholder="Strategic Networking" />
              <Label>Description</Label>
              <Textarea value={formData.whyAttendCard1Desc} onChange={e => setFormData({...formData, whyAttendCard1Desc: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2 border p-3 rounded">
              <h3 className="font-bold">Card 2 (Center Featured)</h3>
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={e => e.target.files && setWhyAttendCard2File(e.target.files[0])} />
              <Label>Title</Label>
              <Input value={formData.whyAttendCard2Title} onChange={e => setFormData({...formData, whyAttendCard2Title: e.target.value})} placeholder="Industry Insights" />
              <Label>Description</Label>
              <Textarea value={formData.whyAttendCard2Desc} onChange={e => setFormData({...formData, whyAttendCard2Desc: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2 border p-3 rounded">
              <h3 className="font-bold">Card 3 (Right)</h3>
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={e => e.target.files && setWhyAttendCard3File(e.target.files[0])} />
              <Label>Title</Label>
              <Input value={formData.whyAttendCard3Title} onChange={e => setFormData({...formData, whyAttendCard3Title: e.target.value})} placeholder="Investment Opportunities" />
              <Label>Description</Label>
              <Textarea value={formData.whyAttendCard3Desc} onChange={e => setFormData({...formData, whyAttendCard3Desc: e.target.value})} rows={2} />
            </div>
          </div>
        </div>
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Featured Speakers Section</h2>
          <div>
            <Label>Section Title</Label>
            <Input value={formData.featuredSpeakersTitle} onChange={e => setFormData({...formData, featuredSpeakersTitle: e.target.value})} placeholder="Featured Speakers" />
          </div>
          <div>
            <Label>Section Subtitle</Label>
            <Textarea value={formData.featuredSpeakersSubtitle} onChange={e => setFormData({...formData, featuredSpeakersSubtitle: e.target.value})} rows={2} placeholder="Learn from industry pioneers..." />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Label>Number of Speakers</Label>
            <Input 
              type="number" 
              min="1" 
              max="20"
              className="w-24"
              value={formData.featuredSpeakersCount} 
              onChange={e => {
                const newCount = parseInt(e.target.value) || 1;
                setFormData({...formData, featuredSpeakersCount: newCount});
              }} 
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: formData.featuredSpeakersCount }).map((_, i) => (
              <div key={i} className="space-y-2 border p-3 rounded">
                <h3 className="font-bold">Speaker {i + 1}</h3>
                <Label>Image</Label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setFeaturedSpeakerFiles({...featuredSpeakerFiles, [i]: e.target.files[0]});
                    }
                  }} 
                />
                <Label>Name</Label>
                <Input 
                  value={formData.featuredSpeakers[i]?.name || ""} 
                  onChange={e => {
                    const newSpeakers = [...formData.featuredSpeakers];
                    if (!newSpeakers[i]) newSpeakers[i] = {};
                    newSpeakers[i].name = e.target.value;
                    setFormData({...formData, featuredSpeakers: newSpeakers});
                  }} 
                  placeholder="Speaker Name" 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Our Approach Section</h2>
          <div>
            <Label>Section Title</Label>
            <Input value={formData.ourApproachTitle} onChange={e => setFormData({...formData, ourApproachTitle: e.target.value})} placeholder="Our Approach" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2 border p-3 rounded">
              <h3 className="font-bold">Card 1</h3>
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={e => e.target.files && setOurApproachCard1File(e.target.files[0])} />
              <Label>Title</Label>
              <Input value={formData.ourApproachCard1Title} onChange={e => setFormData({...formData, ourApproachCard1Title: e.target.value})} placeholder="Event Strategy" />
              <Label>Description</Label>
              <Textarea value={formData.ourApproachCard1Desc} onChange={e => setFormData({...formData, ourApproachCard1Desc: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2 border p-3 rounded">
              <h3 className="font-bold">Card 2</h3>
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={e => e.target.files && setOurApproachCard2File(e.target.files[0])} />
              <Label>Title</Label>
              <Input value={formData.ourApproachCard2Title} onChange={e => setFormData({...formData, ourApproachCard2Title: e.target.value})} placeholder="Event Logistics" />
              <Label>Description</Label>
              <Textarea value={formData.ourApproachCard2Desc} onChange={e => setFormData({...formData, ourApproachCard2Desc: e.target.value})} rows={2} />
            </div>
            <div className="space-y-2 border p-3 rounded">
              <h3 className="font-bold">Card 3</h3>
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={e => e.target.files && setOurApproachCard3File(e.target.files[0])} />
              <Label>Title</Label>
              <Input value={formData.ourApproachCard3Title} onChange={e => setFormData({...formData, ourApproachCard3Title: e.target.value})} placeholder="Event Technology" />
              <Label>Description</Label>
              <Textarea value={formData.ourApproachCard3Desc} onChange={e => setFormData({...formData, ourApproachCard3Desc: e.target.value})} rows={2} />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t-4 border-gray-200 mt-8">
          <h2 className="text-2xl font-bold border-b pb-2">About Page Configuration</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hero Section</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Hero Background Image</Label>
                <Input type="file" accept="image/*" onChange={e => e.target.files && setAboutHeroFile(e.target.files[0])} />
              </div>
              <div>
                <Label>Hero Badge Text</Label>
                <Input value={formData.aboutHeroBadgeText} onChange={e => setFormData({...formData, aboutHeroBadgeText: e.target.value})} placeholder="The Global Platform..." />
              </div>
              <div>
                <Label>Hero Title</Label>
                <Input value={formData.aboutHeroTitle} onChange={e => setFormData({...formData, aboutHeroTitle: e.target.value})} placeholder="About NIES" />
              </div>
              <div>
                <Label>Hero Subtitle</Label>
                <Textarea value={formData.aboutHeroSubtitle} onChange={e => setFormData({...formData, aboutHeroSubtitle: e.target.value})} rows={2} />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Mission & Vision Section</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <Label>Section Title</Label>
                <Input value={formData.aboutMissionTitle} onChange={e => setFormData({...formData, aboutMissionTitle: e.target.value})} placeholder="Our Mission & Vision" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Label>Section Subtitle</Label>
                <Input value={formData.aboutMissionSubtitle} onChange={e => setFormData({...formData, aboutMissionSubtitle: e.target.value})} placeholder="Guiding principles..." />
              </div>
              <div className="space-y-2 border p-3 rounded bg-gray-50">
                <h4 className="font-bold">Mission Card</h4>
                <Label>Title</Label>
                <Input value={formData.aboutMissionCardTitle} onChange={e => setFormData({...formData, aboutMissionCardTitle: e.target.value})} placeholder="Our Mission" />
                <Label>Description</Label>
                <Textarea value={formData.aboutMissionCardDesc} onChange={e => setFormData({...formData, aboutMissionCardDesc: e.target.value})} rows={4} />
              </div>
              <div className="space-y-2 border p-3 rounded bg-gray-50">
                <h4 className="font-bold">Vision Card</h4>
                <Label>Title</Label>
                <Input value={formData.aboutVisionCardTitle} onChange={e => setFormData({...formData, aboutVisionCardTitle: e.target.value})} placeholder="Our Vision" />
                <Label>Description</Label>
                <Textarea value={formData.aboutVisionCardDesc} onChange={e => setFormData({...formData, aboutVisionCardDesc: e.target.value})} rows={4} />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Event Venues Section</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <Label>Section Title</Label>
                <Input value={formData.aboutVenuesTitle} onChange={e => setFormData({...formData, aboutVenuesTitle: e.target.value})} placeholder="Event Venues" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Label>Section Subtitle</Label>
                <Input value={formData.aboutVenuesSubtitle} onChange={e => setFormData({...formData, aboutVenuesSubtitle: e.target.value})} placeholder="Experience NIES 2027..." />
              </div>
              <div className="col-span-2">
                <Label>Warning/Note Text</Label>
                <Input value={formData.aboutVenuesWarningText} onChange={e => setFormData({...formData, aboutVenuesWarningText: e.target.value})} placeholder="Abuja is a large city..." />
              </div>
              <div className="space-y-2 border p-3 rounded bg-gray-50">
                <h4 className="font-bold">Venue 1</h4>
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={e => e.target.files && setAboutVenue1File(e.target.files[0])} />
                <Label>Title</Label>
                <Input value={formData.aboutVenue1Title} onChange={e => setFormData({...formData, aboutVenue1Title: e.target.value})} placeholder="Presidential Banquet Hall" />
                <Label>Location</Label>
                <Input value={formData.aboutVenue1Location} onChange={e => setFormData({...formData, aboutVenue1Location: e.target.value})} placeholder="Aso Villa, Abuja" />
                <Label>Description</Label>
                <Textarea value={formData.aboutVenue1Desc} onChange={e => setFormData({...formData, aboutVenue1Desc: e.target.value})} rows={3} />
              </div>
              <div className="space-y-2 border p-3 rounded bg-gray-50">
                <h4 className="font-bold">Venue 2</h4>
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={e => e.target.files && setAboutVenue2File(e.target.files[0])} />
                <Label>Title</Label>
                <Input value={formData.aboutVenue2Title} onChange={e => setFormData({...formData, aboutVenue2Title: e.target.value})} placeholder="Bola Ahmed Tinubu ICC" />
                <Label>Location</Label>
                <Input value={formData.aboutVenue2Location} onChange={e => setFormData({...formData, aboutVenue2Location: e.target.value})} placeholder="Central Business District" />
                <Label>Description</Label>
                <Textarea value={formData.aboutVenue2Desc} onChange={e => setFormData({...formData, aboutVenue2Desc: e.target.value})} rows={3} />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Call to Action Section</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input value={formData.aboutCtaTitle} onChange={e => setFormData({...formData, aboutCtaTitle: e.target.value})} placeholder="Join Africa's Energy Transformation" />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Textarea value={formData.aboutCtaSubtitle} onChange={e => setFormData({...formData, aboutCtaSubtitle: e.target.value})} rows={3} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-8">
          <h2 className="text-xl font-semibold border-b pb-2">Branding & Logo</h2>
          <div>
            <Label>Current Logo URL</Label>
            <Input 
              value={formData.logoUrl} 
              onChange={e => setFormData({...formData, logoUrl: e.target.value})} 
            />
            {formData.logoUrl && (
              <div className="mt-2 p-2 bg-gray-50 rounded inline-block">
                <img src={formData.logoUrl} alt="Logo preview" className="h-12 object-contain" />
              </div>
            )}
          </div>
          <div>
            <Label>Upload New Logo</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            <p className="text-xs text-gray-500 mt-1">This will upload the file to the local server storage and update the URL.</p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Contact Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input 
                type="email"
                value={formData.contactEmail} 
                onChange={e => setFormData({...formData, contactEmail: e.target.value})} 
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input 
                value={formData.contactPhone} 
                onChange={e => setFormData({...formData, contactPhone: e.target.value})} 
              />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Textarea 
              value={formData.address} 
              onChange={e => setFormData({...formData, address: e.target.value})} 
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">About Page Configuration</h2>
          
          <div className="border p-4 rounded bg-gray-50 space-y-4">
            <h3 className="font-bold text-lg">1. Hero Section</h3>
            <div>
              <Label>Hero Background Image</Label>
              <Input type="file" accept="image/*" onChange={e => e.target.files && setAboutHeroFile(e.target.files[0])} />
            </div>
            <div>
              <Label>Hero Badge Text</Label>
              <Input value={formData.aboutHeroBadgeText} onChange={e => setFormData({...formData, aboutHeroBadgeText: e.target.value})} placeholder="The Global Platform for Stimulating Discussion" />
            </div>
            <div>
              <Label>Hero Title</Label>
              <Input value={formData.aboutHeroTitle} onChange={e => setFormData({...formData, aboutHeroTitle: e.target.value})} placeholder="About NIES" />
            </div>
            <div>
              <Label>Hero Subtitle</Label>
              <Textarea value={formData.aboutHeroSubtitle} onChange={e => setFormData({...formData, aboutHeroSubtitle: e.target.value})} rows={2} />
            </div>
          </div>

          <div className="border p-4 rounded bg-gray-50 space-y-4">
            <h3 className="font-bold text-lg">2. Mission & Vision</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Section Title</Label>
                <Input value={formData.aboutMissionTitle} onChange={e => setFormData({...formData, aboutMissionTitle: e.target.value})} placeholder="Our Mission & Vision" />
              </div>
              <div>
                <Label>Section Subtitle</Label>
                <Input value={formData.aboutMissionSubtitle} onChange={e => setFormData({...formData, aboutMissionSubtitle: e.target.value})} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2 border p-3 rounded bg-white">
                <Label className="font-bold text-blue-800">Mission Card</Label>
                <Label>Title</Label>
                <Input value={formData.aboutMissionCardTitle} onChange={e => setFormData({...formData, aboutMissionCardTitle: e.target.value})} placeholder="Our Mission" />
                <Label>Description</Label>
                <Textarea value={formData.aboutMissionCardDesc} onChange={e => setFormData({...formData, aboutMissionCardDesc: e.target.value})} rows={4} />
              </div>
              <div className="space-y-2 border p-3 rounded bg-white">
                <Label className="font-bold text-blue-800">Vision Card</Label>
                <Label>Title</Label>
                <Input value={formData.aboutVisionCardTitle} onChange={e => setFormData({...formData, aboutVisionCardTitle: e.target.value})} placeholder="Our Vision" />
                <Label>Description</Label>
                <Textarea value={formData.aboutVisionCardDesc} onChange={e => setFormData({...formData, aboutVisionCardDesc: e.target.value})} rows={4} />
              </div>
            </div>
          </div>

          <div className="border p-4 rounded bg-gray-50 space-y-4">
            <h3 className="font-bold text-lg">3. Event Venues</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Section Title</Label>
                <Input value={formData.aboutVenuesTitle} onChange={e => setFormData({...formData, aboutVenuesTitle: e.target.value})} placeholder="Event Venues" />
              </div>
              <div>
                <Label>Section Subtitle</Label>
                <Input value={formData.aboutVenuesSubtitle} onChange={e => setFormData({...formData, aboutVenuesSubtitle: e.target.value})} />
              </div>
            </div>
            
            <div className="mt-4 border p-3 rounded bg-white">
              <Label>Number of Venues to Display</Label>
              <Input type="number" min={1} max={10} value={formData.aboutVenuesCount} onChange={e => setFormData({...formData, aboutVenuesCount: Number(e.target.value)})} />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {Array.from({ length: formData.aboutVenuesCount }).map((_, i) => (
                <div key={i} className="space-y-2 border p-3 rounded bg-white">
                  <Label className="font-bold text-blue-800">Venue {i + 1}</Label>
                  <Label>Image</Label>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => e.target.files && setAboutVenueFiles({...aboutVenueFiles, [i]: e.target.files[0]})} 
                  />
                  <Label>Venue Name</Label>
                  <Input 
                    value={formData.aboutVenues[i]?.title || ""} 
                    onChange={e => {
                      const newVenues = [...formData.aboutVenues];
                      newVenues[i] = { ...newVenues[i], title: e.target.value };
                      setFormData({...formData, aboutVenues: newVenues});
                    }} 
                  />
                  <Label>Location</Label>
                  <Input 
                    value={formData.aboutVenues[i]?.location || ""} 
                    onChange={e => {
                      const newVenues = [...formData.aboutVenues];
                      newVenues[i] = { ...newVenues[i], location: e.target.value };
                      setFormData({...formData, aboutVenues: newVenues});
                    }} 
                  />
                  <Label>Description</Label>
                  <Textarea 
                    value={formData.aboutVenues[i]?.desc || ""} 
                    onChange={e => {
                      const newVenues = [...formData.aboutVenues];
                      newVenues[i] = { ...newVenues[i], desc: e.target.value };
                      setFormData({...formData, aboutVenues: newVenues});
                    }} 
                    rows={3} 
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 border p-3 rounded bg-white">
              <Label>Warning / Notice Text (bottom of venues)</Label>
              <Input value={formData.aboutVenuesWarningText} onChange={e => setFormData({...formData, aboutVenuesWarningText: e.target.value})} placeholder="Abuja is a large city, please plan travel between venues accordingly." />
            </div>
          </div>

          <div className="border p-4 rounded bg-gray-50 space-y-4">
            <h3 className="font-bold text-lg">4. Call to Action Banner</h3>
            <div>
              <Label>CTA Title</Label>
              <Input value={formData.aboutCtaTitle} onChange={e => setFormData({...formData, aboutCtaTitle: e.target.value})} placeholder="Join Africa's Energy Transformation" />
            </div>
            <div>
              <Label>CTA Subtitle</Label>
              <Textarea value={formData.aboutCtaSubtitle} onChange={e => setFormData({...formData, aboutCtaSubtitle: e.target.value})} rows={2} />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Agenda Page Configuration</h2>
          
          <div className="border p-4 rounded bg-gray-50 space-y-4">
            <h3 className="font-bold text-lg">1. Hero Section</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input value={formData.agendaHeroTitle} onChange={e => setFormData({...formData, agendaHeroTitle: e.target.value})} placeholder="Conference Schedule & Sessions" />
              </div>
              <div>
                <Label>Subtitle (Tagline)</Label>
                <Input value={formData.agendaHeroSubtitle} onChange={e => setFormData({...formData, agendaHeroSubtitle: e.target.value})} placeholder="NIES 2027 Agenda" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={formData.agendaHeroDesc} onChange={e => setFormData({...formData, agendaHeroDesc: e.target.value})} rows={2} />
            </div>
            <div>
              <Label>Hero Background Image</Label>
              <Input type="file" accept="image/*" onChange={e => e.target.files && setAgendaHeroFile(e.target.files[0])} />
            </div>
            <div>
              <Label className="font-bold text-blue-800">Download Brochure PDF</Label>
              <Input type="file" accept="application/pdf" onChange={e => e.target.files && setAgendaBrochureFile(e.target.files[0])} />
            </div>
          </div>

          <div className="border p-4 rounded bg-gray-50 space-y-4">
            <h3 className="font-bold text-lg">2. Agenda Content Section</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Section Title</Label>
                <Input value={formData.agendaSectionTitle} onChange={e => setFormData({...formData, agendaSectionTitle: e.target.value})} placeholder="Event Agenda" />
              </div>
              <div>
                <Label>Section Subtitle</Label>
                <Input value={formData.agendaSectionSubtitle} onChange={e => setFormData({...formData, agendaSectionSubtitle: e.target.value})} placeholder="Four days of transformative discussions..." />
              </div>
            </div>
            
            <div className="mt-4 border p-3 rounded bg-white">
              <Label>Number of Days to Display</Label>
              <Input type="number" min={1} max={7} value={formData.agendaDaysCount} onChange={e => setFormData({...formData, agendaDaysCount: Number(e.target.value)})} />
            </div>

            <div className="space-y-4 mt-4">
              {Array.from({ length: formData.agendaDaysCount }).map((_, i) => (
                <div key={i} className="space-y-2 border p-3 rounded bg-white">
                  <h4 className="font-bold text-blue-800 border-b pb-1">Day {i + 1}</h4>
                  <div className="grid md:grid-cols-3 gap-2">
                    <div>
                      <Label>Date (e.g. Feb 2)</Label>
                      <Input 
                        value={formData.agendaDays[i]?.date || ""} 
                        onChange={e => {
                          const newDays = [...formData.agendaDays];
                          newDays[i] = { ...newDays[i], date: e.target.value };
                          setFormData({...formData, agendaDays: newDays});
                        }} 
                      />
                    </div>
                    <div>
                      <Label>Short Title (e.g. Policy & Diplomacy)</Label>
                      <Input 
                        value={formData.agendaDays[i]?.title || ""} 
                        onChange={e => {
                          const newDays = [...formData.agendaDays];
                          newDays[i] = { ...newDays[i], title: e.target.value };
                          setFormData({...formData, agendaDays: newDays});
                        }} 
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input 
                        value={formData.agendaDays[i]?.location || ""} 
                        onChange={e => {
                          const newDays = [...formData.agendaDays];
                          newDays[i] = { ...newDays[i], location: e.target.value };
                          setFormData({...formData, agendaDays: newDays});
                        }} 
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Long Description Title</Label>
                    <Input 
                      value={formData.agendaDays[i]?.longTitle || ""} 
                      onChange={e => {
                        const newDays = [...formData.agendaDays];
                        newDays[i] = { ...newDays[i], longTitle: e.target.value };
                        setFormData({...formData, agendaDays: newDays});
                      }} 
                    />
                  </div>
                  
                  <div className="mt-4 border p-3 rounded bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-bold">Sessions for Day {i + 1}</Label>
                      <Button type="button" variant="outline" size="sm" onClick={() => {
                        const newDays = [...formData.agendaDays];
                        const day = newDays[i] || {};
                        const sessions = day.sessions || [];
                        newDays[i] = { ...day, sessions: [...sessions, { time: "", title: "", contentHtml: "" }] };
                        setFormData({...formData, agendaDays: newDays});
                      }}>
                        + Add Session
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {(formData.agendaDays[i]?.sessions || []).map((session: any, sIdx: number) => (
                        <div key={sIdx} className="border border-gray-200 p-3 rounded bg-white relative">
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm" 
                            className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => {
                              const newDays = [...formData.agendaDays];
                              newDays[i].sessions = newDays[i].sessions.filter((_: any, idx: number) => idx !== sIdx);
                              setFormData({...formData, agendaDays: newDays});
                            }}
                          >
                            ×
                          </Button>
                          <div className="grid md:grid-cols-2 gap-2 mb-2 pr-8">
                            <div>
                              <Label>Time (e.g. 8:00 AM - 9:00 AM)</Label>
                              <Input 
                                value={session.time || ""} 
                                onChange={e => {
                                  const newDays = [...formData.agendaDays];
                                  newDays[i].sessions[sIdx].time = e.target.value;
                                  setFormData({...formData, agendaDays: newDays});
                                }} 
                              />
                            </div>
                            <div>
                              <Label>Session Title</Label>
                              <Input 
                                value={session.title || ""} 
                                onChange={e => {
                                  const newDays = [...formData.agendaDays];
                                  newDays[i].sessions[sIdx].title = e.target.value;
                                  setFormData({...formData, agendaDays: newDays});
                                }} 
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Session Details (Accepts raw HTML for bullet points, bolding, etc.)</Label>
                            <Textarea 
                              value={session.contentHtml || ""} 
                              onChange={e => {
                                const newDays = [...formData.agendaDays];
                                newDays[i].sessions[sIdx].contentHtml = e.target.value;
                                setFormData({...formData, agendaDays: newDays});
                              }} 
                              rows={4}
                              placeholder="<ul><li>• <b>Speaker Name</b> - Role</li></ul>"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Sponsorship Page - Hero</h2>
          <div>
            <Label>Hero Tagline</Label>
            <Input value={formData.sponsorshipHeroTagline} onChange={e => setFormData({...formData, sponsorshipHeroTagline: e.target.value})} placeholder="NIES 2027 Sponsorship" />
          </div>
          <div>
            <Label>Hero Title</Label>
            <Input value={formData.sponsorshipHeroTitle} onChange={e => setFormData({...formData, sponsorshipHeroTitle: e.target.value})} placeholder="Partner With Us to Drive Energy Innovation" />
          </div>
          <div>
            <Label>Hero Description</Label>
            <Textarea value={formData.sponsorshipHeroDesc} onChange={e => setFormData({...formData, sponsorshipHeroDesc: e.target.value})} rows={3} />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Sponsorship Page - Partners Grid</h2>
          <div>
            <Label>Partners Title</Label>
            <Input value={formData.sponsorshipPartnersTitle} onChange={e => setFormData({...formData, sponsorshipPartnersTitle: e.target.value})} placeholder="Our Sponsors & Partners" />
          </div>
          <div>
            <Label>Partners Description</Label>
            <Textarea value={formData.sponsorshipPartnersDesc} onChange={e => setFormData({...formData, sponsorshipPartnersDesc: e.target.value})} rows={2} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-bold">Partner Logos</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setFormData({...formData, sponsorshipPartners: [...formData.sponsorshipPartners, { name: "", logoUrl: "" }]})}>
                + Add Partner
              </Button>
            </div>
            {formData.sponsorshipPartners.map((p: any, i: number) => (
              <div key={i} className="flex gap-4 items-end border p-3 rounded-lg relative">
                <div className="flex-1 space-y-2">
                  <Label>Partner Name</Label>
                  <Input value={p.name || ""} onChange={e => {
                    const newP = [...formData.sponsorshipPartners];
                    newP[i].name = e.target.value;
                    setFormData({...formData, sponsorshipPartners: newP});
                  }} />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Logo Image</Label>
                  <Input type="file" accept="image/*" onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setSponsorshipPartnerFiles({...sponsorshipPartnerFiles, [i]: e.target.files[0]});
                    }
                  }} />
                  {p.logoUrl && !sponsorshipPartnerFiles[i] && (
                    <img src={p.logoUrl} alt="Logo" className="h-8 object-contain" />
                  )}
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => {
                  const newP = formData.sponsorshipPartners.filter((_: any, idx: number) => idx !== i);
                  setFormData({...formData, sponsorshipPartners: newP});
                }}>Remove</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Sponsorship Page - Packages</h2>
          <div>
            <Label>Packages Title</Label>
            <Input value={formData.sponsorshipPackagesTitle} onChange={e => setFormData({...formData, sponsorshipPackagesTitle: e.target.value})} />
          </div>
          <div>
            <Label>Packages Description</Label>
            <Textarea value={formData.sponsorshipPackagesDesc} onChange={e => setFormData({...formData, sponsorshipPackagesDesc: e.target.value})} rows={2} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-bold">Packages List</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setFormData({...formData, sponsorshipPackages: [...formData.sponsorshipPackages, { name: "", subtitle: "", price: "", features: "", isPopular: false }]})}>
                + Add Package
              </Button>
            </div>
            {formData.sponsorshipPackages.map((pkg: any, i: number) => (
              <div key={i} className="space-y-3 border p-4 rounded-lg relative">
                <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full" onClick={() => {
                  const newPkgs = formData.sponsorshipPackages.filter((_: any, idx: number) => idx !== i);
                  setFormData({...formData, sponsorshipPackages: newPkgs});
                }}>×</Button>
                
                <div className="grid md:grid-cols-2 gap-4 pr-8">
                  <div>
                    <Label>Package Name</Label>
                    <Input value={pkg.name || ""} onChange={e => {
                      const newPkgs = [...formData.sponsorshipPackages];
                      newPkgs[i].name = e.target.value;
                      setFormData({...formData, sponsorshipPackages: newPkgs});
                    }} />
                  </div>
                  <div>
                    <Label>Price (e.g. $5,000)</Label>
                    <Input value={pkg.price || ""} onChange={e => {
                      const newPkgs = [...formData.sponsorshipPackages];
                      newPkgs[i].price = e.target.value;
                      setFormData({...formData, sponsorshipPackages: newPkgs});
                    }} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Subtitle / Short Description</Label>
                    <Input value={pkg.subtitle || ""} onChange={e => {
                      const newPkgs = [...formData.sponsorshipPackages];
                      newPkgs[i].subtitle = e.target.value;
                      setFormData({...formData, sponsorshipPackages: newPkgs});
                    }} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Features (Comma separated)</Label>
                    <Textarea value={pkg.features || ""} onChange={e => {
                      const newPkgs = [...formData.sponsorshipPackages];
                      newPkgs[i].features = e.target.value;
                      setFormData({...formData, sponsorshipPackages: newPkgs});
                    }} placeholder="Main Stage Branding, VIP Access, 10 Complimentary Passes" rows={3} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id={`popular-${i}`} checked={pkg.isPopular || false} onChange={e => {
                      const newPkgs = [...formData.sponsorshipPackages];
                      newPkgs[i].isPopular = e.target.checked;
                      setFormData({...formData, sponsorshipPackages: newPkgs});
                    }} />
                    <Label htmlFor={`popular-${i}`}>Highlight as "Most Popular"</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Sponsorship Page - Bottom CTA</h2>
          <div>
            <Label>CTA Title</Label>
            <Input value={formData.sponsorshipCtaTitle} onChange={e => setFormData({...formData, sponsorshipCtaTitle: e.target.value})} placeholder="Become a Sponsor" />
          </div>
          <div>
            <Label>CTA Description</Label>
            <Textarea value={formData.sponsorshipCtaDesc} onChange={e => setFormData({...formData, sponsorshipCtaDesc: e.target.value})} rows={2} />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold border-b pb-2">Business Settings</h2>
          <div>
            <Label>Contact Page Tagline</Label>
            <Input value={formData.contactPageTagline} onChange={e => setFormData({...formData, contactPageTagline: e.target.value})} placeholder="Get in touch" />
          </div>
          <div>
            <Label>Contact Page Title</Label>
            <Input value={formData.contactPageTitle} onChange={e => setFormData({...formData, contactPageTitle: e.target.value})} placeholder="Let's talk." />
          </div>
          <div>
            <Label>Contact Page Description</Label>
            <Textarea value={formData.contactPageDesc} onChange={e => setFormData({...formData, contactPageDesc: e.target.value})} rows={2} />
          </div>
          <div className="pt-4">
            <Label>Event Publishing Fee ($)</Label>
            <Input 
              type="number"
              step="0.01"
              value={formData.eventFee} 
              onChange={e => setFormData({...formData, eventFee: Number(e.target.value)})} 
            />
            <p className="text-xs text-gray-500 mt-1">Users pay this fee after publishing their first free event.</p>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#0F1A1C] mb-6">Email Configuration (SMTP)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">SMTP Host</Label>
                  <Input 
                    placeholder="e.g. smtp.gmail.com"
                    value={formData.smtpHost} 
                    onChange={e => setFormData(f => ({ ...f, smtpHost: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">SMTP Port</Label>
                  <Input 
                    placeholder="e.g. 587 or 465"
                    type="number"
                    value={formData.smtpPort} 
                    onChange={e => setFormData(f => ({ ...f, smtpPort: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">SMTP Username</Label>
                  <Input 
                    placeholder="e.g. you@gmail.com"
                    value={formData.smtpUser} 
                    onChange={e => setFormData(f => ({ ...f, smtpUser: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">SMTP Password</Label>
                  <Input 
                    type="password"
                    placeholder="Enter App Password or SMTP Password"
                    value={formData.smtpPass} 
                    onChange={e => setFormData(f => ({ ...f, smtpPass: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input 
                    type="checkbox" 
                    name="toggle" 
                    id="emailEnabled" 
                    checked={formData.emailEnabled}
                    onChange={e => setFormData(f => ({ ...f, emailEnabled: e.target.checked }))}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out z-10"
                    style={{
                      transform: formData.emailEnabled ? 'translateX(100%)' : 'translateX(0)',
                      borderColor: formData.emailEnabled ? '#00A86B' : '#E5E7EB'
                    }}
                  />
                  <label 
                    htmlFor="emailEnabled" 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${formData.emailEnabled ? 'bg-[#00A86B]' : 'bg-gray-200'}`}
                  ></label>
                </div>
                <Label htmlFor="emailEnabled" className="text-sm font-bold text-gray-700 cursor-pointer">
                  Enable Outbound Email Sending
                </Label>
                <span className="text-xs text-gray-500 ml-auto">
                  {formData.emailEnabled ? "Emails will be sent to applicants." : "No emails will be dispatched."}
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-[#00A86B] hover:bg-[#008753] text-white px-8 font-bold"
              >
                {saving ? "Saving..." : "Save All Settings"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

