import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import CTABanner from '../components/CTABanner';
import { useFadeInList } from '../hooks/useFadeIn';

const WA_URL = 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.';

const resources = [
  {
    cat: 'report', icon: 'fa-file-shield', iconColor: '#2E7D32', accent: '#6BCB77',
    title: 'Report Anonymously Online',
    desc: 'Submit a report securely and anonymously through our digital platform. Get a case code to track progress and chat with a counselor in real time.',
    highlight: { number: 'Digital Reporting', detail: 'Anonymous · Encrypted · Available 24/7' },
    link: { to: '/report', icon: 'fa-arrow-right', label: 'Start a Report' },
    featured: true,
  },
  {
    cat: 'hotline', icon: 'fa-phone-volume', iconColor: '#2E7D32', accent: '#6BCB77',
    title: 'GBV Toll-Free Hotline',
    desc: "Rwanda's national 24/7 free hotline for GBV survivors, witnesses, and those at risk. Confidential support from trained counselors.",
    highlight: { number: '3512', detail: '24 hours / 7 days a week · Free call' },
    link: { href: 'tel:3512', icon: 'fa-phone', label: 'Call Now' },
  },
  {
    cat: 'hotline', icon: 'fa-whatsapp', iconColor: '#25D366', accent: '#25D366',
    title: 'WhatsApp Support Line',
    desc: 'Not ready to speak? Connect with our support team confidentially via WhatsApp — text at any time, in Kinyarwanda, French, or English.',
    highlight: { number: '+250 781 640 246', detail: 'WhatsApp · Confidential messaging · 24/7' },
    link: { href: WA_URL, icon: 'fa-whatsapp', label: 'Chat Now', external: true },
  },
  {
    cat: 'legal', icon: 'fa-gavel', iconColor: '#2E7D32', accent: '#6BCB77',
    title: 'Legal Aid & Rights',
    desc: 'Free legal assistance for GBV survivors navigating the justice system, including filing reports, protective orders, and court representation.',
    extra: { strong: 'Rwanda Legal Aid Forum', note: 'Available in all provinces · Pro-bono services' },
    link: { to: '/contact', icon: 'fa-scale-balanced', label: 'Connect with Legal Aid' },
  },
  {
    cat: 'legal', icon: 'fa-file-shield', iconColor: '#2E7D32', accent: '#6BCB77',
    title: 'Know Your Legal Rights',
    desc: "Rwanda's Law No 59/2008 on Prevention and Punishment of GBV protects survivors. Understand your rights and the legal processes available to you.",
    checks: ['Right to file police report', 'Right to protection orders', 'Right to free medical care'],
    link: { href: '#', icon: 'fa-download', label: 'Download Rights Guide' },
  },
  {
    cat: 'shelter', icon: 'fa-house-chimney-heart', iconColor: '#2E7D32', accent: '#6BCB77',
    title: 'Safe House & Shelters',
    desc: 'Emergency and transitional shelter for GBV survivors who need a safe place to stay. Accommodations include children and support services.',
    extra: { strong: 'Isange One Stop Centre', note: 'Kigali & regional branches · 24hr access' },
    link: { to: '/contact', icon: 'fa-map-location-dot', label: 'Find Nearest Shelter' },
  },
  {
    cat: 'shelter', icon: 'fa-hands-holding-child', iconColor: '#2E7D32', accent: '#6BCB77',
    title: 'Child-Specific Protection',
    desc: 'Dedicated support for children affected by GBV — including safe shelter, psychosocial support, and school re-integration programs.',
    extra: { strong: 'National Child Helpline', note: '116 · Free · 24/7' },
    link: { href: 'tel:116', icon: 'fa-phone', label: 'Call 116' },
  },
  {
    cat: 'mental', icon: 'fa-brain', iconColor: '#2E7D32', accent: '#6BCB77',
    title: 'Psychological Counseling',
    desc: 'Confidential one-on-one and group therapy sessions for GBV survivors, offered by trained mental health professionals with trauma expertise.',
    checks: ['Individual sessions', 'Group therapy', 'Online sessions available'],
    link: { to: '/contact', icon: 'fa-calendar-check', label: 'Book a Session' },
  },
  {
    cat: 'mental', icon: 'fa-people-arrows', iconColor: '#2E7D32', accent: '#6BCB77',
    title: 'Survivor Support Groups',
    desc: 'Community-led support groups connecting survivors with others who have lived experience. Share stories, find solidarity, and rebuild resilience together.',
    extra: { strong: 'Weekly meetings', note: 'In-person in Kigali & online for others' },
    link: { to: '/contact', icon: 'fa-user-plus', label: 'Join a Group' },
  },
  {
    cat: 'education', icon: 'fa-book-open-reader', iconColor: '#2E7D32', accent: '#6BCB77',
    title: 'Educational Materials',
    desc: 'Download free guides, infographics, and toolkits about GBV prevention, recognition, and response in Kinyarwanda, French, and English.',
    eduItems: [
      { icon: 'fa-file-pdf', color: '#b71c1c', label: 'Brochures & Factsheets' },
      { icon: 'fa-video', color: '#2E7D32', label: 'Video Resources' },
      { icon: 'fa-chalkboard', color: '#F4B400', label: 'Training Modules' },
    ],
    link: { href: '#', icon: 'fa-download', label: 'Download Materials' },
  },
];

