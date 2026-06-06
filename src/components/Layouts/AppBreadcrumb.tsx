import * as React from "react";
import { Fragment } from "react";
import {
  isMatch,
  Link,
  useMatches,
  useRouterState,
} from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../addons/breadcrumb";
import { Icon } from "@iconify/react";

export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface AppBreadcrumbProps {
  items?: BreadcrumbItemType[];
  separator?: React.ReactNode;
  suspendWhilePending?: boolean;
}

function dedupeBreadcrumbs(items: BreadcrumbItemType[]) {
  const map = new Map<string, BreadcrumbItemType>();

  for (const item of items) {
    const key = `${item.label}::${item.href ?? ""}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return Array.from(map.values());
}

function normalizeBreadcrumbs(items: unknown): BreadcrumbItemType[] {
  if (!Array.isArray(items)) return [];

  return items
    .filter(
      (item): item is BreadcrumbItemType =>
        typeof item === "object" &&
        item !== null &&
        "label" in item &&
        typeof item.label === "string",
    )
    .map((item) => ({
      label: item.label,
      href: typeof item.href === "string" ? item.href : undefined,
    }))
    .filter((item) => item.label.trim().length > 0);
}

function useRouterBreadcrumbItems(
  suspendWhilePending = false,
): BreadcrumbItemType[] {
  const matches = useMatches();

  const isRoutePending = useRouterState({
    select: (s) => s.location.href !== s.resolvedLocation?.href,
  });

  const items = React.useMemo(() => {
    const resolvedItems = matches.flatMap((match) => {
      if (isMatch(match, "loaderData.breadcrumbs")) {
        return normalizeBreadcrumbs(match.loaderData?.breadcrumbs);
      }

      if (Array.isArray(match.staticData?.breadcrumbs)) {
        return normalizeBreadcrumbs(match.staticData.breadcrumbs);
      }

      return [];
    });

    return dedupeBreadcrumbs(resolvedItems);
  }, [matches]);

  if (suspendWhilePending && isRoutePending) {
    return [];
  }

  return items;
}

export default function AppBreadcrumb({
  items,
  separator,
  suspendWhilePending = false,
}: AppBreadcrumbProps) {
  const routerItems = useRouterBreadcrumbItems(suspendWhilePending);
  const finalItems = items?.length ? items : routerItems;

  if (!finalItems.length) return null;

  return (
    <div className="relative w-full flex items-center flex-1 ml-1 pl-3 before:content-[''] before:absolute before:left-0 before:w-2.5 before:h-[0.02rem] before:bg-gray-400 after:content-[''] after:absolute after:left-0 after:-top-px after:w-[0.02rem] after:h-2.5 after:bg-gray-400">
      <Breadcrumb>
        <BreadcrumbList>
          {finalItems.map((item, index) => {
            const isLast = index === finalItems.length - 1;

            return (
              <Fragment key={`${item.href ?? item.label}-${index}`}>
                <BreadcrumbItem className="text-xxs">
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="font-medium border-b border-transparent text-text-secondary">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        className="text-brand border-b hover:border-brand"
                        to={item.href}
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {!isLast && (
                  <BreadcrumbSeparator className="text-tiny">
                    {separator ?? (
                      <Icon
                        icon="ei:chevron-right"
                        ssr={true}
                        className="scale-[1.5]"
                      />
                    )}
                  </BreadcrumbSeparator>
                )}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
