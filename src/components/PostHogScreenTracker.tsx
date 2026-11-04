import { useEffect, useRef } from 'react';
import { usePathname } from 'expo-router';

import { posthog } from '@/config/posthog';

export function PostHogScreenTracker() {
  const pathname = usePathname();
  const onceki = useRef<string | null>(null);

  useEffect(() => {
    if (pathname && posthog && pathname !== onceki.current) {
      onceki.current = pathname;
      void posthog.screen(pathname, {
        screen_name: pathname,
      });
    }
  }, [pathname]);

  return null;
}

