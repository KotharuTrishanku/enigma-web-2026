"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query } from "firebase/firestore";
import { MessageSquare, ArrowLeft, BookmarkCheck, RotateCw } from "lucide-react";
import Link from "next/link";

interface FeedbackItem {
  id: string;
  message?: string;
  feedback?: string;
  subject?: string;
  [key: string]: any;
}

export default function FeedbacksAdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const role = userDocSnap.data()?.role;
          if (role === "core" || role === "admin") {
            setAuthorized(true);
            fetchFeedbacks();
          } else {
            router.replace("/");
          }
        } else {
          router.replace("/");
        }
      } catch (err) {
        console.error("Auth verification error:", err);
        router.replace("/");
      } finally {
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchFeedbacks = async () => {
    setLoadingFeedbacks(true);
    try {
      const q = query(collection(db, "feedbacks"));
      const querySnapshot = await getDocs(q);
      const list: FeedbackItem[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setFeedbacks(list);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const groupedFeedbacks = feedbacks.reduce((acc, item) => {
    const subjectKey = item.subject || "Unspecified Subject";
    if (!acc[subjectKey]) {
      acc[subjectKey] = [];
    }
    acc[subjectKey].push(item);
    return acc;
  }, {} as Record<string, FeedbackItem[]>);

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        <p className="text-slate-400 animate-pulse text-sm">Verifying core & admin access...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-black text-white p-6 sm:p-12 font-mono">
      <div className="max-w-5xl mx-auto space-y-10">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="space-y-1">
   
            <h1 className="text-3xl font-bold tracking-tight uppercase flex items-center gap-3 text-white">
              <MessageSquare className="w-8 h-8 text-slate-400" />
              Feedback Submissions
            </h1>

          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchFeedbacks}
              disabled={loadingFeedbacks}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              aria-label="Reload feedbacks"
            >
              <RotateCw className={`w-4 h-4 text-slate-400 ${loadingFeedbacks ? "animate-spin" : ""}`} />
              Reload
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" /> Return Home
            </Link>
          </div>
        </div>

        {/*cntnt*/}
        {loadingFeedbacks && feedbacks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-12">Loading feedback entries from database...</p>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-12 text-center space-y-2">
            <p className="text-xs text-slate-400">No feedback submissions found in the database.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedFeedbacks).map(([subject, items]) => (
              <div key={subject} className="space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                    <BookmarkCheck className="w-5 h-5 text-slate-400" />
                    Subject: {subject} <span className="text-xs font-normal text-slate-500">({items.length} items)</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-slate-950/80 border border-slate-800 p-6 space-y-3 hover:border-slate-700 transition-colors shadow-lg"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-900 pb-3">
                        <span className="text-slate-300 font-bold">Submission #{index + 1}</span>
                        <span>Doc ID: {item.id}</span>
                      </div>

                      <div className="bg-black/50 p-4 rounded-xl border border-slate-900 space-y-1">
                        <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Message</span>
                        <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {item.message || item.feedback || JSON.stringify(item, null, 2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}