// config/routeConfig.ts

export interface SubRoute {
  href: string;
  label: string;
}

export interface Route {
  key: string;
  href: string;
  label: string;
  description: string;
  icon: string;
  subRoutes?: SubRoute[];
}

export const routesConfig: Route[] = [
  {
    key: "dashboard",
    href: "/dashboard",
    label: "Dashboard",
    description: "Overview of your resumes and activity",
    icon: "tabler:layout-dashboard",
  },
  {
    key: "tailored-resumes",
    href: "/tailored-resumes", // Or your dynamic path like '/dashboard/analysis/report_id'
    label: "Resume Analysis",
    description: "Deep ATS scoring, visual teardowns, and optimization metrics",
    icon: "icon-park-solid:analysis", // Alternatively: 'tabler:report-analytics' or 'tabler:gauge'
  },
  // {
  //   key: "preview",
  //   href: "/preview",
  //   label: "Preview",
  //   description: "Preview your resume before exporting",
  //   icon: "mdi:paper",
  //   // Note: dynamic segment handled via `getActiveRoute` — /preview/:resume_id
  // },
  {
    key: "history",
    href: "/history",
    label: "History",
    description: "View version history of your resume changes",
    icon: "solar:history-linear",
    subRoutes: [
      { href: "/history/commits", label: "Commits" },
      { href: "/history/compare", label: "Compare Versions" },
    ],
  },
  {
    key: "templates",
    href: "/templates",
    label: "Templates",
    description: "Browse and apply ATS-friendly resume templates",
    icon: "tabler:template",
  },
  {
    key: "export",
    href: "/export",
    label: "Export",
    description: "Download your resume as PDF or other formats",
    icon: "tabler:file-export",
    subRoutes: [
      { href: "/export/pdf", label: "Export as PDF" },
      { href: "/export/json", label: "Export as JSON" },
    ],
  },
  {
    key: "settings",
    href: "/settings",
    label: "Settings",
    description: "Manage your account and preferences",
    icon: "tabler:settings",
    subRoutes: [
      { href: "/settings/profile", label: "Profile" },
      { href: "/settings/billing", label: "Billing" },
    ],
  },
];

export function getActiveRoute(pathname: string): Route | undefined {
  return routesConfig.find((route) => {
    if (route.subRoutes?.length) {
      return route.subRoutes.some(
        (subRoute) =>
          pathname === subRoute.href ||
          pathname.startsWith(`${subRoute.href}/`),
      );
    }
    return pathname === route.href || pathname.startsWith(`${route.href}/`);
  });
}

export function getActiveSubRoute(pathname: string): SubRoute | undefined {
  for (const route of routesConfig) {
    const match = route.subRoutes?.find(
      (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`),
    );
    if (match) return match;
  }
  return undefined;
}
