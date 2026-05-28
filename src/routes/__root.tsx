import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
// import { TanStackDevtools } from "@tanstack/react-devtools";
// import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { TooltipProvider } from "#/components/addons/tooltip";
import { getCurrentUserFn } from "#/api/auth/auth.functions";
import {
  AnchoredToastProvider,
  ToastProvider,
} from "#/components/addons/toast";
import { OfflineBanner } from "#/components/common/OfflineBanner";
import { useNetworkStatus } from "#/hooks/useNetworkStatus";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const user = await getCurrentUserFn();

    return {
      user,
    };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "ARC Resume",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <HeadContent />
      </head>
      <body className="h-full overflow-hidden font-sans antialiased">
        <ToastProvider position="top-right">
          <AnchoredToastProvider>
            <TooltipProvider>
              <div className="w-full h-full">
                <OfflineBanner />
                {children}
              </div>
            </TooltipProvider>
          </AnchoredToastProvider>
        </ToastProvider>
        <Scripts />
      </body>
    </html>
  );
}
