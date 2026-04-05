"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { createVacancyAnnouncement, removeVacancyAnnouncement } from "@/actions/vacancyAnnouncement";
import toast from "react-hot-toast";

interface PropertyWithVacancy {
  id: string;
  location: string;
  category: string;
  price: number;
  noOfRooms: number | null;
  noOfBathrooms: number | null;
  image?: string | null;
  VacancyAnnouncement?: {
    vacantFrom: Date;
    notes?: string | null;
    postedBy: string;
    postedByUserId: string;
  } | null;
}

interface Props {
  userId: string | null;
  properties: PropertyWithVacancy[];
}

function daysLeft(date: Date) {
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000));
}

export default function LandingVacancyForm({ userId, properties }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const selected = properties.find((p) => p.id === selectedId);
  const ann = selected?.VacancyAnnouncement;
  const days = ann ? daysLeft(ann.vacantFrom) : null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createVacancyAnnouncement(formData);
      if (res.success) {
        toast.success(res.message);
        setShowForm(false);
        setIsOpen(false);
        setSelectedId("");
      } else {
        toast.error(res.message);
      }
    });
  }

  function handleRemove() {
    if (!selectedId) return;
    startTransition(async () => {
      const res = await removeVacancyAnnouncement(selectedId);
      if (res.success) { toast.success(res.message); setSelectedId(""); setShowForm(false); }
      else toast.error(res.message);
    });
  }

  /* ── Not logged in ── */
  if (!userId) {
    return (
      <div className="flex items-center justify-between gap-4 bg-white border border-[#789274]/20 rounded-2xl px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📢</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Are you a landlord?</p>
            <p className="text-xs text-gray-500">Sign in to post an upcoming vacancy announcement here.</p>
          </div>
        </div>
        <a
          href="/sign-in"
          className="shrink-0 px-4 py-2 bg-[#789274] hover:bg-[#5a6d56] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Sign In to Post
        </a>
      </div>
    );
  }

  /* ── Logged in but no properties ── */
  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-between gap-4 bg-[#789274]/5 border border-[#789274]/20 rounded-2xl px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">No listed properties found</p>
            <p className="text-xs text-gray-500">List a property first, then you can post vacancy announcements here.</p>
          </div>
        </div>
        <a href="/create-property" className="shrink-0 px-4 py-2 bg-[#789274] hover:bg-[#5a6d56] text-white text-sm font-semibold rounded-xl transition-colors">
          List Property
        </a>
      </div>
    );
  }

  /* ── Landlord with properties ── */
  return (
    <div className="bg-white border border-[#789274]/25 rounded-2xl shadow-sm overflow-hidden">
      {/* Collapsed header — click to expand */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📢</span>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm">Post a Vacancy Announcement</p>
            <p className="text-xs text-gray-500">
              {properties.filter(p => p.VacancyAnnouncement).length > 0
                ? `${properties.filter(p => p.VacancyAnnouncement).length} active announcement(s)`
                : "Let tenants know which property is available soon"}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded form */}
      {isOpen && (
        <div className="border-t border-gray-100 px-6 py-5 space-y-5">

          {/* Property selector as mini cards */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select property</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {properties.map((p) => {
                const hasAnn = !!p.VacancyAnnouncement;
                const isSelected = p.id === selectedId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { setSelectedId(p.id); setShowForm(false); }}
                    className={`text-left rounded-xl border-2 transition-all overflow-hidden ${
                      isSelected ? "border-[#789274] shadow-sm" : "border-gray-200 hover:border-[#789274]/50"
                    }`}
                  >
                    {p.image && (
                      <div className="relative h-24 w-full">
                        <Image src={p.image} alt={p.location} fill className="object-cover" />
                        {hasAnn && (
                          <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-2.5">
                      <p className="font-semibold text-gray-800 text-xs truncate">{p.category.replace("_", " ")}</p>
                      <p className="text-[11px] text-gray-500 truncate">📍 {p.location}</p>
                      <p className="text-[11px] font-medium text-[#789274]">NPR {p.price.toLocaleString()}/mo</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected property status */}
          {selected && ann && !showForm && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">
                  {ann.postedBy === "TENANT" ? "🧑 Tenant Notice" : "🏠 Landlord Posted"} · Active
                </p>
                <p className="font-bold text-gray-800">
                  {days === 0 ? "Available Now 🎉" : `Available in ${days} day${days === 1 ? "" : "s"}`}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Vacant from {new Date(ann.vacantFrom).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                {ann.notes && <p className="text-xs italic text-gray-600 mt-1">"{ann.notes}"</p>}
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => setShowForm(true)} className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Update
                </button>
                <button onClick={handleRemove} disabled={isPending} className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Post / update form */}
          {selected && (!ann || showForm) && (
            <form onSubmit={handleSubmit} className="bg-[#789274]/5 border border-[#789274]/15 rounded-xl p-4 space-y-4">
              <input type="hidden" name="propertyId" value={selected.id} />

              {/* Property preview in form */}
              <div className="flex gap-3 items-center bg-white rounded-xl p-3 border border-gray-100">
                {selected.image && (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <Image src={selected.image} alt={selected.location} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900 text-sm">{selected.category.replace("_", " ")} in {selected.location}</p>
                  <p className="text-xs text-[#789274] font-medium">NPR {selected.price.toLocaleString()} / month</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Days until vacant <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number" name="daysUntilVacant" min={1} max={365} required placeholder="e.g. 15"
                      className="w-24 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#789274]/40"
                    />
                    <span className="text-xs text-gray-500">days from today</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Notes <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text" name="notes" placeholder="e.g. Freshly painted, available for viewing"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#789274]/40"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={isPending}
                  className="px-5 py-2 bg-[#789274] hover:bg-[#5a6d56] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isPending ? "Posting…" : ann ? "Update Announcement" : "Post Announcement"}
                </button>
                {showForm && (
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {!selectedId && (
            <p className="text-xs text-gray-400 italic text-center">👆 Click a property above to post an announcement</p>
          )}
        </div>
      )}
    </div>
  );
}
