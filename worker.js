const json = (data, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders
    }
  });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

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


/* NORMAL TABLE ROW */

const row = (label, value, strong = false) =>
  `<tr>
    <td style="width:42%;padding:9px 12px;border-top:1px solid #e1e5ea;font-size:13px;line-height:1.35;font-weight:700;color:#172033;vertical-align:top;text-align:left;">
      ${escapeHtml(label)}
    </td>

    <td style="padding:9px 12px;border-top:1px solid #e1e5ea;font-size:13px;line-height:1.35;color:#172033;vertical-align:top;text-align:left;word-break:break-word;overflow-wrap:anywhere;${strong ? "font-weight:800;" : ""}">
      ${escapeHtml(value)}
    </td>
  </tr>`;


/* EMAIL ROW
   Email is deliberately broken internally so email clients
   do not automatically convert gmail.com into a blue link.
*/

const emailRow = (email) => {
  const safeEmail = textOr(email);

  const parts = safeEmail.split("@");

  let protectedEmail;

  if (parts.length === 2) {
    const localPart = escapeHtml(parts[0]);
    const domainPart = escapeHtml(parts.slice(1).join("@"));

    protectedEmail =
      `${localPart}` +
      `<span style="display:inline;font-size:0;line-height:0;">&#8203;</span>` +
      `<span style="color:#000000!important;text-decoration:none!important;">@</span>` +
      `<span style="display:inline;font-size:0;line-height:0;">&#8203;</span>` +
      `${domainPart}`;
  } else {
    protectedEmail = escapeHtml(safeEmail);
  }

  return `<tr>
    <td style="width:42%;padding:9px 12px;border-top:1px solid #e1e5ea;font-size:13px;line-height:1.35;font-weight:700;color:#172033;vertical-align:top;text-align:left;">
      Email Address
    </td>

    <td style="padding:9px 12px;border-top:1px solid #e1e5ea;font-size:13px;line-height:1.35;color:#000000!important;vertical-align:top;text-align:left;word-break:break-word;overflow-wrap:anywhere;text-decoration:none!important;">
      <span style="color:#000000!important;text-decoration:none!important;font-weight:400;">
        ${protectedEmail}
      </span>
    </td>
  </tr>`;
};


/* MESSAGE / FOLLOW-UP BOX */

const box = (title, body) =>
  `<div style="margin-top:14px;border:1px solid #d9dee6;border-radius:10px;overflow:hidden;background:#fff;">

    <div style="padding:10px 13px;font-size:12px;line-height:1.3;font-weight:800;letter-spacing:.08em;color:#172033;background:#f5f6f8;border-bottom:1px solid #d9dee6;text-align:left;">
      ${escapeHtml(title)}
    </div>

    <div style="padding:12px 13px;font-size:13px;line-height:1.5;color:#293241;word-break:break-word;overflow-wrap:anywhere;text-align:left;">
      ${body}
    </div>

  </div>`;


/* EMAIL TEMPLATE */

