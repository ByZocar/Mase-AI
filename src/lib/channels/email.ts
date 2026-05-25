import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export const resend = apiKey ? new Resend(apiKey) : null;

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}) {
  if (!resend) {
    return {
      mocked: true,
      id: `mock_${Date.now()}`,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      sentAt: new Date().toISOString(),
    };
  }
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html ?? `<pre style="font-family:system-ui">${opts.text}</pre>`,
    replyTo: opts.replyTo,
  });
  if (error) throw error;
  return { id: data?.id, sentAt: new Date().toISOString() };
}
