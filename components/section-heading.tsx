type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title font-semibold">{title}</h2>
      <p className="body-copy text-base sm:text-lg">{description}</p>
    </div>
  );
}
