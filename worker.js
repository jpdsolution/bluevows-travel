function buildHtml({
  enquiry = {},
  adults,
  children,
  siteName = "BlueVows Travel",
  tagline = "Explore Andaman With Us"
}) {

  const company = textOr(siteName, "BlueVows Travel");
  const tag = textOr(tagline, "Explore Andaman With Us");

  const guest = textOr(enquiry.name, "Website Guest");
  const email = textOr(enquiry.email, "—");
  const phone = textOr(enquiry.phone, "—");

  const travelDate = textOr(
    enquiry.travelDate ||
    enquiry.travel_date ||
    enquiry.date ||
    enquiry.travelDateValue ||
    enquiry.checkIn ||
    enquiry.startDate,
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
          dateStyle: "medium",
          timeStyle: "short"
        }
      )
    : new Date().toLocaleString(
        "en-IN",
        {
          dateStyle: "medium",
          timeStyle: "short"
        }
      );

  const messageHtml =
    escapeHtml(message).replace(/\n/g, "<br>");

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
  font-family:-apple-system,BlinkMacSystemFont,
  "Segoe UI",Arial,Helvetica,sans-serif;
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

  .outer-cell{
    padding:0!important;
  }

  .main-card{
    width:100%!important;
    max-width:100%!important;
    border-radius:10px!important;
  }

  .header-cell{
    padding:13px 12px!important;
  }

  .content-cell{
    padding:12px 10px!important;
  }

  .header-title{
    font-size:18px!important;
    line-height:22px!important;
  }

  .main-title{
    font-size:19px!important;
    line-height:23px!important;
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
class="outer-cell"
align="center"
style="
padding:2px;
background:#ffffff;
">

<!-- MAIN CARD -->

<table
role="presentation"
class="main-card"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="
width:100%;
max-width:600px;
margin:0 auto;
background:#ffffff;
border:2px solid #111827;
border-radius:12px;
overflow:hidden;
">

<!-- BLACK HEADER -->

<tr>

<td
class="header-cell"
style="
padding:14px 14px;
background:#111827;
">

<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0"
style="
width:100%;
">

<tr>

<!-- ICON -->

<td
width="40"
valign="middle"
style="
width:40px;
padding:0 9px 0 0;
vertical-align:middle;
">

<table
role="presentation"
width="34"
height="34"
cellspacing="0"
cellpadding="0"
border="0"
style="
width:34px;
height:34px;
border:1px solid #ffffff;
border-radius:9px;
">

<tr>

<td
align="center"
valign="middle"
style="
width:34px;
height:34px;
vertical-align:middle;
text-align:center;
">

${icon("mail")}

</td>

</tr>

</table>

</td>


<!-- HEADER TEXT -->

<td
valign="middle"
style="
vertical-align:middle;
text-align:left;
">

<table
role="presentation"
cellspacing="0"
cellpadding="0"
border="0"
style="
height:34px;
">

<tr>

<td
valign="middle"
style="
height:34px;
vertical-align:middle;
">

<div
class="header-title"
style="
font-size:20px;
line-height:23px;
font-weight:800;
letter-spacing:.3px;
color:#ffffff;
margin:0;
padding:0;
">

${escapeHtml(company)}

</div>

<div
style="
font-size:10px;
line-height:13px;
color:#d1d5db;
margin-top:1px;
padding:0;
">

${escapeHtml(tag)}

</div>

</td>

</tr>

</table>

</td>

</tr>

</table>

</td>

</tr>


<!-- CONTENT -->

<tr>

<td
class="content-cell"
style="
padding:14px 12px;
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
class="main-title"
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
margin-top:11px;
border:1px solid #d8dce1;
border-radius:10px;
background:#ffffff;
overflow:hidden;
">

<tr>

<td
style="
padding:8px 10px;
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
width="22"
style="
width:22px;
padding-right:6px;
vertical-align:middle;
">

${icon("user")}

</td>

<td
style="
font-size:10px;
line-height:14px;
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


<!-- BLACK FOOTER -->

<tr>

<td
style="
padding:10px 12px 11px;
background:#111827;
text-align:center;
">

<div
style="
font-size:12px;
line-height:16px;
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
