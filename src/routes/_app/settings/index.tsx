import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings/")({
  component: RouteComponent,
  loader: async () => {
    return {
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Account Settings", href: undefined },
      ],
    };
  },
});

function RouteComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      Settings
    </div>
  );
}
