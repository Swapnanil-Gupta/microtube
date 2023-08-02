"use client";

import AuthProvider from "./auth-provider";
import ThemeProvider from "./theme-provider";
import QueryClientProvider from "./query-client-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider>{children}</QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
