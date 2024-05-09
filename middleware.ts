import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/",
  "/collections",
  "/products",
  "/collections/new",
  "/products/new",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// matcher: [
//   "/((?!.*\\..*|_next).*)", // Don't run middleware on static files
//   "/", // Run middleware on index page
//   "/(api|trpc)(.*)", // Run middleware on API routes
// ],
