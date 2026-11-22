#!/usr/bin/env python3
"""A 3D ASCII tulip bouquet for Terminal.

    python3 bouquet3d.py

Stems grow, tulips fill in, then the bouquet turns. Fireworks finish by
writing "happy anniversary love". Ctrl+C restores the cursor. Press r to
replay, space for an extra firework.
"""

from __future__ import annotations

import math
import random
import select
import shutil
import signal
import sys
import time

# Palette. Swap these to recolor the whole bouquet.
PALETTE = {
    "sky": (8, 10, 24),
    "hot": (255, 64, 142),
    "pink": (255, 128, 176),
    "blush": (255, 190, 208),
    "cream": (255, 244, 230),
    "gold": (240, 198, 112),
    "rose": (230, 62, 122),
    "leaf": (48, 196, 98),
    "leaf_dark": (18, 118, 62),
    "stem": (32, 158, 78),
    "wrap": (255, 246, 232),
    "ribbon": (255, 78, 146),
    "star": (236, 228, 214),
    "white": (255, 250, 244),
}

RAMP = " .:-=+*#%@"
FLOWERS = 7
HEAD_RINGS = 18
HEAD_ANGLES = 36
STEM_T0 = 0.20
STEM_GROW = 1.45
LEAF_T0 = 1.05
HEAD_T0 = 1.75
HEAD_STAGGER = 0.26
HEAD_FILL = 1.05
WRAP_T0 = 0.40
ROTATE_AT = 5.55
ROTATE_SPEED = 0.30
FINALE_AT = 7.05
LIGHT = (0.32, 0.86, 0.42)

# 5x7 glyphs, then a 3x5 set for narrow terminals.
FONT5 = {
    "a": ("01110", "10001", "10001", "11111", "10001", "10001", "10001"),
    "e": ("11111", "10000", "10000", "11110", "10000", "10000", "11111"),
    "h": ("10001", "10001", "10001", "11111", "10001", "10001", "10001"),
    "i": ("00100", "00000", "00100", "00100", "00100", "00100", "00100"),
    "l": ("10000", "10000", "10000", "10000", "10000", "10000", "11111"),
    "n": ("10001", "11001", "10101", "10011", "10001", "10001", "10001"),
    "o": ("01110", "10001", "10001", "10001", "10001", "10001", "01110"),
    "p": ("11110", "10001", "10001", "11110", "10000", "10000", "10000"),
    "r": ("11110", "10001", "10001", "11110", "10100", "10010", "10001"),
    "s": ("01111", "10000", "10000", "01110", "00001", "00001", "11110"),
    "v": ("10001", "10001", "10001", "10001", "01010", "01010", "00100"),
    "y": ("10001", "10001", "01010", "00100", "00100", "01000", "10000"),
    " ": ("00000", "00000", "00000", "00000", "00000", "00000", "00000"),
}
FONT3 = {
    "a": ("010", "101", "111", "101", "101"),
    "e": ("111", "100", "110", "100", "111"),
    "h": ("101", "111", "101", "101", "101"),
    "i": ("010", "000", "010", "010", "010"),
    "l": ("100", "100", "100", "100", "111"),
    "n": ("110", "101", "101", "101", "101"),
    "o": ("010", "101", "101", "101", "010"),
    "p": ("110", "101", "110", "100", "100"),
    "r": ("110", "101", "110", "101", "101"),
    "s": ("011", "100", "010", "001", "110"),
    "v": ("101", "101", "101", "101", "010"),
    "y": ("101", "101", "010", "010", "100"),
    " ": ("000", "000", "000", "000", "000"),
}
WORDS = ("happy", "anniversary", "love")

_RESTORED = False
_OLD_TERM = None
_SCENE = None


def vadd(a, b, s=1.0):
    return (a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s)


def vdot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def vnorm(v):
    n = math.sqrt(vdot(v, v)) or 1.0
    return (v[0] / n, v[1] / n, v[2] / n)