const filters = [
  { key: 'all', label: 'All Resources', icon: 'fa-grid-2' },
  { key: 'report', label: 'Report', icon: 'fa-file-alt' },
  { key: 'hotline', label: 'Hotlines', icon: 'fa-phone' },
  { key: 'legal', label: 'Legal Aid', icon: 'fa-gavel' },
  { key: 'shelter', label: 'Shelters', icon: 'fa-house-chimney-heart' },
  { key: 'mental', label: 'Mental Health', icon: 'fa-brain' },
  { key: 'education', label: 'Education', icon: 'fa-book-open-reader' },
];

const reportingSteps = [
  { num: '01', title: 'Get to Safety', desc: 'Remove yourself or the person at risk from immediate danger. Call 112 if life is threatened.', icon: 'fa-shield-halved', color: '#b71c1c', bg: '#ffeef0' },
  { num: '02', title: 'Seek Medical Care', desc: 'Visit the nearest hospital or Isange One Stop Centre. Medical care is free for GBV survivors.', icon: 'fa-kit-medical', color: '#1565C0', bg: '#E3F2FD' },
  { num: '03', title: 'Report the Incident', desc: 'File a police report or use our anonymous digital reporting system. You have the right to a female officer if preferred.', icon: 'fa-file-alt', color: '#2E7D32', bg: '#C8FACC' },
  { num: '04', title: 'Get Ongoing Support', desc: 'Connect with counseling, legal aid, and support groups to help you heal and rebuild your life.', icon: 'fa-hands-holding-heart', color: '#F4B400', bg: '#FFF8E1' },
];

