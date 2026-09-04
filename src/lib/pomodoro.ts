export type Mode = "focus" | "short" | "long";
export type Status = "idle" | "running" | "paused";

export interface Settings {
  focusMin: number;
  shortMin: number;
  longMin: number;
  longEvery: number;
  dailyGoal: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundOn: boolean;
}

export interface SessionEntry {
  type: Mode;
  minutes: number;
  at: number;
}

export interface Store {
  settings: Settings;
  date: string;
  log: SessionEntry[];
}

export const DEFAULT_SETTINGS: Settings = {
  focusMin: 25,
  shortMin: 5,
  longMin: 15,
  longEvery: 4,
  dailyGoal: 8,
  autoStartBreaks: true,
  autoStartFocus: false,
  soundOn: true,
};

export const MODE_META: Record<
  Mode,
  { label: string; shortLabel: string; accent: string; soft: string; glow: string }
> = {
  focus: {
    label: "Focus",
    shortLabel: "Focus",
    accent: "#ff6b52",
    soft: "rgba(255, 107, 82, 0.13)",
    glow: "rgba(255, 107, 82, 0.38)",
  },
  short: {
    label: "Short Break",
    shortLabel: "Short",
    accent: "#56c98f",
    soft: "rgba(86, 201, 143, 0.13)",
    glow: "rgba(86, 201, 143, 0.36)",
  },
  long: {
    label: "Long Break",
    shortLabel: "Long",
    accent: "#74a9ff",
    soft: "rgba(116, 169, 255, 0.13)",
    glow: "rgba(116, 169, 255, 0.36)",
  },
};

const KEY = "pomodoro.store.v1";

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function clampNum(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === "number" && Number.isFinite(v) ? Math.round(v) : fallback;
  return Math.min(max, Math.max(min, n));
}

export function loadStore(): Store {
  const today = todayKey();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Store>;
      const s = { ...(p.settings ?? {}) } as Partial<Settings>;
      const settings: Settings = {
        focusMin: clampNum(s.focusMin, 1, 90, DEFAULT_SETTINGS.focusMin),
        shortMin: clampNum(s.shortMin, 1, 30, DEFAULT_SETTINGS.shortMin),
        longMin: clampNum(s.longMin, 5, 60, DEFAULT_SETTINGS.longMin),
        longEvery: clampNum(s.longEvery, 2, 8, DEFAULT_SETTINGS.longEvery),
        dailyGoal: clampNum(s.dailyGoal, 1, 16, DEFAULT_SETTINGS.dailyGoal),
        autoStartBreaks:
          typeof s.autoStartBreaks === "boolean" ? s.autoStartBreaks : DEFAULT_SETTINGS.autoStartBreaks,
        autoStartFocus:
          typeof s.autoStartFocus === "boolean" ? s.autoStartFocus : DEFAULT_SETTINGS.autoStartFocus,
        soundOn: typeof s.soundOn === "boolean" ? s.soundOn : DEFAULT_SETTINGS.soundOn,
      };
      const log: SessionEntry[] =
        p.date === today && Array.isArray(p.log)
          ? p.log.filter(
              (e): e is SessionEntry =>
                !!e &&
                (e.type === "focus" || e.type === "short" || e.type === "long") &&
                typeof e.minutes === "number" &&
                typeof e.at === "number"
            )
          : [];
      return { settings, date: today, log };
    }
  } catch {
    /* corrupted storage — fall through to defaults */
  }
  return { settings: { ...DEFAULT_SETTINGS }, date: today, log: [] };
}

export function saveStore(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function durationSeconds(settings: Settings, mode: Mode): number {
  const min = mode === "focus" ? settings.focusMin : mode === "short" ? settings.shortMin : settings.longMin;
  return min * 60;
}
