import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host");

  if (url.pathname.includes(".") || url.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const currentHost =
    process.env.NODE_ENV === "production"
      ? hostname?.replace(`.${process.env.NEXT_PUBLIC_ROOT_URL}`, "")
      : hostname?.replace(`.localhost:3000`, "");

  if (url.pathname.startsWith(`/_sites`)) {
    return NextResponse.rewrite(`/404`);
  }

  if (!url.pathname.includes(".") && !url.pathname.startsWith("/api")) {
    if (
      hostname?.startsWith("localhost:3000") ||
      hostname?.startsWith(process.env.NEXT_PUBLIC_ROOT_URL!) ||
      hostname === "www.nftdapper.xyz"
    ) {
      return NextResponse.next();
    }

    url.pathname = `/_sites/${currentHost}${url.pathname}`;

    return NextResponse.rewrite(url);
  }
}
