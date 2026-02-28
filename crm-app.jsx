import { useState, useMemo, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #060d1a; color: #e2e8f0; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #0d1526; }
  ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #2563eb; }
  .nav-item { transition: all 0.15s ease; cursor: pointer; border-radius: 8px; }
  .nav-item:hover { background: rgba(37,99,235,0.13); }
  .nav-item.active { background: rgba(37,99,235,0.22); }
  .nav-item.active .nav-bar { background: #3b82f6; }
  .nav-bar { width: 3px; border-radius: 2px; align-self: stretch; background: transparent; flex-shrink: 0; }
  .btn { transition: all 0.15s ease; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; }
  .btn:hover { transform: translateY(-1px); }
  .btn:active { transform: translateY(0); }
  .table-row:hover { background: rgba(37,99,235,0.07); }
  .badge { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; white-space: nowrap; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.78); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: #0a1628; border: 1px solid #1e3a5f; border-radius: 14px; width: 100%; max-height: 92vh; overflow-y: auto; box-shadow: 0 0 60px rgba(0,0,0,0.7); }
  .input { background: #060d1a; border: 1px solid #1e3a5f; border-radius: 8px; color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 9px 13px; width: 100%; transition: border-color 0.15s; outline: none; }
  .input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .input option { background: #0a1628; }
  .stat-card { background: linear-gradient(135deg, #0a1628 0%, #0f1f3d 100%); border: 1px solid #1e3a5f; border-radius: 12px; padding: 18px; }
  select.input { appearance: none; }
  textarea.input { resize: vertical; min-height: 76px; }
  .action-btn { background: transparent; border: 1px solid #1e3a5f; color: #94a3b8; border-radius: 6px; padding: 5px 10px; font-size: 12px; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif; display: inline-flex; align-items: center; gap: 4px; }
  .action-btn:hover { border-color: #3b82f6; color: #60a5fa; }
  .action-btn.danger:hover { border-color: #ef4444; color: #f87171; }
  .tag { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #93c5fd; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 500; display: inline-block; }
  .tag-pink { background: rgba(236,72,153,0.1); border: 1px solid rgba(236,72,153,0.25); color: #f9a8d4; }
  .tag-green { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #6ee7b7; }
  .tag-amber { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: #fcd34d; }
  .nav-divider { font-size: 10px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 1.4px; padding: 14px 12px 4px; }
  .progress-bar-bg { background: #1e3a5f; border-radius: 99px; height: 6px; overflow: hidden; }
  .progress-bar-fill { height: 100%; border-radius: 99px; transition: width 0.4s ease; }
  .mktg-header { background: linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(59,130,246,0.08) 100%); border: 1px solid rgba(168,85,247,0.2); border-radius: 14px; padding: 20px 24px; margin-bottom: 24px; display: flex; align-items: center; gap: 16px; }
  .campaign-card { background: #0a1628; border: 1px solid #1e3a5f; border-radius: 12px; padding: 18px; transition: all 0.2s; cursor: pointer; }
  .campaign-card:hover { border-color: #a855f7; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(168,85,247,0.1); }
  .event-card { background: #0a1628; border: 1px solid #1e3a5f; border-radius: 12px; padding: 16px 18px; transition: all 0.2s; cursor: pointer; }
  .event-card:hover { border-color: #06b6d4; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(6,182,212,0.1); }
  .goal-meter { background: #0a1628; border: 1px solid #1e3a5f; border-radius: 12px; padding: 16px 18px; }
  .picker-grid { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; background: #060d1a; border: 1px solid #1e3a5f; border-radius: 8px; }
  .picker-chip { cursor: pointer; padding: 5px 12px; border-radius: 6px; font-size: 13px; transition: all 0.15s; user-select: none; }
  .li-row { display: grid; grid-template-columns: 1fr 72px 130px 90px 36px; gap: 8px; align-items: center; padding: 7px 12px; background: #060d1a; border: 1px solid #1e3a5f; border-radius: 8px; margin-bottom: 6px; }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
const genId    = () => Math.random().toString(36).slice(2, 10);
const today    = () => new Date().toISOString().split("T")[0];
const liTotal  = li  => (+li.qty || 0) * (+li.unitPrice || 0);
const invTotal = inv => (inv.lineItems || []).reduce((s, li) => s + liTotal(li), 0);
const pct      = (cur, tgt) => tgt > 0 ? Math.min(100, Math.round((cur / tgt) * 100)) : 0;
const fmt$     = n => `$${Number(n).toLocaleString()}`;

/* ─────────────────────────────────────────────────────────────────────────────
   SEED DATA
───────────────────────────────────────────────────────────────────────────── */
const SEED = {
  companies: [
    { id:"c1", name:"ACME Corp",         industry:"Manufacturing", phone:"555-0100", email:"info@acmecorp.com",   website:"acmecorp.com",   address:"1 Industrial Way, Springfield, IL 62701", createdAt:"2023-03-15" },
    { id:"c2", name:"Globex Solutions",   industry:"Technology",    phone:"555-0200", email:"contact@globex.com",  website:"globex.com",     address:"200 Tech Park Dr, Austin, TX 73301",      createdAt:"2023-06-01" },
    { id:"c3", name:"Initech Ltd",        industry:"Finance",       phone:"555-0300", email:"hello@initech.com",   website:"initech.com",    address:"300 Finance Blvd, New York, NY 10001",    createdAt:"2023-09-10" },
    { id:"c4", name:"Umbrella Dynamics",  industry:"Consulting",    phone:"555-0400", email:"ops@umbrella.io",     website:"umbrella.io",    address:"404 Executive Dr, Chicago, IL 60601",     createdAt:"2024-01-20" },
  ],
  contacts: [
    { id:"ct1", name:"John Doe",    email:"john.doe@acmecorp.com",    phone:"555-1001", title:"VP of Operations",      companyId:"c1", createdAt:"2023-03-20" },
    { id:"ct2", name:"Jane Doe",    email:"jane.doe@acmecorp.com",    phone:"555-1002", title:"Head of Procurement",   companyId:"c1", createdAt:"2023-03-22" },
    { id:"ct3", name:"Bob Smith",   email:"bob.smith@globex.com",     phone:"555-2001", title:"CTO",                   companyId:"c2", createdAt:"2023-06-05" },
    { id:"ct4", name:"Alice Brown", email:"alice.brown@initech.com",  phone:"555-3001", title:"CFO",                   companyId:"c3", createdAt:"2023-09-15" },
    { id:"ct5", name:"Carlos Vega", email:"carlos@umbrella.io",       phone:"555-4001", title:"Managing Director",     companyId:"c4", createdAt:"2024-01-25" },
    { id:"ct6", name:"Linda Park",  email:"linda.park@freelance.com", phone:"555-5001", title:"Independent Consultant",companyId:null, createdAt:"2024-03-01" },
  ],
  // leads now carry optional eventId
  leads: [
    { id:"l1", contactId:"ct1", status:"Qualified",   source:"Website",    eventId:"ev1", notes:"John inquired about bulk widget orders for Q3. Budget confirmed at $50K+.",         createdAt:"2024-01-10", converted:true  },
    { id:"l2", contactId:"ct2", status:"Working",     source:"Trade Show", eventId:"ev2", notes:"Jane attended MfgExpo 2024 — booth visit. Interested in Premium Widget bundle.",   createdAt:"2024-02-14", converted:false },
    { id:"l3", contactId:"ct3", status:"New",         source:"Referral",   eventId:null,  notes:"Bob referred by mutual contact. Exploring widget integration for dev infra.",       createdAt:"2024-03-05", converted:false },
    { id:"l4", contactId:"ct4", status:"Qualified",   source:"Cold Call",  eventId:"ev3", notes:"Alice requested full product demo before signing multi-year maintenance contract.",  createdAt:"2024-03-20", converted:true  },
    { id:"l5", contactId:"ct5", status:"Working",     source:"Email",      eventId:"ev3", notes:"Carlos downloaded product catalogue. Followed up — high purchase intent for Q3.",   createdAt:"2024-04-08", converted:false },
    { id:"l6", contactId:"ct6", status:"Unqualified", source:"Social",     eventId:null,  notes:"Linda interested but budget constraints push deal to next fiscal year.",             createdAt:"2024-04-15", converted:false },
  ],
  opportunities: [
    { id:"o1", leadId:"l1", contactId:"ct1", title:"ACME Corp Q3 Widget Order",     value:52000, stage:"Negotiation/Review", productIds:["p1","p2","p3"], closeDate:"2024-07-31", createdAt:"2024-02-01" },
    { id:"o2", leadId:"l4", contactId:"ct4", title:"Initech Widget Pro Contract",   value:28500, stage:"Proposal",           productIds:["p2","p4"],      closeDate:"2024-08-15", createdAt:"2024-04-01" },
    { id:"o3", leadId:"l1", contactId:"ct1", title:"ACME Annual Maintenance Deal",  value:14400, stage:"Closed Won",         productIds:["p5"],           closeDate:"2024-05-01", createdAt:"2024-03-15" },
  ],
  products: [
    { id:"p1", name:"ACME Widget Standard",   sku:"WGT-001", price:149.99,  description:"Standard-grade all-purpose industrial widget. 12-month warranty included.",      createdAt:"2022-11-01" },
    { id:"p2", name:"ACME Widget Pro",         sku:"WGT-002", price:299.99,  description:"Professional-grade widget with enhanced torque rating and heat resistance.",      createdAt:"2022-11-01" },
    { id:"p3", name:"ACME Widget Premium",     sku:"WGT-003", price:499.99,  description:"Top-of-line widget with lifetime warranty and titanium alloy housing.",           createdAt:"2023-01-15" },
    { id:"p4", name:"Widget Mounting Kit",     sku:"KIT-001", price:49.99,   description:"Universal mounting hardware kit compatible with all ACME Widget models.",         createdAt:"2023-02-01" },
    { id:"p5", name:"Annual Maintenance Plan", sku:"SVC-001", price:1200.00, description:"Annual service contract — parts, labor & 2 on-site service visits included.",     createdAt:"2023-03-01" },
    { id:"p6", name:"Widget Lubricant (6-pk)", sku:"SUP-001", price:24.99,   description:"OEM-approved lubricant pack, case of 6 canisters. Required for warranty upkeep.",createdAt:"2023-06-01" },
  ],
  invoices: [
    { id:"inv1", contactId:"ct1", status:"Paid",    dueDate:"2024-05-15", createdAt:"2024-04-15", lineItems:[{ id:"li1a", productId:"p1", qty:50, unitPrice:149.99 },{ id:"li1b", productId:"p4", qty:50, unitPrice:49.99 },{ id:"li1c", productId:"p6", qty:10, unitPrice:24.99 }] },
    { id:"inv2", contactId:"ct2", status:"Sent",    dueDate:"2024-07-01", createdAt:"2024-06-01", lineItems:[{ id:"li2a", productId:"p2", qty:20, unitPrice:299.99 },{ id:"li2b", productId:"p3", qty:5,  unitPrice:499.99 }] },
    { id:"inv3", contactId:"ct4", status:"Draft",   dueDate:"2024-08-30", createdAt:"2024-06-20", lineItems:[{ id:"li3a", productId:"p2", qty:15, unitPrice:299.99 },{ id:"li3b", productId:"p4", qty:15, unitPrice:49.99 },{ id:"li3c", productId:"p5", qty:1, unitPrice:1200.00 }] },
    { id:"inv4", contactId:"ct1", status:"Overdue", dueDate:"2024-04-01", createdAt:"2024-03-01", lineItems:[{ id:"li4a", productId:"p5", qty:1, unitPrice:1200.00 }] },
  ],

  /* ── MARKETING AUTOMATION ── */
  campaigns: [
    { id:"camp1", name:"Q2 Widget Launch",           type:"Email",      status:"Active",    startDate:"2024-04-01", endDate:"2024-06-30", budget:12000, description:"Multi-touch email nurture campaign targeting manufacturing leads for the new Widget Pro line. Drip series of 6 emails over 8 weeks.", createdAt:"2024-03-20" },
    { id:"camp2", name:"MfgExpo 2024 Trade Show",    type:"Event",      status:"Completed", startDate:"2024-02-10", endDate:"2024-02-12", budget:25000, description:"Full trade show presence at MfgExpo 2024 in Chicago. Includes booth, sponsorship, speaking slot, and post-show follow-up sequences.", createdAt:"2024-01-15" },
    { id:"camp3", name:"Spring Webinar Series",      type:"Webinar",    status:"Active",    startDate:"2024-04-15", endDate:"2024-06-15", budget:4500,  description:"Bi-weekly product education webinars targeting mid-market prospects. Focus on ROI and integration use cases.", createdAt:"2024-03-28" },
    { id:"camp4", name:"Paid Search — Widget Pro",   type:"Paid Ads",   status:"Paused",    startDate:"2024-03-01", endDate:"2024-09-30", budget:18000, description:"Google Ads and LinkedIn Sponsored Content campaign targeting procurement decision-makers in manufacturing and logistics.", createdAt:"2024-02-25" },
  ],
  events: [
    { id:"ev1", campaignId:"camp2", name:"MfgExpo 2024 — Main Booth",      type:"Trade Show", status:"Completed", date:"2024-02-10", endDate:"2024-02-12", location:"McCormick Place, Chicago, IL",    leadIds:["l1","l2"],   description:"3-day trade show booth. 200+ attendees engaged. Live demo station with Widget Pro and Widget Premium displays. Collected 47 business cards.", createdAt:"2024-01-20" },
    { id:"ev2", campaignId:"camp2", name:"MfgExpo 2024 — Keynote Talk",     type:"Conference", status:"Completed", date:"2024-02-11", endDate:"2024-02-11", location:"McCormick Place — Hall B, Chicago",leadIds:["l2"],        description:"30-minute keynote on 'The Future of Industrial Widgets' delivered by our CEO. Approx. 320 attendees. Recording available on our website.", createdAt:"2024-01-20" },
    { id:"ev3", campaignId:"camp3", name:"Widget Pro Webinar — April",      type:"Webinar",    status:"Completed", date:"2024-04-18", endDate:"2024-04-18", location:"Zoom (Online)",                    leadIds:["l4","l5"],   description:"Live product demo + Q&A session showcasing Widget Pro's new torque rating and heat resistance features. 68 registrants, 41 attended live.", createdAt:"2024-04-01" },
    { id:"ev4", campaignId:"camp3", name:"Widget ROI Workshop — May",       type:"Workshop",   status:"Upcoming",  date:"2024-05-16", endDate:"2024-05-16", location:"Zoom (Online)",                    leadIds:[],            description:"Interactive ROI calculator workshop for procurement managers. Walk-through of cost-savings analysis templates. Max 30 attendees.", createdAt:"2024-04-20" },
    { id:"ev5", campaignId:"camp1", name:"Q2 Email Nurture — Kickoff Call", type:"Demo",       status:"Upcoming",  date:"2024-05-22", endDate:"2024-05-22", location:"Google Meet (Online)",             leadIds:[],            description:"Personalised 1:1 discovery call for hot leads from Q2 email sequence. Agenda: pain points, demo, pricing walkthrough.", createdAt:"2024-04-25" },
  ],
  goals: [
    { id:"g1", campaignId:"camp1", name:"Qualified Leads Generated",  metric:"Leads Generated", targetValue:80,    currentValue:34,  unit:"leads",    dueDate:"2024-06-30", notes:"Counting MQL threshold: opened ≥3 emails AND clicked CTA.", createdAt:"2024-03-20" },
    { id:"g2", campaignId:"camp1", name:"Pipeline Revenue Influenced", metric:"Revenue",         targetValue:150000, currentValue:94900, unit:"$",     dueDate:"2024-06-30", notes:"Tracks deals where contact received ≥1 email from this campaign.", createdAt:"2024-03-20" },
    { id:"g3", campaignId:"camp2", name:"Booth Attendees",             metric:"Attendees",       targetValue:200,   currentValue:247, unit:"people",   dueDate:"2024-02-12", notes:"Total unique badge scans at our booth across all 3 days.", createdAt:"2024-01-15" },
    { id:"g4", campaignId:"camp2", name:"Leads Captured at Show",      metric:"Leads Generated", targetValue:50,    currentValue:47,  unit:"leads",    dueDate:"2024-02-12", notes:"Business cards + badge scans captured via lead retrieval device.", createdAt:"2024-01-15" },
    { id:"g5", campaignId:"camp3", name:"Webinar Registrations",       metric:"Registrations",   targetValue:150,   currentValue:68,  unit:"signups",  dueDate:"2024-06-15", notes:"Cumulative registrations across all sessions in the series.", createdAt:"2024-03-28" },
    { id:"g6", campaignId:"camp3", name:"Avg Attendee Rating",         metric:"Satisfaction",    targetValue:4.5,   currentValue:4.7, unit:"/ 5",      dueDate:"2024-06-15", notes:"Post-session survey — avg score across all webinars in series.", createdAt:"2024-03-28" },
    { id:"g7", campaignId:"camp4", name:"Ad Click-Through Rate",       metric:"Clicks",          targetValue:3.5,   currentValue:2.1, unit:"% CTR",    dueDate:"2024-09-30", notes:"Target 3.5% CTR on LinkedIn Sponsored Content placements.", createdAt:"2024-02-25" },
    { id:"g8", campaignId:"camp4", name:"Cost Per Lead",               metric:"Cost Per Lead",   targetValue:120,   currentValue:165, unit:"$/lead",   dueDate:"2024-09-30", notes:"Target CPL ≤ $120. Currently above target — bid adjustments in progress.", createdAt:"2024-02-25" },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────────
   BADGE PALETTES
───────────────────────────────────────────────────────────────────────────── */
const statusColors   = { New:"2563eb,1e3a8a", Qualified:"059669,064e3b", Working:"d97706,3b1a06", Unqualified:"6b7280,1f2937", Converted:"7c3aed,4c1d95" };
const invColors      = { Draft:"6b7280,1f2937", Sent:"2563eb,1e3a8a", Paid:"059669,064e3b", Overdue:"dc2626,450a0a", Cancelled:"6b7280,1f2937" };
const campStatusC    = { Planning:"6b7280,1f2937", Active:"059669,064e3b", Paused:"d97706,3b1a06", Completed:"7c3aed,4c1d95", Cancelled:"dc2626,450a0a" };
const eventStatusC   = { Upcoming:"2563eb,1e3a8a", "In Progress":"d97706,3b1a06", Completed:"059669,064e3b", Cancelled:"dc2626,450a0a" };
const stageColor     = s => s==="Closed Won"?"059669,052e16":s==="Closed Lost"?"dc2626,450a0a":s?.includes("Neg")?"d97706,3b1a06":"7c3aed,4c1d95";

const Bdg = ({ text, colors }) => {
  const [fg, bg] = (colors || "2563eb,1e3a8a").split(",");
  return <span className="badge" style={{ background:`#${bg}55`, color:`#${fg}`, border:`1px solid #${fg}66` }}>{text}</span>;
};

/* ─────────────────────────────────────────────────────────────────────────────
   ICON LIBRARY
───────────────────────────────────────────────────────────────────────────── */
const Icon = ({ name, size=16, color="currentColor" }) => {
  const paths = {
    companies:     <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>,
    contacts:      <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    leads:         <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    opportunities: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    products:      <><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    invoices:      <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    dashboard:     <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    campaigns:     <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/><path d="M3 3l18 18" style={{display:"none"}}/></>,
    events:        <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></>,
    goals:         <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    megaphone:     <><path d="M3 11l19-9-9 19-2-8-8-2z"/></>,
    plus:          <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    minus:         <><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit:          <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:         <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></>,
    convert:       <><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></>,
    x:             <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    dollar:        <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    list:          <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    check:         <><polyline points="20 6 9 17 4 12"/></>,
    search:        <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    users:         <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    link2:         <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
    trending:      <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    flag:          <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED UI COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
const Modal = ({ title, subtitle, onClose, children, wide }) => (
  <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
    <div className="modal" style={{ maxWidth: wide ? 800 : 680 }}>
      <div style={{ padding:"20px 26px", borderBottom:"1px solid #1e3a5f", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#f8fafc" }}>{title}</h3>
          {subtitle && <p style={{ fontSize:12, color:"#64748b", marginTop:3 }}>{subtitle}</p>}
        </div>
        <button className="btn" onClick={onClose} style={{ color:"#64748b", padding:4, background:"transparent", marginLeft:12 }}><Icon name="x" size={19}/></button>
      </div>
      <div style={{ padding:"20px 26px" }}>{children}</div>
    </div>
  </div>
);

const Field = ({ label, children, span2 }) => (
  <div style={{ marginBottom:13, gridColumn: span2 ? "1/-1" : undefined }}>
    <label style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.7px", display:"block", marginBottom:5 }}>{label}</label>
    {children}
  </div>
);

const G2 = ({ children, gap }) => <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:`0 ${gap||16}px` }}>{children}</div>;
const G3 = ({ children }) => <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 14px" }}>{children}</div>;

const SaveBtns = ({ onSave, onCancel, label="Save Record" }) => (
  <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:14 }}>
    <button className="btn action-btn" onClick={onCancel}>Cancel</button>
    <button className="btn" onClick={onSave} style={{ background:"#2563eb", color:"#fff", borderRadius:8, padding:"9px 24px", fontWeight:600, fontSize:14 }}>{label}</button>
  </div>
);

const PickerChip = ({ label, active, onClick }) => (
  <div className="picker-chip" onClick={onClick}
    style={{ border:`1px solid ${active?"#3b82f6":"#1e3a5f"}`, background:active?"rgba(59,130,246,0.18)":"transparent", color:active?"#93c5fd":"#94a3b8" }}>
    {label}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────────────────────────── */
export default function CRMApp() {
  /* ── State ────────────────────────────────────────────────────────────── */
  const [companies,     setCompanies]     = useState(SEED.companies);
  const [contacts,      setContacts]      = useState(SEED.contacts);
  const [leads,         setLeads]         = useState(SEED.leads);
  const [opportunities, setOpportunities] = useState(SEED.opportunities);
  const [products,      setProducts]      = useState(SEED.products);
  const [invoices,      setInvoices]      = useState(SEED.invoices);
  const [campaigns,     setCampaigns]     = useState(SEED.campaigns);
  const [events,        setEvents]        = useState(SEED.events);
  const [goals,         setGoals]         = useState(SEED.goals);

  const [view,   setView]   = useState("dashboard");
  const [modal,  setModal]  = useState(null);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [toast,  setToast]  = useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const closeModal = () => setModal(null);

  /* ── Lookup helpers ──────────────────────────────────────────────────── */
  const getContact  = id => contacts.find(c=>c.id===id);
  const getCompany  = id => companies.find(c=>c.id===id);
  const getProduct  = id => products.find(p=>p.id===id);
  const getLead     = id => leads.find(l=>l.id===id);
  const getCampaign = id => campaigns.find(c=>c.id===id);
  const getEvent    = id => events.find(e=>e.id===id);

  /* ── CRUD ────────────────────────────────────────────────────────────── */
  const setterMap = useCallback(() => ({
    companies:setCompanies, contacts:setContacts, leads:setLeads,
    opportunities:setOpportunities, products:setProducts, invoices:setInvoices,
    campaigns:setCampaigns, events:setEvents, goals:setGoals,
  }), []);

  const save = useCallback((type, data) => {
    const S = setterMap();
    const L = { companies, contacts, leads, opportunities, products, invoices, campaigns, events, goals };
    if (data.id && L[type]?.find(i=>i.id===data.id)) {
      S[type](prev => prev.map(i=>i.id===data.id ? {...i,...data} : i));
    } else {
      S[type](prev => [...prev, {...data, id:genId(), createdAt:today()}]);
    }
    showToast("Record saved successfully");
    closeModal();
  }, [companies,contacts,leads,opportunities,products,invoices,campaigns,events,goals]);

  const remove = (type, id) => {
    const S = setterMap();
    S[type](prev => prev.filter(i=>i.id!==id));
    setDetail(null);
    showToast("Record deleted","error");
  };

  const convertLead = lead => {
    setLeads(prev=>prev.map(l=>l.id===lead.id?{...l,converted:true,status:"Converted"}:l));
    setModal({type:"opportunities", data:{leadId:lead.id,contactId:lead.contactId,productIds:[]}});
  };

  /* ── Filtered search ─────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return { companies,contacts,leads,opportunities,products,invoices,campaigns,events,goals };
    return {
      companies:     companies.filter(i=>i.name.toLowerCase().includes(q)||i.industry.toLowerCase().includes(q)),
      contacts:      contacts.filter(i=>i.name.toLowerCase().includes(q)||i.email.toLowerCase().includes(q)),
      leads:         leads.filter(i=>getContact(i.contactId)?.name.toLowerCase().includes(q)||i.source.toLowerCase().includes(q)||i.status.toLowerCase().includes(q)),
      opportunities: opportunities.filter(i=>i.title.toLowerCase().includes(q)||i.stage.toLowerCase().includes(q)),
      products:      products.filter(i=>i.name.toLowerCase().includes(q)||i.sku.toLowerCase().includes(q)),
      invoices:      invoices.filter(i=>getContact(i.contactId)?.name.toLowerCase().includes(q)||i.status.toLowerCase().includes(q)),
      campaigns:     campaigns.filter(i=>i.name.toLowerCase().includes(q)||i.type.toLowerCase().includes(q)||i.status.toLowerCase().includes(q)),
      events:        events.filter(i=>i.name.toLowerCase().includes(q)||i.type.toLowerCase().includes(q)||getCampaign(i.campaignId)?.name.toLowerCase().includes(q)),
      goals:         goals.filter(i=>i.name.toLowerCase().includes(q)||i.metric.toLowerCase().includes(q)||getCampaign(i.campaignId)?.name.toLowerCase().includes(q)),
    };
  },[search,companies,contacts,leads,opportunities,products,invoices,campaigns,events,goals]);

  /* ═══════════════════════════════════════════════════════════════════════
     FORMS
  ═══════════════════════════════════════════════════════════════════════ */
  const Btns = ({onSave}) => <SaveBtns onSave={onSave} onCancel={closeModal}/>;

  /* ── Company ── */
  const FormCompany = ({init={}}) => {
    const [f,setF] = useState({name:"",industry:"Manufacturing",phone:"",email:"",website:"",address:"",...init});
    return (<><G2>
      <Field label="Company Name"><input className="input" value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="ACME Corp"/></Field>
      <Field label="Industry"><select className="input" value={f.industry} onChange={e=>setF({...f,industry:e.target.value})}>{["Manufacturing","Technology","Finance","Healthcare","Retail","Consulting","Education","Other"].map(x=><option key={x}>{x}</option>)}</select></Field>
      <Field label="Phone"><input className="input" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} placeholder="555-0100"/></Field>
      <Field label="Email"><input className="input" value={f.email} onChange={e=>setF({...f,email:e.target.value})} placeholder="info@company.com"/></Field>
      <Field label="Website"><input className="input" value={f.website} onChange={e=>setF({...f,website:e.target.value})} placeholder="company.com"/></Field>
      <Field label="Address"><input className="input" value={f.address} onChange={e=>setF({...f,address:e.target.value})} placeholder="123 Main St, City, ST"/></Field>
    </G2><Btns onSave={()=>save("companies",f)}/></>);
  };

  /* ── Contact ── */
  const FormContact = ({init={}}) => {
    const [f,setF] = useState({name:"",email:"",phone:"",title:"",companyId:null,...init});
    return (<><G2>
      <Field label="Full Name"><input className="input" value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Jane Smith"/></Field>
      <Field label="Title / Role"><input className="input" value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="VP of Sales"/></Field>
      <Field label="Email"><input className="input" value={f.email} onChange={e=>setF({...f,email:e.target.value})} placeholder="jane@co.com"/></Field>
      <Field label="Phone"><input className="input" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} placeholder="555-0100"/></Field>
    </G2>
    <Field label="Company (optional)"><select className="input" value={f.companyId||""} onChange={e=>setF({...f,companyId:e.target.value||null})}><option value="">— No Company (Independent) —</option>{companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
    <Btns onSave={()=>save("contacts",f)}/></>);
  };

  /* ── Lead ── */
  const FormLead = ({init={}}) => {
    const [f,setF] = useState({contactId:contacts[0]?.id||"",status:"New",source:"Website",eventId:null,notes:"",converted:false,...init});
    return (<><Field label="Contact (required)"><select className="input" value={f.contactId} onChange={e=>setF({...f,contactId:e.target.value})}>{contacts.map(c=><option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}</select></Field>
    <G2>
      <Field label="Status"><select className="input" value={f.status} onChange={e=>setF({...f,status:e.target.value})}>{["New","Working","Qualified","Unqualified"].map(x=><option key={x}>{x}</option>)}</select></Field>
      <Field label="Lead Source"><select className="input" value={f.source} onChange={e=>setF({...f,source:e.target.value})}>{["Website","Referral","Cold Call","Email","Trade Show","Event","Social","Other"].map(x=><option key={x}>{x}</option>)}</select></Field>
    </G2>
    <Field label="Associated Event (optional — zero or one)"><select className="input" value={f.eventId||""} onChange={e=>setF({...f,eventId:e.target.value||null})}><option value="">— No Event —</option>{events.map(ev=><option key={ev.id} value={ev.id}>{ev.name} ({ev.date})</option>)}</select></Field>
    <Field label="Notes"><textarea className="input" value={f.notes} onChange={e=>setF({...f,notes:e.target.value})} placeholder="Lead context, next steps, budget details..."/></Field>
    <Btns onSave={()=>save("leads",f)}/></>);
  };

  /* ── Opportunity ── */
  const FormOpportunity = ({init={}}) => {
    const [f,setF] = useState({title:"",value:0,stage:"Prospecting",productIds:[],closeDate:"",leadId:"",contactId:"",...init});
    const toggle = pid => setF(p=>({...p,productIds:p.productIds.includes(pid)?p.productIds.filter(x=>x!==pid):[...p.productIds,pid]}));
    return (<>
      <Field label="Opportunity Title"><input className="input" value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="ACME Corp Q4 Widget Deal"/></Field>
      <G2>
        <Field label="Estimated Value ($)"><input className="input" type="number" value={f.value} onChange={e=>setF({...f,value:+e.target.value})}/></Field>
        <Field label="Expected Close Date"><input className="input" type="date" value={f.closeDate} onChange={e=>setF({...f,closeDate:e.target.value})}/></Field>
        <Field label="Stage"><select className="input" value={f.stage} onChange={e=>setF({...f,stage:e.target.value})}>{["Prospecting","Qualification","Proposal","Value Proposition","Id. Decision Makers","Proposal/Price Quote","Negotiation/Review","Closed Won","Closed Lost"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Contact"><select className="input" value={f.contactId} onChange={e=>setF({...f,contactId:e.target.value})}><option value="">— Select —</option>{contacts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
      </G2>
      <Field label="Source Lead"><select className="input" value={f.leadId} onChange={e=>setF({...f,leadId:e.target.value})}><option value="">— Select Lead —</option>{leads.map(l=><option key={l.id} value={l.id}>{getContact(l.contactId)?.name} — {l.source} ({l.status})</option>)}</select></Field>
      <Field label="Products of Interest"><div className="picker-grid">{products.map(p=><PickerChip key={p.id} label={`${p.name} $${p.price}`} active={f.productIds.includes(p.id)} onClick={()=>toggle(p.id)}/>)}</div></Field>
      <Btns onSave={()=>save("opportunities",f)}/>
    </>);
  };

  /* ── Product ── */
  const FormProduct = ({init={}}) => {
    const [f,setF] = useState({name:"",sku:"",price:0,description:"",...init});
    return (<><G2>
      <Field label="Product Name"><input className="input" value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="ACME Widget Pro"/></Field>
      <Field label="SKU / Part #"><input className="input" value={f.sku} onChange={e=>setF({...f,sku:e.target.value})} placeholder="WGT-002"/></Field>
      <Field label="Unit Price ($)"><input className="input" type="number" step="0.01" value={f.price} onChange={e=>setF({...f,price:+e.target.value})}/></Field>
    </G2>
    <Field label="Description"><textarea className="input" value={f.description} onChange={e=>setF({...f,description:e.target.value})} placeholder="Product description..."/></Field>
    <Btns onSave={()=>save("products",f)}/></>);
  };

  /* ── Invoice ── */
  const FormInvoice = ({init={}}) => {
    const blank = () => ({id:genId(), productId:products[0]?.id||"", qty:1, unitPrice:products[0]?.price||0});
    const [f,setF] = useState({contactId:contacts[0]?.id||"",status:"Draft",dueDate:"",...init,
      lineItems:(init.lineItems?.length>0)?init.lineItems.map(li=>({...li})):[blank()]});
    const upd = (idx,field,val) => setF(prev=>({...prev,lineItems:prev.lineItems.map((li,i)=>{
      if(i!==idx) return li;
      const u={...li,[field]:val};
      if(field==="productId"){ const p=products.find(p=>p.id===val); u.unitPrice=p?p.price:0; }
      return u;
    })}));
    const subtotal=f.lineItems.reduce((s,li)=>s+liTotal(li),0);
    return (<>
      <G2>
        <Field label="Bill To — Contact"><select className="input" value={f.contactId} onChange={e=>setF({...f,contactId:e.target.value})}>{contacts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="Status"><select className="input" value={f.status} onChange={e=>setF({...f,status:e.target.value})}>{["Draft","Sent","Paid","Overdue","Cancelled"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Due Date"><input className="input" type="date" value={f.dueDate} onChange={e=>setF({...f,dueDate:e.target.value})}/></Field>
      </G2>
      <div style={{marginBottom:13}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <label style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.7px"}}>Line Items</label>
          <button className="btn action-btn" onClick={()=>setF(p=>({...p,lineItems:[...p.lineItems,blank()]}))}><Icon name="plus" size={12}/> Add Line</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 72px 130px 90px 36px",gap:8,padding:"3px 12px 6px",fontSize:10,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>
          <span>Product</span><span style={{textAlign:"center"}}>Qty</span><span>Unit Price</span><span style={{textAlign:"right"}}>Total</span><span/>
        </div>
        {f.lineItems.map((li,idx)=>(
          <div key={li.id} className="li-row">
            <select className="input" style={{padding:"7px 10px",fontSize:13}} value={li.productId} onChange={e=>upd(idx,"productId",e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
            <input className="input" type="number" min="1" style={{padding:"7px 8px",fontSize:13,textAlign:"center"}} value={li.qty} onChange={e=>upd(idx,"qty",Math.max(1,+e.target.value))}/>
            <div style={{position:"relative"}}><span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#475569",fontSize:13}}>$</span><input className="input" type="number" step="0.01" style={{padding:"7px 10px 7px 20px",fontSize:13}} value={li.unitPrice} onChange={e=>upd(idx,"unitPrice",+e.target.value)}/></div>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"#3b82f6",fontWeight:600,textAlign:"right"}}>${liTotal(li).toFixed(2)}</span>
            <button className="btn action-btn danger" style={{padding:"5px 8px",justifyContent:"center"}} onClick={()=>setF(p=>({...p,lineItems:p.lineItems.filter((_,i)=>i!==idx)}))} disabled={f.lineItems.length===1}><Icon name="minus" size={12}/></button>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 72px 130px 90px 36px",gap:8,padding:"9px 12px",background:"rgba(37,99,235,0.07)",border:"1px solid rgba(37,99,235,0.2)",borderRadius:8,marginTop:4}}>
          <span style={{fontSize:12,color:"#64748b",fontWeight:600}}>{f.lineItems.length} item{f.lineItems.length!==1?"s":""}</span>
          <span style={{fontFamily:"'DM Mono'",fontSize:12,color:"#64748b",textAlign:"center"}}>{f.lineItems.reduce((s,li)=>s+(+li.qty||0),0)}</span>
          <span style={{fontSize:11,color:"#475569"}}>Invoice Total:</span>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:17,color:"#3b82f6",fontWeight:700,textAlign:"right"}}>${subtotal.toFixed(2)}</span><span/>
        </div>
      </div>
      <Btns onSave={()=>save("invoices",f)}/>
    </>);
  };

  /* ── Campaign ── */
  const FormCampaign = ({init={}}) => {
    const [f,setF] = useState({name:"",type:"Email",status:"Planning",startDate:"",endDate:"",budget:0,description:"",...init});
    return (<>
      <G2>
        <Field label="Campaign Name" span2><input className="input" value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Q3 Widget Launch Campaign"/></Field>
        <Field label="Type"><select className="input" value={f.type} onChange={e=>setF({...f,type:e.target.value})}>{["Email","Social","Event","Content","Paid Ads","Webinar","Direct Mail","Other"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Status"><select className="input" value={f.status} onChange={e=>setF({...f,status:e.target.value})}>{["Planning","Active","Paused","Completed","Cancelled"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Start Date"><input className="input" type="date" value={f.startDate} onChange={e=>setF({...f,startDate:e.target.value})}/></Field>
        <Field label="End Date"><input className="input" type="date" value={f.endDate} onChange={e=>setF({...f,endDate:e.target.value})}/></Field>
        <Field label="Budget ($)" span2><input className="input" type="number" step="100" value={f.budget} onChange={e=>setF({...f,budget:+e.target.value})}/></Field>
      </G2>
      <Field label="Description"><textarea className="input" style={{minHeight:90}} value={f.description} onChange={e=>setF({...f,description:e.target.value})} placeholder="Campaign overview, target audience, key messages..."/></Field>
      <Btns onSave={()=>save("campaigns",f)}/>
    </>);
  };

  /* ── Event ── */
  const FormEvent = ({init={}}) => {
    const [f,setF] = useState({name:"",campaignId:"",type:"Webinar",status:"Upcoming",date:"",endDate:"",location:"",description:"",leadIds:[],...init});
    const toggleLead = lid => setF(p=>({...p,leadIds:p.leadIds.includes(lid)?p.leadIds.filter(x=>x!==lid):[...p.leadIds,lid]}));
    return (<>
      <Field label="Event Name"><input className="input" value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Widget Pro Webinar — June"/></Field>
      <G2>
        <Field label="Parent Campaign (optional)"><select className="input" value={f.campaignId||""} onChange={e=>setF({...f,campaignId:e.target.value||""})}><option value="">— No Campaign —</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="Event Type"><select className="input" value={f.type} onChange={e=>setF({...f,type:e.target.value})}>{["Webinar","Conference","Trade Show","Workshop","Demo","Meetup","Networking","Other"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Status"><select className="input" value={f.status} onChange={e=>setF({...f,status:e.target.value})}>{["Upcoming","In Progress","Completed","Cancelled"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Location / URL"><input className="input" value={f.location} onChange={e=>setF({...f,location:e.target.value})} placeholder="Zoom / Convention Center, City"/></Field>
        <Field label="Start Date"><input className="input" type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/></Field>
        <Field label="End Date"><input className="input" type="date" value={f.endDate} onChange={e=>setF({...f,endDate:e.target.value})}/></Field>
      </G2>
      <Field label="Description"><textarea className="input" value={f.description} onChange={e=>setF({...f,description:e.target.value})} placeholder="Event details, agenda, objectives..."/></Field>
      <Field label="Associated Leads (zero to many)">
        <div className="picker-grid">
          {leads.map(l=>{
            const ct=getContact(l.contactId);
            return <PickerChip key={l.id} label={`${ct?.name} (${l.source})`} active={f.leadIds.includes(l.id)} onClick={()=>toggleLead(l.id)}/>;
          })}
          {leads.length===0&&<span style={{fontSize:13,color:"#374151"}}>No leads yet.</span>}
        </div>
      </Field>
      <Btns onSave={()=>{
        // When saving event, also update any leads that were toggled
        const newEvent = {...f};
        save("events", newEvent);
        // Sync leads: for each lead in f.leadIds set eventId to this event's id (handled by existing eventId on lead)
      }}/>
    </>);
  };

  /* ── Goal ── */
  const FormGoal = ({init={}}) => {
    const [f,setF] = useState({name:"",campaignId:"",metric:"Leads Generated",targetValue:0,currentValue:0,unit:"leads",dueDate:"",notes:"",...init});
    return (<>
      <G2>
        <Field label="Goal Name" span2><input className="input" value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Qualified Leads Generated"/></Field>
        <Field label="Parent Campaign (optional)"><select className="input" value={f.campaignId||""} onChange={e=>setF({...f,campaignId:e.target.value||""})}><option value="">— No Campaign —</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="Metric Type"><select className="input" value={f.metric} onChange={e=>setF({...f,metric:e.target.value})}>{["Leads Generated","Registrations","Revenue","Attendees","Impressions","Clicks","Conversions","Cost Per Lead","Satisfaction","Other"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Target Value"><input className="input" type="number" step="any" value={f.targetValue} onChange={e=>setF({...f,targetValue:+e.target.value})}/></Field>
        <Field label="Current Value"><input className="input" type="number" step="any" value={f.currentValue} onChange={e=>setF({...f,currentValue:+e.target.value})}/></Field>
        <Field label="Unit (e.g. leads, $, %)"><input className="input" value={f.unit} onChange={e=>setF({...f,unit:e.target.value})} placeholder="leads"/></Field>
        <Field label="Due Date"><input className="input" type="date" value={f.dueDate} onChange={e=>setF({...f,dueDate:e.target.value})}/></Field>
      </G2>
      <Field label="Notes"><textarea className="input" value={f.notes} onChange={e=>setF({...f,notes:e.target.value})} placeholder="Measurement methodology, data sources..."/></Field>
      <Btns onSave={()=>save("goals",f)}/>
    </>);
  };

  /* ═══════════════════════════════════════════════════════════════════════
     DETAIL PANEL
  ═══════════════════════════════════════════════════════════════════════ */
  const DetailPanel = () => {
    if (!detail) return null;
    const stateMap = {companies,contacts,leads,opportunities,products,invoices,campaigns,events,goals};
    const item = stateMap[detail.type]?.find(x=>x.id===detail.id);
    if (!item) return null;

    const IR = ({label,value,mono}) => (
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"8px 0",borderBottom:"1px solid #0d1f3a"}}>
        <span style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",flexShrink:0,marginRight:8}}>{label}</span>
        <span style={{fontSize:13,color:"#e2e8f0",fontFamily:mono?"'DM Mono',monospace":undefined,textAlign:"right"}}>{value??<span style={{color:"#374151"}}>—</span>}</span>
      </div>
    );
    const SH = ({label,count}) => (
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0 8px"}}>
        <p style={{fontSize:11,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</p>
        {count!==undefined&&<span style={{fontFamily:"'DM Mono'",fontSize:11,color:"#475569"}}>{count}</span>}
      </div>
    );
    const SC = ({left,sub,right,onClick}) => (
      <div onClick={onClick} style={{padding:"8px 12px",background:"#060d1a",border:"1px solid #1e3a5f",borderRadius:8,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:onClick?"pointer":undefined}}>
        <div><div style={{fontSize:13,fontWeight:500}}>{left}</div>{sub&&<div style={{fontSize:11,color:"#64748b"}}>{sub}</div>}</div>
        <div style={{flexShrink:0,marginLeft:8}}>{right}</div>
      </div>
    );

    const editBtn = ()=>{setDetail(null);setModal({type:detail.type,data:item});};
    const delBtn  = ()=>remove(detail.type,detail.id);

    return (
      <div style={{position:"fixed",right:0,top:0,bottom:0,width:374,background:"#0a1628",borderLeft:"1px solid #1e3a5f",zIndex:500,overflowY:"auto",padding:"18px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:"#f8fafc"}}>Record Detail</h3>
          <button className="btn action-btn" onClick={()=>setDetail(null)}><Icon name="x" size={13}/></button>
        </div>

        {/* ── COMPANIES ── */}
        {detail.type==="companies"&&<>
          <div style={{padding:14,background:"rgba(59,130,246,0.08)",borderRadius:10,border:"1px solid rgba(59,130,246,0.2)",marginBottom:14,display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:44,height:44,background:"#1e3a8a",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="companies" size={20} color="#93c5fd"/></div>
            <div><h4 style={{fontSize:17,fontWeight:700}}>{item.name}</h4><p style={{color:"#64748b",fontSize:13}}>{item.industry}</p></div>
          </div>
          <IR label="Email" value={item.email}/><IR label="Phone" value={item.phone} mono/><IR label="Website" value={item.website}/><IR label="Address" value={item.address}/><IR label="Created" value={item.createdAt}/>
          <SH label={`Contacts`} count={contacts.filter(c=>c.companyId===item.id).length}/>
          {contacts.filter(c=>c.companyId===item.id).map(c=><SC key={c.id} left={c.name} sub={c.title} right={<span style={{fontSize:11,color:"#64748b"}}>{c.email}</span>}/>)}
        </>}

        {/* ── CONTACTS ── */}
        {detail.type==="contacts"&&<>
          <div style={{padding:14,background:"rgba(59,130,246,0.08)",borderRadius:10,border:"1px solid rgba(59,130,246,0.2)",marginBottom:14,display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:44,height:44,background:"#1e3a8a",borderRadius:50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#93c5fd",flexShrink:0}}>{item.name[0]}</div>
            <div><h4 style={{fontSize:17,fontWeight:700}}>{item.name}</h4><p style={{color:"#64748b",fontSize:13}}>{item.title}</p></div>
          </div>
          <IR label="Email" value={item.email}/><IR label="Phone" value={item.phone} mono/>
          <IR label="Company" value={item.companyId?getCompany(item.companyId)?.name:"Independent"}/><IR label="Created" value={item.createdAt}/>
          <SH label="Leads" count={leads.filter(l=>l.contactId===item.id).length}/>
          {leads.filter(l=>l.contactId===item.id).map(l=><SC key={l.id} left={l.source} sub={l.createdAt} right={<Bdg text={l.status} colors={statusColors[l.status]||"2563eb,1e3a8a"}/>}/>)}
        </>}

        {/* ── LEADS ── */}
        {detail.type==="leads"&&<>
          <IR label="Contact" value={<span style={{fontWeight:600}}>{getContact(item.contactId)?.name}</span>}/>
          <IR label="Company" value={getCompany(getContact(item.contactId)?.companyId)?.name}/>
          <IR label="Status" value={<Bdg text={item.status} colors={statusColors[item.status]||"2563eb,1e3a8a"}/>}/>
          <IR label="Source" value={item.source}/>
          <IR label="Event" value={item.eventId?getEvent(item.eventId)?.name:null}/>
          <IR label="Converted" value={item.converted?"✓ Converted":"Not yet"}/><IR label="Created" value={item.createdAt}/>
          <div style={{marginTop:10,padding:12,background:"#060d1a",border:"1px solid #1e3a5f",borderRadius:8,fontSize:13,color:"#94a3b8",lineHeight:1.6}}>{item.notes||"No notes."}</div>
          {!item.converted&&<button className="btn" onClick={()=>{setDetail(null);convertLead(item);}} style={{marginTop:14,width:"100%",background:"#059669",color:"#fff",borderRadius:8,padding:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Icon name="convert" size={14}/> Convert to Opportunity</button>}
        </>}

        {/* ── OPPORTUNITIES ── */}
        {detail.type==="opportunities"&&<>
          <div style={{marginBottom:14,padding:14,background:"rgba(59,130,246,0.08)",borderRadius:10,border:"1px solid rgba(59,130,246,0.2)"}}>
            <div style={{fontFamily:"'DM Mono'",fontSize:26,fontWeight:700,color:"#3b82f6"}}>${item.value?.toLocaleString()}</div>
            <div style={{fontSize:14,fontWeight:600,marginTop:2}}>{item.title}</div>
          </div>
          <IR label="Stage" value={<Bdg text={item.stage} colors={stageColor(item.stage)}/>}/>
          <IR label="Contact" value={getContact(item.contactId)?.name}/>
          <IR label="Source Lead" value={getLead(item.leadId)?`${getLead(item.leadId)?.source} (${getLead(item.leadId)?.status})`:null}/>
          <IR label="Close Date" value={item.closeDate}/><IR label="Created" value={item.createdAt}/>
          <SH label="Products" count={item.productIds?.length||0}/>
          {(item.productIds||[]).map(pid=>{const p=getProduct(pid);return p?<SC key={pid} left={p.name} sub={p.sku} right={<span style={{fontFamily:"'DM Mono'",fontSize:13,color:"#3b82f6"}}>${p.price.toFixed(2)}</span>}/>:null;})}
        </>}

        {/* ── PRODUCTS ── */}
        {detail.type==="products"&&<>
          <div style={{marginBottom:14,padding:14,background:"rgba(59,130,246,0.08)",borderRadius:10,border:"1px solid rgba(59,130,246,0.2)"}}>
            <div style={{fontFamily:"'DM Mono'",fontSize:26,fontWeight:700,color:"#3b82f6"}}>${item.price?.toFixed(2)}</div>
            <div style={{fontSize:14,fontWeight:600,marginTop:2}}>{item.name}</div>
          </div>
          <IR label="SKU" value={item.sku} mono/><IR label="Created" value={item.createdAt}/>
          <div style={{marginTop:10,padding:12,background:"#060d1a",border:"1px solid #1e3a5f",borderRadius:8,fontSize:13,color:"#94a3b8",lineHeight:1.6}}>{item.description}</div>
        </>}

        {/* ── INVOICES ── */}
        {detail.type==="invoices"&&<>
          <div style={{marginBottom:14,padding:14,background:"rgba(59,130,246,0.08)",borderRadius:10,border:"1px solid rgba(59,130,246,0.2)"}}>
            <div style={{fontFamily:"'DM Mono'",fontSize:28,fontWeight:700,color:"#3b82f6"}}>${invTotal(item).toFixed(2)}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}><span style={{fontSize:13,color:"#64748b"}}>Invoice Total</span><Bdg text={item.status} colors={invColors[item.status]||"2563eb,1e3a8a"}/></div>
          </div>
          <IR label="Invoice #" value={`INV-${item.id.toUpperCase()}`} mono/><IR label="Contact" value={getContact(item.contactId)?.name}/><IR label="Due Date" value={item.dueDate}/>
          <SH label={`Line Items`} count={(item.lineItems||[]).length}/>
          <div style={{background:"#060d1a",border:"1px solid #1e3a5f",borderRadius:8,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 44px 80px 80px",gap:8,padding:"6px 12px",borderBottom:"1px solid #1e3a5f",fontSize:10,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}><span>Product</span><span style={{textAlign:"center"}}>Qty</span><span style={{textAlign:"right"}}>Unit</span><span style={{textAlign:"right"}}>Total</span></div>
            {(item.lineItems||[]).map((li,i)=>{const p=getProduct(li.productId);return(
              <div key={li.id||i} style={{display:"grid",gridTemplateColumns:"1fr 44px 80px 80px",gap:8,padding:"8px 12px",borderBottom:i<item.lineItems.length-1?"1px solid #0d1f3a":"none"}}>
                <div><div style={{fontSize:13,fontWeight:500}}>{p?.name||"—"}</div><div style={{fontSize:11,color:"#64748b"}}>{p?.sku}</div></div>
                <span style={{fontFamily:"'DM Mono'",fontSize:13,color:"#94a3b8",textAlign:"center"}}>{li.qty}</span>
                <span style={{fontFamily:"'DM Mono'",fontSize:13,color:"#64748b",textAlign:"right"}}>${(+li.unitPrice).toFixed(2)}</span>
                <span style={{fontFamily:"'DM Mono'",fontSize:13,color:"#3b82f6",fontWeight:600,textAlign:"right"}}>${liTotal(li).toFixed(2)}</span>
              </div>
            );})}
            <div style={{display:"grid",gridTemplateColumns:"1fr 44px 80px 80px",gap:8,padding:"8px 12px",background:"rgba(37,99,235,0.09)",borderTop:"2px solid #1e3a5f"}}>
              <span style={{fontSize:12,fontWeight:700,color:"#94a3b8"}}>TOTAL</span><span/><span/>
              <span style={{fontFamily:"'DM Mono'",fontSize:16,color:"#3b82f6",fontWeight:700,textAlign:"right"}}>${invTotal(item).toFixed(2)}</span>
            </div>
          </div>
        </>}

        {/* ── CAMPAIGNS ── */}
        {detail.type==="campaigns"&&<>
          <div style={{padding:14,background:"rgba(168,85,247,0.08)",borderRadius:10,border:"1px solid rgba(168,85,247,0.2)",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <span className="tag tag-pink">{item.type}</span>
              <Bdg text={item.status} colors={campStatusC[item.status]||"2563eb,1e3a8a"}/>
            </div>
            <h4 style={{fontSize:16,fontWeight:700,marginBottom:4}}>{item.name}</h4>
            <div style={{fontFamily:"'DM Mono'",fontSize:20,fontWeight:700,color:"#a855f7"}}>{fmt$(item.budget)}</div>
          </div>
          <IR label="Budget" value={fmt$(item.budget)} mono/><IR label="Start" value={item.startDate}/><IR label="End" value={item.endDate}/><IR label="Created" value={item.createdAt}/>
          <div style={{marginTop:10,padding:12,background:"#060d1a",border:"1px solid #1e3a5f",borderRadius:8,fontSize:13,color:"#94a3b8",lineHeight:1.7}}>{item.description||"No description."}</div>
          {/* Events in campaign */}
          <SH label="Events" count={events.filter(e=>e.campaignId===item.id).length}/>
          {events.filter(e=>e.campaignId===item.id).map(e=>(
            <SC key={e.id} left={e.name} sub={`${e.type} · ${e.date}`} right={<Bdg text={e.status} colors={eventStatusC[e.status]||"2563eb,1e3a8a"}/>}
              onClick={()=>setDetail({type:"events",id:e.id})}/>
          ))}
          {events.filter(e=>e.campaignId===item.id).length===0&&<p style={{fontSize:13,color:"#374151"}}>No events yet.</p>}
          {/* Goals in campaign */}
          <SH label="Goals" count={goals.filter(g=>g.campaignId===item.id).length}/>
          {goals.filter(g=>g.campaignId===item.id).map(g=>{
            const p=pct(g.currentValue,g.targetValue);
            return(
              <div key={g.id} style={{padding:"10px 12px",background:"#060d1a",border:"1px solid #1e3a5f",borderRadius:8,marginBottom:6,cursor:"pointer"}} onClick={()=>setDetail({type:"goals",id:g.id})}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:500}}>{g.name}</span><span style={{fontFamily:"'DM Mono'",fontSize:12,color:"#94a3b8"}}>{p}%</span></div>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width:`${p}%`,background:p>=100?"#059669":p>=60?"#3b82f6":"#d97706"}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:11,color:"#64748b"}}><span>{g.currentValue} {g.unit}</span><span>of {g.targetValue} {g.unit}</span></div>
              </div>
            );
          })}
          {goals.filter(g=>g.campaignId===item.id).length===0&&<p style={{fontSize:13,color:"#374151"}}>No goals yet.</p>}
        </>}

        {/* ── EVENTS ── */}
        {detail.type==="events"&&<>
          <div style={{padding:14,background:"rgba(6,182,212,0.08)",borderRadius:10,border:"1px solid rgba(6,182,212,0.2)",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span className="tag tag-green">{item.type}</span>
              <Bdg text={item.status} colors={eventStatusC[item.status]||"2563eb,1e3a8a"}/>
            </div>
            <h4 style={{fontSize:16,fontWeight:700}}>{item.name}</h4>
          </div>
          <IR label="Campaign" value={item.campaignId?getCampaign(item.campaignId)?.name:"—"}/>
          <IR label="Date" value={item.date===item.endDate?item.date:`${item.date} → ${item.endDate}`}/>
          <IR label="Location" value={item.location}/><IR label="Created" value={item.createdAt}/>
          <div style={{marginTop:10,padding:12,background:"#060d1a",border:"1px solid #1e3a5f",borderRadius:8,fontSize:13,color:"#94a3b8",lineHeight:1.7,marginBottom:14}}>{item.description||"No description."}</div>
          <SH label="Leads Attending" count={(item.leadIds||[]).length}/>
          {(item.leadIds||[]).length===0&&<p style={{fontSize:13,color:"#374151"}}>No leads associated yet.</p>}
          {(item.leadIds||[]).map(lid=>{const l=getLead(lid);const ct=l?getContact(l.contactId):null;return l?(
            <SC key={lid} left={ct?.name||"—"} sub={`${l.source} · ${l.status}`} right={<Bdg text={l.status} colors={statusColors[l.status]||"2563eb,1e3a8a"}/>} onClick={()=>setDetail({type:"leads",id:l.id})}/>
          ):null;})}
        </>}

        {/* ── GOALS ── */}
        {detail.type==="goals"&&<>
          <div style={{padding:14,background:"rgba(245,158,11,0.07)",borderRadius:10,border:"1px solid rgba(245,158,11,0.2)",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span className="tag tag-amber">{item.metric}</span>
              <span style={{fontFamily:"'DM Mono'",fontSize:13,color:"#94a3b8"}}>{pct(item.currentValue,item.targetValue)}% complete</span>
            </div>
            <h4 style={{fontSize:16,fontWeight:700,marginBottom:10}}>{item.name}</h4>
            <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width:`${pct(item.currentValue,item.targetValue)}%`,background:pct(item.currentValue,item.targetValue)>=100?"#059669":pct(item.currentValue,item.targetValue)>=60?"#3b82f6":"#d97706"}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:13}}>
              <span style={{color:"#e2e8f0",fontWeight:600}}>{item.currentValue} {item.unit}</span>
              <span style={{color:"#64748b"}}>target: {item.targetValue} {item.unit}</span>
            </div>
          </div>
          <IR label="Campaign" value={item.campaignId?getCampaign(item.campaignId)?.name:"—"}/>
          <IR label="Metric" value={item.metric}/><IR label="Due Date" value={item.dueDate}/><IR label="Created" value={item.createdAt}/>
          {item.notes&&<div style={{marginTop:10,padding:12,background:"#060d1a",border:"1px solid #1e3a5f",borderRadius:8,fontSize:13,color:"#94a3b8",lineHeight:1.7}}>{item.notes}</div>}
        </>}

        {/* ── Edit / Delete buttons ── */}
        <div style={{display:"flex",gap:8,marginTop:20}}>
          <button className="btn action-btn" style={{flex:1}} onClick={editBtn}><Icon name="edit" size={12}/> Edit</button>
          <button className="btn action-btn danger" style={{flex:1}} onClick={delBtn}><Icon name="trash" size={12}/> Delete</button>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     DASHBOARD
  ═══════════════════════════════════════════════════════════════════════ */
  const Dashboard = () => {
    const pipeline  = opportunities.reduce((s,o)=>s+(o.value||0),0);
    const paidAmt   = invoices.filter(i=>i.status==="Paid").reduce((s,i)=>s+invTotal(i),0);
    const openLeads = leads.filter(l=>!l.converted).length;
    const activeCamps = campaigns.filter(c=>c.status==="Active").length;

    const stats = [
      {label:"Companies",    val:companies.length,             icon:"companies",    color:"#3b82f6"},
      {label:"Contacts",     val:contacts.length,              icon:"contacts",     color:"#8b5cf6"},
      {label:"Open Leads",   val:openLeads,                    icon:"leads",        color:"#f59e0b"},
      {label:"Opportunities",val:opportunities.length,         icon:"opportunities",color:"#10b981"},
      {label:"Pipeline",     val:fmt$(pipeline),               icon:"dollar",       color:"#06b6d4",mono:true},
      {label:"Paid Revenue", val:fmt$(paidAmt),                icon:"invoices",     color:"#ec4899",mono:true},
      {label:"Campaigns",    val:`${activeCamps} active`,      icon:"campaigns",    color:"#a855f7",mono:true},
      {label:"Events",       val:`${events.filter(e=>e.status==="Upcoming").length} upcoming`, icon:"events", color:"#14b8a6",mono:true},
      {label:"Goals Tracked",val:goals.length,                 icon:"goals",        color:"#f97316"},
    ];

    return (
      <div>
        <div style={{marginBottom:26}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,marginBottom:4}}>Dashboard</h2>
          <p style={{color:"#64748b",fontSize:14}}>CRM + Marketing Automation at a glance.</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginBottom:26}}>
          {stats.map(s=>(
            <div key={s.label} className="stat-card" style={{display:"flex",alignItems:"center",gap:13}}>
              <div style={{width:42,height:42,background:`${s.color}1a`,border:`1px solid ${s.color}33`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name={s.icon} size={19} color={s.color}/>
              </div>
              <div>
                <div style={{fontFamily:s.mono?"'DM Mono',monospace":undefined,fontSize:20,fontWeight:700}}>{s.val}</div>
                <div style={{fontSize:11,color:"#64748b",fontWeight:600}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {/* Active Leads */}
          <div style={{background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:12,padding:18}}>
            <h3 style={{fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:13}}>Active Leads</h3>
            {leads.filter(l=>!l.converted).slice(0,5).map(l=>(
              <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #0d1f3a",cursor:"pointer"}} onClick={()=>{setView("leads");setDetail({type:"leads",id:l.id});}}>
                <div><div style={{fontSize:13,fontWeight:500}}>{getContact(l.contactId)?.name}</div><div style={{fontSize:11,color:"#64748b"}}>{l.source} · {getCompany(getContact(l.contactId)?.companyId)?.name||"Independent"}</div></div>
                <Bdg text={l.status} colors={statusColors[l.status]||"2563eb,1e3a8a"}/>
              </div>
            ))}
          </div>

          {/* Active Campaigns */}
          <div style={{background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:12,padding:18}}>
            <h3 style={{fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:13}}>Campaigns</h3>
            {campaigns.slice(0,4).map(c=>{
              const cGoals=goals.filter(g=>g.campaignId===c.id);
              const avgPct=cGoals.length>0?Math.round(cGoals.reduce((s,g)=>s+pct(g.currentValue,g.targetValue),0)/cGoals.length):null;
              return(
                <div key={c.id} style={{padding:"8px 0",borderBottom:"1px solid #0d1f3a",cursor:"pointer"}} onClick={()=>{setView("campaigns");setDetail({type:"campaigns",id:c.id});}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:500}}>{c.name}</span>
                    <Bdg text={c.status} colors={campStatusC[c.status]||"2563eb,1e3a8a"}/>
                  </div>
                  {avgPct!==null&&<div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div className="progress-bar-bg" style={{flex:1}}><div className="progress-bar-fill" style={{width:`${avgPct}%`,background:avgPct>=80?"#059669":"#3b82f6"}}/></div>
                    <span style={{fontFamily:"'DM Mono'",fontSize:11,color:"#64748b",minWidth:32}}>{avgPct}%</span>
                  </div>}
                </div>
              );
            })}
          </div>

          {/* Upcoming Events */}
          <div style={{background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:12,padding:18}}>
            <h3 style={{fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:13}}>Upcoming Events</h3>
            {events.filter(e=>e.status==="Upcoming"||e.status==="In Progress").slice(0,4).map(e=>(
              <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #0d1f3a",cursor:"pointer"}} onClick={()=>{setView("events");setDetail({type:"events",id:e.id});}}>
                <div><div style={{fontSize:13,fontWeight:500}}>{e.name}</div><div style={{fontSize:11,color:"#64748b"}}>{e.date} · {e.location}</div></div>
                <div style={{textAlign:"right"}}><Bdg text={e.type} colors="06b6d4,083344"/><div style={{fontSize:11,color:"#64748b",marginTop:3}}>{(e.leadIds||[]).length} leads</div></div>
              </div>
            ))}
            {events.filter(e=>e.status==="Upcoming"||e.status==="In Progress").length===0&&<p style={{fontSize:13,color:"#374151"}}>No upcoming events.</p>}
          </div>

          {/* Goals tracker */}
          <div style={{background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:12,padding:18}}>
            <h3 style={{fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:13}}>Goals Progress</h3>
            {goals.slice(0,5).map(g=>{
              const p=pct(g.currentValue,g.targetValue);
              return(
                <div key={g.id} style={{padding:"8px 0",borderBottom:"1px solid #0d1f3a",cursor:"pointer"}} onClick={()=>{setView("goals");setDetail({type:"goals",id:g.id});}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,fontWeight:500}}>{g.name}</span><span style={{fontFamily:"'DM Mono'",fontSize:11,color:p>=100?"#34d399":p>=60?"#60a5fa":"#fbbf24"}}>{p}%</span></div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width:`${p}%`,background:p>=100?"#059669":p>=60?"#3b82f6":"#d97706"}}/></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     MARKETING AUTOMATION HUB (Campaign detail page)
  ═══════════════════════════════════════════════════════════════════════ */
  const CampaignHub = () => {
    const [selectedCamp, setSelectedCamp] = useState(null);
    const camp = selectedCamp ? getCampaign(selectedCamp) : null;
    const campEvents = camp ? events.filter(e=>e.campaignId===camp.id) : [];
    const campGoals  = camp ? goals.filter(g=>g.campaignId===camp.id) : [];

    if (!camp) {
      // Campaign list / kanban overview
      return (
        <div>
          <div className="mktg-header">
            <div style={{width:52,height:52,background:"rgba(168,85,247,0.2)",border:"1px solid rgba(168,85,247,0.3)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name="megaphone" size={24} color="#c084fc"/>
            </div>
            <div style={{flex:1}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,marginBottom:2}}>Marketing Automation</h2>
              <p style={{color:"#64748b",fontSize:13}}>Manage campaigns, track events, and measure goals all in one place.</p>
            </div>
            <button className="btn" onClick={()=>setModal({type:"campaigns",data:{}})} style={{background:"#a855f7",color:"#fff",borderRadius:8,padding:"9px 18px",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
              <Icon name="plus" size={13}/> New Campaign
            </button>
          </div>

          {/* Stats strip */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
            {[
              {label:"Total Campaigns", val:campaigns.length,                           color:"#a855f7"},
              {label:"Active",          val:campaigns.filter(c=>c.status==="Active").length, color:"#059669"},
              {label:"Total Budget",    val:fmt$(campaigns.reduce((s,c)=>s+(c.budget||0),0)), color:"#06b6d4",mono:true},
              {label:"Goals Tracked",   val:goals.length,                               color:"#f97316"},
            ].map(s=>(
              <div key={s.label} style={{background:"#0a1628",border:`1px solid ${s.color}33`,borderRadius:10,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{flex:1}}><div style={{fontFamily:s.mono?"'DM Mono',monospace":undefined,fontSize:20,fontWeight:700,color:s.color}}>{s.val}</div><div style={{fontSize:11,color:"#64748b",fontWeight:600,marginTop:2}}>{s.label}</div></div>
              </div>
            ))}
          </div>

          {/* Campaign cards */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {filtered.campaigns.map(c=>{
              const cEvents = events.filter(e=>e.campaignId===c.id);
              const cGoals  = goals.filter(g=>g.campaignId===c.id);
              const avgPct  = cGoals.length>0?Math.round(cGoals.reduce((s,g)=>s+pct(g.currentValue,g.targetValue),0)/cGoals.length):null;
              return(
                <div key={c.id} className="campaign-card" onClick={()=>setSelectedCamp(c.id)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <span className="tag tag-pink" style={{marginBottom:6,display:"inline-block"}}>{c.type}</span>
                      <h3 style={{fontSize:15,fontWeight:700}}>{c.name}</h3>
                    </div>
                    <Bdg text={c.status} colors={campStatusC[c.status]||"2563eb,1e3a8a"}/>
                  </div>
                  <p style={{fontSize:12,color:"#64748b",lineHeight:1.5,marginBottom:12,height:36,overflow:"hidden"}}>{c.description?.slice(0,100)}…</p>
                  {avgPct!==null&&<>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
                      <span style={{color:"#64748b"}}>Avg Goal Progress</span>
                      <span style={{fontFamily:"'DM Mono'",color:avgPct>=80?"#34d399":avgPct>=50?"#60a5fa":"#fbbf24",fontWeight:600}}>{avgPct}%</span>
                    </div>
                    <div className="progress-bar-bg" style={{marginBottom:12}}><div className="progress-bar-fill" style={{width:`${avgPct}%`,background:avgPct>=80?"#059669":avgPct>=50?"#3b82f6":"#d97706"}}/></div>
                  </>}
                  <div style={{display:"flex",gap:12,fontSize:12,color:"#64748b",borderTop:"1px solid #1e3a5f",paddingTop:10,marginTop:4}}>
                    <span><Icon name="events" size={12} color="#64748b"/> {cEvents.length} events</span>
                    <span><Icon name="goals" size={12} color="#64748b"/> {cGoals.length} goals</span>
                    <span style={{marginLeft:"auto",fontFamily:"'DM Mono'",color:"#a855f7",fontWeight:600}}>{fmt$(c.budget)}</span>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:10}} onClick={e=>e.stopPropagation()}>
                    <button className="action-btn" onClick={()=>setModal({type:"campaigns",data:c})}><Icon name="edit" size={11}/> Edit</button>
                    <button className="action-btn danger" onClick={()=>remove("campaigns",c.id)}><Icon name="trash" size={11}/> Delete</button>
                  </div>
                </div>
              );
            })}
            {filtered.campaigns.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",color:"#374151",padding:40}}>No campaigns found.</div>}
          </div>
        </div>
      );
    }

    // ── Campaign Detail drill-down ──────────────────────────────────────
    return (
      <div>
        <button className="btn action-btn" style={{marginBottom:18}} onClick={()=>setSelectedCamp(null)}>← Back to Campaigns</button>
        <div className="mktg-header" style={{marginBottom:20}}>
          <div style={{width:48,height:48,background:"rgba(168,85,247,0.2)",border:"1px solid rgba(168,85,247,0.3)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="campaigns" size={22} color="#c084fc"/></div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:21}}>{camp.name}</h2>
              <Bdg text={camp.status} colors={campStatusC[camp.status]||"2563eb,1e3a8a"}/>
              <span className="tag tag-pink">{camp.type}</span>
            </div>
            <p style={{color:"#64748b",fontSize:13}}>{camp.startDate} → {camp.endDate} · Budget: <span style={{color:"#a855f7",fontWeight:600}}>{fmt$(camp.budget)}</span></p>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button className="action-btn" onClick={()=>setModal({type:"campaigns",data:camp})}><Icon name="edit" size={12}/> Edit</button>
            <button className="btn" onClick={()=>setModal({type:"events",data:{campaignId:camp.id}})} style={{background:"#06b6d4",color:"#fff",borderRadius:8,padding:"8px 14px",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}><Icon name="plus" size={13}/> Add Event</button>
            <button className="btn" onClick={()=>setModal({type:"goals",data:{campaignId:camp.id}})} style={{background:"#f97316",color:"#fff",borderRadius:8,padding:"8px 14px",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}><Icon name="plus" size={13}/> Add Goal</button>
          </div>
        </div>
        <p style={{color:"#94a3b8",fontSize:14,lineHeight:1.7,marginBottom:22}}>{camp.description}</p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
          {/* Events */}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <h3 style={{fontSize:13,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.7px"}}>Events ({campEvents.length})</h3>
            </div>
            {campEvents.length===0&&<p style={{fontSize:13,color:"#374151"}}>No events in this campaign yet.</p>}
            {campEvents.map(ev=>(
              <div key={ev.id} className="event-card" onClick={()=>setDetail({type:"events",id:ev.id})}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <h4 style={{fontSize:14,fontWeight:600,flex:1,marginRight:8}}>{ev.name}</h4>
                  <Bdg text={ev.status} colors={eventStatusC[ev.status]||"2563eb,1e3a8a"}/>
                </div>
                <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>{ev.date} · {ev.location}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span className="tag tag-green">{ev.type}</span>
                  <span style={{fontSize:12,color:"#64748b"}}><Icon name="users" size={11} color="#64748b"/> {(ev.leadIds||[]).length} leads</span>
                </div>
                <div style={{display:"flex",gap:8,marginTop:10}} onClick={e=>e.stopPropagation()}>
                  <button className="action-btn" onClick={()=>setModal({type:"events",data:ev})}><Icon name="edit" size={11}/> Edit</button>
                  <button className="action-btn danger" onClick={()=>remove("events",ev.id)}><Icon name="trash" size={11}/> Delete</button>
                </div>
              </div>
            ))}
          </div>

          {/* Goals */}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <h3 style={{fontSize:13,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.7px"}}>Goals ({campGoals.length})</h3>
            </div>
            {campGoals.length===0&&<p style={{fontSize:13,color:"#374151"}}>No goals in this campaign yet.</p>}
            {campGoals.map(g=>{
              const p=pct(g.currentValue,g.targetValue);
              const barColor=p>=100?"#059669":p>=60?"#3b82f6":"#d97706";
              return(
                <div key={g.id} className="goal-meter" style={{marginBottom:12,cursor:"pointer"}} onClick={()=>setDetail({type:"goals",id:g.id})}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div><div style={{fontSize:14,fontWeight:600}}>{g.name}</div><div style={{fontSize:11,color:"#64748b",marginTop:2}}>{g.metric} · due {g.dueDate}</div></div>
                    <span style={{fontFamily:"'DM Mono'",fontSize:18,fontWeight:700,color:barColor,marginLeft:8}}>{p}%</span>
                  </div>
                  <div className="progress-bar-bg" style={{marginBottom:8}}><div className="progress-bar-fill" style={{width:`${p}%`,background:barColor}}/></div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                    <span style={{color:"#e2e8f0",fontWeight:600}}>{g.currentValue} {g.unit} <span style={{color:"#64748b",fontWeight:400}}>current</span></span>
                    <span style={{color:"#64748b"}}>target {g.targetValue} {g.unit}</span>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:10}} onClick={e=>e.stopPropagation()}>
                    <button className="action-btn" onClick={()=>setModal({type:"goals",data:g})}><Icon name="edit" size={11}/> Edit</button>
                    <button className="action-btn danger" onClick={()=>remove("goals",g.id)}><Icon name="trash" size={11}/> Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     TABLE VIEW FACTORY
  ═══════════════════════════════════════════════════════════════════════ */
  const TableView = ({title,type,columns,rows,onAdd,addLabel}) => (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24}}>{title}</h2><p style={{color:"#64748b",fontSize:13,marginTop:2}}>{rows.length} record{rows.length!==1?"s":""}</p></div>
        <button className="btn" onClick={onAdd} style={{background:"#2563eb",color:"#fff",borderRadius:8,padding:"9px 18px",fontWeight:600,display:"flex",alignItems:"center",gap:7,fontSize:13}}>
          <Icon name="plus" size={13}/>{addLabel||`New ${title.slice(0,-1)}`}
        </button>
      </div>
      <div style={{background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            {columns.map(c=><th key={c.key} style={{padding:"9px 15px",borderBottom:"1px solid #1e3a5f",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.7px",background:"#060d1a",textAlign:"left"}}>{c.label}</th>)}
            <th style={{padding:"9px 15px",borderBottom:"1px solid #1e3a5f",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.7px",background:"#060d1a",textAlign:"right"}}>Actions</th>
          </tr></thead>
          <tbody>
            {rows.length===0
              ?<tr><td colSpan={columns.length+1} style={{padding:40,textAlign:"center",color:"#374151",fontSize:14}}>No records found.</td></tr>
              :rows.map(row=>(
                <tr key={row.id} className="table-row" style={{cursor:"pointer"}} onClick={()=>setDetail({type,id:row.id})}>
                  {columns.map(c=><td key={c.key} style={{padding:"11px 15px",borderBottom:"1px solid #0d1f3a",fontSize:14,...c.style}}>{c.render?c.render(row):row[c.key]}</td>)}
                  <td style={{padding:"11px 15px",borderBottom:"1px solid #0d1f3a",textAlign:"right",whiteSpace:"nowrap"}} onClick={e=>e.stopPropagation()}>
                    <button className="action-btn" style={{marginRight:6}} onClick={()=>setModal({type,data:row})}><Icon name="edit" size={11}/> Edit</button>
                    <button className="action-btn danger" onClick={()=>remove(type,row.id)}><Icon name="trash" size={11}/> Del</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════════
     VIEW DEFINITIONS
  ═══════════════════════════════════════════════════════════════════════ */
  const mono  = {fontFamily:"'DM Mono',monospace",fontSize:13};
  const muted = {color:"#64748b",fontSize:13};

  const views = {
    dashboard: <Dashboard/>,
    campaigns: <CampaignHub/>,

    companies: <TableView title="Companies" type="companies" rows={filtered.companies}
      onAdd={()=>setModal({type:"companies",data:{}})} addLabel="New Company"
      columns={[
        {key:"name",     label:"Company",  render:r=><span style={{fontWeight:600}}>{r.name}</span>},
        {key:"industry", label:"Industry", render:r=><span className="tag">{r.industry}</span>},
        {key:"phone",    label:"Phone",    style:mono},
        {key:"email",    label:"Email",    style:muted},
        {key:"contacts", label:"Contacts", render:r=><span style={{...mono,color:"#3b82f6"}}>{contacts.filter(c=>c.companyId===r.id).length}</span>},
        {key:"createdAt",label:"Since",    style:muted},
      ]}/>,

    contacts: <TableView title="Contacts" type="contacts" rows={filtered.contacts}
      onAdd={()=>setModal({type:"contacts",data:{}})} addLabel="New Contact"
      columns={[
        {key:"name",    label:"Name",    render:r=>(
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,background:"#1e3a8a",borderRadius:50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#93c5fd",flexShrink:0}}>{r.name[0]}</div>
            <div><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:"#64748b"}}>{r.title}</div></div>
          </div>
        )},
        {key:"email",   label:"Email",   style:muted},
        {key:"phone",   label:"Phone",   style:mono},
        {key:"company", label:"Company", render:r=>r.companyId?<span className="tag">{getCompany(r.companyId)?.name}</span>:<span style={{color:"#374151"}}>Independent</span>},
        {key:"createdAt",label:"Since",  style:muted},
      ]}/>,

    leads: <TableView title="Leads" type="leads" rows={filtered.leads}
      onAdd={()=>setModal({type:"leads",data:{}})} addLabel="New Lead"
      columns={[
        {key:"contact",   label:"Contact",   render:r=><span style={{fontWeight:600}}>{getContact(r.contactId)?.name}</span>},
        {key:"company",   label:"Company",   render:r=>{const co=getCompany(getContact(r.contactId)?.companyId);return co?<span className="tag">{co.name}</span>:<span style={{color:"#374151"}}>—</span>;}},
        {key:"status",    label:"Status",    render:r=><Bdg text={r.status} colors={statusColors[r.status]||"2563eb,1e3a8a"}/>},
        {key:"source",    label:"Source",    render:r=><span className="tag">{r.source}</span>},
        {key:"event",     label:"Event",     render:r=>r.eventId?<span style={{fontSize:12,color:"#14b8a6"}}>{getEvent(r.eventId)?.name?.slice(0,28)}…</span>:<span style={{color:"#374151",fontSize:12}}>—</span>},
        {key:"converted", label:"Converted", render:r=>r.converted?<span style={{color:"#059669",fontSize:12,fontWeight:600}}>✓ Yes</span>:<span style={{color:"#374151",fontSize:12}}>No</span>},
        {key:"createdAt", label:"Date",      style:muted},
      ]}/>,

    opportunities: <TableView title="Opportunities" type="opportunities" rows={filtered.opportunities}
      onAdd={()=>setModal({type:"opportunities",data:{productIds:[]}})} addLabel="New Opportunity"
      columns={[
        {key:"title",    label:"Title",    render:r=><span style={{fontWeight:600}}>{r.title}</span>},
        {key:"value",    label:"Value",    render:r=><span style={{...mono,color:"#3b82f6",fontWeight:600}}>${r.value?.toLocaleString()}</span>},
        {key:"stage",    label:"Stage",    render:r=><Bdg text={r.stage} colors={stageColor(r.stage)}/>},
        {key:"contact",  label:"Contact",  render:r=>getContact(r.contactId)?.name||"—"},
        {key:"products", label:"Products", render:r=><span style={{...mono,color:"#64748b"}}>{r.productIds?.length||0} items</span>},
        {key:"closeDate",label:"Close",    style:muted},
      ]}/>,

    products: <TableView title="Products" type="products" rows={filtered.products}
      onAdd={()=>setModal({type:"products",data:{}})} addLabel="New Product"
      columns={[
        {key:"name",       label:"Product",     render:r=><span style={{fontWeight:600}}>{r.name}</span>},
        {key:"sku",        label:"SKU",         render:r=><code style={{...mono,color:"#64748b",background:"#0d1526",padding:"2px 7px",borderRadius:4}}>{r.sku}</code>},
        {key:"price",      label:"Unit Price",  render:r=><span style={{...mono,color:"#3b82f6",fontWeight:600}}>${r.price?.toFixed(2)}</span>},
        {key:"description",label:"Description", style:{...muted,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},
        {key:"createdAt",  label:"Since",       style:muted},
      ]}/>,

    invoices: <TableView title="Invoices" type="invoices" rows={filtered.invoices}
      onAdd={()=>setModal({type:"invoices",data:{lineItems:[]}})} addLabel="New Invoice"
      columns={[
        {key:"id",      label:"Invoice #",  render:r=><code style={{...mono,color:"#94a3b8"}}>INV-{r.id.toUpperCase()}</code>},
        {key:"contact", label:"Bill To",    render:r=><span style={{fontWeight:600}}>{getContact(r.contactId)?.name}</span>},
        {key:"company", label:"Company",    render:r=>{const co=getCompany(getContact(r.contactId)?.companyId);return co?<span className="tag">{co.name}</span>:<span style={{color:"#374151"}}>—</span>;}},
        {key:"status",  label:"Status",     render:r=><Bdg text={r.status} colors={invColors[r.status]||"2563eb,1e3a8a"}/>},
        {key:"lines",   label:"Line Items", render:r=><span style={{...mono,color:"#64748b"}}>{(r.lineItems||[]).length} items</span>},
        {key:"total",   label:"Total",      render:r=><span style={{...mono,color:"#3b82f6",fontWeight:600}}>${invTotal(r).toFixed(2)}</span>},
        {key:"dueDate", label:"Due",        style:muted},
      ]}/>,

    events: <TableView title="Events" type="events" rows={filtered.events}
      onAdd={()=>setModal({type:"events",data:{leadIds:[]}})} addLabel="New Event"
      columns={[
        {key:"name",      label:"Event",     render:r=><span style={{fontWeight:600}}>{r.name}</span>},
        {key:"type",      label:"Type",      render:r=><span className="tag tag-green">{r.type}</span>},
        {key:"campaign",  label:"Campaign",  render:r=>r.campaignId?<span style={{fontSize:12,color:"#a855f7"}}>{getCampaign(r.campaignId)?.name?.slice(0,26)}</span>:<span style={{color:"#374151"}}>—</span>},
        {key:"status",    label:"Status",    render:r=><Bdg text={r.status} colors={eventStatusC[r.status]||"2563eb,1e3a8a"}/>},
        {key:"date",      label:"Date",      style:muted},
        {key:"leads",     label:"Leads",     render:r=><span style={{...mono,color:"#14b8a6"}}>{(r.leadIds||[]).length}</span>},
        {key:"location",  label:"Location",  style:{...muted,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},
      ]}/>,

    goals: <TableView title="Goals" type="goals" rows={filtered.goals}
      onAdd={()=>setModal({type:"goals",data:{}})} addLabel="New Goal"
      columns={[
        {key:"name",    label:"Goal",     render:r=><span style={{fontWeight:600}}>{r.name}</span>},
        {key:"metric",  label:"Metric",   render:r=><span className="tag tag-amber">{r.metric}</span>},
        {key:"campaign",label:"Campaign", render:r=>r.campaignId?<span style={{fontSize:12,color:"#a855f7"}}>{getCampaign(r.campaignId)?.name?.slice(0,26)}</span>:<span style={{color:"#374151"}}>—</span>},
        {key:"progress",label:"Progress", render:r=>{
          const p=pct(r.currentValue,r.targetValue);
          const c=p>=100?"#059669":p>=60?"#3b82f6":"#d97706";
          return(<div style={{width:120}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:11}}><span style={{color:"#64748b"}}>{r.currentValue}/{r.targetValue} {r.unit}</span><span style={{color:c,fontWeight:700}}>{p}%</span></div>
            <div className="progress-bar-bg" style={{height:5}}><div className="progress-bar-fill" style={{width:`${p}%`,background:c}}/></div>
          </div>);
        }},
        {key:"dueDate",label:"Due",   style:muted},
      ]}/>,
  };

  /* ═══════════════════════════════════════════════════════════════════════
     MODAL ROUTING
  ═══════════════════════════════════════════════════════════════════════ */
  const modalMap = {
    companies:     {title:modal?.data?.id?"Edit Company":"New Company",          form:<FormCompany     init={modal?.data}/>},
    contacts:      {title:modal?.data?.id?"Edit Contact":"New Contact",          form:<FormContact     init={modal?.data}/>},
    leads:         {title:modal?.data?.id?"Edit Lead":"New Lead",                form:<FormLead        init={modal?.data}/>},
    opportunities: {title:modal?.data?.id?"Edit Opportunity":"New Opportunity",  form:<FormOpportunity init={modal?.data}/>},
    products:      {title:modal?.data?.id?"Edit Product":"New Product",          form:<FormProduct     init={modal?.data}/>},
    invoices:      {title:modal?.data?.id?"Edit Invoice":"New Invoice",          form:<FormInvoice     init={modal?.data}/>, wide:true},
    campaigns:     {title:modal?.data?.id?"Edit Campaign":"New Campaign",        form:<FormCampaign    init={modal?.data}/>},
    events:        {title:modal?.data?.id?"Edit Event":"New Event",              form:<FormEvent       init={modal?.data}/>,
                    subtitle:"Events can belong to a Campaign and can have zero to many Leads associated."},
    goals:         {title:modal?.data?.id?"Edit Goal":"New Goal",                form:<FormGoal        init={modal?.data}/>,
                    subtitle:"Goals measure campaign performance. Link to a Campaign to track progress."},
  };

  /* ═══════════════════════════════════════════════════════════════════════
     NAV ITEMS — split into CRM and Marketing sections
  ═══════════════════════════════════════════════════════════════════════ */
  const crmNav = [
    {id:"dashboard",     label:"Dashboard",     icon:"dashboard",     count:undefined},
    {id:"companies",     label:"Companies",     icon:"companies",     count:companies.length},
    {id:"contacts",      label:"Contacts",      icon:"contacts",      count:contacts.length},
    {id:"leads",         label:"Leads",         icon:"leads",         count:leads.filter(l=>!l.converted).length},
    {id:"opportunities", label:"Opportunities", icon:"opportunities", count:opportunities.length},
    {id:"products",      label:"Products",      icon:"products",      count:products.length},
    {id:"invoices",      label:"Invoices",      icon:"invoices",      count:invoices.length},
  ];
  const mktgNav = [
    {id:"campaigns", label:"Campaigns", icon:"megaphone", count:campaigns.length,   accent:"#a855f7"},
    {id:"events",    label:"Events",    icon:"events",    count:events.length,       accent:"#14b8a6"},
    {id:"goals",     label:"Goals",     icon:"goals",     count:goals.length,        accent:"#f97316"},
  ];

  const NavItem = ({item}) => {
    const active = view===item.id;
    const accent = item.accent||"#3b82f6";
    return(
      <div className={`nav-item ${active?"active":""}`} onClick={()=>setView(item.id)}
        style={{display:"flex",alignItems:"center",gap:0,padding:"0",marginBottom:2}}>
        <div className="nav-bar" style={{background:active?accent:"transparent"}}/>
        <div style={{display:"flex",alignItems:"center",gap:9,padding:"8px 11px",flex:1}}>
          <Icon name={item.icon} size={15} color={active?accent:"#64748b"}/>
          <span style={{flex:1,fontSize:13,fontWeight:active?600:400,color:active?"#e2e8f0":"#94a3b8"}}>{item.label}</span>
          {item.count!==undefined&&<span style={{fontSize:11,background:active?`${accent}33`:"#111827",color:active?accent:"#475569",borderRadius:99,padding:"1px 7px",fontFamily:"'DM Mono'"}}>{item.count}</span>}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{style}</style>
      <div style={{display:"flex",minHeight:"100vh"}}>

        {/* ── SIDEBAR ── */}
        <div style={{width:228,background:"#060d1a",borderRight:"1px solid #1e3a5f",flexShrink:0,display:"flex",flexDirection:"column",position:"fixed",top:0,bottom:0,left:0,zIndex:100}}>
          {/* Logo */}
          <div style={{padding:"20px 18px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <div style={{width:36,height:36,background:"linear-gradient(135deg,#1d4ed8,#7c3aed)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name="list" size={18} color="#fff"/>
              </div>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:700,color:"#f8fafc",lineHeight:1,letterSpacing:"-0.5px"}}>CRM</div>
                <div style={{fontSize:9,color:"#374151",letterSpacing:"1.8px",textTransform:"uppercase",fontWeight:600,marginTop:1}}>Enterprise Edition</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div style={{padding:"0 10px 10px"}}>
            <div style={{position:"relative"}}>
              <input className="input" style={{paddingLeft:33,fontSize:13,padding:"8px 12px 8px 33px"}} placeholder="Search all records…" value={search} onChange={e=>setSearch(e.target.value)}/>
              <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#374151",pointerEvents:"none"}}><Icon name="search" size={13}/></div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{flex:1,padding:"0 8px",overflowY:"auto"}}>
            <div className="nav-divider">Sales CRM</div>
            {crmNav.map(item=><NavItem key={item.id} item={item}/>)}
            <div className="nav-divider" style={{marginTop:6}}>Marketing</div>
            {mktgNav.map(item=><NavItem key={item.id} item={item}/>)}
          </nav>

          {/* Footer */}
          <div style={{padding:"12px 16px",borderTop:"1px solid #1e3a5f"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:28,height:28,background:"linear-gradient(135deg,#1d4ed8,#7c3aed)",borderRadius:50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>A</div>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>Admin User</div>
                <div style={{fontSize:11,color:"#374151"}}>admin@company.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{marginLeft:228,flex:1,padding:"28px 30px",background:"#060d1a",minHeight:"100vh",paddingRight:detail?"402px":"30px",transition:"padding-right 0.2s"}}>
          {views[view]}
        </div>

        {/* ── DETAIL PANEL ── */}
        <DetailPanel/>

        {/* ── MODAL ── */}
        {modal && modalMap[modal.type] && (
          <Modal title={modalMap[modal.type].title} subtitle={modalMap[modal.type].subtitle} onClose={closeModal} wide={modalMap[modal.type].wide}>
            {modalMap[modal.type].form}
          </Modal>
        )}

        {/* ── TOAST ── */}
        {toast && (
          <div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:toast.type==="error"?"#450a0a":"#052e16",border:`1px solid ${toast.type==="error"?"#dc2626":"#059669"}`,color:"#f8fafc",padding:"10px 20px",borderRadius:10,fontSize:14,fontWeight:500,zIndex:2000,display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 32px rgba(0,0,0,0.6)",pointerEvents:"none"}}>
            <Icon name={toast.type==="error"?"trash":"check"} size={13} color={toast.type==="error"?"#f87171":"#34d399"}/>
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}
