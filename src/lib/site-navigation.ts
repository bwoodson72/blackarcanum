export interface NavigationLink {
  label: string;
  href: string;
}

// Library and Grimoire now have reviewed archive and article routes.
// Shop, Search and Subscribe remain hidden until their destinations are active.
export const primaryNavigation: NavigationLink[] = [
  { label: "Library", href: "/library/" },
  { label: "Grimoire", href: "/grimoire/" },
  { label: "About", href: "/about/" },
];
export const headerActions: NavigationLink[] = [];
export const mobileNavigation: NavigationLink[] = [
  { label: "Home", href: "/" },
  ...primaryNavigation,
];

// Footer-only contact and legal links. Enable only when their real routes and
// approved policy/contact details have been published; no placeholders.
export const footerInformationLinks: NavigationLink[] = [];
