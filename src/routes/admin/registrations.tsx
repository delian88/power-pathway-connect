import { createFileRoute, useRouter } from "@tanstack/react-router";
import { getRegistrationsFn } from "@/lib/server-functions";
import { format } from "date-fns";
import { Users, Mail, Phone, Briefcase, Download, Search, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/admin/registrations")({
  loader: async () => {
    return await getRegistrationsFn();
  },
  component: RegistrationsPage,
});

function RegistrationsPage() {
  const registrations = Route.useLoaderData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setUpdatingId(id);
    try {
      const { updateRegistrationStatusFn } = await import("@/lib/server-functions");
      await updateRegistrationStatusFn({ data: { id, status: "APPROVED" } });
      router.invalidate();
    } catch (e) {
      console.error(e);
      alert("Failed to approve registration");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRegistrations = registrations.filter((r: any) => 
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F1A1C] flex items-center gap-3">
            <Users className="w-8 h-8 text-[#008753]" />
            Event Registrations
          </h1>
          <p className="text-gray-500 mt-2">Manage and view all event delegates.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input 
              placeholder="Search delegates..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredRegistrations.length} registrations
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-sm font-semibold text-gray-600">
                <th className="pb-4 pt-2 px-4">Delegate Name</th>
                <th className="pb-4 pt-2 px-4">Contact</th>
                <th className="pb-4 pt-2 px-4">Organization & Role</th>
                <th className="pb-4 pt-2 px-4">Ticket Type</th>
                <th className="pb-4 pt-2 px-4">Registered Date</th>
                <th className="pb-4 pt-2 px-4">Status</th>
                <th className="pb-4 pt-2 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg: any) => (
                  <tr key={reg.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#0F1A1C]">{reg.firstName} {reg.lastName}</div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Mail className="w-3 h-3" />
                        {reg.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-3 h-3" />
                        {reg.phone}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <div className="font-semibold text-gray-800 flex items-center gap-2">
                        <Briefcase className="w-3 h-3" />
                        {reg.organization}
                      </div>
                      <div className="text-gray-500 ml-5">{reg.jobTitle}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/10 text-[#b08d24] border border-[#D4AF37]/20">
                        {reg.ticketType}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {format(new Date(reg.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        reg.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {reg.status === 'PENDING' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                          onClick={() => handleApprove(reg.id)}
                          disabled={updatingId === reg.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {updatingId === reg.id ? "Approving..." : "Approve"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
