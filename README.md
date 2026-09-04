# 🍅 Pomodoro Focus

A crafted, tomato-red Pomodoro timer that runs your whole focus loop — focus rounds, short breaks, and long breaks — with custom durations, live today's statistics, and persistent storage. Built with ⚛️ React, 🟦 TypeScript, and 🎨 Tailwind CSS.

The whole experience re-themes itself around the active mode: **🎯 Focus** glows tomato-red, **☕ Short Break** settles into mint, and **🌙 Long Break** cools into sky blue — progress ring, dial glow, buttons, and page accents all follow along.

## ✨ Features

- **⏱️ Three modes** — Focus, Short Break, Long Break, switchable at any time from the tabbed mode switch.
- **🎛️ Full control set** — start ▶️ / pause ⏸️ / resume, reset the current round 🔄, or skip ahead to the next one ⏭️.
- **🧭 Precision timing engine** — the timer is driven by wall-clock timestamps rather than naïve interval counting, so it stays accurate even when the browser tab is throttled or briefly suspended. The page title mirrors the countdown while running 📑.
- **🍅 Long-break cycle** — every *N* completed focus rounds (configurable, 2–8) earns a long break, tracked with hand-drawn tomato markers beneath the dial.
- **⚙️ Custom durations** — adjust focus length (1–90 min), short break (1–30 min), long break (5–60 min), the long-break interval, and your daily round goal via steppers in the settings panel.
- **🔀 Flow toggles** — optionally auto-start breaks after focus and/or focus after breaks.
- **🔔 Completion chime** — a soft WebAudio bell (a rising triad when focus ends, a settling pair of notes when a break ends). Toggleable, and unlocked on first interaction so it never blocks.
- **📊 Today's statistics** — completed focus rounds, total deep-focus time, total recovery time, and an animated daily-goal progress bar. Below it, a scrollable session log with type, duration, and timestamp for every round.
- **💾 Persistent storage** — settings and the daily log live in `localStorage` and are saved on every change. The log resets automatically at midnight via a rollover check 🌗.

## 🎬 Live details

- A large SVG dial with minute ticks, a glow-traced progress arc, and a blinking colon while running.
- Breathing radial glow, drifting ambient particles, and a film-grain overlay keep the backdrop alive without stealing focus.
- Completion flashes ⚡, pop-in numbers, staggered reveals, and hover feedback on every control — all suppressed under `prefers-reduced-motion` 🤫.

## ⌨️ Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` ␣ | ▶️ / ⏸️ Start / pause / resume the timer |
| `R` | 🔄 Reset the current round |
| `1` `2` `3` | 🎯 / ☕ / 🌙 Jump to Focus / Short Break / Long Break |

## 🛠️ Tech stack

- **⚛️ React 18** + **🟦 TypeScript**, bundled with **⚡ Vite**
- **🎨 Tailwind CSS v4** with custom `@theme` tokens (palette, fonts, keyframes)
- **🔤 Bricolage Grotesque** for display type, **🔢 Space Mono** for numerals and labels
- **🪶 Zero runtime dependencies** beyond React — icons are hand-drawn inline SVG ✏️, sound is raw WebAudio 🔊

## 🚀 Getting started

```bash
npm install        # 📦 install dependencies
npm run dev        # 🧪 local dev server
npm run build      # 🏗️ production build → dist/
```

## 📁 Project structure

```
src/
├── App.tsx                    # 🧩 Composition, ambient background, header/footer
├── components/
│   ├── TimerStage.tsx         # ⏱️ Mode switch, SVG dial, cycle tomatoes, controls
│   ├── StatsPanel.tsx         # 📊 Today's stats, goal bar, session log
│   ├── SettingsPanel.tsx      # ⚙️ Duration steppers, flow & sound toggles
│   └── icons.tsx              # ✏️ Inline SVG icon set + tomato mark 🍅
├── hooks/
│   └── usePomodoro.ts         # 🧠 Timer engine, persistence, stats, shortcuts
└── lib/
    ├── pomodoro.ts            # 🧱 Types, defaults, storage, formatting helpers
    └── sound.ts               # 🔔 WebAudio chime + context unlock
```

## 💾 Data model

Everything is stored under a single key, `pomodoro.store.v1` 🔑:

```jsonc
{
  "settings": { "focusMin": 25, "shortMin": 5, "longMin": 15, "longEvery": 4,
                "dailyGoal": 8, "autoStartBreaks": true, "autoStartFocus": false,
                "soundOn": true },
  "date": "2026-2-14",           // 📅 local calendar day; log clears on rollover
  "log": [{ "type": "focus", "minutes": 25, "at": 1771081200000 }]
}
```

Corrupted or missing storage falls back safely to defaults 🛟.

## 📄 License

MIT — take it, tune it, focus. 🍅
