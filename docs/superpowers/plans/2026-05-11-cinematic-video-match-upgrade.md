# Cinematic Video Match Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the first version with a higher-end cinematic CropTab demo that matches the Douyin reference more closely.

**Architecture:** Replace the scroll-page structure with a fixed presentation stage and seven timed shots. HTML owns the shot content, CSS owns the visual language and image-like compositions, and JavaScript owns the cinematic timeline, progress, wipes, and navigation.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node verification scripts, Netlify static deploy.

---

### Task 1: Red Test For Cinematic Structure

**Files:**
- Modify: `tests/site-check.mjs`

- [ ] Require the new markers: `cinematic-stage`, `shot`, `hero-product`, `wipe-bar`, `photo-panel`, `farm-panorama`, `timeline-dots`, and `shot-progress`.
- [ ] Reject old markers: `root-system`, `panel-grid`, `showcase-strip`, `soil-window`, and `video-mode-toggle`.
- [ ] Run `node tests/site-check.mjs` and verify it fails before implementation.

### Task 2: Replace The Old Site

**Files:**
- Replace: `index.html`
- Replace: `styles.css`
- Replace: `script.js`

- [ ] Build seven full-screen cinematic shots inspired by the video frames.
- [ ] Use product-centered green opener, cream/white transitions, crop/animal/photo panels, waterline/soil product movement, data overlays, and final seedling CTA.
- [ ] Use automatic timeline playback plus manual dot navigation.
- [ ] Remove old sections, old controls, old root/dashboard components, and old scroll-first behavior.

### Task 3: Verify, Deploy, Push

**Files:**
- Modify only deployment metadata if needed.

- [ ] Run `node tests/site-check.mjs`.
- [ ] Run `node tests/visual-check.mjs`.
- [ ] Deploy to Netlify production.
- [ ] Commit, push to GitHub, and confirm the live URL returns the new cinematic markers.
