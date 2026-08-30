import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getReportsFn,
  createReportFn,
  updateReportFn,
  deleteReportFn
} from "@/lib/server-functions";

export const Route = createFileRoute("/admin/reports")({
  component: ReportsPage,
  loader: async () => {
    return {
      reports: await getReportsFn()
    };
  }
});

function ReportsPage() {
  const { reports: initialReports } = Route.useLoaderData();
  const [reports, setReports] = useState(initialReports || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    year: "",
    title: "",
    description: "",
    size: "",
    fileUrl: ""
  });

  const handleOpenModal = (report?: any) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        year: report.year,
        title: report.title,
        description: report.description,
        size: report.size,
        fileUrl: report.fileUrl
      });
    } else {
      setEditingReport(null);
      setFormData({ year: "", title: "", description: "", size: "", fileUrl: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReport(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReport) {
        await updateReportFn({ data: { id: editingReport.id, ...formData } });
        toast.success("Report updated successfully");
      } else {
        await createReportFn({ data: formData });
        toast.success("Report created successfully");
      }
      handleCloseModal();
      
      const updatedReports = await getReportsFn();
      setReports(updatedReports);
      router.invalidate();
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReportFn({ data: { id } });
        toast.success("Report deleted successfully");
        
        const updatedReports = await getReportsFn();
        setReports(updatedReports);
        router.invalidate();
      } catch (error) {
        toast.error("An error occurred while deleting");
      }
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F1A1C] mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#008753]" />
            Reports Management
          </h1>
          <p className="text-gray-500">
            Manage the Workshop Outcomes reports available for download.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-[#008753] hover:bg-[#00683f] flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Report
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
            <tr>
              <th className="p-4 font-medium">Year</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Size</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No reports added yet. Click "Add Report" to get started.
                </td>
              </tr>
            ) : (
              reports.map((report: any) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium">{report.year}</td>
                  <td className="p-4 font-semibold text-[#0F1A1C]">{report.title}</td>
                  <td className="p-4 text-sm text-gray-600 max-w-[300px] truncate">{report.description}</td>
                  <td className="p-4 text-sm"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{report.size}</span></td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenModal(report)} className="h-8 border-gray-200">
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(report.id)} className="h-8 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingReport ? 'Edit Report' : 'Add New Report'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Year (e.g. 2023)</Label>
                  <Input required value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>File Size (e.g. 4.2 MB)</Label>
                  <Input required value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Report Title</Label>
                <Input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>File URL (Link to PDF)</Label>
                <Input required type="url" value={formData.fileUrl} onChange={e => setFormData({ ...formData, fileUrl: e.target.value })} />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" className="bg-[#008753] hover:bg-[#00683f] text-white">
                  {editingReport ? 'Save Changes' : 'Create Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
