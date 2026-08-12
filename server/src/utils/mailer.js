import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } from "../config/env.js";

let cachedTransport = null;

function getTransport() {
  if (!SMTP_HOST) return null;
  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
  }
  return cachedTransport;
}

/**
 * Send the password-reset email. When SMTP_HOST is unset (local dev without
 * an email provider configured), the link is logged to the console instead
 * of sent, so the reset flow stays testable without real email infra.
 * @param {{ to: string, resetUrl: string }} params
 */
export async function sendPasswordResetEmail({ to, resetUrl }) {
  const subject = "Reset your Tile Visualizer password";
  const text =
    `We received a request to reset your Tile Visualizer password.\n\n` +
    `Reset it here (expires soon): ${resetUrl}\n\n` +
    `If you didn't request this, you can safely ignore this email.`;
  const html =
    `<p>We received a request to reset your Tile Visualizer password.</p>` +
    `<p><a href="${resetUrl}">Reset your password</a> (link expires soon).</p>` +
    `<p>If you didn't request this, you can safely ignore this email.</p>`;

  const transport = getTransport();
  if (!transport) {
    console.warn(
      `[mailer] SMTP not configured — logging reset link instead of emailing ${to}:\n  ${resetUrl}`
    );
    return { delivered: false, previewUrl: resetUrl };
  }

  await transport.sendMail({ from: SMTP_FROM, to, subject, text, html });
  return { delivered: true };
}
