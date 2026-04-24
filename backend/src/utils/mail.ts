import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(to: string, resetLink: string) {
  const from = process.env.EMAIL_FROM || "MedFlow <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: "Redefinição de senha - MedFlow",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2>Redefinição de senha</h2>
        <p>Recebemos uma solicitação para redefinir sua senha no MedFlow.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <p>
          <a href="${resetLink}" style="background:#16a34a;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold">
            Redefinir senha
          </a>
        </p>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou, ignore este e-mail.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}