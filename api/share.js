// Página que o X lê ao montar a prévia do link: aponta o card certo e manda a pessoa para a calculadora.
export const config = { runtime: 'edge' };

export default function handler(req) {
  const url = new URL(req.url);
  const v = Math.max(0, Math.round(Number(url.searchParams.get('v')) || 0));
  const img = `${url.origin}/api/og?v=${v}`;
  const dest = `${url.origin}/?v=${v}`;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Calculadora de Pontos TxFlow · Season 0</title>
<meta property="og:title" content="Calculadora de Pontos TxFlow · Season 0">
<meta property="og:description" content="Estimativa não oficial. Calcule os seus pontos.">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="675">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${img}">
<meta http-equiv="refresh" content="0;url=${dest}">
</head><body><a href="${dest}">Abrir calculadora</a></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}
