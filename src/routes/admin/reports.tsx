import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F1A1C] mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-[#00A86B]" />
          Analytics & Reports
        </h1>
        <p className="text-gray-500">
          Generate attendance, financial, and engagement reports.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Reporting Engine Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          The reporting dashboard is currently under development. Soon you will be able to export CSV and PDF reports for your events.
        </p>
      </div>
    </div>
  );
}
