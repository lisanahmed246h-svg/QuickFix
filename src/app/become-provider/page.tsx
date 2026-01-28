"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";

export default function BecomeProviderPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "",
    location: "",
    experience: "",
    description: "",
  });

  // ================= AUTH CHECK =================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      await addDoc(collection(db, "providers"), {
        ...form,
        experience: Number(form.experience),
        userId: user.uid,
        createdAt: Timestamp.now(),
      });

      alert("✅ Your provider profile has been submitted successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to submit profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING AUTH =================
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  // ================= NOT LOGGED IN =================
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-3">
          You must be logged in to become a service provider
        </h2>
        <p className="text-gray-600 mb-5">
          Please login or create an account to continue.
        </p>
        <Link
          href="/auth"
          className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // ================= FORM UI =================
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-2">
          Become a Service Provider
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Create your professional profile and start receiving jobs.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
          />

          {/* Phone */}
          <input
            name="phone"
            placeholder="Phone Number"
            required
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
          />

          {/* Category */}
          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-800 outline-none"
          >
            <option value="">Select Service Category</option>
            <option>Electrician</option>
            <option>Plumber</option>
            <option>AC Repair</option>
            <option>Painter</option>
          </select>

          {/* Location */}
          <input
            name="location"
            placeholder="Area / Location"
            required
            value={form.location}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
          />

          {/* Experience */}
          <input
            name="experience"
            type="number"
            placeholder="Experience (Years)"
            required
            value={form.experience}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Short Description about your service"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none resize-none"
          />

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
