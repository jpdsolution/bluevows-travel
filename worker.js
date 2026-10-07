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

const row = (label, value, strong = false, kind = "") => {
  const safeValue = escapeHtml(value);
  let valueHtml = safeValue;

  if (kind === "email" && String(value || "").trim()) {
    const mail = escapeHtml(String(value).trim());
    valueHtml = `<a href="mailto:${mail}" style="color:#111827 !important;text-decoration:none !important;word-break:break-all;">${mail}</a>`;
  } else if (kind === "phone" && String(value || "").trim()) {
    const phoneText = String(value).trim();
    const phoneHref = escapeHtml(phoneText.replace(/[^0-9+]/g, ""));
    valueHtml = `<a href="tel:${phoneHref}" style="color:#111827 !important;text-decoration:none !important;white-space:nowrap;">${escapeHtml(phoneText)}</a>`;
  }

  return `<tr>
    <td style="width:38%;padding:12px 14px;border-top:1px solid #d9d9d9;font-size:14px;line-height:1.4;font-weight:700;color:#111827;vertical-align:top;">
      ${escapeHtml(label)}
    </td>
    <td style="width:62%;padding:12px 14px;border-top:1px solid #d9d9d9;font-size:14px;line-height:1.4;color:#111827;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;${strong ? "font-weight:800;" : ""}">
      ${valueHtml}
    </td>
  </tr>`;
};

const box = (title, body) =>
  `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-top:18px;border:1px solid #111827;border-radius:10px;background:#fff;">
    <tr>
      <td style="padding:13px 15px;font-size:14px;line-height:1.35;font-weight:800;letter-spacing:.02em;color:#111827;border-bottom:1px solid #111827;">
        ${escapeHtml(title)}
      </td>
    </tr>
    <tr>
      <td style="padding:15px;font-size:14px;line-height:1.55;color:#1f2937;overflow-wrap:anywhere;word-break:break-word;">
        ${body}
      </td>
    </tr>
  </table>`;

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

  const av = adults == null ? "Not provided" : String(adults);
  const cv = children == null ? "Not provided" : String(children);
  const travellers = enquiry.travellers ?? ((Number(adults) || 0) + (Number(children) || 0));
  const msg = textOr(enquiry.message);

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
<title>New Enquiry Received</title>
<style>
  body{margin:0!important;padding:0!important;width:100%!important;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;color:#111827;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}
  img{border:0;outline:none;text-decoration:none;display:block;}
  a{color:#111827;text-decoration:none;}
  .email-wrap{width:100%;max-width:760px;}
  .email-content{padding:32px 34px 26px;}
  .brand{font-size:34px;line-height:1.15;letter-spacing:3px;font-weight:800;}
  .tagline{font-size:17px;line-height:1.4;letter-spacing:1.5px;}
  .title{font-size:30px;line-height:1.18;}
  .lead{font-size:17px;line-height:1.55;}
  .details-title{font-size:15px;}
  .detail-table td{font-size:14px;}
  @media only screen and (max-width:600px){
    .outer-pad{padding:8px 5px!important;}
    .email-wrap{width:100%!important;max-width:100%!important;}
    .email-content{padding:24px 16px 22px!important;}
    .brand{font-size:28px!important;letter-spacing:2px!important;}
    .tagline{font-size:14px!important;letter-spacing:1px!important;}
    .title{font-size:26px!important;}
    .lead{font-size:15px!important;}
    .detail-table td{font-size:13px!important;padding:11px 10px!important;}
    .details-title{font-size:14px!important;padding:13px 14px!important;}
    .footer-brand{font-size:18px!important;}
    .footer-tag{font-size:13px!important;}
  }
</style>
</head>
<body>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f2f2f2;">
<tr>
<td align="center" class="outer-pad" style="padding:14px 8px;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="email-wrap" style="width:100%;max-width:760px;background:#fff;border:1px solid #111;border-radius:12px;overflow:hidden;">

<tr>
<td align="center" style="background:#000;padding:22px 16px 25px;color:#fff;">
<div style="font-size:32px;line-height:36px;margin-bottom:7px;">✉</div>
<div class="brand" style="font-size:34px;line-height:1.15;letter-spacing:3px;font-weight:800;">${escapeHtml(company)}</div>
<div class="tagline" style="margin-top:7px;font-size:17px;line-height:1.4;letter-spacing:1.5px;font-weight:500;">${escapeHtml(tag)}</div>
</td>
</tr>

<tr>
<td class="email-content" style="padding:32px 34px 26px;">

<div style="font-size:14px;line-height:1.3;font-weight:800;letter-spacing:1.6px;color:#111827;">WEBSITE NOTIFICATION</div>

<h1 class="title" style="margin:16px 0 10px;font-size:30px;line-height:1.18;color:#0b0b0b;">New Enquiry Received</h1>

<p class="lead" style="margin:0;font-size:17px;line-height:1.55;color:#111827;">A customer has submitted an enquiry through your ${escapeHtml(company)} website.</p>

<div style="display:inline-block;margin-top:18px;padding:9px 15px;border:2px solid #111;border-radius:9px;font-size:14px;font-weight:800;line-height:1.2;color:#111827;">NEW ENQUIRY</div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-top:22px;border:1px solid #111827;border-radius:10px;background:#fff;">
<tr>
<td class="details-title" style="padding:14px 15px;font-size:15px;line-height:1.3;font-weight:800;color:#111827;border-bottom:1px solid #111827;">CUSTOMER DETAILS</td>
</tr>
<tr>
<td style="padding:0;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="detail-table" style="width:100%;table-layout:fixed;">
${row("Guest Name", guest)}
${row("Email Address", email, false, "email")}
${row("Phone / WhatsApp", phone, false, "phone")}
${row("Travel Date", travel)}
${row("Adults", av)}
${row("Children", cv)}
${row("Travellers", travellers)}
${row("Destination", dest)}
${row("Package", pkg)}
${row("Enquiry ID", id, true)}
${row("Received Date & Time", received)}
</table>
</td>
</tr>
</table>

${box("CUSTOMER MESSAGE", escapeHtml(msg).replace(/\n/g, "<br>"))}
${box("FOLLOW-UP RECOMMENDED", "Contact the guest to discuss travel plans, availability and package options.")}

</td>
</tr>

<tr>
<td style="border-top:1px solid #111827;padding:22px 16px 24px;text-align:center;">
<div class="footer-brand" style="font-size:20px;line-height:1.3;font-weight:800;letter-spacing:1.5px;color:#111827;">${escapeHtml(company)}</div>
<div class="footer-tag" style="margin-top:5px;font-size:14px;line-height:1.4;color:#111827;">${escapeHtml(tag)}</div>
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
