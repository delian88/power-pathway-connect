import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

function SponsorshipSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <div className="w-full h-[50vh] min-h-[500px] bg-gray-900 flex flex-col items-center justify-center pt-16">
        <Skeleton className="h-10 w-64 mb-6 bg-white/20 rounded-full" />
        <Skeleton className="h-20 w-3/4 max-w-3xl mb-6 bg-white/20" />
        <Skeleton className="h-6 w-1/2 max-w-2xl mb-10 bg-white/20" />
        <div className="flex gap-4">
          <Skeleton className="h-14 w-48 bg-white/20" />
          <Skeleton className="h-14 w-48 bg-white/20" />
        </div>
      </div>
    </div>
  );
}

import { api } from "@/lib/api-client";

export const Route = createFileRoute("/sponsorship")({
  head: () => ({
    meta: [
      { title: "Sponsorship — National Electricity Workshop (NIES)" },
      { name: "description", content: "Partner With Us to Drive Energy Innovation" },
    ],
  }),
  loader: async () => await api.getSiteSettings(),
  pendingComponent: SponsorshipSkeleton,
  component: SponsorshipPage,
});

function SponsorshipPage() {
  const settings = Route.useLoaderData();
  const partners = Array.isArray(settings?.sponsorshipPartners) ? settings.sponsorshipPartners : [];
  
  // Default packages if none exist
  const defaultPackages = [
    {
      name: "Platinum Package",
      price: "",
      subtitle: "Premium positioning and maximum brand visibility",
      isPopular: true,
      features: "Main Stage Branding, Keynote Speaking Slot, Exclusive VIP Access, Lead Generation Tech, Dedicated Meeting Room"
    },
    {
      name: "Gold Package",
      price: "",
      subtitle: "Excellent visibility and comprehensive branding",
      isPopular: false,
      features: "Plenary Session Sponsorship, Exhibition Booth, VIP Access, 15 Complimentary Passes, Digital Marketing Package"
    },
    {
      name: "Silver Package",
      price: "",
      subtitle: "Strategic visibility and networking platform",
      isPopular: false,
      features: "Dedicated Session Hosting, Exhibition Space, Networking Reception, Branding in Event App, 10 Complimentary Passes, Digital Promotion"
    },
    {
      name: "Bronze Package",
      price: "",
      subtitle: "Essential visibility and partnership recognition",
      isPopular: false,
      features: "Standard Exhibition Space, Networking Opportunities, Logo in Event Materials, Digital Recognition, 5 Complimentary Passes, Email Marketing Inclusion"
    }
  ];
  
  const packages = Array.isArray(settings?.sponsorshipPackages) && settings.sponsorshipPackages.length > 0
    ? settings.sponsorshipPackages
    : defaultPackages;

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <SiteHeader />
      
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-16 bg-[#008753]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#008753] to-[#006B42]" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-white text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] px-6 py-2 rounded-full text-sm font-bold border border-[#D4AF37]/30 mb-6 tracking-wide uppercase"
          >
            {settings?.sponsorshipHeroTagline || "NIES 2027 Sponsorship"}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold font-sans text-white drop-shadow-lg leading-tight mb-6 max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: settings?.sponsorshipHeroTitle || `Partner With Us to Drive <span class="text-[#D4AF37]">Energy Innovation</span>` }}
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 font-poppins mb-10 leading-relaxed max-w-3xl mx-auto"
          >
            {settings?.sponsorshipHeroDesc || "Join leading organizations and brands in supporting the Nigeria International Energy Summit 2027. Gain visibility, network with industry leaders, and showcase your commitment to shaping Africa's energy future."}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="mailto:contact@nies.gov.ng">
              <Button size="lg" className="bg-[#D4AF37] hover:bg-[#E8C257] text-[#0F1A1C] hover:text-[#0F1A1C] rounded-none px-8 py-6 uppercase tracking-wider text-sm font-bold shadow-lg transition-transform hover:-translate-y-1">
                Become A Sponsor
              </Button>
            </a>
            <Button variant="outline" size="lg" className="bg-transparent border-white/30 hover:bg-white/10 text-white rounded-none px-8 py-6 uppercase tracking-wider text-sm font-bold transition-transform hover:-translate-y-1">
              Enter Sponsors Code
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Sponsors & Partners Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1A1C] mb-4">{settings?.sponsorshipPartnersTitle || "Our Sponsors & Partners"}</h2>
            <p className="text-gray-500 font-poppins max-w-2xl mx-auto">{settings?.sponsorshipPartnersDesc || "Leading organizations driving Africa's energy transformation through strategic partnerships."}</p>
          </div>
          {partners.length > 0 ? (
            <div className="space-y-12 mt-12">
              {Object.entries(
                partners.reduce((acc: any, p: any) => {
                  const cat = p.category || 'Partner';
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(p);
                  return acc;
                }, {})
              ).map(([category, items]: [string, any]) => (
                <div key={category} className="mb-10">
                  <h3 className="text-2xl font-bold text-center text-[#D4AF37] mb-8 uppercase tracking-widest">{category}</h3>
                  <div className="flex flex-wrap justify-center gap-8">
                    {items.map((partner: any, idx: number) => (
                      <div key={idx} className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#008753] hover:shadow-md transition-all w-56 h-40">
                        {partner.logo ? (
                          <img src={partner.logo} alt={partner.name || `Partner ${idx+1}`} className="max-h-20 max-w-full object-contain mb-4" />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
                        )}
                        <span className="text-sm font-semibold text-gray-700 text-center">{partner.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full overflow-hidden mt-8 relative">
              {/* Fade gradients for smooth edge transition */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
              
              <motion.div 
                className="flex w-max items-center gap-16 pr-16"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 25, repeat: Infinity }}
              >
                {(() => {
                  const baseLogos = [
                    "/sponsor-1.png", "/sponsor-2.png", "/sponsor-3.png", "/sponsor-4.png", "/sponsor-5.png",
                    "/sponsor-6.png", "/sponsor-7.png", "/sponsor-8.png", "/sponsor-9.png", "/sponsor-10.png",
                    "/sponsor-11.png", "/sponsor-12.png", "/sponsor-13.png", "/sponsor-14.png"
                  ];
                  const duplicatedLogos = [...baseLogos, ...baseLogos];
                  return duplicatedLogos.map((url, i) => (
                    <div key={i} className="flex-shrink-0 flex items-center justify-center p-4 h-28 w-48 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#008753] hover:shadow-sm transition-all cursor-pointer">
                      <img src={url} alt={`Partner ${i+1}`} className="max-h-20 max-w-full object-contain" />
                    </div>
                  ));
                })()}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Custom Sponsorship Details */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#0F1A1C] mb-6 font-sans">Why Sponsor the Workshop?</h2>
            <div className="text-gray-600 leading-relaxed font-poppins space-y-4 whitespace-pre-wrap">
              Your organisation will have the opportunity to:
              <br/>• Position itself as a leading partner in Nigeria's electricity sector reforms.
              <br/>• Engage directly with Federal and State Government decision-makers.
              <br/>• Showcase products, services and innovative energy solutions.
              <br/>• Build relationships with investors and development partners.
              <br/>• Generate high-value business leads.
              <br/>• Enhance corporate visibility through national media exposure.
              <br/>• Demonstrate commitment to sustainable energy development.
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#0F1A1C] mb-6 font-sans">Sponsorship Packages</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-2">PLATINUM SPONSOR</h3>
                <h4 className="font-bold text-gray-800 mb-2">Benefits</h4>
                <div className="text-gray-600 leading-relaxed font-poppins">
                  • Recognition as Platinum Sponsor
                  <br/>• Opportunity to deliver a goodwill address during the Opening Ceremony
                  <br/>• Executive speaking opportunity during a technical session (subject to programme approval)
                  <br/>• Premium exhibition space
                  <br/>• Corporate logo on all event branding and publicity materials
                  <br/>• Logo on participant bags, banners and backdrop
                  <br/>• Full-page advertisement in the Workshop Brochure
                  <br/>• Branding on delegate materials and certificates
                  <br/>• Corporate promotional video played during breaks
                  <br/>• Opportunity to distribute promotional materials
                  <br/>• Recognition in all press releases
                  <br/>• Featured interview during media engagements
                  <br/>• Five (5) complimentary delegate passes
                  <br/>• VIP seating for senior executives
                  <br/>• Post-event recognition in the Workshop Report
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">GOLD SPONSOR</h3>
                <h4 className="font-bold text-gray-800 mb-2">Benefits</h4>
                <div className="text-gray-600 leading-relaxed font-poppins">
                  • Recognition as Gold Sponsor
                  <br/>• Premium exhibition booth
                  <br/>• Logo on all major event branding materials
                  <br/>• Half-page advertisement in the Workshop Brochure
                  <br/>• Opportunity to distribute corporate materials
                  <br/>• Recognition during Opening and Closing Ceremonies
                  <br/>• Logo on Workshop website and digital platforms
                  <br/>• Corporate branding on selected Workshop materials
                  <br/>• Three (3) complimentary delegate passes
                  <br/>• VIP seating for senior representatives
                  <br/>• Recognition in the Workshop Report
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-500 mb-2">SILVER SPONSOR</h3>
                <h4 className="font-bold text-gray-800 mb-2">Benefits</h4>
                <div className="text-gray-600 leading-relaxed font-poppins">
                  • Recognition as Silver Sponsor
                  <br/>• Standard exhibition booth
                  <br/>• Logo on event banners and promotional materials
                  <br/>• Quarter-page advertisement in the Workshop Brochure
                  <br/>• Opportunity to display corporate promotional materials
                  <br/>• Recognition during the Closing Ceremony
                  <br/>• Corporate logo on Workshop website
                  <br/>• Two (2) complimentary delegate passes
                  <br/>• Inclusion in the Workshop Report
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#0F1A1C] mb-6 font-sans">Branding Opportunities</h2>
            <div className="text-gray-600 leading-relaxed font-poppins space-y-4 whitespace-pre-wrap">
              Sponsors will enjoy visibility through:
              <br/>• National Media Coverage
              <br/>• Television Interviews
              <br/>• Newspaper Publications
              <br/>• Digital Media Campaigns
              <br/>• Social Media Promotions
              <br/>• Event Backdrops
              <br/>• Conference Brochure
              <br/>• Delegate Packs
              <br/>• Exhibition Area
              <br/>• Workshop Website
              <br/>• Event Photography and Video Documentation
              <br/>• Post-event Report
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#0F1A1C] mb-6 font-sans">Expected Outcomes</h2>
            <div className="text-gray-600 leading-relaxed font-poppins space-y-4 whitespace-pre-wrap">
              The Workshop will produce:
              <br/>• Improved understanding of the Electricity Act 2023.
              <br/>• Practical implementation roadmaps for State electricity markets.
              <br/>• Enhanced collaboration between Federal and State Governments.
              <br/>• Increased private sector participation.
              <br/>• New investment partnerships.
              <br/>• Strengthened policy dialogue.
              <br/>• National Communiqué with actionable recommendations.
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#0F1A1C] mb-6 font-sans">Partner With Us</h2>
            <div className="text-gray-600 leading-relaxed font-poppins space-y-4 whitespace-pre-wrap">
              This Workshop presents a unique opportunity for your organisation to contribute to the transformation of Nigeria's electricity sector while positioning your brand at the forefront of one of the country's most significant policy reforms.

              We invite your organisation to become a strategic partner in this landmark national initiative under the auspices of the Office of the Vice President.

              <span className="font-bold block mt-6">All payments should be made to the following account details</span>
              ................................................................
              <br/>................................................................

              <span className="font-bold block mt-6">For Sponsorship Enquiries</span>
              Allstates Management Partners Solutions Limited
              <br/>Office of the Vice President
              <br/>................................................................

              <span className="block mt-6">We look forward to partnering with you in empowering States and accelerating sustainable electricity sector development in Nigeria.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Packages */}
      <section id="sponsorship-packages" className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-sans text-[#0F1A1C] mb-4" dangerouslySetInnerHTML={{ __html: settings?.sponsorshipPackagesTitle || `Sponsorship <span class="text-[#D4AF37]">Packages</span>` }} />
            <p className="text-gray-600 text-lg font-poppins max-w-2xl mx-auto">
              {settings?.sponsorshipPackagesDesc || "Choose the package that best fits your organization's goals and maximize your impact"}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {packages.map((pkg: any, index: number) => {
              const isPop = pkg.isPopular === true || pkg.isPopular === "true";
              const featuresList = pkg.features ? pkg.features.split(",").map((s: string) => s.trim()) : [];
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-white rounded-2xl p-8 relative transition-transform hover:-translate-y-2 ${isPop ? 'border-2 border-[#D4AF37] shadow-lg' : 'border border-gray-200 shadow-sm hover:shadow-md'}`}
                >
                  {isPop && (
                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#D4AF37] text-white px-4 py-1 font-bold text-sm uppercase rounded-full shadow-md">
                      Most Popular
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-3xl font-bold text-[#0F1A1C] font-sans">{pkg.name}</h3>
                    {pkg.price && <span className="text-xl font-bold text-[#008753]">{pkg.price}</span>}
                  </div>
                  <p className="text-gray-500 mb-6 font-poppins text-sm">{pkg.subtitle}</p>
                  
                  <ul className="space-y-4 mb-8">
                    {featuresList.map((feature: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-[#008753] mt-1">✔</span> {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button variant={isPop ? "default" : "outline"} className={`w-full rounded-none py-6 uppercase tracking-wider text-sm font-bold ${isPop ? 'bg-[#008753] hover:bg-[#006B42] text-white' : 'border-2 border-[#0F1A1C] text-[#0F1A1C] hover:bg-[#0F1A1C] hover:text-white transition-colors'}`}>
                    {isPop ? "Inquire Now" : "Get Started"}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-[#0F1A1C] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#008753] rounded-full blur-[200px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37] rounded-full blur-[200px] opacity-10 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold font-sans text-white mb-6" dangerouslySetInnerHTML={{ __html: settings?.sponsorshipCtaTitle || `Become a <span class="text-[#D4AF37]">Sponsor</span>` }} />
          <p className="text-white/80 text-lg font-poppins mb-10 max-w-2xl mx-auto leading-relaxed">
            {settings?.sponsorshipCtaDesc || "Join industry leaders in shaping Africa's energy future. Limited sponsorship opportunities available."}
          </p>
          <a href="mailto:contact@nies.gov.ng">
            <Button size="lg" className="bg-[#008753] hover:bg-[#006B42] text-white rounded-none px-12 py-7 uppercase tracking-wider font-bold text-lg shadow-xl transition-transform hover:-translate-y-1">
              Contact Organiser
            </Button>
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