function buildHtml({
  enquiry,
  adults,
  children,
  siteName,
  tagline
}) {

  const company =
    textOr(siteName, "BlueVows").toUpperCase();

  const tag =
    textOr(tagline, "Explore Andaman With Us");

  const guest =
    textOr(enquiry.name);

  const email =
    textOr(enquiry.email);

  const phone =
    textOr(enquiry.phone);

  const dest =
    textOr(enquiry.destination);

  const pkg =
    textOr(enquiry.package);

  const id =
    shortId(enquiry.id);

  const received =
    formatDateTime(enquiry.created_at);

  const travel =
    formatDate(enquiry.travel_date);

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
    (
      (Number(adults) || 0) +
      (Number(children) || 0)
    );

  const msg =
    textOr(enquiry.message);


  return `<!doctype html>

<html>

<head>

<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<meta
  name="x-apple-disable-message-reformatting"
>

<title>
New Enquiry Received
</title>


<style>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

html,
body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
}

body {
  font-family:
    Inter,
    Arial,
    Helvetica,
    sans-serif !important;

  background: #f1f3f6;
  color: #172033;
}

table {
  border-collapse: collapse;
}

a {
  color: #000000 !important;
  text-decoration: none !important;
}

@media only screen and (max-width:600px) {

  .outer-pad {
    padding: 7px 5px !important;
  }

  .main-pad {
    padding: 22px 13px 17px !important;
  }

  .brand-name {
    font-size: 25px !important;
    letter-spacing: 1.5px !important;
  }

  .tagline {
    font-size: 12px !important;
  }

  .hero-title {
    font-size: 25px !important;
  }

  .intro {
    font-size: 14px !important;
  }

  .section-title {
    font-size: 11px !important;
  }

}

</style>

</head>


<body
style="
margin:0;
padding:0;
background:#f1f3f6;
font-family:Inter,Arial,Helvetica,sans-serif;
">


<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="
width:100%;
background:#f1f3f6;
"
>

<tr>

<td
align="center"
class="outer-pad"
style="padding:10px 8px;"
>


<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="
width:100%;
max-width:760px;
background:#fff;
border:1px solid #cfd5dd;
border-radius:10px;
overflow:hidden;
"
>


<!-- HEADER -->

<tr>

<td
align="center"
style="
background:#111827;
color:#fff;
padding:14px 14px 16px;
text-align:center;
"
>


<!-- EMAIL ICON -->

<div
style="
width:40px;
height:40px;
margin:0 auto 6px;
border:1.5px solid #fff;
border-radius:9px;
text-align:center;
line-height:40px;
font-size:23px;
font-family:Arial,Helvetica,sans-serif;
"
>
&#9993;
</div>


<!-- COMPANY NAME -->

<div
class="brand-name"
style="
font-size:27px;
line-height:1.15;
font-weight:800;
letter-spacing:2px;
text-align:center;
"
>
${escapeHtml(company)}
</div>


<!-- TAGLINE -->

<div
class="tagline"
style="
margin-top:4px;
font-size:12px;
line-height:1.3;
letter-spacing:1.3px;
font-weight:500;
text-align:center;
color:#e5e7eb;
"
>
${escapeHtml(tag)}
</div>


</td>

</tr>


<!-- CONTENT -->

<tr>

<td
class="main-pad"
style="
padding:24px 26px 18px;
text-align:left;
"
>


<div
style="
font-size:11px;
line-height:1.3;
font-weight:800;
letter-spacing:2px;
color:#6b7280;
text-align:left;
"
>
WEBSITE ENQUIRY
</div>


<h1
class="hero-title"
style="
margin:8px 0 6px;
font-size:27px;
line-height:1.18;
font-weight:800;
color:#111827;
text-align:left;
"
>
New Enquiry Received
</h1>


<p
class="intro"
style="
margin:0;
font-size:14px;
line-height:1.45;
color:#6b7280;
text-align:left;
"
>
A new travel enquiry has been received from your website.
</p>


<!-- CUSTOMER DETAILS -->

<div
style="
margin-top:16px;
border:1px solid #d9dee6;
border-radius:10px;
overflow:hidden;
background:#fff;
"
>


<div
class="section-title"
style="
padding:10px 13px;
font-size:12px;
line-height:1.3;
font-weight:800;
letter-spacing:.09em;
color:#172033;
background:#f5f6f8;
border-bottom:1px solid #d9dee6;
text-align:left;
"
>
CUSTOMER DETAILS
</div>


<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="
width:100%;
table-layout:fixed;
"
>


${row("Guest Name", guest)}

${emailRow(email)}

${row("Phone / WhatsApp", phone)}

${row("Travel Date", travel)}

${row("Adults", av)}

${row("Children", cv)}

${row("Travellers", travellers)}

${row("Destination", dest)}

${row("Package", pkg)}

${row("Enquiry ID", id, true)}

${row("Received", received)}


</table>

</div>


<!-- CUSTOMER MESSAGE -->

${box(
  "CUSTOMER MESSAGE",
  escapeHtml(msg).replace(/\n/g, "<br>")
)}


<!-- FOLLOW-UP -->

${box(
  "FOLLOW-UP RECOMMENDED",
  "Contact the guest to discuss travel plans, availability and package options."
)}


</td>

</tr>


<!-- FOOTER -->

<tr>

<td
style="
border-top:1px solid #e1e5ea;
padding:14px 16px 16px;
text-align:center;
background:#fff;
"
>


<div
style="
font-size:14px;
line-height:1.3;
font-weight:800;
letter-spacing:1.2px;
color:#172033;
text-align:center;
"
>
${escapeHtml(company)}
</div>


<div
style="
margin-top:3px;
font-size:11px;
line-height:1.35;
color:#6b7280;
text-align:center;
"
>
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


/* SEND ENQUIRY */

async function sendEnquiry(
  request,
  env
) {

  try {

    const apiKey =
      env.RESEND_API_KEY;

    const receiver =
      env.ENQUIRY_RECEIVER_EMAIL;


    if (!apiKey) {

      console.error(
        "BlueVows email error: RESEND_API_KEY is missing"
      );

      return json(
        {
          ok: false,
          error:
            "RESEND_API_KEY is missing in Cloudflare."
        },
        500,
        corsHeaders
      );

    }


    if (!receiver) {

      console.error(
        "BlueVows email error: ENQUIRY_RECEIVER_EMAIL is missing"
      );

      return json(
        {
          ok: false,
          error:
            "ENQUIRY_RECEIVER_EMAIL is missing in Cloudflare."
        },
        500,
        corsHeaders
      );

    }


    let payload;


    try {

      payload =
        await request.json();

    } catch {

      return json(
        {
          ok: false,
          error:
            "Invalid enquiry request data."
        },
        400,
        corsHeaders
      );

    }


    const enquiry =
      payload?.enquiry || {};


    const guest =
      textOr(
        enquiry.name,
        "Website Guest"
      );


    const customerEmail =
      String(
        enquiry.email || ""
      ).trim();


    const siteName =
      textOr(
        payload.siteName,
        "BlueVows"
      );


    const tagline =
      textOr(
        payload.tagline,
        "Explore Andaman With Us"
      );


    const from =
  "BlueVows <onboarding@resend.dev>";


    const body = {

      from,

      to: [
        receiver
      ],

      subject:
        `New Enquiry Received — ${textOr(
          enquiry.destination,
          "Andaman"
        )} — ${guest}`,

      html:
        buildHtml({
          enquiry,
          adults: payload.adults,
          children: payload.children,
          siteName,
          tagline
        })

    };


    if (customerEmail) {

      body.reply_to =
        customerEmail;

    }


    let r;


    try {

      r = await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(body)
        }
      );

    } catch (e) {

      console.error(
        "Resend connection error",
        e
      );

      return json(
        {
          ok: false,
          error:
            "Could not connect to Resend."
        },
        502,
        corsHeaders
      );

    }


    const txt =
      await r.text();


    let data = {};


    try {

      data =
        txt
          ? JSON.parse(txt)
          : {};

    } catch {}


    if (!r.ok) {

      console.error(
        "Resend error",
        {
          status: r.status,
          message:
            data?.message || null,
          name:
            data?.name || null
        }
      );


      return json(
        {
          ok: false,

          error:
            data?.message ||
            data?.name ||
            `Resend returned HTTP ${r.status}.`,

          resendStatus:
            r.status
        },
        502,
        corsHeaders
      );

    }


    console.log(
      "BlueVows enquiry email sent",
      {
        id:
          data?.id || null,

        guest
      }
    );


    return json(
      {
        ok: true,

        id:
          data?.id || null
      },
      200,
      corsHeaders
    );


  } catch (e) {

    console.error(
      "BlueVows enquiry email failed",
      e
    );


    return json(
      {
        ok: false,

        error:
          e?.message ||
          "Unable to send enquiry email."
      },
      500,
      corsHeaders
    );

  }

}


/* CLOUDFLARE WORKER */

export default {

  async fetch(
    request,
    env
  ) {

    const url =
      new URL(request.url);


    if (
      url.pathname ===
      "/api/send-enquiry"
    ) {


      if (
        request.method ===
        "OPTIONS"
      ) {

        return new Response(
          null,
          {
            status: 204,
            headers:
              corsHeaders
          }
        );

      }


      if (
        request.method ===
        "POST"
      ) {

        return sendEnquiry(
          request,
          env
        );

      }


      return json(
        {
          ok: false,
          error:
            "Method not allowed"
        },
        405,
        corsHeaders
      );

    }


    return env.ASSETS.fetch(
      request
    );

  }

};
