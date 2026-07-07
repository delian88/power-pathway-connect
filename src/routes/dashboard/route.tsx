import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
// Actually I need to export getSessionFn and logoutFn from somewhere central, or just put them in auth or here.
// I'll put them in login.tsx or I'll just use the ones from admin/route.tsx for now.
import { getSessionFn as getAdminSessionFn, logoutFn as adminLogoutFn } from "../admin/route";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const session = await getAdminSessionFn();
    if (!session) {
      throw redirect({
        to: "/login",
      });
    }
    return { session };
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await adminLogoutFn();
    router.invalidate();
    router.navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      <div className="flex-1 flex">
        <aside className="w-64 bg-white border-r border-border/60 p-6 pt-32 space-y-4 shadow-sm hidden md:block">
          <div className="font-bold text-lg mb-6 text-[#263566]">My Dashboard</div>
          <nav className="space-y-2">
            <a href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700">My Events</a>
          </nav>
          <div className="mt-auto pt-8">
            <Button variant="outline" className="w-full" onClick={handleLogout}>Logout</Button>
          </div>
        </aside>
        
        <main className="flex-1 p-6 pt-32">
          <Outlet />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
