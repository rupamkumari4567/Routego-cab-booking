import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
const Icon = ({ children, size=18 }) => <span className="icon" style={{fontSize: size}} aria-hidden="true">{children}</span>;
const ArrowRight=()=> <Icon>→</Icon>; const ArrowUpRight=()=> <Icon>↗</Icon>;
const BadgeCheck=()=> <Icon>✓</Icon>; const CalendarDays=()=> <Icon>▣</Icon>;
const CarFront=()=> <Icon>▱</Icon>; const Check=()=> <Icon>✓</Icon>;
const Clock3=()=> <Icon>◷</Icon>; const Compass=()=> <Icon>◉</Icon>;
const Headphones=()=> <Icon>◖</Icon>; const MapPin=()=> <Icon>●</Icon>;
const Menu=()=> <Icon>☰</Icon>; const MessageCircle=()=> <Icon>◌</Icon>;
const Minus=()=> <Icon>−</Icon>; const Plus=()=> <Icon>+</Icon>;
const Navigation=()=> <Icon>◆</Icon>; const Phone=()=> <Icon>☎</Icon>;
const Route=()=> <Icon>⌁</Icon>; const Search=()=> <Icon>⌕</Icon>;
const ShieldCheck=()=> <Icon>✓</Icon>; const Sparkles=()=> <Icon>✦</Icon>;
const Star=()=> <Icon>★</Icon>; const Users=()=> <Icon>♙</Icon>;
const X=()=> <Icon>×</Icon>; const Zap=()=> <Icon>ϟ</Icon>;
import "./styles.css";

const fleet = [
  { id:"ertiga", name:"Maruti Ertiga", type:"MPV", seats:7, bags:3, fuel:"Petrol", rate:17, base:1299, tag:"Family pick", accent:"lime", desc:"Extra space for family and airport trips." },
  { id:"dzire", name:"Maruti Dzire", type:"Sedan", seats:5, bags:2, fuel:"Petrol", rate:14, base:999, tag:"Best value", accent:"blue", desc:"Quiet, economical rides for everyday travel." },
  { id:"aura", name:"Hyundai Aura", type:"Sedan", seats:5, bags:2, fuel:"Petrol", rate:14, base:949, tag:"City favorite", accent:"violet", desc:"Smooth city rides with generous boot space." },
  { id:"ciaz", name:"Maruti Ciaz", type:"Premium", seats:5, bags:3, fuel:"Petrol", rate:18, base:1399, tag:"Premium", accent:"gold", desc:"A more refined ride for business and long trips." },
  { id:"innova", name:"Toyota Innova Crysta", type:"Premium MPV", seats:7, bags:4, fuel:"Diesel", rate:24, base:2199, tag:"Group travel", accent:"orange", desc:"Comfort-first travel for bigger groups." },
  { id:"scorpio", name:"Mahindra Scorpio", type:"SUV", seats:7, bags:4, fuel:"Diesel", rate:25, base:2299, tag:"Outstation", accent:"red", desc:"Confident SUV for highway and outstation journeys." }
];

const routes = [
  { from:"Muzaffarpur", to:"Patna", distance:75, price:1699, time:"2h 15m" },
  { from:"Patna", to:"Muzaffarpur", distance:75, price:1699, time:"2h 15m" },
  { from:"Muzaffarpur", to:"Darbhanga", distance:75, price:1599, time:"2h 10m" },
  { from:"Muzaffarpur", to:"Hajipur", distance:60, price:1399, time:"1h 45m" }
];