function ResourceCard({ resource }) {
  const base = "bg-white rounded-[20px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_36px_rgba(46,125,50,0.14)] border-l-4 flex flex-col relative overflow-hidden group";
  const featured = resource.featured ? 'ring-2 ring-[#6BCB77] ring-offset-2' : '';

  return (
    <div className={`${base} ${featured}`} style={{ borderLeftColor: resource.accent || '#6BCB77' }}>
      {resource.featured && (
        <span className="absolute top-4 right-4 bg-[#6BCB77] text-white text-[0.65rem] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full">
          New
        </span>
      )}
      <div className="text-[2rem] mb-4" style={{ color: resource.iconColor }}>
        <i className={`fas ${resource.icon}`}></i>
      </div>
      <h3 className="font-['Playfair_Display'] text-[1.1rem] mb-2.5">{resource.title}</h3>
      <p className="text-[0.88rem] text-gray-500 mb-4 flex-1 leading-[1.65]">{resource.desc}</p>
      {resource.highlight && (
        <div className="rounded-[12px] p-3.5 px-4 mb-4" style={{ background: resource.featured ? '#C8FACC' : '#F8FAF9' }}>
          <strong className="text-[#2E7D32] text-[1.15rem] block font-['Playfair_Display']">{resource.highlight.number}</strong>
          <span className="text-[0.78rem] text-gray-500">{resource.highlight.detail}</span>
        </div>
      )}
      {resource.extra && (
        <div className="mb-4">
          <strong className="text-[0.88rem]">{resource.extra.strong}</strong>
          <span className="block text-[0.8rem] text-gray-500 mt-0.5">{resource.extra.note}</span>
        </div>
      )}
      {resource.checks && (
        <div className="mb-4 space-y-1.5">
          {resource.checks.map(c => (
            <div key={c} className="flex items-center gap-2 text-[0.84rem] text-gray-500">
              <i className="fas fa-check text-[#6BCB77] text-[0.75em]"></i>{c}
            </div>
          ))}
        </div>
      )}
      {resource.eduItems && (
        <div className="mb-4 space-y-1.5">
          {resource.eduItems.map(e => (
            <div key={e.label} className="flex items-center gap-2 text-[0.84rem] text-gray-500">
              <i className={`fas ${e.icon}`} style={{ color: e.color }}></i>{e.label}
            </div>
          ))}
        </div>
      )}
      {resource.link.to ? (
        <Link to={resource.link.to} className="text-[0.88rem] font-bold text-[#2E7D32] inline-flex items-center gap-1.5 transition-all duration-300 hover:text-[#6BCB77] hover:gap-3 mt-auto">
          <i className={`fas ${resource.link.icon}`}></i> {resource.link.label}
        </Link>
      ) : (
        <a href={resource.link.href} {...(resource.link.external ? { target: '_blank', rel: 'noopener' } : {})}
          className="text-[0.88rem] font-bold text-[#2E7D32] inline-flex items-center gap-1.5 transition-all duration-300 hover:text-[#6BCB77] hover:gap-3 mt-auto">
          <i className={`fas ${resource.link.icon}`}></i> {resource.link.label}
        </a>
      )}
    </div>
  );
}

