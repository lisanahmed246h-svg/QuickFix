"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const logout = async () => {
    try {
      await signOut(auth);
      setOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight">
              QuickFix
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/services" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link href="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all focus:outline-none"
              aria-label="Toggle menu"
            >
              {open ? <X size={26} className="text-blue-600" /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out ${
          open ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link
            onClick={() => setOpen(false)}
            href="/services"
            className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all"
          >
            Services
          </Link>
          <Link
            onClick={() => setOpen(false)}
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-base font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}