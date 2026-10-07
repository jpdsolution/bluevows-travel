// worker.js
// COMPLETE REPLACEMENT

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


/* =========================
   EMAIL-SAFE ICONS
   CSS ONLY - NO SVG / NO EMOJI
========================= */

function icon(type) {

  const base = `
    display:inline-block;
    position:relative;
    width:18px;
    height:18px;
    vertical-align:middle;
  `;

  if (type === "user") {
    return `
      <span style="${base}">
        <span style="
          position:absolute;
          width:6px;
          height:6px;
          border:1.5px solid #111827;
          border-radius:50%;
          left:5px;
          top:1px;
        "></span>
        <span style="
          position:absolute;
          width:12px;
          height:7px;
          border:1.5px solid #111827;
          border-bottom:0;
          border-radius:8px 8px 0 0;
          left:2px;
          bottom:1px;
        "></span>
      </span>`;
  }

  if (type === "email") {
    return `
      <span style="
        display:inline-block;
        width:17px;
        height:12px;
        border:1.5px solid #111827;
        border-radius:3px;
        position:relative;
        vertical-align:middle;
      ">
        <span style="
          position:absolute;
          width:9px;
          height:9px;
          border-left:1.5px solid #111827;
          border-bottom:1.5px solid #111827;
          transform:rotate(-45deg);
          left:3px;
          top:-1px;
        "></span>
      </span>`;
  }

  if (type === "phone") {
    return `
      <span style="
        display:inline-block;
        width:16px;
        height:17px;
        position:relative;
        vertical-align:middle;
      ">
        <span style="
          position:absolute;
          width:7px;
          height:13px;
          border:1.6px solid #111827;
          border-radius:7px;
          transform:rotate(-35deg);
          left:4px;
          top:1px;
        "></span>
      </span>`;
  }

  if (type === "calendar") {
    return `
      <span style="
        display:inline-block;
        width:16px;
        height:14px;
        border:1.5px solid #111827;
        border-radius:3px;
        position:relative;
        vertical-align:middle;
      ">
        <span style="
          position:absolute;
          left:0;
          right:0;
          top:4px;
          border-top:1.5px solid #111827;
        "></span>
        <span style="
          position:absolute;
          left:3px;
          top:-3px;
          width:1.5px;
          height:5px;
          background:#111827;
        "></span>
        <span style="
          position:absolute;
          right:3px;
          top:-3px;
          width:1.5px;
          height:5px;
          background:#111827;
        "></span>
      </span>`;
  }

  if (type === "users") {
    return `
      <span style="
        display:inline-block;
        width:18px;
        height:17px;
        position:relative;
        vertical-align:middle;
      ">
        <span style="
          position:absolute;
          left:1px;
          top:1px;
          width:6px;
          height:6px;
          border:1.4px solid #111827;
          border-radius:50%;
        "></span>
        <span style="
          position:absolute;
          left:0;
          bottom:0;
          width:10px;
          height:7px;
          border:1.4px solid #111827;
          border-bottom:0;
          border-radius:7px 7px 0 0;
        "></span>
        <span style="
          position:absolute;
          right:1px;
          top:3px;
          width:5px;
          height:5px;
          border:1.3px solid #111827;
          border-radius:50%;
        "></span>
        <span style="
          position:absolute;
          right:0;
          bottom:0;
          width:7px;
          height:5px;
          border:1.3px solid #111827;
          border-bottom:0;
          border-radius:6px 6px 0 0;
        "></span>
      </span>`;
  }

  if (type === "location") {
    return `
      <span style="
        display:inline-block;
        width:14px;
        height:14px;
        border:1.5px solid #111827;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        position:relative;
        vertical-align:middle;
      ">
        <span style="
          position:absolute;
          width:4px;
          height:4px;
          border:1px solid #111827;
          border-radius:50%;
          left:4px;
          top:4px;
        "></span>
      </span>`;
  }

  if (type === "package") {
    return `
      <span style="
        display:inline-block;
        width:15px;
        height:13px;
        border:1.5px solid #111827;
        border-radius:2px;
        position:relative;
        vertical-align:middle;
      ">
        <span style="
          position:absolute;
          left:0;
          right:0;
          top:4px;
          border-top:1.5px solid #111827;
        "></span>
        <span style="
          position:absolute;
          left:4px;
          top:-4px;
          width:5px;
          height:4px;
          border:1.5px solid #111827;
          border-bottom:0;
        "></span>
      </span>`;
  }

  if (type === "id") {
    return `
      <span style="
        display:inline-block;
        width:16px;
        height:12px;
        border:1.5px solid #111827;
        border-radius:3px;
        position:relative;
        vertical-align:middle;
      ">
        <span style="
          position:absolute;
          left:3px;
          top:3px;
          width:4px;
          height:4px;
          border:1px solid #111827;
          border-radius:50%;
        "></span>
        <span style="
          position:absolute;
          right:2px;
          top:3px;
          width:4px;
          height:1px;
          background:#111827;
          box-shadow:0 3px 0 #111827;
        "></span>
      </span>`;
  }

  if (type === "clock") {
    return `
      <span style="
        display:inline-block;
        width:15px;
        height:15px;
        border:1.5px solid #111827;
        border-radius:50%;
        position:relative;
        vertical-align:middle;
      ">
        <span style="
          position:absolute;
          left:6px;
          top:3px;
          width:1.5px;
          height:5px;
          background:#111827;
        "></span>
        <span style="
          position:absolute;
          left:6px;
          top:7px;
          width:4px;
          height:1.5px;
          background:#111827;
        "></span>
      </span>`;
  }

  if (type === "message") {
    return `
      <span style="
        display:inline-block;
        width:16px;
        height:12px;
        border:1.5px solid #111827;
        border-radius:3px;
        position:relative;
        vertical-align:middle;
      ">
        <span style="
          position:absolute;
          left:2px;
          bottom:-4px;
          width:5px;
          height:5px;
          border-left:1.5px solid #111827;
          border-bottom:1.5px solid #111827;
          transform:skewY(-30deg);
        "></span>
      </span>`;
  }

  if (type === "mail") {
    return `
      <span style="
        display:inline-block;
        width:21px;
        height:15px;
        border:1.7px solid #ffffff;
        border-radius:4px;
        position:relative;
        vertical-align:middle;
      ">
        <span style="
          position:absolute;
          left:2px;
          top:1px;
          width:12px;
          height:12px;
          border-left:1.5px solid #ffffff;
          border-bottom:1.5px solid #ffffff;
          transform:rotate(-45deg);
        "></span>
      </span>`;
  }

  return "";
}


