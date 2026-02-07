"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Languages,
} from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/lib/i18n";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const { language, setLanguage } = useLanguage();
  const t = getTranslation(language).navbar;


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
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
            {t.services}
          </Link>

          <Link href="/become-provider" className="nav-link">
            {t.becomeProvider}
          </Link>

          {/* Language switch */}
          <button
            onClick={toggleLanguage}
            className="nav-link flex items-center gap-1"
          >
            <Languages size={16} />
            {language === "en" ? "বাংলা" : "EN"}
          </button>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="btn-secondary flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                {t.dashboard}
              </Link>

              <Link
                href="/account"
                className="nav-link flex items-center gap-2"
              >
                <UserIcon size={16} />
                {user.displayName ?? t.account}
              </Link>

              <button onClick={handleLogout} className="btn-primary">
                <LogOut size={16} />
                {t.logout}
              </button>
            </>
          ) : (
            <Link href="/auth" className="btn-primary">
              {t.login}
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="flex flex-col gap-2 p-4">
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="nav-link"
            >
              {t.services}
            </Link>

            <Link
              href="/become-provider"
              onClick={() => setOpen(false)}
              className="nav-link"
            >
              {t.becomeProvider}
            </Link>

            {/* Language */}
            <button
              onClick={() => {
                toggleLanguage();
                setOpen(false);
              }}
              className="nav-link flex items-center gap-2"
            >
              <Languages size={16} />
              {language === "en" ? "বাংলা" : "English"}
            </button>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="nav-link"
                >
                  {t.dashboard}
                </Link>

                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="nav-link"
                >
                  {t.account}
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn-primary w-full"
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="btn-primary text-center"
              >
                {t.login}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
