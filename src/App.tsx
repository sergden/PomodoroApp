import type { CSSProperties } from "react";
import { usePomodoro } from "./hooks/usePomodoro";
import { MODE_META } from "./lib/pomodoro";
import { TimerStage } from "./components/TimerStage";
import { StatsPanel } from "./components/StatsPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { SoundOffIcon, SoundOnIcon, TomatoIcon } from "./components/icons";
import { unlockAudio } from "./lib/sound";

const PARTICLES = [
  { left: "8%", top: "22%", size: 5, dur: 13, delay: 0, dx: 14, dy: -26 },
  { left: "16%", top: "68%", size: 3, dur: 17, delay: 1.2, dx: -10, dy: -34 },
  { left: "28%", top: "14%", size: 4, dur: 15, delay: 2.1, dx: 18, dy: 20 },
  { left: "46%", top: "82%", size: 6, dur: 19, delay: 0.6, dx: -16, dy: -22 },
  { left: "63%", top: "12%", size: 3, dur: 14, delay: 3, dx: 12, dy: 24 },
  { left: "78%", top: "38%", size: 5, dur: 16, delay: 1.8, dx: -14, dy: -30 },
  { left: "88%", top: "72%", size: 4, dur: 18, delay: 0.3, dx: 10, dy: -24 },
  { left: "38%", top: "36%", size: 3, dur: 21, delay: 2.6, dx: -8, dy: 18 },
];

export default function App() {
  const p = usePomodoro();
  const meta = MODE_META[p.mode];

  const themeVars = {
    "--accent": meta.accent,
    "--accent-soft": meta.soft,
    "--accent-glow": meta.glow,
  } as CSSProperties;

  return (
    <div style={themeVars} className="relative min-h-full overflow-hidden">
      {/* ————— ambient layers ————— */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: "linear-gradient(180deg, #111814 0%, #0d1310 42%, #0b100d 100%)" }}
      />
      {/* mode-tinted glows, crossfade on mode change */}
      <div key={p.mode} className="animate-glowfade pointer-events-none fixed inset-0 transition-opacity duration-700">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(820px 620px at 16% 18%, var(--accent-soft) 0%, transparent 60%), radial-gradient(900px 700px at 86% 82%, var(--accent-soft) 0%, transparent 62%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(1200px 800px at 50% 118%, rgba(0,0,0,0.5) 0%, transparent 60%)" }}
        />
      </div>
      {/* drifting seeds */}
      <div className="pointer-events-none fixed inset-0">
        {PARTICLES.map((pt, i) => (
          <span
            key={i}
            className="animate-floaty absolute rounded-full transition-colors duration-700"
            style={
              {
                left: pt.left,
                top: pt.top,
                width: pt.size,
                height: pt.size,
                background: "var(--accent)",
                opacity: 0.22,
                boxShadow: "0 0 12px var(--accent-glow)",
                animationDelay: `${pt.delay}s`,
                "--dur": `${pt.dur}s`,
                "--dx": `${pt.dx}px`,
                "--dy": `${pt.dy}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      {/* grain + vignette */}
      <div className="grain pointer-events-none fixed inset-0 opacity-[0.05] mix-blend-overlay" />

      {/* ————— content ————— */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 sm:px-8">
        <header className="animate-rise flex items-center justify-between gap-4 pt-6 sm:pt-8">
          <div className="flex items-center gap-2.5">
            <TomatoIcon className="h-7 w-7 drop-shadow-[0_0_12px_rgba(255,107,82,0.45)]" />
            <span className="font-display text-[22px] font-extrabold lowercase tracking-tight text-pulp">pomodoro</span>
            <span className="mt-1 hidden font-mono text-[9px] uppercase tracking-[0.28em] text-moss md:inline">
              focus, sliced thin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-moss sm:inline">
              {new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
            </span>
            <span className="hidden h-4 w-px bg-line sm:block" />
            <button
              onClick={() => {
                unlockAudio();
                p.updateSettings({ soundOn: !p.settings.soundOn });
              }}
              aria-label={p.settings.soundOn ? "Mute completion chime" : "Enable completion chime"}
              title={p.settings.soundOn ? "Chime on" : "Chime off"}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                p.settings.soundOn
                  ? "border-[var(--accent)]/50 bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-line bg-deep/70 text-moss hover:text-pulp"
              }`}
            >
              {p.settings.soundOn ? <SoundOnIcon className="h-4.5 w-4.5" /> : <SoundOffIcon className="h-4.5 w-4.5" />}
            </button>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-12 py-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
          <div className="animate-rise lg:pt-4" style={{ animationDelay: "0.05s" }}>
            <TimerStage
              mode={p.mode}
              status={p.status}
              secondsLeft={p.secondsLeft}
              total={p.total}
              flash={p.flash}
              cyclePos={p.stats.cyclePos}
              longEvery={p.settings.longEvery}
              onToggle={p.toggle}
              onReset={p.reset}
              onSkip={p.skip}
              onSwitchMode={p.switchMode}
            />
          </div>

          <aside className="flex flex-col gap-6">
            <StatsPanel stats={p.stats} settings={p.settings} log={p.log} />
            <SettingsPanel settings={p.settings} onChange={p.updateSettings} />
          </aside>
        </main>

        <footer
          className="animate-rise flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-line py-5"
          style={{ animationDelay: "0.4s" }}
        >
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-moss">
            <span className="kbd">space</span> start / pause
          </span>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-moss">
            <span className="kbd">R</span> reset
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-moss">
            {p.settings.longEvery} rounds earn a long break
          </span>
        </footer>
      </div>
    </div>
  );
}
