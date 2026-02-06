"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
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
    <nav className="relative z-[999] w-full bg-white border-b-2 border-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo - সবসময় দেখা যাবে */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black text-blue-700">
              QuickFix
            </span>
          </Link>

          {/* Desktop Menu - বড় স্ক্রিনে দেখাবে */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/services" className="font-bold text-slate-700 hover:text-blue-600">Services</Link>
            <Link href="/dashboard" className="font-bold text-slate-700 hover:text-blue-600">Dashboard</Link>
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button - এটিই আপনার সমস্যা ছিল */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-xl border-2 border-blue-600 font-bold"
            >
              {open ? (
                <> <X size={24} /> <span>CLOSE</span> </>
              ) : (
                <> <Menu size={24} /> <span>MENU</span> </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b-2 border-blue-600 shadow-2xl p-6 space-y-4">
          <Link
            onClick={() => setOpen(false)}
            href="/services"
            className="block text-xl font-bold text-slate-800 border-b pb-2"
          >
            Services
          </Link>
          <Link
            onClick={() => setOpen(false)}
            href="/dashboard"
            className="block text-xl font-bold text-slate-800 border-b pb-2"
          >
            Dashboard
          </Link>
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-4 rounded-xl font-black text-lg"
          >
            LOGOUT
          </button>
        </div>
      )}
    </nav>
  );
}
