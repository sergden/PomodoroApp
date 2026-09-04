let ctx: AudioContext | null = null;

function ensureContext(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Call from a user gesture so the context is unlocked for later chimes. */
export function unlockAudio(): void {
  ensureContext();
}

/** Small two-tone bells: a rising chime when focus ends, a settling one when a break ends. */
export function playChime(kind: "focus-done" | "break-done"): void {
  const c = ensureContext();
  if (!c) return;
  const now = c.currentTime;
  const notes =
    kind === "focus-done"
      ? [523.25, 783.99, 1046.5] // C5 → G5 → C6
      : [659.25, 493.88]; // E5 → B4
  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const t = now + i * 0.17;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.2, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.6);
  });
}
