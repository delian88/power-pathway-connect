import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplyDialog } from "./apply-dialog";

export type EventRow = {
  id: string;
  title: string;
  description: string;
  date: Date | string;
  imageUrl: string | null;
  type: string;
  userId: string | null;
  slug?: string;
};

export function EventCard({ event, index = 0 }: { event: EventRow; index?: number }) {
  const [open, setOpen] = useState(false);
  const date = new Date(event.date);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="group relative rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm hover:shadow-elegant transition-all duration-500"
      >
        <div className="aspect-[16/10] overflow-hidden bg-gradient-primary relative">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-hero" />
          )}
          <div className="absolute top-4 left-4 bg-background/95 backdrop-blur px-3 py-2 rounded-lg text-center shadow-sm">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {date.toLocaleString("en-US", { month: "short" })}
            </div>
            <div className="text-xl font-bold leading-none">{date.getDate()}</div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-3">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${event.type === 'conference' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {event.type === 'conference' ? 'Conference' : 'Workshop'}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-5">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{date.toLocaleDateString("en-US")}</span>
          </div>
          <div className="flex gap-2 w-full">
            <Button onClick={() => setOpen(true)} className="flex-1 bg-gradient-primary shadow-elegant">
              Secure your seat
            </Button>
            <Button 
              variant="outline" 
              className="px-3 border-slate-200 text-slate-600 hover:text-primary hover:border-primary/50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = `${window.location.origin}/events/${event.slug || event.id}`;
                if (navigator.share) {
                  navigator.share({
                    title: event.title,
                    text: event.description,
                    url: url,
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(url);
                  // We would ideally show a toast here, but for simplicity we just alert or rely on user notice
                  alert("Link copied to clipboard!");
                }
              }}
              aria-label="Share event"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.article>
      <ApplyDialog eventId={event.id} eventTitle={event.title} open={open} onOpenChange={setOpen} />
    </>
  );
}