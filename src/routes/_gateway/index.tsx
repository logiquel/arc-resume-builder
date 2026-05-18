import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_gateway/")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Your beautiful login form will go here */}
      <div className="p-8 bg-white border rounded-2xl shadow-sm">
        <h1 className="text-text-primary font-semibold">Logiquel Gateway</h1>
        <p className="text-xxs text-text-muted mt-1">
          Please sign in to continue
        </p>
      </div>
    </div>
  );
}
