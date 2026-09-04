import type { TodayStats } from "../hooks/usePomodoro";
import { Mode, SessionEntry, Settings, MODE_META, formatClock } from "../lib/pomodoro";
import { TomatoIcon } from "./icons";

interface Props {
  stats: TodayStats;
  settings: Settings;
  log: SessionEntry[];
}

function minutesLabel(m: number): string {
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rest = m % 60;
    return rest > 0 ? `${h}h ${rest}m` : `${h}h`;
  }
  return `${m}m`;
}

const TYPE_LABEL: Record<Mode, string> = {
  focus: "Focus round",
  short: "Short break",
  long: "Long break",
};

export function StatsPanel({ stats, settings, log }: Props) {
  const goalPct = Math.min(100, Math.round((stats.sessions / settings.dailyGoal) * 100));
  const goalReached = stats.sessions >= settings.dailyGoal;
  const entries = [...log].reverse();

  return (
    <section
      className="animate-rise rounded-xl border border-line bg-panel/85 p-6"
      style={{ animationDelay: "0.15s" }}
      aria-label="Today's focus statistics"
    >
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent)] transition-colors duration-500">
            Track
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">Today</h2>
        </div>
        <span className="rounded-full border border-line bg-pulp/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-moss">
          {new Date().toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </header>

      {/* headline number */}
      <div className="mt-5 flex items-end gap-3">
        <span
          key={stats.sessions}
          className="animate-pop font-display text-[64px] font-extrabold leading-[0.85] tracking-tight text-pulp"
        >
          {stats.sessions}
        </span>
        <span className="pb-1 font-mono text-[11px] uppercase leading-tight tracking-[0.18em] text-moss">
          focus rounds
          <br />
          completed
        </span>
      </div>

      {/* secondary stats */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-line bg-pulp/[0.03] px-4 py-3 transition-colors duration-300 hover:border-[var(--accent)]/40">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-moss">
            <span className="h-2 w-2 rounded-full bg-tomato shadow-[0_0_10px_rgba(255,107,82,0.6)]" />
            Deep focus
          </p>
          <p key={`f-${stats.focusMinutes}`} className="animate-pop mt-1.5 font-display text-xl font-bold">
            {minutesLabel(stats.focusMinutes)}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-pulp/[0.03] px-4 py-3 transition-colors duration-300 hover:border-skyx/40">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-moss">
            <span className="h-2 w-2 rounded-full bg-skyx shadow-[0_0_10px_rgba(116,169,255,0.6)]" />
            Recovery
          </p>
          <p key={`b-${stats.breakMinutes}`} className="animate-pop mt-1.5 font-display text-xl font-bold">
            {minutesLabel(stats.breakMinutes)}
          </p>
        </div>
      </div>

      {/* daily goal */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-moss">Daily goal</p>
          <p className="font-mono text-[11px] font-bold text-pulp">
            {Math.min(stats.sessions, settings.dailyGoal)}
            <span className="text-moss"> / {settings.dailyGoal}</span>
          </p>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-pulp/[0.07]">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${goalPct}%`,
              background: goalReached ? "#56c98f" : "var(--accent)",
              boxShadow: goalReached ? "0 0 14px rgba(86,201,143,0.55)" : "0 0 14px var(--accent-glow)",
            }}
          />
        </div>
        <p className={`mt-2 font-mono text-[10px] uppercase tracking-[0.16em] ${goalReached ? "text-mint" : "text-moss"}`}>
          {goalReached ? "goal reached — take a bow" : `${settings.dailyGoal - stats.sessions} to go`}
        </p>
      </div>

      {/* session log */}
      <div className="mt-6 border-t border-line pt-5">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-pulp/90">Session log</h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-moss">{log.length} entries</span>
        </div>

        {entries.length === 0 ? (
          <div className="mt-3 flex flex-col items-center gap-3 rounded-lg border border-dashed border-line px-4 py-8 text-center">
            <TomatoIcon className="h-8 w-8 text-moss" muted />
            <p className="max-w-[24ch] text-sm leading-relaxed text-moss">
              Nothing logged yet. Finish a focus round and it will show up here.
            </p>
          </div>
        ) : (
          <ul className="scroll-slim mt-3 flex max-h-[228px] flex-col gap-1.5 overflow-y-auto pr-1">
            {entries.map((e, i) => (
              <li
                key={e.at + "-" + i}
                className={`flex items-center gap-3 rounded-lg bg-pulp/[0.035] px-3.5 py-2.5 transition-all duration-300 hover:translate-x-1 hover:bg-pulp/[0.07] ${
                  i === 0 ? "animate-rise" : ""
                }`}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background: MODE_META[e.type].accent,
                    boxShadow: `0 0 10px ${MODE_META[e.type].glow}`,
                  }}
                />
                <span className="text-sm font-medium">{TYPE_LABEL[e.type]}</span>
                <span className="ml-auto font-mono text-[11px] text-moss">
                  {e.minutes}m · {formatClock(e.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
