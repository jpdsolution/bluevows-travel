// Future Admin Panel data layer.
// This module intentionally contains no UI. The public site and a future Admin Panel
// can use the same repository methods and the same Supabase source of truth.
import { cmsConfigured, setCmsAccessToken } from "./destinationCms";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
let token = null;

export const CMS_COLLECTIONS = Object.freeze({
  settings: "site_settings",
  hero: "hero_slides",
  destinations: "destinations",
  places: "destination_places",
  experiences: "destination_experiences",
  packages: "packages",
  destinationPackages: "destination_packages",
  packageItineraries: "package_itineraries",
  activities: "activities",
  services: "services",
  hotels: "hotels",
  testimonials: "testimonials",
  gallery: "gallery_items",
  destinationGallery: "destination_gallery",
  blog: "blog_posts",
  offers: "special_offers",
  partners: "partners",
  navigation: "navigation_items",
  footerSections: "footer_sections",
  footerLinks: "footer_links",
  contentBlocks: "site_content_blocks",
  faqs: "faqs",
  tips: "destination_tips"
});

export function setAdminCmsToken(nextToken){ token=nextToken||null; setCmsAccessToken(token); }
export function clearAdminCmsToken(){ token=null; setCmsAccessToken(null); }

function headers(){return {apikey:anon||"",Authorization:`Bearer ${token||anon||""}`,"Content-Type":"application/json",Prefer:"return=representation"};}
async function request(path,options={}){
  if(!cmsConfigured) throw new Error("Supabase CMS is not configured");
  const res=await fetch(`${url}/rest/v1/${path}`,{...options,headers:{...headers(),...(options.headers||{})}});
  if(!res.ok) throw new Error(await res.text()||`CMS request failed (${res.status})`);
  return res.status===204?null:res.json();
}

export async function listCollection(collection,{includeArchived=false}={}){
  const table=CMS_COLLECTIONS[collection]||collection;
  const archived=includeArchived?"": "&archived_at=is.null";
  return request(`${table}?select=*&order=display_order.asc,created_at.asc${archived}`);
}
export async function getById(collection,id){const table=CMS_COLLECTIONS[collection]||collection;const rows=await request(`${table}?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);return rows?.[0]||null;}
export async function createRecord(collection,row){const table=CMS_COLLECTIONS[collection]||collection;const rows=await request(table,{method:"POST",body:JSON.stringify(row)});return rows?.[0]||null;}
export async function updateRecord(collection,id,row){const table=CMS_COLLECTIONS[collection]||collection;const rows=await request(`${table}?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",body:JSON.stringify(row)});return rows?.[0]||null;}
export async function upsertRecord(collection,row){return row?.id?updateRecord(collection,row.id,row):createRecord(collection,row);}

// Recoverable delete: records remain in the database and simply stop being public.
export async function archiveRecord(collection,id){return updateRecord(collection,id,{status:"hidden",archived_at:new Date().toISOString()});}
export async function restoreRecord(collection,id,status="published"){return updateRecord(collection,id,{status,archived_at:null});}
export async function setVisibility(collection,id,visible){return updateRecord(collection,id,{status:visible?"published":"hidden"});}
export async function reorderRecords(collection,orderedIds){return Promise.all(orderedIds.map((id,index)=>updateRecord(collection,id,{display_order:index})));}

export async function duplicateRecord(collection,id,overrides={}){
  const source=await getById(collection,id); if(!source) throw new Error("Record not found");
  const copy={...source,...overrides}; delete copy.id; delete copy.created_at; delete copy.updated_at;
  copy.status="draft"; copy.archived_at=null; copy.display_order=Number(source.display_order||0)+1;
  if("slug" in copy) copy.slug=`${source.slug}-copy-${Date.now().toString().slice(-5)}`;
  if("name" in copy) copy.name=`${source.name} Copy`;
  if("title" in copy && !("name" in copy)) copy.title=`${source.title} Copy`;
  return createRecord(collection,copy);
}

export async function upsertDestinationNested(collection,row,destinationId){
  return upsertRecord(collection,{...row,destination_id:destinationId});
}

export async function replaceMediaFile(file,{bucket="site-media",folder="site"}={}){
  if(!cmsConfigured) throw new Error("Supabase CMS is not configured");
  const safe=file.name.toLowerCase().replace(/[^a-z0-9._-]+/g,"-");
  const path=`${folder}/${Date.now()}-${safe}`;
  const res=await fetch(`${url}/storage/v1/object/${bucket}/${path}`,{method:"POST",headers:{apikey:anon||"",Authorization:`Bearer ${token||anon||""}`,"Content-Type":file.type||"application/octet-stream","x-upsert":"true"},body:file});
  if(!res.ok) throw new Error(await res.text());
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}
