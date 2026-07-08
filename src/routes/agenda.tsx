import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda — National Electricity Workshop (NIES)" },
      { name: "description", content: "Explore the comprehensive agenda for NIES 2027." },
    ],
  }),
  component: AgendaPage,
});

function AgendaPage() {
  const [activeDay, setActiveDay] = useState(1);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      
      {/* Hero Banner */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-16 bg-[#0F1A1C]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2000&q=80" 
            alt="Agenda Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#008753]/80 via-[#0F1A1C]/90 to-[#0F1A1C]" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-white text-center md:text-left md:w-[70%] lg:w-[60%] mr-auto">
          <div className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] px-6 py-2 rounded-full text-sm font-bold border border-[#D4AF37]/30 mb-6 tracking-wide uppercase">
            NIES 2027 Agenda
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-sans text-white drop-shadow-lg leading-tight mb-6">
            Conference <br/> <span className="text-[#D4AF37]">Schedule & Sessions</span>
          </h1>
          <p className="text-lg text-white/90 font-poppins mb-10 leading-relaxed max-w-xl">
            Explore the comprehensive agenda for NIES 2027, featuring keynote addresses, panel discussions, and technical sessions with global energy leaders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/registration">
              <Button size="lg" className="bg-[#0F1A1C] hover:bg-[#1A2A2E] text-white rounded-none px-8 py-6 uppercase tracking-wider text-sm font-bold shadow-lg transition-transform hover:-translate-y-1">
                Register Now ➔
              </Button>
            </Link>
            <a href="#schedule-section">
              <Button variant="outline" size="lg" className="bg-transparent border-white/30 hover:bg-white/10 text-white rounded-none px-8 py-6 uppercase tracking-wider text-sm font-bold transition-transform hover:-translate-y-1">
                View Agenda 📑
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section id="schedule-section" className="py-24 bg-[#FAFAFA] relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-sans text-[#0F1A1C] mb-4">
              Event <span className="text-[#D4AF37]">Agenda</span>
            </h2>
            <p className="text-gray-600 text-lg font-poppins">
              Four days of transformative discussions, networking, and deal-making
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Tabs */}
            <div className="flex bg-[#008753] text-white overflow-x-auto">
              {[
                { day: 1, date: "Feb 2", title: "Policy & Diplomacy" },
                { day: 2, date: "Feb 3", title: "Investment & Strategy" },
                { day: 3, date: "Feb 4", title: "Technology & Innovation" },
                { day: 4, date: "Feb 5", title: "Closing & Site Visits" }
              ].map((tab) => (
                <button
                  key={tab.day}
                  onClick={() => setActiveDay(tab.day)}
                  className={`flex-1 min-w-[200px] py-4 px-4 flex flex-col items-center justify-center transition-all ${
                    activeDay === tab.day 
                      ? "bg-[#00A86B] border-b-[5px] border-[#D4AF37]" 
                      : "hover:bg-[#00A86B]/50 border-b-[5px] border-transparent"
                  }`}
                >
                  <span className="font-bold text-lg whitespace-nowrap">Day {tab.day} - {tab.date}</span>
                  <span className="text-xs font-semibold opacity-90 mt-1 uppercase tracking-wider text-center">{tab.title}</span>
                </button>
              ))}
            </div>

            {/* Schedule Content */}
            <div className="p-0">
              
              {/* Day 1 Content */}
              {activeDay === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-[#1A2A2E] text-white p-6 border-b border-gray-200">
                    <h3 className="font-bold text-xl text-[#D4AF37] uppercase tracking-wide mb-2">
                      Setting the Agenda: Local Content - Regional Energy - Policy & Diplomacy
                    </h3>
                    <p className="text-sm font-semibold opacity-80 flex items-center gap-2">
                      <span className="text-[#008753]">📍</span> International Conference Centre, Abuja
                    </p>
                  </div>

                  {/* Item 1 */}
                  <div className="flex flex-col md:flex-row border-b border-gray-100 p-8 hover:bg-gray-50 transition-colors group">
                    <div className="md:w-56 flex-shrink-0 mb-4 md:mb-0">
                      <span className="text-[#008753] font-bold text-lg tracking-wide whitespace-nowrap">8:00 AM - 9:00 AM</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[19px] text-[#0F1A1C] group-hover:text-[#008753] transition-colors mb-2">
                        Registration & Networking
                      </h4>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex flex-col md:flex-row border-b border-gray-100 p-8 hover:bg-gray-50 transition-colors group">
                    <div className="md:w-56 flex-shrink-0 mb-4 md:mb-0">
                      <span className="text-[#008753] font-bold text-lg tracking-wide whitespace-nowrap">9:15 AM - 9:30 AM</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[19px] text-[#0F1A1C] group-hover:text-[#008753] transition-colors mb-4">
                        Official Pre-Conference Opening
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-bold text-[#D4AF37] text-sm uppercase mb-1">Kickstarting Addresses:</h5>
                          <ul className="text-gray-600 text-sm space-y-1">
                            <li>• <span className="font-semibold text-gray-800">Mr. Paul Mervin</span> - Chairman, Brevity Anderson Limited</li>
                            <li>• <span className="font-semibold text-gray-800">Mrs. Patience N. Oyekunle</span> - Permanent Secretary, Ministry of Petroleum Resources</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-bold text-[#D4AF37] text-sm uppercase mb-1">Opening Remarks by:</h5>
                          <ul className="text-gray-600 text-sm space-y-1">
                            <li>• <span className="font-semibold text-gray-800">Sen. Heineken Lokpobiri (Ph.D)</span> - Honourable Minister of State, Ministry of Petroleum Resources (Oil)</li>
                            <li>• <span className="font-semibold text-gray-800">Rt. Hon. Ekperikpe Ekpo</span> - Honourable Minister of State, Ministry of Petroleum Resources (Gas)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Item 3 */}
                  <div className="flex flex-col md:flex-row border-b border-gray-100 p-8 hover:bg-gray-50 transition-colors group">
                    <div className="md:w-56 flex-shrink-0 mb-4 md:mb-0">
                      <span className="text-[#008753] font-bold text-lg tracking-wide whitespace-nowrap">9:30 AM - 10:30 AM</span>
                    </div>
                    <div className="flex-1">
                      <span className="inline-block bg-[#0F1A1C] text-[#D4AF37] text-xs font-bold uppercase px-3 py-1 mb-3">SESSION ONE - Local Content in Action</span>
                      <h4 className="font-bold text-[19px] text-[#0F1A1C] group-hover:text-[#008753] transition-colors mb-4 leading-snug">
                        Theme: Local Content Beyond Compliance: Building African Industrial Powerhouses
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-bold text-[#D4AF37] text-sm uppercase mb-1">Fireside Chat / Keynote Conversation</h5>
                          <ul className="text-gray-600 text-sm space-y-1">
                            <li>• <span className="font-semibold text-gray-800">Topic:</span> "Empowering African Energy Enterprises for Global Play"</li>
                            <li>• <span className="font-semibold text-gray-800">Guest:</span> Engr. Felix Omatsola Ogbe - Executive Secretary, NCDMB</li>
                            <li>• <span className="font-semibold text-gray-800">Host:</span> Ms. Joanna Mustapha - Senior Business Correspondent, News Central Television</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Day 2, 3, 4 Empty States */}
              {activeDay !== 1 && (
                <div className="p-16 text-center animate-in fade-in slide-in-from-bottom-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0F1A1C] mb-2">Detailed Schedule Coming Soon</h3>
                  <p className="text-gray-500">The agenda for Day {activeDay} is currently being finalized. Please check back shortly for full session details and speaker announcements.</p>
                </div>
              )}
              
            </div>
          </div>
          
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