def vcross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def basis(axis):
    axis = vnorm(axis)
    helper = (0.0, 0.0, 1.0) if abs(axis[1]) > 0.82 else (0.0, 1.0, 0.0)
    u = vnorm(vcross(helper, axis))
    w = vcross(axis, u)
    return u, w


def mix(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def build_scene():
    """Static 3D points. Each is (x, y, z, nx, ny, nz, rgb, glyph, born, kind)."""
    rng = random.Random(21)
    pts = []
    neck = (0.0, -0.28, 0.0)
    golden = math.pi * (3.0 - math.sqrt(5.0))
    tones = (
        (PALETTE["hot"], PALETTE["pink"], PALETTE["cream"]),
        (PALETTE["blush"], PALETTE["pink"], PALETTE["cream"]),
        (PALETTE["rose"], PALETTE["hot"], PALETTE["gold"]),
        (PALETTE["pink"], PALETTE["blush"], PALETTE["cream"]),
        (PALETTE["cream"], PALETTE["blush"], PALETTE["gold"]),
        (PALETTE["hot"], PALETTE["rose"], PALETTE["cream"]),
        (PALETTE["blush"], PALETTE["cream"], PALETTE["gold"]),
        (PALETTE["rose"], PALETTE["pink"], PALETTE["blush"]),
        (PALETTE["pink"], PALETTE["hot"], PALETTE["gold"]),
        (PALETTE["cream"], PALETTE["pink"], PALETTE["gold"]),
    )
    heads = []
    for i in range(FLOWERS):
        # Stand the tulips upright in a dome. Side flowers lean out a little.
        az = i * golden
        ring = i / (FLOWERS - 1)
        spread = 0.02 + ring * 0.78
        height = 0.42 - ring * 0.22
        origin = (math.cos(az) * spread, height, math.sin(az) * spread * 0.62)
        axis = vnorm((origin[0] * 0.16, 1.0, origin[2] * 0.16))
        heads.append((origin, axis, tones[i % len(tones)], i))

    def push(pos, normal, rgb, born, kind, glyph=""):
        pts.append((pos[0], pos[1], pos[2], normal[0], normal[1], normal[2], rgb, glyph, born, kind))

    for origin, axis, tone, index in heads:
        u, w = basis(axis)
        deep, mid, lip = tone
        # Stem, growing from the neck up to the flower.
        for s in range(22):
            t = s / 21
            pos = (
                neck[0] + (origin[0] - neck[0]) * t,
                neck[1] + (origin[1] - neck[1]) * t,
                neck[2] + (origin[2] - neck[2]) * t,
            )
            bend = math.sin(t * math.pi) * 0.02
            pos = (pos[0] + axis[0] * bend, pos[1], pos[2] + axis[2] * bend)
            born = STEM_T0 + t * STEM_GROW + index * 0.03
            shade = PALETTE["stem"] if s % 3 else PALETTE["leaf_dark"]
            push(pos, (0.0, 0.0, 1.0), shade, born, "stem", "|")
            if s % 2 == 0:
                push((pos[0] + 0.015, pos[1], pos[2]), (0.0, 0.0, 1.0), shade, born, "stem", "|")

        # Long tulip leaves.
        for leaf_i, attach in enumerate((0.32, 0.52)):
            base = (
                neck[0] + (origin[0] - neck[0]) * attach,
                neck[1] + (origin[1] - neck[1]) * attach,
                neck[2] + (origin[2] - neck[2]) * attach,
            )
            outward = vnorm((origin[0] + (0.15 if leaf_i == 0 else -0.1), 0.35, origin[2] + (0.05 if leaf_i else -0.05)))
            side = vnorm(vcross(outward, (0.0, 1.0, 0.0)))
            length = 0.48 if leaf_i == 0 else 0.32
            for s in range(14):
                along = s / 13
                half = math.sin(along * math.pi) * (0.07 if leaf_i == 0 else 0.045)
                for k in range(-3, 4):
                    span = k / 3
                    pos = vadd(base, outward, along * length)
                    pos = vadd(pos, side, span * half)
                    pos = vadd(pos, (0.0, 1.0, 0.0), along * 0.08)
                    born = LEAF_T0 + index * 0.04 + along * 0.55 + leaf_i * 0.12
                    color = mix(PALETTE["leaf_dark"], PALETTE["leaf"], along)
                    normal = vnorm(vadd(outward, (0.0, 1.0, 0.0), 0.4))
                    push(pos, normal, color, born, "leaf")

        # Cup-shaped head. Three soft lobes, gold in the throat.
        for ring in range(HEAD_RINGS):
            t = ring / (HEAD_RINGS - 1)
            profile = math.sin(min(1.0, t ** 0.88) * math.pi) ** 0.78
            radius = 0.04 + 0.22 * profile
            height = 0.02 + t * 1.05
            for ang_i in range(HEAD_ANGLES):
                ang = ang_i / HEAD_ANGLES * math.pi * 2
                lobe = 0.68 + 0.32 * math.cos(3 * ang)
                pr = radius * lobe
                local = (pr * math.cos(ang), height, pr * math.sin(ang))
                pos = vadd(origin, u, local[0])
                pos = vadd(pos, axis, local[1])
                pos = vadd(pos, w, local[2])
                normal = vnorm((math.cos(ang), 0.25, math.sin(ang)))
                normal = vnorm(vadd(vadd(vadd((0, 0, 0), u, normal[0]), axis, normal[1]), w, normal[2]))
                if t < 0.45:
                    color = mix(deep, mid, t / 0.45)
                else:
                    color = mix(mid, lip, (t - 0.45) / 0.55)
                if abs(math.cos(3 * ang)) > 0.72 and t > 0.55:
                    color = mix(color, PALETTE["cream"], 0.45)
                born = HEAD_T0 + index * HEAD_STAGGER + t * HEAD_FILL
                push(pos, normal, color, born, "head")
            if 0.18 < t < 0.72:
                for ang_i in range(10):
                    ang = ang_i / 10 * math.pi * 2
                    pr = radius * 0.28
                    pos = vadd(origin, u, pr * math.cos(ang))
                    pos = vadd(pos, axis, height * 0.92)
                    pos = vadd(pos, w, pr * math.sin(ang))
                    born = HEAD_T0 + index * HEAD_STAGGER + t * HEAD_FILL + 0.15
                    push(pos, axis, PALETTE["gold"], born, "head")

        # A few sparkles born with each flower.
        for s in range(3):
            jitter = (
                rng.uniform(-0.18, 0.18),
                rng.uniform(0.15, 0.55),
                rng.uniform(-0.18, 0.18),
            )
            pos = vadd(origin, jitter)
            born = HEAD_T0 + index * HEAD_STAGGER + 0.4 + s * 0.05
            glyph = "*" if s != 1 else "+"
            push(pos, (0, 1, 0), PALETTE["gold"] if s == 0 else PALETTE["white"], born, "sparkle", glyph)

    # Cream wrap: horizontal dashed rings, wider toward the bottom.
    neck_y, foot_y = -0.22, -0.78
    for ring in range(9):
        t = ring / 8
        y = neck_y + (foot_y - neck_y) * t
        rad = 0.14 + 0.40 * t
        count = 26 + int(22 * t)
        for k in range(count):
            if (k + ring * 2) % 5 == 0:
                continue
            ang = k / count * math.pi * 2
            pos = (math.cos(ang) * rad, y, math.sin(ang) * rad * 0.78)
            born = WRAP_T0 + t * 0.7
            glyph = "=" if ring % 2 == 0 else "-"
            color = PALETTE["wrap"] if k % 4 else PALETTE["blush"]
            push(pos, (math.cos(ang), 0.1, math.sin(ang)), color, born, "wrap", glyph)

    # Pink ribbon and a small bow.
    for k in range(40):
        ang = k / 40 * math.pi * 2
        pos = (math.cos(ang) * 0.16, neck_y + 0.02, math.sin(ang) * 0.13)
        push(pos, (0, 1, 0), PALETTE["ribbon"], WRAP_T0 + 0.55, "ribbon", "=")
    bow_y = neck_y + 0.05
    for side in (-1, 1):
        for k in range(16):
            ang = k / 16 * math.pi * 2
            pos = (side * 0.15 + math.cos(ang) * 0.09, bow_y + math.sin(ang) * 0.07, 0.16)
            push(pos, (0, 0, 1), PALETTE["hot"], WRAP_T0 + 0.7, "ribbon", "o")
        for s in range(8):
            t = s / 7
            pos = (side * (0.08 + t * 0.16), bow_y - 0.02 - t * 0.22, 0.14)
            push(pos, (0, 0, 1), PALETTE["ribbon"], WRAP_T0 + 0.75, "ribbon", "|")
    push((0.0, bow_y, 0.18), (0, 0, 1), PALETTE["gold"], WRAP_T0 + 0.8, "ribbon", "o")

    # Short stem under the wrap.
    for s in range(8):
        y = foot_y - s * 0.035
        for x in (-0.02, 0.0, 0.02):
            push((x, y, 0.0), (0, 0, 1), PALETTE["stem"], WRAP_T0 + 0.2 + s * 0.03, "stem", "|")

    return pts


def scene():
    global _SCENE
    if _SCENE is None:
        _SCENE = build_scene()
    return _SCENE


def shade_char(brightness, kind, glyph):
    if glyph:
        return glyph
    ramp = RAMP
    index = max(0, min(len(ramp) - 1, int(brightness * (len(ramp) - 1))))
    if kind == "head":
        index = max(4, index)
    elif kind == "leaf" and index < 3:
        index = 3
    return ramp[index]


def project(x, y, z, yaw, cols, rows, row_top, row_bot):
    cy, sy = math.cos(yaw), math.sin(yaw)
    xr = x * cy + z * sy
    zr = -x * sy + z * cy
    y_top, y_bot = 1.6, -1.15
    span = max(8, row_bot - row_top)
    fy = span / (y_top - y_bot)
    fx = fy * 1.9
    if fx * 2.6 > cols * 0.94:
        shrink = (cols * 0.94) / (fx * 2.6)
        fx *= shrink
        fy *= shrink
    col = cols * 0.5 + xr * fx
    used = fy * (y_top - y_bot)
    slack = max(0, span - used)
    row = row_top + slack * 0.15 + (y_top - y) * fy
    depth = zr + 4.2
    return col, row, depth


def text_layout(cols, rows):
    gap = 1
    font, cw, ch = FONT3, 3, 5
    for candidate, cand_w, cand_h in ((FONT5, 5, 7), (FONT3, 3, 5)):
        need = max(len(word) for word in WORDS) * (cand_w + gap) - gap
        block = len(WORDS) * (cand_h + 1) - 1
        if need <= cols - 2 and block <= rows * 0.40:
            font, cw, ch = candidate, cand_w, cand_h
            break
    block_h = len(WORDS) * (ch + 1) - 1
    top = 1 if rows > block_h + 6 else 0
    cells = []
    for li, word in enumerate(WORDS):
        word_w = len(word) * (cw + gap) - gap
        x0 = max(0, (cols - word_w) // 2)
        y0 = top + li * (ch + 1)
        glyph_set = font
        for ci, char in enumerate(word):
            glyph = glyph_set[char]
            for gy, bits in enumerate(glyph):
                yy = y0 + gy
                if yy < 0 or yy >= rows:
                    continue
                for gx, bit in enumerate(bits):
                    if bit != "1":
                        continue
                    xx = x0 + ci * (cw + gap) + gx
                    if 0 <= xx < cols:
                        cells.append((xx, yy))
    bottom = top + block_h
    return cells, bottom


def yaw_at(t):
    if t < ROTATE_AT:
        return 0.42
    return 0.42 + (t - ROTATE_AT) * ROTATE_SPEED


class Sim:
    def __init__(self):
        self.sparks = []
        self.letters = []
        self.petals = []
        self.cue = 0
        self.finale = False
        self.locked = False
        self.booms = 0
        self.targets = []

    def reset(self):
        self.__init__()


def launch(sim, kind, x, y, colors):
    sim.booms += 1
    if kind == "heart":
        count = 54
        for i in range(count):
            ang = i / count * math.pi * 2
            hx = 16 * math.sin(ang) ** 3
            hy = -(13 * math.cos(ang) - 5 * math.cos(2 * ang) - 2 * math.cos(3 * ang) - math.cos(4 * ang))
            sim.sparks.append(
                {
                    "x": x,
                    "y": y,
                    "vx": hx * 0.085,
                    "vy": hy * 0.085,
                    "life": 2.4,
                    "max": 2.4,
                    "ch": "*" if i % 3 == 0 else "+",
                    "color": colors[i % len(colors)],
                }
            )
        return
    count = 46 if kind == "ring" else 36
    for i in range(count):
        ang = (i / count) * math.pi * 2
        if kind != "ring":
            ang += (i % 5) * 0.04
        speed = 10 if kind == "ring" else 6 + (i % 7)
        sim.sparks.append(
            {
                "x": x,
                "y": y,
                "vx": math.cos(ang) * speed,
                "vy": math.sin(ang) * speed * (0.55 if kind == "willow" else 1.0),
                "life": 2.1 if kind != "willow" else 2.8,
                "max": 2.8,
                "ch": "*+.o"[i % 4],
                "color": colors[i % len(colors)],
                "gravity": 7 if kind == "willow" else 2.2,
            }
        )


def spawn_letters(sim, origin_x, origin_y, bucket, born):
    colors = (PALETTE["cream"], PALETTE["gold"], PALETTE["white"], PALETTE["blush"], PALETTE["hot"])
    for index, (tx, ty) in enumerate(bucket):
        ang = (index * 2.399) % (math.pi * 2)
        sim.letters.append(
            {
                "x": origin_x,
                "y": origin_y,
                "sx": origin_x,
                "sy": origin_y,
                "mx": origin_x + math.cos(ang) * (4 + index % 7),
                "my": origin_y + math.sin(ang) * (3 + index % 5),
                "tx": tx,
                "ty": ty,
                "born": born,
                "dur": 1.7,
                "color": colors[index % len(colors)],
                "seed": index * 0.7,
            }
        )


def step(sim, t, dt, cols, rows):
    cues = (
        (2.5, "burst", 0.22, 0.16),
        (3.7, "ring", 0.78, 0.14),
        (4.9, "heart", 0.32, 0.18),
        (6.15, "willow", 0.70, 0.20),
        (FINALE_AT, "finale", 0.5, 0.08),
    )
    colors = (PALETTE["hot"], PALETTE["gold"], PALETTE["cream"], PALETTE["blush"], PALETTE["pink"])
    while sim.cue < len(cues) and t >= cues[sim.cue][0]:
        when, kind, fx, fy = cues[sim.cue]
        sim.cue += 1
        if kind == "finale":
            if not sim.finale:
                sim.finale = True
                targets, _bottom = text_layout(cols, rows)
                sim.targets = targets
                if targets:
                    third = max(1, len(targets) // 3)
                    buckets = (targets[:third], targets[third : third * 2], targets[third * 2 :])
                    ys = [p[1] for p in targets]
                    top = min(ys)
                    xs = [p[0] for p in targets]
                    origins = (
                        (min(xs), top),
                        ((min(xs) + max(xs)) // 2, max(0, top - 2)),
                        (max(xs), top),
                    )
                    for bucket, origin in zip(buckets, origins):
                        spawn_letters(sim, origin[0], origin[1], bucket, t)
                        launch(sim, "burst", origin[0], origin[1], colors)
        elif t - when < 0.35:
            launch(sim, kind, fx * cols, fy * rows, colors)

    if sim.locked and t > FINALE_AT + 4.5 and int(t * 2) != int((t - dt) * 2) and int(t) % 5 == 0:
        launch(sim, "burst", 4 if int(t) % 10 else cols - 5, 3, colors)

    alive = []
    for spark in sim.sparks:
        spark["vy"] += spark.get("gravity", 2.2) * dt
        spark["x"] += spark["vx"] * dt
        spark["y"] += spark["vy"] * dt
        spark["life"] -= dt
        if spark["life"] > 0 and -2 < spark["x"] < cols + 2 and -2 < spark["y"] < rows + 2:
            alive.append(spark)
    sim.sparks = alive

    arrived = 0
    for letter in sim.letters:
        u = 0 if letter["dur"] <= 0 else max(0.0, min(1.0, (t - letter["born"]) / letter["dur"]))
        if u < 0.28:
            e = 1 - (1 - u / 0.28) ** 3
            letter["x"] = letter["sx"] + (letter["mx"] - letter["sx"]) * e
            letter["y"] = letter["sy"] + (letter["my"] - letter["sy"]) * e
        else:
            e = (u - 0.28) / 0.72
            e = e * e * (3 - 2 * e)
            letter["x"] = letter["mx"] + (letter["tx"] - letter["mx"]) * e
            letter["y"] = letter["my"] + (letter["ty"] - letter["my"]) * e
        if u >= 1:
            arrived += 1
    if sim.letters and arrived == len(sim.letters):
        sim.locked = True

    if t > 2.4 and len(sim.petals) < 14 and rng_petal(t):
        sim.petals.append(
            {
                "x": cols * (0.2 + (len(sim.petals) * 0.07) % 0.6),
                "y": rows * 0.42,
                "vy": 3.5 + (len(sim.petals) % 4),
                "vx": -2 if len(sim.petals) % 2 else 2,
                "ch": "*o+"[len(sim.petals) % 3],
                "color": (PALETTE["hot"], PALETTE["blush"], PALETTE["cream"])[len(sim.petals) % 3],
            }
        )
    kept = []
    for petal in sim.petals:
        petal["y"] += petal["vy"] * dt
        petal["x"] += petal["vx"] * dt
        if petal["y"] < rows - 1:
            kept.append(petal)
    sim.petals = kept


def rng_petal(t):
    return int(t * 3) != int((t - 0.05) * 3)


def raster(t, cols, rows, sim):
    sky = PALETTE["sky"]
    chars = [[" "] * cols for _ in range(rows)]
    colors = [[sky] * cols for _ in range(rows)]
    depth = [[1e9] * cols for _ in range(rows)]
    _targets, text_bottom = text_layout(cols, rows)
    row_top = min(rows - 8, text_bottom + 2)
    row_bot = rows - 1
    yaw = yaw_at(t)
    light = vnorm(LIGHT)

    for i in range(max(12, cols * rows // 90)):
        x = (i * 47 + 3) % cols
        y = (i * 19 + 5) % rows
        if y <= text_bottom and sim.locked:
            continue
        tw = 0.5 + 0.5 * math.sin(t * 2.2 + i)
        if tw < 0.35:
            continue
        glyph = "*" if i % 11 == 0 else "." if i % 3 else "+"
        chars[y][x] = glyph
        colors[y][x] = PALETTE["star"] if i % 4 else PALETTE["gold"]

    for point in scene():
        if t < point[8]:
            continue
        col, row, dist = project(point[0], point[1], point[2], yaw, cols, rows, row_top, row_bot)
        ix, iy = int(col), int(row)
        if ix < 0 or iy < 0 or ix >= cols or iy >= rows or iy <= text_bottom:
            continue
        if dist >= depth[iy][ix]:
            continue
        kind = point[9]
        if kind == "sparkle":
            if math.sin(t * 4.0 + point[0] * 12) < 0.05:
                continue
        normal = vnorm((point[3], point[4], point[5]))
        bright = 0.38 + 0.62 * max(0.0, vdot(normal, light))
        bright *= 0.82 + 0.18 * max(0.0, min(1.0, 1.4 - dist * 0.15))
        # Grain so the heads look typed, not airbrushed.
        bright = max(0.0, min(1.0, bright + (((ix * 13 + iy * 7) % 5) - 2) * 0.035))
        chars[iy][ix] = shade_char(bright, kind, point[7])
        colors[iy][ix] = point[6]
        depth[iy][ix] = dist

    for spark in sim.sparks:
        ix, iy = int(spark["x"]), int(spark["y"])
        if 0 <= ix < cols and 0 <= iy < rows and spark["life"] > 0:
            chars[iy][ix] = spark["ch"]
            colors[iy][ix] = spark["color"]

    for petal in sim.petals:
        ix, iy = int(petal["x"]), int(petal["y"])
        if 0 <= ix < cols and 0 <= iy < rows:
            chars[iy][ix] = petal["ch"]
            colors[iy][ix] = petal["color"]

    for letter in sim.letters:
        ix, iy = int(round(letter["x"])), int(round(letter["y"]))
        if not (0 <= ix < cols and 0 <= iy < rows):
            continue
        u = max(0.0, min(1.0, (t - letter["born"]) / letter["dur"]))
        if u >= 1:
            twinkle = math.sin(t * 5.0 + letter["seed"])
            chars[iy][ix] = "*" if twinkle > 0.93 else "#"
            colors[iy][ix] = PALETTE["gold"] if twinkle > 0.55 else PALETTE["cream"]
        else:
            chars[iy][ix] = "+*."[int(letter["seed"]) % 3]
            colors[iy][ix] = letter["color"]

    return chars, colors


def paint(chars, colors, sky):
    out = ["\033[H"]
    previous = None
    for y, row in enumerate(chars):
        for x, ch in enumerate(row):
            color = colors[y][x]
            if color != previous:
                out.append(f"\033[38;2;{color[0]};{color[1]};{color[2]}m")
                previous = color
            out.append(ch)
        if y != len(chars) - 1:
            out.append("\n")
    out.append("\033[39m")
    return "".join(out)


def restore():
    global _RESTORED
    if _RESTORED:
        return
    _RESTORED = True
    sys.stdout.write("\033[0m\033[?25h\033[?7h\033[?1049l")
    sys.stdout.flush()
    if _OLD_TERM is not None:
        import termios

        termios.tcsetattr(sys.stdin.fileno(), termios.TCSADRAIN, _OLD_TERM)


def read_key():
    if not sys.stdin.isatty():
        return ""
    ready, _, _ = select.select([sys.stdin], [], [], 0)
    if not ready:
        return ""
    return sys.stdin.read(1)


def main():
    global _OLD_TERM, _RESTORED
    if not sys.stdout.isatty():
        sys.stderr.write("Run bouquet3d.py inside Terminal.\n")
        return 1
    import termios
    import tty

    _OLD_TERM = termios.tcgetattr(sys.stdin.fileno())
    tty.setcbreak(sys.stdin.fileno())
    sky = PALETTE["sky"]
    sys.stdout.write("\033[?1049h\033[?25l\033[?7l")
    sys.stdout.write(f"\033[48;2;{sky[0]};{sky[1]};{sky[2]}m\033[2J")
    sys.stdout.flush()

    def stop(*_args):
        restore()
        raise SystemExit(0)

    signal.signal(signal.SIGINT, stop)
    signal.signal(signal.SIGTERM, stop)
    sim = Sim()
    started = time.perf_counter()
    frame_time = 1 / 20
    try:
        while True:
            tick = time.perf_counter()
            size = shutil.get_terminal_size(fallback=(80, 24))
            cols, rows = max(20, size.columns), max(12, size.lines)
            sys.stdout.write(f"\033]0;bouquet3d.py — {cols}x{rows}\007")
            t = tick - started
            key = read_key()
            if key in ("r", "R"):
                sim.reset()
                started = time.perf_counter()
                t = 0
            elif key == " ":
                launch(
                    sim,
                    "heart" if sim.booms % 4 == 3 else "burst",
                    cols * 0.5,
                    rows * 0.3,
                    (PALETTE["hot"], PALETTE["gold"], PALETTE["cream"], PALETTE["pink"]),
                )
            step(sim, t, frame_time, cols, rows)
            chars, colors = raster(t, cols, rows, sim)
            sys.stdout.write(paint(chars, colors, sky))
            sys.stdout.flush()
            spare = frame_time - (time.perf_counter() - tick)
            if spare > 0:
                time.sleep(spare)
    finally:
        restore()
    return 0


if __name__ == "__main__":
    sys.exit(main())
