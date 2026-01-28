"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function AuthPage() {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= AUTH HANDLER =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        // -------- SIGNUP --------
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        // Save user info in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          createdAt: new Date(),
        });

        router.push("/");
      } else {
        // -------- LOGIN --------
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
          QuickFix
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {isSignup ? "Create your account" : "Login to your account"}
        </p>

        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-gray-100 rounded-lg overflow-hidden">
          <button
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-2 text-sm font-medium transition ${
              !isSignup
                ? "bg-blue-900 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`flex-1 py-2 text-sm font-medium transition ${
              isSignup
                ? "bg-blue-900 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
          />

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded-lg font-medium transition disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
