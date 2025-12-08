"use client";

import Link from "next/link";
import React from "react";
import { ChevronRight, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-slate-900 text-slate-100 border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/footer/accessibility" className="flex items-center gap-2 text-slate-200 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link href="/footer/copyright" className="flex items-center gap-2 text-slate-200 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                  Copyright Policy
                </Link>
              </li>
              <li>
                <Link href="/footer/disclaimer" className="flex items-center gap-2 text-slate-200 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/footer/privacy" className="flex items-center gap-2 text-slate-200 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/footer/hyperlinking" className="flex items-center gap-2 text-slate-200 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                  Hyperlink Policy
                </Link>
              </li>
              <li>
                <Link href="/footer/terms" className="flex items-center gap-2 text-slate-200 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Address & phone */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Address</h3>
            <address className="not-italic text-sm text-slate-200 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 text-emerald-300" />
                <div>
                  <div className="font-medium">Energy Efficiency and Renewable Energy Management Centre</div>
                  <div>Department of Power, Govt. of NCT of Delhi</div>
                  <div>Vikash Bhawan-II, 2nd Floor, E-Wing, Civil Lines, New Delhi-110054</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Phone className="w-4 h-4 text-emerald-300" />
                <a href="tel:011-23815874" className="text-slate-200 hover:underline">011-23815874 / 23815875</a>
              </div>
            </address>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Map of Energy Efficiency and Renewable Energy Management Centre</h3>
            <div className="w-full h-40 md:h-48 bg-slate-800 rounded overflow-hidden">
              <iframe
                title="EE & REM Centre map"
                src="https://www.google.com/maps?q=EE+%26+REM+Centre+Vikash+Bhawan+New+Delhi&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} EnergyFlow • All rights reserved
        </div>
      </div>
    </footer>
  );
}
