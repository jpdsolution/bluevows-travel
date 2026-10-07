function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function textOr(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildRow(label, value, mono = false) {
  const safeLabel = escapeHtml(label);
  const safeValue = escapeHtml(value);

  return `
    <tr>
      <td style="
        width:38%;
        padding:9px 10px;
        border-bottom:1px solid #e5e7eb;
        font-size:12px;
        line-height:16px;
        font-weight:700;
        color:#374151;
        vertical-align:middle;
        text-align:left;
      ">
        ${safeLabel}
      </td>

      <td style="
        width:62%;
        padding:9px 10px;
        border-bottom:1px solid #e5e7eb;
        font-size:12px;
        line-height:16px;
        color:#111827;
        vertical-align:middle;
        text-align:left;
        word-break:break-word;
        overflow-wrap:anywhere;
        ${mono ? "font-family:monospace;" : ""}
      ">
        ${safeValue || "—"}
      </td>
    </tr>
  `;
}

function buildBox(title, content) {
  return `
    <div style="
      margin:10px 0 0;
      border:1px solid #e5e7eb;
      border-radius:10px;
      background:#ffffff;
      overflow:hidden;
    ">
      <div style="
        padding:8px 10px;
        background:#ffffff;
        border-bottom:1px solid #e5e7eb;
        font-size:11px;
        line-height:14px;
        font-weight:800;
        letter-spacing:.5px;
        color:#111827;
      ">
        ${escapeHtml(title)}
      </div>

      <div style="
        padding:9px 10px;
        background:#ffffff;
        font-size:12px;
        line-height:17px;
        color:#111827;
        word-break:break-word;
        overflow-wrap:anywhere;
      ">
        ${content}
      </div>
    </div>
  `;
}

function buildHtml({
  enquiry = {},
  adults,
  children,
  siteName = "BlueVows",
  tagline = "Explore Andaman With Us"
}) {
  const company = textOr(siteName, "BlueVows");
  const tag = textOr(tagline, "Explore Andaman With Us");

  const guest = textOr(enquiry.name, "Website Guest");
  const email = textOr(enquiry.email, "—");
  const phone = textOr(enquiry.phone, "—");
  const travel = textOr(enquiry.travelDate, "—");

  const av = textOr(adults, enquiry.adults || "—");
  const cv = textOr(children, enquiry.children || "—");

  const travellers =
    Number(av || 0) + Number(cv || 0) > 0
      ? `${Number(av || 0) + Number(cv || 0)}`
      : "—";

  const dest = textOr(enquiry.destination, "—");
  const pkg = textOr(enquiry.packageName, "—");
  const id = textOr(enquiry.id, "—");
  const msg = textOr(enquiry.message, "No message provided");

  const received = enquiry.created_at
    ? new Date(enquiry.created_at).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      })
    : new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      });

  const messageHtml = escapeHtml(msg).replace(/\n/g, "<br>");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">

<title>New Enquiry — ${escapeHtml(company)}</title>

<style>
  html,body {
    margin:0 !important;
    padding:0 !important;
    width:100% !important;
    background:#ffffff !important;
  }

  body {
    font-family:Arial,Helvetica,sans-serif;
    color:#111827;
  }

  table {
    border-collapse:collapse;
  }

  a {
    color:#111827 !important;
    text-decoration:none !important;
  }

  @media only screen and (max-width:600px) {
    .email-wrap {
      width:100% !important;
    }

    .email-pad {
      padding:10px !important;
    }

    .email-title {
      font-size:18px !important;
      line-height:22px !important;
    }

    .email-subtitle {
      font-size:11px !important;
      line-height:15px !important;
    }

    .details-table td {
      font-size:11px !important;
      line-height:15px !important;
      padding:8px !important;
    }
  }
</style>
</head>

<body style="
  margin:0;
  padding:0;
  background:#ffffff;
">

<table role="presentation"
       width="100%"
       cellspacing="0"
       cellpadding="0"
       border="0"
       style="
         width:100%;
         background:#ffffff;
         margin:0;
         padding:0;
       ">
<tr>
<td align="center" style="padding:10px;background:#ffffff;">

<table role="presentation"
       class="email-wrap"
       width="560"
       cellspacing="0"
       cellpadding="0"
       border="0"
       style="
         width:100%;
         max-width:560px;
         background:#ffffff;
         border:1px solid #e5e7eb;
         border-radius:12px;
         overflow:hidden;
       ">

<!-- HEADER -->
<tr>
<td style="
  padding:14px 16px;
  background:#ffffff;
  border-bottom:1px solid #e5e7eb;
  text-align:center;
">

<div style="
  font-size:20px;
  line-height:24px;
  font-weight:800;
  letter-spacing:1px;
  color:#111827;
">
${escapeHtml(company)}
</div>

<div class="email-subtitle" style="
  margin-top:3px;
  font-size:11px;
  line-height:15px;
  color:#6b7280;
">
${escapeHtml(tag)}
</div>

</td>
</tr>

<!-- CONTENT -->
<tr>
<td class="email-pad" style="
  padding:14px 16px;
  background:#ffffff;
">

<div style="
  font-size:10px;
  line-height:14px;
  font-weight:800;
  letter-spacing:1px;
  color:#6b7280;
">
WEBSITE ENQUIRY
</div>

<div class="email-title" style="
  margin-top:4px;
  font-size:21px;
  line-height:25px;
  font-weight:800;
  color:#111827;
