"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, User, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/app/context/authcntxt";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "signup" }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [authView, setAuthView] = useState<"form" | "forgot" | "change">("form");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", currentPassword: "", newPassword: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    setIsLogin(initialMode === "login");
    setAuthView("form");
    setErrorMsg("");
    setSuccessMsg("");
  }, [initialMode, isOpen]);

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

  // Google OAuth 2.0 Sign-In Handler
  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      // Check if user already exists in Firestore
      const userDocRef = doc(db, "users", googleUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        // Create default student profile for new Google sign-ins
        await setDoc(userDocRef, {
          uid: googleUser.uid,
          name: googleUser.displayName || "Enigma Member",
          email: googleUser.email || "",
          role: "student",
          createdAt: new Date().toISOString(),
        });
      }

      setIsLoading(false);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || "Google Sign-In failed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      if (authView === "forgot") {
        if (!formData.email.trim()) {
          setErrorMsg("Please enter your email address.");
          setIsLoading(false);
          return;
        }
        await sendPasswordResetEmail(auth, formData.email.trim());
        setSuccessMsg("Password reset link sent! Check your inbox.");
        setIsLoading(false);
        return;
      }

      if (authView === "change") {
        if (!user || !user.email) {
          setErrorMsg("You must be logged in to change your password.");
          setIsLoading(false);
          return;
        }
        if (formData.newPassword.length < 6) {
          setErrorMsg("New password must be at least 6 characters long.");
          setIsLoading(false);
          return;
        }

        const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, formData.newPassword);

        setSuccessMsg("Password updated successfully!");
        setIsLoading(false);
        setFormData({ ...formData, currentPassword: "", newPassword: "" });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setErrorMsg("Please enter a valid email address.");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
      }

      if (!isLogin && !formData.name.trim()) {
        setErrorMsg("Please enter your full name.");
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );
        const newUser = userCredential.user;

        await setDoc(doc(db, "users", newUser.uid), {
          uid: newUser.uid,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: "student",
          createdAt: new Date().toISOString(),
        });
      }

      setIsLoading(false);
      onClose();
      setFormData({ name: "", email: "", password: "", currentPassword: "", newPassword: "" });
    } catch (err: any) {
      setIsLoading(false);
      let message = err.message || "Operation failed.";
      if (err.code === "auth/email-already-in-use") {
        message = "This email is already registered. Try logging in instead.";
      } else if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        message = "Invalid email, current password, or credentials.";
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
              className="absolute top-5 right-5 z-20 p-2 rounded-full bg-black/70 text-neutral-400 hover:text-white hover:bg-white/15 transition-colors border border-white/15 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-6">
              <div className="space-y-1.5 text-center">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  {authView === "forgot" 
                    ? "Reset Password" 
                    : authView === "change" 
                    ? "Change Password" 
                    : isLogin 
                    ? "Welcome Back" 
                    : "Join Enigma"}
                </h2>
                <p className="text-xs sm:text-sm text-lime-200 font-mono">
                  {authView === "forgot"
                    ? "We'll email you a password reset link"
                    : authView === "change"
                    ? "Update your account password securely"
                    : isLogin 
                    ? "Access your RSVPs & portal" 
                    : "Create your student account"}
                </p>
              </div>

              {/* Google OAuth 2.0 Sign-In Button */}
              {authView === "form" && (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold font-mono text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.18 21.31 7.23 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 0 12s.43 3.87 1.19 5.4l4.08-3.16z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.69 1.19 6.6l4.08 3.16c.95-2.85 3.6-4.95 6.73-4.95z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="px-3 text-[10px] font-mono uppercase text-neutral-500">or email</span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>
                </>
              )}

              {authView === "form" && (
                <div className="flex rounded-xl bg-neutral-900 border border-white/10 p-1">
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setErrorMsg(""); setSuccessMsg(""); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer ${
                      !isLogin ? "bg-lime-500 text-black shadow-md" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setErrorMsg(""); setSuccessMsg(""); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-200 cursor-pointer ${
                      isLogin ? "bg-lime-500 text-black shadow-md" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Login
                  </button>
                </div>
              )}

              {authView === "form" && isLogin && (
                <div className="flex items-center justify-between px-1 text-[11px] font-mono text-neutral-400">
                  <button
                    type="button"
                    onClick={() => { setAuthView("forgot"); setErrorMsg(""); setSuccessMsg(""); }}
                    className="hover:text-lime-400 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthView("change"); setErrorMsg(""); setSuccessMsg(""); }}
                    className="hover:text-lime-400 transition-colors cursor-pointer"
                  >
                    Change Password?
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center gap-2 text-lime-400 text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {authView === "forgot" && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider">
                      Your Email Address
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
                )}

                {authView === "change" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                        <input
                          type="password"
                          required
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                        <input
                          type="password"
                          required
                          value={formData.newPassword}
                          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                {authView === "form" && (
                  <>
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
                            placeholder="Trishanku Kotharu"
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
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-lime-500 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold tracking-wider uppercase transition-colors duration-200 cursor-pointer shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                >
                  <span>
                    {isLoading 
                      ? "Processing..." 
                      : authView === "forgot" 
                      ? "Send Reset Email" 
                      : authView === "change" 
                      ? "Update Password" 
                      : isLogin 
                      ? "Sign In" 
                      : "Create Account"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {authView !== "form" && (
                  <button
                    type="button"
                    onClick={() => { setAuthView("form"); setErrorMsg(""); setSuccessMsg(""); }}
                    className="w-full text-center text-xs font-mono text-neutral-400 hover:text-white pt-2 cursor-pointer"
                  >
                    ← Back to Login / Signup
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}