import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { api } from "@/lib/api-client";

function AgendaSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <div className="w-full h-[60vh] min-h-[500px] bg-[#0F1A1C] flex flex-col items-start justify-center pt-16 px-6">
        <div className="w-full max-w-7xl mx-auto md:w-[70%] lg:w-[60%] mr-auto">
          <Skeleton className="h-10 w-48 mb-6 bg-white/20 rounded-full" />
          <Skeleton className="h-20 w-full mb-6 bg-white/20" />
          <Skeleton className="h-6 w-3/4 mb-10 bg-white/20" />
          <div className="flex gap-4">
            <Skeleton className="h-14 w-40 bg-white/20" />
            <Skeleton className="h-14 w-48 bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda — National Electricity Workshop (NIES)" },
      { name: "description", content: "Explore the comprehensive agenda for NIES 2027." },
    ],
  }),
  loader: async () => await api.getLandingData(),
  pendingComponent: AgendaSkeleton,
  component: AgendaPage,
});

function AgendaPage() {
  const { settings, scheduleItems } = Route.useLoaderData();
  const [activeDay, setActiveDay] = useState(1);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      
      {/* Hero Banner */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-16 bg-[#0F1A1C]">
        <div className="absolute inset-0 z-0">
          <img 
            src={settings?.agendaHeroImgUrl || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2000&q=80"} 
            alt="Agenda Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#008753]/80 via-[#0F1A1C]/90 to-[#0F1A1C]" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-white text-center md:text-left md:w-[70%] lg:w-[60%] mr-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] px-6 py-2 rounded-full text-sm font-bold border border-[#D4AF37]/30 mb-6 tracking-wide uppercase"
          >
            {settings?.agendaHeroSubtitle || "NIES 2027 Agenda"}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold font-sans text-white drop-shadow-lg leading-tight mb-6"
          >
            {settings?.agendaHeroTitle ? (
              <span dangerouslySetInnerHTML={{__html: settings.agendaHeroTitle.replace("Schedule", `<span class="text-[#D4AF37]">Schedule</span>`).replace("Sessions", `<span class="text-[#D4AF37]">Sessions</span>`)}} />
            ) : (
              <>Conference <br/> <span className="text-[#D4AF37]">Schedule & Sessions</span></>
            )}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg text-white/90 font-poppins mb-10 leading-relaxed max-w-xl mx-auto md:mx-0"
          >
            {settings?.agendaHeroDesc || "Explore the comprehensive agenda for NIES 2027, featuring keynote addresses, panel discussions, and technical sessions with global energy leaders."}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Button asChild size="lg" className="bg-[#0F1A1C] hover:bg-[#1A2A2E] text-white rounded-none px-8 py-6 uppercase tracking-wider text-sm font-bold shadow-lg transition-transform hover:-translate-y-1">
              <Link to="/registration">
                Register Now ➔
              </Link>
            </Button>
            {settings?.agendaBrochureUrl ? (
              <a href={settings.agendaBrochureUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="bg-[#D4AF37] border-transparent hover:bg-[#b08d24] text-[#0F1A1C] rounded-none px-8 py-6 uppercase tracking-wider text-sm font-bold transition-transform hover:-translate-y-1 shadow-lg">
                  Download Brochure 📄
                </Button>
              </a>
            ) : (
              <a href="#schedule-section">
                <Button variant="outline" size="lg" className="bg-transparent border-white/30 hover:bg-white/10 text-white rounded-none px-8 py-6 uppercase tracking-wider text-sm font-bold transition-transform hover:-translate-y-1">
                  View Agenda 📑
                </Button>
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section id="schedule-section" className="py-24 bg-[#FAFAFA] relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-sans text-[#0F1A1C] mb-4">
              {settings?.agendaSectionTitle ? (
                <span dangerouslySetInnerHTML={{__html: settings.agendaSectionTitle.replace("Agenda", `<span class="text-[#D4AF37]">Agenda</span>`)}} />
              ) : (
                <>Event <span className="text-[#D4AF37]">Agenda</span></>
              )}
            </h2>
            <p className="text-gray-600 text-lg font-poppins">
              {settings?.agendaSectionSubtitle || "Four days of transformative discussions, networking, and deal-making"}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          >
            {/* Tabs */}
            <div className="flex bg-[#008753] text-white overflow-x-auto">
              {Array.from({ length: settings?.scheduleDaysCount || 2 }).map((_, idx) => {
                const dayNum = idx + 1;
                return (
                  <button
                    key={dayNum}
                    onClick={() => setActiveDay(dayNum)}
                    className={`flex-1 min-w-[200px] py-4 px-4 flex flex-col items-center justify-center transition-all ${
                      activeDay === dayNum 
                        ? "bg-[#00A86B] border-b-[5px] border-[#D4AF37]" 
                        : "hover:bg-[#00A86B]/50 border-b-[5px] border-transparent"
                    }`}
                  >
                    <span className="font-bold text-lg whitespace-nowrap">Day {dayNum}</span>
                    <span className="text-xs font-semibold opacity-90 mt-1 uppercase tracking-wider text-center">Agenda</span>
                  </button>
                );
              })}
            </div>

            {/* Schedule Content */}
            <div className="p-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDay}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {(() => {
                    const currentItems = (scheduleItems || []).filter((item: any) => item.day === activeDay);
                    
                    if (currentItems.length > 0) {
                      return (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="bg-[#1A2A2E] text-white p-6 border-b border-gray-200">
                            <h3 className="font-bold text-xl text-[#D4AF37] uppercase tracking-wide mb-2">
                              Day {activeDay} Agenda
                            </h3>
                          </div>

                          {currentItems.map((session: any, sIdx: number) => (
                            <div key={sIdx} className="flex flex-col md:flex-row border-b border-gray-100 p-8 hover:bg-gray-50 transition-colors group">
                              <div className="md:w-56 flex-shrink-0 mb-4 md:mb-0">
                                <span className="text-[#008753] font-bold text-lg tracking-wide whitespace-nowrap">{session.timeRange}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-[19px] text-[#0F1A1C] group-hover:text-[#008753] transition-colors mb-4 leading-snug">
                                  {session.title}
                                </h4>
                                {session.speaker && (
                                  <div className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
                                    <span className="text-[#D4AF37]">👥</span> {session.speaker}
                                  </div>
                                )}
                                {session.description && (
                                  <div 
                                    className="space-y-4 text-gray-600 text-sm prose max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-[#0F1A1C]"
                                    dangerouslySetInnerHTML={{ __html: session.description }}
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    // Empty state fallback
                    return (
                      <div className="p-16 text-center animate-in fade-in slide-in-from-bottom-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">⏳</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#0F1A1C] mb-2">Detailed Schedule Coming Soon</h3>
                        <p className="text-gray-500">The agenda for Day {activeDay} is currently being finalized. Please check back shortly for full session details and speaker announcements.</p>
                      </div>
                    );
                  })()}
              
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          
          <div className="mt-12 text-center">
             <Button variant="outline" size="lg" className="border-2 border-[#008753] text-[#008753] hover:bg-[#008753] hover:text-white rounded-none px-10 py-6 font-bold uppercase transition-colors">
               Download Full Brochure PDF
             </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
