export function ComingSoonPage({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <div>
      <h1>{title}</h1>
      <p style={{ color: "var(--color-text-muted)" }}>
        {detail ?? "Esta sección todavía no está disponible."}
      </p>
    </div>
  );
}
