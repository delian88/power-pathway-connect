import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/registration")({
  component: RegistrationPage,
});

function RegistrationPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans print:bg-white print:min-h-0">
      <div className="print:hidden">
        <SiteHeader />
      </div>
      
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-16 print:hidden">
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
      <section className="py-24 max-w-4xl mx-auto px-6 print:py-0 print:px-0">
        <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12 border border-gray-100 print:shadow-none print:border-none print:p-0">
          <div className="text-center mb-10 print:hidden">
            <h2 className="text-3xl font-bold text-[#0F1A1C] mb-4">Secure Your Spot</h2>
            <p className="text-gray-500 font-poppins text-lg">
              Fill out the form below to register for the 2-DAY NATIONAL WORKSHOP ON THE ELECTRICITY ACT 2023.
            </p>
          </div>

          <RegistrationForm />
        </div>
      </section>

      <div className="print:hidden">
        <SiteFooter />
      </div>
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
    address: "",
    city: "",
    country: "",
    zipCode: "",
    gender: "Male",
    ticketType: "Regular Delegate"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.submitRegistration(formData);
      setSuccess(res);
    } catch (error) {
      console.error("Failed to submit registration", error);
      alert("Failed to submit registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const regId = success.id;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NIES2023:${regId}`;

    return (
      <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
        <div className="print:hidden">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-[#0F1A1C] mb-4">Registration Successful!</h3>
          <p className="text-gray-600 font-poppins mb-8">
            Thank you for registering for the 2-DAY NATIONAL WORKSHOP ON THE ELECTRICITY ACT 2023. We have received your details and our team will be in touch with you shortly.
          </p>
        </div>

        {/* Printable Pass */}
        <div className="max-w-md mx-auto bg-white border-2 border-[#008753] rounded-xl overflow-hidden shadow-lg mb-8 text-left print:shadow-none print:border-none print:m-0 print:max-w-full">
          <div className="bg-[#0F1A1C] text-white p-6 text-center">
            <h4 className="text-xl font-bold uppercase tracking-wider mb-1">Event Pass</h4>
            <p className="text-[#D4AF37] text-sm">National Electricity Workshop 2023</p>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Attendee</p>
                <p className="font-semibold text-lg text-[#0F1A1C]">{formData.firstName} {formData.lastName}</p>
                <p className="text-gray-600 text-sm">{formData.organization}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Ticket Type</p>
                  <p className="font-semibold text-[#008753]">{formData.ticketType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Registration ID</p>
                  <p className="font-mono text-xs text-gray-800 break-all">{regId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <button 
            onClick={() => window.print()}
            className="bg-[#0F1A1C] hover:bg-[#1A2A2E] text-white px-8 py-3 rounded-none font-bold tracking-wide transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print Pass
          </button>
          <button 
            onClick={() => { setSuccess(null); setFormData({ firstName: "", lastName: "", email: "", phone: "", organization: "", jobTitle: "", address: "", city: "", country: "", zipCode: "", gender: "Male", ticketType: "Regular Delegate" }); }}
            className="bg-[#008753] hover:bg-[#007045] text-white px-8 py-3 rounded-none font-bold tracking-wide transition-colors"
          >
            Register Another Person
          </button>
        </div>
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Address <span className="text-red-500">*</span></label>
          <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753]" placeholder="123 Main St" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">City <span className="text-red-500">*</span></label>
          <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753]" placeholder="Lagos" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Country <span className="text-red-500">*</span></label>
          <input required type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753]" placeholder="Nigeria" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Zip / Postal Code</label>
          <input type="text" value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753]" placeholder="100001" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Gender <span className="text-red-500">*</span></label>
        <select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-[#008753] bg-white">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
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
