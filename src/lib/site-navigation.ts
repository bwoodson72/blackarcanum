export interface NavigationLink {
  label: string;
  href: string;
}

// These arrays must only contain reviewed, working routes.
// Library, Grimoire, About, Shop, Search and Subscribe are not live yet.
export const primaryNavigation: NavigationLink[] = [];
export const headerActions: NavigationLink[] = [];
export const mobileNavigation: NavigationLink[] = [{ label: "Home", href: "/" }];

// Footer-only contact and legal links. Enable only when their real routes and
// approved policy/contact details have been published; no placeholders.
export const footerInformationLinks: NavigationLink[] = [];
