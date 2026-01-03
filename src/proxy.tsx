import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
]);

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
]);


export default clerkMiddleware(async (auth, req) => {

    const { userId } = await auth();

    if (userId && isPublicRoute(req)) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    if (!userId) {
        if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }
    }

    return NextResponse.next();

});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}

