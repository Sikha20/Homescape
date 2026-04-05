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
  properties: PropertyWithVacancy[];
  currentUserId: string;
}

function daysLeft(date: Date) {
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000));
}

export default function VacancyAnnouncementForm({ properties, currentUserId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);

  const selected = properties.find((p) => p.id === selectedId);
  const ann = selected?.VacancyAnnouncement;
  const days = ann ? daysLeft(ann.vacantFrom) : null;
  const isTenantPosted = ann?.postedBy === "TENANT";
  const postedByMe = ann?.postedByUserId === currentUserId;

  const vacantDateStr = ann
    ? new Date(ann.vacantFrom).toLocaleDateString("en-NP", {
        weekday: "short", year: "numeric", month: "short", day: "numeric",
      })
    : null;

  function handleSelect(id: string) {
    setSelectedId(id);
    setShowPostForm(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createVacancyAnnouncement(formData);
      if (res.success) { toast.success(res.message); setShowPostForm(false); }
      else toast.error(res.message);
    });
  }

  function handleRemove() {
    if (!selectedId) return;
    startTransition(async () => {
      const res = await removeVacancyAnnouncement(selectedId);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📢 Vacancy Announcements</h2>
          <p className="text-sm text-gray-500 mt-1">
            Mark one of your properties as "Available Soon" so prospective tenants can plan ahead.
          </p>
        </div>
      </div>

      {/* Property selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Choose a property to manage
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {properties.map((p) => {
            const hasAnn = !!p.VacancyAnnouncement;
            const isSelected = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p.id)}
                className={`text-left rounded-xl border-2 transition-all overflow-hidden ${
                  isSelected
                    ? "border-[#789274] shadow-md"
                    : "border-gray-200 hover:border-[#789274]/50"
                }`}
              >
                {/* Thumbnail */}
                {p.image && (
                  <div className="relative h-28 w-full">
                    <Image src={p.image} alt={p.location} fill className="object-cover" />
                    {hasAnn && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ANNOUNCED
                      </span>
                    )}
                  </div>
                )}
                <div className="p-3">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {p.category.replace("_", " ")}
                  </p>
                  <p className="text-xs text-gray-500 truncate">📍 {p.location}</p>
                  <p className="text-xs font-medium text-[#789274] mt-0.5">
                    NPR {p.price.toLocaleString()} / mo
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {properties.length === 0 && (
          <p className="text-sm text-gray-400 italic">You haven't listed any properties yet.</p>
        )}
      </div>

      {/* Selected property detail + announcement */}
      {selected && (
        <div className="mt-6 border-t border-gray-100 pt-6 space-y-5">

          {/* Property preview card */}
          <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-4 border border-gray-200">
            {selected.image && (
              <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                <Image src={selected.image} alt={selected.location} fill className="object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900 text-base">
                {selected.category.replace("_", " ")} in {selected.location}
              </p>
              <p className="text-sm text-[#789274] font-semibold">
                NPR {selected.price.toLocaleString()} / month
              </p>
              <div className="flex gap-3 text-xs text-gray-500 mt-1">
                {selected.noOfRooms && <span>🛏 {selected.noOfRooms} bed{selected.noOfRooms > 1 ? "s" : ""}</span>}
                {selected.noOfBathrooms && <span>🚿 {selected.noOfBathrooms} bath{selected.noOfBathrooms > 1 ? "s" : ""}</span>}
              </div>
              <div className="mt-2">
                {ann ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    {isTenantPosted ? "🧑 Tenant Notice" : "🏠 Landlord Posted"} · Active
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-400">No active announcement</span>
                )}
              </div>
            </div>
          </div>

          {/* Existing announcement info */}
          {ann && (
            <div className={`rounded-2xl border-l-4 p-5 ${
              isTenantPosted ? "bg-blue-50 border-blue-400" : "bg-amber-50 border-amber-400"
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      isTenantPosted ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {isTenantPosted ? "🧑 Tenant Notice" : "🏠 Landlord Posted"}
                    </span>
                    {postedByMe && !isTenantPosted && (
                      <span className="text-[11px] text-gray-400">(you posted this)</span>
                    )}
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {days === 0 ? "Available Now 🎉" : `Available in ${days} day${days === 1 ? "" : "s"}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    📅 Vacant from <span className="font-medium">{vacantDateStr}</span>
                  </p>
                  {ann.notes && (
                    <p className="mt-2 text-sm text-gray-600 italic bg-white/70 rounded-lg px-3 py-2 border border-white/80">
                      "{ann.notes}"
                    </p>
                  )}
                  {isTenantPosted && (
                    <p className="mt-2 text-xs text-blue-600 font-medium">
                      ℹ️ Your tenant has posted this notice. You can override it below.
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowPostForm(true)}
                    className="text-xs px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors shadow-sm"
                  >
                    {isTenantPosted ? "Override" : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isPending}
                    className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Post / Update form */}
          {(!ann || showPostForm) && (
            <form onSubmit={handleSubmit} className="bg-[#789274]/5 border border-[#789274]/20 rounded-2xl p-5 space-y-4">
              <input type="hidden" name="propertyId" value={selected.id} />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Days until property becomes vacant
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    name="daysUntilVacant"
                    min={1}
                    max={365}
                    required
                    placeholder="e.g. 15"
                    className="w-28 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#789274]/40"
                  />
                  <span className="text-sm text-gray-500">days from today</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  This will show as "Available in X days" on the landing page.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Notes <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="e.g. Property will be freshly painted and cleaned before handover."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-[#789274]/40"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-[#789274] hover:bg-[#5a6d56] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isPending ? "Posting…" : ann ? (isTenantPosted ? "Override with Landlord Date" : "Update Announcement") : "Post Announcement"}
                </button>
                {showPostForm && (
                  <button
                    type="button"
                    onClick={() => setShowPostForm(false)}
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {!selectedId && properties.length > 0 && (
        <p className="text-sm text-gray-400 italic mt-2">
          Click a property above to manage its vacancy announcement.
        </p>
      )}
    </section>
  );
}
