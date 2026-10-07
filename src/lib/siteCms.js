import { resolveMediaUrl } from "./media";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const siteCmsConfigured = Boolean(url && anon);

const headers = () => ({
  apikey: anon || "",
  Authorization: `Bearer ${anon || ""}`,
  "Content-Type": "application/json"
});

async function request(path) {
  if (!siteCmsConfigured) return [];
  const response = await fetch(`${url}/rest/v1/${path}`, { headers: headers() });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

// A single optional CMS collection should never make the whole public site fall back.
// This keeps the site resilient while an Admin Panel is being configured.
async function safeRequest(path, fallback = []) {
  try {
    return await request(path);
  } catch (error) {
    console.warn(`BlueVows CMS collection unavailable: ${path}`, error);
    return fallback;
  }
}

const ordered = (rows = []) => [...rows].sort((a,b) => (a.display_order ?? 0) - (b.display_order ?? 0));

export async function loadSiteCms() {
  if (!siteCmsConfigured) return null;
  const tables = {
    settings: "site_settings?select=*&singleton_key=eq.default&status=eq.published&limit=1",
    hero: "hero_slides?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc",
    activities: "activities?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc",
    services: "services?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc",
    testimonials: "testimonials?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc",
    gallery: "gallery_items?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc",
    blog: "blog_posts?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,published_at.desc,created_at.desc",
    specialOffers: "special_offers?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,valid_until.asc,created_at.desc",
    partners: "partners?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc",
    navigation: "navigation_items?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc",
    footerSections: "footer_sections?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc",
    footerLinks: "footer_links?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc",
    faqs: "faqs?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc",
    blocks: "site_content_blocks?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc"
  };
  const entries = await Promise.all(Object.entries(tables).map(async ([key,path]) => [key, await safeRequest(path)]));
  const result = Object.fromEntries(entries);
  const blocks = {};
  (result.blocks || []).forEach(row => { blocks[row.content_key] = row.content || {}; });
  const mediaFields = {
    hero: ["image_url"],
    activities: ["image_url"],
    services: ["image_url"],
    testimonials: ["customer_image_url"],
    gallery: ["image_url"],
    blog: ["featured_image_url"],
    specialOffers: ["image_url"],
    partners: ["logo_url"]
  };
  Object.entries(mediaFields).forEach(([collection, fields]) => {
    result[collection] = (result[collection] || []).map(row => {
      const next = { ...row };
      fields.forEach(field => { if (next[field]) next[field] = resolveMediaUrl(next[field]); });
      return next;
    });
  });

  const rawSettings = result.settings?.[0] || null;
  const settings = rawSettings ? {
    ...rawSettings,
    website_name: rawSettings.website_name || rawSettings.site_name || "BlueVows Travel",
    contact_email: rawSettings.contact_email || rawSettings.email || "",
    phone: rawSettings.phone || "",
    whatsapp: rawSettings.whatsapp || "",
    website: rawSettings.website || "",
    address: rawSettings.address || "",
    tagline: rawSettings.tagline || "",
    logo_url: rawSettings.logo_url || "/bluevows-logo.png",
    favicon_url: rawSettings.favicon_url || "",
    seo_title: rawSettings.seo_title || rawSettings.site_name || "BlueVows Travel | Andaman Islands",
    seo_description: rawSettings.seo_description || rawSettings.tagline || "Plan your Andaman Islands journey with BlueVows Travel.",
    seo_keywords: rawSettings.seo_keywords || "Andaman travel, Andaman tours, Havelock, Neil Island, BlueVows Travel",
    social_links: rawSettings.social_links || {}
  } : null;
  return {
    settings,
    hero: ordered(result.hero),
    activities: ordered(result.activities),
    services: ordered(result.services),
    testimonials: ordered(result.testimonials),
    gallery: ordered(result.gallery),
    blog: ordered(result.blog),
    specialOffers: ordered(result.specialOffers),
    partners: ordered(result.partners),
    navigation: ordered(result.navigation),
    footerSections: ordered(result.footerSections),
    footerLinks: ordered(result.footerLinks),
    faqs: ordered(result.faqs),
    blocks
  };
}

export async function listPackageItinerary(packageId) {
  if (!siteCmsConfigured || !packageId) return [];
  return ordered(await request(`package_itineraries?select=*&package_id=eq.${encodeURIComponent(packageId)}&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc`));
}
