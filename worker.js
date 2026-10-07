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
  return `
<tr>
<td style="
  width:38%;
  padding:7px 9px;
  border-bottom:1px solid #e5e7eb;
  font-size:11px;
  line-height:15px;
  font-weight:700;
  color:#374151;
  vertical-align:middle;
">
${escapeHtml(label)}
</td>

<td style="
  width:62%;
  padding:7px 9px;
  border-bottom:1px solid #e5e7eb;
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

function buildBox(title, content) {
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
style="
  width:100%;
  margin-top:9px;
  border:1px solid #dfe3e8;
  border-radius:9px;
  background:#ffffff;
  overflow:hidden;
">
<tr>
<td style="
  padding:7px 9px;
  border-bottom:1px solid #e5e7eb;
  font-size:10px;
  line-height:13px;
  font-weight:800;
  letter-spacing:.6px;
  color:#111827;
">
${escapeHtml(title)}
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

  const total =
    Number(av || 0) + Number(cv || 0);

  const travellers = total > 0 ? String(total) : "—";

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

<title>New Enquiry - ${escapeHtml(company)}</title>

<style>
html,body{
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
    padding:8px!important;
  }

  .content-pad{
    padding:12px!important;
  }

  .title{
    font-size:18px!important;
    line-height:22px!important;
  }
}
</style>
</head>

<body style="margin:0;padding:0;background:#ffffff;">

<table role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="width:100%;background:#ffffff;">
<tr>
<td align="center"
class="outer-pad"
style="padding:10px;background:#ffffff;">

<!-- MAIN OUTER BORDER -->
<table role="presentation"
class="main-card"
width="560"
cellspacing="0"
cellpadding="0"
border="0"
style="
  width:100%;
  max-width:560px;
  background:#ffffff;
  border:1.5px solid #cfd4da;
  border-radius:12px;
  overflow:hidden;
">

<!-- HEADER -->
<tr>
<td style="
  padding:12px 14px;
  background:#ffffff;
  border-bottom:1px solid #e1e4e8;
">

<table role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0">
<tr>

<!-- PROFESSIONAL MAIL ICON -->
<td width="34"
valign="middle"
style="width:34px;padding-right:8px;">

<table role="presentation"
width="28"
height="24"
cellspacing="0"
cellpadding="0"
border="0"
style="
  width:28px;
  height:24px;
  border:1.5px solid #111827;
  border-radius:5px;
  background:#ffffff;
">
<tr>
<td align="center"
valign="middle"
style="
  font-family:Arial,Helvetica,sans-serif;
  font-size:12px;
  line-height:12px;
  font-weight:700;
  color:#111827;
">
@
</td>
</tr>
</table>

</td>

<td valign="middle">

<div style="
  font-size:18px;
  line-height:21px;
  font-weight:800;
  letter-spacing:.4px;
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

<!-- CONTENT -->
<tr>
<td class="content-pad"
style="
  padding:13px 14px;
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
  letter-spacing:1px;
  color:#6b7280;
">
WEBSITE ENQUIRY
</td>
</tr>

<tr>
<td class="title"
style="
  padding-top:3px;
  font-size:20px;
  line-height:24px;
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
A customer has submitted an enquiry through your website.
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
  margin-top:10px;
  border:1px solid #dfe3e8;
  border-radius:9px;
  background:#ffffff;
  overflow:hidden;
">

<tr>
<td style="
  padding:7px 9px;
  border-bottom:1px solid #e5e7eb;
  font-size:10px;
  line-height:13px;
  font-weight:800;
  letter-spacing:.6px;
  color:#111827;
">
CUSTOMER DETAILS
</td>
</tr>

<tr>
<td style="padding:0;">

<table role="presentation"
class="details-table"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="width:100%;">

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

</td>
</tr>
</table>

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
  padding:10px 14px 12px;
  background:#ffffff;
  border-top:1px solid #e1e4e8;
  text-align:center;
">

<div style="
  font-size:12px;
  line-height:16px;
  font-weight:800;
  color:#111827;
">
${escapeHtml(company)}
</div>

<div style="
  margin-top:1px;
  font-size:9px;
  line-height:13px;
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
    const apiKey =
      String(env?.RESEND_API_KEY || "").trim();

    const receiver =
      String(env?.ENQUIRY_RECEIVER_EMAIL || "").trim();

    if (!apiKey || !receiver) {
      const missing = [];

      if (!apiKey) missing.push("RESEND_API_KEY");
      if (!receiver) missing.push("ENQUIRY_RECEIVER_EMAIL");

      return json({
        ok:false,
        error:`Email service is not configured. Missing: ${missing.join(", ")}`
      },500);
    }

    const payload = await request.json();
    const enquiry = payload?.enquiry || {};

    const customerEmail =
      String(enquiry.email || "").trim();

    const siteName =
      textOr(payload.siteName,"BlueVows");

    const tagline =
      textOr(payload.tagline,"Explore Andaman With Us");

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
      body.reply_to = customerEmail;
    }

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method:"POST",
        headers:{
          Authorization:`Bearer ${apiKey}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
      }
    );

    const raw = await response.text();

    let data = {};

    try{
      data = raw ? JSON.parse(raw) : {};
    }catch{
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
        resendStatus:response.status
      },502);
    }

    return json({
      ok:true,
      id:data?.id || null
    });

  }catch(error){

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
  async fetch(request, env) {

    const url = new URL(request.url);

    if(request.method === "OPTIONS"){
      return json({ok:true},204);
    }

    if(
      url.pathname === "/api/email-status" &&
      request.method === "GET"
    ){

      const hasApiKey =
        Boolean(
          String(env?.RESEND_API_KEY || "").trim()
        );

      const hasReceiver =
        Boolean(
          String(env?.ENQUIRY_RECEIVER_EMAIL || "").trim()
        );

      const hasFrom =
        Boolean(
          String(env?.RESEND_FROM_EMAIL || "").trim()
        );

      return json({
        ok:hasApiKey && hasReceiver,

        bindings:{
          RESEND_API_KEY:hasApiKey,
          ENQUIRY_RECEIVER_EMAIL:hasReceiver,
          RESEND_FROM_EMAIL:hasFrom,
          ASSETS:Boolean(env?.ASSETS)
        },

        from:hasFrom
          ? "BlueVows Website <configured>"
          : "BlueVows Website <onboarding@resend.dev>"
      });
    }

    if(url.pathname === "/api/send-enquiry"){

      if(request.method === "POST"){
        return sendEnquiry(request,env);
      }

      return json({
        ok:false,
        error:"Method not allowed"
      },405);
    }

    return env.ASSETS.fetch(request);
  }
};
