'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { PropsWithChildren, useState } from 'react';

export function Providers({ children }: PropsWithChildren) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // não refaz fetch ao focar a aba (UX melhor para forms)
            refetchOnWindowFocus: false,
            // evita revalidar em background a cada mount
            refetchOnMount: false,
            // 1 retry para intermitência de rede (sem loop)
            retry: 1,
            // dados “frescos” por 5 min -> evita requisições repetidas
            staleTime: 1000 * 60 * 5,
            // mantém os dados em cache por 30 min
            gcTime: 1000 * 60 * 30,
          },
          mutations: {
            // 1 retry em mutações (criação/atualização) é o bastante
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={qc}>
      {children}
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

