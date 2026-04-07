type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  accent?: "sun" | "teal" | "blue";
};

const accentClasses = {
  sun: "border-[rgba(255,138,0,0.18)] bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,245,232,0.94))]",
  teal: "border-[rgba(10,143,131,0.18)] bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(236,252,249,0.94))]",
  blue: "border-[rgba(35,64,207,0.18)] bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(237,241,255,0.94))]",
};

export function MetricCard({
  label,
  value,
  hint,
  accent = "sun",
}: MetricCardProps) {
  return (
    <div
      className={`rounded-[24px] border p-5 shadow-[0_14px_32px_rgba(63,42,21,0.06)] ${accentClasses[accent]}`}
    >
      <p className="tiny-label">{label}</p>
      <p className="metric-value mt-4">{value}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">{hint}</p>
    </div>
  );
}
