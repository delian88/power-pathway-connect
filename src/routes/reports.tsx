import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { motion } from "framer-motion";
import { getReportsFn } from "@/lib/server-functions";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
  loader: async () => {
    return {
      reports: await getReportsFn()
    };
  }
});

function ReportsPage() {
  const { reports } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <SiteHeader />
      
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0 bg-[#0F1A1C]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1A1C]/90 via-[#0F1A1C]/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#008753]/40 via-transparent to-transparent z-10 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold font-sans text-white drop-shadow-lg"
          >
            Post Event Reports
          </motion.h1>
          <div className="w-24 h-1.5 bg-[#D4AF37] mt-6"></div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[#0F1A1C] mb-6">Workshop Outcomes</h2>
          <p className="text-gray-500 font-poppins text-lg leading-relaxed">
            Download comprehensive reports detailing the insights, statistics, and major takeaways from our previous editions.
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No reports have been published yet. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report: any, i: number) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 flex flex-col group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#008753]/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110" />
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[#D4AF37] font-bold text-xl">{report.year}</span>
                  <span className="text-xs font-medium bg-[#f0f7f4] text-[#008753] px-3 py-1 rounded-full">{report.size}</span>
                </div>
                
                <h3 className="text-xl font-bold text-[#0F1A1C] mb-3 group-hover:text-[#008753] transition-colors">{report.title}</h3>
                <p className="text-gray-600 mb-8 flex-grow text-sm leading-relaxed">{report.description}</p>
                
                <a 
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#f8f9fa] hover:bg-[#008753] text-[#0F1A1C] hover:text-white rounded-lg font-medium transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  Download PDF
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
