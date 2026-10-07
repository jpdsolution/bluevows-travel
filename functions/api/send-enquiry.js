const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8" }
});

const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const textOr = (value, fallback = "Not provided") => {
  const text = String(value ?? "").trim();
  return text ? text : fallback;
};

const formatDate = (value) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return textOr(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return textOr(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  }).format(date);
};

const shortEnquiryId = (id) => {
  const clean = String(id ?? "").replace(/[^a-z0-9]/gi, "").toUpperCase();
  return clean ? clean.slice(0, 6) : "NEW";
};

const fieldRow = (label, value, strong = false) => `
  <tr>
    <td style="width:42%;padding:14px 18px;border-top:1px solid #d9d9d9;font-size:15px;line-height:1.45;font-weight:700;color:#111827;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:14px 18px;border-top:1px solid #d9d9d9;font-size:15px;line-height:1.45;color:#111827;vertical-align:top;word-break:break-word;${strong ? "font-weight:800;" : ""}">${escapeHtml(value)}</td>
  </tr>`;

const box = (title, body) => `
  <div style="margin-top:26px;border:1px solid #111827;border-radius:11px;overflow:hidden;background:#ffffff;">
    <div style="padding:15px 20px;font-size:15px;line-height:1.35;font-weight:800;letter-spacing:.02em;color:#111827;border-bottom:1px solid #111827;">${escapeHtml(title)}</div>
    <div style="padding:18px 20px;font-size:15px;line-height:1.6;color:#1f2937;word-break:break-word;">${body}</div>
  </div>`;

const buildHtml = ({ enquiry, adults, children, siteName, tagline }) => {
  const company = textOr(siteName, "BlueVows").toUpperCase();
  const companyTagline = textOr(tagline, "Explore Andaman With Us");
  const guestName = textOr(enquiry.name);
  const customerEmail = textOr(enquiry.email);
  const phone = textOr(enquiry.phone);
  const destination = textOr(enquiry.destination);
  const packageName = textOr(enquiry.package);
  const enquiryId = shortEnquiryId(enquiry.id);
  const receivedAt = formatDateTime(enquiry.created_at);
  const travelDate = formatDate(enquiry.travel_date);
  const adultsValue = adults === undefined || adults === null ? "Not provided" : String(adults);
  const childrenValue = children === undefined || children === null ? "Not provided" : String(children);
  const travellers = enquiry.travellers ?? ((Number(adults) || 0) + (Number(children) || 0));
  const message = textOr(enquiry.message);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>New Enquiry Received</title>
</head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;color:#111827;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f2f2f2;">
<tr><td align="center" style="padding:18px 10px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:820px;background:#ffffff;border:1px solid #111111;border-radius:12px;overflow:hidden;">
<tr>
<td align="center" style="background:#000000;padding:22px 20px 30px;color:#ffffff;">
<div style="font-size:38px;line-height:42px;margin-bottom:8px;">✉</div>
<div style="font-size:38px;line-height:1.15;font-weight:800;letter-spacing:4px;">${escapeHtml(company)}</div>
<div style="margin-top:8px;font-size:18px;line-height:1.4;letter-spacing:2px;font-weight:500;">${escapeHtml(companyTagline)}</div>
</td>
</tr>
<tr><td style="padding:38px 40px 30px;">
<div style="font-size:16px;line-height:1.3;font-weight:800;letter-spacing:2px;color:#111827;">WEBSITE NOTIFICATION</div>
<h1 style="margin:18px 0 12px;font-size:32px;line-height:1.15;color:#0b0b0b;">New Enquiry Received</h1>
<p style="margin:0;font-size:18px;line-height:1.55;color:#111827;">A customer has submitted an enquiry through your ${escapeHtml(company)} website.</p>
<div style="display:inline-block;margin-top:22px;padding:10px 18px;border:2px solid #111111;border-radius:10px;font-size:15px;font-weight:800;line-height:1.2;">NEW ENQUIRY</div>

<div style="margin-top:28px;border:1px solid #111827;border-radius:11px;overflow:hidden;background:#ffffff;">
<div style="padding:16px 20px;font-size:16px;line-height:1.3;font-weight:800;color:#111827;border-bottom:1px solid #111827;">CUSTOMER DETAILS</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
${fieldRow("Guest Name", guestName)}
${fieldRow("Email Address", customerEmail)}
${fieldRow("Phone / WhatsApp", phone)}
${fieldRow("Travel Date", travelDate)}
${fieldRow("Adults", adultsValue)}
${fieldRow("Children", childrenValue)}
${fieldRow("Travellers", travellers)}
${fieldRow("Destination", destination)}
${fieldRow("Package", packageName)}
${fieldRow("Enquiry ID", enquiryId, true)}
${fieldRow("Received Date & Time", receivedAt)}
</table>
</div>

${box("CUSTOMER MESSAGE", escapeHtml(message).replace(/\n/g, "<br>"))}
${box("FOLLOW-UP RECOMMENDED", "Contact the guest to discuss travel plans, availability and package options.")}
</td></tr>
<tr><td style="border-top:1px solid #111827;padding:28px 20px 30px;text-align:center;">
<div style="font-size:22px;line-height:1.3;font-weight:800;letter-spacing:2px;color:#111827;">${escapeHtml(company)}</div>
<div style="margin-top:6px;font-size:16px;line-height:1.4;color:#111827;">${escapeHtml(companyTagline)}</div>
</td></tr>
</table>
</td></tr></table>
</body>
</html>`;
};

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}

export async function onRequestPost(context) {
  try {
    const apiKey = context.env.RESEND_API_KEY;
    const receiver = context.env.ENQUIRY_RECEIVER_EMAIL;

    if (!apiKey || !receiver) {
      return json({ ok: false, error: "Email service is not configured." }, 500);
    }

    const payload = await context.request.json();
    const enquiry = payload?.enquiry || {};
    const guestName = textOr(enquiry.name, "Website Guest");
    const customerEmail = String(enquiry.email || "").trim();
    const siteName = textOr(payload.siteName, "BlueVows");
    const tagline = textOr(payload.tagline, "Explore Andaman With Us");

    const from = context.env.RESEND_FROM_EMAIL || "BlueVows Website <onboarding@resend.dev>";
    const subject = `New Enquiry Received — ${textOr(enquiry.destination, "Andaman")} — ${guestName}`;

    const emailBody = {
      from,
      to: [receiver],
      subject,
      html: buildHtml({
        enquiry,
        adults: payload.adults,
        children: payload.children,
        siteName,
        tagline,
      }),
    };

    if (customerEmail) emailBody.reply_to = customerEmail;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    const resendData = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      return json({ ok: false, error: resendData?.message || "Resend could not send the email." }, 502);
    }

    return json({ ok: true, id: resendData?.id || null });
  } catch (error) {
    console.error("BlueVows enquiry email function failed", error);
    return json({ ok: false, error: "Unable to send enquiry email." }, 500);
  }
}
