import { Icon } from "@iconify/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { routesConfig } from "#/config/route.config";
import { Tooltip, TooltipContent, TooltipTrigger } from "../addons/tooltip";
import AppLogo from "./AppLogo";
import { useLogoutMutation } from "#/api/auth/auth.mutations";

const Sidebar = () => {
  const routes = routesConfig;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [isSidebarCollapse, setIsSidebarCollapse] = useState(true);
  const [openRoutes, setOpenRoutes] = useState<Record<string, boolean>>({});
  const toggleRoute = (key: string) => {
    setOpenRoutes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  return (
    <aside
      className={`${isSidebarCollapse ? "w-13" : "w-[18vw]"} h-full flex flex-col bg-white shrink-0 border-r transition-width duration-300`}
    >
      <div className="w-full h-13 flex justify-between p-2">
        <div className="h-full aspect-square flex items-center justify-center">
          {isSidebarCollapse ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsSidebarCollapse((prev) => !prev)}
                  className="h-full aspect-square flex items-center justify-center cursor-pointer"
                >
                  <Icon
                    icon="mynaui:panel-left-solid"
                    className="w-[45%] h-[45%] text-text-muted"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xxs!">
                Expand Sidebar
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              to="/"
              className="h-[90%] flex flex-col items-center justify-center pl-2"
            >
              <AppLogo />
            </Link>
          )}
        </div>
        {!isSidebarCollapse && (
          <button
            onClick={() => setIsSidebarCollapse((prev) => !prev)}
            className="h-full aspect-square flex items-center justify-center cursor-pointer"
          >
            <Icon
              icon="mynaui:panel-left-solid"
              className="w-[45%] h-[45%] text-text-muted"
            />
          </button>
        )}
      </div>

      <div className="w-full flex-1 flex flex-col min-h-0 py-3 overflow-y-auto">
        {routes.map((route) => {
          const isRouteActive =
            pathname === route.href ||
            pathname.startsWith(route.href + "/") ||
            route.subRoutes?.some(
              (sub) =>
                pathname === sub.href || pathname.startsWith(sub.href + "/"),
            );
          const isRouteActiveAndSidebarOpen =
            isRouteActive && !isSidebarCollapse;

          const hasSubRoutes = !!route.subRoutes?.length;
          const isOpen = openRoutes[route.key] ?? true;

          return (
            <section key={route.key} className="w-full overflow-hidden">
              <Link
                to={route.href}
                onClick={() => {
                  if (hasSubRoutes) {
                    setOpenRoutes((prev) => ({
                      ...prev,
                      [route.key]: true,
                    }));
                  }
                }}
                className={`flex items-center h-13 ${isSidebarCollapse ? "p-0" : "p-2"}`}
              >
                <div
                  className={`w-full h-full z-10 flex items-center ${isRouteActiveAndSidebarOpen ? "bg-brand text-white rounded-full" : "text-text-muted hover:text-text-primary"}`}
                >
                  <div className="h-full aspect-square flex items-center justify-center shrink-0">
                    <div
                      className={`h-full aspect-1/1.5 rounded-full flex items-center justify-center ${isSidebarCollapse && isRouteActive && "bg-brand text-white"}`}
                    >
                      <Icon icon={route.icon} className="text-sm" />
                    </div>
                  </div>
                  {!isSidebarCollapse && (
                    <div className="h-full flex-1 flex items-center min-w-0">
                      <p className="text-xs truncate">{route.label}</p>
                    </div>
                  )}
                  {!isSidebarCollapse && hasSubRoutes && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleRoute(route.key);
                      }}
                      className="h-full aspect-square flex items-center justify-center shrink-0 cursor-pointer mr-1"
                    >
                      <Icon
                        icon="mdi:chevron-down"
                        className={`text-sm transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                  )}
                </div>
              </Link>

              <div
                style={{
                  height:
                    !isSidebarCollapse && hasSubRoutes && isOpen
                      ? `${route.subRoutes!.length * 32}px`
                      : "0px",
                }}
                className={`w-full flex flex-col transition-[height] duration-300 ${isOpen && !isSidebarCollapse ? "" : "overflow-hidden"}`}
              >
                {route.subRoutes?.map((sub) => {
                  const isSubActive =
                    pathname === sub.href ||
                    pathname.startsWith(sub.href + "/");
                  return (
                    <Link
                      key={sub.href}
                      to={sub.href}
                      className={`relative w-full min-h-8 flex items-center pl-6.5 pr-3 transition-colors ${
                        isSubActive
                          ? "text-brand font-medium"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      <span className="absolute top-0 -translate-y-1/2 w-[0.025rem] h-full bg-gray-300" />
                      <span className="min-w-3 h-[0.025rem] bg-gray-300" />
                      <div className="flex-1 flex items-center">
                        <Icon
                          icon="pepicons-print:square-filled"
                          className="text-xs"
                        />
                        <p className="text-xs ml-1 whitespace-nowrap overflow-hidden">
                          {sub.label}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <div className="w-full border-t py-2">
        {/* Profile */}
        <Tooltip disableHoverableContent={!isSidebarCollapse}>
          <TooltipTrigger asChild>
            <Link
              to="/profile"
              className={`flex items-center h-13 ${
                isSidebarCollapse ? "p-0" : "p-2"
              }`}
            >
              <div
                className={`w-full h-full z-10 flex items-center ${
                  pathname === "/profile" || pathname.startsWith("/profile/")
                    ? !isSidebarCollapse
                      ? "bg-brand text-white rounded-full"
                      : ""
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <div className="h-full aspect-square flex items-center justify-center shrink-0">
                  <div
                    className={`h-full aspect-1/1.5 rounded-full flex items-center justify-center ${
                      isSidebarCollapse &&
                      (pathname === "/profile" ||
                        pathname.startsWith("/profile/"))
                        ? "bg-brand text-white"
                        : ""
                    }`}
                  >
                    <Icon
                      icon="ri:user-6-line"
                      className={`text-sm ${pathname === "/profile" || pathname.startsWith("/profile/") ? "text-white" : "text-brand"}`}
                    />
                  </div>
                </div>

                {!isSidebarCollapse && (
                  <div className="h-full flex-1 flex items-center min-w-0">
                    <p className="text-xs truncate">Profile</p>
                  </div>
                )}
              </div>
            </Link>
          </TooltipTrigger>

          {isSidebarCollapse && (
            <TooltipContent side="right" className="text-xxs!">
              Profile
            </TooltipContent>
          )}
        </Tooltip>

        {/* Logout */}
        <Tooltip disableHoverableContent={!isSidebarCollapse}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className={`w-full flex items-center h-13 cursor-pointer group disabled:cursor-not-allowed text-destructive disabled:text-text-muted disabled:opacity-45 ${
                isSidebarCollapse ? "p-0" : "p-2"
              }`}
            >
              <div
                className={`w-full h-full z-10 flex items-center ${!isSidebarCollapse && "group-hover:bg-destructive/5 rounded-md"}`}
              >
                <div className="h-full aspect-square flex items-center justify-center shrink-0">
                  <div
                    className={`h-full aspect-1/1.5 rounded-full flex items-center justify-center ${isSidebarCollapse && "group-hover:bg-destructive/5"}`}
                  >
                    <Icon
                      icon={
                        isLoggingOut
                          ? "mingcute:loading-fill"
                          : "ri:logout-circle-line"
                      }
                      className={`text-sm ${isLoggingOut && "animate-spin text-destructive! opacity-100!"} `}
                    />
                  </div>
                </div>

                {!isSidebarCollapse && (
                  <div className="h-full flex-1 flex items-center min-w-0">
                    <p className="text-xs truncate">Logout</p>
                  </div>
                )}
              </div>
            </button>
          </TooltipTrigger>

          {isSidebarCollapse && (
            <TooltipContent side="right" className="text-xxs!">
              Logout
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;
