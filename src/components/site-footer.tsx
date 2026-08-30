import { Zap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">National Electricity Workshop</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Convening the leaders shaping the future of power and grid modernization.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Upcoming Events</li>
            <li>Workshops</li>
            <li>Speakers</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li>
            <li>Contact</li>
            <li>Partners</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>contactus@electricitylaw2023workshop.com</li>
            <li>+234 817 699 9997 or +234 805 466 2747</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <p className="mb-2">© {new Date().getFullYear()} National Electricity Workshop. All rights reserved.</p>
        <p className="font-semibold text-primary">Powered by Nutech</p>
      </div>
    </footer>
  );
}