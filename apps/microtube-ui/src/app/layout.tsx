import "./globals.css";
import type { Metadata } from "next";
import { fontSans } from "@/lib/fonts";
import AuthProvider from "@/components/auth-provider";
import ThemeProvider from "@/components/theme-provider";
import TailwindIndicator from "@/components/tailwind-indicator";
import SiteHeader from "@/components/site-header";
import clsx from "clsx";
import { Toaster } from "@/components/ui/toaster";
import SiteFooter from "@/components/site-footer";
import UserActions from "@/components/user-actions";

export const metadata: Metadata = {
  title: "Microtube",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          "min-h-screen bg-white dark:bg-neutral-950 antialiased",
          fontSans.className
        )}
      >
        <AuthProvider>
          <ThemeProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <UserActions />
              <div className="flex-1 container">{children}</div>
              <SiteFooter />
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
