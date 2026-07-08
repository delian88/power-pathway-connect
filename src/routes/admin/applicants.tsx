import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { Users, Mail, Phone, Building, Calendar } from "lucide-react";

export const getApplicantsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const applicants = await db.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: { event: { select: { title: true } } }
    });
    return JSON.parse(JSON.stringify(applicants));
  } catch (e) {
    console.error("Failed to fetch applicants", e);
    return [];
  }
});

export const Route = createFileRoute("/admin/applicants")({
  loader: async () => await getApplicantsFn(),
  component: ApplicantsPage,
});

function ApplicantsPage() {
  const applicants = Route.useLoaderData();

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F1A1C] mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-[#00A86B]" />
          Event Applicants
        </h1>
        <p className="text-gray-500">
          View all registered attendees across all events.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700">Applicant Name</th>
                <th className="px-6 py-4 font-bold text-gray-700">Contact Details</th>
                <th className="px-6 py-4 font-bold text-gray-700">Organization</th>
                <th className="px-6 py-4 font-bold text-gray-700">Registered Event</th>
                <th className="px-6 py-4 font-bold text-gray-700">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No applicants have registered yet.
                  </td>
                </tr>
              ) : (
                applicants.map((app: any) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#0F1A1C]">{app.fullName}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Mail className="w-3.5 h-3.5" /> {app.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="w-3.5 h-3.5" /> {app.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Building className="w-4 h-4 text-gray-400" /> {app.organization}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {app.event?.title || "Unknown Event"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(app.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </div>
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
