const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
let accessToken = null;
export function setCmsAccessToken(token) { accessToken = token || null; }
export const cmsConfigured = Boolean(url && anon);
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

export async function listDestinations() {
  return request("destinations?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc");
}
export async function listDestinationPlaces() {
  const [places, destinations] = await Promise.all([
    request("destination_places?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc"),
    listDestinations()
  ]);
  const byId = Object.fromEntries((destinations || []).map(d => [d.id, d]));
  return (places || []).map(place => ({
    ...place,
    destination: byId[place.destination_id] || null
  }));
}

export async function getDestinationBySlug(slug) {
  const rows = await request(`destinations?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published&archived_at=is.null&limit=1`);
  return rows?.[0] || null;
}
export async function getDestinationBundle(destinationId) {
  const q = encodeURIComponent(destinationId);
  const [places, experiences, faqs, gallery, tips, packages, contentBlocks] = await Promise.all([
    request(`destination_places?select=*&destination_id=eq.${q}&status=eq.published&archived_at=is.null&order=display_order.asc`),
    request(`destination_experiences?select=*&destination_id=eq.${q}&status=eq.published&archived_at=is.null&order=display_order.asc`),
    request(`destination_faqs?select=*&destination_id=eq.${q}&status=eq.published&archived_at=is.null&order=display_order.asc`),
    request(`destination_gallery?select=*&destination_id=eq.${q}&status=eq.published&archived_at=is.null&order=display_order.asc`),
    request(`destination_tips?select=*&destination_id=eq.${q}&status=eq.published&archived_at=is.null&order=display_order.asc`),
    request(`destination_packages?select=*,packages(*)&destination_id=eq.${q}&status=eq.published&archived_at=is.null&order=display_order.asc`),
    request(`destination_content_blocks?select=*&destination_id=eq.${q}&status=eq.published&archived_at=is.null&order=display_order.asc`)
  ]);
  return { places, experiences, faqs, gallery, tips, contentBlocks, packages: packages.map(x => x.packages || x).filter(Boolean) };
}
export async function adminListDestinations() {
  return request("destinations?select=*&order=display_order.asc,created_at.asc");
}
export async function upsertDestination(row) {
  const body = { ...row };
  const result = await request(`destinations${row.id ? `?id=eq.${encodeURIComponent(row.id)}` : ""}`, {
    method: row.id ? "PATCH" : "POST",
    body: JSON.stringify(body)
  });
  return result?.[0];
}
export async function deleteDestination(id) {
  return request(`destinations?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({status:"hidden",archived_at:new Date().toISOString()}) });
}
export async function duplicateDestination(id) {
  const rows = await request(`destinations?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
  const source = rows?.[0];
  if (!source) throw new Error("Destination not found");
  const copy = { ...source };
  delete copy.id; delete copy.created_at; delete copy.updated_at;
  copy.slug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`;
  copy.name = `${source.name} Copy`;
  copy.status = "draft";
  copy.display_order = Number(source.display_order || 0) + 1;
  const result = await request("destinations", { method: "POST", body: JSON.stringify(copy) });
  return result?.[0];
}
export async function listNested(table, destinationId) {
  return request(`${table}?select=*&destination_id=eq.${encodeURIComponent(destinationId)}&order=display_order.asc,created_at.asc`);
}
export async function upsertNested(table, row) {
  const path = row.id ? `${table}?id=eq.${encodeURIComponent(row.id)}` : table;
  const result = await request(path, { method: row.id ? "PATCH" : "POST", body: JSON.stringify(row) });
  return result?.[0];
}
export async function deleteNested(table, id) {
  return request(`${table}?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({status:"hidden",archived_at:new Date().toISOString()}) });
}

export async function authLogin(email, password) {
  if (!cmsConfigured) throw new Error("Supabase CMS is not configured");
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: anon, "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  setCmsAccessToken(data.access_token);
  return data;
}
export function authLogout() { setCmsAccessToken(null); }

export async function listPackages() { return request("packages?select=*&status=eq.published&archived_at=is.null&order=display_order.asc,created_at.asc"); }
export async function adminListPackages() { return request("packages?select=*&archived_at=is.null&order=display_order.asc,created_at.asc"); }
export async function upsertPackage(row) { const result=await request(`packages${row.id?`?id=eq.${encodeURIComponent(row.id)}`:""}`,{method:row.id?"PATCH":"POST",body:JSON.stringify(row)}); return result?.[0]; }
export async function deletePackage(id) { return request(`packages?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",body:JSON.stringify({status:"hidden",archived_at:new Date().toISOString()})}); }
export async function linkPackageToDestination(destinationId, packageId, displayOrder=0) { const result=await request("destination_packages",{method:"POST",body:JSON.stringify({destination_id:destinationId,package_id:packageId,status:"published",display_order:displayOrder})}); return result?.[0]; }
export async function listPackageLinks(packageId) { return request(`destination_packages?select=*&package_id=eq.${encodeURIComponent(packageId)}`); }
export async function unlinkPackageFromDestination(destinationId, packageId) { return request(`destination_packages?destination_id=eq.${encodeURIComponent(destinationId)}&package_id=eq.${encodeURIComponent(packageId)}`,{method:"DELETE"}); }

export async function uploadDestinationImage(file, token) {
  if (!cmsConfigured) throw new Error("Supabase CMS is not configured");
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const path = `destinations/${Date.now()}-${safeName}`;
  const response = await fetch(`${url}/storage/v1/object/destination-media/${path}`, {
    method: "POST",
    headers: { apikey: anon, Authorization: `Bearer ${token || anon}`, "Content-Type": file.type || "image/jpeg", "x-upsert": "true" },
    body: file
  });
  if (!response.ok) throw new Error(await response.text());
  return `${url}/storage/v1/object/public/destination-media/${path}`;
}
