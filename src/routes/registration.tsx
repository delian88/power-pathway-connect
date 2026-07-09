import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { motion } from "framer-motion";
import { useState } from "react";
export const Route = createFileRoute("/registration")({
  component: RegistrationPage,
});

function RegistrationPage() {
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
            Registration
          </motion.h1>
          <div className="w-24 h-1.5 bg-[#D4AF37] mt-6"></div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0F1A1C] mb-4">Secure Your Spot</h2>
            <p className="text-gray-500 font-poppins text-lg">
              Fill out the form below to register for the 2-DAY NATIONAL WORKSHOP ON THE ELECTRICITY ACT 2023.
            </p>
          </div>

          <RegistrationForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    jobTitle: "",
    ticketType: "Regular Delegate"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { submitRegistrationFn } = await import("@/lib/server-functions");
      await submitRegistrationFn({ data: formData });
      setSuccess(true);
    } catch (error) {
      console.error("Failed to submit registration", error);
      alert("Failed to submit registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-[#0F1A1C] mb-4">Registration Successful!</h3>
        <p className="text-gray-600 font-poppins mb-8">
          Thank you for registering for the 2-DAY NATIONAL WORKSHOP ON THE ELECTRICITY ACT 2023. We have received your details and our team will be in touch with you shortly.
        </p>
        <button 
          onClick={() => { setSuccess(false); setFormData({ firstName: "", lastName: "", email: "", phone: "", organization: "", jobTitle: "", ticketType: "Regular Delegate" }); }}
          className="bg-[#008753] hover:bg-[#007045] text-white px-8 py-3 rounded-none font-bold tracking-wide transition-colors"
        >
          Register Another Person
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">First Name <span className="text-red-500">*</span></label>
          <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753]" placeholder="Jane" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Last Name <span className="text-red-500">*</span></label>
          <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753]" placeholder="Doe" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Email Address <span className="text-red-500">*</span></label>
          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753]" placeholder="jane@company.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
          <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753]" placeholder="+234..." />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Organization / Company <span className="text-red-500">*</span></label>
          <input required type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753]" placeholder="Energy Corp" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Job Title <span className="text-red-500">*</span></label>
          <input required type="text" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753]" placeholder="Director of Strategy" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Ticket Type <span className="text-red-500">*</span></label>
        <select required value={formData.ticketType} onChange={e => setFormData({...formData, ticketType: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753] bg-white">
          <option value="Regular Delegate">Regular Delegate</option>
          <option value="VIP Delegate">VIP Delegate</option>
          <option value="Student Delegate">Student Delegate</option>
          <option value="Media Pass">Media Pass</option>
        </select>
      </div>

      <div className="pt-6">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#0F1A1C] hover:bg-[#1A2A2E] text-white py-4 rounded-none font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Complete Registration ➔"}
        </button>
      </div>
    </form>
  );
}
