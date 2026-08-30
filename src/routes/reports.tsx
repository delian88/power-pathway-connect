import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { motion } from "framer-motion";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
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
        <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-12 border border-gray-100 min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <h2 className="text-3xl font-bold text-[#0F1A1C] mb-6">Workshop Outcomes</h2>
            <p className="text-gray-500 font-poppins text-lg leading-relaxed">
              Download comprehensive reports detailing the insights, statistics, and major takeaways from our previous editions.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
