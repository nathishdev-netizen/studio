import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <AppHeader />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
