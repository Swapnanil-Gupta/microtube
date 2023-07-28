import "./globals.css";
import type { Metadata } from "next";
import { fontSans } from "@/lib/fonts";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import AuthProvider from "@/components/auth-provider";
import ThemeProvider from "@/components/theme-provider";
import TailwindIndicator from "@/components/tailwind-indicator";
import SiteHeader from "@/components/site-header";
import clsx from "clsx";
import { Toaster } from "@/components/ui/toaster";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Microtube",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          "min-h-screen bg-white dark:bg-neutral-950 antialiased",
          fontSans.className
        )}
      >
        <AuthProvider session={session}>
          <ThemeProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
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
