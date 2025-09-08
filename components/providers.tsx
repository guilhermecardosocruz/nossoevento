"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { PropsWithChildren, useState } from "react";
export function Providers({ children }: PropsWithChildren) {
  const [qc] = useState(() => new QueryClient());
  return (<QueryClientProvider client={qc}>{children}<Toaster richColors position="top-right" /></QueryClientProvider>);
}
