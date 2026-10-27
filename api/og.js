// Gera o card 1200x675 de cada resultado (mesmo visual do card do site).
import { ImageResponse } from '@vercel/og';
export const config = { runtime: 'edge' };

const SUPPLY = 1e9, DEFAULT_TOTAL = 47345544;
const LIME = '#7dff6b', BG = '#050605', INK = '#071003', MUTED = '#88927f', LINE = '#1f281d', FG = '#f2f5ef';

async function font(family, weight) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`)).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  return (await fetch(src[1])).arrayBuffer();
}
const h = (type, style, children) => ({ type, props: { style, children } });
const L = (n, d) => n.toLocaleString('pt-BR', { maximumFractionDigits: d });
const usd = n => n >= 1e9 ? '$' + L(n / 1e9, 2) + ' bi' : n >= 1e6 ? '$' + L(n / 1e6, 2) + ' mi' : '$' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const price = n => '$' + n.toLocaleString('pt-BR', { minimumFractionDigits: n < 1 ? 4 : 2, maximumFractionDigits: n < 1 ? 4 : 2 });

export default async function handler(req) {
  const q = new URL(req.url).searchParams;
  const P = Math.max(0, Math.round(Number(q.get('p')) || 0));
  const F = Math.max(0, Number(q.get('fdv')) || 100) * 1e6;
  const A = Math.min(100, Math.max(1, Number(q.get('a')) || 20)) / 100;
  const T = Math.max(1, Number(q.get('t')) || DEFAULT_TOTAL);
  const share = P / T, value = share * A * F, perPt = A * F / T;
  const [archivo, mono] = await Promise.all([font('Archivo', 800), font('JetBrains+Mono', 700)]);
  const label = (t, c = MUTED) => h('div', { fontFamily: 'Mono', fontSize: 18, color: c, letterSpacing: 2 }, t);
  const stat = (k, v) => h('div', { display: 'flex', flexDirection: 'column', gap: 6, width: 262 }, [label(k), h('div', { fontFamily: 'Mono', fontSize: 30, color: FG }, v)]);

  const tree = h('div', { width: 1200, height: 675, background: BG, display: 'flex', padding: 40 }, [
    h('div', { flex: 1, border: `2px solid ${LINE}`, display: 'flex', flexDirection: 'column', padding: 38, gap: 28 }, [
      h('div', { display: 'flex', justifyContent: 'space-between' }, [label('TXFLOW · CALCULADORA DE AIRDROP'), label('@DJA_Chain', LIME)]),
      h('div', { background: LIME, height: 250, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '30px 32px' }, [
        h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }, [
          label('AIRDROP ESTIMADO', '#1d4a12'),
          h('div', { fontFamily: 'Archivo', fontSize: value >= 1e6 ? 110 : 140, color: INK, lineHeight: 1 }, usd(value)),
        ]),
        h('div', { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }, [
          h('div', { fontFamily: 'Mono', fontSize: 34, color: INK }, P.toLocaleString('pt-BR')),
          h('div', { fontFamily: 'Mono', fontSize: 18, color: '#1d4a12', letterSpacing: 2 }, 'PONTOS'),
        ]),
      ]),
      h('div', { display: 'flex' }, [
        stat('FDV', usd(F)), stat('AIRDROP', Math.round(A * 100) + '%'), stat('1 PONTO', price(perPt)), stat('FATIA', L(share * 100, 4) + '%'),
      ]),
      label(`Pontos distribuídos: ${L(T / 1e6, 2)} mi · supply 1 bi · não oficial`),
      label('Convite: app.txflow.com/r/EE1EK0IACD'),
    ]),
  ]);

  return new ImageResponse(tree, {
    width: 1200, height: 675,
    fonts: [{ name: 'Archivo', data: archivo, weight: 800 }, { name: 'Mono', data: mono, weight: 700 }],
    headers: { 'cache-control': 'public, max-age=86400' },
  });
}
