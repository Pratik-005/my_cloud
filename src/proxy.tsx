import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
]);

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
]);


export default clerkMiddleware(async (auth, req) => {

    const { userId } = auth();

    const path = req.nextUrl.pathname;
    const isApiRequest = req.nextUrl.pathname.startsWith("/api")

    if (userId && isPublicRoute(req)) {
        return NextResponse.redirect(new URL("/home", req.url))
    }

    if (!userId) {

        // If user is not logged in and trying to access a protected route
        if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }

        // If the request is for a protected API and the user is not logged in
        if (isApiRequest && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url))
        }

    }


    return NextResponse.next();

})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}