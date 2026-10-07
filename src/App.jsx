import React, { useState, useEffect, useRef } from "react";
import { Link, Route, Routes, useParams, useLocation, useNavigate } from "react-router-dom";
import { createContext, useContext, useMemo } from "react";
import { cmsConfigured, listDestinations, getDestinationBySlug, getDestinationBundle, listPackages } from "./lib/destinationCms";
import { siteCmsConfigured, loadSiteCms, listPackageItinerary } from "./lib/siteCms";
import {
  Menu, X, MapPin, CalendarDays, Users, ArrowRight, Star, ChevronDown,
  Instagram, Facebook, Youtube, PhoneCall, Ship, CheckCircle2, Phone, Mail,
  MessageCircle, ShieldCheck, Compass, Hotel, Waves, Send, Clock, Sun, Backpack,
  Info, CreditCard, Package
} from "lucide-react";

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

const DestinationCMSContext = createContext(null);
function DestinationProvider({children}){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{let alive=true;(async()=>{
    if(!cmsConfigured){ if(alive){setItems(defaultDestinations.map(normalizeDestination));setError("");setLoading(false)}; return; }
    try{
      const rows=await listDestinations();
      if(alive)setItems((rows?.length ? rows : defaultDestinations).map(normalizeDestination));
    }catch(e){
      if(alive){setItems(defaultDestinations.map(normalizeDestination));setError(e?.message||"Unable to load destinations.")}
    }
    finally{if(alive)setLoading(false)}
  })();return()=>{alive=false}},[]);
  const api=useMemo(()=>({items,loading,error,async refresh(){
    if(!cmsConfigured)return [];
    const rows=await listDestinations();
    const next=(rows||[]).map(normalizeDestination);
    setItems(next);
    return next;
  }}),[items,loading,error]);
  return <DestinationCMSContext.Provider value={api}>{children}</DestinationCMSContext.Provider>
}
function useDestinationCMS(){return useContext(DestinationCMSContext)}
function PackageProvider({children}){
 const [items,setItems]=useState([]);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{let alive=true;(async()=>{
   if(!cmsConfigured){if(alive){setItems(defaultPackages);setLoading(false)};return;}
   try{
     const rows=await listPackages();
     const enriched=await Promise.all((rows||[]).map(async p=>{
       let itinerary=[]; try{itinerary=await listPackageItinerary(p.id)}catch{}
       return {...p,days:p.duration,price:`₹${Number(p.starting_price||0).toLocaleString("en-IN")}`,actualPrice:p.actual_price?`₹${Number(p.actual_price).toLocaleString("en-IN")}`:"",image:p.image,tag:p.tag||"Recommended",itinerary};
     }));
     if(alive)setItems(enriched.length?enriched:defaultPackages);
   }catch{if(alive)setItems(defaultPackages)} finally{if(alive)setLoading(false)}
 })();return()=>{alive=false}},[]);
 const api=useMemo(()=>({items,loading}),[items,loading]);
 return <PackageCMSContext.Provider value={api}>{children}</PackageCMSContext.Provider>
}
const PackageCMSContext=createContext(null);
function usePackageCMS(){return useContext(PackageCMSContext)}

