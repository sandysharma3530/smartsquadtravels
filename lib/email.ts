import { Resend } from "resend";
import type { EnquiryInput } from "@/lib/validation";
import { siteConfig } from "@/content/site-config";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function row(label: string, value?: string | null) {
  const display = value && value.trim() ? escapeHtml(value) : "—";
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#667085;width:180px;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#10233D;">${display}</td></tr>`;
}

export async function sendEnquiryNotificationEmail(params: {
  reference: string;
  data: EnquiryInput;
  submittedAt: string;
  sourcePage?: string;
}) {
  const resend = getResend();
  const to = process.env.BUSINESS_ENQUIRY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!resend || !to || !from) {
    console.warn(
      "[email] Resend not fully configured. Skipping business notification.",
      { hasResend: !!resend, hasTo: !!to, hasFrom: !!from },
    );
    return { skipped: true as const };
  }

  const { reference, data, submittedAt, sourcePage } = params;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
      <h2 style="color:#061B36;">New enquiry — ${escapeHtml(reference)}</h2>
      <p style="color:#667085;">A customer submitted a Quick Enquiry on ${escapeHtml(siteConfig.businessName)}.</p>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-radius:8px;">
        ${row("Enquiry reference", reference)}
        ${row("Customer name", data.fullName)}
        ${row("Phone number", data.phone)}
        ${row("Email", data.email || "")}
        ${row("Travel date", data.travelDate)}
        ${row("Return date", data.returnDate || "")}
        ${row("Pickup", data.pickupLocation)}
        ${row("Destination", data.destination)}
        ${row("Passengers", data.passengers)}
        ${row("Preferred vehicle", data.preferredVehicle)}
        ${row("Trip type", data.tripType)}
        ${row("Message", data.message || "")}
        ${row("Submitted at", submittedAt)}
        ${row("Source page", sourcePage || data.sourcePage || "")}
      </table>
    </div>
  `;

  await resend.emails.send({
    from,
    to,
    subject: `[${reference}] New travel enquiry from ${data.fullName}`,
    html,
    replyTo: data.email || undefined,
  });

  return { skipped: false as const };
}

export async function sendCustomerAcknowledgementEmail(params: {
  reference: string;
  data: EnquiryInput;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  const customerEmail = params.data.email?.trim();

  if (!resend || !from || !customerEmail) {
    return { skipped: true as const };
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#10233D;">
      <h2 style="color:#061B36;">We received your trip details</h2>
      <p>Dear ${escapeHtml(params.data.fullName)},</p>
      <p>Thank you for writing to ${escapeHtml(siteConfig.businessName)}. Your reference is <strong>${escapeHtml(params.reference)}</strong>. This email is not a confirmed booking.</p>
      <p>We have your date and route. Someone from Smart Squad will call or WhatsApp you with a vehicle and a price.</p>
      <p style="color:#667085;">Trip summary: ${escapeHtml(params.data.pickupLocation)} → ${escapeHtml(params.data.destination)} · ${escapeHtml(params.data.travelDate)}</p>
      <p>Thank you for choosing ${escapeHtml(siteConfig.businessName)}.<br/>Travel Smart. Travel Together.</p>
    </div>
  `;

  await resend.emails.send({
    from,
    to: customerEmail,
    subject: `We received your trip details (${params.reference}) — ${siteConfig.businessName}`,
    html,
  });

  return { skipped: false as const };
}
