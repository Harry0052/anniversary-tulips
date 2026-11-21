/* Night-sky tulips. Stems rise, buds open one by one, then fireworks
   settle into the words. Colors come from the variables in styles.css. */

const NS = "http://www.w3.org/2000/svg";
const FINALE_AT = 7.2;
const GROWTH_END = 7.4;

const PETAL_TALL =
  "M 0 1 C -6.5 0 -11.5 -18 -9 -36 C -7 -48 -3 -58 0 -61 C 3 -58 7 -48 9 -36 C 11.5 -18 6.5 0 0 1 Z";
const PETAL_SIDE =
  "M 0 2 C -5.5 0 -9.5 -16 -7.2 -32 C -5.4 -44 -2 -52 0 -55 C 2 -52 5.4 -44 7.2 -32 C 9.5 -16 5.5 0 0 2 Z";
const PETAL_FRONT =
  "M 0 3 C -9 1 -14 -14 -10.5 -30 C -8 -42 -3.2 -50 0 -52 C 3.2 -50 8 -42 10.5 -30 C 14 -14 9 1 0 3 Z";
const SHINE = "M -2.2 -16 C -6.2 -24 -6 -38 -2.4 -48 C 0.4 -36 0.2 -24 -1.2 -16 Z";
const CLEFT = "M 0 -10 C -1.5 -18 -1.6 -34 0 -44 C 1.6 -34 1.5 -18 0 -10 Z";
const CALYX =
  "M -7 1 C -13 7 -11 15 -4 12 C -8 8 -5 4 -7 1 Z M 7 1 C 13 7 11 15 4 12 C 8 8 5 4 7 1 Z M -5.5 1.5 C -7 7 0 9 0 9 C 0 9 7 7 5.5 1.5 C 3 4.5 -3 4.5 -5.5 1.5 Z";
const LEAF = "M 0 0 C -15 -14 -18 -50 0 -96 C 18 -50 15 -14 0 0 Z";
const SHEEN = "M -1 -18 C -7 -36 -6 -68 -1 -88 C 2 -64 2 -34 -1 -18 Z";
const VEIN = "M 0 -8 C -0.4 -32 0.4 -62 0 -88";

const TULIPS = [
  { id: "b1", x: 210, y: 504, h: 334, lean: -2, bend: 10, tone: "hot", sx: 0.98, sy: 1.02, spread: 30, stem: 0.22, bloom: 2.05, leaves: 2, phase: 0.2 },
  { id: "b2", x: 203, y: 508, h: 304, lean: -12, bend: -12, tone: "blush", sx: 0.94, sy: 0.98, spread: 28, stem: 0.32, bloom: 2.48, leaves: 2, phase: 1.1 },
  { id: "b3", x: 218, y: 508, h: 312, lean: 11, bend: 14, tone: "soft", sx: 0.96, sy: 1, spread: 32, stem: 0.28, bloom: 2.66, leaves: 2, phase: 2.0 },
  { id: "b4", x: 196, y: 512, h: 252, lean: -21, bend: -8, tone: "cream", sx: 0.92, sy: 0.96, spread: 26, stem: 0.46, bloom: 3.12, leaves: 2, phase: 0.6 },
  { id: "b5", x: 226, y: 512, h: 258, lean: 19, bend: 9, tone: "rose", sx: 0.92, sy: 0.98, spread: 30, stem: 0.42, bloom: 3.32, leaves: 2, phase: 1.7 },
  { id: "b6", x: 190, y: 516, h: 208, lean: -31, bend: -6, tone: "soft", sx: 0.86, sy: 0.92, spread: 24, stem: 0.6, bloom: 3.72, leaves: 1, phase: 2.4 },
  { id: "b7", x: 232, y: 516, h: 212, lean: 29, bend: 7, tone: "blush", sx: 0.88, sy: 0.94, spread: 26, stem: 0.56, bloom: 3.92, leaves: 1, phase: 0.9 },
  { id: "f1", x: 206, y: 528, h: 230, lean: -7, bend: 6, tone: "cream", sx: 1.08, sy: 1.08, spread: 38, stem: 0.7, bloom: 4.28, leaves: 2, phase: 1.4, front: true },
  { id: "f2", x: 222, y: 530, h: 222, lean: 8, bend: -9, tone: "hot", sx: 1.12, sy: 1.1, spread: 40, stem: 0.78, bloom: 4.58, leaves: 2, phase: 2.2, front: true },
  { id: "f3", x: 194, y: 534, h: 178, lean: -16, bend: 5, tone: "rose", sx: 1.02, sy: 1.02, spread: 36, stem: 0.9, bloom: 4.95, leaves: 1, phase: 0.4, front: true },
  { id: "f4", x: 232, y: 534, h: 174, lean: 15, bend: -5, tone: "soft", sx: 1, sy: 1.02, spread: 34, stem: 0.96, bloom: 5.2, leaves: 1, phase: 1.9, front: true },
  { id: "f5", x: 214, y: 542, h: 156, lean: 2, bend: 4, tone: "blush", sx: 1.14, sy: 1.12, spread: 42, stem: 1.06, bloom: 5.5, leaves: 1, phase: 2.7, front: true },
];

const EXTRA_LEAVES = [
  { x: 162, y: 528, rot: -78, s: 1.05, d: 1.25, shut: 16 },
  { x: 258, y: 530, rot: 76, s: 1.12, d: 1.38, shut: -14 },
  { x: 146, y: 552, rot: -108, s: 0.82, d: 1.55, shut: 12 },
  { x: 274, y: 554, rot: 104, s: 0.88, d: 1.62, shut: -10 },
];

const CUES = [
  { t: 0.28, x: 0.2, y: 0.15, style: "peony", p: 0 },
  { t: 1.15, x: 0.8, y: 0.13, style: "chrys", p: 1 },
  { t: 2.05, x: 0.48, y: 0.18, style: "heart", p: 2 },
  { t: 2.95, x: 0.26, y: 0.26, style: "willow", p: 1 },
  { t: 3.8, x: 0.76, y: 0.2, style: "peony", p: 3 },
  { t: 4.65, x: 0.16, y: 0.17, style: "ring", p: 0 },
  { t: 5.45, x: 0.84, y: 0.16, style: "heart", p: 2 },
  { t: 6.3, x: 0.38, y: 0.12, style: "chrys", p: 1 },
  { t: FINALE_AT, finale: true },
];

