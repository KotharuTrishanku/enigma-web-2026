"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, updateDoc, setDoc, query, where } from "firebase/firestore";
import { ShieldCheck, ArrowLeft, RotateCw, Plus, CheckSquare, Square, Calendar } from "lucide-react";
import Link from "next/link";

interface Member {
  id: string;
  name: string;
  rollNumber?: string;
  ugBatch?: string;
  email: string;
  contact?: string;
  domain?: string;
  attendance: Record<string, boolean>;
}

export default function AttendanceAdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  
  const [sessions, setSessions] = useState<string[]>(["2026-09-03", "2026-09-20", "2026-09-23"]);
  const [members, setMembers] = useState<Member[]>([]);
  
  const [newSessionDate, setNewSessionDate] = useState("");
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  
  const router = useRouter();

  // 1. Authenticate user and verify STRICT Admin role
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
          if (role === "admin") {
            setAuthorized(true);
            fetchData();
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

  // 2. Fetch Sessions & Existing Core Members from Firestore
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const sessionsSnap = await getDoc(doc(db, "attendanceConfig", "sessions"));
      if (sessionsSnap.exists() && sessionsSnap.data()?.dates) {
        setSessions(sessionsSnap.data().dates);
      }

      const usersSnap = await getDocs(query(collection(db, "users"), where("role", "in", ["core"])));
      const list: Member[] = [];
      usersSnap.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          name: d.name || d.displayName || "Unknown",
          rollNumber: d.rollNumber || d.rollNo || "N/A",
          ugBatch: d.ugBatch || d.batch || "UG-2",
          email: d.email || "",
          contact: d.contact || d.phone || "N/A",
          domain: d.domain || "Core Team",
          attendance: d.attendance || {},
        });
      });

      setMembers(list);
    } catch (err) {
      console.error("Error fetching attendance roster:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // Toggle attendance status for an existing user document in Firestore
  const toggleAttendance = async (memberId: string, date: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const currentStatus = !!member.attendance[date];
    const updatedAttendance = {
      ...member.attendance,
      [date]: !currentStatus,
    };

    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, attendance: updatedAttendance } : m))
    );

    try {
      await updateDoc(doc(db, "users", memberId), {
        attendance: updatedAttendance,
      });
    } catch (err) {
      console.error("Firestore sync failed:", err);
      fetchData();
    }
  };

  // Add new session date column
  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionDate) return;

    const updatedSessions = [...sessions, newSessionDate];
    setSessions(updatedSessions);
    setNewSessionDate("");
    setShowAddSessionModal(false);

    try {
      await setDoc(doc(db, "attendanceConfig", "sessions"), { dates: updatedSessions }, { merge: true });
    } catch (err) {
      console.error("Error adding session:", err);
    }
  };

  // KPI Calculations
  const totalMembers = members.length;
  const totalSessions = sessions.length;
  const totalPossible = totalMembers * totalSessions;
  let totalAttendedCount = 0;
  let regularAttendeesCount = 0;

  members.forEach((m) => {
    let mAttended = 0;
    sessions.forEach((s) => {
      if (m.attendance[s]) {
        totalAttendedCount++;
        mAttended++;
      }
    });
    if (totalSessions > 0 && mAttended / totalSessions >= 0.75) {
      regularAttendeesCount++;
    }
  });

  const overallRate = totalPossible > 0 ? (totalAttendedCount / totalPossible) * 100 : 0;

  // Domain Statistics Breakdown
  const domains = Array.from(new Set(members.map((m) => m.domain || "Core Team")));
  const domainStats = domains.map((d) => {
    const domainMembers = members.filter((m) => (m.domain || "Core Team") === d);
    const headcount = domainMembers.length;
    let totalAttended = 0;
    domainMembers.forEach((m) => {
      sessions.forEach((s) => {
        if (m.attendance[s]) totalAttended++;
      });
    });
    const totalPossibleDomain = headcount * totalSessions;
    const avgSessions = headcount > 0 ? (totalAttended / headcount).toFixed(2) : "0";
    const rate = totalPossibleDomain > 0 ? ((totalAttended / totalPossibleDomain) * 100).toFixed(1) : "0";

    return { domain: d, headcount, totalAttended, totalPossibleDomain, avgSessions, rate };
  });

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        <p className="text-slate-400 animate-pulse text-sm">Verifying admin access...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-8 font-mono space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 text-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Enigma Admin Attendance Roster
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official Core Member Attendance & Domain Performance Roster • AY 2026–2027
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddSessionModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs text-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <Plus className="w-3.5 h-3.5 text-slate-300" /> Add Session
          </button>
          <button
            onClick={fetchData}
            disabled={loadingData}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-slate-400 ${loadingData ? "animate-spin" : ""}`} /> Reload
          </button>
          <Link
            href="/"
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" /> Return Home
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Members</span>
          <span className="text-2xl font-bold text-white">{totalMembers}</span>
        </div>
        <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Sessions Held</span>
          <span className="text-2xl font-bold text-white">{totalSessions}</span>
        </div>
        <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Overall Attendance</span>
          <span className="text-2xl font-bold text-slate-300">{overallRate.toFixed(1)}%</span>
        </div>
        <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Regular Attendees (≥75%)</span>
          <span className="text-2xl font-bold text-slate-300">{regularAttendeesCount} / {totalMembers}</span>
        </div>
      </div>

      {/* Main Attendance Table */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto shadow-2xl">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-300 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-3.5 px-4 text-center border-r border-slate-800">#</th>
              <th className="py-3.5 px-4 border-r border-slate-800">Member Name</th>
              <th className="py-3.5 px-4 border-r border-slate-800">Roll Number</th>
              <th className="py-3.5 px-4 border-r border-slate-800">UG Batch</th>
              <th className="py-3.5 px-4 border-r border-slate-800">Email ID</th>
              <th className="py-3.5 px-4 border-r border-slate-800">Contact Number</th>
              <th className="py-3.5 px-4 border-r border-slate-800">Domain</th>
              
              {sessions.map((sessionDate) => (
                <th key={sessionDate} className="py-3.5 px-4 text-center border-r border-slate-800 bg-slate-900/80">
                  {sessionDate}
                </th>
              ))}

              <th className="py-3.5 px-4 text-center border-r border-slate-800 bg-slate-900/50">Attended</th>
              <th className="py-3.5 px-4 text-center border-r border-slate-800 bg-slate-900/50">Total</th>
              <th className="py-3.5 px-4 text-center border-r border-slate-800 bg-slate-900/50">Rate</th>
              <th className="py-3.5 px-4 text-center bg-slate-900/50">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 font-mono">
            {members.map((member, index) => {
              let attended = 0;
              sessions.forEach((s) => {
                if (member.attendance[s]) attended++;
              });

              const rate = totalSessions > 0 ? (attended / totalSessions) * 100 : 0;
              const isGoodStanding = rate >= 75;

              return (
                <tr key={member.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 text-center text-slate-500 border-r border-slate-900">{index + 1}</td>
                  <td className="py-3 px-4 font-bold text-white border-r border-slate-900">{member.name}</td>
                  <td className="py-3 px-4 text-slate-400 border-r border-slate-900">{member.rollNumber || "N/A"}</td>
                  <td className="py-3 px-4 text-slate-400 border-r border-slate-900">{member.ugBatch || "UG-2"}</td>
                  <td className="py-3 px-4 text-slate-400 border-r border-slate-900">{member.email}</td>
                  <td className="py-3 px-4 text-slate-400 border-r border-slate-900">{member.contact || "N/A"}</td>
                  <td className="py-3 px-4 text-slate-300 border-r border-slate-900">{member.domain || "Core Team"}</td>

                  {sessions.map((sessionDate) => {
                    const isPresent = !!member.attendance[sessionDate];
                    return (
                      <td key={sessionDate} className="py-3 px-4 text-center border-r border-slate-900">
                        <button
                          onClick={() => toggleAttendance(member.id, sessionDate)}
                          className="inline-flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          {isPresent ? (
                            <CheckSquare className="w-5 h-5 text-slate-200" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-700" />
                          )}
                        </button>
                      </td>
                    );
                  })}

                  <td className="py-3 px-4 text-center font-bold text-white border-r border-slate-900 bg-slate-950/40">{attended}</td>
                  <td className="py-3 px-4 text-center text-slate-400 border-r border-slate-900 bg-slate-950/40">{totalSessions}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-200 border-r border-slate-900 bg-slate-950/40">{rate.toFixed(0)}%</td>
                  <td className="py-3 px-4 text-center bg-slate-950/40">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isGoodStanding ? "bg-slate-900 border border-slate-700 text-slate-200" : "bg-red-950/60 border border-red-800 text-red-400"
                    }`}>
                      {isGoodStanding ? "Good Standing" : "Critical"}
                    </span>
                  </td>
                </tr>
              );
            })}

            <tr className="bg-slate-900/80 font-bold border-t border-slate-800">
              <td colSpan={7} className="py-3 px-4 text-right border-r border-slate-800 text-slate-300">Total Attendees</td>
              {sessions.map((s) => {
                let count = 0;
                members.forEach((m) => { if (m.attendance[s]) count++; });
                return <td key={s} className="py-3 px-4 text-center border-r border-slate-800 text-white">{count}</td>;
              })}
              <td className="py-3 px-4 text-center border-r border-slate-800 text-white">{totalAttendedCount}</td>
              <td className="py-3 px-4 text-center border-r border-slate-800 text-slate-400">{totalPossible}</td>
              <td className="py-3 px-4 text-center border-r border-slate-800 text-slate-200">{overallRate.toFixed(1)}%</td>
              <td className="py-3 px-4 text-center">--</td>
            </tr>

            <tr className="bg-slate-900/40 font-bold">
              <td colSpan={7} className="py-3 px-4 text-right border-r border-slate-800 text-slate-400">Turnout Rate (%)</td>
              {sessions.map((s) => {
                let count = 0;
                members.forEach((m) => { if (m.attendance[s]) count++; });
                const rate = totalMembers > 0 ? ((count / totalMembers) * 100).toFixed(0) : "0";
                return <td key={s} className="py-3 px-4 text-center border-r border-slate-800 text-slate-300">{rate}%</td>;
              })}
              <td colSpan={4} className="py-3 px-4 text-center text-slate-500">--</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Domain Performance Breakdown */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Domain Performance Breakdown</h3>
        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto shadow-lg">
          <table className="w-full text-left text-xs whitespace-nowrap font-mono">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Domain Name</th>
                <th className="py-3 px-4 text-center">Headcount</th>
                <th className="py-3 px-4 text-center">Total Attended</th>
                <th className="py-3 px-4 text-center">Total Possible</th>
                <th className="py-3 px-4 text-center">Avg Sessions / Member</th>
                <th className="py-3 px-4 text-center">Attendance Rate (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {domainStats.map((stat) => (
                <tr key={stat.domain} className="hover:bg-slate-900/30">
                  <td className="py-3 px-4 font-bold text-white">{stat.domain}</td>
                  <td className="py-3 px-4 text-center text-slate-300">{stat.headcount}</td>
                  <td className="py-3 px-4 text-center text-slate-300">{stat.totalAttended}</td>
                  <td className="py-3 px-4 text-center text-slate-400">{stat.totalPossibleDomain}</td>
                  <td className="py-3 px-4 text-center text-slate-300">{stat.avgSessions}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-200">{stat.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Session Modal */}
      {showAddSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" /> Add Session Date Column
              </h3>
              <button onClick={() => setShowAddSessionModal(false)} className="text-slate-400 hover:text-white text-xs cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddSession} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase tracking-wider">Session Date (YYYY-MM-DD)</label>
                <input type="text" required placeholder="e.g. 2026-10-15" value={newSessionDate} onChange={(e) => setNewSessionDate(e.target.value)} className="w-full bg-black border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddSessionModal(false)} className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-slate-800 border border-slate-600 text-xs font-bold text-white cursor-pointer">Add Session</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}