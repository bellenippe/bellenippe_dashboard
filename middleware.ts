// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher([
//   "/",
//   "/collections",
//   "/products",
//   "/collections/new",
//   "/products/new",
// ]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect();
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// matcher: [
//   "/((?!.*\\..*|_next).*)", // Don't run middleware on static files
//   "/", // Run middleware on index page
//   "/(api|trpc)(.*)", // Run middleware on API routes
// ],

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log(req.nextUrl.pathname);
    console.log(req.nextauth.token?.role);

    if (
      req.nextUrl.pathname.startsWith("/orders") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
    if (
      req.nextUrl.pathname.startsWith("/customers") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
    if (
      req.nextUrl.pathname.startsWith("/products") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
    if (
      req.nextUrl.pathname.startsWith("/collections") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
    if (
      req.nextUrl.pathname.startsWith("/dashboard") &&
      req.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/products", "/dashboard", "/collections", "/orders", "/customers"],
};
