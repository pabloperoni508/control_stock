/** Los errores de Supabase no siempre son instancias de Error: se lee su message. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const message = String((err as { message: unknown }).message);
    if (message) return message;
  }
  return fallback;
}
