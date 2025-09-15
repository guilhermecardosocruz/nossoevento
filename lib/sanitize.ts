// lib/sanitize.ts
// SSR/CSR-safe no runtime Node (Vercel). Evite usar em rotas Edge.
import DOMPurify from "isomorphic-dompurify";

/** Protocolos permitidos em href/src */
const SAFE_URL = /^(?:(?:https?|mailto|tel):|\/(?!\/)|#)/i;
/** Permite data URLs apenas para imagens */
const SAFE_DATA_IMAGE = /^data:image\//i;

const ALLOWED_TAGS = [
  "h1", "h2", "h3",
  "p", "b", "i", "strong", "em",
  "ul", "ol", "li",
  "a",
  "code", "pre", "blockquote",
  "img",
  "br", "hr"
] as const;

const ALLOWED_ATTR = [
  "href", "target", "rel",
  "src", "alt",
  // atributos de acessibilidade
  "title", "aria-label", "aria-describedby"
] as const;

/**
 * Sanitize de HTML pensado para conteúdo público (posts, descrições, etc).
 * - Bloqueia protocolos perigosos em href/src
 * - Força rel seguro quando target="_blank"
 * - Permite data: apenas para imagens
 */
export function sanitizeHtml(input: string): string {
  // Hooks aplicados apenas nesta chamada
  const removeDangerousUrls = DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
    if (data.attrName === "href" || data.attrName === "src") {
      const val = String(data.attrValue || "");
      const isSafeHttp = SAFE_URL.test(val);
      const isSafeDataImg = data.attrName === "src" && SAFE_DATA_IMAGE.test(val);
      if (!isSafeHttp && !isSafeDataImg) {
        // remove atributo perigoso
        data.keepAttr = false;
      }
    }
  });

  const enforceRelOnBlank = DOMPurify.addHook("afterSanitizeAttributes", (node: Element) => {
    if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
      const rel = (node.getAttribute("rel") || "").toLowerCase();
      // adiciona noopener/noreferrer se não existir
      const needed = ["noopener", "noreferrer"];
      const relParts = new Set(rel.split(/\s+/).filter(Boolean));
      needed.forEach((k) => relParts.add(k));
      node.setAttribute("rel", Array.from(relParts).join(" "));
    }
  });

  try {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ALLOWED_TAGS as unknown as string[],
      ALLOWED_ATTR: ALLOWED_ATTR as unknown as string[],
      // endurece o perfil
      USE_PROFILES: { html: true },
      KEEP_CONTENT: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      // redundante porque usamos ALLOWED_TAGS, mas mantém intenção explícita
      FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form", "input", "button", "link", "meta"],
    });
  } finally {
    // remove hooks para não vazar entre requisições
    DOMPurify.removeHook("uponSanitizeAttribute");
    DOMPurify.removeHook("afterSanitizeAttributes");
  }
}

/**
 * Variante mais rígida (sem <img> e sem <a> clicáveis).
 * Útil quando o conteúdo é totalmente não confiável.
 */
export function sanitizeStrict(input: string): string {
  const strictTags = ALLOWED_TAGS.filter((t) => t !== "img" && t !== "a");
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: strictTags as unknown as string[],
    ALLOWED_ATTR: [],
    USE_PROFILES: { html: true },
    KEEP_CONTENT: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });
}

