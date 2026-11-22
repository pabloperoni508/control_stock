/** Lunes a las 00:00 de la semana de una fecha (misma regla que las analíticas y el historial de pedidos). */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatWeekLabel(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `Semana del ${fmt(weekStart)} al ${fmt(weekEnd)}`;
}

export interface WeekGroup<T> {
  key: number;
  label: string;
  items: T[];
}

/**
 * Agrupa elementos ya ordenados de más reciente a más antiguo en bloques por semana.
 * Cada semana aparece una sola vez y conserva el orden de los elementos.
 */
export function groupByWeek<T>(items: T[], getDate: (item: T) => string): WeekGroup<T>[] {
  const groups: WeekGroup<T>[] = [];
  const byKey = new Map<number, WeekGroup<T>>();

  for (const item of items) {
    const weekStart = getWeekStart(new Date(getDate(item)));
    const key = weekStart.getTime();
    let group = byKey.get(key);
    if (!group) {
      group = { key, label: formatWeekLabel(weekStart), items: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    group.items.push(item);
  }

  return groups;
}
