import "@tanstack/react-router";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    pageLabel?: string;
    pageDescription?: string;
    breadcrumbs?: BreadcrumbItem[];
  }
}
