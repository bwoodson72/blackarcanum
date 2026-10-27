export interface NavigationLink {
  label: string;
  href: string;
}

// Only reviewed routes appear in navigation. Library, Grimoire, Shop,
// Search and Subscribe stay hidden until their destinations are active.
export const primaryNavigation: NavigationLink[] = [
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