function normalizeDestination(d){return {...d,slug:d.slug||slugify(d.name),name:d.name||"Destination",text:d.short_description||d.text||"",shortDescription:d.short_description||d.shortDescription||d.text||"",longDescription:d.long_description||d.longDescription||d.text||"",image:d.hero_image||d.heroImage||d.image||d.featured_image||d.featuredImage||"",heroImage:d.hero_image||d.heroImage||d.image||"",featuredImage:d.featured_image||d.featuredImage||d.image||"",displayOrder:d.display_order??d.displayOrder??0,startingPrice:d.starting_price??d.startingPrice,status:d.status||"published"}}
const defaultDestinations = [
  {id:"default-d1",slug:"havelock-island",name:"Havelock Island",text:"White-sand beaches, clear water and unforgettable island experiences.",image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=100"},
  {id:"default-d2",slug:"neil-island",name:"Neil Island",text:"Quiet beaches, coral reefs and a slower island escape.",image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2400&q=100"},
  {id:"default-d3",slug:"port-blair",name:"Port Blair",text:"Your gateway to the islands, history and coastal experiences.",image:"https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2400&q=100"}
];
const defaultPartnerMarks = ["ISLAND STAYS","OCEAN EXPERIENCES","TRAVEL PARTNER","ANDAMAN HOSTS","DISCOVER INDIA","ISLAND ADVENTURES","TRAVEL PARTNER","OCEAN EXPERIENCES"];
const defaultHeroSlides = [
  {image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=100", title:"Experience the", accent:"Andaman"},
  {image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2400&q=100", title:"Dive into", accent:"Island Life"},
  {image:"https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2400&q=100", title:"Escape to", accent:"Paradise"}
];

const defaultPackages = [
  {id:"default-p1",slug:"andaman-escape",name:"Andaman Escape",duration:"5 Nights / 6 Days",days:"5 Nights / 6 Days",description:"A balanced first-time island itinerary.",image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=100",starting_price:35000,price:"₹35,000",actualPrice:"₹41,000",tag:"Popular",highlights:["Port Blair","Havelock","Neil Island"]},
  {id:"default-p2",slug:"island-discovery",name:"Island Discovery",duration:"4 Nights / 5 Days",days:"4 Nights / 5 Days",description:"A compact island-hopping holiday.",image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2400&q=100",starting_price:29500,price:"₹29,500",actualPrice:"₹35,000",tag:"Best Seller",highlights:["North Bay","Havelock","Water activities"]},
  {id:"default-p3",slug:"honeymoon-islands",name:"Honeymoon Islands",duration:"6 Nights / 7 Days",days:"6 Nights / 7 Days",description:"A relaxed romantic Andaman journey.",image:"https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2400&q=100",starting_price:46000,price:"₹46,000",actualPrice:"₹54,000",tag:"Couples",highlights:["Havelock","Neil Island","Couple experiences"]}
];

const packageItineraries = {
  "Andaman Escape": [
    ["Day 1","Arrival in Port Blair","Airport pickup, hotel check-in and a relaxed coastal evening."],
    ["Day 2","Port Blair & Cellular Jail","Explore local history and enjoy the evening light & sound experience."],
    ["Day 3","Havelock Island","Ferry transfer, hotel check-in and sunset at Radhanagar Beach."],
    ["Day 4","Island Adventure","Choose scuba, sea walk or a relaxed beach day."],
    ["Day 5","Neil Island","Ferry transfer, natural bridge and island sightseeing."],
    ["Day 6","Departure","Breakfast, transfer and departure assistance."]
  ],
  "Island Discovery": [
    ["Day 1","Port Blair Arrival","Airport transfer, check-in and free evening."],
    ["Day 2","North Bay & Ross Island","Boat excursion and island exploration."],
    ["Day 3","Havelock","Ferry transfer and beach time."],
    ["Day 4","Havelock Experience","Water activity or leisure day."],
    ["Day 5","Departure","Return transfer and onward journey."]
  ],
  "Honeymoon Islands": [
    ["Day 1","Romantic Arrival","Private transfer, hotel check-in and couple time."],
    ["Day 2","Port Blair","Relaxed sightseeing and sunset together."],
    ["Day 3","Havelock","Ferry transfer and Radhanagar Beach."],
    ["Day 4","Couple Experience","Scuba, sea walk or a private island experience."],
    ["Day 5","Leisure Day","Slow morning, beach time and optional dinner setup."],
    ["Day 6","Neil Island","Natural Bridge and peaceful island escape."],
    ["Day 7","Departure","Breakfast and airport/jetty transfer."]
  ]
};


const defaultActivities = [
  {name:"Scuba Diving", icon:Waves, text:"Discover vibrant coral reefs and marine life.", price:"From ₹3,500", duration:"2–3 hours", image:"https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=2400&q=100", details:"Guided beginner-friendly dive with equipment, instructor support and reef exploration.", inclusions:["Professional instructor", "Dive equipment", "Reef exploration"], exclusions:["Personal expenses", "Transfers unless selected"], location:"Havelock Island"},
  {name:"Sea Walk", icon:Compass, text:"Walk beneath the sea and experience the reef.", price:"From ₹3,000", duration:"1–2 hours", image:"https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=2400&q=100", details:"Helmeted underwater walk with trained guides and a close-up view of colourful marine life.", inclusions:["Safety briefing", "Helmet and equipment", "Professional guide"], exclusions:["Personal expenses", "Transfers unless selected"], location:"North Bay / Havelock"},
  {name:"Island Transfers", icon:MapPin, text:"Comfortable transfers planned around your itinerary.", price:"From ₹1,500", duration:"As per itinerary", image:"https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=2400&q=100", details:"Comfortable point-to-point transfers arranged around ferry, hotel and sightseeing timings.", inclusions:["Point-to-point transfer", "Trip coordination"], exclusions:["Ferry tickets unless selected", "Personal expenses"], location:"Port Blair · Havelock · Neil Island"},
  {name:"Kayaking", icon:Waves, text:"Explore calm tropical waters at your own pace.", price:"From ₹1,800", duration:"1–2 hours", image:"https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=2400&q=100", details:"A relaxed guided paddle through calm tropical waters, subject to weather and sea conditions.", inclusions:["Kayak and safety gear", "Guide", "Basic safety briefing"], exclusions:["Transfers", "Personal expenses"], location:"Havelock Island"}
];

const defaultServices = [
  {id:"default-s1",name:"Hotel & Resort Booking",slug:"hotel-resort-booking",icon:"Hotel",description:"Handpicked stays in the islands, matched to your route, budget and travel style.",features:["Curated stays","Location guidance","Easy booking support"]},
  {id:"default-s2",name:"Ferry & Island Transfers",slug:"ferry-island-transfers",icon:"Ship",description:"Ferry planning and local transfers coordinated around your complete island itinerary.",features:["Ferry guidance","Local transfers","Timing coordination"]},
  {id:"default-s3",name:"Activities & Experiences",slug:"activities-experiences",icon:"Waves",description:"Book trusted island experiences such as scuba diving, sea walks and kayaking.",features:["Verified experiences","Local support","Flexible options"]},
  {id:"default-s4",name:"Custom Trip Planning",slug:"custom-trip-planning",icon:"Compass",description:"A personalised Andaman plan built around your dates, interests and preferred pace.",features:["Custom itinerary","Clear quotation","Human support"]}
];

const defaultSiteContent = {
  settings:{website_name:"BlueVows",logo_url:"/bluevows-logo.png",contact_email:"hello@example.com",phone:"+91 XXXXX XXXXX",whatsapp:"",address:"Port Blair, Andaman & Nicobar Islands, India",social_links:{instagram:"https://www.instagram.com/",facebook:"https://www.facebook.com/",x:"https://x.com/",youtube:"https://www.youtube.com/",whatsapp:"https://wa.me/"}},
  hero:defaultHeroSlides.map((x,i)=>({id:`default-${i}`,badge:"YOUR ISLAND JOURNEY STARTS HERE",heading:x.title,accent:x.accent,description:"Beautiful islands, handpicked stays and experiences planned around the way you want to travel.",image_url:x.image,primary_cta_label:"Explore Packages",primary_cta_link:"/packages",secondary_cta_label:"Make Your Trip Memorable",secondary_cta_link:"/experiences",display_order:i})),
  activities:defaultActivities.map((x,i)=>({id:`default-${i}`,slug:slugify(x.name),name:x.name,icon:x.icon,description:x.text,details:x.details,price:x.price,duration:x.duration,image:x.image,inclusions:x.inclusions,exclusions:x.exclusions,location:x.location,cta_label:"View details",display_order:i})),
  services:defaultServices,
  testimonials:[{id:"default-r1",guest_name:"Priya S.",title:"A wonderful trip",review:"Everything was well planned and the communication was easy from start to finish.",rating:5,photo_url:"https://i.pravatar.cc/120?img=47",display_order:0},{id:"default-r2",guest_name:"Rahul M.",title:"Smooth and comfortable",review:"The itinerary was flexible and the hotel choices were exactly what we wanted.",rating:5,photo_url:"https://i.pravatar.cc/120?img=12",display_order:1},{id:"default-r3",guest_name:"Neha K.",title:"Highly recommended",review:"Great support, clear quotation and a memorable island experience.",rating:5,photo_url:"https://i.pravatar.cc/120?img=32",display_order:2}],
  partners:defaultPartnerMarks.map((name,i)=>({id:`default-p${i}`,name,display_order:i})),
  navigation:[["/","Home"],["/destinations","Destinations"],["/packages","Packages"],["/hotels","Hotels"],["/activities","Activities"],["/about","About"]].map(([link,title],i)=>({id:`default-n${i}`,title,link,display_order:i})),
  blocks:{
    "home.trust":{items:[{title:"Local Island Experts",text:"Real Andaman knowledge",icon:"ShieldCheck"},{title:"Handpicked Stays",text:"Comfort & value checked",icon:"Hotel"},{title:"Clear Quotations",text:"No confusing pricing",icon:"CreditCard"},{title:"Human Support",text:"Help before your trip",icon:"MessageCircle"}]},
    "home.why":{eyebrow:"WHY TRAVEL WITH US",title:"Local knowledge. Thoughtful planning.",description:"From your first enquiry to the day you return home, we keep your island journey clear, comfortable and personal.",items:[{title:"Local expertise",text:"Practical advice from people who know the islands.",icon:"CheckCircle2"},{title:"Handpicked stays",text:"Hotels selected for location, comfort and value.",icon:"CheckCircle2"},{title:"Easy quotations",text:"Clear pricing with a simple advance-payment QR.",icon:"CheckCircle2"},{title:"Human support",text:"Real help before and during your trip.",icon:"CheckCircle2"}]},
    "home.cta":{eyebrow:"READY TO GO?",title:"Let's plan your island escape.",description:"Tell us your dates and what you want to experience. We'll help shape the trip.",button:"Get a Free Quotation",link:"/contact"},
    "home.video":{eyebrow:"SEE THE ISLANDS",title:"Watch Andaman before you go",description:"Get a real look at the islands, beaches and experiences that can be part of your BlueVows journey.",video_url:"https://www.youtube.com/embed/oXPJxnVqJ6w?rel=0",subscribe_url:"https://www.youtube.com/@NomadicSoulmates?sub_confirmation=1"},
    "home.parallax":{eyebrow:"THE ANDAMAN FEELING",title:"Sea breeze. Island time. Memories that stay.",description:"Let the water, beaches and open skies become part of your journey.",button:"Explore the islands",link:"/destinations"},
    "home.route":{eyebrow:"YOUR ISLAND ROUTE",title:"Fly in. Island hop. Explore.",description:"A simple visual route from Port Blair to the islands you can discover with BlueVows.",port_blair:"Port Blair",havelock:"Havelock",neil:"Neil Island"},
    "home.map":{eyebrow:"ISLAND GUIDE",title:"Explore the islands on the map",description:"Tap an island to highlight it. The map animation cycles automatically too.",islands:[["Port Blair","Gateway to Andaman",18,68],["Havelock","Beaches & adventures",54,39],["Neil Island","Peaceful island escape",70,68]]},
    "home.counter":{items:[[500,"Happy Guests","guests"],[50,"Tour Packages","packages"],[10,"Years Experience","years"]]},
    "footer":{description:"Thoughtfully planned island holidays in the Andaman Islands.",phone:"+91 XXXXX XXXXX",email:"hello@example.com",address:"Port Blair, Andaman & Nicobar Islands, India",copyright:"© 2026 BlueVows. All rights reserved.",tagline:"Made for island journeys."},
    "footer.highlight":{eyebrow:"LET'S PLAN",title:"Your island escape starts with one message.",description:"Share your dates and we'll prepare a clear quotation for you."}
  }
};
const SiteCMSContext=createContext(null);
function SiteProvider({children}){
  const [content,setContent]=useState(defaultSiteContent);
  const [loading,setLoading]=useState(siteCmsConfigured);
  useEffect(()=>{let alive=true;(async()=>{
    if(!siteCmsConfigured){setLoading(false);return;}
    try{const remote=await loadSiteCms();if(!alive||!remote)return;setContent({...defaultSiteContent,...remote,settings:remote.settings||defaultSiteContent.settings,hero:remote.hero?.length?remote.hero:defaultSiteContent.hero,activities:remote.activities?.length?remote.activities:defaultSiteContent.activities,testimonials:remote.testimonials?.length?remote.testimonials:defaultSiteContent.testimonials,partners:remote.partners?.length?remote.partners:defaultSiteContent.partners,navigation:remote.navigation?.length?remote.navigation:defaultSiteContent.navigation,services:remote.services?.length?remote.services:defaultSiteContent.services,blocks:{...defaultSiteContent.blocks,...(remote.blocks||{})}})}catch(err){console.warn("BlueVows CMS content load failed; using fallback content.",err)}finally{if(alive)setLoading(false)}})();return()=>{alive=false}},[]);
  return <SiteCMSContext.Provider value={{...content,loading}}>{children}</SiteCMSContext.Provider>;
}
function useSiteCMS(){return useContext(SiteCMSContext)}

function SeoMeta({title,description,image}){useEffect(()=>{const fallback="BlueVows | Andaman Travel";document.title=title||fallback;const setMeta=(name,content)=>{if(!content)return;let el=document.querySelector(`meta[name="${name}"]`);if(!el){el=document.createElement("meta");el.setAttribute("name",name);document.head.appendChild(el)}el.setAttribute("content",content)};const setOg=(property,content)=>{if(!content)return;let el=document.querySelector(`meta[property="${property}"]`);if(!el){el=document.createElement("meta");el.setAttribute("property",property);document.head.appendChild(el)}el.setAttribute("content",content)};setMeta("description",description);setOg("og:title",title);setOg("og:description",description);setOg("og:image",image)},[title,description,image]);return null}

function ScrollToTop(){
  const {pathname}=useLocation();
  useEffect(()=>{window.scrollTo({top:0,left:0,behavior:"auto"});},[pathname]);
  return null;
}
function Header(){
  const [open,setOpen]=useState(false); const location=useLocation(); const site=useSiteCMS();
  const navItems=site.navigation||defaultSiteContent.navigation;
  const topItems=navItems.filter(x=>!x.parent_id); const childrenFor=id=>navItems.filter(x=>x.parent_id===id);
  return <header className="header"><div className="container nav"><Link className="brand" to="/" onClick={()=>setOpen(false)}><img className="brand-logo" src={site.settings?.logo_url||"/bluevows-logo.png"} alt={site.settings?.website_name||"BlueVows"}/></Link><button className="menu-btn" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button><nav className={open?"nav-links open":"nav-links"}>
    {topItems.map(item=>{const children=childrenFor(item.id);return children.length?<div className="nav-dropdown" key={item.id||item.title}><Link className={location.pathname===item.link?"active":""} to={item.link||"#"} onClick={()=>setOpen(false)}>{item.title}<ChevronDown size={13}/></Link><div className="nav-dropdown-menu">{children.map(child=><Link key={child.id||child.title} to={child.link||"#"} onClick={()=>setOpen(false)}>{child.title}</Link>)}</div></div>:<Link className={location.pathname===item.link?"active":""} to={item.link||"/"} onClick={()=>setOpen(false)} key={item.id||item.title}>{item.title}</Link>})}
    <Link className="nav-cta" to="/contact" onClick={()=>setOpen(false)}>Plan My Trip <ArrowRight size={15}/></Link>
  </nav></div></header>
}
function Hero(){
  const site=useSiteCMS();
  const slides=site.hero?.length?site.hero:defaultSiteContent.hero;
  const [slide,setSlide]=useState(0);
  const [destination,setDestination]=useState("Andaman");
  const [date,setDate]=useState("");
  const [travellers,setTravellers]=useState(2);
  useEffect(()=>{if(slide>=slides.length)setSlide(0)},[slides.length,slide]);
  useEffect(()=>{const t=setInterval(()=>setSlide(s=>(s+1)%Math.max(slides.length,1)),6000);return()=>clearInterval(t)},[slides.length]);
  const search=()=>{const params=new URLSearchParams({destination,date:date||"flexible",travellers:String(travellers)});window.location.href=`/packages?${params.toString()}`;};
  const s=slides[slide]||defaultSiteContent.hero[0];
  return <section className="hero">
    {slides.map((x,i)=><div key={x.id||x.image_url||i} className={`hero-slide ${i===slide?"active":""}`} style={{backgroundImage:`url(${x.image_url||x.image||""})`}}/>)}
    <div className="hero-overlay"></div>
    <div className="container hero-content">
      <span className="eyebrow light">{s.badge||"YOUR ISLAND JOURNEY STARTS HERE"}</span>
      <h1>{s.heading||s.title} <em>{s.accent}</em></h1>
      <p>{s.description||"Beautiful islands, handpicked stays and experiences planned around the way you want to travel."}</p>
      <div className="hero-actions">
        <Link className="btn primary" to={s.primary_cta_link||"/packages"}>{s.primary_cta_label||"Explore Packages"} <ArrowRight size={18}/></Link>
        <Link className="btn ghost" to={s.secondary_cta_link||"/experiences"}>{s.secondary_cta_label||"Make Your Trip Memorable"}</Link>
      </div>
      <div className="hero-dots">{slides.map((_,i)=><button key={i} className={i===slide?"active":""} onClick={()=>setSlide(i)} aria-label={`Slide ${i+1}`}></button>)}</div>
    </div>
    <div className="container planner-wrap">
      <div className="planner" aria-label="Trip planner">
        <label className="field planner-field"><MapPin/><div><small>Destination</small><select value={destination} onChange={e=>setDestination(e.target.value)}><option>Andaman</option><option>Havelock Island</option><option>Neil Island</option><option>Port Blair</option></select></div><ChevronDown className="field-chevron"/></label>
        <label className="field planner-field"><CalendarDays/><div><small>Travel Date</small><input type="date" value={date} onChange={e=>setDate(e.target.value)} aria-label="Travel date"/></div></label>
        <label className="field planner-field"><Users/><div><small>Travellers</small><select value={travellers} onChange={e=>setTravellers(Number(e.target.value))}>{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} {n===1?"Traveller":"Travellers"}</option>)}</select></div><ChevronDown className="field-chevron"/></label>
        <button className="planner-btn" onClick={search}>Search Packages <ArrowRight size={16}/></button>
      </div>
    </div>
  </section>
}
function DestinationCard({d}){ return <Link className="destination-card" to={`/destinations/${slugify(d.name)}`}>
  <img src={d.image} alt={d.name}/><div className="destination-shade"></div>
  <div className="destination-info"><span>Explore</span><h3>{d.name}</h3><p>{d.text}</p><span className="destination-link">View destination <ArrowRight size={14}/></span></div>
</Link>}

function PackageCard({p}){
 return <Link className="package-card package-link" to={`/packages/${slugify(p.name)}`}>
  <div className="package-image"><img src={p.image} alt={p.name}/><span>{p.tag}</span><div className="package-hover"><span>View itinerary</span><ArrowRight size={15}/></div></div>
  <div className="package-body"><div className="package-days">{p.days}</div><h3>{p.name}</h3><div className="package-reveal"><span>✓ Flexible itinerary</span><span>✓ Easy customisation</span></div><div className="package-bottom"><div><small>Special offer</small><div className="package-prices"><strong>{p.price}</strong><span className="offer-label">Offer rate</span><del>{p.actualPrice}</del><span className="actual-label">Actual rate</span></div></div><span className="icon-btn" aria-hidden="true"><ArrowRight/></span></div></div>
 </Link>
}
function ServiceCard({service}){
 const Icon=iconFor(service.icon);
 return <article className="service-card">
   <div className="service-icon"><Icon/></div>
   <h3>{service.name}</h3>
   <p>{service.description||service.text}</p>
   {Array.isArray(service.features)&&service.features.length>0&&<ul>{service.features.slice(0,3).map((item,i)=><li key={i}><CheckCircle2 size={14}/>{item}</li>)}</ul>}
   <Link className="mini-link" to="/services">Learn more <ArrowRight size={14}/></Link>
 </article>
}

function PartnerMarquee(){
 const site=useSiteCMS();
 const marks=(site.partners?.length?site.partners:defaultSiteContent.partners);
 return <section className="partner-marquee" aria-label="Travel partners">
   <div className="container"><div className="partner-heading"><span className="eyebrow">OUR NETWORK</span><h3>Travel made easier with trusted local partners</h3></div></div>
   <div className="marquee-window"><div className="marquee-track">
     {[...marks,...marks].map((partner,i)=><div className="partner-logo-pill" key={`${partner.id||partner.name}-${i}`}><span className="partner-dot"></span>{partner.name}</div>)}
   </div></div>
 </section>
}

function PackageDetail(){
 const {slug}=useParams(); const packageCms=usePackageCMS();
 const availablePackages=packageCms.items.length?packageCms.items:defaultPackages; const p=availablePackages.find(x=>slugify(x.name)===slug)||availablePackages[0];
 const itinerary=(p.itinerary||[]).map(x=>[x.day_label,x.title,x.description]);
 const site=useSiteCMS();
 const seoTitle=p.seo_title||p.name; const seoDescription=p.seo_description||p.description;
 const fallbackItinerary=packageItineraries[p.name]||[];
 const itineraryRows=itinerary.length?itinerary:fallbackItinerary;
 return <main className="package-detail page"><SeoMeta title={seoTitle} description={seoDescription} image={p.og_image_url||p.image}/>
   <section className="detail-hero package-detail-hero" style={{backgroundImage:`url(${p.image})`}}>
    <div className="detail-overlay"></div><div className="container detail-content">
      <span className="eyebrow light">{p.tag.toUpperCase()} · {p.days}</span><h1>{p.name}</h1><p>A thoughtfully paced Andaman itinerary with stays, transfers and experiences planned around your trip.</p>
      <div className="detail-actions"><Link className="btn primary" to="/contact">Get a Free Quotation <ArrowRight size={17}/></Link><Link className="btn ghost" to="/packages">All packages</Link></div>
    </div>
   </section>
   <section className="section"><div className="container">
    <div className="itinerary-head"><div><span className="eyebrow">DAY BY DAY</span><h2>More itinerary details</h2><p className="page-lead">A clear starting plan that can be customised after your enquiry.</p></div><div className="price-chip"><small>Starting from</small><b>{p.price}</b></div></div>
    <div className="itinerary-list">{itineraryRows.map(([day,title,desc])=><div className="itinerary-item" key={day}><div className="itinerary-day">{day}</div><div><h3>{title}</h3><p>{desc}</p></div><CheckCircle2/></div>)}</div>
    <div className="center detail-bottom-cta"><Link className="btn primary" to="/contact">Customise This Itinerary <ArrowRight size={17}/></Link></div>
   </div></section>
 </main>
}

function Experiences(){
 const site=useSiteCMS(); const activities=site.activities||[];
 return <main className="page experiences-page">
  <div className="container">
   <span className="eyebrow">ISLAND EXPERIENCES</span><h1 className="page-title">Make your trip memorable</h1>
   <p className="page-lead">Choose experiences and build an island holiday that feels personal, not packaged.</p>
   <div className="experience-grid">{activities.map(a=>{const Icon=iconFor(a.icon);return <Link className="experience-card" to={`/activities/${a.slug||slugify(a.name)}`} key={a.id||a.slug||a.name}><div className="activity-icon"><Icon/></div><h3>{a.name}</h3><p>{a.description||a.text}</p>{a.price&&<b className="activity-price">{a.price}</b>}<span>{a.cta_label||"View details"} <ArrowRight size={15}/></span></Link>})}</div>
   <section className="video-section">
    <div><span className="eyebrow">SEE THE ISLANDS</span><h2>Get inspired before you go</h2><p>Watch a real Andaman travel guide and start planning your own route.</p><div className="video-actions"><a className="btn youtube-subscribe" href={(site.blocks?.["home.video"]?.subscribe_url)||"https://www.youtube.com/@NomadicSoulmates?sub_confirmation=1"} target="_blank" rel="noreferrer"><Youtube size={17}/> Subscribe</a></div></div>
    <div className="video-frame"><iframe src={(site.blocks?.["home.video"]?.video_url)||"https://www.youtube.com/embed/oXPJxnVqJ6w?rel=0"} title="Andaman and Nicobar Tourism video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div>
   </section>
  </div>
 </main>
}
function iconFor(name){
  const map={MapPin,CalendarDays,Users,Ship,Waves,Compass,CheckCircle2,MessageCircle,Phone,Mail,Clock:CalendarDays,Info:CheckCircle2,Backpack:Package,Sun:Star};
  return map[name]||Compass;
}
function useDestinationDetail(slug){
  const cms=useDestinationCMS();
  const [destination,setDestination]=useState(null);
  const [bundle,setBundle]=useState(null);
  const [busy,setBusy]=useState(true);
  useEffect(()=>{let alive=true;(async()=>{
    setBusy(true);
    try{
      const remote=await getDestinationBySlug(slug);
      if(remote&&alive){
        const d=normalizeDestination(remote);
        setDestination(d);
        setBundle(await getDestinationBundle(remote.id));
      }else if(alive){
        setDestination(null);setBundle(null);
      }
    }catch{
      if(alive){
        const local=cms.items.find(x=>x.slug===slug);
        setDestination(local||null);
        if(local){try{setBundle(await getDestinationBundle(local.id))}catch{setBundle(null)}}
      }
    }finally{if(alive)setBusy(false)}
  })();return()=>{alive=false}},[slug,cms.items]);
  return {destination,bundle,busy};
}
function DestinationGallery({images=[]}){
  const [active,setActive]=useState(0); const [lightbox,setLightbox]=useState(false); const [touchStart,setTouchStart]=useState(null);
  const clean=images.filter(x=>x?.image); if(!clean.length)return null;
  const move=dir=>setActive(i=>(i+dir+clean.length)%clean.length);
  const swipe=e=>{if(touchStart===null)return;const dx=e.changedTouches[0].clientX-touchStart;if(Math.abs(dx)>45)move(dx<0?1:-1);setTouchStart(null)};
  return <div className="destination-gallery"><div className="gallery-main" onClick={()=>setLightbox(true)} onTouchStart={e=>setTouchStart(e.touches[0].clientX)} onTouchEnd={swipe}><img src={clean[active]?.image} alt={clean[active]?.caption||"Destination"}/><button className="gallery-expand" aria-label="Open full screen gallery">View</button></div><div className="gallery-thumbs">{clean.map((g,i)=><button key={g.id||i} className={active===i?"active":""} onClick={()=>setActive(i)}><img src={g.image} alt={g.caption||"Gallery"}/></button>)}</div>{lightbox&&<div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={()=>setLightbox(false)} onTouchStart={e=>setTouchStart(e.touches[0].clientX)} onTouchEnd={swipe}><button className="gallery-close" onClick={()=>setLightbox(false)} aria-label="Close gallery">×</button><button className="gallery-prev" onClick={e=>{e.stopPropagation();move(-1)}} aria-label="Previous image">‹</button><img src={clean[active]?.image} alt={clean[active]?.caption||"Destination"} onClick={e=>e.stopPropagation()}/><button className="gallery-next" onClick={e=>{e.stopPropagation();move(1)}} aria-label="Next image">›</button></div>}</div>
}

function DestinationDetail(){
 const {slug}=useParams(); const {destination:d,bundle,busy}=useDestinationDetail(slug);
 if(busy&&!d)return <main className="page"><div className="container narrow"><p className="page-lead">Loading destination…</p></div></main>;
 if(!d)return <SimplePage title="Destination not found" eyebrow="BLUEVOWS"><p className="page-lead">This destination is not currently published.</p><Link className="btn primary" to="/destinations">Explore destinations</Link></SimplePage>;
 const data=bundle||{places:[],experiences:[],faqs:[],gallery:[],tips:[],packages:[],contentBlocks:[]};
 const blocks=Object.fromEntries((data.contentBlocks||[]).map(x=>[x.content_key,x.content||{}]));
 const recommendedPackages=data.packages||[];
 const places=data.places||[], experiences=data.experiences||[], tips=data.tips||[], faqs=data.faqs||[], gallery=data.gallery?.length?data.gallery:[{id:"hero",image:d.featuredImage||d.image,caption:d.name}];
 const heroBlock=blocks.hero||{}; const seoTitle=d.seo_title||d.name; const seoDescription=d.seo_description||d.shortDescription||d.text; const aboutBlock=blocks.about||{}; const placesBlock=blocks.places||{}; const experiencesBlock=blocks.experiences||{}; const packagesBlock=blocks.packages||{}; const reachBlock=blocks.reach||{}; const tipsBlock=blocks.tips||{}; const galleryBlock=blocks.gallery||{}; const faqBlock=blocks.faq||{}; const finalBlock=blocks.final_cta||{};
 return <main className="destination-detail destination-cms-page"><SeoMeta title={seoTitle} description={seoDescription} image={d.og_image_url||d.featuredImage||d.image}/>
   <section className="detail-hero destination-cinematic" style={{backgroundImage:`url(${d.heroImage||d.image})`}}><div className="detail-overlay"></div><div className="container detail-content"><span className="eyebrow light">{heroBlock.eyebrow||"DESTINATION GUIDE"}</span><h1>{d.name}</h1><h2>{d.tagline}</h2><p>{d.shortDescription||d.text}</p><div className="detail-actions"><Link className="btn primary" to={`/packages?destination=${encodeURIComponent(d.slug)}`}>{heroBlock.primary_cta||"Explore Packages"} <ArrowRight size={17}/></Link><Link className="btn ghost" to="/contact">{heroBlock.secondary_cta||"Send Inquiry"}</Link></div></div></section>
   <section className="section destination-quick"><div className="container"><div className="destination-quick-grid">
    {[[MapPin,"Location",d.location],[CalendarDays,"Best Time to Visit",d.bestTime],[ClockIcon,"Recommended Stay",d.recommendedStay],[Waves,"Main Experiences",d.mainExperiences],[CreditCard,"Starting Package Price",d.startingPrice?`From ₹${Number(d.startingPrice).toLocaleString("en-IN")}`:"On request"],[Ship,"How to Reach",d.howToReach]].map(([Icon,label,value],i)=><div className="destination-info-card" key={label}><Icon/><small>{label}</small><b>{value||"—"}</b></div>)}
   </div></div></section>
   <section className="section"><div className="container destination-about-grid"><div><span className="eyebrow">{aboutBlock.eyebrow||`ABOUT ${d.name.toUpperCase()}`}</span><h2>{aboutBlock.heading_prefix||"Discover"} {d.name}</h2><p className="page-lead">{d.longDescription||d.shortDescription}</p>{d.longDescription&&<p>{d.longDescription}</p>}</div>{d.featuredImage&&<img className="destination-featured-image" src={d.featuredImage} alt={d.name}/>}</div></section>
   {places.length>0&&<section className="section soft"><div className="container"><SectionHead eyebrow={placesBlock.eyebrow||"TOP PLACES TO VISIT"} title={`${placesBlock.heading||"Places to explore"} in ${d.name}`} text={placesBlock.description||"Handpicked places you can add to your itinerary."}/><div className="destination-place-grid">{places.map(p=><article className="destination-place-card" key={p.id}><div className="place-image"><img src={p.image||d.image} alt={p.name}/></div><div><h3>{p.name}</h3><p>{p.description}</p>{p.location&&<span><MapPin size={14}/> {p.location}</span>}{p.entry_information&&<small>{p.entry_information}</small>}<Link className="mini-link" to="/contact">Explore Place <ArrowRight size={14}/></Link></div></article>)}</div></div></section>}
   {experiences.length>0&&<section className="section"><div className="container"><SectionHead eyebrow={experiencesBlock.eyebrow||"THINGS TO DO"} title={experiencesBlock.heading||"Experiences worth adding"}/><div className="destination-experience-grid">{experiences.map(e=>{const Icon=iconFor(e.icon);return <article className="destination-experience-card" key={e.id}><div className="activity-icon"><Icon/></div><h3>{e.name}</h3><p>{e.description}</p><div className="experience-meta">{e.price&&<b>{e.price}</b>}{e.duration&&<span>{e.duration}</span>}</div>{e.cta&&<Link className="mini-link" to="/contact">{e.cta} <ArrowRight size={14}/></Link>}</article>})}</div></div></section>}
   {recommendedPackages.length>0&&<section className="section soft"><div className="container"><SectionHead eyebrow={packagesBlock.eyebrow||"RECOMMENDED PACKAGES"} title={`${packagesBlock.heading||"Packages for"} ${d.name}`}/><div className="package-grid">{recommendedPackages.map((p,i)=><PackageCard p={{...p,image:p.image||d.image,price:p.price||`₹${Number(p.starting_price||0).toLocaleString("en-IN")}`,actualPrice:p.actualPrice||"",days:p.days||p.duration||"Flexible",tag:i===0?"Recommended":"Island package"}} key={p.id||p.name||i}/>)}</div></div></section>}
   <section className="section"><div className="container reach-grid"><div><span className="eyebrow">{reachBlock.eyebrow||"HOW TO REACH"}</span><h2>{reachBlock.heading_prefix||"Getting to"} {d.name}</h2><h3>{d.howToReach}</h3><p className="page-lead">{d.howToReachDetails}</p><div className="reach-notes"><span><Ship/> Ferry / transport information</span><span><ClockIcon/> Approximate timings vary by service</span><span><MapPin/> Local transfer support available</span></div></div>{(d.latitude&&d.longitude)&&<div className="destination-map-card"><iframe title={`${d.name} map`} src={`https://www.google.com/maps?q=${d.latitude},${d.longitude}&z=11&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div>}</div></section>
   <section className="section soft"><div className="container"><SectionHead eyebrow={tipsBlock.eyebrow||"TRAVEL TIPS"} title={tipsBlock.heading||"Useful before you go"}/><div className="tips-grid">{tips.map(t=>{const Icon=iconFor(t.icon);return <article className="tip-card" key={t.id}><Icon/><h3>{t.title}</h3><p>{t.description}</p></article>})}</div></div></section>
   <section className="section"><div className="container"><SectionHead eyebrow={galleryBlock.eyebrow||"DESTINATION GALLERY"} title={`${galleryBlock.heading||"See"} ${d.name}`}/><DestinationGallery images={gallery}/></div></section>
   {faqs.length>0&&<section className="section soft"><div className="container faq-wrap"><SectionHead eyebrow={faqBlock.eyebrow||"FAQ"} title={`${faqBlock.heading||"Questions about"} ${d.name}`}/>{faqs.map((f,i)=><details className="destination-faq" key={f.id||i}><summary>{f.question}<ChevronDown/></summary><p>{f.answer}</p></details>)}</div></section>}
   <section className="cta destination-final-cta"><div className="container cta-inner"><div><span className="eyebrow light">{finalBlock.eyebrow||"READY TO EXPLORE?"}</span><h2>{finalBlock.heading||"Ready to Explore"} {d.name}?</h2><p>{finalBlock.description||"Tell us your dates and we'll help build the right island plan."}</p></div><div className="cta-actions"><Link className="btn white" to={`/packages?destination=${encodeURIComponent(d.slug)}`}>{finalBlock.packages_button||"View Packages"} <ArrowRight size={17}/></Link><Link className="btn outline-light" to="/contact">{finalBlock.inquiry_button||"Send Inquiry"}</Link></div></div></section>
 </main>
}
function ClockIcon(props){return <CalendarDays {...props}/>}

function CounterStats(){const site=useSiteCMS();const stats=site.blocks?.["home.counter"]?.items||defaultSiteContent.blocks["home.counter"]?.items||[[500,"Happy Guests","guests"],[50,"Tour Packages","packages"],[10,"Years Experience","years"]];const [started,setStarted]=useState(false);const ref=React.useRef(null);const [values,setValues]=useState(stats.map(()=>0));useEffect(()=>{const node=ref.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting||started)return;setStarted(true);const duration=1500,start=performance.now();const tick=(now)=>{const progress=Math.min((now-start)/duration,1),eased=1-Math.pow(1-progress,3);setValues(stats.map(([target])=>Math.round(Number(target)*eased)));if(progress<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}, {threshold:.35});observer.observe(node);return()=>observer.disconnect()},[started,stats.length]);return <section className="counter-section" ref={ref} aria-label="BlueVows achievements"><div className="container counter-grid">{stats.map(([target,label,key],i)=><div className="counter-card" key={key||label}><strong>{values[i]}+</strong><span>{label}</span></div>)}</div></section>}

function ParallaxIsland(){const site=useSiteCMS();const block=site.blocks?.["home.parallax"]||{};return <section className="parallax-island"><div className="parallax-back" aria-hidden="true"></div><div className="parallax-front" aria-hidden="true"></div><div className="container parallax-content"><span className="eyebrow light">{block.eyebrow||"THE ANDAMAN FEELING"}</span><h2>{block.title||"Sea breeze. Island time. Memories that stay."}</h2><p>{block.description||"Let the water, beaches and open skies become part of your journey."}</p><Link className="btn white" to={block.link||"/destinations"}>{block.button||"Explore the islands"} <ArrowRight size={17}/></Link></div></section>}

function FlightPath(){const site=useSiteCMS();const block=site.blocks?.["home.route"]||{};return <section className="section flight-section"><div className="container"><SectionHead eyebrow={block.eyebrow||"YOUR ISLAND ROUTE"} title={block.title||"Fly in. Island hop. Explore."} text={block.description||"A simple visual route from Port Blair to the islands you can discover with BlueVows."}/><div className="flight-map" aria-label="Animated route Port Blair to Havelock to Neil Island"><svg className="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="route-glow" d="M14 62 L51 34 L77 57"/><path d="M14 62 L51 34 L77 57"/></svg><div className="route-stop stop-port"><span></span><b>{block.port_blair||"Port Blair"}</b></div><div className="route-stop stop-havelock"><span></span><b>{block.havelock||"Havelock"}</b></div><div className="route-stop stop-neil"><span></span><b>{block.neil||"Neil Island"}</b></div><div className="flight-boat"><Ship size={19}/></div></div></div></section>}

function IslandMap(){const site=useSiteCMS();const block=site.blocks?.["home.map"]||{};const [active,setActive]=useState(0);const islands=block.islands||[["Port Blair","Gateway to Andaman",18,68],["Havelock","Beaches & adventures",54,39],["Neil Island","Peaceful island escape",70,68]];useEffect(()=>{const t=setInterval(()=>setActive(v=>(v+1)%islands.length),2200);return()=>clearInterval(t)},[islands.length]);return <section className="section island-map-section"><div className="container map-layout"><div><span className="eyebrow">{block.eyebrow||"ISLAND GUIDE"}</span><h2>{block.title||"Explore the islands on the map"}</h2><p className="page-lead">{block.description||"Tap an island to highlight it. The map animation cycles automatically too."}</p><div className="map-buttons">{islands.map(([name,text],i)=><button key={name} className={active===i?"active":""} onClick={()=>setActive(i)}><span>{name}</span><small>{text}</small></button>)}</div></div><div className="andaman-map" aria-label="Interactive Andaman island map"><div className="map-ocean-glow"></div><svg className="map-route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="map-route-glow" d="M18 68 Q35 46 54 39 Q62 47 70 68"/><path d="M18 68 Q35 46 54 39 Q62 47 70 68"/></svg>{islands.map(([name,text,x,y],i)=><button key={name} className={`map-island ${active===i?"active":""}`} style={{left:`${x}%`,top:`${y}%`}} onClick={()=>setActive(i)} aria-label={name}><span></span><b>{name}</b></button>)}</div></div></section>}

function Home(){
 const cms=useDestinationCMS(); const packageCms=usePackageCMS(); const site=useSiteCMS();
 const homeDestinations=cms.items.filter(d=>d.status!=="hidden").sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0));
 const activities=site.activities||[]; const trust=site.blocks?.["home.trust"]||defaultSiteContent.blocks["home.trust"]; const why=site.blocks?.["home.why"]||defaultSiteContent.blocks["home.why"]; const video=site.blocks?.["home.video"]||defaultSiteContent.blocks["home.video"];
 const reviews=site.testimonials||[];
 return <>
  <Hero/>
  <main>
    <section className="trust-strip"><div className="container trust-grid">{(trust.items||[]).map((item,i)=>{const Icon=iconFor(item.icon);return <div key={item.id||item.title||i}><span className="trust-icon"><Icon size={18}/></span><div><b>{item.title}</b><small>{item.text}</small></div></div>})}</div></section>
    <CounterStats/>
    <ParallaxIsland/>
    <section className="section"><div className="container"><SectionHead eyebrow="EXPLORE THE ISLANDS" title="Places worth travelling for" text="Discover the islands through local knowledge, beautiful stays and carefully planned days."/><div className="destination-grid">{homeDestinations.map((d,i)=><DestinationCard d={{...d,image:d.image||d.heroImage,text:d.text||d.shortDescription}} key={d.id||i}/>)}</div></div></section>
    <div className="liquid-wave" aria-hidden="true"></div>
    <section className="section soft"><div className="container"><SectionHead eyebrow="CURATED JOURNEYS" title="Popular packages" text="Flexible itineraries that make planning your Andaman holiday simple."/><div className="package-grid">{packageCms.items.map((p,i)=><PackageCard p={p} key={p.id||i}/>)}</div><div className="center"><Link className="btn outline" to="/packages">View all packages <ArrowRight size={17}/></Link></div></div></section>
    <FlightPath/>
    <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">ISLAND EXPERIENCES</span><h2><Link className="heading-link" to="/experiences">Make your trip memorable <ArrowRight size={24}/></Link></h2></div></div><div className="activity-grid">{activities.map(a=>{const Icon=iconFor(a.icon);const slug=a.slug||slugify(a.name);return <Link className="activity-card" to={`/activities/${slug}`} key={a.id||slug}><div className="activity-icon"><Icon/></div><h3>{a.name}</h3><p>{a.description||a.text}</p>{a.price&&<b className="activity-price">{a.price}</b>}<span className="mini-link">{a.cta_label||"View details"} <ArrowRight size={14}/></span></Link>})}</div><div className="center"><Link className="btn outline" to="/contact">Build My Custom Trip <ArrowRight size={17}/></Link></div></div></section>
    <section className="section soft services-section"><div className="container"><SectionHead eyebrow="TRAVEL SERVICES" title="Everything you need for an easier island trip" text="From stays and transfers to experiences and custom planning, we can help organise the important parts of your journey."/><div className="service-grid">{(site.services?.length?site.services:defaultServices).slice(0,4).map((service,i)=><ServiceCard service={service} key={service.id||service.slug||service.name||i}/>)}</div><div className="center"><Link className="btn outline" to="/services">View all services <ArrowRight size={17}/></Link></div></div></section>
    <PartnerMarquee/>
    <IslandMap/>
    <section className="section video-home-section"><div className="container"><div className="video-section"><div><span className="eyebrow">{video.eyebrow||"SEE THE ISLANDS"}</span><h2>{video.title||"Watch Andaman before you go"}</h2><p>{video.description}</p><div className="video-actions"><Link className="btn primary" to="/experiences">Explore Experiences <ArrowRight size={17}/></Link><a className="btn youtube-subscribe" href={video.subscribe_url||"https://www.youtube.com/@NomadicSoulmates?sub_confirmation=1"} target="_blank" rel="noreferrer"><Youtube size={17}/> Subscribe</a></div></div><div className="video-frame"><iframe src={video.video_url||"https://www.youtube.com/embed/oXPJxnVqJ6w?rel=0"} title="Andaman and Nicobar Tourism video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div></div></div></section>
    <section className="why-section"><div className="container why-grid"><div><span className="eyebrow">{why.eyebrow}</span><h2>{why.title}</h2><p>{why.description}</p></div><div className="why-list">{(why.items||[]).map((item,i)=>{const Icon=iconFor(item.icon);return <div key={item.id||item.title||i}><Icon/><div><b>{item.title}</b><span>{item.text}</span></div></div>})}</div></div></section>
    <section className="section reviews-section"><div className="container"><SectionHead eyebrow="TRAVELLER STORIES" title="What our guests say" text="Real-feeling service starts with listening, planning and being there when it matters."/><div className="review-grid">{reviews.map(r=><article className="review modern-review" key={r.id||r.guest_name}><div className="review-top"><div className="review-profile"><img src={r.photo_url||"https://i.pravatar.cc/120?img=47"} alt={r.guest_name}/><div><b>{r.guest_name}</b><span>Verified traveller</span></div></div><div className="stars">{[1,2,3,4,5].map(x=><Star key={x} fill={x<=Math.round(Number(r.rating||5))?"currentColor":"none"} size={14}/>)}</div></div><h3>{r.title}</h3><p>“{r.review}”</p><div className="review-quote">“</div></article>)}</div></div></section>
    <CTA/>
  </main>
 </>
}
function SectionHead({eyebrow,title,text}){return <div className="section-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{text&&<p>{text}</p>}</div>}
function CTA(){const site=useSiteCMS();const cta=site.blocks?.["home.cta"]||defaultSiteContent.blocks["home.cta"];return <section className="cta"><div className="container cta-inner"><div><span className="eyebrow light">{cta.eyebrow}</span><h2>{cta.title}</h2><p>{cta.description}</p></div><Link className="btn white" to={cta.link||"/contact"}>{cta.button||"Get a Free Quotation"} <ArrowRight size={18}/></Link></div></section>}

function ServiceListing(){
 const site=useSiteCMS();
 const items=site.services?.length?site.services:defaultServices;
 return <SimplePage title="Services" eyebrow="TRAVEL SERVICES"><p className="page-lead">Practical support for stays, transfers, experiences and personalised Andaman trips.</p><div className="service-grid service-listing-grid">{items.map((service,i)=><ServiceCard service={service} key={service.id||service.slug||service.name||i}/>)}</div></SimplePage>
}

function Listing({type}){
 const cms=useDestinationCMS(); const packageCms=usePackageCMS();
 const data=type==="Packages"?packageCms.items:cms.items.filter(d=>d.status!=="hidden").sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0));
 return <main className="page"><div className="container"><span className="eyebrow">BLUEVOWS</span><h1 className="page-title">{type}</h1><p className="page-lead">Explore our {type.toLowerCase()} and choose what fits your journey.</p><div className={type==="Packages"?"package-grid":"destination-grid"}>{data.map((x,i)=>type==="Packages"?<PackageCard p={x} key={x.id||i}/>:<DestinationCard d={{...x,image:x.image||x.heroImage,text:x.text||x.shortDescription}} key={x.id||i}/>)}</div></div></main>
}

function ActivityListing(){
 const site=useSiteCMS(); const items=site.activities||[];
 return <SimplePage title="Activities" eyebrow="EXPERIENCES"><div className="activity-grid">{items.map(a=>{const Icon=iconFor(a.icon);const slug=a.slug||slugify(a.name);return <Link className="activity-card" to={`/activities/${slug}`} key={a.id||slug}><div className="activity-icon"><Icon/></div><h3>{a.name}</h3><p>{a.description||a.text}</p>{a.price&&<b className="activity-price">{a.price}</b>}<span className="mini-link">{a.cta_label||"View details"} <ArrowRight size={14}/></span></Link>})}</div></SimplePage>
}

function ActivityDetail(){
 const {slug}=useParams(); const site=useSiteCMS(); const items=site.activities||[];
 const a=items.find(x=>(x.slug||slugify(x.name))===slug)||items[0];
 if(!a)return <SimplePage title="Experience not found" eyebrow="BLUEVOWS"><p className="page-lead">This experience is not currently published.</p></SimplePage>;
 const Icon=iconFor(a.icon);
 const image=a.image_url||a.image||a.featured_image||"";
 const inclusions=Array.isArray(a.inclusions)?a.inclusions:[];
 const exclusions=Array.isArray(a.exclusions)?a.exclusions:[];
 return <main className="page activity-detail-page"><div className="container narrow">
  <span className="eyebrow">ISLAND EXPERIENCE</span><h1 className="page-title">{a.name}</h1>
  {image&&<img className="activity-detail-image" src={image} alt={a.name} style={{width:"100%",maxHeight:480,objectFit:"cover",display:"block",borderRadius:14,margin:"24px 0 8px"}}/>}
  <p className="page-lead">{a.details||a.description}</p>
  <div className="activity-detail-card">
   <div className="activity-detail-icon"><Icon/></div>
   <div><span className="eyebrow">EXPERIENCE PRICE</span><h2>{a.price||"On request"}</h2><p>{a.description}</p>
    {a.duration&&<p><strong>Duration:</strong> {a.duration}</p>}
    {a.location&&<p><strong>Location:</strong> {a.location}</p>}
    {(inclusions.length>0||exclusions.length>0)&&<div className="activity-detail-lists">
      {inclusions.length>0&&<div><strong>Includes</strong><ul>{inclusions.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
      {exclusions.length>0&&<div><strong>Excludes</strong><ul>{exclusions.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
    </div>}
    <Link className="btn primary" to={a.cta_link||"/contact"}>{a.cta_label||"Enquire for this experience"} <ArrowRight size={17}/></Link>
   </div>
  </div>
 </div></main>
}
function CmsPage({contentKey,fallbackTitle,fallbackEyebrow}){const site=useSiteCMS();const block=site.blocks?.[contentKey]||{};return <SimplePage title={block.title||fallbackTitle} eyebrow={block.eyebrow||fallbackEyebrow}><p className="page-lead">{block.description||""}</p></SimplePage>}

function SimplePage({title,eyebrow,children}){return <main className="page"><div className="container narrow"><span className="eyebrow">{eyebrow}</span><h1 className="page-title">{title}</h1>{children}</div></main>}

function DateField({label="Travel date",value="",onChange}){
  return <label className="date-field date-field-modern">{label}<div className="date-control"><input type="date" value={value} onChange={e=>onChange?.(e.target.value)} aria-label={label}/><CalendarDays className="date-control-icon" size={18}/></div></label>
}

function Contact(){
 const site=useSiteCMS();
 const destinations=useDestinationCMS()?.items||defaultDestinations;
 const packages=usePackageCMS()?.items||defaultPackages;
 const settings=site.settings||defaultSiteContent.settings;
 const block=site.blocks?.["page.contact"]||{};
 const [form,setForm]=useState({name:"",phone:"",email:"",travelDate:"",adults:"2",children:"0",destination:"",packageName:"",message:""});
 const [status,setStatus]=useState({type:"",message:""});
 const [submitting,setSubmitting]=useState(false);
 const update=(key,value)=>setForm(prev=>({...prev,[key]:value}));
 const submit=async(e)=>{
   e.preventDefault();
   if(submitting)return;
   setStatus({type:"",message:""});
   if(!form.name.trim()||!form.phone.trim()){
     setStatus({type:"error",message:"Please enter your name and phone number."});
     return;
   }
   const url=import.meta.env.VITE_SUPABASE_URL;
   const anon=import.meta.env.VITE_SUPABASE_ANON_KEY;
   if(!url||!anon){
     setStatus({type:"error",message:"Enquiry service is not configured yet."});
     return;
   }
   setSubmitting(true);
   try{
     const adults=Math.max(0,Number(form.adults)||0);
     const children=Math.max(0,Number(form.children)||0);
     const response=await fetch(`${url}/rest/v1/enquiries`,{
       method:"POST",
       headers:{apikey:anon,Authorization:`Bearer ${anon}`,"Content-Type":"application/json",Prefer:"return=minimal"},
       body:JSON.stringify({
         name:form.name.trim(),
         phone:form.phone.trim(),
         email:form.email.trim()||null,
         travel_date:form.travelDate||null,
         travellers:adults+children,
         destination:form.destination||null,
         package:form.packageName||null,
         message:form.message.trim()||null
       })
     });
     if(!response.ok)throw new Error(await response.text());
     setForm({name:"",phone:"",email:"",travelDate:"",adults:"2",children:"0",destination:"",packageName:"",message:""});
     setStatus({type:"success",message:"Thank you! Your enquiry has been received. Our team will contact you soon."});
   }catch(err){
     console.error("BlueVows enquiry submission failed",err);
     setStatus({type:"error",message:"We could not send your enquiry right now. Please try again."});
   }finally{setSubmitting(false)}
 };
 return <SimplePage title={block.title||"Plan your trip"} eyebrow={block.eyebrow||"GET IN TOUCH"}>
  <p className="page-lead">{block.description||"Share your travel plans and our team will prepare a quotation for you."}</p>
  <div className="contact-address"><MapPin size={18}/><div><b>Our address</b><span>{settings.address||"Port Blair, Andaman & Nicobar Islands, India"}</span></div></div>
  <form className="contact-form" onSubmit={submit}>
   <div className="form-grid">
    <label>Full name<input value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Your name" required/></label>
    <label>Phone number<input value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder={settings.phone||"+91"} required/></label>
    <label>Email<input type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder={settings.contact_email||"you@example.com"}/></label>
    <DateField label="Travel date" value={form.travelDate} onChange={value=>update("travelDate",value)}/>
    <label>Adults<input type="number" min="1" value={form.adults} onChange={e=>update("adults",e.target.value)}/></label>
    <label>Children<input type="number" min="0" value={form.children} onChange={e=>update("children",e.target.value)}/></label>
    <label>Destination<select value={form.destination} onChange={e=>update("destination",e.target.value)}><option value="">Select destination</option>{destinations.map(d=><option key={d.id||d.slug||d.name} value={d.name}>{d.name}</option>)}</select></label>
    <label>Package<select value={form.packageName} onChange={e=>update("packageName",e.target.value)}><option value="">Select package</option>{packages.map(p=><option key={p.id||p.slug||p.name} value={p.name}>{p.name}</option>)}</select></label>
   </div>
   <label>Message<textarea rows="5" value={form.message} onChange={e=>update("message",e.target.value)} placeholder="Tell us about your trip"></textarea></label>
   {status.message&&<div className={`enquiry-message ${status.type}`} role="status">{status.message}</div>}
   <button className="btn primary submit" type="submit" disabled={submitting}><Send size={17}/> {submitting?"Sending...":"Send Enquiry"}</button>
  </form>
 </SimplePage>
}

function ScrollRevealObserver(){
  const {pathname}=useLocation();
  useEffect(()=>{
    const reduceMotion=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if(reduceMotion) return;
    const selectors=[
      ".section-head > div", ".section-head > p", ".page-title", ".page-lead",
      ".section > .container > .eyebrow", ".trust-grid > div", ".counter-card",
      ".destination-card", ".package-card", ".activity-card", ".review",
      ".partner-heading", ".partner-logo-pill", ".itinerary-head > *", ".itinerary-item",
      ".experience-card", ".video-section > *", ".why-grid > div", ".why-list > div",
      ".map-layout > div", ".cta-inner > *", ".detail-content > *", ".detail-feature-grid > div",
      ".contact-form > *", ".admin-card", ".stat", ".quick-actions > *"
    ];
    const elements=Array.from(document.querySelectorAll(selectors.join(",")));
    const images=Array.from(document.querySelectorAll(".destination-card img, .package-image img"));
    if(!elements.length && !images.length) return;
    const mark=(el,index)=>{
      if(el.dataset.scrollRevealReady) return;
      el.dataset.scrollRevealReady="1";
      el.classList.add("scroll-reveal");
      if(index!==undefined) el.style.setProperty("--reveal-delay", `${Math.min(index,5)*70}ms`);
    };
    elements.forEach((el)=>{
      const parent=el.parentElement;
      const index=parent ? Array.from(parent.children).indexOf(el) : 0;
      mark(el,index);
    });
    images.forEach(el=>{ if(!el.dataset.scrollRevealImage){el.dataset.scrollRevealImage="1";el.classList.add("scroll-reveal-image");} });
    const observed=[...elements,...images];
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },{threshold:.12,rootMargin:"0px 0px -8% 0px"});
    observed.forEach(el=>observer.observe(el));
    return()=>observer.disconnect();
  },[pathname]);
  return null;
}

function AppShell(){
 const site=useSiteCMS();
 const [subscribeEmail,setSubscribeEmail]=useState("");
 const [subscribed,setSubscribed]=useState(false);
 const settings=site.settings||defaultSiteContent.settings;
 const footer=site.blocks?.["footer"]||defaultSiteContent.blocks.footer; const footerHighlight=site.blocks?.["footer.highlight"]||defaultSiteContent.blocks["footer.highlight"]; const footerSections=site.footerSections||[];
 const submitSubscribe=(e)=>{e.preventDefault();const email=subscribeEmail.trim();if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return;try{localStorage.setItem("bluevows_subscriber",email)}catch{}setSubscribed(true);setSubscribeEmail("");};
 return <DestinationProvider><PackageProvider><ScrollToTop/><ScrollRevealObserver/><Header/><Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/destinations" element={<Listing type="Destinations"/>}/>
  <Route path="/destinations/:slug" element={<DestinationDetail/>}/>
  <Route path="/packages" element={<Listing type="Packages"/>}/>
  <Route path="/packages/:slug" element={<PackageDetail/>}/>
  <Route path="/experiences" element={<Experiences/>}/>
  <Route path="/services" element={<ServiceListing/>}/>
  <Route path="/hotels" element={<CmsPage contentKey="page.hotels" fallbackTitle="Hotels & Resorts" fallbackEyebrow="STAY COMFORTABLY"/>}/>
  <Route path="/activities" element={<ActivityListing/>}/>
  <Route path="/activities/:slug" element={<ActivityDetail/>}/>
  <Route path="/about" element={<CmsPage contentKey="page.about" fallbackTitle="About BlueVows" fallbackEyebrow="OUR STORY"/>}/>
  <Route path="/contact" element={<Contact/>}/>
 </Routes>
 <div className="floating-contact" aria-label="Quick contact"><a className="floating-btn whatsapp" href={settings.whatsapp?`https://wa.me/${String(settings.whatsapp).replace(/\D/g,"")}`:"https://wa.me/"} aria-label="WhatsApp"><MessageCircle/></a><a className="floating-btn phone-call" href={settings.phone?`tel:${settings.phone}`:"tel:+91XXXXXXXXXX"} aria-label="Call BlueVows"><PhoneCall/></a></div>
 <footer><div className="container footer-grid">
  <div className="footer-brand-block"><div className="brand footer-brand"><img className="brand-logo footer-logo" src={settings.logo_url||"/bluevows-logo.png"} alt={settings.website_name||"BlueVows"}/></div><p>{footer.description}</p><Link className="footer-trip-btn" to="/contact">Plan your trip <ArrowRight size={15}/></Link></div>
  {footerSections.length?footerSections.map(section=><div key={section.id}><b>{section.title}</b>{(site.footerLinks||[]).filter(link=>link.section_id===section.id).map(link=><Link to={link.link||"/"} key={link.id}>{link.label}</Link>)}</div>):<div><b>Explore</b>{(site.navigation||defaultSiteContent.navigation).filter(x=>!x.parent_id).slice(0,5).map(x=><Link to={x.link||"/"} key={x.id||x.title}>{x.title}</Link>)}</div>}
  <div><b>Contact</b><span><Phone size={15}/> {settings.phone||footer.phone}</span><span><Mail size={15}/> {settings.contact_email||footer.email}</span><span className="footer-address"><MapPin size={15}/> {settings.address||footer.address}</span><Link to="/contact"><MessageCircle size={15}/> Send an enquiry</Link></div>
  <div className="footer-highlight"><span className="eyebrow light">{footerHighlight.eyebrow}</span><h3>{footerHighlight.title}</h3><p>{footerHighlight.description}</p><Link className="footer-trip-btn" to="/contact">Get a free quotation <ArrowRight size={15}/></Link>
    <form className="subscribe-glass" onSubmit={submitSubscribe}><span>Stay in the loop</span>{subscribed?<div className="subscribe-success" role="status">Subscribed ✓</div>:<div><input type="email" value={subscribeEmail} onChange={e=>setSubscribeEmail(e.target.value)} placeholder="Your email" aria-label="Email for BlueVows updates" required/><button type="submit">Subscribe</button></div>}</form>
    <div className="social-links" aria-label="Social media"><a href={(settings.social_links||{}).instagram||"https://www.instagram.com/"} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram/></a><a href={(settings.social_links||{}).facebook||"https://www.facebook.com/"} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook/></a><a href={(settings.social_links||{}).x||"https://x.com/"} target="_blank" rel="noreferrer" aria-label="X">X</a><a href={(settings.social_links||{}).youtube||"https://www.youtube.com/"} target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube/></a><a href={(settings.social_links||{}).whatsapp||"https://wa.me/"} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle/></a></div>
  </div>
 </div><div className="container footer-bottom">{footer.copyright}<span>{footer.tagline}</span></div></footer>
 </PackageProvider></DestinationProvider>
}
function App(){return <SiteProvider><AppShell/></SiteProvider>}

export default App;