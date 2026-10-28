export interface NavigationLink {
  label: string;
  href: string;
  icon?: "search";
}

// Library and Grimoire now have reviewed archive and article routes.
// Search is live; Shop and Subscribe remain hidden until implemented.
export const primaryNavigation: NavigationLink[] = [
  { label: "Library", href: "/library/" },
  { label: "Grimoire", href: "/grimoire/" },
  { label: "About", href: "/about/" },
];
export const headerActions: NavigationLink[] = [{ label: "Search", href: "/search/", icon: "search" }];
export const mobileNavigation: NavigationLink[] = [
  { label: "Home", href: "/" },
  ...primaryNavigation,
  { label: "Search", href: "/search/" },
];

// Footer-only contact and legal links. Enable only when their real routes and
// approved policy/contact details have been published; no placeholders.
export const footerInformationLinks: NavigationLink[] = [];
