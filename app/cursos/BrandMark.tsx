const RAYOS = Array.from({ length: 16 });

export function Sunburst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      {RAYOS.map((_, i) => (
        <line
          key={i}
          x1="20"
          y1="7"
          x2="20"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          transform={`rotate(${(360 / RAYOS.length) * i} 20 20)`}
        />
      ))}
    </svg>
  );
}

export default function BrandMark({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-[var(--yr-olive)] ${className ?? ""}`}>
      <Sunburst className="h-8 w-8 shrink-0" />
      <span className="font-[family-name:var(--font-display)] text-lg leading-[1.1]">
        Yoly
        <br />
        Ripepi
      </span>
    </div>
  );
}
