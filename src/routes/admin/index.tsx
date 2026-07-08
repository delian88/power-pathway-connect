import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { 
  Calendar, 
  Users, 
  GraduationCap, 
  Award,
  UploadCloud,
  Eye,
  Edit2,
  BarChart2,
  Trash2,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const getStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  const usersCount = await db.user.count();
  const eventsCount = await db.event.count();
  return JSON.parse(JSON.stringify({ usersCount, eventsCount }));
});

export const Route = createFileRoute("/admin/")({
  loader: async () => await getStatsFn(),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { eventsCount } = Route.useLoaderData();

  const stats = [
    { title: "Total Events", value: eventsCount.toString(), icon: Calendar, trend: "+12%", bg: "bg-green-50", iconColor: "text-green-600" },
    { title: "Total Applicants", value: "421", icon: Users, trend: "+18%", bg: "bg-blue-50", iconColor: "text-blue-500" },
    { title: "Workshops", value: "9", icon: GraduationCap, trend: "+8%", bg: "bg-purple-50", iconColor: "text-purple-500" },
    { title: "Sponsors", value: "14", icon: Award, trend: "+5%", bg: "bg-amber-50", iconColor: "text-amber-500" },
  ];

  const postedEvents = [
    { 
      id: 1, 
      title: "2-Day National Workshop on the Electricity Act 2023 (As Amended)", 
      date: "15 Aug 2026, 10:00 AM", 
      location: "New Delhi, India", 
      category: "Workshop", 
      catBg: "bg-blue-100 text-blue-700",
      status: "Published", 
      statusBg: "bg-green-100 text-green-700",
      applicants: 12,
      img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=400&q=80"
    },
    { 
      id: 2, 
      title: "Future of Decentralised Energy Systems in India", 
      date: "28 Aug 2026, 02:00 PM", 
      location: "Mumbai, India", 
      category: "Seminar", 
      catBg: "bg-purple-100 text-purple-700",
      status: "Published", 
      statusBg: "bg-green-100 text-green-700",
      applicants: 28,
      img: "https://images.unsplash.com/photo-1549206775-5231c26b976b?auto=format&fit=crop&w=400&q=80"
    },
    { 
      id: 3, 
      title: "Training Program on Grid Modernization Technologies", 
      date: "10 Sep 2026, 11:00 AM", 
      location: "Bengaluru, India", 
      category: "Training", 
      catBg: "bg-yellow-100 text-yellow-700",
      status: "Draft", 
      statusBg: "bg-gray-100 text-gray-700",
      applicants: 8,
      img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80"
    },
    { 
      id: 4, 
      title: "National Conference on Renewable Energy Integration", 
      date: "25 Sep 2026, 09:30 AM", 
      location: "Hyderabad, India", 
      category: "Conference", 
      catBg: "bg-pink-100 text-pink-700",
      status: "Scheduled", 
      statusBg: "bg-blue-100 text-blue-700",
      applicants: 32,
      img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80"
    },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-[#0F1A1C] mb-1">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening.</p>
      </div>
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-7 h-7 ${stat.iconColor}`} />
              </div>
              <div>
                <div className="text-sm text-gray-500 font-medium mb-1">{stat.title}</div>
                <div className="text-2xl font-bold text-[#0F1A1C]">{stat.value}</div>
                <div className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                  ↗ {stat.trend} <span className="text-gray-400 font-normal">from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
        
        {/* Left Column: Create New Event Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-xl font-bold text-[#00A86B] mb-6 border-b border-gray-100 pb-4">Create New Event</h2>
          
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Title</label>
              <input type="text" placeholder="Enter event title" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Short Description</label>
              <input type="text" placeholder="Enter short description" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Detailed Content (Objectives, Program, etc.)</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2">
                  <button type="button" className="p-1 hover:bg-gray-200 rounded font-serif font-bold w-7 h-7">B</button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded font-serif italic w-7 h-7">I</button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded font-serif underline w-7 h-7">U</button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded flex items-center justify-center w-7 h-7 text-xs">≣</button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded flex items-center justify-center w-7 h-7 text-xs">1.</button>
                </div>
                <textarea 
                  rows={4} 
                  placeholder="Write the full event details here..." 
                  className="w-full border-none px-4 py-3 text-sm focus:outline-none resize-none"
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Date & Time</label>
                <div className="relative">
                  <input type="datetime-local" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Type</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 bg-white">
                  <option>Workshop</option>
                  <option>Conference</option>
                  <option>Seminar</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Location</label>
                <input type="text" placeholder="Enter location" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Capacity</label>
                <input type="number" placeholder="Enter capacity" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 bg-white">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 bg-white text-gray-500">
                  <option>Select category</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Cover Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-[#00A86B]/50 transition-colors">
                  <UploadCloud className="w-8 h-8 text-blue-400 mb-2" />
                  <div className="text-xs font-medium text-gray-600">Click to upload or drag & drop</div>
                  <div className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 5MB</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Sponsor/Partner Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-[#00A86B]/50 transition-colors">
                  <UploadCloud className="w-8 h-8 text-blue-400 mb-2" />
                  <div className="text-xs font-medium text-gray-600">Click to upload or drag & drop</div>
                  <div className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 5MB</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
              <Button type="button" variant="outline" className="bg-gray-100 border-none text-gray-700 hover:bg-gray-200 px-6 font-bold">
                Save Draft
              </Button>
              <Button type="button" className="bg-[#00A86B] hover:bg-[#008753] text-white px-6 font-bold flex items-center gap-2">
                <span className="text-lg leading-none mt-[-2px]">↗</span> Publish Event
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Posted Events List */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-300">
            <h2 className="text-xl font-bold text-[#00A86B]">Posted Events</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]/20 w-64"
                />
              </div>
              <Button variant="outline" className="px-3 border-gray-200 text-gray-600 hover:bg-gray-50">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {postedEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow group">
                <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${event.catBg}`}>
                      {event.category}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${event.statusBg}`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-[#0F1A1C] text-[15px] leading-tight mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="text-xs text-gray-500 flex flex-col gap-1.5 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]">📍</span>
                      {event.location}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between border-l border-gray-100 pl-4 ml-2">
                  <div className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                    <Users className="w-3.5 h-3.5" />
                    {event.applicants} Applicants
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                      <BarChart2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
