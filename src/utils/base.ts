// Base path support: the site runs at the domain root by default,
// or under a subpath (e.g. /urd on GitHub Pages project sites).
// import.meta.env.BASE_URL is '/urd' when `base` is set in astro.config
// (no trailing slash — see utils/data.ts for why that matters),
// '/' otherwise. Stored content (post JSON, image urls) keeps the
// root-relative form '/post-assets/...'; only rendered links/urls get
// the base prefix, so the stored data never changes.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export const basePath = BASE; // '' at root, '/urd' under a subpath

/** Prefix a root-relative path ('/post/x', '/tag', '/') with the base. Absolute URLs pass through. */
export const withBase = (path: string): string => {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (BASE && path.startsWith(`${BASE}/`)) return path;
  if (path === "/") return BASE ? `${BASE}/` : "/";
  return `${BASE}${path}`;
};

/** Strip the base from a location.pathname so route checks see '/post/...' etc. */
export const stripBase = (pathname: string): string => {
  if (BASE && pathname.startsWith(BASE)) {
    return pathname.slice(BASE.length) || "/";
  }
  return pathname;
};