const STYLES = {
  peony: { n: 56, speed: 2.35, life: 52, gravity: 0.014, drag: 0.986, trail: true },
  chrys: { n: 74, speed: 3.5, life: 64, gravity: 0.01, drag: 0.99, trail: true },
  willow: { n: 50, speed: 2.05, life: 86, gravity: 0.03, drag: 0.993, trail: true },
  heart: { n: 64, speed: 1.15, life: 70, gravity: 0.018, drag: 0.99, trail: true, shape: "heart", scale: 0.62 },
  ring: { n: 48, speed: 3.05, life: 48, gravity: 0.008, drag: 0.988, trail: false, shape: "ring" },
  pop: { n: 16, speed: 2.1, life: 24, gravity: 0.012, drag: 0.97, trail: true },
};

const bootSeek = Math.max(0, Math.min(40, parseFloat(new URLSearchParams(location.search).get("at")) || 0));
const prefersCalm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  calm: prefersCalm && bootSeek === 0,
  cueIndex: 0,
  finaleStarted: false,
  textLocked: false,
  textBounds: null,
  nextIdle: 12.4,
  tapCount: 0,
  w: 1,
  h: 1,
  dpr: 1,
  raf: 0,
  last: performance.now(),
  fps: 60,
  frames: 0,
  fpsStamp: performance.now(),
};

const tulips = [];
const fades = [];
const extraLeaves = [];
let bowEl = null;
const parts = [];
const letters = [];
const rockets = [];
const flashes = [];
const delayed = [];
const stars = [];
const motes = [];
const sprites = new Map();

