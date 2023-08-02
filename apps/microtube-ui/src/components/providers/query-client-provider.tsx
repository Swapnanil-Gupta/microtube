"use client";

import queryClient from "@/lib/queryClient";
import { QueryClientProvider as QCProvider } from "@tanstack/react-query";

export default function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QCProvider client={queryClient}>{children}</QCProvider>;
}
