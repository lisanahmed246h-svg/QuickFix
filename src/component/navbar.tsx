"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-blue-700 tracking-tight"
        >
          QuickFix
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link className="nav-link" href="/services">
            Services
          </Link>
          <Link className="nav-link" href="/dashboard">
            Dashboard
          </Link>

          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link
            onClick={() => setOpen(false)}
            className="mobile-link"
            href="/services"
          >
            Services
          </Link>

          <Link
            onClick={() => setOpen(false)}
            className="mobile-link"
            href="/dashboard"
          >
            Dashboard
          </Link>

          <button
            onClick={logout}
            className="w-full btn-secondary text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
