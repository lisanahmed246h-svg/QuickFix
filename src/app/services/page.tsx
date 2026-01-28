"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";

/* ================= TYPES ================= */

type Provider = {
  id: string;
  name: string;
  phone: string;
  category: string;
  location: string;
  experience: number;
};

/* ============================================================
   MAIN PAGE (Suspense Wrapper)
============================================================ */

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <ServiceListContent />
    </Suspense>
  );
}

/* ============================================================
   CONTENT COMPONENT (uses useSearchParams safely)
============================================================ */

function ServiceListContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [providers, setProviders] = useState<Provider[]>([]);
  const [filtered, setFiltered] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [user, setUser] = useState<User | null>(null);

  // Booking modal states
  const [selectedProvider, setSelectedProvider] =
    useState<Provider | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    issue: "",
    contact: "",
  });

  /* ================= AUTH LISTENER ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  /* ================= FETCH PROVIDERS ================= */
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "providers"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Provider[];

        setProviders(data);
        setFiltered(data);
      } catch (error) {
        console.error("Failed to fetch providers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  /* ================= APPLY URL CATEGORY ================= */
  useEffect(() => {
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [urlCategory]);

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let result = providers;

    if (category) {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.location.toLowerCase().includes(keyword)
      );
    }

    setFiltered(result);
  }, [search, category, providers]);

  /* ================= BOOKING HANDLERS ================= */

  const openBookingModal = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProvider(null);
    setBookingForm({
      date: "",
      time: "",
      issue: "",
      contact: "",
    });
  };

  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProvider) return;

    try {
      setBookingLoading(true);

      await addDoc(collection(db, "bookings"), {
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        userId: user.uid,
        userName: user.displayName || user.email,
        status: "pending",
        serviceDate: bookingForm.date,
        preferredTime: bookingForm.time,
        issueDescription: bookingForm.issue,
        contactNumber: bookingForm.contact,
        createdAt: Timestamp.now(),
      });

      alert("✅ Booking request submitted successfully!");
      closeModal();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to submit booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
        Find Local Experts
      </h1>

      {/* ================= FILTER BAR ================= */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 mb-8">
        <input
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-800 outline-none"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-800 outline-none"
        >
          <option value="">All Categories</option>
          <option>Electrician</option>
          <option>Plumber</option>
          <option>AC Repair</option>
          <option>Painter</option>
        </select>
      </div>

      {/* ================= PROVIDER GRID ================= */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          No experts found in this category
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filtered.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h2 className="text-xl font-bold text-blue-900">
                  {provider.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {provider.category}
                </p>

                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Experience:</span>{" "}
                    {provider.experience} years
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {provider.location}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <a
                  href={`tel:${provider.phone}`}
                  className="block text-center border border-blue-900 text-blue-900 py-2 rounded-lg transition font-medium hover:bg-blue-50"
                >
                  Call Now
                </a>

                {user ? (
                  <button
                    onClick={() => openBookingModal(provider)}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg transition font-medium"
                  >
                    Book Now
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    className="block text-center bg-gray-200 text-gray-600 py-2 rounded-lg font-medium"
                  >
                    Login to Book
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= BOOKING MODAL ================= */}
      {showModal && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              Book {selectedProvider.name}
            </h2>

            <form onSubmit={submitBooking} className="space-y-3">
              <input
                type="date"
                name="date"
                required
                value={bookingForm.date}
                onChange={handleBookingChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="time"
                name="time"
                required
                value={bookingForm.time}
                onChange={handleBookingChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                required
                value={bookingForm.contact}
                onChange={handleBookingChange}
                className="w-full border rounded-lg px-3 py-2"
              />

              <textarea
                name="issue"
                placeholder="Describe your issue"
                required
                rows={3}
                value={bookingForm.issue}
                onChange={handleBookingChange}
                className="w-full border rounded-lg px-3 py-2 resize-none"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border rounded-lg py-2"
                >
                  Cancel
                </button>

                <button
                  disabled={bookingLoading}
                  className="flex-1 bg-blue-900 hover:bg-blue-800 text-white rounded-lg py-2 disabled:opacity-60"
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
