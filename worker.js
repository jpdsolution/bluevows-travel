// Deployment refresh - email secret binding

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });

const escapeHtml = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const textOr = (v, f = "Not provided") => {
  const t = String(v ?? "").trim();
  return t || f;
};

const formatDate = (v) => {
  if (!v) return "Not provided";

  const d = new Date(v);

  return Number.isNaN(d.getTime())
    ? textOr(v)
    : new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(d);
};

const formatDateTime = (v) => {
  const d = v ? new Date(v) : new Date();

  return Number.isNaN(d.getTime())
    ? textOr(v)
    : new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
        timeZoneName: "short"
      }).format(d);
};

const shortId = (id) => {
  const c = String(id ?? "")
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase();

  return c ? c.slice(0, 6) : "NEW";
};

const row = (label, value, strong = false) =>
  `<tr>
    <td style="width:42%;padding:14px 18px;border-top:1px solid #d9d9d9;font-size:15px;line-height:1.45;font-weight:700;color:#111827;vertical-align:top;">
      ${escapeHtml(label)}
    </td>
    <td style="padding:14px 18px;border-top:1px solid #d9d9d9;font-size:15px;line-height:1.45;color:#111827;vertical-align:top;word-break:break-word;${strong ? "font-weight:800;" : ""}">
      ${escapeHtml(value)}
    </td>
  </tr>`;

const box = (title, body) =>
  `<div style="margin-top:26px;border:1px solid #111827;border-radius:11px;overflow:hidden;background:#fff;">
    <div style="padding:15px 20px;font-size:15px;line-height:1.35;font-weight:800;letter-spacing:.02em;color:#111827;border-bottom:1px solid #111827;">
      ${escapeHtml(title)}
    </div>
    <div style="padding:18px 20px;font-size:15px;line-height:1.6;color:#1f2937;word-break:break-word;">
      ${body}
    </div>
  </div>`;

function buildHtml({
  enquiry,
  adults,
  children,
  siteName,
  tagline
}) {
  const company = textOr(siteName, "BlueVows").toUpperCase();
  const tag = textOr(tagline, "Explore Andaman With Us");

  const guest = textOr(enquiry.name);
  const email = textOr(enquiry.email);
  const phone = textOr(enquiry.phone);
  const dest = textOr(enquiry.destination);
  const pkg = textOr(enquiry.package);

  const id = shortId(enquiry.id);
  const received = formatDateTime(enquiry.created_at);
  const travel = formatDate(enquiry.travel_date);

  const av =
    adults == null
      ? "Not provided"
      : String(adults);

  const cv =
    children == null
      ? "Not provided"
      : String(children);

  const travellers =
    enquiry.travellers ??
    ((Number(adults) || 0) + (Number(children) || 0));

  const msg = textOr(enquiry.message);

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>New Enquiry Received</title>
</head>

<body style="margin:0;padding:0;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;color:#111827;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f2f2f2;">
<tr>
<td align="center" style="padding:18px 10px;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
style="width:100%;max-width:820px;background:#fff;border:1px solid #111;border-radius:12px;overflow:hidden;">

<tr>
<td align="center" style="background:#000;padding:22px 20px 30px;color:#fff;">

<div style="font-size:38px;line-height:42px;margin-bottom:8px;">
✉
</div>

<div style="font-size:38px;line-height:1.15;font-weight:800;letter-spacing:4px;">
${escapeHtml(company)}
</div>

<div style="margin-top:8px;font-size:18px;line-height:1.4;letter-spacing:2px;font-weight:500;">
${escapeHtml(tag)}
</div>

</td>
</tr>

<tr>
<td style="padding:38px 40px 30px;">

<div style="font-size:16px;line-height:1.3;font-weight:800;letter-spacing:2px;color:#111827;">
WEBSITE NOTIFICATION
</div>

<h1 style="margin:18px 0 12px;font-size:32px;line-height:1.15;color:#0b0b0b;">
New Enquiry Received
</h1>

<p style="margin:0;font-size:18px;line-height:1.55;color:#111827;">
A customer has submitted an enquiry through your ${escapeHtml(company)} website.
</p>

<div style="display:inline-block;margin-top:22px;padding:10px 18px;border:2px solid #111;border-radius:10px;font-size:15px;font-weight:800;line-height:1.2;">
NEW ENQUIRY
</div>

<div style="margin-top:28px;border:1px solid #111827;border-radius:11px;overflow:hidden;background:#fff;">

<div style="padding:16px 20px;font-size:16px;line-height:1.3;font-weight:800;color:#111827;border-bottom:1px solid #111827;">
CUSTOMER DETAILS
</div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">

${row("Guest Name", guest)}
${row("Email Address", email)}
${row("Phone / WhatsApp", phone)}
${row("Travel Date", travel)}
${row("Adults", av)}
${row("Children", cv)}
${row("Travellers", travellers)}
${row("Destination", dest)}
${row("Package", pkg)}
${row("Enquiry ID", id, true)}
${row("Received Date & Time", received)}

</table>
</div>

${box(
  "CUSTOMER MESSAGE",
  escapeHtml(msg).replace(/\n/g, "<br>")
)}

${box(
  "FOLLOW-UP RECOMMENDED",
  "Contact the guest to discuss travel plans, availability and package options."
)}

</td>
</tr>

<tr>
<td style="border-top:1px solid #111827;padding:28px 20px 30px;text-align:center;">

<div style="font-size:22px;line-height:1.3;font-weight:800;letter-spacing:2px;color:#111827;">
${escapeHtml(company)}
</div>

<div style="margin-top:6px;font-size:16px;line-height:1.4;color:#111827;">
${escapeHtml(tag)}
</div>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
}

