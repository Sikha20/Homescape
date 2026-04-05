"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { createTenantVacancyNotice, removeVacancyAnnouncement } from "@/actions/vacancyAnnouncement";
import toast from "react-hot-toast";

interface VacancyNoticeProps {
  propertyId: string;
  propertyTitle: string; // e.g. "2BHK Apartment in Baneshwor"
  propertyImage?: string | null;
  propertyPrice: number;
  vacantFrom?: Date | null;
  notes?: string | null;
  postedBy?: string | null;    // "LANDLORD" | "TENANT" | null
  postedByUserId?: string | null;
  currentUserId: string;
}

function daysLeft(date: Date) {
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000));
}

export default function TenantVacancyNotice({
  propertyId,
  propertyTitle,
  propertyImage,
  propertyPrice,
  vacantFrom,
  notes,
  postedBy,
  postedByUserId,
  currentUserId,
}: VacancyNoticeProps) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  const hasAnnouncement = !!vacantFrom;
  const days = hasAnnouncement ? daysLeft(vacantFrom!) : null;
  const isToday = days === 0;
  const isUrgent = days !== null && days <= 7;
  const iPosted = postedByUserId === currentUserId;
  const isLandlordPosted = postedBy === "LANDLORD";

  const vacantDateStr = vacantFrom
    ? new Date(vacantFrom).toLocaleDateString("en-NP", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })
    : null;

  function handleTenantPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createTenantVacancyNotice(formData);
      if (res.success) { toast.success(res.message); setShowForm(false); }
      else toast.error(res.message);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const res = await removeVacancyAnnouncement(propertyId);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  }

  /* ── Color scheme by urgency ── */
  const scheme = isToday
    ? { border: "border-red-400",    bg: "bg-red-50",    badge: "bg-red-100 text-red-700",    icon: "🚨" }
    : isUrgent
    ? { border: "border-orange-400", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700", icon: "⚠️" }
    : { border: "border-amber-400",  bg: "bg-amber-50",  badge: "bg-amber-100 text-amber-700",  icon: "📋" };

  return (
    <div className={`rounded-2xl border-l-4 ${scheme.border} ${scheme.bg} mb-4 overflow-hidden`}>
      {/* Top bar with property identity */}
      <div className="flex gap-3 p-4 border-b border-white/50">
        {propertyImage && (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
            <Image src={propertyImage} alt={propertyTitle} fill className="object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-gray-900 text-sm leading-snug">{propertyTitle}</p>
          <p className="text-xs text-[#789274] font-semibold">
            NPR {propertyPrice.toLocaleString()} / month
          </p>
        </div>
      </div>

      <div className="p-4 relative overflow-hidden">
        {/* Decorative number */}
        {days !== null && (
          <span className="absolute right-3 top-1 text-7xl font-black opacity-[0.06] select-none pointer-events-none">
            {isToday ? "!" : days}
          </span>
        )}

        <div className="relative z-10 space-y-3">

          {hasAnnouncement ? (
            <>
              {/* Badge row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${scheme.badge}`}>
                  {scheme.icon} {isToday ? "Vacate Today" : "Vacancy Notice"}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isLandlordPosted ? "bg-[#789274]/10 text-[#789274]" : "bg-blue-100 text-blue-700"
                }`}>
                  {isLandlordPosted ? "🏠 Landlord Posted" : "🧑 Tenant Notice"}
                </span>
                {iPosted && (
                  <span className="text-xs text-gray-400">(you posted this)</span>
                )}
              </div>

              {/* Main message — property-specific */}
              <p className="font-bold text-gray-900 text-base leading-snug">
                {iPosted
                  ? `You have marked "${propertyTitle}" as vacating in ${days} day${days === 1 ? "" : "s"}.`
                  : isToday
                  ? `Please vacate "${propertyTitle}" today.`
                  : `"${propertyTitle}" will be vacant in ${days} day${days === 1 ? "" : "s"}.`}
              </p>

              <p className="text-xs text-gray-500">
                📅 Vacant from <span className="font-semibold text-gray-700">{vacantDateStr}</span>
              </p>

              {notes && (
                <p className="text-sm text-gray-600 italic bg-white/60 rounded-xl px-3 py-2 border border-white/80">
                  {notes}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 flex-wrap items-center pt-1">
                <Link
                  href={`/property/${propertyId}`}
                  className="text-xs font-medium text-[#789274] underline underline-offset-2 hover:text-[#5a6d56]"
                >
                  View property →
                </Link>
                <Link
                  href="/dashboard"
                  className="text-xs font-medium px-3 py-1.5 bg-[#789274] hover:bg-[#5a6d56] text-white rounded-lg transition-colors"
                >
                  Browse new properties
                </Link>
                {/* Tenant can update or delete their own notice */}
                {iPosted && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowForm(true)}
                      className="text-xs px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors"
                    >
                      Edit notice
                    </button>
                    <button
                      type="button"
                      onClick={handleRemove}
                      disabled={isPending}
                      className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            /* No announcement yet — prompt tenant to post */
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Planning to move out of <span className="text-[#789274]">{propertyTitle}</span>?
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Let your landlord and future tenants know when you'll be vacating.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="text-sm px-4 py-2 bg-[#789274] hover:bg-[#5a6d56] text-white font-semibold rounded-xl transition-colors"
              >
                📢 Post Vacancy Notice
              </button>
            </div>
          )}

          {/* Tenant post / edit form */}
          {showForm && (
            <form
              onSubmit={handleTenantPost}
              className="mt-3 bg-white/80 border border-white rounded-2xl p-4 space-y-3"
            >
              <input type="hidden" name="propertyId" value={propertyId} />

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  I will vacate in
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="daysUntilVacant"
                    min={1}
                    max={365}
                    required
                    placeholder="e.g. 30"
                    className="w-24 px-3 py-1.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#789274]/40"
                  />
                  <span className="text-sm text-gray-500">days from today</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Notes <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder='e.g. "Moving out early due to job relocation."'
                  defaultValue={iPosted ? notes ?? "" : ""}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-[#789274]/40"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 bg-[#789274] hover:bg-[#5a6d56] text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Posting…" : hasAnnouncement ? "Update Notice" : "Post Notice"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
