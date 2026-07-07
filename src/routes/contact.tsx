import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — National Electricity Workshop" },
      { name: "description", content: "Get in touch with the National Electricity Workshop team." },
      { property: "og:title", content: "Contact us" },
      { property: "og:description", content: "Reach the team behind the National Electricity Workshop." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="pt-32 pb-24 max-w-4xl mx-auto px-6">
        <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Get in touch</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Let's talk.</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-xl">
          Sponsors, speakers, and partners — reach out and our team will be in touch within one business day.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Mail, label: "Email", value: "hello@newelectricity.org" },
            { icon: Phone, label: "Phone", value: "+1 (800) 555-0198" },
            { icon: MapPin, label: "Office", value: "Washington, DC" },
          ].map((i) => (
            <div key={i.label} className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
              <i.icon className="w-6 h-6 text-primary mb-3" />
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{i.label}</div>
              <div className="font-medium">{i.value}</div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}