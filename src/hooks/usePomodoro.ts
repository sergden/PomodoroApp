import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Mode,
  Settings,
  Status,
  Store,
  durationSeconds,
  formatTime,
  loadStore,
  MODE_META,
  saveStore,
  todayKey,
} from "../lib/pomodoro";
import { playChime, unlockAudio } from "../lib/sound";

export interface TodayStats {
  sessions: number;
  focusMinutes: number;
  breakMinutes: number;
  cyclePos: number;
}

export function usePomodoro() {
  const [store, setStore] = useState<Store>(() => loadStore());
  const settings = store.settings;
  const log = store.log;

  const [mode, setMode] = useState<Mode>("focus");
  const [status, setStatus] = useState<Status>("idle");
  const [total, setTotal] = useState(() => durationSeconds(store.settings, "focus"));
  const [secondsLeft, setSecondsLeft] = useState(() => durationSeconds(store.settings, "focus"));
  const [flash, setFlash] = useState(0);

  const endAtRef = useRef(0);
  const storeRef = useRef(store);
  storeRef.current = store;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const statusRef = useRef(status);
  statusRef.current = status;

  /* ————— persistence ————— */
  useEffect(() => {
    saveStore(store);
  }, [store]);

  /* ————— midnight rollover ————— */
  useEffect(() => {
    const today = todayKey();
    if (storeRef.current.date !== today) {
      setStore((s) => ({ ...s, date: today, log: [] }));
    }
    const id = window.setInterval(() => {
      if (todayKey() !== storeRef.current.date) {
        setStore((s) => ({ ...s, date: todayKey(), log: [] }));
      }
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  /* ————— finish a round and roll into the next mode ————— */
  const finish = useCallback((credited: boolean) => {
    const s = storeRef.current;
    const st = s.settings;
    const m = modeRef.current;

    let nextLog = s.log;
    if (credited) {
      const minutes = m === "focus" ? st.focusMin : m === "short" ? st.shortMin : st.longMin;
      nextLog = [...s.log, { type: m, minutes, at: Date.now() }];
    }

    let next: Mode;
    if (m === "focus") {
      const focusCount = nextLog.filter((e) => e.type === "focus").length;
      next = focusCount > 0 && focusCount % st.longEvery === 0 ? "long" : "short";
    } else {
      next = "focus";
    }

    setStore((prev) => ({ ...prev, log: nextLog }));
    setFlash((f) => f + 1);
    if (st.soundOn) playChime(m === "focus" ? "focus-done" : "break-done");

    const nextTotal = durationSeconds(st, next);
    setMode(next);
    setTotal(nextTotal);
    setSecondsLeft(nextTotal);

    const auto = next === "focus" ? st.autoStartFocus : st.autoStartBreaks;
    if (auto) {
      endAtRef.current = Date.now() + nextTotal * 1000;
      setStatus("running");
    } else {
      setStatus("idle");
    }
  }, []);

  const finishRef = useRef(finish);
  finishRef.current = finish;

  /* ————— ticking (timestamp based, drift free) ————— */
  useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => {
      if (todayKey() !== storeRef.current.date) {
        setStore((s) => ({ ...s, date: todayKey(), log: [] }));
      }
      const rem = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
      setSecondsLeft((prev) => (prev === rem ? prev : rem));
      if (rem <= 0) finishRef.current(true);
    }, 250);
    return () => window.clearInterval(id);
  }, [status]);

  /* ————— controls ————— */
  const start = useCallback(() => {
    unlockAudio();
    if (statusRef.current === "running") return;
    setSecondsLeft((left) => {
      const safe = left <= 0 ? durationSeconds(storeRef.current.settings, modeRef.current) : left;
      endAtRef.current = Date.now() + safe * 1000;
      return safe;
    });
    setStatus("running");
  }, []);

  const pause = useCallback(() => {
    if (statusRef.current !== "running") return;
    setSecondsLeft(Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000)));
    setStatus("paused");
  }, []);

  const toggle = useCallback(() => {
    if (statusRef.current === "running") pause();
    else start();
  }, [pause, start]);

  const reset = useCallback(() => {
    setStatus("idle");
    setSecondsLeft(durationSeconds(storeRef.current.settings, modeRef.current));
  }, []);

  const switchMode = useCallback(
    (m: Mode) => {
      if (m === modeRef.current && statusRef.current === "idle") return;
      const t = durationSeconds(storeRef.current.settings, m);
      setMode(m);
      setTotal(t);
      setSecondsLeft(t);
      setStatus("idle");
    },
    []
  );

  const skip = useCallback(() => finishRef.current(false), []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setStore((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  /* keep the idle dial in sync when durations change */
  useEffect(() => {
    if (statusRef.current === "idle") {
      const t = durationSeconds(settings, mode);
      setTotal(t);
      setSecondsLeft(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.focusMin, settings.shortMin, settings.longMin, settings.longEvery, settings.dailyGoal]);

  /* ————— keyboard: space toggles, R resets ————— */
  const toggleRef = useRef(toggle);
  toggleRef.current = toggle;
  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (e.code === "Space") {
        e.preventDefault();
        toggleRef.current();
      } else if (e.key === "r" || e.key === "R") {
        resetRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ————— live document title ————— */
  useEffect(() => {
    const base = "Pomodoro — Focus Timer";
    document.title =
      status === "idle" && secondsLeft === total
        ? base
        : `${formatTime(secondsLeft)} · ${MODE_META[mode].label} — Pomodoro`;
  }, [secondsLeft, status, mode, total]);

  /* ————— derived stats for today ————— */
  const stats: TodayStats = useMemo(() => {
    const focusEntries = log.filter((e) => e.type === "focus");
    const focusMinutes = focusEntries.reduce((a, e) => a + e.minutes, 0);
    const breakMinutes = log.filter((e) => e.type !== "focus").reduce((a, e) => a + e.minutes, 0);
    let cyclePos = 0;
    for (let i = log.length - 1; i >= 0; i--) {
      if (log[i].type === "long") break;
      if (log[i].type === "focus") cyclePos++;
    }
    return { sessions: focusEntries.length, focusMinutes, breakMinutes, cyclePos };
  }, [log]);

  return {
    mode,
    status,
    total,
    secondsLeft,
    flash,
    settings,
    log,
    stats,
    start,
    pause,
    toggle,
    reset,
    skip,
    switchMode,
    updateSettings,
  };
}
