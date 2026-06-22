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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bebas = localFont({
  src: "../fonts/bebasNeue.ttf",
  display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://aroxjblog.am"),

	title: {
		default: "AroxjBlog",
		template: "%s | AroxjBlog",
	},

	description:
		"Health, lifestyle, wellness and beauty articles.",

	openGraph: {
		type: "website",
		siteName: "AroxjBlog",
		locale: "hy_AM",
	},

	twitter: {
		card: "summary_large_image",
	},

	robots: {
		index: true,
		follow: true,
	},
};
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
