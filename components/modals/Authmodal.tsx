"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, User, AlertCircle, ArrowRight } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "signup" }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLogin(initialMode === "login");
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//for @-. check
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (!isLogin && !formData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: "student", // Default Level 2 role
          createdAt: new Date().toISOString(),
        });
      }

      setIsLoading(false);
      onClose();
      setFormData({ name: "", email: "", password: "" });
    } catch (err: any) {
      setIsLoading(false);
      let message = err.message || "Authentication failed.";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered. Try logging in instead.";
      } else if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        message = "Invalid email or password.";
      }
      setErrorMsg(message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md bg-neutral-950/95 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 p-2 rounded-full bg-black/70 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors border border-white/15 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-6">
              <div className="space-y-1.5 text-center">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  {isLogin ? "Welcome Back" : "Join Enigma"}
                </h2>
                <p className="text-xs sm:text-sm text-lime-200 font-mono">
                  {isLogin ? "Access your RSVPs & portal" : "Create your student account"}
                </p>
              </div>

              <div className="flex rounded-xl bg-neutral-900 border border-white/10 p-1">
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setErrorMsg(""); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer ${
                    !isLogin ? "bg-lime-500 text-black shadow-md" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setErrorMsg(""); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer ${
                    isLogin ? "bg-lime-500 text-black shadow-md" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Login
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required={!isLogin}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ben Dover"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@iiits.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Dont use Password as your Password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 text-xs font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold tracking-wider uppercase transition-colors duration-200 cursor-pointer shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                >
                  <span>{isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}