"use client";

import { useState } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/get-query-client";
import { MixpanelProvider } from "@/components/providers/MixpanelProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <NuqsAdapter defaultOptions={{ shallow: false }}>
      <QueryClientProvider client={queryClient}>
        <MixpanelProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </MixpanelProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
