type ProgressBarProps = {
  value: number;
  max: number;
  label?: string;
};

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const safeMax = Math.max(max, 1);
  const percentage = Math.min(Math.max((value / safeMax) * 100, 0), 100);

  return (
    <div className="space-y-2">
      {label ? <p className="tiny-label">{label}</p> : null}
      <div className="h-3 overflow-hidden rounded-full bg-[rgba(29,23,21,0.08)]">
        <div
          aria-hidden="true"
          className="h-full rounded-full bg-[linear-gradient(90deg,#ff9700,#0a8f83,#2340cf)] transition-[width] duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
