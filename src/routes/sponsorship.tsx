import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sponsorship")({
  head: () => ({
    meta: [
      { title: "Sponsorship — National Electricity Workshop (NIES)" },
      { name: "description", content: "Partner With Us to Drive Energy Innovation" },
    ],
  }),
  component: SponsorshipPage,
});

function SponsorshipPage() {
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
          <div className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] px-6 py-2 rounded-full text-sm font-bold border border-[#D4AF37]/30 mb-6 tracking-wide uppercase">
            NIES 2027 Sponsorship
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-sans text-white drop-shadow-lg leading-tight mb-6 max-w-4xl mx-auto">
            Partner With Us to Drive <span className="text-[#D4AF37]">Energy Innovation</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-poppins mb-10 leading-relaxed max-w-3xl mx-auto">
            Join leading organizations and brands in supporting the Nigeria International Energy Summit 2027. Gain visibility, network with industry leaders, and showcase your commitment to shaping Africa's energy future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#sponsorship-packages">
              <Button size="lg" className="bg-[#D4AF37] hover:bg-[#E8C257] text-[#0F1A1C] hover:text-[#0F1A1C] rounded-none px-8 py-6 uppercase tracking-wider text-sm font-bold shadow-lg transition-transform hover:-translate-y-1">
                Become A Sponsor
              </Button>
            </a>
            <Button variant="outline" size="lg" className="bg-transparent border-white/30 hover:bg-white/10 text-white rounded-none px-8 py-6 uppercase tracking-wider text-sm font-bold transition-transform hover:-translate-y-1">
              Enter Sponsors Code
            </Button>
          </div>
        </div>
      </section>

      {/* Sponsors & Partners Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1A1C] mb-4">Our Sponsors & Partners</h2>
            <p className="text-gray-500 font-poppins max-w-2xl mx-auto">Leading organizations driving Africa's energy transformation through strategic partnerships.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Placeholder Logos (using generic shapes or text for now) */}
             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="flex items-center justify-center p-4 h-24 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#008753] hover:shadow-sm transition-all cursor-pointer">
                  <span className="font-bold text-gray-400 text-sm">PARTNER {i}</span>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Packages */}
      <section id="sponsorship-packages" className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-sans text-[#0F1A1C] mb-4">
              Sponsorship <span className="text-[#D4AF37]">Packages</span>
            </h2>
            <p className="text-gray-600 text-lg font-poppins max-w-2xl mx-auto">
              Choose the package that best fits your organization's goals and maximize your impact
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Platinum */}
            <div className="bg-white border-2 border-[#D4AF37] rounded-2xl p-8 relative shadow-lg hover:-translate-y-2 transition-transform">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#D4AF37] text-white px-4 py-1 font-bold text-sm uppercase rounded-full shadow-md">
                Most Popular
              </div>
              <h3 className="text-3xl font-bold text-[#0F1A1C] mb-2 font-sans">Platinum Package</h3>
              <p className="text-gray-500 mb-6 font-poppins text-sm">Premium positioning and maximum brand visibility</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Main Stage Branding
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Keynote Speaking Slot
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Exclusive VIP Access
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Full Page in Event Guide
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> 20 Complimentary Passes
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Dedicated Exhibition Space
                </li>
              </ul>
              
              <Button className="w-full bg-[#0F1A1C] hover:bg-[#1A2A2E] text-white rounded-none py-6 font-bold uppercase tracking-wider text-sm">
                Get Started
              </Button>
            </div>

            {/* Gold */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:-translate-y-2 transition-transform hover:shadow-lg">
              <h3 className="text-3xl font-bold text-[#0F1A1C] mb-2 font-sans">Gold Package</h3>
              <p className="text-gray-500 mb-6 font-poppins text-sm">High-impact visibility and strategic networking</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Premium Exhibition Space
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Panel Discussion Opportunity
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> VIP Networking Access
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Half Page in Event Guide
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> 15 Complimentary Passes
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Digital Marketing Package
                </li>
              </ul>
              
              <Button variant="outline" className="w-full border-2 border-[#0F1A1C] text-[#0F1A1C] hover:bg-[#0F1A1C] hover:text-white rounded-none py-6 font-bold uppercase tracking-wider text-sm transition-colors">
                Get Started
              </Button>
            </div>

            {/* Silver */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:-translate-y-2 transition-transform hover:shadow-lg">
              <h3 className="text-3xl font-bold text-[#0F1A1C] mb-2 font-sans">Silver Package</h3>
              <p className="text-gray-500 mb-6 font-poppins text-sm">Strategic visibility and networking platform</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Dedicated Session Hosting
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Exhibition Space
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Networking Reception
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Branding in Event App
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> 10 Complimentary Passes
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Digital Promotion
                </li>
              </ul>
              
              <Button variant="outline" className="w-full border-2 border-[#0F1A1C] text-[#0F1A1C] hover:bg-[#0F1A1C] hover:text-white rounded-none py-6 font-bold uppercase tracking-wider text-sm transition-colors">
                Get Started
              </Button>
            </div>

            {/* Bronze */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:-translate-y-2 transition-transform hover:shadow-lg">
              <h3 className="text-3xl font-bold text-[#0F1A1C] mb-2 font-sans">Bronze Package</h3>
              <p className="text-gray-500 mb-6 font-poppins text-sm">Essential visibility and partnership recognition</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Standard Exhibition Space
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Networking Opportunities
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Logo in Event Materials
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Digital Recognition
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> 5 Complimentary Passes
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#008753] mt-1">✔</span> Email Marketing Inclusion
                </li>
              </ul>
              
              <Button variant="outline" className="w-full border-2 border-[#0F1A1C] text-[#0F1A1C] hover:bg-[#0F1A1C] hover:text-white rounded-none py-6 font-bold uppercase tracking-wider text-sm transition-colors">
                Get Started
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-[#0F1A1C] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#008753] rounded-full blur-[200px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37] rounded-full blur-[200px] opacity-10 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold font-sans text-white mb-6">
            Become a <span className="text-[#D4AF37]">Sponsor</span>
          </h2>
          <p className="text-white/80 text-lg font-poppins mb-10 max-w-2xl mx-auto leading-relaxed">
            Join industry leaders in shaping Africa's energy future. Limited sponsorship opportunities available.
          </p>
          <a href="#sponsorship-packages">
            <Button size="lg" className="bg-[#008753] hover:bg-[#006B42] text-white rounded-none px-12 py-7 uppercase tracking-wider font-bold text-lg shadow-xl transition-transform hover:-translate-y-1">
              View Sponsorship Packages
            </Button>
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
