import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import fs from "fs";
import path from "path";

export const getSettingsFn = createServerFn("GET", async () => {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  return settings;
});

export const updateSettingsFn = createServerFn("POST", async (data: any) => {
  let finalLogoUrl = data.logoUrl;

  // If a file was uploaded as base64, save it to the public directory
  if (data.logoBase64 && data.logoFileName) {
    try {
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

  const updated = await db.siteSettings.upsert({
    where: { id: 1 },
    update: {
      heroText: data.heroText,
      heroSubText: data.heroSubText,
      logoUrl: finalLogoUrl,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
    },
    create: {
      id: 1,
      heroText: data.heroText,
      heroSubText: data.heroSubText,
      logoUrl: finalLogoUrl,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      address: data.address,
    }
  });

  return updated;
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
  });

  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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

      await updateSettingsFn({
        ...formData,
        logoBase64,
        logoFileName,
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
          <h2 className="text-xl font-semibold border-b pb-2">Hero Section</h2>
          <div>
            <Label>Hero Main Text</Label>
            <Input 
              value={formData.heroText} 
              onChange={e => setFormData({...formData, heroText: e.target.value})} 
            />
          </div>
          <div>
            <Label>Hero Sub Text</Label>
            <Textarea 
              value={formData.heroSubText} 
              onChange={e => setFormData({...formData, heroSubText: e.target.value})} 
              rows={3}
            />
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

        <Button type="submit" disabled={saving} className="w-full bg-[#109cde] hover:bg-[#0d84bf] text-white">
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
