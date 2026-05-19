// components/app-breadcrumb.tsx
import * as React from "react";
import { Fragment } from "react";
import { Link, isMatch, useMatches } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../addons/breadcrumb";

export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface AppBreadcrumbProps {
  items?: BreadcrumbItemType[];
  separator?: React.ReactNode;
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

function useRouterBreadcrumbItems(): BreadcrumbItemType[] {
  const matches = useMatches();

  const items = matches.flatMap((match: any) => {
    // We use any here specifically for the flatMap iteration
    // because matches are a complex union of all route types.

    const staticItems = Array.isArray(match.staticData?.breadcrumbs)
      ? match.staticData.breadcrumbs
      : undefined;

    const loaderItems = Array.isArray(match.loaderData?.breadcrumbs)
      ? match.loaderData.breadcrumbs
      : undefined;

    const breadcrumbs = loaderItems ?? staticItems ?? [];

    return breadcrumbs.map((item: { label: string; href: string }) => ({
      label: String(item.label),
      href: item.href,
    }));
  });

  return dedupeBreadcrumbs(items).filter((item) => Boolean(item.label));
}

export default function AppBreadcrumb({
  items,
  separator = "",
}: AppBreadcrumbProps) {
  const routerItems = useRouterBreadcrumbItems();
  const finalItems = items?.length ? items : routerItems;

  if (!finalItems.length) {
    return null;
  }

  return (
    <div className="relative w-full flex items-center flex-1  ml-1 pl-3 before:content-[''] before:absolute before:left-0 before:w-2 before:h-[0.01rem] before:bg-gray-400 after:content-[''] after:absolute after:left-0 after:top-0 after:w-[0.01rem] after:h-2 after:bg-gray-400">
      <Breadcrumb>
        <BreadcrumbList>
          {finalItems.map((item, index) => {
            const isLast = index === finalItems.length - 1;

            return (
              <Fragment key={`${item.href ?? item.label}-${index}`}>
                <BreadcrumbItem className="text-tiny">
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="font-medium border-b border-transparent text-text-primary">
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
                    {/* {separator} */}
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
