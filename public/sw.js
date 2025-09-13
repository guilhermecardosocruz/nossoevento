// ---- PWA Service Worker (Next.js) -----------------------------------------
// Estratégias:
// - HTML: network-first (offline fallback do cache)
// - _next/static, fontes, imagens, css/js: cache-first
// - (Opcional) APIs/JSON: stale-while-revalidate (ver bloco comentado)
// ---------------------------------------------------------------------------

const CACHE_VERSION = "v1.0.0"; // ↑ aumente isto quando mudar a política de cache
const RUNTIME_HTML = `html-${CACHE_VERSION}`;
const RUNTIME_ASSETS = `assets-${CACHE_VERSION}`;
// Opcional: const RUNTIME_API = `api-${CACHE_VERSION}`;

const CORE_PRECACHE = [
  "/",               // home
  "/robots.txt",
  "/manifest.webmanifest", // caso use .webmanifest
  "/manifest.json",        // ou caso use .json
  "/favicon.ico",
];

// Instalação: pré-cache do essencial e ativa imediatamente
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(RUNTIME_HTML).then((cache) => cache.addAll(CORE_PRECACHE))
  );
  self.skipWaiting();
});

// Ativação: limpeza de versões antigas e tomada de controle
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
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

// Utilitários de match
const isHTML = (req) =>
  req.mode === "navigate" ||
  (req.headers.get("accept") || "").includes("text/html");

const isNextStatic = (url) =>
  url.pathname.startsWith("/_next/static/");

const isAssetLike = (req, url) => {
  if (isNextStatic(url)) return true;
  const dest = req.destination;
  return ["style", "script", "image", "font"].includes(dest);
};

// Opcional: trate APIs/JSON específicas do seu domínio
// const isApi = (url) =>
//   url.origin === self.location.origin && url.pathname.startsWith("/api/");

// Network-first para páginas HTML
async function handleHTML(event) {
  try {
    const fresh = await fetch(event.request);
    const cache = await caches.open(RUNTIME_HTML);
    cache.put(event.request, fresh.clone());
    return fresh;
  } catch {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    // fallback mínimo: tenta devolver a home precacheada
    return caches.match("/");
  }
}

// Cache-first para assets estáticos (_next/static, css/js/imagens/fontes)
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

// Stale-While-Revalidate para APIs (descomente caso queira usar)
// async function handleApi(event) {
//   const cache = await caches.open(RUNTIME_API);
//   const cached = await cache.match(event.request);
//   const networkPromise = fetch(event.request)
//     .then((resp) => {
//       if (resp && resp.ok) cache.put(event.request, resp.clone());
//       return resp;
//     })
//     .catch(() => cached); // se offline, cai no cache
//   return cached ? Promise.resolve(cached).then(() => networkPromise) : networkPromise;
// }

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Apenas GET é seguro para cache
  if (request.method !== "GET") return;

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

  // Demais requisições → cai no fetch normal
  // (ou adapte conforme necessário)
});

