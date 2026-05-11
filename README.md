# CropTab Immersive Fertilizer Site

A zero-dependency immersive agriculture fertilizer landing page inspired by the referenced Douyin video.

## Local Preview

Open `index.html` directly in a browser, or run a simple static server:

```powershell
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Verify

```powershell
node tests/site-check.mjs
node tests/visual-check.mjs
```

The visual check writes `site-mobile-preview.png`.

## Netlify

This project is Netlify-ready:

- Build command: empty
- Publish directory: `.`
- Config file: `netlify.toml`

If Netlify CLI is installed and logged in:

```powershell
netlify deploy --dir . --prod
```

Live deployment:

https://croptab-immersive-fertilizer-20260511.netlify.app

## GitHub

If GitHub CLI is installed and logged in:

```powershell
git init
git add index.html styles.css script.js netlify.toml _redirects README.md tests docs
git commit -m "Build immersive agriculture fertilizer site"
gh repo create croptab-immersive-fertilizer-site --public --source . --remote origin --push
```
