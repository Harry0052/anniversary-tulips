/* Same show as bouquet3d.py: a 3D ASCII tulip bouquet in the browser.
   Palette matches the constants at the top of that script. */

const PALETTE = {
  sky: [8, 10, 24],
  hot: [255, 64, 142],
  pink: [255, 128, 176],
  blush: [255, 190, 208],
  cream: [255, 244, 230],
  gold: [240, 198, 112],
  rose: [230, 62, 122],
  leaf: [48, 196, 98],
  leaf_dark: [18, 118, 62],
  stem: [32, 158, 78],
  wrap: [255, 246, 232],
  ribbon: [255, 78, 146],
  star: [236, 228, 214],
  white: [255, 250, 244],
};

const RAMP = " .:-=+*#%@";
const FLOWERS = 7;
const HEAD_RINGS = 18;
const HEAD_ANGLES = 36;
const STEM_T0 = 0.2;
const STEM_GROW = 1.45;
const LEAF_T0 = 1.05;
const HEAD_T0 = 1.75;
const HEAD_STAGGER = 0.26;
const HEAD_FILL = 1.05;
const WRAP_T0 = 0.4;
const ROTATE_AT = 5.55;
const ROTATE_SPEED = 0.3;
const FINALE_AT = 7.05;
const LIGHT = norm([0.32, 0.86, 0.42]);
const WORDS = ["happy", "anniversary", "love"];

