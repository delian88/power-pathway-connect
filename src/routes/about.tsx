import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import w2 from "@/assets/workshop-2.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — National Electricity Workshop" },
      { name: "description", content: "Learn about the mission behind the National Electricity Workshop." },
      { property: "og:title", content: "About National Electricity Workshop" },
      { property: "og:description", content: "Convening leaders modernizing the national power system." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="pt-32 pb-16 max-w-4xl mx-auto px-6">
        <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Our story</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-8">Convening the people who power the nation.</h1>
        <img src={w2} alt="Workshop" width={1200} height={800} className="rounded-2xl shadow-elegant mb-10" loading="lazy" />
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p>The National Electricity Workshop was founded to close the gap between the people planning the grid of the future and the people running it today. Every year, we bring together thousands of utility executives, grid engineers, regulators, and technology leaders.</p>
          <p>Our workshops are hands-on, our keynotes are candid, and our attendees leave with more than notes — they leave with contacts and commitments that move projects forward.</p>
          <p>Whether you're deploying advanced metering infrastructure, integrating utility-scale renewables, or navigating a new rate case, this is where the work gets done.</p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}