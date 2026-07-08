import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { getLandingDataFn } from "@/lib/server-functions";

export const Route = createFileRoute("/")({
  loader: async () => await getLandingDataFn(),
  component: Index,
});

const TESTIMONIALS = [
  {
    quote: "National Electricity workshop has been an invaluable partner in managing our global events portfolio. Their expertise and strategic approach have saved us countless hours and significantly improved our event ROI.",
    author: "VP of Global Events",
    company: "Fortune 500 Technology Company"
  },
  {
    quote: "The level of service we receive is unmatched. From site selection to on-site management, the team acts as an extension of our own.",
    author: "Director of Meetings",
    company: "National Association"
  },
  {
    quote: "Partnering with National Electricity workshop was the best decision we made for our annual conference. They handled the complexities effortlessly.",
    author: "Chief Marketing Officer",
    company: "Leading Healthcare Provider"
  }
];

function Index() {
  const { settings, events } = Route.useLoaderData();
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const heroTexts = [
    settings?.heroText || "Powering the future together",
    settings?.heroSubText || "Premier events and workshops for utility leaders, grid engineers, and energy innovators shaping the national electricity landscape."
  ];

  const [heroBgIndex, setHeroBgIndex] = useState(0);

  const heroMedia = [
    { type: 'image', src: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1920&q=80', alt: 'Illuminated light bulbs representing power and ideas' }, 
    { type: 'image', src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80', alt: 'Global electricity network and glowing earth' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80', alt: 'Event stage with bright lights and crowd' }, 
    { type: 'image', src: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1920&q=80', alt: 'Abstract glowing lights and data transmission' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80', alt: 'Technology circuit board with electric glow' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setHeroBgIndex((prev) => (prev + 1) % heroMedia.length);
    }, 5000);
    return () => clearInterval(bgInterval);
  }, [heroMedia.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    if (!events || events.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [events?.length]);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0F1A1C]">
          <AnimatePresence>
            {heroMedia.map((media, idx) => (
              idx === heroBgIndex && (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {media.type === 'video' ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-80"
                      poster="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1920&q=80"
                    >
                      <source src={media.src} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={media.src}
                      alt={media.alt}
                      className="w-full h-full object-cover opacity-80"
                    />
                  )}
                </motion.div>
              )
            ))}
          </AnimatePresence>
          {/* Green/Dark overlay for summit aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#008753]/90 via-[#008753]/60 to-[#000000]/70 z-10" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 text-white text-left">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-5 py-2 rounded-full font-semibold text-sm mb-6">
                <span>👑</span> Africa's Premier Energy Event
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-[70px] font-bold leading-[1.1] text-white font-sans drop-shadow-lg mb-6"
            >
              Shaping the Future of <br />
              <span className="text-[#D4AF37]">African Energy</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 max-w-2xl font-poppins"
            >
              Join global energy leaders, policymakers, and innovators at Africa's most influential energy gathering. Drive investment, forge partnerships, and transform the continent's energy landscape.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/registration">
              <Button size="lg" className="bg-black hover:bg-black/90 text-white rounded px-8 py-7 text-base font-bold transition-all flex items-center gap-2">
                Register Now <span className="text-xl">➔</span>
              </Button>
            </Link>
            <Link to="/sponsorship">
              <Button size="lg" variant="outline" className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 rounded px-8 py-7 text-base font-bold transition-all flex items-center gap-2">
                Become a Sponsor <span className="text-xl">🤝</span>
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
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80" 
              alt="For Planners" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#008753]/90 transition-opacity duration-500 group-hover:bg-[#006B42]/95" />
          </div>
          <div className="relative z-10 text-center text-white p-12 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-sans">For Planners</h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed font-poppins">
              We partner with you to develop custom event strategies that align with your organizational goals. Our comprehensive services ensure every detail is meticulously managed.
            </p>
            <Link to="/about">
              <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white hover:text-[#008753] transition-colors rounded-none px-8 py-6 uppercase tracking-wider text-sm font-semibold border-2">
                Services for Planners
              </Button>
            </Link>
          </div>
        </div>

        {/* Suppliers */}
        <div className="relative group overflow-hidden min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1573165231977-3f0e27806045?auto=format&fit=crop&w=1000&q=80" 
              alt="For Suppliers" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#0F1A1C]/90 transition-opacity duration-500 group-hover:bg-[#1A2A2E]/95" />
          </div>
          <div className="relative z-10 text-center text-white p-12 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-sans">For Suppliers</h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed font-poppins">
              We connect hotels, destinations, and event suppliers with thousands of highly qualified meeting professionals, helping you grow your group business and build lasting relationships.
            </p>
            <Link to="/about">
              <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white hover:text-[#0F1A1C] transition-colors rounded-none px-8 py-6 uppercase tracking-wider text-sm font-semibold border-2">
                Supplier Partnerships
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events (Auto Sliding) */}
      {events && events.length > 0 && (
        <section className="py-24 bg-[#0F1A1C] text-white overflow-hidden relative border-t-[6px] border-[#D4AF37]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#008753] rounded-full blur-[120px] opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-[120px] opacity-10 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 font-sans text-white">Featured Events</h2>
                <div className="w-24 h-1.5 bg-[#D4AF37]"></div>
              </div>
              <p className="text-gray-400 max-w-sm mt-6 md:mt-0 font-poppins text-lg">Discover some of the most anticipated gatherings and workshops in the industry.</p>
            </div>

            <div className="relative min-h-[450px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full"
                >
                  {events[featuredIndex] && (
                    <div className="flex flex-col md:flex-row bg-[#1A2A2E] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#008753]/20 h-full group">
                      <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                        <img 
                          src={events[featuredIndex].imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80"} 
                          alt={events[featuredIndex].title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A2E] via-transparent to-transparent md:bg-gradient-to-r" />
                        <div className="absolute top-4 left-4">
                           <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-[#0F1A1C] shadow-lg">
                            Featured {events[featuredIndex].type === 'conference' ? 'Conference' : 'Workshop'}
                          </span>
                        </div>
                      </div>
                      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white font-sans leading-tight">{events[featuredIndex].title}</h3>
                        <p className="text-[#D4AF37] font-semibold mb-6 flex items-center gap-2 text-lg">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {new Date(events[featuredIndex].date).toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-slate-300 leading-relaxed mb-8 line-clamp-4 text-lg">
                          {events[featuredIndex].description}
                        </p>
                        <Link to="/events/$slug" params={{ slug: events[featuredIndex].slug }} className="mt-auto inline-block">
                          <Button size="lg" className="bg-[#D4AF37] hover:bg-[#E8C257] text-[#0F1A1C] hover:text-[#0F1A1C] rounded-none px-10 py-6 font-bold shadow-lg transition-transform hover:-translate-y-1">
                            View Event Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Dots */}
            <div className="flex justify-center gap-3 mt-12 relative z-20">
              {events.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setFeaturedIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${idx === featuredIndex ? 'bg-[#D4AF37]' : 'bg-[#008753]/30 hover:bg-[#008753]'}`}
                  aria-label={`Go to featured event ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-24 bg-[#F8F9FA] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F1A1C] mb-4 font-sans">What Our Customers Say</h2>
            <div className="w-24 h-1.5 bg-[#008753]"></div>
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
                  <p className="text-xl md:text-3xl text-gray-700 leading-relaxed font-light italic mb-10 font-poppins px-4 md:px-12">
                    "{TESTIMONIALS[testimonialIndex].quote}"
                  </p>
                  <div>
                    <h4 className="text-[#0F1A1C] font-bold text-xl">{TESTIMONIALS[testimonialIndex].author}</h4>
                    <span className="text-[#008753] text-sm font-semibold tracking-wide uppercase">{TESTIMONIALS[testimonialIndex].company}</span>
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

      {/* Upcoming Events */}
      {events && events.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#263566] mb-4">Upcoming Events & Workshops</h2>
              <div className="w-16 h-1 bg-[#109cde] rounded-full mx-auto"></div>
            </div>
            <div className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {events.map((ev: any) => (
                <div key={ev.id} className="min-w-[300px] md:min-w-[380px] snap-center">
                  <Link to="/events/$slug" params={{ slug: ev.slug }} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow h-full">
                    {ev.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ev.type === 'conference' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {ev.type === 'conference' ? 'Conference' : 'Workshop'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#263566] mb-2 group-hover:text-[#109cde] transition-colors">{ev.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{new Date(ev.date).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-gray-600 line-clamp-3 mb-6 flex-1">{ev.description}</p>
                      <span className="text-[#109cde] font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Details <span aria-hidden="true">&rarr;</span>
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Post Your Event CTA */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#263566] mb-6">Host Your Own Event?</h2>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Reach thousands of highly qualified professionals by listing your event with us. Whether it's a workshop, seminar, or large-scale conference, we provide the platform for you to succeed and connect with the right audience.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-[#109cde] hover:bg-[#0d84bf] text-white rounded-md px-10 py-6 text-lg font-medium transition-all shadow-lg hover:shadow-xl">
              Post Your Event Now
            </Button>
          </Link>
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
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80" 
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
                src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=800&q=80" 
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
                src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=800&q=80" 
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
            src="https://images.unsplash.com/photo-1573165067006-259166f21226?auto=format&fit=crop&w=1920&q=80" 
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

