/**
 * The ONLY client-side search code. Imported by /search/ alone, never the
 * global layout. All strings from Pagefind become text nodes, not innerHTML.
 */
type Scope = "all" | "library" | "grimoire";
type Group = "library" | "grimoire";
interface SearchHit {
  url: string;
  plain_excerpt?: string;
  meta?: { title?: string; description?: string };
}
interface PagefindAPI {
  search: (term: string, options?: { filters: { collection: Group } }) =>
    Promise<{ results: Array<{ data: () => Promise<SearchHit> }> }>;
}
interface SafeHit {
  href: string;
  collection: Group;
  title: string;
  excerpt: string;
}

const root = document.querySelector<HTMLElement>("[data-search-page]");
if (root) {
  const form = root.querySelector<HTMLFormElement>("[data-search-form]")!;
  const input = root.querySelector<HTMLInputElement>("[data-search-input]")!;
  const status = root.querySelector<HTMLElement>("[data-search-status]")!;
  const region = root.querySelector<HTMLElement>("[data-search-results]")!;
  let requestId = 0;
  let inputTimer: number | undefined;
  let apiPromise: Promise<{ api: PagefindAPI; routes: Set<string> } | null> | undefined;

  const validRoute = /^\/(library|grimoire)\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/;
  const validScope = (value: string | null): Scope =>
    value === "library" || value === "grimoire" ? value : "all";
  const readScope = (): Scope =>
    validScope(new FormData(form).get("scope")?.toString() ?? null);

  async function loadIndex(): Promise<{ api: PagefindAPI; routes: Set<string> } | null> {
    if (apiPromise) return apiPromise;
    apiPromise = (async () => {
      // The preview-only build intentionally has no Pagefind directory.
      const manifest = await fetch("/pagefind/indexed-routes.json", { cache: "no-store" });
      if (!manifest.ok) return null;
      const contents: unknown = await manifest.json().catch(() => null);
      if (!Array.isArray(contents) || !contents.every(
        (url) => typeof url === "string" && validRoute.test(url)
      ) || contents.length === 0) return null;

      // Dynamic import is deliberately confined to the search route.
      const modulePath = "/pagefind/pagefind.js";
      const api = await import(/* @vite-ignore */ modulePath) as PagefindAPI;
      return { api, routes: new Set(contents as string[]) };
    })();
    // Network failures must be retryable, not cached as a permanent empty index.
    try { return await apiPromise; } catch (error) { apiPromise = undefined; throw error; }
  }

  function clearResults() { region.replaceChildren(); }
  function showMessage(message: string) {
    const p = document.createElement("p");
    p.className = "editorial-search__empty";
    p.textContent = message;
    region.append(p);
  }
  function collectionOf(url: string): Group | null {
    const match = validRoute.exec(url);
    return match ? match[1] as Group : null;
  }
  function normalize(data: SearchHit, routes: Set<string>): SafeHit | null {
    let url: URL;
    try { url = new URL(data.url, window.location.origin); } catch { return null; }
    if (url.origin !== window.location.origin || url.search || url.hash ||
        !routes.has(url.pathname)) return null;
    const collection = collectionOf(url.pathname);
    if (!collection) return null;
    return {
      href: url.pathname,
      collection,
      title: (data.meta?.title || "Untitled article").trim(),
      excerpt: (data.plain_excerpt || data.meta?.description || "").trim(),
    };
  }

  function renderGroup(collection: Group, entries: SafeHit[]) {
    if (entries.length === 0) return;
    const section = document.createElement("section");
    section.className = "search-group";
    section.setAttribute("aria-label", collection === "library" ? "Library results" : "Grimoire results");
    const heading = document.createElement("h3");
    heading.textContent = collection === "library" ? "The Library" : "The Grimoire";
    section.append(heading);
    const list = document.createElement("ol");
    list.className = "search-group__items";
    for (const hit of entries) {
      const li = document.createElement("li");
      const card = document.createElement("article");
      card.className = "search-result";
      const source = document.createElement("p");
      source.className = "search-result__collection";
      source.textContent = collection === "library" ? "Research" : "Practice";
      const link = document.createElement("a");
      link.className = "search-result__title";
      link.href = hit.href;
      link.textContent = hit.title;
      card.append(source, link);
      if (hit.excerpt) {
        const excerpt = document.createElement("p");
        excerpt.className = "search-result__excerpt";
        excerpt.textContent = hit.excerpt;
        card.append(excerpt);
      }
      li.append(card);
      list.append(li);
    }
    section.append(list);
    region.append(section);
  }

  function syncUrl(method: "pushState" | "replaceState") {
    const params = new URLSearchParams();
    const q = input.value.trim().slice(0, 150);
    const scope = readScope();
    if (q) params.set("q", q);
    if (scope !== "all") params.set("scope", scope);
    const query = params.toString();
    window.history[method](null, "", "/search/" + (query ? "?" + query : ""));
  }

  async function runSearch() {
    const current = ++requestId;
    const q = input.value.trim().slice(0, 150);
    const scope = readScope();
    status.textContent = "Checking the published archive…";
    region.setAttribute("aria-busy", "true");
    clearResults();
    try {
      const index = await loadIndex();
      if (current !== requestId) return;
      if (!index) {
        status.textContent = "Search is not available yet.";
        showMessage("The searchable archive is being prepared. Finished Library and Grimoire articles will appear here when they are published.");
        return;
      }
      if (!q) {
        status.textContent = "Enter a search term to explore published articles.";
        return;
      }
      status.textContent = "Searching published articles…";
      const options = scope === "all" ? undefined : { filters: { collection: scope } };
      const answer = await index.api.search(q, options);
      if (current !== requestId) return;
      // Pagefind's order is relevance-ranked. Keep that order within groups.
      const results = await Promise.all(answer.results.slice(0, 40).map((hit) => hit.data()));
      if (current !== requestId) return;
      const safe = results.map((result) => normalize(result, index.routes))
        .filter((entry): entry is SafeHit => entry !== null);
      for (const collection of (["library", "grimoire"] as const)) {
        if (scope === "all" || scope === collection) {
          renderGroup(collection, safe.filter((entry) => entry.collection === collection));
        }
      }
      status.textContent = safe.length === 1 ? "1 published article found." :
        safe.length > 1 ? safe.length + " published articles found." :
        "No matching published articles.";
      if (safe.length === 0) showMessage("No published articles match that search. Try another term or switch between the Library and Grimoire.");
    } catch (error) {
      if (current !== requestId) return;
      status.textContent = "Search could not be loaded.";
      showMessage("Search is temporarily unavailable. You can browse the Library and Grimoire directly.");
      console.error("Mystagogia search failed", error);
    } finally {
      if (current === requestId) region.removeAttribute("aria-busy");
    }
  }

  function readUrl() {
    const params = new URLSearchParams(window.location.search);
    input.value = (params.get("q") || "").slice(0, 150);
    const scope = validScope(params.get("scope"));
    const radio = form.querySelector<HTMLInputElement>('input[name="scope"][value="' + scope + '"]');
    if (radio) radio.checked = true;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (inputTimer !== undefined) clearTimeout(inputTimer);
    syncUrl("pushState");
    void runSearch();
  });
  form.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement) || event.target.name !== "scope") return;
    if (inputTimer !== undefined) clearTimeout(inputTimer);
    syncUrl("pushState");
    void runSearch();
  });
  input.addEventListener("input", () => {
    if (inputTimer !== undefined) clearTimeout(inputTimer);
    inputTimer = window.setTimeout(() => {
      syncUrl("replaceState");
      void runSearch();
    }, 280);
  });
  window.addEventListener("popstate", () => { readUrl(); void runSearch(); });
  readUrl();
  void runSearch();
}
