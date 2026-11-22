export const INVITATION_TOKEN_PATTERN = /^[0-9a-f]{64}$/i;

export function buildInvitationLink(origin: string, token: string, email: string): string {
  return `${origin}/invitacion?token=${token}&email=${encodeURIComponent(email)}`;
}

export function buildInvitationMessage(
  organizationName: string,
  email: string,
  link: string,
  expiresAt: string
): { subject: string; body: string } {
  const expires = new Date(expiresAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return {
    subject: `Invitación a ${organizationName}`,
    body: [
      "Hola,",
      "",
      `Te invito a unirte a ${organizationName} en la aplicación de ventas.`,
      "",
      `Abrí este enlace e ingresá o creá tu cuenta con este mismo email (${email}):`,
      link,
      "",
      `El enlace vence el ${expires} y se puede usar una sola vez.`,
    ].join("\n"),
  };
}

function query(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
}

/** Abre la redacción de un correo en Gmail (web) con todo escrito. */
export function buildGmailComposeUrl(to: string, subject: string, body: string): string {
  return `https://mail.google.com/mail/?${query({ view: "cm", fs: "1", to, su: subject, body })}`;
}

/** Alternativa para la app de correo del dispositivo. */
export function buildMailtoUrl(to: string, subject: string, body: string): string {
  return `mailto:${encodeURIComponent(to)}?${query({ subject, body })}`;
}