export default function Resources() {
  const [activeFilter, setActiveFilter] = useState('all');
  const filtered = resources.filter(r => activeFilter === 'all' || r.cat === activeFilter);
  const stepRefs = useFadeInList(4);

  return (
    <>
      <PageHero title="Resources & Support" subtitle="Hotlines, legal aid, shelters, counseling — everything you need to find help" breadcrumb="Resources" />

      {/* Emergency Banner */}
      <section className="bg-[#b71c1c] py-5 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10 pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4 text-white flex-wrap">
            <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 glow-pulse">
              <i className="fas fa-triangle-exclamation text-[1rem]"></i>
            </span>
            <div>
              <strong className="text-[1rem]">In immediate danger?</strong>
              <span className="opacity-90 ml-2 text-[0.92rem]">Call emergency services immediately: <strong>112</strong> (Rwanda Emergency) or <strong>3512</strong> (GBV Hotline)</span>
            </div>
            <div className="ml-auto flex gap-2 shrink-0">
              <a href="tel:112" className="bg-white text-[#b71c1c] px-5 py-2 rounded-full font-bold text-[0.85rem] transition-all hover:bg-red-50 hover:-translate-y-0.5">
                <i className="fas fa-phone mr-1.5"></i>Call 112
              </a>
              <a href="tel:3512" className="bg-[#b71c1c] border-2 border-white text-white px-5 py-2 rounded-full font-bold text-[0.85rem] transition-all hover:bg-white hover:text-[#b71c1c] hover:-translate-y-0.5">
                Call 3512
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-[100px] bg-[#F8FAF9]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center">
            <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-semibold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-4">Support Services</span>
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-5">Find the Help You Need</h2>
            <p className="text-[1.05rem] text-gray-500 max-w-[600px] mx-auto">Filter by type of support to find the right resource for your situation.</p>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2.5 flex-wrap justify-center mt-9">
            {filters.map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[0.85rem] font-semibold border-2 cursor-pointer transition-all duration-300 ${activeFilter === f.key ? 'bg-[#2E7D32] border-[#2E7D32] text-white shadow-[0_4px_16px_rgba(46,125,50,0.3)]' : 'bg-white border-gray-200 text-gray-600 hover:bg-[#C8FACC] hover:border-[#6BCB77] hover:text-[#2E7D32]'}`}>
                <i className={`fas ${f.icon} text-[0.75em]`}></i>
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10 max-md:grid-cols-2 max-sm:grid-cols-1">
            {filtered.map((r, i) => <ResourceCard key={i} resource={r} />)}
          </div>
        </div>
      </section>

      {/* How to Report */}
      <section className="py-[100px] bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[#F8FAF9] to-transparent pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center">
            <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-semibold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-4">Step by Step</span>
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-5">How to Report GBV</h2>
            <p className="text-[1.05rem] text-gray-500 max-w-[600px] mx-auto">Reporting can feel overwhelming. Here's a simple, clear guide on what to do and who to contact.</p>
          </div>
          <div className="grid grid-cols-4 gap-6 mt-14 max-md:grid-cols-2 max-sm:grid-cols-1 relative">
            {/* Connector line */}
            <div className="absolute top-[36px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#b71c1c] via-[#6BCB77] to-[#F4B400] hidden md:block" />
            {reportingSteps.map((step, i) => (
              <div key={step.num} ref={el => stepRefs.current[i] = el}
                className="fade-in text-center px-5 py-8 rounded-[24px] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(46,125,50,0.1)] transition-all duration-300 hover:-translate-y-1 relative">
                <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-5 relative z-10"
                  style={{ background: step.bg, color: step.color }}>
                  <i className={`fas ${step.icon} text-[1.4rem]`}></i>
                </div>
                <span className="font-['Playfair_Display'] text-[#2E7D32]/25 text-[3.5rem] font-black absolute top-3 right-5 leading-none select-none">{step.num}</span>
                <h3 className="font-['Playfair_Display'] text-[1.1rem] mb-2.5 relative z-10">{step.title}</h3>
                <p className="text-[0.85rem] text-gray-500 leading-[1.65] relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Digital Report CTA inside the section */}
          <div className="mt-12 glass rounded-[24px] p-8 flex items-center justify-between gap-6 flex-wrap max-sm:flex-col max-sm:text-center">
            <div>
              <strong className="text-[1rem] text-[#2D2D2D] block mb-1">Prefer to report digitally?</strong>
              <span className="text-[0.88rem] text-gray-500">Our anonymous online reporting system is secure, private, and available 24/7.</span>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/report"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-[30px] bg-[#2E7D32] text-white font-bold text-[0.9rem] shadow-[0_4px_16px_rgba(46,125,50,0.3)] transition-all duration-300 hover:bg-[#1B5E20] hover:-translate-y-0.5">
                <i className="fas fa-file-alt"></i> Report Online
              </Link>
              <Link to="/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-[30px] border-2 border-[#2E7D32] text-[#2E7D32] font-bold text-[0.9rem] transition-all duration-300 hover:bg-[#C8FACC] hover:-translate-y-0.5">
                <i className="fas fa-search"></i> Track Case
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Still Have Questions?"
        subtitle="Our team is here to guide you to the right resources. Reach out confidentially — no judgment, just support."
        primaryLabel="Contact Our Team"
        primaryTo="/contact"
        secondaryLabel="WhatsApp Us"
        secondaryHref={WA_URL}
      />
    </>
  );
}
