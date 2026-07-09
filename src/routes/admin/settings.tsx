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

    const payload = {
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
      ...(data.whyAttendCard1ImgUrl && { whyAttendCard1ImgUrl: data.whyAttendCard1ImgUrl }),
      ...(data.whyAttendCard2ImgUrl && { whyAttendCard2ImgUrl: data.whyAttendCard2ImgUrl }),
      ...(data.whyAttendCard3ImgUrl && { whyAttendCard3ImgUrl: data.whyAttendCard3ImgUrl }),
      ...(data.ourApproachCard1ImgUrl && { ourApproachCard1ImgUrl: data.ourApproachCard1ImgUrl }),
      ...(data.ourApproachCard2ImgUrl && { ourApproachCard2ImgUrl: data.ourApproachCard2ImgUrl }),
      ...(data.ourApproachCard3ImgUrl && { ourApproachCard3ImgUrl: data.ourApproachCard3ImgUrl }),
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
    ourApproachCard2Title: settings?.ourApproachCard2Title || "",
    ourApproachCard2Desc: settings?.ourApproachCard2Desc || "",
    ourApproachCard3Title: settings?.ourApproachCard3Title || "",
    ourApproachCard3Desc: settings?.ourApproachCard3Desc || "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [sliderFiles, setSliderFiles] = useState<FileList | null>(null);
  const [featuredSpeakerFiles, setFeaturedSpeakerFiles] = useState<{ [key: number]: File }>({});
  const [ourApproachCard1File, setOurApproachCard1File] = useState<File | null>(null);
  const [ourApproachCard2File, setOurApproachCard2File] = useState<File | null>(null);
  const [ourApproachCard3File, setOurApproachCard3File] = useState<File | null>(null);
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

      await updateSettingsFn({
        data: {
          ...formData,
          featuredSpeakers: updatedSpeakers,
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

        <div className="space-y-4 pt-4">
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
          <h2 className="text-xl font-semibold border-b pb-2">Business Settings</h2>
          <div>
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