/* =========================
   DETAIL ROW
========================= */

function buildRow(label, value, iconType, mono = false) {

  return `
<tr>

<td style="
  width:46%;
  padding:8px 8px;
  border-bottom:1px solid #e8eaed;
  vertical-align:middle;
">

<table
role="presentation"
cellspacing="0"
cellpadding="0"
border="0"
style="width:auto;">

<tr>

<td
width="24"
style="
  width:24px;
  padding:0 5px 0 0;
  vertical-align:middle;
">

${icon(iconType)}

</td>

<td style="
  font-size:11px;
  line-height:15px;
  font-weight:700;
  color:#374151;
  vertical-align:middle;
  white-space:nowrap;
">

${escapeHtml(label)}

</td>

</tr>

</table>

</td>


<td style="
  width:54%;
  padding:8px 8px;
  border-bottom:1px solid #e8eaed;
  font-size:11px;
  line-height:15px;
  color:#111827;
  vertical-align:middle;
  word-break:break-word;
  overflow-wrap:anywhere;
  ${mono ? "font-family:monospace;" : ""}
">

${escapeHtml(value) || "—"}

</td>

</tr>`;
}


/* =========================
   BOX
========================= */

function buildBox(title, content, iconType) {

  return `
<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="
  width:100%;
  margin-top:9px;
  border:1px solid #d9dde3;
  border-radius:9px;
  background:#ffffff;
  overflow:hidden;
">

<tr>

<td style="
  padding:7px 9px;
  background:#f5f6f8;
  border-bottom:1px solid #e5e7eb;
">

<table
role="presentation"
cellspacing="0"
cellpadding="0"
border="0">

<tr>

<td
width="23"
style="
  width:23px;
  padding-right:6px;
  vertical-align:middle;
">

${icon(iconType)}

</td>

<td style="
  font-size:10px;
  line-height:13px;
  font-weight:800;
  letter-spacing:.7px;
  color:#111827;
  vertical-align:middle;
">

${escapeHtml(title)}

</td>

</tr>

</table>

</td>

</tr>

<tr>

<td style="
  padding:8px 9px;
  font-size:11px;
  line-height:16px;
  color:#111827;
  word-break:break-word;
  overflow-wrap:anywhere;
">

${content}

</td>

</tr>

</table>`;
}


