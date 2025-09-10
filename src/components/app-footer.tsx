"use client";

import { Heart, MessageCircle, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/",
    icon: MessageCircle,
    label: "AI Companion",
  },
  {
    href: "/matches",
    icon: Heart,
    label: "Matches",
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
  },
];

export function AppFooter() {
  const pathname = usePathname();

  return (
    <footer className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex items-center justify-around h-16 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full rounded-lg text-sm font-medium transition-colors",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </footer>
  );
}
