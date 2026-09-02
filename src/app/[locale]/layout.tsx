import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import localFont from "next/font/local";
import MUIThemeProvider from "../lib/context/themeContext";
import Loading from "../components/LoadingCircule";
import Scripts from "../components/Scripts";
import { Locales } from "../lib/schemas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bebas = localFont({
  src: "../fonts/bebasNeue.ttf",
  display: "swap",
});

const DESCRIPTIONS: Record<Locales, string> = {
  am: "Հայկական առողջ ապրելակերպի, բժշկության, գեղեցկության և ճամփորդությունների մասին հոդվածներ AroxjBlog-ում։",
  en: "Armenian health, lifestyle, wellness and beauty articles on AroxjBlog.",
  ru: "Армянские статьи о здоровье, образе жизни, красоте и путешествиях на AroxjBlog.",
};

const OG_LOCALES: Record<Locales, string> = {
  am: "hy_AM",
  en: "en_US",
  ru: "ru_RU",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locales) in DESCRIPTIONS ? (locale as Locales) : "am";

  return {
    metadataBase: new URL("https://aroxjblog.am"),

    title: {
      default: "AroxjBlog",
      template: "%s | AroxjBlog",
    },

    description: DESCRIPTIONS[l],

    alternates: {
      languages: {
        hy: "https://aroxjblog.am",
        en: "https://aroxjblog.am/en",
        ru: "https://aroxjblog.am/ru",
        "x-default": "https://aroxjblog.am",
      },
    },

    openGraph: {
      type: "website",
      siteName: "AroxjBlog",
      locale: OG_LOCALES[l],
    },

    twitter: {
      card: "summary_large_image",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  // await signup()

  return (
    <html lang={locale}>
      <body className={` ${bebas.className} ${geistSans.variable} `}>
        <Scripts />
        <NextIntlClientProvider>
          <MUIThemeProvider>
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </MUIThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
