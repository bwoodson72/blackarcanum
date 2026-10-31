export interface NavigationLink {
  label: string;
  href: string;
  icon?: "search";
  matchSubpaths?: boolean;
}

/** Centralized link composition; existing destinations keep exact matching. */
export function getSiteNavigation(servicesVisible = false) {
  const primaryNavigation: NavigationLink[] = [
    { label: "Library", href: "/library/" },
    { label: "Grimoire", href: "/grimoire/" },
    ...(servicesVisible ? [{ label: "Services", href: "/services/", matchSubpaths: true }] : []),
    { label: "About", href: "/about/" },
  ];
  const headerActions: NavigationLink[] = [{ label: "Search", href: "/search/", icon: "search" }];
  const mobileNavigation: NavigationLink[] = [{ label: "Home", href: "/" }, ...primaryNavigation, ...headerActions];
  return { primaryNavigation, headerActions, mobileNavigation };
}

/** Local/static consumers default closed; public shells use the shared live gate. */
export const { primaryNavigation, headerActions, mobileNavigation } = getSiteNavigation();

export function navigationCurrent(pathname: string, link: NavigationLink): "page" | "location" | undefined {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return undefined;
  const path = pathname.replace(/\/+$/, "") || "/";
  const href = link.href.replace(/\/+$/, "") || "/";
  if (path === href) return "page";
  if (link.matchSubpaths && href !== "/" && path.startsWith(href + "/")) return "location";
  return undefined;
}

// Footer-only contact and legal links. Enable only when their real routes and
// approved policy/contact details have been published; no placeholders.
export const footerInformationLinks: NavigationLink[] = [];
