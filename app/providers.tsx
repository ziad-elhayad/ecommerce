// app/providers.tsx

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useCartStore } from '@/hooks/useCartStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((state) => state.initAuth);
  const initCart = useCartStore((state) => state.initCart);

  useEffect(() => {
    // Initialize auth state from localStorage
    if (initAuth) {
      initAuth();
    }
    
    // Initialize cart state (handled by zustand persist middleware)
    if (initCart) {
      initCart();
    }
  }, [initAuth, initCart]);

  return <>{children}</>;
}
