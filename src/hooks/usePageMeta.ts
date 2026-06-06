import { useMatches, useRouterState } from "@tanstack/react-router";

export interface PageMeta {
  pageLabel?: string;
  pageDescription?: string;
}

export function usePageMeta(): PageMeta {
  const matches = useMatches();

  const isRoutePending = useRouterState({
    select: (s) => s.location.href !== s.resolvedLocation?.href,
  });

  if (isRoutePending) {
    return {
      pageLabel: undefined,
      pageDescription: undefined,
    };
  }

  for (let i = matches.length - 1; i >= 0; i--) {
    const staticData = matches[i].staticData as
      | { pageLabel?: string; pageDescription?: string }
      | undefined;

    if (staticData?.pageLabel || staticData?.pageDescription) {
      return {
        pageLabel: staticData.pageLabel,
        pageDescription: staticData.pageDescription,
      };
    }
  }

  return {};
}
