const MONTHS = ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];

export const monthKey = (iso) => iso.slice(0, 7);          // "2026-08-24" -> "2026-08"

export const monthLabel = (key) => {                        // "2026-08" -> "ago 2026"
  const [y, m] = key.split("-");
  return `${MONTHS[+m - 1]} ${y}`;
};

export const dayLabel = (iso) =>                            // "2026-08-24" -> "24 ago"
  new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });

export const periodCaption = (period) =>
  period === "all" ? "tutto il periodo" : monthLabel(period);
