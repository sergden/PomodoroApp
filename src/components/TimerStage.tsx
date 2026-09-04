import type { ComponentType } from "react";
import { Mode, Status, MODE_META, formatClock, formatTime } from "../lib/pomodoro";
import {
  CoffeeIcon,
  MoonIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
  SkipIcon,
  TargetIcon,
  TomatoIcon,
} from "./icons";

interface Props {
  mode: Mode;
  status: Status;
  secondsLeft: number;
  total: number;
  flash: number;
  cyclePos: number;
  longEvery: number;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  onSwitchMode: (m: Mode) => void;
}

const R = 180;
const C = 2 * Math.PI * R;

const MODE_ICONS: Record<Mode, ComponentType<{ className?: string }>> = {
  focus: TargetIcon,
  short: CoffeeIcon,
  long: MoonIcon,
};

export function TimerStage({
  mode,
  status,
  secondsLeft,
  total,
  flash,
  cyclePos,
  longEvery,
  onToggle,
  onReset,
  onSkip,
  onSwitchMode,
}: Props) {
  const meta = MODE_META[mode];
  const [mm, ss] = formatTime(secondsLeft).split(":");
  const progress = total > 0 ? secondsLeft / total : 0;
  const dashOffset = C * (1 - progress);
  const running = status === "running";

  const primaryLabel =
    status === "running" ? "Pause" : status === "paused" ? "Resume" : mode === "focus" ? "Start Focus" : "Start Break";

  const statusLine = running
    ? `finishes at ${formatClock(Date.now() + secondsLeft * 1000)}`
    : status === "paused"
      ? "paused — space to resume"
      : mode === "focus"
        ? `ready · round ${Math.min(cyclePos + 1, longEvery)} of ${longEvery}`
        : "ready · you earned this";

  return (
    <section className="flex select-none flex-col items-center gap-9" aria-label="Timer">
      {/* mode switch */}
      <div
        className="flex items-center gap-1 rounded-full border border-line bg-deep/80 p-1.5 backdrop-blur-sm"
        role="tablist"
        aria-label="Timer mode"
      >
        {(Object.keys(MODE_META) as Mode[]).map((m) => {
          const Icon = MODE_ICONS[m];
          const active = m === mode;
          return (
            <button
              key={m}
              role="tab"
              aria-selected={active}
              onClick={() => onSwitchMode(m)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300 sm:px-5 ${
                active
                  ? "bg-[var(--accent)] text-ink shadow-[0_6px_24px_var(--accent-glow)]"
                  : "text-moss hover:bg-pulp/5 hover:text-pulp"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{MODE_META[m].shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* dial */}
      <div className="relative aspect-square w-[min(82vw,400px)]">
        {/* breathing glow */}
        <div
          className="animate-breathe absolute -inset-12 rounded-full blur-3xl transition-colors duration-700"
          style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 62%)" }}
        />
        {/* concentric decor */}
        <div className="absolute -inset-7 rounded-full border border-pulp/[0.05]" />
        <div className="absolute -inset-14 rounded-full border border-pulp/[0.03]" />

        {/* completion flash */}
        {flash > 0 && (
          <div
            key={flash}
            className="animate-flashring pointer-events-none absolute inset-0 rounded-full border-2"
            style={{ borderColor: "var(--accent)" }}
          />
        )}

        <svg viewBox="0 0 400 400" className="relative h-full w-full -rotate-90">
          {/* minute ticks */}
          {Array.from({ length: 60 }, (_, i) => {
            const major = i % 5 === 0;
            const a = (i * 6 * Math.PI) / 180;
            const r1 = major ? 191 : 194;
            const r2 = 199;
            return (
              <line
                key={i}
                x1={200 + r1 * Math.cos(a)}
                y1={200 + r1 * Math.sin(a)}
                x2={200 + r2 * Math.cos(a)}
                y2={200 + r2 * Math.sin(a)}
                stroke="rgba(241,233,215,0.16)"
                strokeWidth={major ? 2 : 1}
              />
            );
          })}
          {/* track */}
          <circle cx="200" cy="200" r={R} fill="none" stroke="rgba(241,233,215,0.08)" strokeWidth="10" />
          {/* progress */}
          <circle
            cx="200"
            cy="200"
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={dashOffset}
            style={{
              transition: running ? "stroke-dashoffset 0.45s linear, stroke 0.6s ease" : "stroke-dashoffset 0.35s ease, stroke 0.6s ease",
              filter: "drop-shadow(0 0 10px var(--accent-glow))",
            }}
          />
        </svg>

        {/* center readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <p
            className="font-mono text-[11px] font-bold uppercase tracking-[0.34em] transition-colors duration-500"
            style={{ color: "var(--accent)" }}
          >
            {meta.label}
          </p>
          <h1
            key={mode}
            className="animate-pop font-mono text-[clamp(3.6rem,13vw,6.2rem)] font-bold leading-none tracking-tight text-pulp"
            style={{ textShadow: "0 0 44px var(--accent-glow)", fontVariantNumeric: "tabular-nums" }}
            aria-label={`${mm} minutes ${ss} seconds remaining`}
          >
            {mm}
            <span className={running ? "animate-colon" : ""}>:</span>
            {ss}
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">{statusLine}</p>
        </div>
      </div>

      {/* cycle dots */}
      <div className="flex items-center gap-2.5" aria-label={`${cyclePos} of ${longEvery} rounds until long break`}>
        {Array.from({ length: longEvery }, (_, i) => (
          <span key={`${i}-${i < cyclePos}`} className={i < cyclePos ? "animate-pop" : ""}>
            <TomatoIcon className="h-[22px] w-[22px] text-moss" muted={i >= cyclePos} />
          </span>
        ))}
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-moss">
          {cyclePos}/{longEvery} to long break
        </span>
      </div>

      {/* controls */}
      <div className="flex items-center gap-5">
        <button
          onClick={onReset}
          aria-label="Reset timer"
          title="Reset (R)"
          className="group flex h-14 w-14 items-center justify-center rounded-full border border-line bg-deep/70 text-moss transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] active:translate-y-0 active:scale-95"
        >
          <ResetIcon className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-[300deg]" />
        </button>

        <button
          onClick={onToggle}
          className="flex min-w-[196px] items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-9 py-4 font-display text-lg font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.97]"
          style={{ boxShadow: "0 10px 38px var(--accent-glow)" }}
        >
          {running ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5 translate-x-[1px]" />}
          {primaryLabel}
        </button>

        <button
          onClick={onSkip}
          aria-label="Skip to next round"
          title="Skip round"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-deep/70 text-moss transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] active:translate-y-0 active:scale-95"
        >
          <SkipIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  );
}
