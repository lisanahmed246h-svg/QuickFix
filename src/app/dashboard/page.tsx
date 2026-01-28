"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";

type Booking = {
  id: string;
  providerId: string;
  providerName: string;
  userId: string;
  userName: string;
  serviceDate: string;
  preferredTime: string;
  issueDescription: string;
  contactNumber: string;
  status: "pending" | "accepted" | "completed";
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [isProvider, setIsProvider] = useState(false);
  const [providerDocId, setProviderDocId] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= AUTH LISTENER =================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return () => unsub();
  }, []);

  // ================= CHECK PROVIDER ROLE =================
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "providers"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setIsProvider(true);
        setProviderDocId(snapshot.docs[0].id); // provider document id
      } else {
        setIsProvider(false);
        setProviderDocId(null);
      }
    });

    return () => unsub();
  }, [user]);

  // ================= FETCH BOOKINGS (REAL-TIME) =================
  useEffect(() => {
    if (!user) return;

    let q;

    if (isProvider && providerDocId) {
      // Provider view → bookings for this provider
      q = query(
        collection(db, "bookings"),
        where("providerId", "==", providerDocId)
      );
    } else {
      // User view → bookings made by this user
      q = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );
    }

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];

      setBookings(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user, isProvider, providerDocId]);

  // ================= UPDATE STATUS =================
  const updateStatus = async (
    bookingId: string,
    newStatus: "accepted" | "completed"
  ) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update booking status");
    }
  };

  // ================= AUTH STATES =================
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-3">
          Please login to access your dashboard
        </h2>
        <Link
          href="/auth"
          className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
        Dashboard
      </h1>
      <p className="text-center text-gray-500 mb-8">
        {isProvider ? "Service Requests" : "My Bookings"}
      </p>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="h-12 w-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          No bookings found.
        </p>
      ) : (
        <div className="max-w-5xl mx-auto grid gap-5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-md p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Booking Info */}
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-blue-900">
                  {isProvider
                    ? `Customer: ${booking.userName}`
                    : `Provider: ${booking.providerName}`}
                </p>

                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {booking.serviceDate}
                </p>

                <p>
                  <span className="font-medium">Time:</span>{" "}
                  {booking.preferredTime}
                </p>

                <p className="text-gray-600">
                  <span className="font-medium">Issue:</span>{" "}
                  {booking.issueDescription}
                </p>
              </div>

              {/* Status + Actions */}
              <div className="flex flex-col gap-2 items-start md:items-end">
                <StatusBadge status={booking.status} />

                {isProvider && (
                  <div className="flex gap-2">
                    {booking.status === "pending" && (
                      <button
                        onClick={() =>
                          updateStatus(booking.id, "accepted")
                        }
                        className="px-3 py-1 rounded-md bg-yellow-500 text-white text-sm"
                      >
                        Accept
                      </button>
                    )}

                    {booking.status === "accepted" && (
                      <button
                        onClick={() =>
                          updateStatus(booking.id, "completed")
                        }
                        className="px-3 py-1 rounded-md bg-green-600 text-white text-sm"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ================= STATUS BADGE =================
function StatusBadge({ status }: { status: string }) {
  const color =
    status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : status === "accepted"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${color}`}
    >
      {status}
    </span>
  );
}
