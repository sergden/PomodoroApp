interface IconProps {
  className?: string;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PlayIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M8 5.5v13a.6.6 0 0 0 .9.52l10.4-6.5a.6.6 0 0 0 0-1.04L8.9 4.98A.6.6 0 0 0 8 5.5Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
      <rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

export function ResetIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M3 12a9 9 0 1 0 3.2-6.9L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function SkipIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 5.6v12.8a.6.6 0 0 0 .93.5l9.57-6.4a.6.6 0 0 0 0-1L6.93 5.1a.6.6 0 0 0-.93.5Z" fill="currentColor" />
      <rect x="17.4" y="5" width="2.6" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

export function SoundOnIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9.5 9.5 0 0 1 0 13" />
    </svg>
  );
}

export function SoundOffIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="m16 9 6 6" />
      <path d="m22 9-6 6" />
    </svg>
  );
}

export function MinusIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} strokeWidth={2.4}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function PlusIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} strokeWidth={2.4}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TargetIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CoffeeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M17 8h1a3 3 0 1 1 0 6h-1" />
      <path d="M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Z" />
      <path d="M7 2v2.5M11 2v2.5" />
    </svg>
  );
}

export function MoonIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M12 3a6.5 6.5 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function TimerIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 10v3.5l2.4 1.8" />
      <path d="M9.5 2.5h5" />
    </svg>
  );
}

export function TomatoIcon({ className = "h-5 w-5", muted = false }: IconProps & { muted?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 21.2c-4.9 0-8.6-3.3-8.6-7.9 0-4.9 3.7-8 8.6-8s8.6 3.1 8.6 8c0 4.6-3.7 7.9-8.6 7.9Z"
        fill={muted ? "none" : "#ff6b52"}
        stroke={muted ? "currentColor" : "none"}
        strokeWidth={muted ? 1.6 : 0}
        opacity={muted ? 0.4 : 1}
      />
      <path
        d="M12 6.6c-.65-1.9-2.1-3-4-3.2 1.3-1 2.8-1.05 4-.45 1.2-.6 2.7-.55 4 .45-1.9.2-3.35 1.3-4 3.2Z"
        fill={muted ? "none" : "#56c98f"}
        stroke={muted ? "currentColor" : "none"}
        strokeWidth={muted ? 1.4 : 0}
        opacity={muted ? 0.4 : 1}
      />
      {!muted && <ellipse cx="8.6" cy="11.2" rx="1.7" ry="1.05" fill="#ffffff" opacity="0.28" transform="rotate(-24 8.6 11.2)" />}
    </svg>
  );
}
