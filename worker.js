// 1. PURANA icon() FUNCTION DELETE KARKE YE PASTE KARO

function icon(type, dark = false) {
  const stroke = dark ? "#ffffff" : "#111827";

  const icons = {

    user: `
<span style="
display:inline-block;
width:17px;
height:17px;
position:relative;
vertical-align:middle;
">
<span style="
position:absolute;
left:5px;
top:1px;
width:6px;
height:6px;
border:1.5px solid ${stroke};
border-radius:50%;
"></span>
<span style="
position:absolute;
left:2px;
bottom:0;
width:12px;
height:7px;
border:1.5px solid ${stroke};
border-bottom:0;
border-radius:8px 8px 0 0;
"></span>
</span>`,

    email: `
<span style="
display:inline-block;
width:17px;
height:13px;
border:1.5px solid ${stroke};
border-radius:3px;
position:relative;
vertical-align:middle;
">
<span style="
position:absolute;
left:2px;
top:2px;
width:9px;
height:9px;
border-left:1.5px solid ${stroke};
border-bottom:1.5px solid ${stroke};
transform:rotate(-45deg);
"></span>
</span>`,

    phone: `
<span style="
display:inline-block;
width:16px;
height:16px;
position:relative;
vertical-align:middle;
">
<span style="
position:absolute;
left:4px;
top:1px;
width:8px;
height:14px;
border:1.5px solid ${stroke};
border-radius:7px;
transform:rotate(-35deg);
"></span>
</span>`,

    calendar: `
<span style="
display:inline-block;
width:16px;
height:15px;
border:1.5px solid ${stroke};
border-radius:3px;
position:relative;
vertical-align:middle;
">
<span style="
position:absolute;
left:0;
right:0;
top:4px;
border-top:1.5px solid ${stroke};
"></span>
<span style="
position:absolute;
left:3px;
top:-3px;
width:1.5px;
height:5px;
background:${stroke};
"></span>
<span style="
position:absolute;
right:3px;
top:-3px;
width:1.5px;
height:5px;
background:${stroke};
"></span>
</span>`,

    users: `
<span style="
display:inline-block;
width:18px;
height:17px;
position:relative;
vertical-align:middle;
">
<span style="
position:absolute;
left:2px;
top:1px;
width:6px;
height:6px;
border:1.4px solid ${stroke};
border-radius:50%;
"></span>
<span style="
position:absolute;
left:0;
bottom:0;
width:10px;
height:7px;
border:1.4px solid ${stroke};
border-bottom:0;
border-radius:7px 7px 0 0;
"></span>
<span style="
position:absolute;
right:1px;
top:3px;
width:5px;
height:5px;
border:1.3px solid ${stroke};
border-radius:50%;
"></span>
<span style="
position:absolute;
right:0;
bottom:0;
width:7px;
height:5px;
border:1.3px solid ${stroke};
border-bottom:0;
border-radius:6px 6px 0 0;
"></span>
</span>`,

    location: `
<span style="
display:inline-block;
width:15px;
height:15px;
border:1.5px solid ${stroke};
border-radius:50% 50% 50% 0;
transform:rotate(-45deg);
position:relative;
vertical-align:middle;
">
<span style="
position:absolute;
left:4px;
top:4px;
width:4px;
height:4px;
border:1px solid ${stroke};
border-radius:50%;
"></span>
</span>`,

    package: `
<span style="
display:inline-block;
width:15px;
height:14px;
border:1.5px solid ${stroke};
border-radius:2px;
position:relative;
vertical-align:middle;
">
<span style="
position:absolute;
left:0;
right:0;
top:4px;
border-top:1.5px solid ${stroke};
"></span>
<span style="
position:absolute;
left:5px;
top:-4px;
width:5px;
height:4px;
border:1.5px solid ${stroke};
border-bottom:0;
"></span>
</span>`,

    id: `
<span style="
display:inline-block;
width:16px;
height:12px;
border:1.5px solid ${stroke};
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
border:1px solid ${stroke};
border-radius:50%;
"></span>
<span style="
position:absolute;
right:2px;
top:3px;
width:4px;
border-top:1px solid ${stroke};
box-shadow:0 3px 0 ${stroke};
"></span>
</span>`,

    clock: `
<span style="
display:inline-block;
width:15px;
height:15px;
border:1.5px solid ${stroke};
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
background:${stroke};
"></span>
<span style="
position:absolute;
left:6px;
top:7px;
width:4px;
height:1.5px;
background:${stroke};
"></span>
</span>`,

    message: `
<span style="
display:inline-block;
width:16px;
height:12px;
border:1.5px solid ${stroke};
border-radius:3px;
position:relative;
vertical-align:middle;
">
<span style="
position:absolute;
left:3px;
bottom:-4px;
width:5px;
height:5px;
border-left:1.5px solid ${stroke};
border-bottom:1.5px solid ${stroke};
transform:skewY(-30deg);
"></span>
</span>`,

    mail: `
<span style="
display:inline-block;
width:23px;
height:17px;
border:1.7px solid #ffffff;
border-radius:4px;
position:relative;
vertical-align:middle;
">
<span style="
position:absolute;
left:2px;
top:2px;
width:13px;
height:13px;
border-left:1.5px solid #ffffff;
border-bottom:1.5px solid #ffffff;
transform:rotate(-45deg);
"></span>
</span>`
  };

  return icons[type] || "";
}


// 2. buildHtml() FUNCTION PURA DELETE KARKE YE PASTE KARO

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
    enquiry.travel_date_value ||
    enquiry.date ||
    enquiry.checkIn ||
    enquiry.startDate,
    "—"
  );

  const packageName = textOr(
    enquiry.packageName ||
    enquiry.package_name ||
    enquiry.package ||
    enquiry.packageTitle ||
    enquiry.selectedPackage ||
    enquiry.package_name_value,
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
    !isNaN(adultNumber) && !isNaN(childNumber)
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

  .outer-pad{
    padding:3px!important;
  }

  .main-card{
    width:100%!important;
    max-width:none!important;
  }

  .content-pad{
    padding:12px 11px!important;
  }

  .title{
    font-size:19px!important;
    line-height:23px!important;
  }

  .header-title{
    font-size:18px!important;
    line-height:22px!important;
  }

}

</style>

</head>

<body>

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

<td
align="center"
class="outer-pad"
style="
padding:4px;
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
max-width:590px;
background:#ffffff;
border:2px solid #111827;
border-radius:15px;
overflow:hidden;
">

<!-- BLACK HEADER -->

<tr>

<td style="
padding:14px 14px;
background:#111827;
">

<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0">

<tr>

<!-- ICON -->

<td
width="42"
valign="middle"
style="
width:42px;
padding-right:9px;
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
height:34px;
vertical-align:middle;
">

${icon("mail", true)}

</td>

</tr>

</table>

</td>

<!-- HEADER TEXT -->

<td
valign="middle"
style="
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
vertical-align:middle;
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

<td
class="content-pad"
style="
padding:14px 14px;
background:#ffffff;
">

<table
role="presentation"
width="100%"
cellspacing="0"
cellpadding="0"
border="0">

<tr>

<td style="
font-size:9px;
line-height:12px;
font-weight:800;
letter-spacing:1.4px;
color:#6b7280;
">

WEBSITE ENQUIRY

</td>

</tr>

<tr>

<td
class="title"
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

<table
role="presentation"
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
background:#f5f6f8;
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

<td style="
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

<td style="
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

<td style="
padding:11px 14px 12px;
background:#111827;
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
