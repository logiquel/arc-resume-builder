import AppLayout from "#/components/Layouts/AppLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  pendingComponent: () => <div>Loading...</div>,
  component: AppLayout,
});
