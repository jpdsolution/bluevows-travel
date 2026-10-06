import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import {
  Menu, X, MapPin, CalendarDays, Users, ArrowRight, Star,
  CheckCircle2, Phone, Mail, MessageCircle, ShieldCheck,
  Compass, Hotel, Waves, Send, LayoutDashboard, Settings,
  FileText, CreditCard, Image as ImageIcon, Package, LogOut
} from "lucide-react";

const destinations = [
  {name:"Havelock Island", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85", text:"White-sand beaches, clear water and unforgettable island experiences."},
  {name:"Neil Island", image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85", text:"Quiet beaches, coral reefs and a slower island escape."},
  {name:"Port Blair", image:"https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85", text:"Your gateway to the islands, history and coastal experiences."}
];

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
        <Link to="/destinations" onClick={()=>setOpen(false)}>Destinations</Link>
        <Link to="/packages" onClick={()=>setOpen(false)}>Packages</Link>
        <Link to="/hotels" onClick={()=>setOpen(false)}>Hotels</Link>
        <Link to="/activities" onClick={()=>setOpen(false)}>Activities</Link>
        <Link to="/about" onClick={()=>setOpen(false)}>About</Link>
        <Link className="nav-cta" to="/contact" onClick={()=>setOpen(false)}>Get a Quote</Link>
      </nav>
    </div>
  </header>
}

function Hero(){
 return <section className="hero">
   <div className="hero-image"></div>
   <div className="hero-overlay"></div>
   <div className="container hero-content">
     <span className="eyebrow light">YOUR ISLAND JOURNEY STARTS HERE</span>
     <h1>Experience the<br/><em>Andaman</em></h1>
     <p>Thoughtfully planned island holidays, handpicked stays and experiences made around you.</p>
     <div className="hero-actions">
       <Link className="btn primary" to="/packages">Explore Packages <ArrowRight size={18}/></Link>
       <Link className="btn ghost" to="/contact">Plan My Trip</Link>
     </div>
   </div>
   <div className="container planner-wrap">
     <div className="planner">
       <div className="field"><MapPin/><div><small>Destination</small><strong>Andaman</strong></div></div>
       <div className="field"><CalendarDays/><div><small>Travel Date</small><strong>Select date</strong></div></div>
       <div className="field"><Users/><div><small>Travellers</small><strong>2 Adults</strong></div></div>
       <Link className="planner-btn" to="/packages">Search Packages</Link>
     </div>
   </div>
 </section>
}

function DestinationCard({d}){ return <Link className="destination-card" to="/destinations">
  <img src={d.image} alt={d.name}/><div className="destination-shade"></div>
  <div className="destination-info"><span>Explore</span><h3>{d.name}</h3><p>{d.text}</p></div>
</Link>}

function PackageCard({p}){ return <div className="package-card">
  <div className="package-image"><img src={p.image} alt={p.name}/><span>{p.tag}</span></div>
  <div className="package-body"><div className="package-days">{p.days}</div><h3>{p.name}</h3><div className="package-bottom"><div><small>Starting from</small><strong>{p.price}</strong></div><Link to="/contact" className="icon-btn" aria-label="Get quote"><ArrowRight/></Link></div></div>
</div>}

function Home(){
 return <>
  <Hero/>
  <main>
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
      <div className="activity-grid">{activities.map(({name,icon:Icon,text})=><div className="activity-card" key={name}><div className="activity-icon"><Icon/></div><h3>{name}</h3><p>{text}</p></div>)}</div>
    </div></section>

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

function Listing({type}){ const data=type==="Packages"?packages:destinations; return <main className="page"><div className="container"><span className="eyebrow">ANDAMAN TRIPS</span><h1 className="page-title">{type}</h1><p className="page-lead">Explore our {type.toLowerCase()} and choose what fits your journey.</p><div className={type==="Packages"?"package-grid":"destination-grid"}>{data.map((x,i)=>type==="Packages"?<PackageCard p={x} key={i}/>:<DestinationCard d={x} key={i}/>)}</div></div></main> }

function SimplePage({title,eyebrow,children}){return <main className="page"><div className="container narrow"><span className="eyebrow">{eyebrow}</span><h1 className="page-title">{title}</h1>{children}</div></main>}

function Contact(){return <SimplePage title="Plan your trip" eyebrow="GET IN TOUCH"><p className="page-lead">Share your travel plans and our team will prepare a quotation for you.</p><form className="contact-form" onSubmit={e=>e.preventDefault()}><div className="form-grid"><label>Full name<input placeholder="Your name"/></label><label>Phone number<input placeholder="+91"/></label><label>Email<input type="email" placeholder="you@example.com"/></label><label>Travel date<input type="date"/></label><label>Adults<input type="number" min="1" defaultValue="2"/></label><label>Children<input type="number" min="0" defaultValue="0"/></label></div><label>Message<textarea rows="5" placeholder="Tell us about your trip"></textarea></label><button className="btn primary submit"><Send size={17}/> Send Enquiry</button></form></SimplePage>}

function Admin(){return <main className="admin-page"><div className="admin-shell"><aside className="admin-side"><div className="brand admin-brand"><img className="brand-logo admin-logo" src="/bluevows-logo.png" alt="BlueVows" /> <span>ADMIN</span></div>{["Dashboard","Enquiries","Quotations","Bookings","Customers","Packages","Hotels","Activities","Gallery","Reviews","Website Content","Email Templates","QR / Payment","Settings"].map((x,i)=><div className={i===0?"admin-link active":"admin-link"} key={x}><LayoutDashboard size={17}/>{x}</div>)}<div className="admin-link logout"><LogOut size={17}/>Logout</div></aside><section className="admin-main"><div className="admin-top"><div><span className="eyebrow">CONTROL CENTER</span><h1>Dashboard</h1></div><div className="admin-user">Admin</div></div><div className="stats">{[["Enquiries","24"],["Quotations","12"],["Confirmed","7"],["Pending Payment","4"]].map(x=><div className="stat" key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}</div><div className="admin-grid"><div className="admin-card"><div className="admin-card-head"><h3>Recent enquiries</h3><span>View all</span></div>{["Rahul Sharma","Priya Singh","Arjun Das","Meera Nair"].map((x,i)=><div className="enquiry-row" key={x}><div><b>{x}</b><span>{i+2} Adults · {5+i}N / {6+i}D</span></div><span className="status">{i===0?"New":"Pending"}</span></div>)}</div><div className="admin-card"><div className="admin-card-head"><h3>Quick actions</h3></div><div className="quick-actions"><button><FileText/>Create quotation</button><button><Package/>Add package</button><button><ImageIcon/>Upload gallery</button><CreditCard/> <span className="qr-label">Manage QR</span></div></div></div></section></div></main>}

function App(){
 return <><Header/><Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/destinations" element={<Listing type="Destinations"/>}/>
  <Route path="/packages" element={<Listing type="Packages"/>}/>
  <Route path="/hotels" element={<SimplePage title="Hotels & Resorts" eyebrow="STAY COMFORTABLY"><p className="page-lead">A clean hotel directory will be connected to Supabase in the next setup stage.</p></SimplePage>}/>
  <Route path="/activities" element={<SimplePage title="Activities" eyebrow="EXPERIENCES"><div className="activity-grid">{activities.map(({name,icon:Icon,text})=><div className="activity-card" key={name}><div className="activity-icon"><Icon/></div><h3>{name}</h3><p>{text}</p></div>)}</div></SimplePage>}/>
  <Route path="/about" element={<SimplePage title="About BlueVows" eyebrow="OUR STORY"><p className="page-lead">A modern travel platform focused on simple planning, clear quotations and memorable Andaman experiences.</p></SimplePage>}/>
  <Route path="/contact" element={<Contact/>}/>
  <Route path="/admin" element={<Admin/>}/>
 </Routes><a className="whatsapp" href="https://wa.me/" aria-label="WhatsApp"><MessageCircle/></a><footer><div className="container footer-grid"><div><div className="brand footer-brand"><img className="brand-logo footer-logo" src="/bluevows-logo.png" alt="BlueVows" /></div><p>Thoughtfully planned island holidays in the Andaman Islands.</p></div><div><b>Explore</b><Link to="/destinations">Destinations</Link><Link to="/packages">Packages</Link><Link to="/activities">Activities</Link></div><div><b>Contact</b><span><Phone size={15}/> +91 XXXXX XXXXX</span><span><Mail size={15}/> hello@example.com</span></div></div><div className="container footer-bottom">© 2026 BlueVows. All rights reserved.</div></footer></>
}
export default App;