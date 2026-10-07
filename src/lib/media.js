const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";

/**
 * Central media helpers for BlueVows.
 * Supports normal URLs as well as Supabase Storage paths so future Admin
 * uploads can store only a bucket/path while the public site resolves it.
 */
export function resolveMediaUrl(value, options = {}) {
  if (!value) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  if (/^(https?:|data:|blob:|\/)/i.test(raw)) return raw;

  const bucket = options.bucket || "media";
  if (!SUPABASE_URL) return raw;
  return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(bucket)}/${raw.split("/").map(encodeURIComponent).join("/")}`;
}

export function getMediaUrl(value, options = {}) {
  return resolveMediaUrl(value, options);
}

export function getOptimizedImageUrl(value, options = {}) {
  const resolved = resolveMediaUrl(value, options);
  if (!resolved || !SUPABASE_URL || !resolved.startsWith(`${SUPABASE_URL}/storage/v1/object/public/`)) return resolved;
  if (options.optimize === false) return resolved;

  const marker = "/storage/v1/object/public/";
  const rest = resolved.split(marker)[1];
  const slash = rest.indexOf("/");
  if (slash < 0) return resolved;
  const bucket = rest.slice(0, slash);
  const path = rest.slice(slash + 1);
  const params = new URLSearchParams();
  if (options.width) params.set("width", String(options.width));
  if (options.height) params.set("height", String(options.height));
  if (options.quality) params.set("quality", String(options.quality));
  if (options.resize) params.set("resize", options.resize);
  if (!params.toString()) return resolved;
  return `${SUPABASE_URL}/storage/v1/render/image/public/${bucket}/${path}?${params.toString()}`;
}

export function mediaMeta(value, options = {}) {
  const url = resolveMediaUrl(value, options);
  return { source: value || "", url, isSupabaseStorage: Boolean(SUPABASE_URL && url.startsWith(`${SUPABASE_URL}/storage/v1/`)) };
}
