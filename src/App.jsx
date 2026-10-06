import React, { useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import {
  Menu, X, MapPin, CalendarDays, Users, ArrowRight, Star, ChevronDown,
  CheckCircle2, Phone, Mail, MessageCircle, ShieldCheck,
  Compass, Hotel, Waves, Send, LayoutDashboard, Settings,
  FileText, CreditCard, Image as ImageIcon, Package, LogOut
} from "lucide-react";

const destinations = [
  {name:"Havelock Island", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85", text:"White-sand beaches, clear water and unforgettable island experiences."},
  {name:"Neil Island", image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85", text:"Quiet beaches, coral reefs and a slower island escape."},
  {name:"Port Blair", image:"https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85", text:"Your gateway to the islands, history and coastal experiences."}
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

const partnerMarks = ["ISLAND STAYS","OCEAN EXPERIENCES","TRAVEL PARTNER","ANDAMAN HOSTS","DISCOVER INDIA","ISLAND ADVENTURES","TRAVEL PARTNER","OCEAN EXPERIENCES"];

const packages = [
  {name:"Andaman Escape", days:"5 Nights / 6 Days", price:"₹35,000", image:destinations[0].image, tag:"Popular"},
  {name:"Island Discovery", days:"4 Nights / 5 Days", price:"₹29,500", image:destinations[1].image, tag:"Best Seller"},
  {name:"Honeymoon Islands", days:"6 Nights / 7 Days", price:"₹46,000", image:destinations[2].image, tag:"Couples"}
];

const activities = [
  {name:"Scuba Diving", icon:Waves, text:"Discover vibrant coral reefs and marine life."},
  {name:"Sea Walk", icon:Compass, text:"Walk beneath the sea and experience the reef."},
  {name:"Island Transfers", icon:MapPin, text:"Comfortable transfers planned around your itinerary."},
  {name:"Kayaking", icon:Waves, text:"Explore calm tropical waters at your own pace."}
];

function Header(){
  const [open,setOpen]=useState(false);
  return <header className="header">
    <div className="container nav">
      <Link className="brand" to="/" onClick={()=>setOpen(false)}>
        <img className="brand-logo" src="/bluevows-logo.png" alt="BlueVows" />
      </Link>
      <button className="menu-btn" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button>
      <nav className={open?"nav-links open":"nav-links"}>
        <Link to="/" onClick={()=>setOpen(false)}>Home</Link>
        <Link to="/destinations" onClick={()=>setOpen(false)}>Destinations</Link>
        <Link to="/packages" onClick={()=>setOpen(false)}>Packages</Link>
        <Link to="/hotels" onClick={()=>setOpen(false)}>Hotels</Link>
        <Link to="/activities" onClick={()=>setOpen(false)}>Activities</Link>
        <Link to="/about" onClick={()=>setOpen(false)}>About</Link>
        <Link className="nav-cta" to="/contact" onClick={()=>setOpen(false)}>Plan My Trip <ArrowRight size={15}/></Link>
      </nav>
    </div>
  </header>
}
function Hero(){
  const [destination,setDestination]=useState("Andaman");
  const [date,setDate]=useState("");
  const [travellers,setTravellers]=useState(2);

  const search = () => {
    const params = new URLSearchParams({
      destination,
      date: date || "flexible",
      travellers: String(travellers)
    });
    window.location.href = `/packages?${params.toString()}`;
  };

  return <section className="hero">
    <div className="hero-image"></div>
    <div className="hero-overlay"></div>
    <div className="container hero-content">
      <span className="eyebrow light">YOUR ISLAND JOURNEY STARTS HERE</span>
      <h1>Experience the<br/><em>Andaman</em></h1>
      <p>Beautiful islands, handpicked stays and experiences planned around the way you want to travel.</p>
      <div className="hero-actions">
        <Link className="btn primary" to="/packages">Explore Packages <ArrowRight size={18}/></Link>
        <Link className="btn ghost" to="/contact">Plan My Trip</Link>
      </div>
    </div>

    <div className="container planner-wrap">
      <div className="planner" aria-label="Trip planner">
        <label className="field planner-field">
          <MapPin/><div><small>Destination</small>
          <select value={destination} onChange={e=>setDestination(e.target.value)}>
            <option>Andaman</option><option>Havelock Island</option><option>Neil Island</option><option>Port Blair</option>
          </select></div><ChevronDown className="field-chevron"/>
        </label>
        <label className="field planner-field">
          <CalendarDays/><div><small>Travel Date</small>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} aria-label="Travel date"/>
          </div>
        </label>
        <label className="field planner-field">
          <Users/><div><small>Travellers</small>
          <select value={travellers} onChange={e=>setTravellers(Number(e.target.value))}>
            {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} {n===1?"Traveller":"Travellers"}</option>)}
          </select></div><ChevronDown className="field-chevron"/>
        </label>
        <button className="planner-btn" onClick={search}>Search Packages <ArrowRight size={16}/></button>
      </div>
    </div>
  </section>
}
function DestinationCard({d}){ return <Link className="destination-card" to={`/destinations/${slugify(d.name)}`}>
  <img src={d.image} alt={d.name}/><div className="destination-shade"></div>
  <div className="destination-info"><span>Explore</span><h3>{d.name}</h3><p>{d.text}</p><span className="destination-link">View destination <ArrowRight size={14}/></span></div>
</Link>}

function PackageCard({p}){ return <div className="package-card">
  <div className="package-image"><img src={p.image} alt={p.name}/><span>{p.tag}</span></div>
  <div className="package-body"><div className="package-days">{p.days}</div><h3>{p.name}</h3><div className="package-bottom"><div><small>Starting from</small><strong>{p.price}</strong></div><Link to="/contact" className="icon-btn" aria-label="Get quote"><ArrowRight/></Link></div></div>
</div>}

function PartnerMarquee(){
 return <section className="partner-marquee" aria-label="Travel partners">
   <div className="container"><div className="partner-heading"><span className="eyebrow">OUR NETWORK</span><h3>Travel made easier with trusted local partners</h3></div></div>
   <div className="marquee-window"><div className="marquee-track">
     {[...partnerMarks,...partnerMarks].map((name,i)=><div className="partner-logo-pill" key={i}><span className="partner-dot"></span>{name}</div>)}
   </div></div>
 </section>
}

function DestinationDetail(){
 const {slug}=useParams();
 const d=destinations.find(x=>slugify(x.name)===slug) || destinations[0];
 return <main className="destination-detail">
   <section className="detail-hero" style={{backgroundImage:`url(${d.image})`}}>
     <div className="detail-overlay"></div><div className="container detail-content">
       <span className="eyebrow light">DESTINATION GUIDE</span><h1>{d.name}</h1><p>{d.text}</p>
       <div className="detail-actions"><Link className="btn primary" to="/contact">Plan this destination <ArrowRight size={17}/></Link><Link className="btn ghost" to="/packages">View packages</Link></div>
     </div>
   </section>
   <section className="section"><div className="container detail-grid">
     <div><span className="eyebrow">WHY GO</span><h2>Plan a better island stay</h2><p className="page-lead">{d.text} Choose the right stay, experiences and transfers with a quotation built around your dates.</p></div>
     <div className="detail-feature-grid"><div><CheckCircle2/><b>Handpicked stays</b><span>Comfortable options in useful locations.</span></div><div><Compass/><b>Curated experiences</b><span>Activities matched to your trip style.</span></div><div><MapPin/><b>Easy transfers</b><span>Simple island movement planning.</span></div><div><MessageCircle/><b>Local support</b><span>Human assistance when you need it.</span></div></div>
   </div></section>
 </main>
}

function Home(){
 return <>
  <Hero/>
  <main>
    <section className="trust-strip"><div className="container trust-grid">
      <div><span className="trust-icon">✓</span><div><b>Local Island Experts</b><small>Real Andaman knowledge</small></div></div>
      <div><span className="trust-icon">★</span><div><b>Handpicked Stays</b><small>Comfort & value checked</small></div></div>
      <div><span className="trust-icon">₹</span><div><b>Clear Quotations</b><small>No confusing pricing</small></div></div>
      <div><span className="trust-icon">24</span><div><b>Human Support</b><small>Help before your trip</small></div></div>
    </div></section>
    <section className="section"><div className="container">
      <SectionHead eyebrow="EXPLORE THE ISLANDS" title="Places worth travelling for" text="Discover the islands through local knowledge, beautiful stays and carefully planned days."/>
      <div className="destination-grid">{destinations.map((d,i)=><DestinationCard d={d} key={i}/>)}</div>
    </div></section>

    <section className="section soft"><div className="container">
      <SectionHead eyebrow="CURATED JOURNEYS" title="Popular packages" text="Flexible itineraries that make planning your Andaman holiday simple."/>
      <div className="package-grid">{packages.map((p,i)=><PackageCard p={p} key={i}/>)}</div>
      <div className="center"><Link className="btn outline" to="/packages">View all packages <ArrowRight size={17}/></Link></div>
    </div></section>

    <section className="section"><div className="container">
      <SectionHead eyebrow="ISLAND EXPERIENCES" title="Make your trip memorable"/>
      <div className="activity-grid">{activities.map(({name,icon:Icon,text})=><div className="activity-card" key={name}><div className="activity-icon"><Icon/></div><h3>{name}</h3><p>{text}</p><Link className="mini-link" to="/contact">Add to trip <ArrowRight size={14}/></Link></div>)}</div>
      <div className="center"><Link className="btn outline" to="/contact">Build My Custom Trip <ArrowRight size={17}/></Link></div>
    </div></section>

    <PartnerMarquee/>

    <section className="why-section"><div className="container why-grid">
      <div><span className="eyebrow">WHY TRAVEL WITH US</span><h2>Local knowledge.<br/>Thoughtful planning.</h2><p>From your first enquiry to the day you return home, we keep your island journey clear, comfortable and personal.</p></div>
      <div className="why-list">
        <div><CheckCircle2/><div><b>Local expertise</b><span>Practical advice from people who know the islands.</span></div></div>
        <div><CheckCircle2/><div><b>Handpicked stays</b><span>Hotels selected for location, comfort and value.</span></div></div>
        <div><CheckCircle2/><div><b>Easy quotations</b><span>Clear pricing with a simple advance-payment QR.</span></div></div>
        <div><CheckCircle2/><div><b>Human support</b><span>Real help before and during your trip.</span></div></div>
      </div>
    </div></section>

    <section className="section"><div className="container">
      <SectionHead eyebrow="TRAVELLER STORIES" title="What our guests say"/>
      <div className="review-grid">
        {[["A wonderful trip","Everything was well planned and the communication was easy from start to finish.","Priya S."],["Smooth and comfortable","The itinerary was flexible and the hotel choices were exactly what we wanted.","Rahul M."],["Highly recommended","Great support, clear quotation and a memorable island experience.","Neha K."]].map(r=><div className="review" key={r[2]}><div className="stars">{[1,2,3,4,5].map(x=><Star key={x} fill="currentColor" size={16}/>)}</div><h3>{r[0]}</h3><p>“{r[1]}”</p><b>{r[2]}</b></div>)}
      </div>
    </div></section>

    <CTA/>
  </main>
 </>
}

function SectionHead({eyebrow,title,text}){return <div className="section-head"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{text&&<p>{text}</p>}</div>}
function CTA(){return <section className="cta"><div className="container cta-inner"><div><span className="eyebrow light">READY TO GO?</span><h2>Let's plan your island escape.</h2><p>Tell us your dates and what you want to experience. We'll help shape the trip.</p></div><Link className="btn white" to="/contact">Get a Free Quotation <ArrowRight size={18}/></Link></div></section>}

function Listing({type}){ const data=type==="Packages"?packages:destinations; return <main className="page"><div className="container"><span className="eyebrow">BLUEVOWS</span><h1 className="page-title">{type}</h1><p className="page-lead">Explore our {type.toLowerCase()} and choose what fits your journey.</p><div className={type==="Packages"?"package-grid":"destination-grid"}>{data.map((x,i)=>type==="Packages"?<PackageCard p={x} key={i}/>:<DestinationCard d={x} key={i}/>)}</div></div></main> }

function SimplePage({title,eyebrow,children}){return <main className="page"><div className="container narrow"><span className="eyebrow">{eyebrow}</span><h1 className="page-title">{title}</h1>{children}</div></main>}

function Contact(){return <SimplePage title="Plan your trip" eyebrow="GET IN TOUCH"><p className="page-lead">Share your travel plans and our team will prepare a quotation for you.</p><form className="contact-form" onSubmit={e=>e.preventDefault()}><div className="form-grid"><label>Full name<input placeholder="Your name"/></label><label>Phone number<input placeholder="+91"/></label><label>Email<input type="email" placeholder="you@example.com"/></label><label>Travel date<input type="date"/></label><label>Adults<input type="number" min="1" defaultValue="2"/></label><label>Children<input type="number" min="0" defaultValue="0"/></label></div><label>Message<textarea rows="5" placeholder="Tell us about your trip"></textarea></label><button className="btn primary submit"><Send size={17}/> Send Enquiry</button></form></SimplePage>}

function Admin(){return <main className="admin-page"><div className="admin-shell"><aside className="admin-side"><div className="brand admin-brand"><img className="brand-logo admin-logo" src="/bluevows-logo.png" alt="BlueVows" /> <span>ADMIN</span></div>{["Dashboard","Enquiries","Quotations","Bookings","Customers","Packages","Hotels","Activities","Gallery","Reviews","Website Content","Email Templates","QR / Payment","Settings"].map((x,i)=><div className={i===0?"admin-link active":"admin-link"} key={x}><LayoutDashboard size={17}/>{x}</div>)}<div className="admin-link logout"><LogOut size={17}/>Logout</div></aside><section className="admin-main"><div className="admin-top"><div><span className="eyebrow">CONTROL CENTER</span><h1>Dashboard</h1></div><div className="admin-user">Admin</div></div><div className="stats">{[["Enquiries","24"],["Quotations","12"],["Confirmed","7"],["Pending Payment","4"]].map(x=><div className="stat" key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}</div><div className="admin-grid"><div className="admin-card"><div className="admin-card-head"><h3>Recent enquiries</h3><span>View all</span></div>{["Rahul Sharma","Priya Singh","Arjun Das","Meera Nair"].map((x,i)=><div className="enquiry-row" key={x}><div><b>{x}</b><span>{i+2} Adults · {5+i}N / {6+i}D</span></div><span className="status">{i===0?"New":"Pending"}</span></div>)}</div><div className="admin-card"><div className="admin-card-head"><h3>Quick actions</h3></div><div className="quick-actions"><button><FileText/>Create quotation</button><button><Package/>Add package</button><button><ImageIcon/>Upload gallery</button><CreditCard/> <span className="qr-label">Manage QR</span></div></div></div></section></div></main>}

function App(){
 return <><Header/><Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/destinations" element={<Listing type="Destinations"/>}/>
  <Route path="/destinations/:slug" element={<DestinationDetail/>}/>
  <Route path="/packages" element={<Listing type="Packages"/>}/>
  <Route path="/hotels" element={<SimplePage title="Hotels & Resorts" eyebrow="STAY COMFORTABLY"><p className="page-lead">A clean hotel directory will be connected to Supabase in the next setup stage.</p></SimplePage>}/>
  <Route path="/activities" element={<SimplePage title="Activities" eyebrow="EXPERIENCES"><div className="activity-grid">{activities.map(({name,icon:Icon,text})=><div className="activity-card" key={name}><div className="activity-icon"><Icon/></div><h3>{name}</h3><p>{text}</p></div>)}</div></SimplePage>}/>
  <Route path="/about" element={<SimplePage title="About BlueVows" eyebrow="OUR STORY"><p className="page-lead">A modern travel platform focused on simple planning, clear quotations and memorable Andaman experiences.</p></SimplePage>}/>
  <Route path="/contact" element={<Contact/>}/>
  <Route path="/admin" element={<Admin/>}/>
 </Routes><a className="whatsapp" href="https://wa.me/" aria-label="WhatsApp"><MessageCircle/></a><footer><div className="container footer-grid">
  <div className="footer-brand-block"><div className="brand footer-brand"><img className="brand-logo footer-logo" src="/bluevows-logo.png" alt="BlueVows" /></div><p>Thoughtfully planned island holidays in the Andaman Islands.</p><Link className="footer-trip-btn" to="/contact">Plan your trip <ArrowRight size={15}/></Link></div>
  <div><b>Explore</b><Link to="/">Home</Link><Link to="/destinations">Destinations</Link><Link to="/packages">Packages</Link><Link to="/activities">Activities</Link></div>
  <div><b>Contact</b><span><Phone size={15}/> +91 XXXXX XXXXX</span><span><Mail size={15}/> hello@example.com</span><Link to="/contact"><MessageCircle size={15}/> Send an enquiry</Link></div>
  <div className="footer-highlight"><span className="eyebrow light">LET'S PLAN</span><h3>Your island escape starts with one message.</h3><p>Share your dates and we'll prepare a clear quotation for you.</p><Link className="footer-trip-btn" to="/contact">Get a free quotation <ArrowRight size={15}/></Link></div>
</div><div className="container footer-bottom">© 2026 BlueVows. All rights reserved.<span>Made for island journeys.</span></div></footer></>
}
export default App;