function CarArt({ accent="blue" }) {
  return (
    <div className={`car-art ${accent}`}>
      <div className="car-shadow"/>
      <div className="car-body">
        <div className="car-roof"/>
        <div className="car-window front"/>
        <div className="car-window back"/>
        <div className="car-light"/>
        <div className="car-grille"/>
        <div className="wheel left"/>
        <div className="wheel right"/>
      </div>
    </div>
  );
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(fleet[0]);
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem("routego-bookings") || "[]"));
  const [toast, setToast] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [form, setForm] = useState({
    from:"Muzaffarpur", to:"Patna", date:"", time:"09:00", trip:"One Way", passengers:2, name:"", phone:""
  });

  useEffect(() => {
    localStorage.setItem("routego-bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const categories = ["All","Sedan","MPV","Premium","SUV"];
  const filteredFleet = useMemo(() => activeFilter === "All"
    ? fleet
    : fleet.filter(c => c.type.includes(activeFilter)), [activeFilter]);

  const route = routes.find(r => r.from === form.from && r.to === form.to);
  const estimated = route ? route.price : selectedCar.base + Math.max(0, 60 - 40) * selectedCar.rate;
  const finalEstimate = form.trip === "Round Trip" ? Math.round(estimated * 1.82) : estimated;

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setMobileOpen(false);
  };

  const openBooking = (car = selectedCar) => {
    setSelectedCar(car);
    setBookingOpen(true);
    setForm(f => ({...f, date: f.date || new Date().toISOString().slice(0,10)}));
  };

  const update = (key, value) => setForm(f => ({...f, [key]:value}));

  const submitBooking = e => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date) {
      setToast("Please complete your name, phone and travel date.");
      return;
    }
    const booking = {
      id: "RG-" + Math.random().toString(36).slice(2,8).toUpperCase(),
      created: new Date().toISOString(),
      ...form,
      car: selectedCar.name,
      fare: finalEstimate
    };
    setBookings(prev => [booking, ...prev]);
    setBookingOpen(false);
    setToast(`Booking ${booking.id} confirmed — ${selectedCar.name}`);
  };

  return (
    <div className="app">
      <div className="topbar">
        <div className="container topbar-inner">
          <span><Clock3 size={15}/> Mon–Sun · 06:00–23:00</span>
          <span className="top-note">Reliable rides across Bihar</span>
          <a href="tel:+917677608709"><Phone size={15}/> +91 76776 08709</a>
        </div>
      </div>

      <header className="header">
        <div className="container nav">
          <button className="brand" onClick={() => scrollTo("home")}>
            <span className="brand-mark"><Route size={21}/></span>
            <span><b>Route<span>Go</span></b><small>Cab Services</small></span>
          </button>

          <nav className={mobileOpen ? "nav-links open" : "nav-links"}>
            {["home","fleet","services","pricing","how","contact"].map(id =>
              <button key={id} onClick={() => scrollTo(id)}>{id === "how" ? "How it works" : id[0].toUpperCase()+id.slice(1)}</button>
            )}
            <button className="nav-book" onClick={() => openBooking()}><Zap size={16}/> Book a cab</button>
          </nav>
          <button className="mobile-menu" onClick={() => setMobileOpen(v=>!v)} aria-label="Menu">
            {mobileOpen ? <X/> : <Menu/>}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-glow one"/><div className="hero-glow two"/>
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={15}/> Smart booking for Bihar</div>
              <h1>Go farther.<br/><span>Feel at ease.</span></h1>
              <p>Book clean, comfortable cabs between Muzaffarpur, Patna and nearby cities — with upfront fares and real human support.</p>
              <div className="hero-actions">
                <button className="btn primary" onClick={() => openBooking()}><CalendarDays size={18}/> Book your ride <ArrowRight size={18}/></button>
                <button className="btn ghost" onClick={() => scrollTo("fleet")}>Explore fleet <ArrowUpRight size={18}/></button>
              </div>
              <div className="trust-row">
                <div><ShieldCheck/><span><b>Verified drivers</b><small>Safety checked</small></span></div>
                <div><BadgeCheck/><span><b>Fixed fares</b><small>No surprise pricing</small></span></div>
                <div><Headphones/><span><b>Human support</b><small>7 days a week</small></span></div>
              </div>
            </div>

            <div className="booking-card">
              <div className="booking-card-head">
                <div><span className="mini-label">QUICK BOOKING</span><h3>Where are you going?</h3></div>
                <span className="live-dot"><i/> Live</span>
              </div>
              <div className="route-inputs">
                <label><span><MapPin size={16}/></span><small>Pickup</small>
                  <select value={form.from} onChange={e=>update("from",e.target.value)}>
                    {["Muzaffarpur","Patna","Hajipur","Darbhanga"].map(x=><option key={x}>{x}</option>)}
                  </select>
                </label>
                <button className="swap" onClick={() => setForm(f=>({...f,from:f.to,to:f.from}))}>↕</button>
                <label><span><Navigation size={16}/></span><small>Drop</small>
                  <select value={form.to} onChange={e=>update("to",e.target.value)}>
                    {["Patna","Muzaffarpur","Hajipur","Darbhanga"].map(x=><option key={x}>{x}</option>)}
                  </select>
                </label>
              </div>
              <div className="form-row">
                <label><small>Date</small><input type="date" value={form.date} onChange={e=>update("date",e.target.value)}/></label>
                <label><small>Time</small><input type="time" value={form.time} onChange={e=>update("time",e.target.value)}/></label>
              </div>
              <div className="trip-toggle">
                {["One Way","Round Trip"].map(x=><button className={form.trip===x?"active":""} key={x} onClick={()=>update("trip",x)}>{x}</button>)}
              </div>
              <div className="estimate"><span>Estimated fare</span><strong>₹{finalEstimate.toLocaleString("en-IN")}</strong></div>
              <button className="btn primary wide" onClick={()=>openBooking()}><Search size={18}/> Find available cabs</button>
              <p className="micro"><Check size={14}/> Free cancellation up to 2 hours before pickup</p>
            </div>
          </div>
        </section>

        <section className="route-strip">
          <div className="container route-strip-inner">
            <div className="route-scroll">
              {routes.map(r => <button key={r.from+r.to} onClick={()=>{update("from",r.from);update("to",r.to);openBooking()}}>
                <span>{r.from} <ArrowRight size={13}/> {r.to}</span><b>₹{r.price}</b><small>{r.time}</small>
              </button>)}
            </div>
          </div>
        </section>

        <section id="fleet" className="section">
          <div className="container">
            <div className="section-head">
              <div><span className="eyebrow dark"><CarFront size={15}/> Our fleet</span><h2>Pick your <span>perfect ride.</span></h2></div>
              <div className="filter-tabs">{categories.map(c=><button className={activeFilter===c?"active":""} onClick={()=>setActiveFilter(c)} key={c}>{c}</button>)}</div>
            </div>
            <div className="fleet-grid">
              {filteredFleet.map(car => <article className="car-card" key={car.id}>
                <div className="car-visual"><span className={`tag ${car.accent}`}>{car.tag}</span><CarArt accent={car.accent}/></div>
                <div className="car-info">
                  <div className="car-title"><div><h3>{car.name}</h3><span>{car.type}</span></div><strong>₹{car.base.toLocaleString("en-IN")}<small> starting</small></strong></div>
                  <p>{car.desc}</p>
                  <div className="specs"><span><Users size={15}/>{car.seats} seats</span><span>◉ {car.fuel}</span><span>▣ {car.bags} bags</span></div>
                  <button className="outline-btn" onClick={()=>openBooking(car)}>Book {car.name.split(" ")[1] || "ride"} <ArrowRight size={16}/></button>
                </div>
              </article>)}
            </div>
          </div>
        </section>

        <section id="services" className="section soft">
          <div className="container">
            <div className="section-head compact"><div><span className="eyebrow dark"><Compass size={15}/> Ride options</span><h2>More than a <span>cab.</span></h2></div><p>Choose a service that fits your day. Every ride includes a verified driver and clear pricing.</p></div>
            <div className="service-grid">
              {[
                ["01","One-way","Point-to-point travel without paying for a return journey.","↗"],
                ["02","Round trip","Keep the same cab for your return and save planning time.","↻"],
                ["03","Airport transfer","On-time pickup with space for your bags and family.","✈"],
                ["04","Outstation","Comfortable highway travel to nearby cities and towns.","⌁"],
              ].map(([n,t,d,i])=><div className="service-card" key={n}><span className="service-no">{n}</span><i>{i}</i><h3>{t}</h3><p>{d}</p><button onClick={()=>openBooking()}>Book now <ArrowUpRight size={15}/></button></div>)}
            </div>
          </div>
        </section>

        <section id="pricing" className="section pricing-section">
          <div className="container pricing-grid">
            <div>
              <span className="eyebrow dark"><BadgeCheck size={15}/> Simple pricing</span>
              <h2>Know the fare<br/><span>before you go.</span></h2>
              <p className="lead">No bargaining at pickup. Our estimated fare is calculated from the selected route and vehicle, so you can plan with confidence.</p>
              <div className="price-points">
                <div><Check/><span><b>Route fare</b><small>Fixed price on popular routes</small></span></div>
                <div><Check/><span><b>Transparent extras</b><small>Extra km and waiting shown clearly</small></span></div>
                <div><Check/><span><b>Digital confirmation</b><small>Booking ID saved on your device</small></span></div>
              </div>
            </div>
            <div className="fare-card">
              <div className="fare-top"><span>POPULAR ROUTE</span><b>Muzaffarpur → Patna</b></div>
              <div className="fare-price">₹1,699 <small>/ one way</small></div>
              <div className="fare-line"><span>Distance</span><b>~75 km</b></div>
              <div className="fare-line"><span>Travel time</span><b>~2h 15m</b></div>
              <div className="fare-line"><span>Driver</span><b>Verified</b></div>
              <button className="btn primary wide" onClick={()=>{update("from","Muzaffarpur");update("to","Patna");openBooking()}}>Reserve this route <ArrowRight size={18}/></button>
              <small className="fare-note">Final fare can vary for special stops, tolls or route changes.</small>
            </div>
          </div>
        </section>

        <section id="how" className="section">
          <div className="container">
            <div className="center-head"><span className="eyebrow dark"><Zap size={15}/> How it works</span><h2>Three steps. <span>Zero stress.</span></h2></div>
            <div className="steps">
              {[
                ["01","Tell us your route","Choose pickup, destination, date and trip type."],
                ["02","Choose your ride","Compare seats, luggage, vehicle type and starting fare."],
                ["03","Ride with confidence","Get a booking ID and contact details for your trip."]
              ].map(([n,t,d])=><div className="step" key={n}><b>{n}</b><div className="step-line"/><h3>{t}</h3><p>{d}</p></div>)}
            </div>
          </div>
        </section>

        <section className="section testimonial-section">
          <div className="container">
            <div className="review-card">
              <div className="review-mark">“</div>
              <div><div className="stars">{[1,2,3,4,5].map(x=><Star key={x} size={17} fill="currentColor"/>)}</div><blockquote>“The fixed fare made the Patna trip so easy to plan. The booking confirmation was clear and the Ertiga was comfortable for our family.”</blockquote><div className="reviewer"><div className="avatar">A</div><span><b>Arun Kumar</b><small>Muzaffarpur · Family trip</small></span></div></div>
              <div className="review-stat"><strong>4.9</strong><span>average rating</span><small>from local riders</small></div>
            </div>
          </div>
        </section>

        <section id="contact" className="cta-section">
          <div className="container cta">
            <div><span className="eyebrow">Need a ride?</span><h2>Let's get you <span>moving.</span></h2><p>Book online or talk to our support team for a custom trip.</p></div>
            <div className="cta-actions"><button className="btn light" onClick={()=>openBooking()}><CalendarDays size={18}/> Book online</button><a className="btn dark" href="https://wa.me/917677608709" target="_blank" rel="noreferrer"><MessageCircle size={18}/> WhatsApp</a></div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div><button className="brand footer-brand" onClick={()=>scrollTo("home")}><span className="brand-mark"><Route size={21}/></span><span><b>Route<span>Go</span></b><small>Cab Services</small></span></button><p>Comfortable, transparent cab travel across Muzaffarpur, Patna and Bihar.</p></div>
          <div><h4>Explore</h4><button onClick={()=>scrollTo("fleet")}>Our fleet</button><button onClick={()=>scrollTo("services")}>Services</button><button onClick={()=>scrollTo("pricing")}>Pricing</button></div>
          <div><h4>Popular routes</h4><button onClick={()=>openBooking()}>Muzaffarpur → Patna</button><button onClick={()=>openBooking()}>Patna → Muzaffarpur</button><button onClick={()=>openBooking()}>Muzaffarpur → Darbhanga</button></div>
          <div><h4>Contact</h4><a href="tel:+917677608709">+91 76776 08709</a><a href="mailto:hello@routego.in">hello@routego.in</a><span>Muzaffarpur, Bihar</span></div>
        </div>
        <div className="container copyright"><span>© 2026 RouteGo Cab Services</span><span>Local demo · bookings are stored in your browser</span></div>
      </footer>

      {bookingOpen && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget && setBookingOpen(false)}>
        <div className="modal">
          <div className="modal-head"><div><span className="mini-label">BOOK YOUR RIDE</span><h2>Let's plan your trip</h2></div><button onClick={()=>setBookingOpen(false)}><X/></button></div>
          <form onSubmit={submitBooking}>
            <div className="modal-route"><div><small>FROM</small><b>{form.from}</b></div><ArrowRight/><div><small>TO</small><b>{form.to}</b></div></div>
            <div className="form-grid">
              <label>Pickup date<input required type="date" min={new Date().toISOString().slice(0,10)} value={form.date} onChange={e=>update("date",e.target.value)}/></label>
              <label>Pickup time<input required type="time" value={form.time} onChange={e=>update("time",e.target.value)}/></label>
              <label>Passengers<div className="counter"><button type="button" onClick={()=>update("passengers",Math.max(1,form.passengers-1))}><Minus size={16}/></button><b>{form.passengers}</b><button type="button" onClick={()=>update("passengers",Math.min(7,form.passengers+1))}><Plus size={16}/></button></div></label>
              <label>Trip type<select value={form.trip} onChange={e=>update("trip",e.target.value)}><option>One Way</option><option>Round Trip</option></select></label>
              <label className="full">Your name<input required placeholder="Enter your name" value={form.name} onChange={e=>update("name",e.target.value)}/></label>
              <label className="full">Mobile number<input required inputMode="numeric" pattern="[0-9+ ]{10,15}" placeholder="+91 98xxxxxx" value={form.phone} onChange={e=>update("phone",e.target.value)}/></label>
            </div>
            <div className="selected-ride"><CarArt accent={selectedCar.accent}/><div><small>SELECTED RIDE</small><b>{selectedCar.name}</b><span>{selectedCar.seats} seats · {selectedCar.fuel} · {selectedCar.rate}/km</span></div><strong>₹{finalEstimate.toLocaleString("en-IN")}</strong></div>
            <button className="btn primary wide" type="submit">Confirm booking <ArrowRight size={18}/></button>
            <p className="micro"><ShieldCheck size={14}/> Your booking details stay on this device for this demo.</p>
          </form>
        </div>
      </div>}

      {toast && <div className="toast"><Check size={18}/><span>{toast}</span></div>}

      {bookings.length > 0 && <button className="booking-count" onClick={()=>setToast(`${bookings.length} booking${bookings.length>1?"s":""} saved on this device`)}>
        <CalendarDays size={16}/> {bookings.length} saved
      </button>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
