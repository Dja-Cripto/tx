// Página que o X lê ao montar a prévia do link: aponta o card certo e manda a pessoa para a calculadora.
export const config = { runtime: 'edge' };

export default function handler(req) {
  const url = new URL(req.url);
  const q = new URLSearchParams();
  for (const k of ['p', 'fdv', 'a', 't']) {
    const v = url.searchParams.get(k);
    if (v && /^[\d.]+$/.test(v)) q.set(k, v);
  }
  const img = `${url.origin}/api/og?${q}`;
  const dest = `${url.origin}/?${q}`;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Calculadora de Airdrop TxFlow</title>
<meta property="og:title" content="Calculadora de Airdrop TxFlow">
<meta property="og:description" content="Quanto seus pontos da TxFlow podem valer. Não oficial.">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="675">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${img}">
<meta http-equiv="refresh" content="0;url=${dest}">
</head><body><a href="${dest}">Abrir calculadora</a></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}
