// AppLayout.tsx
import { Outlet, useRouter, useLocation } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import LogiquelWordMark from "../common/LogiquelWordMark";
import { getActiveRoute } from "#/config/route.config";
import { useLogoutMutation } from "#/api/auth/auth.mutations";
import Sidebar from "./Sidebar";
import AppBreadcrumb from "./AppBreadcrumb";

const AppLayout = () => {
  const router = useRouter();
  const { pathname } = useLocation();

  const activeRoute = getActiveRoute(pathname);
  const activeRouteLabel = activeRoute?.label ?? "Page";

  const logout = useLogoutMutation();

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#F9FBFC]">
      <div className="w-full min-h-0 flex-1 flex">
        {/* --- Sidebar --- */}
        <Sidebar />

        {/* --- Main Content --- */}
        <main className="flex-1 min-w-0 h-full flex flex-col">
          <header className="h-16 w-full flex items-center gap-2.5 px-4 pt-2 pb-1.5 bg-white border-b">
            <button
              onClick={() => router.history.back()}
              className="h-[60%] aspect-square shrink-0 flex items-center justify-center border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
            >
              <Icon
                icon="lets-icons:back"
                className="w-[50%] h-[50%] text-brand"
              />
            </button>
            <div className="flex flex-col">
              <h2 className="text-base text-text-primary flex items-center font-medium">
                {activeRouteLabel}
              </h2>
              <p className="text-xs text-text-muted">
                {/* {activeRoute?.description} */}
              </p>
              <AppBreadcrumb />
            </div>
          </header>

          <div className="flex-1 min-h-0 min-w-0">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="shrink-0 h-6 border-t border-border/50 bg-white flex items-center justify-between px-4">
        <div className="flex items-center">
          <span className="text-[10px] font-medium text-text-muted tracking-widest">
            BUILDER v<span className="text-text-primary">1.0</span>
          </span>
        </div>
        <div className="h-full flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-medium text-text-faint uppercase tracking-widest">
            Platform by
          </span>
          <div className="h-[55%] aspect-square shrink-0">
            <LogiquelWordMark />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
