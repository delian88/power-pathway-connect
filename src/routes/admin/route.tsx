import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { verifySession, destroySession } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const getSessionFn = createServerFn("GET", async () => {
  const session = await verifySession();
  return session;
});

export const logoutFn = createServerFn("POST", async () => {
  destroySession();
  return { success: true };
});

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // If we're already on the login page, don't check auth and redirect
    if (location.pathname === "/admin/login") return;

    const session = await getSessionFn();
    if (!session) {
      throw redirect({
        to: "/admin/login",
      });
    }
    return { session };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutFn();
    router.invalidate();
    router.navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      <div className="flex-1 flex">
        <aside className="w-64 bg-white border-r border-border/60 p-6 pt-32 space-y-4 shadow-sm hidden md:block">
          <div className="font-bold text-lg mb-6 text-[#263566]">Admin Panel</div>
          <nav className="space-y-2">
            <a href="/admin" className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700">Dashboard</a>
            <a href="/admin/settings" className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700">Site Settings</a>
            <a href="/admin/events" className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700">Workshops & Events</a>
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
