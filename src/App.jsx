function CTA(){const site=useSiteCMS();const cta=site.blocks?.["home.cta"]||defaultSiteContent.blocks["home.cta"];return <section className="cta"><div className="container cta-inner"><div><span className="eyebrow light">{cta.eyebrow}</span><h2>{cta.title}</h2><p>{cta.description}</p></div><Link className="btn white" to={cta.link||"/contact"}>{cta.button||"Get a Free Quotation"} <ArrowRight size={18}/></Link></div></section>}

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
 return <main className="page activity-detail-page"><div className="container narrow"><span className="eyebrow">ISLAND EXPERIENCE</span><h1 className="page-title">{a.name}</h1><p className="page-lead">{a.details||a.description}</p><div className="activity-detail-card"><div className="activity-detail-icon"><Icon/></div><div><span className="eyebrow">EXPERIENCE PRICE</span><h2>{a.price||"On request"}</h2><p>{a.description}</p>{a.duration&&<p><strong>Duration:</strong> {a.duration}</p>}<Link className="btn primary" to={a.cta_link||"/contact"}>{a.cta_label||"Enquire for this experience"} <ArrowRight size={17}/></Link></div></div></div></main>
}
function CmsPage({contentKey,fallbackTitle,fallbackEyebrow}){const site=useSiteCMS();const block=site.blocks?.[contentKey]||{};return <SimplePage title={block.title||fallbackTitle} eyebrow={block.eyebrow||fallbackEyebrow}><p className="page-lead">{block.description||""}</p></SimplePage>}

function SimplePage({title,eyebrow,children}){return <main className="page"><div className="container narrow"><span className="eyebrow">{eyebrow}</span><h1 className="page-title">{title}</h1>{children}</div></main>}

function DateField({label="Travel date"}){
  const [value,setValue]=useState("");
  const inputRef=useRef(null);
  const display=value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "Select travel date";
  return <label className="date-field date-field-modern">{label}<div className="date-control"><span className={value?"has-date":"placeholder"}>{display}</span><CalendarDays size={18}/><input ref={inputRef} type="date" value={value} onChange={e=>setValue(e.target.value)} aria-label={label}/></div></label>
}

function Contact(){const site=useSiteCMS();const settings=site.settings||defaultSiteContent.settings;const block=site.blocks?.["page.contact"]||{};return <SimplePage title={block.title||"Plan your trip"} eyebrow={block.eyebrow||"GET IN TOUCH"}><p className="page-lead">{block.description||"Share your travel plans and our team will prepare a quotation for you."}</p><div className="contact-address"><MapPin size={18}/><div><b>Our address</b><span>{settings.address||"Port Blair, Andaman & Nicobar Islands, India"}</span></div></div><form className="contact-form" onSubmit={e=>e.preventDefault()}><div className="form-grid"><label>Full name<input placeholder="Your name"/></label><label>Phone number<input placeholder={settings.phone||"+91"}/></label><label>Email<input type="email" placeholder={settings.contact_email||"you@example.com"}/></label><DateField/><label>Adults<input type="number" min="1" defaultValue="2"/></label><label>Children<input type="number" min="0" defaultValue="0"/></label></div><label>Message<textarea rows="5" placeholder="Tell us about your trip"></textarea></label><button className="btn primary submit"><Send size={17}/> Send Enquiry</button></form></SimplePage>}

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
