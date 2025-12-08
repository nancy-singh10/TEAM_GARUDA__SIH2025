"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Zap, LayoutDashboard, FileDown, Network } from "lucide-react";
import { ModeToggle } from "../app/components/ModeToggle";
import ProfileButton from "./ProfileButton";

interface CampusAdminHeaderProps {
  title?: string;
}

export default function CampusAdminHeader({ title }: CampusAdminHeaderProps) {
  const pathname = usePathname();

  // Determine page title based on route if not provided
  const getPageTitle = () => {
    if (title) return title;
    if (pathname.includes("/dashboard")) return "Energy Dashboard";
    if (pathname.includes("/iot")) return "IoT Control Center";
    if (pathname.includes("/ai")) return "AI Chatbot";
    return "Campus Admin";
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/campusAdmin/dashboard",
      icon: LayoutDashboard,
      active: pathname.includes("/dashboard"),
    },
    {
      name: "IoT",
      href: "/campusAdmin/iot",
      icon: Zap,
      active: pathname === "/campusAdmin/iot",
    },
    {
      name: "Chatbot",
      href: "/campusAdmin/ai",
      icon: Bot,
      active: pathname.includes("/ai"),
    },
    {
      name: "Decision Logic",
      href: "/campusAdmin/decisionMaking",
      icon: Network,
      active: pathname.includes("/decisionMaking"),
    },
    {
      name: "Export Report",
      href: "/campusAdmin/export",
      icon: FileDown,
      active: pathname.includes("/export"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-muted-foreground">Campus Energy Management</p>
          </div>
        </div>

        {/* Center: Navigation Buttons */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all duration-200 hover:scale-105
                  ${item.active
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation Dropdown */}
        <nav className="flex md:hidden items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center justify-center h-9 w-9 rounded-lg
                  transition-all duration-200
                  ${item.active
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }
                `}
                title={item.name}
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Toggle & Profile */}
        <div className="flex items-center gap-2">
          <ProfileButton />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
