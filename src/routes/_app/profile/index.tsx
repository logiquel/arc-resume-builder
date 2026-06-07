import { Icon } from "@iconify/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/profile/")({
  component: RouteComponent,
  loader: async () => {
    return {
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Profile", href: undefined },
      ],
    };
  },
});

function RouteComponent() {
  const totalCredits = 50;
  const usedCredits = 13;

  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <div className="w-[60%] h-[90%] flex flex-col gap-5">
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-lg font-display italic font-semibold tracking-[0.5px] text-text-primary border-b py-2">
            My Account
          </h2>

          <div className="w-full grid grid-cols-3 gap-5 mt-2">
            <div className="w-full flex flex-col">
              <label className="uppercase text-xxs text-brand font-medium">
                First Name
              </label>
              <span className="text-sm text-text-primary">Praveen</span>
            </div>

            <div className="w-full flex flex-col">
              <label className="uppercase text-xxs text-brand font-medium">
                Last Name
              </label>
              <span className="text-sm text-text-primary">Lohar</span>
            </div>

            <div className="w-full flex flex-col">
              <label className="uppercase text-xxs text-brand font-medium">
                Registered Email
              </label>
              <span className="text-sm text-text-primary">
                praveenlohar.in@gmail.com
              </span>
            </div>

            <div className="w-full flex flex-col col-span-3">
              <label className="uppercase text-xxs text-brand font-medium">
                User ID
              </label>
              <span className="text-xs text-text-primary font-mono font-medium">
                #47b73d39-2ddf-4095-84e3-10...
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <h2 className="text-lg font-display italic font-semibold tracking-[0.5px] text-text-primary border-b py-2">
            Subscription
          </h2>

          <div
            className="w-full flex flex-col gap-3 mt-2 border rounded-3xl p-4 shadow-xl"
            style={{
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            }}
          >
            <span className="text-xs text-text-muted pl-1">
              Active Subscription
            </span>

            <div className="w-full flex items-center gap-3">
              <div className="h-14 aspect-square flex items-center justify-center rounded-full border bg-gray-50">
                <Icon
                  icon="pepicons-print:crown"
                  className="w-[50%] h-[50%] text-orange-500"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-display italic font-semibold tracking-[0.5px] text-text-primary">
                  Pro
                </span>
                <span className="text-xxs text-text-secondary">
                  ₹299 billed monthly
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col">
              <span className="text-xxs">
                Access premium resume tailoring, AI optimization, and advanced
                tools.
              </span>
              <span className="text-xxs text-text-secondary">
                Next renewal on 17 December 2026
              </span>
            </div>

            <div className="w-full flex flex-col mt-1">
              <span className="text-brand text-xxs uppercase font-medium">
                AI Credits
              </span>

              <div className="flex items-center gap-x-1 mt-2">
                {Array.from({ length: totalCredits }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-6 w-[0.32rem] ${
                      index < usedCredits ? "bg-brand" : "bg-gray-100"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="text-xxs text-text-secondary">
                  <span className="font-medium text-text-primary">
                    {usedCredits}
                  </span>{" "}
                  of {totalCredits} credits used
                </p>

                <p className="text-xxs font-medium text-brand">
                  {totalCredits - usedCredits} remaining
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
