# happy anniversary love

A 3D tulip bouquet drawn with terminal characters. Stems grow, the cups fill in, then the bouquet turns. Fireworks finish by writing **happy anniversary love**.

## Run it in Terminal

```bash
python3 bouquet3d.py
```

It fits the window. Ctrl+C restores the cursor. Press `r` to replay and space for another firework. Colors are the `PALETTE` dict at the top of `bouquet3d.py`.

## The page

The same picture runs in the browser, in a fake Terminal window. Tap the screen for a firework. Replay starts the build again. The matching palette is `PALETTE` at the top of `main.js` and the `:root` block in `styles.css`.

```bash
python3 -m http.server 4317
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

## Deploy on Vercel

Static site, no install and no build.

- Framework preset: **Other**
- Build command: empty
- Output directory: `.`
- Install command: empty

The page title and `og:title` are `happy anniversary love`. After deploy, point `og:image` at `https://YOUR-DOMAIN/og.png` if a text preview does not pick up the relative image.
