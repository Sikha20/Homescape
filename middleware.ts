import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * 🔒 Route Groups
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)"
]);

const isProtectedRoute = createRouteMatcher([
  "/create-property",
  "/my-properties",
  "/bookings"
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  const userRole = sessionClaims?.metadata?.role;

  console.log("User:", userId);
  console.log("Role:", userRole);

  /**
   * 🚫 1. Protect Auth Required Routes
   */
  if (!isPublicRoute(req) && isProtectedRoute(req) && !userId) {
    return redirectToSignIn({
      returnBackUrl: req.url,
    });
  }

  /**
   * 🔒 2. Protect Admin Routes
   */
  if (isAdminRoute(req)) {
    if (!userId) {
      return redirectToSignIn({
        returnBackUrl: req.url,
      });
    }

    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  /**
   * 🔁 3. Redirect Admins Automatically
   */
  if (!isAdminRoute(req) && userRole === "admin") {
    return NextResponse.redirect(
      new URL("/admin/dashboard", req.url)
    );
  }

  /**
   * ✅ Allow Request
   */
  return NextResponse.next();
});

/**
 * ⚙️ Middleware Config
 */
export const config = {
  matcher: [
    // Skip static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};