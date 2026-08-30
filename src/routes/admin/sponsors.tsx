import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  getSponsorCodesFn,
  createSponsorCodeFn,
  updateSponsorCodeFn,
  deleteSponsorCodeFn
} from "@/lib/server-functions";

export const Route = createFileRoute("/admin/sponsors")({
  component: SponsorsPage,
  loader: async () => {
    return {
      codes: await getSponsorCodesFn()
    };
  }
});

function SponsorsPage() {
  const { codes: initialCodes } = Route.useLoaderData();
  const [codes, setCodes] = useState(initialCodes || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<any>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: "",
    sponsorName: "",
    package: "",
    logoUrl: "",
    status: "active"
  });

  const openModal = (code: any = null) => {
    if (code) {
      setEditingCode(code);
      setFormData({
        code: code.code,
        sponsorName: code.sponsorName,
        package: code.package,
        logoUrl: code.logoUrl || "",
        status: code.status || "active"
      });
    } else {
      setEditingCode(null);
      setFormData({
        code: "",
        sponsorName: "",
        package: "",
        logoUrl: "",
        status: "active"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCode) {
        await updateSponsorCodeFn({ data: { id: editingCode.id, ...formData } });
        toast.success("Sponsor code updated");
      } else {
        await createSponsorCodeFn({ data: formData });
        toast.success("Sponsor code created");
      }
      setIsModalOpen(false);
      
      const updated = await getSponsorCodesFn();
      setCodes(updated);
      router.invalidate();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save sponsor code");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this sponsor code?")) {
      try {
        await deleteSponsorCodeFn({ data: { id } });
        toast.success("Sponsor code deleted");
        const updated = await getSponsorCodesFn();
        setCodes(updated);
        router.invalidate();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete sponsor code");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sponsor Codes</h1>
          <p className="text-gray-500 mt-1">Manage sponsor verification codes</p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Code
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Sponsor Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Code</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Package</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {codes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <ShieldCheck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>No sponsor codes found.</p>
                </td>
              </tr>
            ) : (
              codes.map((code: any) => (
                <tr key={code.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{code.sponsorName}</div>
                    {code.logoUrl && <div className="text-xs text-gray-500 truncate max-w-[200px]">{code.logoUrl}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-mono">{code.code}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{code.package}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${code.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {code.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openModal(code)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(code.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold">
                {editingCode ? "Edit Sponsor Code" : "Add Sponsor Code"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Sponsor Name</Label>
                <Input
                  required
                  value={formData.sponsorName}
                  onChange={(e) => setFormData({ ...formData, sponsorName: e.target.value })}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. PLATINUM-2027"
                />
              </div>
              <div className="space-y-2">
                <Label>Package</Label>
                <Input
                  required
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                  placeholder="e.g. Platinum Package"
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCode ? "Save Changes" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
