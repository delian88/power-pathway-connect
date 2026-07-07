import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Calendar } from "lucide-react";

export const getStatsFn = createServerFn("GET", async () => {
  const eventsCount = await db.event.count();
  return { eventsCount };
});

export const Route = createFileRoute("/admin/")({
  loader: async () => await getStatsFn(),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { eventsCount } = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#263566]">Dashboard Overview</h1>
      <p className="text-gray-500">Welcome to your CMS. Select an option from the sidebar to manage your website.</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventsCount}</div>
            <p className="text-xs text-muted-foreground">Workshops and conferences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Live</div>
            <p className="text-xs text-muted-foreground">Settings are active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
