import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { api } from "@/lib/api-client";

function AboutSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <div className="w-full h-[60vh] min-h-[500px] bg-gray-900 flex flex-col items-center justify-center pt-16">
        <Skeleton className="h-10 w-64 mb-6 bg-white/20 rounded-full" />
        <Skeleton className="h-20 w-3/4 max-w-2xl mb-6 bg-white/20" />
        <Skeleton className="h-6 w-1/2 max-w-xl mb-10 bg-white/20" />
        <Skeleton className="h-14 w-40 bg-white/20" />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — National Electricity Workshop (NIES)" },
      { name: "description", content: "Learn about the mission behind the Nigeria International Energy Summit (NIES)." },
    ],
  }),
  loader: async () => await api.getSiteSettings(),
  pendingComponent: AboutSkeleton,
  component: About,
});

function About() {
  const settings = Route.useLoaderData();
  
  const renderSection = (title: string, text: string | undefined | null, defaultText: string) => (
    <div className="mb-16">
      <h2 className="text-3xl md:text-4xl font-bold font-sans text-[#0F1A1C] mb-6 border-b-2 border-[#D4AF37] pb-4 inline-block">{title}</h2>
      <div className="text-gray-700 font-poppins leading-relaxed whitespace-pre-wrap text-lg">
        {text || defaultText}
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0F1A1C]">
          <img 
            src={settings?.aboutHeroImgUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80"} 
            alt="About Hero" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A1C] via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] px-6 py-2 rounded-full text-sm font-bold border border-[#D4AF37]/30 mb-6 tracking-wide uppercase"
          >
            {settings?.aboutHeroBadgeText || "The Global Platform for Stimulating Discussion"}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-sans"
          >
            {settings?.aboutHeroTitle ? (
              <span dangerouslySetInnerHTML={{__html: settings.aboutHeroTitle.replace("NIES", `<span class="text-[#D4AF37]">NIES</span>`)}} />
            ) : (
              <>About <span className="text-[#D4AF37]">NIES</span></>
            )}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 font-poppins max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {settings?.aboutHeroSubtitle || "The Nigeria International Energy Summit (NIES) is the official energy event of the Federal Government of Nigeria, endorsed at the highest level of the Federal Executive Council."}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/registration">
              <Button className="bg-[#008753] hover:bg-[#006B42] text-white rounded-none px-8 py-6 uppercase tracking-wider text-sm font-bold shadow-lg transition-transform hover:-translate-y-1">
                Register Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Extra Workshop Details */}
      <section className="py-24 bg-[#FAFAFA] border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          {renderSection(
            "About the Workshop",
            settings?.aboutWorkshopText,
            "The Electricity Act 2023 has fundamentally transformed Nigeria's electricity sector by empowering State Governments to establish, regulate and operate electricity markets within their respective jurisdictions. This landmark legislation presents unprecedented opportunities for investment, infrastructure development, public-private partnerships, renewable energy deployment and improved electricity access across Nigeria.\n\nThe 2-Day National Workshop on the Electricity Act 2023 (As Amended) has been designed as a high-level national capacity-building platform to provide practical guidance to States on implementing the provisions of the Act and developing viable electricity markets.\n\nThe Workshop will convene policymakers, regulators, investors, development partners, electricity companies, financial institutions and industry experts to share knowledge, explore investment opportunities and develop practical implementation roadmaps for State electricity markets."
          )}
          {renderSection(
            "Target Participants",
            settings?.aboutTargetParticipantsText,
            "The Workshop is expected to attract over 300 high-level participants, including:\n• The Presidency\n• Federal Ministry of Power\n• Nigerian Governors' Forum\n• Governors and Deputy Governors\n• Commissioners responsible for Energy, Power and Infrastructure\n• State Electricity Regulatory Commissions\n• Nigerian Electricity Regulatory Commission (NERC)\n• Nigerian Independent System Operator (NISO)\n• Rural Electrification Agency (REA)\n• Generation Companies (GenCos)\n• Distribution Companies (DisCos)\n• Renewable Energy Developers\n• Commercial Banks\n• Development Finance Institutions\n• International Development Partners\n• Energy Investors\n• Manufacturing Companies\n• Legal and Regulatory Experts\n• Academia and Industry Associations"
          )}
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-sans text-[#0F1A1C] mb-4">
              {settings?.aboutMissionTitle ? (
                <span dangerouslySetInnerHTML={{__html: settings.aboutMissionTitle.replace("Mission & Vision", `<span class="text-[#D4AF37]">Mission & Vision</span>`)}} />
              ) : (
                <>Our <span className="text-[#D4AF37]">Mission & Vision</span></>
              )}
            </h2>
            <p className="text-gray-500 text-lg font-poppins">
              {settings?.aboutMissionSubtitle || "Guiding principles that shape the Nigeria International Energy Summit"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#FAFAFA] p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-[#008753]/10 text-[#008753] rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-3xl font-bold text-[#0F1A1C] mb-4 font-sans">{settings?.aboutMissionCardTitle || "Our Mission"}</h3>
              <p className="text-gray-600 font-poppins leading-relaxed whitespace-pre-wrap">
                {settings?.aboutMissionCardDesc || "To be Africa's leading platform for energy dialogue, policy development, and investment, uniting global stakeholders to address the continent's energy challenges and opportunities. We foster strategic partnerships, highlight innovation, and advance sustainable energy development through high-level engagement and thought leadership."}
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#FAFAFA] p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h3 className="text-3xl font-bold text-[#0F1A1C] mb-4 font-sans">{settings?.aboutVisionCardTitle || "Our Vision"}</h3>
              <p className="text-gray-600 font-poppins leading-relaxed whitespace-pre-wrap">
                {settings?.aboutVisionCardDesc || "To be the definitive catalyst for Africa's energy transformation, fostering sustainable economic growth, energy security, and environmental stewardship through collaborative action and innovative solutions. We envision an Africa where energy serves as the foundation for prosperity, industrialization, and improved quality of life for all its people."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Venues Section */}
      <section className="py-24 bg-[#0F1A1C] relative text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#008753] rounded-full blur-[150px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-[150px] opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-sans text-white mb-4">
              {settings?.aboutVenuesTitle ? (
                <span dangerouslySetInnerHTML={{__html: settings.aboutVenuesTitle.replace("Venues", `<span class="text-[#D4AF37]">Venues</span>`)}} />
              ) : (
                <>Event <span className="text-[#D4AF37]">Venues</span></>
              )}
            </h2>
            <p className="text-white/80 text-lg font-poppins">
              {settings?.aboutVenuesSubtitle || "Experience NIES 2027 at these prestigious locations"}
            </p>
          </div>

          <div className={`grid gap-8 mb-12 ${
            (settings?.aboutVenues?.length || 2) === 1 ? 'md:grid-cols-1 max-w-3xl mx-auto' : 
            (settings?.aboutVenues?.length || 2) === 2 ? 'md:grid-cols-2' : 
            'md:grid-cols-3'
          }`}>
            {(settings?.aboutVenues?.length ? settings.aboutVenues : [
              {
                title: "Presidential Banquet Hall",
                location: "Aso Villa, Abuja, Nigeria",
                desc: "The prestigious Presidential Banquet Hall will host the official opening ceremony of NIES 2027, featuring keynote addresses by the President of Nigeria and other dignitaries.",
                imgUrl: "https://images.unsplash.com/photo-1577977699317-5e94b29bb804?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Bola Ahmed Tinubu ICC",
                location: "Central Business District, Abuja, Nigeria",
                desc: "The state-of-the-art Bola Ahmed Tinubu International Conference Centre will host the main conference sessions, exhibition, and networking events.",
                imgUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80"
              }
            ]).map((venue: any, idx: number) => (
              <div key={idx} className="bg-[#1A2A2E] rounded-2xl overflow-hidden border border-[#008753]/30 shadow-lg group">
                <div className="h-56 overflow-hidden relative">
                  <img src={venue.imgUrl || "https://images.unsplash.com/photo-1577977699317-5e94b29bb804?auto=format&fit=crop&w=800&q=80"} alt={venue.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A2E] to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2 font-sans">{venue.title || "Venue Name"}</h3>
                  <p className="text-[#D4AF37] text-sm font-semibold mb-4 flex items-center gap-2">
                    <span>📍</span> {venue.location || "Venue Location"}
                  </p>
                  <p className="text-gray-300 font-poppins leading-relaxed">
                    {venue.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-[#008753] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-sans text-white mb-6">
            {settings?.aboutCtaTitle ? (
              <span dangerouslySetInnerHTML={{__html: settings.aboutCtaTitle.replace("Transformation", `<span class="text-[#D4AF37]">Transformation</span>`)}} />
            ) : (
              <>Join Africa's Energy <span className="text-[#D4AF37]">Transformation</span></>
            )}
          </h2>
          <p className="text-white/90 text-lg md:text-xl font-poppins mb-10 leading-relaxed">
            {settings?.aboutCtaSubtitle || "Connect with ministers, global industry leaders, and innovators shaping the future of African energy. Registration for NIES 2027 is now open with limited delegate slots available."}
          </p>
          <Link to="/registration">
            <Button size="lg" className="bg-[#D4AF37] hover:bg-[#E8C257] text-[#0F1A1C] hover:text-[#0F1A1C] rounded-none px-12 py-7 font-bold text-lg shadow-xl transition-transform hover:-translate-y-1">
              Register Now
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}