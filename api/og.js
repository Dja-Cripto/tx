// Gera o card 1200x675 de cada resultado (mesmo visual do card do site).
import { ImageResponse } from '@vercel/og';
export const config = { runtime: 'edge' };

const POOL = 30e6, PLATFORM = 4.3e9;
const LIME = '#7dff6b', BG = '#050605', INK = '#071003', MUTED = '#88927f', LINE = '#1f281d';

async function font(family, weight) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`)).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  return (await fetch(src[1])).arrayBuffer();
}
const h = (type, style, children) => ({ type, props: { style, children } });
const nf = new Intl.NumberFormat('pt-BR');

export default async function handler(req) {
  const q = new URL(req.url).searchParams;
  const v = Math.max(0, Math.round(Number(q.get('v')) || 0));
  const f = Math.max(0, Number(q.get('f')) || 0);
  const adj = v && f ? Math.max(0.85, Math.min(1.15, 1 + (f / v / 0.0003 - 1) * 0.15)) : 1;
  const share = Math.min(1, v / PLATFORM), pts = share * POOL * adj;
  const [archivo, fell, mono] = await Promise.all([
    font('Archivo', 800), font('IM+Fell+English', 400), font('JetBrains+Mono', 700),
  ]);
  const label = (t, c = MUTED) => h('div', { fontFamily: 'Mono', fontSize: 18, color: c, letterSpacing: 2 }, t);
  const stat = (k, val) => h('div', { display: 'flex', flexDirection: 'column', gap: 6, width: 340 }, [label(k), h('div', { fontFamily: 'Mono', fontSize: 30, color: '#f2f5ef' }, val)]);

  const tree = h('div', { width: 1200, height: 675, background: BG, display: 'flex', padding: 40 }, [
    h('div', { flex: 1, border: `2px solid ${LINE}`, display: 'flex', flexDirection: 'column', padding: 38, gap: 26 }, [
      h('div', { display: 'flex', justifyContent: 'space-between' }, [label('SEASON 0 · CALCULADORA DE PONTOS'), label('@DJA_Chain', LIME)]),
      h('div', { display: 'flex', gap: 20, height: 330 }, [
        h('div', { width: 700, background: LIME, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px 32px' }, [
          label('EU DEVO RECEBER', '#1d4a12'),
          h('div', { fontFamily: 'Archivo', fontSize: pts >= 1e6 ? 110 : 150, color: INK, lineHeight: 1 }, nf.format(Math.round(pts))),
          h('div', { fontFamily: 'Fell', fontSize: 64, color: INK, lineHeight: 1 }, 'pontos'),
        ]),
        h('div', { flex: 1, border: `2px solid ${LIME}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 22px' }, [
          h('div', { fontFamily: 'Fell', fontSize: 74, color: LIME, lineHeight: 1 }, 'Season'),
          h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }, [
            label('NÃO OFICIAL'),
            h('div', { fontFamily: 'Fell', fontSize: 260, color: LIME, lineHeight: 0.75 }, '0'),
          ]),
        ]),
      ]),
      h('div', { display: 'flex' }, [
        stat('VOLUME', '$' + nf.format(v)),
        stat('FATIA DO POOL', (share * 100).toFixed(4).replace('.', ',') + '%'),
        stat('TAXAS PAGAS', f ? '$' + nf.format(Math.round(f)) : '—'),
      ]),
      label('Estimativa não oficial · convite: app.txflow.com/r/EE1EK0IACD'),
    ]),
  ]);

  return new ImageResponse(tree, {
    width: 1200, height: 675,
    fonts: [
      { name: 'Archivo', data: archivo, weight: 800 },
      { name: 'Fell', data: fell, weight: 400 },
      { name: 'Mono', data: mono, weight: 700 },
    ],
    headers: { 'cache-control': 'public, max-age=86400' },
  });
}
