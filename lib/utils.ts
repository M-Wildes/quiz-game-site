export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
