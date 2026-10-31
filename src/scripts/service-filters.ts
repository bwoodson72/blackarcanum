type ServiceFilterKind = "all" | "reading" | "spellwork";
const labels: Record<ServiceFilterKind, string> = { all: "All", reading: "Readings", spellwork: "Spellwork" };

/** Native, scoped progressive enhancement; the original server-rendered catalog
 * remains complete and ordered for no-JS readers and search crawlers. */
export function initializeServiceFilters(scope: ParentNode = document): void {
  for (const root of scope.querySelectorAll<HTMLElement>("[data-service-filter]")) {
    if (root.dataset.serviceFilterReady) continue;
    const controls = root.querySelector<HTMLElement>("[data-service-filter-controls]");
    const count = root.querySelector<HTMLElement>("[data-service-count]");
    const empty = root.querySelector<HTMLElement>("[data-service-filter-empty]");
    if (!controls || !count || !empty) continue;
    const buttons = [...controls.querySelectorAll<HTMLButtonElement>("button[data-service-filter-kind]")];
    const apply = (kind: ServiceFilterKind) => {
      // Read current authoritative metadata, never label text or a second catalog.
      const items = [...root.querySelectorAll<HTMLLIElement>("[data-service-grid] > li")];
      let visible = 0;
      for (const item of items) {
        const cardKind = item.querySelector<HTMLElement>("[data-service-kind]")?.dataset.serviceKind;
        item.hidden = kind !== "all" && cardKind !== kind;
        if (!item.hidden) visible++;
      }
      for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.serviceFilterKind === kind));
      count.textContent = `${visible} of ${items.length} ${items.length === 1 ? "service" : "services"} · ${labels[kind]}`;
      empty.hidden = visible !== 0;
      empty.textContent = kind === "all" ? "No services to display." :
        kind === "reading" ? "No readings to display in this sphere." : "No spellwork to display in this sphere.";
    };
    for (const button of buttons) {
      button.addEventListener("click", () => {
        const kind = button.dataset.serviceFilterKind;
        if (kind === "all" || kind === "reading" || kind === "spellwork") apply(kind);
      });
    }
    apply("all");
    root.dataset.serviceFilterReady = "true";
    controls.hidden = false;
  }
}
