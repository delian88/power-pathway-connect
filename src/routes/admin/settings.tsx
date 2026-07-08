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

    const updated = await db.siteSettings.upsert({
      where: { id: 1 },
      update: {
        heroText: data.heroText,
        heroSubText: data.heroSubText,
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
      },
      create: {
        id: 1,
        heroText: data.heroText,
        heroSubText: data.heroSubText,
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
      }
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
        data: {
          ...formData,
          logoBase64,
          logoFileName,
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
