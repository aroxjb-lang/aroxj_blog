// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { Locales } from "./app/lib/schemas";

const intlMiddleware = createIntlMiddleware(routing);

// All URLs (without locale prefix) that should be protected

function getLocale(pathname: string): string {
  // /en/dashboard -> "en"
  // /dashboard    -> defaultLocale
  const segments = pathname.split("/");
  const first = segments[1];

  if (routing.locales.includes(first as Locales)) {
    return first as string;
  }

  return routing.defaultLocale;
}

function stripLocale(pathname: string, locale: string): string {
  // "/en/dashboard" -> "/dashboard"
  if (pathname === `/${locale}`) return "/";
  if (pathname.startsWith(`/${locale}/`)) {
    return pathname.replace(`/${locale}`, "");
  }
  return pathname;
}

// 👇 main middleware
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locale = getLocale(pathname);
  const pathWithoutLocale = stripLocale(pathname, locale);

  const isProtected = pathWithoutLocale.startsWith("/admin");

  // read your auth info (replace with your own logic)
  // Example: cookie-based auth
  const token = request.cookies.get("session")?.value; // <-- change cookie name
  console.log(token, pathWithoutLocale, isProtected);

  // If route is protected and user is NOT authenticated -> redirect to /[locale]/login
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`; // or `/${locale}/auth/login` etc
    return NextResponse.redirect(url);
  }

  // User is allowed → continue to next-intl middleware (handles locales)
  return intlMiddleware(request);
}

// same matcher you already had
export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
