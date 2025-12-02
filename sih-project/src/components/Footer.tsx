"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Zap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-2xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                EnergyFlow
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              AI-powered energy management for modern campuses. Building a sustainable future together.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/pjha8040"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent hover:bg-accent/80 text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent hover:bg-accent/80 text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:teamgaruda@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent hover:bg-accent/80 text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/campusAdmin/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/campusAdmin/iot" className="text-muted-foreground hover:text-foreground transition-colors">
                  IoT Control
                </Link>
              </li>
              <li>
                <Link href="/campusAdmin/ai" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/campusAdmin/export" className="text-muted-foreground hover:text-foreground transition-colors">
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ai" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI Chat
                </Link>
              </li>
              <li>
                <Link href="/consumer" className="text-muted-foreground hover:text-foreground transition-colors">
                  Consumer Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} EnergyFlow. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ by <span className="font-semibold text-foreground">Team Garuda</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
