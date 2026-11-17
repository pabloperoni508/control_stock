/** Fecha y hora cortas, por ejemplo "16/11/2026, 14:05". */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

/** Solo la hora, por ejemplo "14:05". */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Fecha de hoy en la zona horaria del dispositivo, como "AAAA-MM-DD". */
export function todayLocalISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Convierte "AAAA-MM-DD" en "DD/MM/AAAA" sin pasar por Date (evita desfases de zona horaria). */
export function formatDateOnly(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}
