"use client";

import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const getTitleFromPathname = (pathname: string) => {
  if (pathname === "/") return "AI Companion";
  if (pathname.startsWith("/matches")) return "Matches";
  if (pathname.startsWith("/profile")) return "My Profile";
  return "PulseChat";
}

export function AppHeader() {
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
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
