import { clerkMiddleware } from '@clerk/nextjs/server';

import { NextResponse } from 'next/server';

// Make sure that the `/api/webhooks/(.*)` route is not protected here
export default clerkMiddleware({
    publicRoutes:["/api/webhooks/clerk","/sign-in","/sign-up"]
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};


