# Immersive Agri Fertilizer Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Netlify-ready immersive agriculture fertilizer landing site inspired by the referenced Douyin video.

**Architecture:** Use a zero-dependency static site so the project can run without npm. The page is split into semantic scroll sections, CSS handles the visual system and responsive layout, and plain JavaScript drives progress, reveal states, and particle placement.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node-based verification script, Netlify static publish config.

---

### Task 1: Verification Harness

**Files:**
- Create: `tests/site-check.mjs`

- [ ] **Step 1: Write the failing test**

Create a Node script that reads project files and checks for the core experience: five sections, agriculture fertilizer copy, animated canvas/particles, mobile viewport metadata, and Netlify publish config.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/site-check.mjs`

Expected: FAIL because `index.html`, `styles.css`, `script.js`, and `netlify.toml` do not exist yet.

### Task 2: Static Website

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`

- [ ] **Step 1: Implement semantic HTML**

Create a single-page site with hero, soil immersion, root uptake, smart dosing dashboard, and harvest result sections.

- [ ] **Step 2: Implement responsive visual design**

Create a green agriculture technology visual system with layered depth, particles, dashboards, crop imagery simulated in CSS, and phone-friendly layout.

- [ ] **Step 3: Implement scroll interaction**

Use IntersectionObserver and scroll progress to reveal sections, animate nutrient particles, and keep the experience alive without external dependencies.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/site-check.mjs`

Expected: PASS.

### Task 3: Netlify Configuration

**Files:**
- Create: `netlify.toml`
- Create: `_redirects`

- [ ] **Step 1: Configure static publishing**

Set Netlify publish directory to `.` and add a SPA fallback redirect.

- [ ] **Step 2: Verify files**

Run: `node tests/site-check.mjs`

Expected: PASS with Netlify checks included.

### Task 4: Publish Attempt

**Files:**
- Use local repository state.

- [ ] **Step 1: Check tooling**

Run `git --version`, `gh --version`, and `netlify --version`.

- [ ] **Step 2: Push/deploy if authenticated tools exist**

If the CLIs are available and authenticated, initialize or use the repository, commit the site, push to GitHub, and deploy through Netlify CLI.

- [ ] **Step 3: Report blockers clearly**

If required CLIs are unavailable, report exactly what was completed locally and which commands the user can run after installing/signing in.
