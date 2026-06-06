import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  Link,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { TooltipProvider } from "#/components/addons/tooltip";
import { getCurrentUserFn } from "#/api/auth/auth.functions";
import {
  AnchoredToastProvider,
  ToastProvider,
} from "#/components/addons/toast";
import { OfflineBanner } from "#/components/common/OfflineBanner";

export interface AppUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
}

interface MyRouterContext {
  queryClient: QueryClient;
  user: AppUser | null;
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
  component: RootComponent,
  notFoundComponent: RootNotFound,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootNotFound() {
  return (
    <RootDocument>
      <div className="w-full h-full min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-lg font-semibold text-text-primary">
            Page not found
          </h1>
          <p className="text-sm text-text-muted">
            The page you are looking for does not exist.
          </p>
          <Link
            to="/dashboard"
            className="text-sm text-brand border-b border-transparent hover:border-brand"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </RootDocument>
  );
}

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
