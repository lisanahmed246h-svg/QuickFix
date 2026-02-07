"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <nav className="container-page h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          QuickFix
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/services" className="nav-link">
            Services
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="btn-secondary">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <button onClick={handleLogout} className="btn-primary">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth" className="btn-primary">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="flex flex-col gap-3 p-4">
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="nav-link"
            >
              Services
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="btn-secondary w-full"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button onClick={handleLogout} className="btn-primary w-full">
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
