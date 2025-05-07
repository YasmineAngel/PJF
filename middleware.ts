import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // This will protect all routes except static files and Next.js internals
    '/((?!_next|.*\\..*).*)',
    '/', 
    '/(api|trpc)(.*)',
  ],
};