const svg = document.getElementById("bouquet");
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d", { alpha: true });
const drifts = document.getElementById("drifts");

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOutBack(t) {
  const c1 = 1.12;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
let clock = bootSeek;

function sceneTime() {
  return clock;
}
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function hexToRgb(input) {
  const value = input.trim();
  if (value.startsWith("rgb")) {
    const nums = value.match(/[\d.]+/g).map(Number);
    return nums.slice(0, 3);
  }
  const hex = value.replace("#", "");
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}
function starPath(r) {
  const i = r * 0.28;
  return `M 0 ${-r} L ${i} ${-i} L ${r} 0 L ${i} ${i} L 0 ${r} L ${-i} ${i} L ${-r} 0 L ${-i} ${-i} Z`;
}
function stemPath(h, bend) {
  return `M 0 0 C ${bend} ${(-h * 0.34).toFixed(1)} ${(-bend * 0.45).toFixed(1)} ${(-h * 0.72).toFixed(1)} 0 ${-h}`;
}
function cubicPoint(h, bend, t) {
  const p0 = { x: 0, y: 0 };
  const p1 = { x: bend, y: -h * 0.34 };
  const p2 = { x: -bend * 0.45, y: -h * 0.72 };
  const p3 = { x: 0, y: -h };
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

function gradientDefs() {
  const tones = ["hot", "blush", "soft", "cream", "rose"];
  const grads = tones
    .map(
      (tone) => `
      <linearGradient id="${tone}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" style="stop-color: var(--${tone}-light)"/>
        <stop offset="46%" style="stop-color: var(--${tone}-mid)"/>
        <stop offset="100%" style="stop-color: var(--${tone}-deep)"/>
      </linearGradient>
      <linearGradient id="${tone}-back" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" style="stop-color: var(--${tone}-mid)"/>
        <stop offset="58%" style="stop-color: var(--${tone}-deep)"/>
        <stop offset="100%" style="stop-color: var(--${tone}-deep)"/>
      </linearGradient>`
    )
    .join("");
  return `<defs>
    ${grads}
    <linearGradient id="leafGrad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" style="stop-color: var(--leaf-deep)"/>
      <stop offset="48%" style="stop-color: var(--leaf)"/>
      <stop offset="100%" style="stop-color: var(--leaf-sheen)"/>
    </linearGradient>
    <linearGradient id="stemGrad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" style="stop-color: var(--stem)"/>
      <stop offset="100%" style="stop-color: var(--stem-light)"/>
    </linearGradient>
    <linearGradient id="paperFront" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style="stop-color: var(--paper)"/>
      <stop offset="100%" style="stop-color: var(--paper-shadow)"/>
    </linearGradient>
    <linearGradient id="paperBack" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" style="stop-color: var(--blush-light)"/>
      <stop offset="100%" style="stop-color: var(--paper-shadow)"/>
    </linearGradient>
    <radialGradient id="groundGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color: var(--rose); stop-opacity: 0.42"/>
      <stop offset="70%" style="stop-color: var(--rose); stop-opacity: 0.08"/>
      <stop offset="100%" style="stop-color: var(--rose); stop-opacity: 0"/>
    </radialGradient>
  </defs>`;
}

function leafMarkup(x, y, rot, scale, delay, shut) {
  return `<g data-place="leaf" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${scale})">
    <g data-part="leaf-spin" data-delay="${delay}" data-shut="${shut}">
      <path class="leaf-shape" fill="url(#leafGrad)" d="${LEAF}"/>
      <path class="leaf-sheen" d="${SHEEN}"/>
      <path class="vein" d="${VEIN}"/>
    </g>
  </g>`;
}

function tulipMarkup(flower) {
  const leaves = [];
  const count = flower.leaves;
  const slots = count === 1 ? [0.48] : [0.34, 0.52];
  slots.forEach((slot, index) => {
    const t = Math.min(0.7, Math.max(slot, 62 / flower.h));
    const p = cubicPoint(flower.h, flower.bend, t);
    const side = index % 2 === 0 ? -1 : 1;
    const rot = side * (index === 0 ? 62 : 74);
    const sc = (0.78 + index * 0.18) * clamp(flower.h / 260, 0.75, 1.15);
    const delay = flower.stem + 0.55 + index * 0.16 + t * 0.4;
    leaves.push(leafMarkup(p.x, p.y, rot * (flower.lean > 0 && index === 0 ? 1 : 1), sc, delay.toFixed(2), side * -18));
  });
  const sparks = [
    [18, -26, 0.4, "gold", 4.2],
    [-16, -22, 1.7, "cream", 3.4],
    [2, -64, 2.6, "gold", 3.2],
    [24, -48, 3.3, "cream", 2.6],
  ]
    .map(
      ([sx, sy, seed, kind, r]) =>
        `<g class="spark ${kind}" data-part="spark" data-seed="${seed}" transform="translate(${sx} ${sy})"><path d="${starPath(r)}"/></g>`
    )
    .join("");

  return `<g class="sway tone-${flower.tone}" data-id="${flower.id}" data-x="${flower.x}" data-y="${flower.y}">
    <g transform="rotate(${flower.lean} ${flower.x} ${flower.y})">
      <g transform="translate(${flower.x} ${flower.y})">
        <path class="stem" data-part="stem" stroke="url(#stemGrad)" d="${stemPath(flower.h, flower.bend)}"/>
        ${leaves.join("")}
        <g data-part="bloom" transform="translate(0 ${-flower.h}) scale(${flower.sx} ${flower.sy})">
          <path data-part="calyx" d="${CALYX}" style="opacity:0"/>
          <g data-part="petal" data-which="back" style="opacity:0"><path class="body" fill="url(#${flower.tone}-back)" d="${PETAL_TALL}"/></g>
          <g data-part="petal" data-which="left" style="opacity:0"><path class="body" fill="url(#${flower.tone})" d="${PETAL_SIDE}"/></g>
          <g data-part="petal" data-which="right" style="opacity:0"><path class="body" fill="url(#${flower.tone})" d="${PETAL_SIDE}"/></g>
          <g data-part="petal" data-which="front" style="opacity:0">
            <path class="body" fill="url(#${flower.tone})" d="${PETAL_FRONT}"/>
            <path class="shine" d="${SHINE}"/>
          </g>
          <path data-part="throat" d="${CLEFT}" style="opacity:0"/>
          <g data-part="stamens" style="opacity:0">
            <rect x="-2.3" y="-30" width="1.35" height="9" rx="0.7"/>
            <rect x="1.05" y="-32" width="1.35" height="10" rx="0.7"/>
            <circle cx="-1.6" cy="-31" r="1.45"/>
            <circle cx="1.7" cy="-33" r="1.45"/>
          </g>
          ${sparks}
        </g>
      </g>
    </g>
  </g>`;
}

function wrapMarkup() {
  return `
    <ellipse data-fade data-d="0.05" data-dur="0.9" cx="210" cy="600" rx="180" ry="78" fill="url(#groundGlow)"/>
    <g data-fade data-d="0.08" data-dur="0.75">
      <path fill="url(#paperBack)" d="M 184 458 C 156 520 140 580 136 622 L 284 622 C 280 580 264 520 236 458 Q 210 478 184 458 Z"/>
    </g>
  `;
}

function frontWrapMarkup() {
  return `
    <g data-fade data-d="0.16" data-dur="0.75">
      <path fill="url(#paperFront)" d="M 172 498 C 148 548 130 592 124 632 L 296 632 C 290 592 272 548 248 498 Q 210 520 172 498 Z"/>
      <path fill="var(--paper-shadow)" opacity="0.45" d="M 176 510 C 158 555 148 595 146 630 L 196 630 L 188 514 Z"/>
      <path fill="none" stroke="var(--paper-edge)" stroke-width="1.25" opacity="0.8" d="M 196 508 L 178 630"/>
      <path fill="none" stroke="var(--paper-edge)" stroke-width="1.25" opacity="0.8" d="M 226 508 L 246 630"/>
      <path fill="none" stroke="var(--paper)" stroke-width="2.5" opacity="0.95" d="M 176 496 Q 210 518 244 496"/>
      <path fill="none" stroke="var(--gold)" stroke-width="1.15" opacity="0.8" d="M 160 502 Q 210 522 260 502"/>
    </g>
    <g data-fade data-d="0.42" data-dur="0.45">
      <path fill="var(--hot)" d="M 154 492 Q 210 516 266 492 Q 270 506 264 512 Q 210 534 156 512 Q 150 504 154 492 Z"/>
      <path fill="none" stroke="var(--gold)" stroke-width="1.1" opacity="0.85" d="M 160 496 Q 210 516 260 496"/>
    </g>
    <g id="bow">
      <path fill="var(--hot)" stroke="var(--gold)" stroke-width="0.8" d="M 210 500 C 196 464 146 460 142 496 C 138 532 186 534 210 508 Z"/>
      <path fill="var(--hot-deep)" opacity="0.35" d="M 208 502 C 196 478 162 474 156 500 C 164 512 190 516 208 506 Z"/>
      <path fill="var(--hot)" stroke="var(--gold)" stroke-width="0.8" d="M 210 500 C 224 464 274 460 278 496 C 282 532 234 534 210 508 Z"/>
      <path fill="var(--hot-light)" opacity="0.4" d="M 214 500 C 236 476 262 478 270 500 C 258 512 230 514 214 504 Z"/>
      <path fill="none" stroke="var(--hot)" stroke-width="7.5" stroke-linecap="round" d="M 198 510 C 172 546 158 576 146 614"/>
      <path fill="none" stroke="var(--gold)" stroke-width="1.3" stroke-linecap="round" opacity="0.9" d="M 198 510 C 172 546 158 576 146 614"/>
      <path fill="none" stroke="var(--hot-deep)" stroke-width="6.5" stroke-linecap="round" d="M 222 510 C 252 544 268 570 286 612"/>
      <path fill="none" stroke="var(--gold)" stroke-width="1.2" stroke-linecap="round" opacity="0.85" d="M 222 510 C 252 544 268 570 286 612"/>
      <ellipse cx="210" cy="504" rx="9" ry="7.5" fill="var(--gold)"/>
      <ellipse cx="210" cy="504" rx="4.2" ry="3.4" fill="var(--hot-deep)"/>
    </g>
  `;
}

function buildBouquet() {
  const back = TULIPS.filter((flower) => !flower.front).map(tulipMarkup).join("");
  const front = TULIPS.filter((flower) => flower.front).map(tulipMarkup).join("");
  const extras = EXTRA_LEAVES.map((leaf) => leafMarkup(leaf.x, leaf.y, leaf.rot, leaf.s, leaf.d, leaf.shut)).join("");
  svg.innerHTML = `${gradientDefs()}
    <g id="back-row">${back}</g>
    ${wrapMarkup()}
    <g id="front-row">${front}</g>
    ${frontWrapMarkup()}
    <g id="extra-leaves">${extras}</g>`;

  svg.querySelectorAll(".sway").forEach((node) => {
    const flower = TULIPS.find((item) => item.id === node.dataset.id);
    const petals = {};
    node.querySelectorAll('[data-part="petal"]').forEach((petal) => {
      petals[petal.dataset.which] = petal;
    });
    const record = {
      ...flower,
      sway: node,
      stemEl: node.querySelector('[data-part="stem"]'),
      stemLen: 0,
      leaves: [...node.querySelectorAll('[data-part="leaf-spin"]')].map((el) => ({
        el,
        delay: parseFloat(el.dataset.delay),
        shut: parseFloat(el.dataset.shut),
      })),
      petals,
      throat: node.querySelector('[data-part="throat"]'),
      stamens: node.querySelector('[data-part="stamens"]'),
      calyx: node.querySelector('[data-part="calyx"]'),
      bloomEl: node.querySelector('[data-part="bloom"]'),
      sparks: [...node.querySelectorAll('[data-part="spark"]')].map((el) => ({
        el,
        seed: parseFloat(el.dataset.seed),
      })),
      sparked: bootSeek > flower.bloom + 1.3,
    };
    record.stemLen = record.stemEl.getTotalLength() || flower.h;
    record.stemEl.style.strokeDasharray = String(record.stemLen);
    record.stemEl.style.strokeDashoffset = String(record.stemLen);
    tulips.push(record);
  });

  svg.querySelectorAll("[data-fade]").forEach((el) => {
    fades.push({
      el,
      delay: parseFloat(el.dataset.d || "0"),
      dur: parseFloat(el.dataset.dur || "0.6"),
    });
  });
  svg.querySelectorAll("#extra-leaves [data-part='leaf-spin']").forEach((el) => {
    extraLeaves.push({
      el,
      delay: parseFloat(el.dataset.delay),
      shut: parseFloat(el.dataset.shut),
    });
  });
  bowEl = svg.querySelector("#bow");
}

function setPetal(el, rot, scale, opacity) {
  if (!el) return;
  el.style.opacity = opacity.toFixed(3);
  el.setAttribute("transform", `rotate(${rot.toFixed(2)}) scale(${scale.toFixed(3)})`);
}

function updateLeaf(leaf, t) {
  const u = clamp((t - leaf.delay) / 0.9, 0, 1);
  const e = easeOutCubic(u);
  leaf.el.style.opacity = u === 0 ? "0" : String(Math.min(1, u * 2.4));
  const rot = leaf.shut * (1 - e);
  const sx = lerp(0.1, 1, e);
  const sy = lerp(0.34, 1, e);
  leaf.el.setAttribute("transform", `rotate(${rot.toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`);
}

function bloomState(flower, t) {
  const appearAt = flower.stem + 1.02;
  if (t < appearAt) return { vis: 0, open: 0 };
  if (t < flower.bloom) return { vis: clamp((t - appearAt) / 0.34, 0, 1), open: 0 };
  return { vis: 1, open: easeOutCubic(clamp((t - flower.bloom) / 1.32, 0, 1)) };
}

function updateTulip(flower, t) {
  const stemU = clamp((t - flower.stem) / 1.16, 0, 1);
  flower.stemEl.style.strokeDashoffset = String(flower.stemLen * (1 - easeOutCubic(stemU)));
  flower.leaves.forEach((leaf) => updateLeaf(leaf, t));

  const { vis, open } = bloomState(flower, t);
  const bud = vis <= 0 ? 0.2 : lerp(lerp(0.36, 0.82, vis), 1, open);
  setPetal(flower.petals.back, 0, bud, vis);
  const side = easeOutCubic(clamp(open, 0, 1));
  const sideVis = clamp(open / 0.22, 0, 1);
  setPetal(flower.petals.left, -flower.spread * side, lerp(0.5, 1, side), sideVis);
  setPetal(flower.petals.right, flower.spread * side, lerp(0.5, 1, side), sideVis);
  const frontVis = clamp((open - 0.06) / 0.28, 0, 1);
  setPetal(flower.petals.front, 0, lerp(0.55, 1, open), frontVis);
  flower.throat.style.opacity = String(clamp((open - 0.28) / 0.45, 0, 0.85));
  flower.stamens.style.opacity = String(clamp((open - 0.42) / 0.4, 0, 0.95));
  flower.calyx.style.opacity = String(vis);

  const live = t > flower.bloom + 0.35;
  flower.sparks.forEach((spark) => {
    if (!live) {
      spark.el.style.opacity = "0";
      return;
    }
    const tw = 0.5 + 0.5 * Math.sin(t * 2.5 + spark.seed);
    spark.el.style.opacity = String(tw * tw);
  });

  if (!flower.sparked && open > 0.62) {
    flower.sparked = true;
    if (!state.calm && sceneTime() < flower.bloom + 2.1) puffAt(flower);
  }
}

function updateWrap(t) {
  fades.forEach((piece) => {
    const u = clamp((t - piece.delay) / piece.dur, 0, 1);
    piece.el.style.opacity = String(easeOutCubic(u));
  });
  extraLeaves.forEach((leaf) => updateLeaf(leaf, t));
  if (!bowEl) return;
  const u = clamp((t - 0.62) / 0.58, 0, 1);
  const scale = lerp(0.3, 1, easeOutBack(u));
  bowEl.style.opacity = String(clamp(u * 1.5, 0, 1));
  bowEl.setAttribute("transform", `translate(210 504) scale(${scale.toFixed(3)}) translate(-210 -504)`);
}

function applySway(t) {
  const amount = state.calm ? 0 : 1;
  tulips.forEach((flower) => {
    const angle =
      amount *
      (Math.sin(t * 1.05 + flower.phase) * 1.2 + Math.sin(t * 0.41 + flower.phase * 1.7) * 0.38);
    flower.sway.setAttribute("transform", `rotate(${angle.toFixed(3)} ${flower.x} ${flower.y})`);
  });
}

function applyScene(t) {
  tulips.forEach((flower) => updateTulip(flower, t));
  updateWrap(t);
  applySway(t);
}

function puffAt(flower) {
  const pt = svgPoint(flower.bloomEl, 0, -36);
  if (!pt) return;
  const palette = paletteFor(flower.tone);
  for (let i = 0; i < 12; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.35 + Math.random() * 1.25;
    parts.push({
      type: "spark",
      x: pt.x,
      y: pt.y,
      px: pt.x,
      py: pt.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.55,
      life: 26 + Math.random() * 18,
      max: 44,
      color: palette[i % palette.length],
      size: 2.2 + Math.random() * 2.2,
      gravity: 0.012,
      drag: 0.985,
      trail: false,
    });
  }
}

function svgPoint(el, x, y) {
  if (!el || !svg.createSVGPoint) return null;
  const point = svg.createSVGPoint();
  point.x = x;
  point.y = y;
  const matrix = el.getScreenCTM();
  if (!matrix) return null;
  const screen = point.matrixTransform(matrix);
  return { x: screen.x, y: screen.y };
}

function buildDrifts() {
  const colors = ["var(--hot)", "var(--blush)", "var(--cream)", "var(--soft)", "var(--gold)", "var(--rose)"];
  const count = 11;
  let html = "";
  for (let i = 0; i < count; i += 1) {
    const x = 8 + ((i * 37) % 84);
    html += `<i class="drift" style="--x:${x}%;--s:${7 + (i % 4) * 2}px;--c:${colors[i % colors.length]};--o:${0.45 + (i % 3) * 0.12};--dur:${9 + (i % 5) * 1.4}s;--delay:${4.6 + i * 0.45}s;--dx:${(i % 2 === 0 ? -1 : 1) * (18 + (i % 4) * 10)}px;--r:${(i % 2 === 0 ? -1 : 1) * (12 + i * 7)}deg"></i>`;
  }
  drifts.innerHTML = html;
}

function resize() {
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.w = window.innerWidth;
  state.h = window.innerHeight;
  canvas.width = Math.round(state.w * state.dpr);
  canvas.height = Math.round(state.h * state.dpr);
  canvas.style.width = `${state.w}px`;
  canvas.style.height = `${state.h}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  if (!stars.length) seedSky();
}

function seedSky() {
  stars.length = 0;
  motes.length = 0;
  const count = Math.round(clamp(state.w * state.h * 0.00028, 70, 160));
  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: Math.random() * state.w,
      y: Math.random() * state.h * 0.82,
      s: Math.random() < 0.08 ? 2.1 : 0.6 + Math.random() * 1.15,
      a: 0.25 + Math.random() * 0.75,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 1.6,
      cross: Math.random() < 0.06,
      color: Math.random() < 0.18 ? cssVar("--blush") : cssVar("--cream"),
    });
  }
  for (let i = 0; i < 28; i += 1) {
    motes.push({
      x: Math.random() * state.w,
      y: Math.random() * state.h,
      r: 0.4 + Math.random() * 1.3,
      v: 0.08 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() < 0.5 ? cssVar("--gold") : cssVar("--cream"),
    });
  }
}

function paletteList() {
  return [
    [cssVar("--hot"), cssVar("--blush"), cssVar("--cream"), cssVar("--gold")],
    [cssVar("--gold"), cssVar("--cream"), "#fffaf6", cssVar("--gold-deep")],
    [cssVar("--soft"), cssVar("--hot"), cssVar("--cream"), cssVar("--blush")],
    [cssVar("--rose"), cssVar("--gold"), cssVar("--cream"), cssVar("--soft")],
  ];
}

function paletteFor(tone) {
  const map = {
    hot: 0,
    blush: 2,
    soft: 2,
    cream: 1,
    rose: 3,
  };
  return paletteList()[map[tone] || 0];
}

function spriteFor(color) {
  if (sprites.has(color)) return sprites.get(color);
  const size = 48;
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const g = sprite.getContext("2d");
  const [r, gv, b] = hexToRgb(color);
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${r},${gv},${b},1)`);
  grad.addColorStop(0.2, `rgba(${r},${gv},${b},0.95)`);
  grad.addColorStop(0.48, `rgba(${r},${gv},${b},0.28)`);
  grad.addColorStop(1, `rgba(${r},${gv},${b},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  sprites.set(color, sprite);
  return sprite;
}

function flowerTop() {
  const rect = svg.getBoundingClientRect();
  if (!rect.height) return state.h * 0.42;
  return rect.top + rect.height * 0.15;
}

function safeTop() {
  const probe = document.getElementById("safe-probe");
  return Math.max(16, (probe && probe.clientHeight) || 0);
}

function layoutLines() {
  const off = document.createElement("canvas").getContext("2d");
  const maxW = Math.min(state.w - 32, 500);
  const top = Math.max(safeTop() + 8, state.h * 0.055);
  const bottom = Math.min(flowerTop() - 16, state.h * 0.44);
  const available = Math.max(96, bottom - top);
  const fontOf = (size, italic) =>
    `${italic ? "italic 600" : "700"} ${size}px Fraunces, Georgia, 'Times New Roman', serif`;
  const widthOf = (text, size, italic) => {
    off.font = fontOf(size, italic);
    return off.measureText(text).width;
  };
  let ann = Math.min(88, maxW / 6.1);
  while (ann > 24 && widthOf("anniversary", ann, false) > maxW) ann -= 1;
  let happy = ann * 1.14;
  let love = ann * 1.32;
  while (happy > 24 && widthOf("happy", happy, false) > maxW) happy -= 1;
  while (love > 24 && widthOf("love", love, true) > maxW) love -= 1;
  let block = happy * 1.28 + ann * 1.22 + love * 1.08;
  if (block > available) {
    const scale = available / block;
    happy *= scale;
    ann *= scale;
    love *= scale;
    block = available;
  }
  let y = top + Math.max(0, (available - block) * 0.22);
  const lines = [
    { text: "happy", size: happy, italic: false },
    { text: "anniversary", size: ann, italic: false },
    { text: "love", size: love, italic: true },
  ].map((line) => {
    y += line.size * 0.92;
    const placed = { ...line, x: state.w / 2, y };
    y += line.size * 0.36;
    return placed;
  });
  return lines;
}

function sampleText() {
  const lines = layoutLines();
  const offscreen = document.createElement("canvas");
  offscreen.width = state.w;
  offscreen.height = state.h;
  const off = offscreen.getContext("2d", { willReadFrequently: true });
  off.clearRect(0, 0, state.w, state.h);
  off.textAlign = "center";
  off.textBaseline = "alphabetic";
  off.fillStyle = "#fff";
  off.strokeStyle = "#fff";
  off.lineJoin = "round";
  lines.forEach((line) => {
    off.font = `${line.italic ? "italic 600" : "700"} ${line.size}px Fraunces, Georgia, 'Times New Roman', serif`;
    off.lineWidth = Math.max(1.25, line.size * 0.055);
    off.strokeText(line.text, line.x, line.y);
    off.fillText(line.text, line.x, line.y);
  });
  let step = state.w < 700 ? 3 : 3;
  let points = [];
  const read = (gap) => {
    const found = [];
    const data = off.getImageData(0, 0, state.w, state.h).data;
    for (let y = 0; y < state.h; y += gap) {
      for (let x = 0; x < state.w; x += gap) {
        if (data[(y * state.w + x) * 4 + 3] > 140) found.push({ x, y });
      }
    }
    return found;
  };
  points = read(step);
  if (points.length > 1100) points = read(step + 1);
  if (points.length < 80) return [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  points.forEach((point) => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  });
  state.textBounds = { minX, minY, maxX, maxY };
  return points;
}

function letterColors() {
  const cream = cssVar("--cream");
  const gold = cssVar("--gold");
  const blush = cssVar("--blush");
  const ink = cssVar("--ink");
  return [cream, cream, ink, gold, cream, blush, gold, ink];
}

function makeLetter(point, origin, paletteIndex, settled) {
  const colors = letterColors();
  const color = colors[(point.x * 3 + point.y) % colors.length | 0] || colors[0];
  const angle = Math.random() * Math.PI * 2;
  const radius = 10 + Math.random() * 32;
  return {
    type: "letter",
    phase: settled ? "shimmer" : "fly",
    x: settled ? point.x : origin.x,
    y: settled ? point.y : origin.y,
    px: origin.x,
    py: origin.y,
    sx: origin.x,
    sy: origin.y,
    mx: origin.x + Math.cos(angle) * radius,
    my: origin.y + Math.sin(angle) * radius,
    tx: point.x,
    ty: point.y,
    born: sceneTime(),
    dur: 1.55 + Math.random() * 0.35,
    color,
    size: point.y % 5 === 0 ? 4.6 : 3.5,
    glint: (point.x + point.y) % 17 === 0,
    seed: Math.random() * Math.PI * 2,
    paletteIndex,
  };
}

function spawnLetters(origin, bucket, settled) {
  bucket.forEach((point) => letters.push(makeLetter(point, origin, 0, settled)));
}

function spawnSettledLetters() {
  const points = sampleText();
  letters.length = 0;
  if (!points.length) return;
  const origin = { x: state.w / 2, y: state.textBounds.minY };
  points.forEach((point) => letters.push(makeLetter(point, origin, 0, true)));
  state.textLocked = true;
  state.finaleStarted = true;
}

function startFinale() {
  if (state.finaleStarted) return;
  const points = sampleText();
  if (!points.length) {
    state.finaleStarted = true;
    return;
  }
  const minX = state.textBounds.minX;
  const maxX = state.textBounds.maxX;
  const top = state.textBounds.minY;
  const buckets = [[], [], []];
  points.forEach((point) => {
    const u = (point.x - minX) / (maxX - minX || 1);
    buckets[Math.min(2, Math.floor(u * 3))].push(point);
  });
  const origins = [
    { x: minX + (maxX - minX) * 0.18, y: top - 6 },
    { x: (minX + maxX) / 2, y: top - 18 },
    { x: minX + (maxX - minX) * 0.82, y: top - 4 },
  ];
  const palettes = paletteList();
  buckets.forEach((bucket, index) => {
    delayed.push({
      at: sceneTime() + index * 0.18,
      fn: () =>
        launch({
          targetX: origins[index].x,
          targetY: Math.max(24, origins[index].y),
          style: "pop",
          palette: palettes[index % palettes.length],
          fromX: state.w * (0.18 + index * 0.32),
          payload: bucket,
        }),
    });
  });
  delayed.push({
    at: sceneTime() + 2.35,
    fn: () => {
      const bounds = state.textBounds;
      if (!bounds) return;
      const y = bounds.maxY + 26;
      if (y < flowerTop() - 8) {
        launch({
          targetX: state.w / 2,
          targetY: y,
          style: "heart",
          palette: palettes[1],
          fromX: state.w / 2 + 20,
        });
      }
    },
  });
  state.finaleStarted = true;
}

function launch(spec) {
  const fromX = spec.fromX ?? spec.targetX + (Math.random() * 50 - 25);
  rockets.push({
    x: fromX,
    y: state.h + 6,
    px: fromX,
    py: state.h + 6,
    vx: (spec.targetX - fromX) * 0.015,
    vy: -8.4 - Math.random() * 1.2,
    tx: spec.targetX,
    ty: spec.targetY,
    color: spec.palette[0],
    palette: spec.palette,
    style: spec.style,
    payload: spec.payload || null,
  });
}

function spawnBurst(x, y, style, palette) {
  const density = state.w < 520 ? 0.82 : 1;
  const count = Math.max(8, Math.round(style.n * density));
  if (style.shape === "heart") {
    const scale = 0.125;
    for (let i = 0; i < count; i += 1) {
      const t = (i / count) * Math.PI * 2;
      const hx = 16 * Math.sin(t) ** 3;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const jitter = 0.94 + ((i * 17) % 7) * 0.02;
      pushSpark(x, y, hx * scale * jitter, hy * scale * jitter, style, palette[i % palette.length], i);
    }
    return;
  }
  for (let i = 0; i < count; i += 1) {
    let angle = (Math.PI * 2 * i) / count;
    if (style.shape !== "ring") angle += (Math.random() - 0.5) * 0.45;
    const speed = style.speed * (style.shape === "ring" ? 0.92 + (i % 3) * 0.04 : 0.45 + Math.random() * 0.75);
    pushSpark(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, style, palette[i % palette.length], i);
  }
}

function pushSpark(x, y, vx, vy, style, color, index) {
  if (parts.length > 520) return;
  parts.push({
    type: "spark",
    x,
    y,
    px: x,
    py: y,
    vx,
    vy,
    life: style.life * (0.75 + (index % 5) * 0.06),
    max: style.life,
    color,
    size: 1.7 + (index % 4) * 0.45,
    gravity: style.gravity,
    drag: style.drag,
    trail: style.trail,
  });
}

function explode(rocket) {
  flashes.push({ x: rocket.tx, y: rocket.ty, life: 16, max: 16, color: rocket.palette[0] });
  if (rocket.payload) spawnLetters({ x: rocket.tx, y: rocket.ty }, rocket.payload, false);
  spawnBurst(rocket.tx, rocket.ty, STYLES[rocket.style] || STYLES.peony, rocket.palette);
}

function fireCue(cue) {
  const palettes = paletteList();
  launch({
    targetX: cue.x * state.w,
    targetY: cue.y * state.h,
    style: cue.style,
    palette: palettes[cue.p % palettes.length],
    fromX: cue.x * state.w + (cue.x < 0.5 ? 24 : -24),
  });
}

function updateSchedule(t) {
  while (state.cueIndex < CUES.length && t >= CUES[state.cueIndex].t) {
    const cue = CUES[state.cueIndex];
    state.cueIndex += 1;
    if (cue.finale) {
      if (t > cue.t + 2.8 && letters.length === 0) spawnSettledLetters();
      else startFinale();
    } else if (t - cue.t < 0.45) fireCue(cue);
  }
  for (let i = delayed.length - 1; i >= 0; i -= 1) {
    if (t >= delayed[i].at) {
      delayed[i].fn();
      delayed.splice(i, 1);
    }
  }
  if (state.finaleStarted && t > state.nextIdle) {
    state.nextIdle = t + 5.4 + Math.random() * 1.6;
    const left = Math.random() < 0.5;
    const bounds = state.textBounds;
    const y = bounds ? Math.max(30, bounds.minY - 24) : state.h * 0.12;
    launch({
      targetX: left ? 26 : state.w - 26,
      targetY: y,
      style: Math.random() < 0.35 ? "heart" : "peony",
      palette: paletteList()[Math.floor(Math.random() * 4)],
      fromX: left ? state.w * 0.2 : state.w * 0.8,
    });
  }
}

function stepRocket(rocket, dt) {
  rocket.px = rocket.x;
  rocket.py = rocket.y;
  const dx = rocket.tx - rocket.x;
  const dy = rocket.ty - rocket.y;
  rocket.vx += dx * 0.014 * dt;
  rocket.vy += dy * 0.01 * dt;
  rocket.vy += 0.04 * dt;
  rocket.vx *= Math.pow(0.992, dt);
  rocket.x += rocket.vx * dt;
  rocket.y += rocket.vy * dt;
  rocket.age = (rocket.age || 0) + dt;
  const dist = Math.hypot(rocket.tx - rocket.x, rocket.ty - rocket.y);
  if (dist < 18 || rocket.y < rocket.ty - 6 || rocket.age > 130) return true;
  return false;
}

function stepSpark(spark, dt) {
  spark.px = spark.x;
  spark.py = spark.y;
  spark.vy += spark.gravity * dt;
  spark.vx *= Math.pow(spark.drag, dt);
  spark.vy *= Math.pow(spark.drag, dt);
  spark.x += spark.vx * dt;
  spark.y += spark.vy * dt;
  spark.life -= dt;
}

function stepLetter(letter, t) {
  letter.px = letter.x;
  letter.py = letter.y;
  if (letter.phase === "shimmer") {
    const wob = letter.glint ? 0.7 : 0.42;
    letter.x = letter.tx + Math.cos(t * 1.5 + letter.seed) * wob;
    letter.y = letter.ty + Math.sin(t * 1.9 + letter.seed) * wob * 0.8;
    return;
  }
  const u = clamp((t - letter.born) / letter.dur, 0, 1);
  if (u < 0.26) {
    const e = easeOutCubic(u / 0.26);
    letter.x = lerp(letter.sx, letter.mx, e);
    letter.y = lerp(letter.sy, letter.my, e);
  } else {
    const e = easeInOutCubic((u - 0.26) / 0.74);
    letter.x = lerp(letter.mx, letter.tx, e);
    letter.y = lerp(letter.my, letter.ty, e);
    if (u >= 1) letter.phase = "shimmer";
  }
}

function drawSky(t) {
  ctx.clearRect(0, 0, state.w, state.h);
  stars.forEach((star) => {
    const tw = state.calm ? star.a : star.a * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * star.speed + star.phase)));
    ctx.globalAlpha = tw;
    ctx.fillStyle = star.color;
    ctx.fillRect(star.x, star.y, star.s, star.s);
    if (star.cross) {
      ctx.globalAlpha = tw * 0.7;
      ctx.fillRect(star.x - star.s * 2.2, star.y + star.s * 0.35, star.s * 5.4, Math.max(0.6, star.s * 0.28));
      ctx.fillRect(star.x + star.s * 0.35, star.y - star.s * 2.2, Math.max(0.6, star.s * 0.28), star.s * 5.4);
    }
  });
  motes.forEach((mote) => {
    if (!state.calm) {
      mote.y -= mote.v;
      mote.x += Math.sin(t * 0.7 + mote.phase) * 0.12;
      if (mote.y < -4) {
        mote.y = state.h + 4;
        mote.x = Math.random() * state.w;
      }
    }
    ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t * 1.4 + mote.phase);
    ctx.fillStyle = mote.color;
    ctx.beginPath();
    ctx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawParticles(t) {
  ctx.lineCap = "round";
  ctx.lineWidth = 1.4;
  parts.forEach((spark) => {
    const alpha = clamp(spark.life / spark.max, 0, 1);
    if (spark.trail && alpha > 0.05) {
      ctx.globalAlpha = alpha * 0.55;
      ctx.strokeStyle = spark.color;
      ctx.beginPath();
      ctx.moveTo(spark.px, spark.py);
      ctx.lineTo(spark.x, spark.y);
      ctx.stroke();
    }
    blit(spark.color, spark.x, spark.y, spark.size * (2.6 + alpha), alpha);
  });
  rockets.forEach((rocket) => {
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = rocket.color;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(rocket.px, rocket.py);
    ctx.lineTo(rocket.x, rocket.y);
    ctx.stroke();
    blit(cssVar("--cream"), rocket.x, rocket.y, 7, 0.95);
    blit(rocket.color, rocket.x, rocket.y, 12, 0.45);
  });
  flashes.forEach((flash) => {
    const u = 1 - flash.life / flash.max;
    blit(flash.color, flash.x, flash.y, 18 + u * 70, (1 - u) * 0.45);
    blit(cssVar("--cream"), flash.x, flash.y, 10 + u * 16, (1 - u) * 0.8);
  });

  let flying = 0;
  letters.forEach((letter) => {
    if (letter.phase !== "shimmer") flying += 1;
    const alpha = letter.phase === "shimmer"
      ? letter.glint
        ? 0.4 + 0.6 * Math.abs(Math.sin(t * 3.3 + letter.seed))
        : 0.8 + 0.2 * Math.sin(t * 2.1 + letter.seed)
      : 0.9;
    const size = letter.glint ? letter.size * 1.65 : letter.size;
    if (letter.phase !== "shimmer") {
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = letter.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(letter.px, letter.py);
      ctx.lineTo(letter.x, letter.y);
      ctx.stroke();
    }
    blit(letter.color, letter.x, letter.y, size * 2.15, alpha * 0.95);
    blit(cssVar("--ink"), letter.x, letter.y, letter.glint ? 2.4 : 1.7, alpha);
  });
  if (letters.length && flying === 0) state.textLocked = true;
  ctx.globalAlpha = 1;
}

function blit(color, x, y, size, alpha) {
  if (alpha <= 0.01) return;
  ctx.globalAlpha = clamp(alpha, 0, 1);
  ctx.drawImage(spriteFor(color), x - size / 2, y - size / 2, size, size);
}

function frame(now) {
  const elapsed = Math.min(0.05, Math.max(0, (now - state.last) / 1000));
  state.last = now;
  if (!state.calm) clock += elapsed;
  const dt = elapsed * 60;
  state.frames += 1;
  if (now - state.fpsStamp > 500) {
    state.fps = Math.round((state.frames * 1000) / (now - state.fpsStamp));
    state.frames = 0;
    state.fpsStamp = now;
  }
  const t = state.calm ? 80 : sceneTime();
  if (!state.calm) updateSchedule(t);
  applyScene(state.calm ? 80 : Math.min(t, 80));

  for (let i = rockets.length - 1; i >= 0; i -= 1) {
    if (stepRocket(rockets[i], dt)) {
      explode(rockets[i]);
      rockets.splice(i, 1);
    }
  }
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    stepSpark(parts[i], dt);
    if (parts[i].life <= 0) parts.splice(i, 1);
  }
  letters.forEach((letter) => stepLetter(letter, t));
  for (let i = flashes.length - 1; i >= 0; i -= 1) {
    flashes[i].life -= dt;
    if (flashes[i].life <= 0) flashes.splice(i, 1);
  }

  drawSky(t);
  drawParticles(t);
  state.raf = requestAnimationFrame(frame);
}

function resetShow() {
  state.calm = false;
  document.body.classList.remove("calm");
  clock = 0;
  state.last = performance.now();
  state.cueIndex = 0;
  state.finaleStarted = false;
  state.textLocked = false;
  state.textBounds = null;
  state.nextIdle = 12.4;
  parts.length = 0;
  letters.length = 0;
  rockets.length = 0;
  flashes.length = 0;
  delayed.length = 0;
  tulips.forEach((flower) => {
    flower.sparked = false;
  });
  document.documentElement.style.setProperty("--seek", "0s");
  drifts.classList.remove("on");
  void drifts.offsetWidth;
  drifts.classList.add("on");
  applyScene(0);
  if (!state.raf) {
    state.last = performance.now();
    state.raf = requestAnimationFrame(frame);
  }
}

function onPointerDown(event) {
  if (event.button !== undefined && event.button !== 0) return;
  if (event.target.closest && event.target.closest("button")) return;
  state.tapCount += 1;
  const palettes = paletteList();
  const style = state.tapCount % 5 === 0 ? "heart" : ["peony", "chrys", "willow", "ring"][state.tapCount % 4];
  launch({
    targetX: event.clientX,
    targetY: event.clientY,
    style,
    palette: palettes[state.tapCount % palettes.length],
    fromX: event.clientX + (Math.random() * 70 - 35),
  });
}

function bind() {
  document.addEventListener("pointerdown", onPointerDown);
  document.getElementById("replay").addEventListener("click", (event) => {
    event.stopPropagation();
    resetShow();
  });
  let timer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const locked = state.textLocked || (state.finaleStarted && letters.length);
      resize();
      if (locked) spawnSettledLetters();
    }, 140);
  });
  document.addEventListener("visibilitychange", () => {
    state.last = performance.now();
  });
}

async function init() {
  document.documentElement.style.setProperty("--seek", `${bootSeek}s`);
  buildBouquet();
  buildDrifts();
  resize();
  bind();
  if (state.calm) document.body.classList.add("calm");
  applyScene(state.calm ? 80 : sceneTime());
  const fontWait = Promise.race([
    Promise.all([
      document.fonts.load("700 72px Fraunces"),
      document.fonts.load("italic 600 72px Fraunces"),
    ]),
    new Promise((resolve) => setTimeout(resolve, 2200)),
  ]);
  if (!state.calm && bootSeek > 6) await fontWait;
  if (!state.calm && bootSeek >= FINALE_AT + 2.6) spawnSettledLetters();
  if (!state.calm && bootSeek > 0) {
    while (state.cueIndex < CUES.length && CUES[state.cueIndex].t <= sceneTime()) state.cueIndex += 1;
    if (letters.length) state.finaleStarted = true;
    drifts.classList.add("on");
  } else if (!state.calm) {
    requestAnimationFrame(() => drifts.classList.add("on"));
  }
  window.__ready = true;
  state.last = performance.now();
  state.raf = requestAnimationFrame(frame);
}

window.__scene = {
  time: () => (state.calm ? 80 : sceneTime()),
  fps: () => state.fps,
  letters: () => letters.length,
  sparks: () => parts.length,
  locked: () => state.textLocked,
};

init();
