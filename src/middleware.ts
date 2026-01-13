import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
        // const token = req.cookies.get("session_token");
        // if (!token) {
        //     return NextResponse.redirect(new URL("/auth/login", req.url));
        // }

        return NextResponse.next();

        // if(req.nextUrl.pathname) {
        //     return NextResponse.redirect(new URL("/", req.url));
        // }
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/dashboard/:path*/:path*",
    ]
}
