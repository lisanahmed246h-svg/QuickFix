"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
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
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="container-page h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          QuickFix
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/services" className="nav-link">
            Services
          </Link>

          <Link href="/become-provider" className="nav-link">
            Become a Provider
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="btn-secondary flex items-center gap-2">
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              <Link href="/account" className="nav-link flex items-center gap-2">
                <UserIcon size={16} /> {user.displayName ?? "Account"}
              </Link>

              <button onClick={handleLogout} className="btn-primary">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link href="/auth" className="btn-primary">
              Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="flex flex-col gap-2 p-4">
            {/* Always show: Services, Become a Provider */}
            <Link href="/services" onClick={() => setOpen(false)} className="py-2 nav-link">
              Services
            </Link>

            <Link href="/become-provider" onClick={() => setOpen(false)} className="py-2 nav-link">
              Become a Provider
            </Link>

            {/* If user logged in: Account, Dashboard, Logout */}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="py-2 nav-link flex items-center gap-2">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>

                <Link href="/account" onClick={() => setOpen(false)} className="py-2 nav-link flex items-center gap-2">
                  <UserIcon size={16} /> {user.displayName ?? "Account"}
                </Link>

                <button
                  onClick={handleLogout}
                  className="py-2 mt-2 btn-primary w-full text-center"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link href="/auth" onClick={() => setOpen(false)} className="py-2 btn-primary text-center w-full">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
