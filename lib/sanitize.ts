// Versão leve, sem dependências externas.
export function sanitizeHtml(input: string): string {
  if (!input) return "";

  // remove <script>…</script>
  const noScripts = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // remove atributos on* (onclick, onerror, etc.)
  const noOnAttrs = noScripts.replace(/\son\w+=(?:"[^"]*"|'[^']*')/gi, "");

  // mantém apenas tags permitidas
  const allowedTags = /(\/?(h1|h2|h3|p|b|i|strong|em|ul|ol|li|a|code|pre|blockquote|img|br|hr))( |>)/i;
  const stripped = noOnAttrs.replace(/<([^>]+)>/g, (match) => {
    return allowedTags.test(match) ? match : "";
  });

  return stripped;
}