async function sendEnquiry(request, env) {
  try {
    const apiKey =
      String(env?.RESEND_API_KEY || "").trim();

    const receiver =
      String(env?.ENQUIRY_RECEIVER_EMAIL || "").trim();

    const from =
      String(
        env?.RESEND_FROM_EMAIL ||
        "BlueVows Website <onboarding@resend.dev>"
      ).trim();

    if (!apiKey || !receiver) {
      console.error(
        "BlueVows email configuration missing",
        {
          hasResendApiKey: Boolean(apiKey),
          hasReceiver: Boolean(receiver),
          hasFrom: Boolean(from)
        }
      );

      return json(
        {
          ok: false,
          error: "Email service is not configured.",
          missing: [
            !apiKey ? "RESEND_API_KEY" : null,
            !receiver ? "ENQUIRY_RECEIVER_EMAIL" : null
          ].filter(Boolean)
        },
        500
      );
    }

    const payload = await request.json();

    const enquiry = payload?.enquiry || {};

    const guest =
      textOr(enquiry.name, "Website Guest");

    const customerEmail =
      String(enquiry.email || "").trim();

    const siteName =
      textOr(payload.siteName, "BlueVows");

    const tagline =
      textOr(
        payload.tagline,
        "Explore Andaman With Us"
      );

    const body = {
      from,

      to: [receiver],

      subject:
        `New Enquiry Received — ${textOr(
          enquiry.destination,
          "Andaman"
        )} — ${guest}`,

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

    const r = await fetch(
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

    const raw = await r.text();

    let data = {};

    try {
      data = raw
        ? JSON.parse(raw)
        : {};
    } catch {
      data = { raw };
    }

    if (!r.ok) {
      console.error(
        "Resend rejected BlueVows enquiry email",
        {
          status: r.status,
          statusText: r.statusText,
          response: data
        }
      );

      return json(
        {
          ok: false,
          error:
            data?.message ||
            data?.name ||
            raw ||
            `Resend request failed (${r.status})`,

          resendStatus: r.status,

          resendName:
            data?.name || null
        },
        502
      );
    }

    console.log(
      "BlueVows enquiry email sent",
      {
        id: data?.id || null
      }
    );

    return json({
      ok: true,
      id: data?.id || null
    });

  } catch (e) {

    console.error(
      "BlueVows enquiry email function failed",
      e?.stack || e
    );

    return json(
      {
        ok: false,
        error:
          e?.message ||
          "Unable to send enquiry email."
      },
      500
    );
  }
}

export default {

  async fetch(request, env) {

    const url = new URL(request.url);

    if (url.pathname === "/api/email-status") {

      return json({
        ok: Boolean(
          env?.RESEND_API_KEY &&
          env?.ENQUIRY_RECEIVER_EMAIL
        ),

        bindings: {
          RESEND_API_KEY:
            Boolean(env?.RESEND_API_KEY),

          ENQUIRY_RECEIVER_EMAIL:
            Boolean(
              env?.ENQUIRY_RECEIVER_EMAIL
            ),

          RESEND_FROM_EMAIL:
            Boolean(
              env?.RESEND_FROM_EMAIL
            ),

          ASSETS:
            Boolean(env?.ASSETS)
        },

        from:
          String(
            env?.RESEND_FROM_EMAIL ||
            "BlueVows Website <onboarding@resend.dev>"
          ).replace(
            /<[^>]+>/,
            "<configured>"
          )
      });
    }

    if (url.pathname === "/api/send-enquiry") {

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "POST,OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type"
          }
        });
      }

      if (request.method === "POST") {
        return sendEnquiry(request, env);
      }

      return json(
        {
          ok: false,
          error: "Method not allowed"
        },
        405
      );
    }

    return env.ASSETS.fetch(request);
  }
};
