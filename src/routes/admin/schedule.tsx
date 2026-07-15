import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus, Calendar as CalendarIcon } from "lucide-react";

export const getScheduleDataFn = createServerFn({ method: "GET" }).handler(async () => {
  const items = await db.scheduleItem.findMany({
    orderBy: [
      { day: 'asc' },
      { timeRange: 'asc' }
    ]
  });
  const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
  return JSON.parse(JSON.stringify({ items, settings }));
});

export const createScheduleItemFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const item = await db.scheduleItem.create({
      data: {
        day: parseInt(data.day),
        timeRange: data.timeRange,
        title: data.title,
        location: data.location || null,
        speaker: data.speaker || null,
        description: data.description || null,
      }
    });
    return JSON.parse(JSON.stringify(item));
  });

export const deleteScheduleItemFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.scheduleItem.delete({ where: { id } });
    return { success: true };
  });

export const Route = createFileRoute("/admin/schedule")({
  loader: async () => await getScheduleDataFn(),
  component: SchedulePage,
});

function SchedulePage() {
  const { items, settings } = Route.useLoaderData();
  const router = useRouter();
  
  const [activeDay, setActiveDay] = useState(1);
  const [formData, setFormData] = useState({
    timeRange: "",
    title: "",
    location: "",
    speaker: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.timeRange || !formData.title) {
      toast.error("Time range and title are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createScheduleItemFn({ data: { ...formData, day: activeDay } });
      toast.success("Schedule item added!");
      setFormData({ timeRange: "", title: "", location: "", speaker: "", description: "" });
      router.invalidate();
    } catch (err) {
      toast.error("Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule item?")) return;
    try {
      await deleteScheduleItemFn({ data: id });
      toast.success("Item deleted");
      router.invalidate();
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const currentItems = items.filter((item: any) => item.day === activeDay);

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#263566]">Event Schedule</h1>
          <p className="text-gray-500 mt-1">Manage the agenda for each day of the event.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-lg shadow-sm border p-1 mb-8 overflow-x-auto">
        {Array.from({ length: settings?.scheduleDaysCount || 4 }).map((_, idx) => {
          const day = idx + 1;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-1 min-w-[80px] py-3 text-center rounded-md font-semibold transition-colors ${
                activeDay === day 
                  ? "bg-[#008753] text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Day {day}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
            <CalendarIcon className="w-5 h-5 text-[#008753]" />
            Day {activeDay} Schedule
          </h2>
          
          {currentItems.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-lg border border-dashed border-gray-300 text-gray-500">
              No schedule items added for this day yet.
            </div>
          ) : (
            <div className="space-y-3">
              {currentItems.map((item: any) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-[#008753]/10 text-[#008753] px-2 py-1 rounded text-sm font-bold tracking-wide">
                        {item.timeRange}
                      </span>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                    </div>
                    {(item.location || item.speaker) && (
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium">
                        {item.location && <span className="flex items-center gap-1">📍 {item.location}</span>}
                        {item.speaker && <span className="flex items-center gap-1">👥 {item.speaker}</span>}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-6">
            <h3 className="font-bold text-lg mb-4">Add New Item</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Time Range</Label>
                <Input 
                  value={formData.timeRange} 
                  onChange={e => setFormData({...formData, timeRange: e.target.value})} 
                  placeholder="e.g. 09:30 - 10:00" 
                  required
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Welcome Address" 
                  required
                />
              </div>
              <div>
                <Label>Location (Optional)</Label>
                <Input 
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  placeholder="e.g. BAT ICC, Abuja" 
                />
              </div>
              <div>
                <Label>Speaker / Persons (Optional)</Label>
                <Input 
                  value={formData.speaker} 
                  onChange={e => setFormData({...formData, speaker: e.target.value})} 
                  placeholder="e.g. John Doe" 
                />
              </div>
              <div>
                <Label>Detailed Description / HTML (Optional)</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Add HTML or text for panels, discussion areas, etc." 
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full bg-[#008753] hover:bg-[#006e43]" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add to Schedule"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