const FONT5 = {
  a: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  e: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  h: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  i: ["00100", "00000", "00100", "00100", "00100", "00100", "00100"],
  l: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  n: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  o: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  p: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  r: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  s: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  v: ["10001", "10001", "10001", "10001", "01010", "01010", "00100"],
  y: ["10001", "10001", "01010", "00100", "00100", "01000", "10000"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};
const FONT3 = {
  a: ["010", "101", "111", "101", "101"],
  e: ["111", "100", "110", "100", "111"],
  h: ["101", "111", "101", "101", "101"],
  i: ["010", "000", "010", "010", "010"],
  l: ["100", "100", "100", "100", "111"],
  n: ["110", "101", "101", "101", "101"],
  o: ["010", "101", "101", "101", "010"],
  p: ["110", "101", "110", "100", "100"],
  r: ["110", "101", "110", "101", "101"],
  s: ["011", "100", "010", "001", "110"],
  v: ["101", "101", "101", "101", "010"],
  y: ["101", "101", "010", "010", "100"],
  " ": ["000", "000", "000", "000", "000"],
};

const screen = document.getElementById("screen");
const stage = document.getElementById("stage");
const dims = document.getElementById("dims");
const probe = document.getElementById("probe");

let scene = null;
let cols = 60;
let rows = 40;
let sim = makeSim();
let started = performance.now();
let last = started;
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches && !new URLSearchParams(location.search).get("at");

function add(a, b, s = 1) {
  return [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function norm(v) {
  const n = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / n, v[1] / n, v[2] / n];
}
function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function basis(axis) {
  axis = norm(axis);
  const helper = Math.abs(axis[1]) > 0.82 ? [0, 0, 1] : [0, 1, 0];
  const u = norm(cross(helper, axis));
  return [u, cross(axis, u)];
}
function mix(a, b, t) {
  return a.map((v, i) => (v + (b[i] - v) * t) | 0);
}

function buildScene() {
  const tones = [
    [PALETTE.hot, PALETTE.pink, PALETTE.cream],
    [PALETTE.blush, PALETTE.pink, PALETTE.cream],
    [PALETTE.rose, PALETTE.hot, PALETTE.gold],
    [PALETTE.pink, PALETTE.blush, PALETTE.cream],
    [PALETTE.cream, PALETTE.blush, PALETTE.gold],
    [PALETTE.hot, PALETTE.rose, PALETTE.cream],
    [PALETTE.blush, PALETTE.cream, PALETTE.gold],
  ];
  const pts = [];
  const neck = [0, -0.28, 0];
  const golden = Math.PI * (3 - Math.sqrt(5));
  const heads = [];
  for (let i = 0; i < FLOWERS; i += 1) {
    const az = i * golden;
    const ring = i / (FLOWERS - 1);
    const spread = 0.02 + ring * 0.78;
    const height = 0.42 - ring * 0.22;
    const origin = [Math.cos(az) * spread, height, Math.sin(az) * spread * 0.62];
    const axis = norm([origin[0] * 0.16, 1, origin[2] * 0.16]);
    heads.push([origin, axis, tones[i % tones.length], i]);
  }
  const push = (pos, normal, rgb, born, kind, glyph = "") => {
    pts.push({ pos, normal, rgb, born, kind, glyph });
  };

  heads.forEach(([origin, axis, tone, index]) => {
    const [u, w] = basis(axis);
    const [deep, mid, lip] = tone;
    for (let s = 0; s < 22; s += 1) {
      const t = s / 21;
      const pos = [
        neck[0] + (origin[0] - neck[0]) * t,
        neck[1] + (origin[1] - neck[1]) * t,
        neck[2] + (origin[2] - neck[2]) * t,
      ];
      const bend = Math.sin(t * Math.PI) * 0.02;
      pos[0] += axis[0] * bend;
      pos[2] += axis[2] * bend;
      const born = STEM_T0 + t * STEM_GROW + index * 0.03;
      const shade = s % 3 ? PALETTE.stem : PALETTE.leaf_dark;
      push(pos, [0, 0, 1], shade, born, "stem", "|");
    }
    [0.32, 0.52].forEach((attach, leafIndex) => {
      const base = [
        neck[0] + (origin[0] - neck[0]) * attach,
        neck[1] + (origin[1] - neck[1]) * attach,
        neck[2] + (origin[2] - neck[2]) * attach,
      ];
      const outward = norm([
        origin[0] + (leafIndex === 0 ? 0.15 : -0.1),
        0.35,
        origin[2] + (leafIndex ? -0.05 : 0.05),
      ]);
      const side = norm(cross(outward, [0, 1, 0]));
      const length = leafIndex === 0 ? 0.48 : 0.32;
      for (let s = 0; s < 14; s += 1) {
        const along = s / 13;
        const half = Math.sin(along * Math.PI) * (leafIndex === 0 ? 0.07 : 0.045);
        for (let k = -3; k <= 3; k += 1) {
          let pos = add(base, outward, along * length);
          pos = add(pos, side, (k / 3) * half);
          pos = add(pos, [0, 1, 0], along * 0.08);
          push(
            pos,
            norm(add(outward, [0, 1, 0], 0.4)),
            mix(PALETTE.leaf_dark, PALETTE.leaf, along),
            LEAF_T0 + index * 0.04 + along * 0.55 + leafIndex * 0.12,
            "leaf"
          );
        }
      }
    });
    for (let ring = 0; ring < HEAD_RINGS; ring += 1) {
      const t = ring / (HEAD_RINGS - 1);
      const profile = Math.sin(Math.min(1, t ** 0.88) * Math.PI) ** 0.78;
      const radius = 0.04 + 0.22 * profile;
      const height = 0.02 + t * 1.05;
      for (let angI = 0; angI < HEAD_ANGLES; angI += 1) {
        const ang = (angI / HEAD_ANGLES) * Math.PI * 2;
        const lobe = 0.68 + 0.32 * Math.cos(3 * ang);
        const pr = radius * lobe;
        let pos = add(origin, u, pr * Math.cos(ang));
        pos = add(pos, axis, height);
        pos = add(pos, w, pr * Math.sin(ang));
        const n = norm([Math.cos(ang), 0.25, Math.sin(ang)]);
        const normal = norm(add(add(add([0, 0, 0], u, n[0]), axis, n[1]), w, n[2]));
        let color = t < 0.45 ? mix(deep, mid, t / 0.45) : mix(mid, lip, (t - 0.45) / 0.55);
        if (Math.abs(Math.cos(3 * ang)) > 0.72 && t > 0.55) color = mix(color, PALETTE.cream, 0.45);
        push(pos, normal, color, HEAD_T0 + index * HEAD_STAGGER + t * HEAD_FILL, "head");
      }
      if (t > 0.18 && t < 0.72) {
        for (let angI = 0; angI < 10; angI += 1) {
          const ang = (angI / 10) * Math.PI * 2;
          const pr = radius * 0.28;
          let pos = add(origin, u, pr * Math.cos(ang));
          pos = add(pos, axis, height * 0.92);
          pos = add(pos, w, pr * Math.sin(ang));
          push(pos, axis, PALETTE.gold, HEAD_T0 + index * HEAD_STAGGER + t * HEAD_FILL + 0.15, "head");
        }
      }
    }
    for (let s = 0; s < 3; s += 1) {
      const pos = add(origin, [(s - 1) * 0.12, 0.2 + s * 0.12, (s % 2 ? -1 : 1) * 0.1]);
      push(pos, [0, 1, 0], s ? PALETTE.white : PALETTE.gold, HEAD_T0 + index * HEAD_STAGGER + 0.45, "sparkle", s === 1 ? "+" : "*");
    }
  });

  const neckY = -0.22;
  const footY = -0.78;
  for (let ring = 0; ring < 9; ring += 1) {
    const t = ring / 8;
    const y = neckY + (footY - neckY) * t;
    const rad = 0.14 + 0.4 * t;
    const count = 26 + (22 * t) | 0;
    for (let k = 0; k < count; k += 1) {
      if ((k + ring * 2) % 5 === 0) continue;
      const ang = (k / count) * Math.PI * 2;
      push(
        [Math.cos(ang) * rad, y, Math.sin(ang) * rad * 0.78],
        [Math.cos(ang), 0.1, Math.sin(ang)],
        k % 4 ? PALETTE.wrap : PALETTE.blush,
        WRAP_T0 + t * 0.7,
        "wrap",
        ring % 2 ? "-" : "="
      );
    }
  }
  for (let k = 0; k < 40; k += 1) {
    const ang = (k / 40) * Math.PI * 2;
    push([Math.cos(ang) * 0.16, neckY + 0.02, Math.sin(ang) * 0.13], [0, 1, 0], PALETTE.ribbon, WRAP_T0 + 0.55, "ribbon", "=");
  }
  const bowY = neckY + 0.05;
  [-1, 1].forEach((side) => {
    for (let k = 0; k < 16; k += 1) {
      const ang = (k / 16) * Math.PI * 2;
      push([side * 0.15 + Math.cos(ang) * 0.09, bowY + Math.sin(ang) * 0.07, 0.16], [0, 0, 1], PALETTE.hot, WRAP_T0 + 0.7, "ribbon", "o");
    }
    for (let s = 0; s < 8; s += 1) {
      const t = s / 7;
      push([side * (0.08 + t * 0.16), bowY - 0.02 - t * 0.22, 0.14], [0, 0, 1], PALETTE.ribbon, WRAP_T0 + 0.75, "ribbon", "|");
    }
  });
  push([0, bowY, 0.18], [0, 0, 1], PALETTE.gold, WRAP_T0 + 0.8, "ribbon", "o");
  for (let s = 0; s < 8; s += 1) {
    const y = footY - s * 0.035;
    [-0.02, 0, 0.02].forEach((x) => push([x, y, 0], [0, 0, 1], PALETTE.stem, WRAP_T0 + 0.2 + s * 0.03, "stem", "|"));
  }
  return pts;
}

function textLayout() {
  let font = FONT3;
  let cw = 3;
  let ch = 5;
  for (const [candidate, candW, candH] of [[FONT5, 5, 7], [FONT3, 3, 5]]) {
    const need = Math.max(...WORDS.map((word) => word.length)) * (candW + 1) - 1;
    const block = WORDS.length * (candH + 1) - 1;
    if (need <= cols - 2 && block <= rows * 0.4) {
      font = candidate;
      cw = candW;
      ch = candH;
      break;
    }
  }
  const blockH = WORDS.length * (ch + 1) - 1;
  const top = rows > blockH + 6 ? 1 : 0;
  const cells = [];
  WORDS.forEach((word, li) => {
    const wordW = word.length * (cw + 1) - 1;
    const x0 = Math.max(0, ((cols - wordW) / 2) | 0);
    const y0 = top + li * (ch + 1);
    [...word].forEach((char, ci) => {
      font[char].forEach((bits, gy) => {
        const yy = y0 + gy;
        if (yy < 0 || yy >= rows) return;
        [...bits].forEach((bit, gx) => {
          if (bit !== "1") return;
          const xx = x0 + ci * (cw + 1) + gx;
          if (xx >= 0 && xx < cols) cells.push([xx, yy]);
        });
      });
    });
  });
  return { cells, bottom: top + blockH };
}

function project(x, y, z, yaw, rowTop, rowBot) {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const xr = x * cy + z * sy;
  const zr = -x * sy + z * cy;
  const yTop = 1.6;
  const yBot = -1.15;
  const span = Math.max(8, rowBot - rowTop);
  let fy = span / (yTop - yBot);
  let fx = fy * 1.9;
  if (fx * 2.6 > cols * 0.94) {
    const shrink = (cols * 0.94) / (fx * 2.6);
    fx *= shrink;
    fy *= shrink;
  }
  const used = fy * (yTop - yBot);
  return {
    col: cols * 0.5 + xr * fx,
    row: rowTop + Math.max(0, span - used) * 0.15 + (yTop - y) * fy,
    depth: zr + 4.2,
  };
}

function shadeChar(brightness, kind, glyph) {
  if (glyph) return glyph;
  let index = Math.max(0, Math.min(RAMP.length - 1, (brightness * (RAMP.length - 1)) | 0));
  if (kind === "head") index = Math.max(4, index);
  else if (kind === "leaf" && index < 3) index = 3;
  return RAMP[index];
}

function makeSim() {
  return { sparks: [], letters: [], petals: [], cue: 0, finale: false, locked: false, booms: 0 };
}

function launch(kind, x, y) {
  const colors = [PALETTE.hot, PALETTE.gold, PALETTE.cream, PALETTE.blush, PALETTE.pink];
  sim.booms += 1;
  if (kind === "heart") {
    const count = 54;
    for (let i = 0; i < count; i += 1) {
      const ang = (i / count) * Math.PI * 2;
      const hx = 16 * Math.sin(ang) ** 3;
      const hy = -(13 * Math.cos(ang) - 5 * Math.cos(2 * ang) - 2 * Math.cos(3 * ang) - Math.cos(4 * ang));
      sim.sparks.push({ x, y, vx: hx * 0.085, vy: hy * 0.085, life: 2.4, max: 2.4, ch: i % 3 ? "+" : "*", color: colors[i % colors.length], gravity: 2.2 });
    }
    return;
  }
  const count = kind === "ring" ? 46 : 36;
  for (let i = 0; i < count; i += 1) {
    let ang = (i / count) * Math.PI * 2;
    if (kind !== "ring") ang += (i % 5) * 0.04;
    const speed = kind === "ring" ? 10 : 6 + (i % 7);
    sim.sparks.push({
      x, y,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed * (kind === "willow" ? 0.55 : 1),
      life: kind === "willow" ? 2.8 : 2.1,
      max: 2.8,
      ch: "*+.o"[i % 4],
      color: colors[i % colors.length],
      gravity: kind === "willow" ? 7 : 2.2,
    });
  }
}

function spawnLetters(originX, originY, bucket, born) {
  const colors = [PALETTE.cream, PALETTE.gold, PALETTE.white, PALETTE.blush, PALETTE.hot];
  bucket.forEach((target, index) => {
    const ang = (index * 2.399) % (Math.PI * 2);
    sim.letters.push({
      x: originX, y: originY, sx: originX, sy: originY,
      mx: originX + Math.cos(ang) * (4 + (index % 7)),
      my: originY + Math.sin(ang) * (3 + (index % 5)),
      tx: target[0], ty: target[1], born, dur: 1.7,
      color: colors[index % colors.length], seed: index * 0.7,
    });
  });
}

function step(t, dt) {
  const cues = [
    [2.5, "burst", 0.22, 0.16],
    [3.7, "ring", 0.78, 0.14],
    [4.9, "heart", 0.32, 0.18],
    [6.15, "willow", 0.7, 0.2],
    [FINALE_AT, "finale", 0.5, 0.08],
  ];
  while (sim.cue < cues.length && t >= cues[sim.cue][0]) {
    const [when, kind, fx, fy] = cues[sim.cue];
    sim.cue += 1;
    if (kind === "finale" && !sim.finale) {
      sim.finale = true;
      const { cells } = textLayout();
      if (cells.length) {
        const third = Math.max(1, (cells.length / 3) | 0);
        const buckets = [cells.slice(0, third), cells.slice(third, third * 2), cells.slice(third * 2)];
        const xs = cells.map((cell) => cell[0]);
        const ys = cells.map((cell) => cell[1]);
        const top = Math.min(...ys);
        const origins = [[Math.min(...xs), top], [((Math.min(...xs) + Math.max(...xs)) / 2) | 0, Math.max(0, top - 2)], [Math.max(...xs), top]];
        buckets.forEach((bucket, index) => {
          spawnLetters(origins[index][0], origins[index][1], bucket, t);
          launch("burst", origins[index][0], origins[index][1]);
        });
      }
    } else if (kind !== "finale" && t - when < 0.35) {
      launch(kind, fx * cols, fy * rows);
    }
  }
  if (sim.locked && t > FINALE_AT + 4.5 && ((t * 2) | 0) !== (((t - dt) * 2) | 0) && (t | 0) % 5 === 0) {
    launch("burst", (t | 0) % 10 ? 4 : cols - 5, 3);
  }
  sim.sparks = sim.sparks.filter((spark) => {
    spark.vy += spark.gravity * dt;
    spark.x += spark.vx * dt;
    spark.y += spark.vy * dt;
    spark.life -= dt;
    return spark.life > 0 && spark.x > -2 && spark.x < cols + 2 && spark.y > -2 && spark.y < rows + 2;
  });
  let arrived = 0;
  sim.letters.forEach((letter) => {
    const u = Math.max(0, Math.min(1, (t - letter.born) / letter.dur));
    if (u < 0.28) {
      const e = 1 - (1 - u / 0.28) ** 3;
      letter.x = letter.sx + (letter.mx - letter.sx) * e;
      letter.y = letter.sy + (letter.my - letter.sy) * e;
    } else {
      let e = (u - 0.28) / 0.72;
      e = e * e * (3 - 2 * e);
      letter.x = letter.mx + (letter.tx - letter.mx) * e;
      letter.y = letter.my + (letter.ty - letter.my) * e;
    }
    if (u >= 1) arrived += 1;
  });
  if (sim.letters.length && arrived === sim.letters.length) sim.locked = true;
  if (t > 2.4 && sim.petals.length < 14 && ((t * 3) | 0) !== (((t - dt) * 3) | 0)) {
    const n = sim.petals.length;
    sim.petals.push({
      x: cols * (0.2 + (n * 0.07) % 0.6),
      y: rows * 0.42,
      vy: 3.5 + (n % 4),
      vx: n % 2 ? 2 : -2,
      ch: "*o+"[n % 3],
      color: [PALETTE.hot, PALETTE.blush, PALETTE.cream][n % 3],
    });
  }
  sim.petals = sim.petals.filter((petal) => {
    petal.y += petal.vy * dt;
    petal.x += petal.vx * dt;
    return petal.y < rows - 1;
  });
}

function raster(t) {
  const chars = Array.from({ length: rows }, () => Array(cols).fill(" "));
  const colors = Array.from({ length: rows }, () => Array(cols).fill(PALETTE.sky));
  const depth = Array.from({ length: rows }, () => Array(cols).fill(1e9));
  const { bottom } = textLayout();
  const rowTop = Math.min(rows - 8, bottom + 2);
  const rowBot = rows - 1;
  const yaw = t < ROTATE_AT ? 0.42 : 0.42 + (t - ROTATE_AT) * ROTATE_SPEED;
  const starCount = Math.max(12, (cols * rows / 90) | 0);
  for (let i = 0; i < starCount; i += 1) {
    const x = (i * 47 + 3) % cols;
    const y = (i * 19 + 5) % rows;
    if (y <= bottom && sim.locked) continue;
    if (0.5 + 0.5 * Math.sin(t * 2.2 + i) < 0.35) continue;
    chars[y][x] = i % 11 === 0 ? "*" : i % 3 ? "+" : ".";
    colors[y][x] = i % 4 ? PALETTE.star : PALETTE.gold;
  }
  scene.forEach((point) => {
    if (t < point.born) return;
    const p = project(point.pos[0], point.pos[1], point.pos[2], yaw, rowTop, rowBot);
    const ix = p.col | 0;
    const iy = p.row | 0;
    if (ix < 0 || iy < 0 || ix >= cols || iy >= rows || iy <= bottom) return;
    if (p.depth >= depth[iy][ix]) return;
    if (point.kind === "sparkle" && Math.sin(t * 4 + point.pos[0] * 12) < 0.05) return;
    const normal = norm(point.normal);
    let bright = 0.38 + 0.62 * Math.max(0, dot(normal, LIGHT));
    bright *= 0.82 + 0.18 * Math.max(0, Math.min(1, 1.4 - p.depth * 0.15));
    bright = Math.max(0, Math.min(1, bright + ((((ix * 13 + iy * 7) % 5) - 2) * 0.035)));
    chars[iy][ix] = shadeChar(bright, point.kind, point.glyph);
    colors[iy][ix] = point.rgb;
    depth[iy][ix] = p.depth;
  });
  const stamp = (x, y, ch, color) => {
    const ix = x | 0;
    const iy = y | 0;
    if (ix < 0 || iy < 0 || ix >= cols || iy >= rows) return;
    chars[iy][ix] = ch;
    colors[iy][ix] = color;
  };
  sim.sparks.forEach((spark) => stamp(spark.x, spark.y, spark.ch, spark.color));
  sim.petals.forEach((petal) => stamp(petal.x, petal.y, petal.ch, petal.color));
  sim.letters.forEach((letter) => {
    const u = Math.max(0, Math.min(1, (t - letter.born) / letter.dur));
    const twinkle = Math.sin(t * 5 + letter.seed);
    const ch = u >= 1 ? (twinkle > 0.93 ? "*" : "#") : "+*."[Math.abs(letter.seed | 0) % 3];
    const color = u >= 1 ? (twinkle > 0.55 ? PALETTE.gold : PALETTE.cream) : letter.color;
    stamp(Math.round(letter.x), Math.round(letter.y), ch, color);
  });
  return { chars, colors };
}

function paint(chars, colors) {
  let html = "";
  for (let y = 0; y < rows; y += 1) {
    let previous = "";
    let open = false;
    for (let x = 0; x < cols; x += 1) {
      const color = colors[y][x];
      const key = color[0] + "," + color[1] + "," + color[2];
      if (key !== previous) {
        if (open) html += "</span>";
        html += `<span style="color:rgb(${key})">`;
        previous = key;
        open = true;
      }
      html += chars[y][x];
    }
    if (open) html += "</span>";
    if (y !== rows - 1) html += "\n";
  }
  screen.innerHTML = html;
}

function fit() {
  const narrow = window.innerWidth < 760;
  const size = narrow ? 8 : 15;
  const leading = narrow ? "1.12" : "1.05";
  screen.style.fontSize = size + "px";
  screen.style.lineHeight = leading;
  probe.style.fontSize = size + "px";
  probe.style.lineHeight = leading;
  const cw = probe.getBoundingClientRect().width || 7;
  const ch = probe.getBoundingClientRect().height || 12;
  const area = stage.getBoundingClientRect();
  cols = Math.max(28, Math.floor(area.width / cw));
  rows = Math.max(18, Math.floor(area.height / ch));
  dims.textContent = cols + "×" + rows;
}

function showTime(now) {
  if (calm) return 12;
  return (now - started) / 1000;
}

function frame(now) {
  const elapsed = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  const t = showTime(now);
  if (!calm) step(t, elapsed || 0.016);
  paint(...(() => {
    const drawn = raster(t);
    return [drawn.chars, drawn.colors];
  })());
  requestAnimationFrame(frame);
}

function replay() {
  sim = makeSim();
  started = performance.now();
  last = started;
}

stage.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;
  const rect = screen.getBoundingClientRect();
  const cw = probe.getBoundingClientRect().width || 7;
  const ch = probe.getBoundingClientRect().height || 12;
  const x = (event.clientX - rect.left) / cw;
  const y = (event.clientY - rect.top) / ch;
  launch(sim.booms % 4 === 3 ? "heart" : "burst", x, y);
});
document.getElementById("replay").addEventListener("click", (event) => {
  event.stopPropagation();
  replay();
});
window.addEventListener("resize", () => {
  fit();
  if (sim.finale) {
    sim.letters = [];
    sim.finale = false;
    sim.locked = false;
    sim.cue = 4;
    const { cells } = textLayout();
    spawnLetters(cols / 2, 2, cells, showTime(performance.now()) - 3);
    sim.locked = true;
    sim.finale = true;
  }
});

scene = buildScene();
fit();
window.__ready = true;
window.__scene = {
  time: () => showTime(performance.now()),
  size: () => [cols, rows],
  letters: () => sim.letters.length,
  locked: () => sim.locked,
};
requestAnimationFrame(frame);
