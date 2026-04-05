import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import LandingVacancyForm from "./LandingVacancyForm";

/* ── helpers ── */
function daysUntil(date: Date) {
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000));
}
function getCountdownBadge(days: number) {
  if (days === 0) return { bg: "bg-green-500",  label: "Available Now 🎉",          ring: "ring-green-200",  glow: "shadow-green-100"  };
  if (days <= 7)  return { bg: "bg-orange-500", label: `Available in ${days} days`, ring: "ring-orange-200", glow: "shadow-orange-100" };
  if (days <= 30) return { bg: "bg-amber-500",  label: `Available in ${days} days`, ring: "ring-amber-200",  glow: "shadow-amber-100"  };
  return            { bg: "bg-[#789274]",       label: `Coming in ${days} days`,    ring: "ring-[#789274]/30", glow: "shadow-[#789274]/10" };
}
function getPosterBadge(postedBy: string) {
  return postedBy === "TENANT"
    ? { bg: "bg-blue-500/90",   label: "🧑 Tenant Notice"  }
    : { bg: "bg-[#789274]/90",  label: "🏠 Landlord Posted" };
}

export default async function UpcomingVacanciesSection() {
  const now = new Date();
  const { userId } = await auth();

  /* announcements visible to everyone */
  const announcements = await db.vacancyAnnouncement.findMany({
    where: { vacantFrom: { gte: now } },
    orderBy: { vacantFrom: "asc" },
    take: 6,
    include: { property: { include: { images: true, landlord: true } } },
  });

  /* landlord's own properties — only if logged in */
  const myProperties = userId
    ? await db.property.findMany({
        where: { userId, isListed: true },
        include: {
          images: true,
          VacancyAnnouncement: true,
        },
      })
    : [];

  const landlordProperties = myProperties.map((p) => ({
    id: p.id,
    location: p.location,
    category: p.category,
    price: p.price,
    noOfRooms: p.noOfRooms,
    noOfBathrooms: p.noOfBathrooms,
    image: p.images[0]?.image ?? null,
    VacancyAnnouncement: p.VacancyAnnouncement
      ? {
          vacantFrom: p.VacancyAnnouncement.vacantFrom,
          notes: p.VacancyAnnouncement.notes,
          postedBy: p.VacancyAnnouncement.postedBy,
          postedByUserId: p.VacancyAnnouncement.postedByUserId,
        }
      : null,
  }));

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-[#f7f5f0] via-white to-[#eef0e8] flex justify-center">
      <div className="container max-w-7xl px-4 md:px-6 space-y-12">

        {/* ── Section header ── */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#789274] uppercase tracking-widest bg-[#789274]/10 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#789274] animate-pulse inline-block" />
            Upcoming Vacancies
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl text-gray-900">
            Plan Your Next Move
          </h2>
          <p className="text-gray-500 md:text-lg max-w-lg mx-auto">
            Properties becoming available soon — posted by landlords and tenants.
          </p>
        </div>

        {/* ── Inline posting form (landlords only) ── */}
        <LandingVacancyForm
          userId={userId}
          properties={landlordProperties}
        />

        {/* ── Announcement cards ── */}
        {announcements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((ann) => {
              const days = daysUntil(ann.vacantFrom);
              const countdown = getCountdownBadge(days);
              const poster = getPosterBadge(ann.postedBy);
              const img = ann.property.images?.[0]?.image ?? "/placeholder.jpg";
              const propertyTitle = `${ann.property.category.replace("_", " ")} in ${ann.property.location}`;
              const vacantDateStr = new Date(ann.vacantFrom).toLocaleDateString("en-NP", {
                day: "numeric", month: "short", year: "numeric",
              });

              return (
                <Link
                  key={ann.id}
                  href={`/property/${ann.propertyId}`}
                  className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl ${countdown.glow} transition-all duration-300 ring-1 ${countdown.ring} hover:ring-2 hover:-translate-y-1 flex flex-col`}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden shrink-0">
                    <Image src={img} alt={propertyTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className={`absolute top-3 left-3 ${countdown.bg} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                      {countdown.label}
                    </div>
                    <div className={`absolute top-3 right-3 ${poster.bg} backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full`}>
                      {poster.label}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                      <span className="text-white font-bold text-sm">
                        NPR {ann.property.price.toLocaleString()}
                        <span className="text-white/70 font-normal text-xs"> / month</span>
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">{propertyTitle}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 30"><path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 18 12 18S24 21 24 12C24 5.373 18.627 0 12 0zm0 16a4 4 0 110-8 4 4 0 010 8z"/></svg>
                      {ann.property.location}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      📅 Vacant from <span className="font-semibold text-gray-600">{vacantDateStr}</span>
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      {ann.property.noOfRooms && <span>🛏 {ann.property.noOfRooms} bed{ann.property.noOfRooms > 1 ? "s" : ""}</span>}
                      {ann.property.noOfBathrooms && <span>🚿 {ann.property.noOfBathrooms} bath{ann.property.noOfBathrooms > 1 ? "s" : ""}</span>}
                    </div>
                    {ann.notes && (
                      <p className="text-xs text-gray-500 italic line-clamp-2 bg-gray-50 rounded-xl px-3 py-2 mb-3 border border-gray-100">
                        &quot;{ann.notes}&quot;
                      </p>
                    )}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {ann.property.landlord.profileUrl ? (
                          <Image src={ann.property.landlord.profileUrl} alt={ann.property.landlord.name ?? "Landlord"} width={28} height={28} className="rounded-full border border-gray-200 object-cover shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                            {ann.property.landlord.name?.[0] ?? "?"}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-gray-700 leading-none">{ann.property.landlord.name ?? "Landlord"}</p>
                          <p className="text-[10px] text-gray-400 leading-none mt-0.5">Property owner</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#789274] group-hover:underline underline-offset-2">View details →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* No cards yet placeholder */
          <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white/60 rounded-3xl border border-dashed border-[#789274]/30">
            <span className="text-4xl">🏠</span>
            <p className="text-gray-500 text-sm text-center max-w-xs">
              No upcoming vacancies yet. Landlords can post one using the form above — it will appear here instantly.
            </p>
          </div>
        )}

        {/* Footer CTA */}
        {announcements.length > 0 && (
          <div className="flex justify-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-[#789274] hover:bg-[#5a6d56] text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-colors shadow-md">
              Browse All Listings
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
