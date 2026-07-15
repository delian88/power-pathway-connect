import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { ImageIcon, UploadCloud, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const getGalleryImagesFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const images = await db.$queryRaw`SELECT * FROM GalleryImage ORDER BY createdAt DESC`;
    return JSON.parse(JSON.stringify(images));
  } catch (e) {
    console.error("Failed to fetch gallery images", e);
    return [];
  }
});

export const uploadImageFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const crypto = await import("crypto");

      let finalUrl = "";
      if (data.base64 && data.fileName) {
        const base64Data = data.base64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const publicDir = path.join(process.cwd(), 'public', 'gallery');
        
        // Ensure unique filename
        const ext = path.extname(data.fileName);
        const name = path.basename(data.fileName, ext);
        const uniqueName = `${name}-${Date.now()}${ext}`;
        const filePath = path.join(publicDir, uniqueName);
        
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, buffer);
        finalUrl = `/gallery/${uniqueName}`;
      } else {
        throw new Error("No image data provided");
      }

      // Insert into DB using raw query to bypass any un-generated Prisma types
      const id = crypto.randomUUID();
      await db.$executeRaw`INSERT INTO GalleryImage (id, url, caption, createdAt) VALUES (${id}, ${finalUrl}, ${data.caption || null}, NOW())`;

      return { success: true, url: finalUrl };
    } catch (error: any) {
      console.error("Upload error:", error);
      return { success: false, error: error.message };
    }
  });

export const deleteImageFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    try {
      const fs = await import("fs");
      const path = await import("path");

      // We need to fetch the URL first to delete the file, but we can just delete from DB
      // and optionally try to delete from disk if we have the URL passed.
      if (data.url) {
        const publicDir = path.join(process.cwd(), 'public');
        const filePath = path.join(publicDir, data.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await db.$executeRaw`DELETE FROM GalleryImage WHERE id = ${data.id}`;
      return { success: true };
    } catch (e) {
      console.error("Delete error:", e);
      return { success: false };
    }
  });

export const Route = createFileRoute("/admin/gallery")({
  loader: async () => await getGalleryImagesFn(),
  component: GalleryPage,
});

function GalleryPage() {
  const initialImages = Route.useLoaderData() || [];
  const router = useRouter();
  
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image to upload.");
      return;
    }

    setUploading(true);
    
    // Convert to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await uploadImageFn({
          data: {
            base64,
            fileName: file.name,
            caption
          }
        });
        
        if (res.success) {
          toast.success("Image uploaded to gallery!");
          setFile(null);
          setCaption("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          router.invalidate();
        } else {
          toast.error("Failed to upload image: " + res.error);
        }
      } catch (err) {
        toast.error("An unexpected error occurred.");
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
      setUploading(false);
    };
  };

  const handleDelete = async (id: string, url: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      const res = await deleteImageFn({ data: { id, url } });
      if (res.success) {
        toast.success("Image deleted.");
        router.invalidate();
      } else {
        toast.error("Failed to delete image.");
      }
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F1A1C] mb-2 flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-[#00A86B]" />
          Event Gallery
        </h1>
        <p className="text-gray-500">
          Upload and manage photos from past events to display on the public site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-[#0F1A1C] mb-6 border-b border-gray-100 pb-4">
            Upload New Image
          </h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Select Image</Label>
              <div 
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="text-sm font-semibold text-[#00A86B] break-all">{file.name}</div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Click to browse or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Caption (Optional)</Label>
              <Input 
                placeholder="e.g. Keynote Speaker 2026"
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              disabled={uploading || !file}
              className="w-full bg-[#00A86B] hover:bg-[#008753] text-white font-bold h-12 flex items-center gap-2"
            >
              {uploading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
              ) : (
                <><UploadCloud className="w-5 h-5" /> Upload Image</>
              )}
            </Button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="lg:col-span-2">
          {initialImages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
              <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-1">Gallery is Empty</h3>
              <p className="text-gray-500">Upload your first image using the form.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {initialImages.map((img: any) => (
                <div key={img.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-square">
                  <img 
                    src={img.url} 
                    alt={img.caption || "Gallery Image"} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleDelete(img.id, img.url)}
                        className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {img.caption && (
                      <div className="text-white text-sm font-semibold truncate bg-black/40 backdrop-blur-sm p-2 rounded">
                        {img.caption}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
