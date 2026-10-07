// worker.js

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

/* SVG ICONS - EMAIL SAFE INLINE SVG */
function icon(type) {
  const icons = {
    user: `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="8" r="4" stroke="#111827" stroke-width="2"/>
<path d="M4 21C4.8 16.8 7.4 15 12 15C16.6 15 19.2 16.8 20 21"
stroke="#111827" stroke-width="2" stroke-linecap="round"/>
</svg>`,

    email: `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
xmlns="http://www.w3.org/2000/svg">
<rect x="3" y="5" width="18" height="14" rx="2"
stroke="#111827" stroke-width="2"/>
<path d="M4 7L12 13L20 7"
stroke="#111827" stroke-width="2"
stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

    phone: `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
xmlns="http://www.w3.org/2000/svg">
<path d="M6.6 3H10L11.5 7L9.5 8.5C10.4 10.5 12 12.1 14 13L15.5 11L19.5 12.5V16C19.5 18 18 19.5 16 19.5C9.4 19.5 4.5 14.6 4.5 8C4.5 6 6 3 6.6 3Z"
stroke="#111827" stroke-width="1.8"
stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

    calendar: `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
xmlns="http://www.w3.org/2000/svg">
<rect x="3" y="5" width="18" height="16" rx="2"
stroke="#111827" stroke-width="2"/>
<path d="M7 3V7M17 3V7M3 10H21"
stroke="#111827" stroke-width="2"
stroke-linecap="round"/>
</svg>`,

    users: `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
xmlns="http://www.w3.org/2000/svg">
<circle cx="9" cy="8" r="3"
stroke="#111827" stroke-width="2"/>
<circle cx="17" cy="9" r="2.5"
stroke="#111827" stroke-width="2"/>
<path d="M3.5 20C4.2 16.5 6 15 9 15C12 15 13.8 16.5 14.5 20"
stroke="#111827" stroke-width="2"
stroke-linecap="round"/>
<path d="M15 15C17.7 15.1 19.4 16.4 20 19"
stroke="#111827" stroke-width="2"
stroke-linecap="round"/>
</svg>`,

    location: `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
xmlns="http://www.w3.org/2000/svg">
<path d="M20 10C20 15.5 12 21 12 21C12 21 4 15.5 4 10C4 5.6 7.6 3 12 3C16.4 3 20 5.6 20 10Z"
stroke="#111827" stroke-width="2"/>
<circle cx="12" cy="10" r="2.5"
stroke="#111827" stroke-width="2"/>
</svg>`,

    package: `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
xmlns="http://www.w3.org/2000/svg">
<path d="M4 8L12 4L20 8V17L12 21L4 17V8Z"
stroke="#111827" stroke-width="2"
stroke-linejoin="round"/>
<path d="M4 8L12 12L20 8M12 12V21"
stroke="#111827" stroke-width="2"/>
</svg>`,

    id: `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
xmlns="http://www.w3.org/2000/svg">
<rect x="3" y="5" width="18" height="14" rx="2"
stroke="#111827" stroke-width="2"/>
<circle cx="8" cy="11" r="2"
stroke="#111827" stroke-width="1.7"/>
<path d="M12 10H18M12 14H17"
stroke="#111827" stroke-width="1.7"
stroke-linecap="round"/>
</svg>`,

    clock: `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="9"
stroke="#111827" stroke-width="2"/>
<path d="M12 7V12L15 14"
stroke="#111827" stroke-width="2"
stroke-linecap="round"/>
</svg>`,

    message: `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
xmlns="http://www.w3.org/2000/svg">
<path d="M5 5H19C20.1 5 21 5.9 21 7V16C21 17.1 20.1 18 19 18H10L6 21V18H5C3.9 18 3 17.1 3 16V7C3 5.9 3.9 5 5 5Z"
stroke="#111827" stroke-width="2"
stroke-linejoin="round"/>
</svg>`,

    mail: `
<svg width="22" height="22" viewBox="0 0 24 24" fill="none"
xmlns="http://www.w3.org/2000/svg">
<rect x="3" y="5" width="18" height="14" rx="2"
stroke="#ffffff" stroke-width="2"/>
<path d="M4 7L12 13L20 7"
stroke="#ffffff" stroke-width="2"
stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  };

  return icons[type] || "";
}

function buildRow(label, value, iconType, mono = false) {
  return `
<tr>
<td style="
  padding:8px 9px;
  border-bottom:1px solid #e8eaed;
  vertical-align:middle;
">
<table role="presentation" cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="22" style="
  width:22px;
  padding-right:6px;
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
">
${escapeHtml(label)}
</td>
</tr>
</table>
</td>

<td style="
  padding:8px 9px;
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

function buildBox(title, content, iconType) {
  return `
<table role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="
  width:100%;
  margin-top:10px;
  border:1px solid #d9dde3;
  border-radius:10px;
  background:#ffffff;
  overflow:hidden;
">
<tr>
<td style="
  padding:8px 10px;
  background:#f8f9fa;
  border-bottom:1px solid #e5e7eb;
">

<table role="presentation" cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="22" style="
  width:22px;
  padding-right:6px;
  vertical-align:middle;
">
${icon(iconType)}
</td>

<td style="
  font-size:10px;
  line-height:14px;
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
  padding:9px 10px;
  font-size:11px;
  line-height:17px;
  color:#111827;
  word-break:break-word;
  overflow-wrap:anywhere;
">
${content}
</td>
</tr>
</table>`;
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

  /* FIXED TRAVEL DATE + PACKAGE */
  const travelDate = textOr(
    enquiry.travelDate ||
    enquiry.travel_date ||
    enquiry.date ||
    enquiry.travelDateValue,
    "—"
  );

  const packageName = textOr(
    enquiry.packageName ||
    enquiry.package_name ||
    enquiry.package ||
    enquiry.packageTitle ||
    enquiry.selectedPackage,
    "—"
  );

  const av = textOr(
    adults ?? enquiry.adults ?? enquiry.adult,
    "—"
  );

  const cv = textOr(
    children ?? enquiry.children ?? enquiry.child,
    "—"
  );

  const adultNumber = Number(av);
  const childNumber = Number(cv);

  const travellers =
    !isNaN(adultNumber) &&
    !isNaN(childNumber)
      ? String(adultNumber + childNumber)
      : "—";

  const destination = textOr(
    enquiry.destination,
    "—"
  );

  const id = textOr(
    enquiry.id ||
    enquiry.enquiryId ||
    enquiry.enquiry_id,
    "—"
  );

  const message = textOr(
    enquiry.message,
    "No message provided"
  );

  const received = enquiry.created_at
    ? new Date(enquiry.created_at).toLocaleString(
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
    escapeHtml(message).replace(/\n/g,"<br>");

  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport"
content="width=device-width,initial-scale=1.0">

<meta name="x-apple-disable-message-reformatting">

<title>New Enquiry - ${escapeHtml(company)}</title>

<style>

html,
body{
  margin:0!important;
  padding:0!important;
  width:100%!important;
  background:#ffffff!important;
}

body{
  font-family:Arial,Helvetica,sans-serif;
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

  .main-card{
    width:100%!important;
  }

  .outer-pad{
    padding:7px!important;
  }

  .content-pad{
    padding:11px!important;
  }

  .title{
    font-size:18px!important;
    line-height:22px!important;
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
">

<tr>

<td align="center"
class="outer-pad"
style="
padding:10px;
background:#ffffff;
">

<!-- OUTER CARD -->

<table role="presentation"
class="main-card"
width="570"
cellspacing="0"
cellpadding="0"
border="0"
style="
width:100%;
max-width:570px;
background:#ffffff;
border:2px solid #111827;
border-radius:14px;
overflow:hidden;
">

<!-- BLACK HEADER -->

<tr>

<td style="
padding:14px 15px;
background:#111827;
">

<table role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0">

<tr>

<td width="38"
style="
width:38px;
padding-right:9px;
vertical-align:middle;
">

<table role="presentation"
width="34"
height="34"
cellspacing="0"
cellpadding="0"
border="0"
style="
width:34px;
height:34px;
border:1px solid #ffffff;
border-radius:8px;
">

<tr>

<td align="center"
valign="middle">

${icon("mail")}

</td>

</tr>

</table>

</td>

<td style="
vertical-align:middle;
">

<div style="
font-size:20px;
line-height:23px;
font-weight:800;
letter-spacing:.5px;
color:#ffffff;
">
${escapeHtml(company)}
</div>

<div style="
margin-top:2px;
font-size:10px;
line-height:14px;
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

<td class="content-pad"
style="
padding:14px 15px;
background:#ffffff;
">

<table role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0">

<tr>

<td style="
font-size:9px;
line-height:12px;
font-weight:800;
letter-spacing:1.2px;
color:#6b7280;
">
WEBSITE ENQUIRY
</td>

</tr>

<tr>

<td class="title"
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

<td style="
padding-top:3px;
font-size:11px;
line-height:16px;
color:#6b7280;
">
A new travel enquiry has been received from your website.
</td>

</tr>

</table>

<!-- CUSTOMER DETAILS -->

<table role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="
width:100%;
margin-top:11px;
border:1px solid #d9dde3;
border-radius:10px;
background:#ffffff;
overflow:hidden;
">

<tr>

<td style="
padding:8px 10px;
background:#f8f9fa;
border-bottom:1px solid #e5e7eb;
">

<table role="presentation"
cellspacing="0"
cellpadding="0"
border="0">

<tr>

<td width="22"
style="
width:22px;
padding-right:6px;
vertical-align:middle;
">
${icon("user")}
</td>

<td style="
font-size:10px;
line-height:14px;
font-weight:800;
letter-spacing:.7px;
color:#111827;
">
CUSTOMER DETAILS
</td>

</tr>

</table>

</td>

</tr>

<tr>

<td style="padding:0;">

<table role="presentation"
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

${buildBox(
  "CUSTOMER MESSAGE",
  messageHtml,
  "message"
)}

${buildBox(
  "FOLLOW-UP",
  "Contact the guest to discuss travel plans, availability and package options.",
  "phone"
)}

</td>

</tr>

<!-- BLACK FOOTER -->

<tr>

<td style="
padding:11px 15px 12px;
background:#111827;
border-top:1px solid #111827;
text-align:center;
">

<div style="
font-size:13px;
line-height:17px;
font-weight:800;
color:#ffffff;
">
${escapeHtml(company)}
</div>

<div style="
margin-top:2px;
font-size:9px;
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

</table>

</body>
</html>
`;
}

async function sendEnquiry(request, env) {

  try {

    const apiKey =
      String(env?.RESEND_API_KEY || "").trim();

    const receiver =
      String(env?.ENQUIRY_RECEIVER_EMAIL || "").trim();

    if(!apiKey || !receiver){

      const missing = [];

      if(!apiKey)
        missing.push("RESEND_API_KEY");

      if(!receiver)
        missing.push("ENQUIRY_RECEIVER_EMAIL");

      return json({
        ok:false,
        error:
          `Email service is not configured. Missing: ${missing.join(", ")}`
      },500);
    }

    const payload = await request.json();

    const enquiry =
      payload?.enquiry || {};

    const customerEmail =
      String(enquiry.email || "").trim();

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
      String(
        env.RESEND_FROM_EMAIL ||
        "BlueVows Website <onboarding@resend.dev>"
      ).trim();

    const body = {

      from,

      to:[receiver],

      subject:
        `New Enquiry Received — ${textOr(
          enquiry.destination,
          "Andaman"
        )} — ${textOr(
          enquiry.name,
          "Website Guest"
        )}`,

      html:buildHtml({
        enquiry,
        adults:payload.adults,
        children:payload.children,
        siteName,
        tagline
      })

    };

    if(customerEmail){

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

    try{
      data =
        raw ? JSON.parse(raw) : {};
    }
    catch{
      data = {raw};
    }

    if(!response.ok){

      console.error(
        "Resend rejected BlueVows email",
        {
          status:response.status,
          response:data
        }
      );

      return json({
        ok:false,
        error:
          data?.message ||
          data?.error ||
          raw ||
          `Resend returned HTTP ${response.status}`,

        resendStatus:
          response.status
      },502);
    }

    return json({
      ok:true,
      id:data?.id || null
    });

  }
  catch(error){

    console.error(
      "BlueVows enquiry email function failed",
      error?.stack || error
    );

    return json({
      ok:false,
      error:
        error?.message ||
        "Unable to send enquiry email."
    },500);
  }
}

export default {

  async fetch(request,env){

    const url =
      new URL(request.url);

    if(request.method === "OPTIONS"){

      return json(
        {ok:true},
        204
      );
    }

    if(
      url.pathname === "/api/email-status" &&
      request.method === "GET"
    ){

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

    if(
      url.pathname ===
      "/api/send-enquiry"
    ){

      if(
        request.method === "POST"
      ){

        return sendEnquiry(
          request,
          env
        );
      }

      return json({
        ok:false,
        error:"Method not allowed"
      },405);
    }

    return env.ASSETS.fetch(request);
  }
};
