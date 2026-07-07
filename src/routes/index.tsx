import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const getLandingDataFn = createServerFn("GET", async () => {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  const events = await db.event.findMany({ orderBy: { date: 'desc' }, take: 3 });
  return { settings, events };
});

export const Route = createFileRoute("/")({
  loader: async () => await getLandingDataFn(),
  component: Index,
});

const TESTIMONIALS = [
  {
    quote: "ConferenceDirect has been an invaluable partner in managing our global events portfolio. Their expertise and strategic approach have saved us countless hours and significantly improved our event ROI.",
    author: "VP of Global Events",
    company: "Fortune 500 Technology Company"
  },
  {
    quote: "The level of service we receive is unmatched. From site selection to on-site management, the team acts as an extension of our own.",
    author: "Director of Meetings",
    company: "National Association"
  },
  {
    quote: "Partnering with ConferenceDirect was the best decision we made for our annual conference. They handled the complexities effortlessly.",
    author: "Chief Marketing Officer",
    company: "Leading Healthcare Provider"
  }
];

function Index() {
  const { settings, events } = Route.useLoaderData();
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover hidden md:block"
            poster="https://conferencedirect.com/wp-content/uploads/2023/03/cd-mobile-video-bg-globe-v1.jpg"
          >
            <source src="https://conferencedirect.com/wp-content/uploads/2023/04/CD-global-presence-slider-video-v3.mp4" type="video/mp4" />
          </video>
          <img
            src="https://conferencedirect.com/wp-content/uploads/2023/03/cd-mobile-video-bg-globe-v1.jpg"
            alt="Mobile background"
            className="w-full h-full object-cover md:hidden"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center text-white">
          <div className="h-[200px] md:h-[180px] flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.h1
                key={heroTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight"
              >
                {heroTexts[heroTextIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <Link to="/contact">
              <Button size="lg" className="bg-[#109cde] hover:bg-[#0d84bf] text-white rounded-md px-10 py-6 text-lg font-medium transition-all shadow-lg hover:shadow-xl">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition (Planners vs Suppliers) */}
      <section className="w-full grid md:grid-cols-2">
        {/* Planners */}
        <div className="relative group overflow-hidden min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://conferencedirect.com/wp-content/uploads/2026/01/ConferenceDirect-2026-bg-our_approach-v1.jpg" 
              alt="For Planners" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#263566]/80 transition-opacity duration-500 group-hover:bg-[#263566]/90" />
          </div>
          <div className="relative z-10 text-center text-white p-12 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">For Planners</h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              We partner with you to develop custom event strategies that align with your organizational goals. Our comprehensive services ensure every detail is meticulously managed.
            </p>
            <Link to="/about">
              <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white hover:text-[#263566] transition-colors rounded-none px-8 py-6 uppercase tracking-wider text-sm font-semibold">
                Services for Planners
              </Button>
            </Link>
          </div>
        </div>

        {/* Suppliers */}
        <div className="relative group overflow-hidden min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://conferencedirect.com/wp-content/uploads/2026/05/ConferenceDirect-2026-bg-suppliers-v1.jpg" 
              alt="For Suppliers" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#6096ba]/80 transition-opacity duration-500 group-hover:bg-[#6096ba]/90" />
          </div>
          <div className="relative z-10 text-center text-white p-12 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">For Suppliers</h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              We connect hotels, destinations, and event suppliers with thousands of highly qualified meeting professionals, helping you grow your group business and build lasting relationships.
            </p>
            <Link to="/about">
              <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white hover:text-[#6096ba] transition-colors rounded-none px-8 py-6 uppercase tracking-wider text-sm font-semibold">
                Supplier Partnerships
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#263566] mb-4">What Our Customers Say</h2>
            <div className="w-16 h-1 bg-[#109cde] rounded-full"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-14 border border-slate-100">
            <img 
              src="https://conferencedirect.com/wp-content/uploads/2023/02/quote-mark-light-blue-v1.png" 
              alt="Quote" 
              className="absolute top-8 left-8 w-12 opacity-30"
            />
            
            <div className="relative z-10 min-h-[150px] flex items-center justify-center text-center mt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-light italic mb-8">
                    "{TESTIMONIALS[testimonialIndex].quote}"
                  </p>
                  <div>
                    <h4 className="text-[#263566] font-bold text-lg">{TESTIMONIALS[testimonialIndex].author}</h4>
                    <span className="text-[#109cde] text-sm font-semibold tracking-wide uppercase">{TESTIMONIALS[testimonialIndex].company}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Carousel indicators */}
            <div className="flex justify-center gap-3 mt-10">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${idx === testimonialIndex ? 'bg-[#109cde]' : 'bg-slate-300 hover:bg-slate-400'}`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#263566] mb-4">Our Approach</h2>
            <div className="w-16 h-1 bg-[#109cde] rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="relative group overflow-hidden h-[400px] rounded-lg shadow-md cursor-pointer">
              <img 
                src="https://conferencedirect.com/wp-content/uploads/2026/01/ConferenceDirect-2026-bg-our_approach-v1.jpg" 
                alt="Event Strategy" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#263566]/90 via-[#263566]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-4">
                <h3 className="text-2xl font-bold text-white mb-2">Event Strategy</h3>
                <div className="w-8 h-1 bg-[#109cde] mb-4 transition-all duration-500 group-hover:w-16"></div>
                <p className="text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100 line-clamp-3">
                  Strategic design and planning to ensure your events meet your organizational objectives and deliver measurable ROI.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative group overflow-hidden h-[400px] rounded-lg shadow-md cursor-pointer">
              <img 
                src="https://conferencedirect.com/wp-content/uploads/2026/01/ConferenceDirect-2026-bg-event_logistics-v1.jpg" 
                alt="Event Logistics" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#263566]/90 via-[#263566]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-4">
                <h3 className="text-2xl font-bold text-white mb-2">Event Logistics</h3>
                <div className="w-8 h-1 bg-[#109cde] mb-4 transition-all duration-500 group-hover:w-16"></div>
                <p className="text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100 line-clamp-3">
                  Flawless execution from sourcing and contracting to registration, housing, and on-site management.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative group overflow-hidden h-[400px] rounded-lg shadow-md cursor-pointer">
              <img 
                src="https://conferencedirect.com/wp-content/uploads/2026/01/ConferenceDirect-2026-bg-event_tech-v1.jpg" 
                alt="Event Technology" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#263566]/90 via-[#263566]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-4">
                <h3 className="text-2xl font-bold text-white mb-2">Event Technology</h3>
                <div className="w-8 h-1 bg-[#109cde] mb-4 transition-all duration-500 group-hover:w-16"></div>
                <p className="text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100 line-clamp-3">
                  Innovative technological solutions that enhance the attendee experience and streamline event management processes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form CTA */}
      <section className="relative py-28 bg-[#263566] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://conferencedirect.com/wp-content/uploads/2026/01/ConferenceDirect-2026-bg-perfect-partnership-v2.jpg" 
            alt="Perfect Partnership" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Need More Information?</h2>
          <p className="text-xl text-white/80 mb-10 font-light">
            Contact us today to discover how we can help you achieve your event goals.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-[#109cde] hover:bg-white hover:text-[#263566] text-white rounded-md px-10 py-7 text-lg font-bold transition-colors shadow-lg">
              Services Inquiry Form
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

