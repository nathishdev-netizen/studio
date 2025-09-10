"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const getTitleFromPathname = (pathname: string) => {
  if (pathname === "/") return "AI Companion";
  if (pathname.startsWith("/matches")) return "Matches";
  if (pathname.startsWith("/profile")) return "My Profile";
  return "SynergyDate";
}

export function AppHeader() {
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold md:hidden">{title}</h1>
      </div>
      <div className="hidden w-full items-center gap-4 md:flex md:ml-auto md:gap-2 lg:gap-4">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Future search bar location */}
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
       <div className="flex w-full items-center gap-4 md:hidden">
        <div className="ml-auto flex-1 sm:flex-initial" />
         <Button variant="ghost" size="icon" className="rounded-full">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
    </header>
  );
}
