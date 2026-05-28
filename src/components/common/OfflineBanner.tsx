// src/components/common/offline-banner.tsx
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useNetworkStatus } from "#/hooks/useNetworkStatus";

export function OfflineBanner() {
  const isOnline = useNetworkStatus();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isOnline) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-9999 flex items-center justify-center gap-2 bg-yellow-500 px-4 py-2 text-xxs font-medium text-white shadow-md animate-in slide-in-from-top duration-300">
      <Icon icon="fluent:globe-off-28-regular" className="h-4 w-4 shrink-0" />
      <span>You’re offline. Some features may not be available.</span>
    </div>
  );
}
