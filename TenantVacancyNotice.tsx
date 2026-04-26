"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  createTenantVacancyNotice,
  removeVacancyAnnouncement,
} from "@/actions/vacancyAnnouncement";
import toast from "react-hot-toast";
import {
  MAX_VACANCY_NOTICE_DAYS,
  formatVacancyDate,
  getDaysUntilVacancy,
  getPosterBadge,
  getVacancyBadge,
} from "@/lib/vacancy";

interface VacancyNoticeProps {
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string | null;
  propertyPrice: number;
  propertyLocation: string;
  vacantFrom?: Date | null;
  notes?: string | null;
  postedBy?: string | null;
  postedByUserId?: string | null;
  currentUserId: string;
}

export default function TenantVacancyNotice({
  propertyId,
  propertyTitle,
  propertyImage,
  propertyPrice,
  propertyLocation,
  vacantFrom,
  notes,
  postedBy,
  postedByUserId,
  currentUserId,
}: VacancyNoticeProps) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  const hasAnnouncement = Boolean(vacantFrom);
  const days = vacantFrom ? getDaysUntilVacancy(vacantFrom) : null;
  const isMyNotice = postedByUserId === currentUserId;
  const posterBadge = postedBy ? getPosterBadge(postedBy) : null;
  const vacancyBadge = days !== null ? getVacancyBadge(days) : null;

  function handleTenantPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createTenantVacancyNotice(formData);
      if (result.success) {
        toast.success(result.message);
        setShowForm(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeVacancyAnnouncement(propertyId);
      if (result.success) {
        toast.success(result.message);
        setShowForm(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
      <div className="flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
          <Image
            src={propertyImage || "/placeholder.jpg"}
            alt={propertyTitle}
            fill
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            {vacancyBadge && (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${vacancyBadge.className}`}
              >
                {vacancyBadge.label}
              </span>
            )}
            {posterBadge && (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${posterBadge.className}`}
              >
                {posterBadge.label}
              </span>
            )}
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900">{propertyTitle}</h4>
            <p className="text-sm text-gray-500">{propertyLocation}</p>
            <p className="text-sm font-semibold text-[#789274]">
              NPR {propertyPrice.toLocaleString()} / month
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {hasAnnouncement ? (
          <div className="rounded-2xl border border-white bg-white p-4">
            <p className="text-base font-semibold text-gray-900">
              {isMyNotice
                ? `You have marked this property as vacating ${days === 0 ? "today" : `in ${days} day${days === 1 ? "" : "s"}`}.`
                : `The property ${propertyTitle} will be vacant ${days === 0 ? "today" : `in ${days} day${days === 1 ? "" : "s"}`}.`}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Vacant from {formatVacancyDate(vacantFrom!)}
            </p>
            {notes && (
              <p className="mt-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm italic text-gray-600">
                {notes}
              </p>
            )}
            {!isMyNotice && postedBy === "LANDLORD" && (
              <p className="mt-3 text-sm text-gray-500">
                Your landlord posted the current vacancy timeline for this property.
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/property/${propertyId}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                View property
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl bg-[#789274] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5a6d56]"
              >
                Browse properties
              </Link>
              {isMyNotice && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Edit notice
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isPending}
                    className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    Remove notice
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-4">
            <p className="text-base font-semibold text-gray-900">
              Planning to move out of {propertyTitle}?
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Post a tenant notice for this exact property so your landlord and future tenants can plan ahead.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-4 rounded-xl bg-[#789274] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5a6d56]"
            >
              Post tenant notice
            </button>
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleTenantPost}
            className="rounded-2xl border border-[#789274]/20 bg-white p-4"
          >
            <input type="hidden" name="propertyId" value={propertyId} />

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Days until you vacate
                </label>
                <input
                  type="number"
                  name="daysUntilVacant"
                  min={1}
                  max={MAX_VACANCY_NOTICE_DAYS}
                  required
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#789274]"
                  placeholder="e.g. 30"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use a timeline between 1 and {MAX_VACANCY_NOTICE_DAYS} days.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={isMyNotice ? notes ?? "" : ""}
                  className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#789274]"
                  placeholder="Optional context, for example: Moving out early due to relocation."
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[#789274] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5a6d56] disabled:opacity-50"
                >
                  {isPending
                    ? "Saving..."
                    : hasAnnouncement && isMyNotice
                    ? "Update my notice"
                    : "Post tenant notice"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
