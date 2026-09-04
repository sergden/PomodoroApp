import type { Settings } from "../lib/pomodoro";
import { MinusIcon, PlusIcon } from "./icons";

interface Props {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
}

function Stepper({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-md border border-line text-moss transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-90 disabled:pointer-events-none disabled:opacity-25";
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm font-medium text-pulp/90">{label}</span>
      <div className="flex items-center gap-2">
        <button className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Decrease ${label}`}>
          <MinusIcon className="h-3.5 w-3.5" />
        </button>
        <span key={value} className="animate-pop w-16 text-center font-mono text-sm font-bold text-pulp">
          {value}
          <span className="ml-1 text-[10px] font-normal text-moss">{unit}</span>
        </span>
        <button className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase ${label}`}>
          <PlusIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Toggle({ label, hint, on, onChange }: { label: string; hint: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="group flex w-full items-center justify-between gap-4 py-2.5 text-left"
    >
      <span>
        <span className="block text-sm font-medium text-pulp/90">{label}</span>
        <span className="block text-[11px] text-moss">{hint}</span>
      </span>
      <span
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300"
        style={{ background: on ? "var(--accent)" : "rgba(241,233,215,0.12)" }}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-all duration-300 ${
            on ? "left-[22px]" : "left-0.5"
          }`}
          style={{ boxShadow: on ? "0 0 10px var(--accent-glow)" : "none" }}
        />
      </span>
    </button>
  );
}

export function SettingsPanel({ settings, onChange }: Props) {
  return (
    <section
      className="animate-rise rounded-xl border border-line bg-panel/85 p-6"
      style={{ animationDelay: "0.3s" }}
      aria-label="Timer settings"
    >
      <header>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)] transition-colors duration-500">
          Tune
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">Durations &amp; flow</h2>
      </header>

      <div className="mt-4 divide-y divide-line">
        <Stepper label="Focus length" value={settings.focusMin} min={1} max={90} unit="min" onChange={(v) => onChange({ focusMin: v })} />
        <Stepper label="Short break" value={settings.shortMin} min={1} max={30} unit="min" onChange={(v) => onChange({ shortMin: v })} />
        <Stepper label="Long break" value={settings.longMin} min={5} max={60} unit="min" onChange={(v) => onChange({ longMin: v })} />
        <Stepper label="Long break every" value={settings.longEvery} min={2} max={8} unit="rds" onChange={(v) => onChange({ longEvery: v })} />
        <Stepper label="Daily goal" value={settings.dailyGoal} min={1} max={16} unit="rds" onChange={(v) => onChange({ dailyGoal: v })} />
      </div>

      <div className="mt-3 divide-y divide-line border-t border-line">
        <Toggle
          label="Auto-start breaks"
          hint="Roll straight into a break after focus"
          on={settings.autoStartBreaks}
          onChange={(v) => onChange({ autoStartBreaks: v })}
        />
        <Toggle
          label="Auto-start focus"
          hint="Jump back into focus after a break"
          on={settings.autoStartFocus}
          onChange={(v) => onChange({ autoStartFocus: v })}
        />
        <Toggle
          label="Completion chime"
          hint="A soft bell when a round ends"
          on={settings.soundOn}
          onChange={(v) => onChange({ soundOn: v })}
        />
      </div>

      <p className="mt-4 border-t border-line pt-4 font-mono text-[10px] leading-relaxed tracking-[0.06em] text-moss">
        New lengths apply from the next round. Everything is saved on this device.
      </p>
    </section>
  );
}
