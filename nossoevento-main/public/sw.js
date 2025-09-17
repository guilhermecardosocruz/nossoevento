// ---- PWA Service Worker (Next.js + Vercel) --------------------------------
// Estratégias:
// - HTML (navegação): network-first com Navigation Preload + cache de fallback
// - _next/static, fontes, imagens, css/js: cache-first
// - (Opcional) APIs/JSON: stale-while-revalidate (bloco comentado)
// ---------------------------------------------------------------------------

const CACHE_VERSION = "v1.0.1";
const RUNTIME_HTML = `html-${CACHE_VERSION}`;
const RUNTIME_ASSETS = `assets-${CACHE_VERSION}`;
// Opcional: const RUNTIME_API = `api-${CACHE_VERSION}`;

const CORE_PRECACHE = [
  "/",                   // home
  "/robots.txt",
  "/manifest.webmanifest",
  "/favicon.ico",
];

// Util: adiciona ao cache ignorando falhas individuais
async function precacheSafe(cache, urls) {
  await Promise.all(
    urls.map((u) =>
      cache.add(u).catch(() => {
        // Arquivo opcional ausente? Ignora.
      })
    )
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(RUNTIME_HTML);
      await precacheSafe(cache, CORE_PRECACHE);
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Habilita Navigation Preload (acelera primeiras respostas)
      if ("navigationPreload" in self.registration) {
        try {
          await self.registration.navigationPreload.enable();
        } catch {}
      }

      // Limpa versões antigas
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => ![RUNTIME_HTML, RUNTIME_ASSETS /*, RUNTIME_API*/].includes(k))
          .map((k) => caches.delete(k))
      );

      await self.clients.claim();
    })()
  );
});

// --------- Helpers de identificação ----------
const isHTML = (req) =>
  req.mode === "navigate" ||
  (req.headers.get("accept") || "").includes("text/html");

const isNextStatic = (url) => url.pathname.startsWith("/_next/static/");

const isAssetLike = (req, url) => {
  if (isNextStatic(url)) return true;
  const dest = req.destination;
  return ["style", "script", "image", "font"].includes(dest);
};

// const isApi = (url) =>
//   url.origin === self.location.origin && url.pathname.startsWith("/api/");

// --------- Estratégias ----------
async function handleHTML(event) {
  const cache = await caches.open(RUNTIME_HTML);

  // Tenta usar Navigation Preload se disponível
  try {
    const preload = await event.preloadResponse;
    if (preload) {
      cache.put(event.request, preload.clone());
      return preload;
    }
  } catch {}

  try {
    const fresh = await fetch(event.request, { credentials: "same-origin" });
    if (fresh && fresh.ok) {
      cache.put(event.request, fresh.clone());
    }
    return fresh;
  } catch {
    // offline: tenta cache desta rota
    const cached = await cache.match(event.request);
    if (cached) return cached;
    // fallback mínimo para home (precache)
    const home = await cache.match("/");
    if (home) return home;
    return Response.error();
  }
}

async function handleAsset(event, url) {
  const cached = await caches.match(event.request);
  if (cached) return cached;

  const resp = await fetch(event.request);
  // Só cacheia respostas válidas
  if (resp && resp.ok && (resp.type === "basic" || resp.type === "opaque")) {
    const cache = await caches.open(RUNTIME_ASSETS);
    cache.put(event.request, resp.clone());
  }
  return resp;
}

// async function handleApi(event) {
//   const cache = await caches.open(RUNTIME_API);
//   const cached = await cache.match(event.request);
//   const networkPromise = fetch(event.request)
//     .then((resp) => {
//       if (resp && resp.ok) cache.put(event.request, resp.clone());
//       return resp;
//     })
//     .catch(() => cached || Response.error());
//   return cached ? cached : networkPromise;
// }

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (isHTML(request)) {
    event.respondWith(handleHTML(event));
    return;
  }

  if (isAssetLike(request, url)) {
    event.respondWith(handleAsset(event, url));
    return;
  }

  // if (isApi(url)) {
  //   event.respondWith(handleApi(event));
  //   return;
  // }

  // demais reqs: segue fluxo normal
});