">
New Enquiry Received
</div>

<div style="
  margin-top:4px;
  font-size:12px;
  line-height:17px;
  color:#6b7280;
">
A customer has submitted an enquiry through your website.
</div>

<!-- DETAILS BOX -->
<div style="
  margin-top:12px;
  border:1px solid #e5e7eb;
  border-radius:10px;
  overflow:hidden;
  background:#ffffff;
">

<div style="
  padding:8px 10px;
  background:#ffffff;
  border-bottom:1px solid #e5e7eb;
  font-size:11px;
  line-height:14px;
  font-weight:800;
  letter-spacing:.5px;
  color:#111827;
">
CUSTOMER DETAILS
</div>

<table role="presentation"
       class="details-table"
       width="100%"
       cellspacing="0"
       cellpadding="0"
       border="0"
       style="
         width:100%;
         background:#ffffff;
       ">

${buildRow("Guest Name", guest)}
${buildRow("Email Address", email)}
${buildRow("Phone / WhatsApp", phone)}
${buildRow("Travel Date", travel)}
${buildRow("Adults", av)}
${buildRow("Children", cv)}
${buildRow("Travellers", travellers)}
${buildRow("Destination", dest)}
${buildRow("Package", pkg)}
${buildRow("Enquiry ID", id, true)}
${buildRow("Received", received)}

</table>
</div>

${buildBox("CUSTOMER MESSAGE", messageHtml)}

${buildBox(
  "FOLLOW-UP",
  "Contact the guest to discuss travel plans, availability and package options."
)}

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="
  padding:12px 16px 14px;
  background:#ffffff;
  border-top:1px solid #e5e7eb;
  text-align:center;
">

<div style="
  font-size:14px;
  line-height:18px;
  font-weight:800;
  color:#111827;
">
${escapeHtml(company)}
</div>

<div style="
  margin-top:2px;
  font-size:10px;
  line-height:14px;
  color:#6b7280;
">
${escapeHtml(tag)}
</div>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
}

async function sendEnquiry(request, env) {
  try {
    const apiKey = String(env?.RESEND_API_KEY || "").trim();
    const receiver = String(env?.ENQUIRY_RECEIVER_EMAIL || "").trim();

    if (!apiKey || !receiver) {
      const missing = [];

      if (!apiKey) missing.push("RESEND_API_KEY");
      if (!receiver) missing.push("ENQUIRY_RECEIVER_EMAIL");

      return json({
        ok: false,
        error: `Email service is not configured. Missing: ${missing.join(", ")}`
      }, 500);
    }

    const payload = await request.json();
    const enquiry = payload?.enquiry || {};

    const customerEmail = String(enquiry.email || "").trim();

    const siteName = textOr(payload.siteName, "BlueVows");
    const tagline = textOr(
      payload.tagline,
      "Explore Andaman With Us"
    );

    const from = String(
      env.RESEND_FROM_EMAIL ||
      "BlueVows Website <onboarding@resend.dev>"
    ).trim();

    const body = {
      from,
      to: [receiver],

      subject:
        `New Enquiry Received — ${textOr(
          enquiry.destination,
          "Andaman"
        )} — ${textOr(
          enquiry.name,
          "Website Guest"
        )}`,

      html: buildHtml({
        enquiry,
        adults: payload.adults,
        children: payload.children,
        siteName,
        tagline
      })
    };

    if (customerEmail) {
      body.reply_to = customerEmail;
    }

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify(body)
      }
    );

    const raw = await response.text();

    let data = {};

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = { raw };
    }

    if (!response.ok) {
      console.error("Resend rejected BlueVows email", {
        status: response.status,
        response: data
      });

      return json({
        ok: false,
        error:
          data?.message ||
          data?.error ||
          raw ||
          `Resend returned HTTP ${response.status}`,
        resendStatus: response.status
      }, 502);
    }

    return json({
      ok: true,
      id: data?.id || null
    });

  } catch (error) {
    console.error(
      "BlueVows enquiry email function failed",
      error?.stack || error
    );

    return json({
      ok: false,
      error:
        error?.message ||
        "Unable to send enquiry email."
    }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return json({ ok: true }, 204);
    }

    if (
      url.pathname === "/api/email-status" &&
      request.method === "GET"
    ) {
      const hasApiKey =
        Boolean(String(env?.RESEND_API_KEY || "").trim());

      const hasReceiver =
        Boolean(String(env?.ENQUIRY_RECEIVER_EMAIL || "").trim());

      const hasFrom =
        Boolean(String(env?.RESEND_FROM_EMAIL || "").trim());

      return json({
        ok: hasApiKey && hasReceiver,
        bindings: {
          RESEND_API_KEY: hasApiKey,
          ENQUIRY_RECEIVER_EMAIL: hasReceiver,
          RESEND_FROM_EMAIL: hasFrom,
          ASSETS: Boolean(env?.ASSETS)
        },
        from: hasFrom
          ? "BlueVows Website <configured>"
          : "BlueVows Website <onboarding@resend.dev>"
      });
    }

    if (url.pathname === "/api/send-enquiry") {
      if (request.method === "POST") {
        return sendEnquiry(request, env);
      }

      return json({
        ok: false,
        error: "Method not allowed"
      }, 405);
    }

    return env.ASSETS.fetch(request);
  }
};
