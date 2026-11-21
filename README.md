# happy anniversary love

A static night-sky page: a bouquet of tulips grows and blooms, fireworks drift overhead, and the last bursts gather into the words **happy anniversary love**.

Open it on a phone. Tap anywhere for another firework. Replay starts the whole show again.

## Run locally

From this folder:

```bash
python3 -m http.server 4317
```

Then open [http://127.0.0.1:4317](http://127.0.0.1:4317).

## Colors

Every color lives in the `:root` block at the top of `styles.css`. Change those variables to recolor the sky, tulips, ribbon, and sparks together.

## Deploy on Vercel

This is a static site. There is no install step and no build.

1. Import the project in Vercel.
2. Framework preset: **Other**.
3. Build command: leave empty.
4. Output directory: `.` (the project root).
5. Install command: leave empty.

`index.html` is served from the root. After the first deploy, set the Open Graph image to an absolute URL if a preview does not pick up `og.png`:

```html
<meta property="og:image" content="https://YOUR-DOMAIN/og.png" />
```

The page title and `og:title` are `happy anniversary love`.