/* =========================
   EMAIL TEMPLATE
========================= */

function buildHtml({
  enquiry = {},
  adults,
  children,
  siteName = "BlueVows Travel",
  tagline = "Explore Andaman With Us"
}) {

  const company =
    textOr(siteName, "BlueVows Travel");

  const tag =
    textOr(tagline, "Explore Andaman With Us");

  const guest =
    textOr(enquiry.name, "Website Guest");

  const email =
    textOr(enquiry.email, "—");

  const phone =
    textOr(enquiry.phone, "—");

  const travelDate =
    textOr(
      enquiry.travelDate ||
      enquiry.travel_date ||
      enquiry.date ||
      enquiry.travelDateValue ||
      enquiry.checkIn ||
      enquiry.startDate,
      "—"
    );

  const packageName =
    textOr(
      enquiry.packageName ||
      enquiry.package_name ||
      enquiry.package ||
      enquiry.packageTitle ||
      enquiry.selectedPackage,
      "—"
    );

  const av =
    textOr(
      adults ??
      enquiry.adults ??
      enquiry.adult,
      "—"
    );

  const cv =
    textOr(
      children ??
      enquiry.children ??
      enquiry.child,
      "—"
    );

  const adultNumber =
    Number(av);

  const childNumber =
    Number(cv);

  const travellers =
    !isNaN(adultNumber) &&
    !isNaN(childNumber)
      ? String(adultNumber + childNumber)
      : "—";

  const destination =
    textOr(
      enquiry.destination,
      "—"
    );

  const id =
    textOr(
      enquiry.id ||
      enquiry.enquiryId ||
      enquiry.enquiry_id,
      "—"
    );

  const message =
    textOr(
      enquiry.message,
      "No message provided"
    );

  const received =
    enquiry.created_at
      ? new Date(
          enquiry.created_at
        ).toLocaleString(
          "en-IN",
          {
            dateStyle:"medium",
            timeStyle:"short"
          }
        )
      : new Date().toLocaleString(
          "en-IN",
          {
            dateStyle:"medium",
            timeStyle:"short"
          }
        );

  const messageHtml =
    escapeHtml(message)
      .replace(/\n/g, "<br>");


  return `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width,initial-scale=1.0">

<meta name="x-apple-disable-message-reformatting">

<title>
New Enquiry - ${escapeHtml(company)}
</title>

<style>

html,
body{
  margin:0!important;
  padding:0!important;
  width:100%!important;
  background:#ffffff!important;
}

body{
  font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Arial,
  Helvetica,
  sans-serif;
  color:#111827;
}

table{
  border-collapse:separate;
  border-spacing:0;
}

a{
  color:#111827!important;
  text-decoration:none!important;
}

@media only screen and (max-width:600px){

  .outer{
    padding:0!important;
  }

  .card{
    width:100%!important;
    max-width:100%!important;
    border-radius:0!important;
    border-left:1px solid #111827!important;
    border-right:1px solid #111827!important;
  }

  .header{
    padding:12px 10px!important;
  }

  .content{
    padding:11px 8px!important;
  }

}

</style>

</head>


<body>

<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="
  width:100%;
  background:#ffffff;
">

<tr>

<td
class="outer"
align="center"
style="
  padding:0;
  background:#ffffff;
">


<!-- MAIN CARD -->

<table
role="presentation"
class="card"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="
  width:100%;
  max-width:620px;
  margin:0 auto;
  background:#ffffff;
  border:2px solid #111827;
  border-radius:12px;
  overflow:hidden;
">


<!-- HEADER -->

<tr>

<td
class="header"
style="
  padding:13px 11px;
  background:#111827;
">

<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0">

<tr>


<!-- HEADER ICON -->

<td
width="38"
style="
  width:38px;
  padding:0 8px 0 0;
  vertical-align:middle;
">

<table
role="presentation"
width="32"
height="32"
cellspacing="0"
cellpadding="0"
border="0"
style="
  width:32px;
  height:32px;
  border:1px solid #ffffff;
  border-radius:8px;
">

<tr>

<td
align="center"
valign="middle"
style="
  width:32px;
  height:32px;
  text-align:center;
  vertical-align:middle;
">

${icon("mail")}

</td>

</tr>

</table>

</td>


<!-- HEADER TEXT -->

<td
style="
  padding:0;
  vertical-align:middle;
">

<div
style="
  font-size:20px;
  line-height:23px;
  font-weight:800;
  letter-spacing:.2px;
  color:#ffffff;
  margin:0;
  padding:0;
">

${escapeHtml(company)}

</div>

<div
style="
  margin:1px 0 0;
  padding:0;
  font-size:10px;
  line-height:13px;
  color:#d1d5db;
">

${escapeHtml(tag)}

</div>

</td>

</tr>

</table>

</td>

</tr>


<!-- CONTENT -->

<tr>

<td
class="content"
style="
  padding:13px 9px;
  background:#ffffff;
">


<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0">

<tr>

<td
style="
  font-size:9px;
  line-height:12px;
  font-weight:800;
  letter-spacing:1.5px;
  color:#737981;
">

WEBSITE ENQUIRY

</td>

</tr>

<tr>

<td
style="
  padding-top:3px;
  font-size:21px;
  line-height:25px;
  font-weight:800;
  color:#111827;
">

New Enquiry Received

</td>

</tr>

<tr>

<td
style="
  padding-top:3px;
  font-size:11px;
  line-height:16px;
  color:#737981;
">

A new travel enquiry has been received from your website.

</td>

</tr>

</table>


<!-- CUSTOMER DETAILS -->

<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="
  width:100%;
  margin-top:10px;
  border:1px solid #d8dce1;
  border-radius:9px;
  background:#ffffff;
  overflow:hidden;
">


<tr>

<td
style="
  padding:7px 9px;
  background:#f4f5f7;
  border-bottom:1px solid #e1e4e8;
">

<table
role="presentation"
cellspacing="0"
cellpadding="0"
border="0">

<tr>

<td
width="23"
style="
  width:23px;
  padding-right:6px;
  vertical-align:middle;
">

${icon("user")}

</td>

<td
style="
  font-size:10px;
  line-height:13px;
  font-weight:800;
  letter-spacing:.8px;
  color:#111827;
  vertical-align:middle;
">

CUSTOMER DETAILS

</td>

</tr>

</table>

</td>

</tr>


<tr>

<td
style="
  padding:0;
">

<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0">

${buildRow("Guest Name",guest,"user")}
${buildRow("Email Address",email,"email")}
${buildRow("Phone / WhatsApp",phone,"phone")}
${buildRow("Travel Date",travelDate,"calendar")}
${buildRow("Adults",av,"users")}
${buildRow("Children",cv,"users")}
${buildRow("Travellers",travellers,"users")}
${buildRow("Destination",destination,"location")}
${buildRow("Package",packageName,"package")}
${buildRow("Enquiry ID",id,"id",true)}
${buildRow("Received",received,"clock")}

</table>

</td>

</tr>

</table>


<!-- MESSAGE -->

${buildBox(
  "CUSTOMER MESSAGE",
  messageHtml,
  "message"
)}


<!-- FOLLOW UP -->

${buildBox(
  "FOLLOW-UP",
  "Contact the guest to discuss travel plans, availability and package options.",
  "phone"
)}


</td>

</tr>


<!-- FOOTER -->

<tr>

<td
style="
  padding:9px 10px 10px;
  background:#111827;
  text-align:center;
">

<div
style="
  font-size:12px;
  line-height:15px;
  font-weight:800;
  color:#ffffff;
">

${escapeHtml(company)}

</div>

<div
style="
  margin-top:1px;
  font-size:9px;
  line-height:12px;
  color:#cfd3d8;
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


/* =========================
   SEND ENQUIRY
========================= */

async function sendEnquiry(request, env) {

  try {

    const apiKey =
      String(
        env?.RESEND_API_KEY || ""
      ).trim();

    const receiver =
      String(
        env?.ENQUIRY_RECEIVER_EMAIL || ""
      ).trim();

    if (!apiKey || !receiver) {

      const missing = [];

      if (!apiKey)
        missing.push("RESEND_API_KEY");

      if (!receiver)
        missing.push("ENQUIRY_RECEIVER_EMAIL");

      return json(
        {
          ok:false,
          error:
            `Email service is not configured. Missing: ${missing.join(", ")}`
        },
        500
      );
    }

    const payload =
      await request.json();

    const enquiry =
      payload?.enquiry || {};

    const customerEmail =
      String(
        enquiry.email || ""
      ).trim();

    const siteName =
      textOr(
        payload.siteName,
        "BlueVows Travel"
      );

    const tagline =
      textOr(
        payload.tagline,
        "Explore Andaman With Us"
      );

    const from =
      String(
        env.RESEND_FROM_EMAIL ||
        "BlueVows Website <onboarding@resend.dev>"
      ).trim();

    const body = {

      from,

      to:[
        receiver
      ],

      subject:
        `New Enquiry Received — ${textOr(
          enquiry.destination,
          "Andaman"
        )} — ${textOr(
          enquiry.name,
          "Website Guest"
        )}`,

      html:
        buildHtml({
          enquiry,
          adults:payload.adults,
          children:payload.children,
          siteName,
          tagline
        })

    };

    if (customerEmail) {
      body.reply_to =
        customerEmail;
    }

    const response =
      await fetch(
        "https://api.resend.com/emails",
        {
          method:"POST",

          headers:{
            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(body)
        }
      );

    const raw =
      await response.text();

    let data = {};

    try {
      data =
        raw ? JSON.parse(raw) : {};
    } catch {
      data = { raw };
    }

    if (!response.ok) {

      console.error(
        "Resend rejected BlueVows email",
        {
          status:response.status,
          response:data
        }
      );

      return json(
        {
          ok:false,
          error:
            data?.message ||
            data?.error ||
            raw ||
            `Resend returned HTTP ${response.status}`,
          resendStatus:
            response.status
        },
        502
      );
    }

    return json({
      ok:true,
      id:data?.id || null
    });

  } catch (error) {

    console.error(
      "BlueVows enquiry email function failed",
      error?.stack || error
    );

    return json(
      {
        ok:false,
        error:
          error?.message ||
          "Unable to send enquiry email."
      },
      500
    );
  }
}


/* =========================
   CLOUDFLARE WORKER
========================= */

export default {

  async fetch(request, env) {

    const url =
      new URL(request.url);

    if (
      request.method ===
      "OPTIONS"
    ) {
      return json(
        { ok:true },
        204
      );
    }


    if (
      url.pathname ===
        "/api/email-status" &&
      request.method ===
        "GET"
    ) {

      const hasApiKey =
        Boolean(
          String(
            env?.RESEND_API_KEY || ""
          ).trim()
        );

      const hasReceiver =
        Boolean(
          String(
            env?.ENQUIRY_RECEIVER_EMAIL || ""
          ).trim()
        );

      const hasFrom =
        Boolean(
          String(
            env?.RESEND_FROM_EMAIL || ""
          ).trim()
        );

      return json({

        ok:
          hasApiKey &&
          hasReceiver,

        bindings:{

          RESEND_API_KEY:
            hasApiKey,

          ENQUIRY_RECEIVER_EMAIL:
            hasReceiver,

          RESEND_FROM_EMAIL:
            hasFrom,

          ASSETS:
            Boolean(env?.ASSETS)

        },

        from:
          hasFrom
            ? "BlueVows Website <configured>"
            : "BlueVows Website <onboarding@resend.dev>"

      });
    }


    if (
      url.pathname ===
      "/api/send-enquiry"
    ) {

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
          ok:false,
          error:"Method not allowed"
        },
        405
      );
    }


    return env.ASSETS.fetch(
      request
    );
  }
};
