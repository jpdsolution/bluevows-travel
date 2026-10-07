// BlueVows Content Blocks CMS data layer.
// UI is intentionally not included in V40. This module gives the public site
// and the future Admin Panel one consistent API for editable site sections.
import { cmsConfigured, setCmsAccessToken } from "./destinationCms";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
let accessToken = null;
const TABLE = "site_content_blocks";

export const CONTENT_BLOCK_KEYS = Object.freeze([
  "home.trust",
  "home.why",
  "home.cta",
  "home.video",
  "home.parallax",
  "home.route",
  "home.map",
  "home.counter",
  "footer",
  "footer.highlight"
]);

export function setContentBlocksAccessToken(token) {
  accessToken = token || null;
  setCmsAccessToken(accessToken);
}

const headers = () => ({
  apikey: anon || "",
  Authorization: `Bearer ${accessToken || anon || ""}`,
  "Content-Type": "application/json",
  Prefer: "return=representation"
});

async function request(path, options = {}) {
  if (!cmsConfigured) throw new Error("Supabase CMS is not configured");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: { ...headers(), ...(options.headers || {}) }
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `CMS request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function listContentBlocks({ includeArchived = true } = {}) {
  const archived = includeArchived ? "" : "&archived_at=is.null";
  return request(`${TABLE}?select=*&order=display_order.asc,created_at.asc${archived}`);
}

export async function listPublishedContentBlocks() {
  return request(`${TABLE}?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc`);
}

export async function getContentBlock(id) {
  const rows = await request(`${TABLE}?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
  return rows?.[0] || null;
}

export async function getContentBlockByKey(contentKey) {
  const rows = await request(`${TABLE}?select=*&content_key=eq.${encodeURIComponent(contentKey)}&limit=1`);
  return rows?.[0] || null;
}

export async function createContentBlock(row) {
  const body = {
    content_key: row.content_key,
    content: row.content || {},
    status: row.status || "draft",
    display_order: Number(row.display_order || 0),
    archived_at: row.archived_at || null
  };
  const rows = await request(TABLE, { method: "POST", body: JSON.stringify(body) });
  return rows?.[0] || null;
}

export async function updateContentBlock(id, row) {
  const body = { ...row };
  delete body.id;
  delete body.created_at;
  delete body.updated_at;
  const rows = await request(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body)
  });
  return rows?.[0] || null;
}

export async function upsertContentBlock(row) {
  if (row?.id) return updateContentBlock(row.id, row);
  const existing = row?.content_key ? await getContentBlockByKey(row.content_key) : null;
  if (existing) return updateContentBlock(existing.id, row);
  return createContentBlock(row);
}

export async function archiveContentBlock(id) {
  return updateContentBlock(id, {
    status: "hidden",
    archived_at: new Date().toISOString()
  });
}

export async function restoreContentBlock(id, status = "published") {
  return updateContentBlock(id, {
    status,
    archived_at: null
  });
}

export async function setContentBlockVisibility(id, visible) {
  return updateContentBlock(id, {
    status: visible ? "published" : "hidden",
    ...(visible ? { archived_at: null } : {})
  });
}

export async function reorderContentBlocks(orderedIds = []) {
  return Promise.all(
    orderedIds.map((id, index) => updateContentBlock(id, { display_order: index }))
  );
}

export async function duplicateContentBlock(id) {
  const source = await getContentBlock(id);
  if (!source) throw new Error("Content block not found");
  const copy = {
    content_key: `${source.content_key}-copy-${Date.now().toString().slice(-5)}`,
    content: structuredClone(source.content || {}),
    status: "draft",
    display_order: Number(source.display_order || 0) + 1,
    archived_at: null
  };
  return createContentBlock(copy);
}
