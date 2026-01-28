"use client"; // এটি থাকতে হবে কারণ আমরা ইন্টারঅ্যাক্টিভ বাটন ব্যবহার করছি

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase"; // আপনার তৈরি করা ফায়ারবেস ফাইল
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from 'next/link';
import {
  Wrench,
  Droplet,
  Snowflake,
  Paintbrush,
  ShieldCheck,
  DollarSign,
  Headphones,
  Search,
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  // চেক করবে ইউজার লগইন আছে কি না
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // লগআউট ফাংশন
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout Error", error);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-6 py-4 shadow-sm border-b">
        <h1 className="text-2xl font-bold text-blue-900">QuickFix</h1>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/services" className="hover:text-blue-700 font-medium">
  Find Services
</Link>
          <Link href="/become-provider" className="hover:text-blue-700 font-medium">
  Become a Provider
</Link>
          
          {/* ইউজার লগইন থাকলে নাম এবং লগআউট দেখাবে, নয়তো লগইন বাটন */}
          {user ? (
  <div className="flex items-center gap-4 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
    {/* এখানে নতুন ড্যাশবোর্ড লিঙ্কটি যোগ করা হয়েছে */}
    <Link href="/dashboard" className="text-blue-900 font-bold hover:text-blue-700 text-sm transition-colors border-r border-blue-200 pr-3">
      Dashboard
    </Link>
    
    <span className="font-semibold text-blue-900 text-sm">
      Hi, {user.email?.split('@')[0]} 
    </span>
    
    <button 
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md transition shadow-sm"
    >
      Logout
    </button>
  </div>
) : (
  <Link href="/auth">
    <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-bold transition shadow-sm">
      Login
    </button>
  </Link>
)}
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="px-6 py-20 text-center bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Professional Services, Right at Your Doorstep
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-10">
          Find trusted local experts for all your home and office needs.
        </p>

        <div className="max-w-2xl mx-auto flex bg-white rounded-xl overflow-hidden shadow-2xl">
          <input
            type="text"
            placeholder="Search for a service (e.g. Electrician)..."
            className="flex-1 px-6 py-4 text-gray-700 outline-none"
          />
          {/* Search Bar Update */}
<div className="max-w-2xl mx-auto flex bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-100">
  <input
    type="text"
    placeholder="Search for a service (e.g. Electrician)..."
    className="flex-1 px-6 py-4 text-gray-700 outline-none text-lg"
  />
  
  <Link href="/services" className="bg-yellow-500 hover:bg-yellow-600 px-8 flex items-center justify-center transition">
    <Search className="text-black" />
  </Link>
</div>
        </div>
      </section>

      {/* ================= SERVICE CATEGORIES ================= */}
      <section className="px-6 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-blue-900">
          Popular Services
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <ServiceCard icon={<Wrench size={32} />} title="Electrician" />
          <ServiceCard icon={<Droplet size={32} />} title="Plumbing" />
          <ServiceCard icon={<Snowflake size={32} />} title="AC Repair" />
          <ServiceCard icon={<Paintbrush size={32} />} title="Painting" />
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-gray-50 px-6 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-blue-900">
          Why Choose QuickFix?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<ShieldCheck size={36} />}
            title="Verified Experts"
            description="All professionals are background verified and skilled."
          />
          <FeatureCard
            icon={<DollarSign size={36} />}
            title="Transparent Pricing"
            description="No hidden charges. Know the cost before booking."
          />
          <FeatureCard
            icon={<Headphones size={36} />}
            title="Quick Support"
            description="Our support team is always ready to help you."
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-blue-900 text-white px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h4 className="font-bold text-xl mb-4">QuickFix</h4>
            <p className="text-blue-200">Your trusted local service marketplace in Bangladesh.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-blue-200">
              <li className="hover:text-white cursor-pointer">Find Services</li>
              <li className="hover:text-white cursor-pointer">Become a Provider</li>
              <li>
                <Link href="/auth" className="hover:text-white">Login / Register</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
            <p className="text-blue-200">Email: support@quickfix.com</p>
            <p className="text-blue-200">Phone: +880-1234-567890</p>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-10 pt-8 text-center text-sm text-blue-400">
          © {new Date().getFullYear()} QuickFix. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

// Components
function ServiceCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    // আমরা এখানে টাইটেল অনুযায়ী কুয়েরি প্যারামিটার পাঠাচ্ছি
    <Link href={`/services?category=${title}`} className="block">
      <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
        <div className="text-blue-600 group-hover:scale-110 transition-transform">{icon}</div>
        <p className="font-bold text-gray-700">{title}</p>
      </div>
    </Link>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
      <div className="flex justify-center text-yellow-500 mb-6">{icon}</div>
      <h4 className="font-bold text-xl mb-3 text-blue-900">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}