import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import CTABanner from '../components/CTABanner';

const WA_URL = 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.';

const resources = [
  {
    cat: 'hotline', icon: 'fa-phone-volume', iconColor: '#2E7D32',
    title: 'GBV Toll-Free Hotline',
    desc: "Rwanda's national 24/7 free hotline for GBV survivors, witnesses, and those at risk. Confidential support from trained counselors.",
    highlight: { number: '3512', detail: '24 hours / 7 days a week · Free call' },
    link: { href: 'tel:3512', icon: 'fa-phone', label: 'Call Now' },
  },
  {
    cat: 'hotline', icon: 'fa-whatsapp', iconColor: '#25D366',
    title: 'WhatsApp Support Line',
    desc: 'Not ready to speak? Connect with our support team confidentially via WhatsApp — text at any time, in Kinyarwanda, French, or English.',
    highlight: { number: '+250 781 640 246', detail: 'WhatsApp · Confidential messaging · 24/7' },
    link: { href: WA_URL, icon: 'fa-whatsapp', label: 'Chat Now', external: true },
  },
  {
    cat: 'legal', icon: 'fa-gavel', iconColor: '#2E7D32',
    title: 'Legal Aid & Rights',
    desc: 'Free legal assistance for GBV survivors navigating the justice system, including filing reports, protective orders, and court representation.',
    extra: { strong: 'Rwanda Legal Aid Forum', note: 'Available in all provinces · Pro-bono services' },
    link: { to: '/contact', icon: 'fa-scale-balanced', label: 'Connect with Legal Aid' },
  },
  {
    cat: 'legal', icon: 'fa-file-shield', iconColor: '#2E7D32',
    title: 'Know Your Legal Rights',
    desc: "Rwanda's Law No 59/2008 on Prevention and Punishment of GBV protects survivors. Understand your rights and the legal processes available to you.",
    checks: ['Right to file police report', 'Right to protection orders', 'Right to free medical care'],
    link: { href: '#', icon: 'fa-download', label: 'Download Rights Guide' },
  },
  {
    cat: 'shelter', icon: 'fa-house-chimney-heart', iconColor: '#2E7D32',
    title: 'Safe House & Shelters',
    desc: 'Emergency and transitional shelter for GBV survivors who need a safe place to stay. Accommodations include children and support services.',
    extra: { strong: 'Isange One Stop Centre', note: 'Kigali & regional branches · 24hr access' },
    link: { to: '/contact', icon: 'fa-map-location-dot', label: 'Find Nearest Shelter' },
  },
  {
    cat: 'shelter', icon: 'fa-hands-holding-child', iconColor: '#2E7D32',
    title: 'Child-Specific Protection',
    desc: 'Dedicated support for children affected by GBV — including safe shelter, psychosocial support, and school re-integration programs.',
    extra: { strong: 'National Child Helpline', note: '116 · Free · 24/7' },
    link: { href: 'tel:116', icon: 'fa-phone', label: 'Call 116' },
  },
  {
    cat: 'mental', icon: 'fa-brain', iconColor: '#2E7D32',
    title: 'Psychological Counseling',
    desc: 'Confidential one-on-one and group therapy sessions for GBV survivors, offered by trained mental health professionals with trauma expertise.',
    checks: ['Individual sessions', 'Group therapy', 'Online sessions available'],
    link: { to: '/contact', icon: 'fa-calendar-check', label: 'Book a Session' },
  },
  {
    cat: 'mental', icon: 'fa-people-arrows', iconColor: '#2E7D32',
    title: 'Survivor Support Groups',
    desc: 'Community-led support groups connecting survivors with others who have lived experience. Share stories, find solidarity, and rebuild resilience together.',
    extra: { strong: 'Weekly meetings', note: 'In-person in Kigali & online for others' },
    link: { to: '/contact', icon: 'fa-user-plus', label: 'Join a Group' },
  },
  {
    cat: 'education', icon: 'fa-book-open-reader', iconColor: '#2E7D32',
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
  { key: 'all', label: 'All Resources' },
  { key: 'hotline', label: 'Hotlines' },
  { key: 'legal', label: 'Legal Aid' },
  { key: 'shelter', label: 'Shelters' },
  { key: 'mental', label: 'Mental Health' },
  { key: 'education', label: 'Education' },
];

const reportingSteps = [
  { num: 1, title: 'Get to Safety', desc: 'Remove yourself or the person at risk from immediate danger. Call 112 if life is threatened.' },
  { num: 2, title: 'Seek Medical Care', desc: 'Visit the nearest hospital or Isange One Stop Centre. Medical care is free for GBV survivors.' },
  { num: 3, title: 'Report to Police', desc: 'File a report at any police station. You have the right to a female officer if preferred. Keep copies of everything.' },
  { num: 4, title: 'Get Ongoing Support', desc: 'Connect with counseling, legal aid, and support groups to help you heal and rebuild your life.' },
];

function ResourceCard({ resource }) {
  return (
    <div className="bg-white rounded-[16px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_30px_rgba(46,125,50,0.12)] border-l-4 border-[#6BCB77] fade-in">
      <div className="text-[2rem] mb-4" style={{ color: resource.iconColor }}>
        <i className={`fas ${resource.icon}`}></i>
      </div>
      <h3 className="font-['Playfair_Display'] text-[1.1rem] mb-2.5">{resource.title}</h3>
      <p className="text-[0.88rem] text-gray-500 mb-4">{resource.desc}</p>
      {resource.highlight && (
        <div className="bg-[#C8FACC] rounded-[10px] p-3 px-4 mb-4">
          <strong className="text-[#2E7D32] text-[1.3rem] block">{resource.highlight.number}</strong>
          <span className="text-[0.8rem] text-gray-500">{resource.highlight.detail}</span>
        </div>
      )}
      {resource.extra && (
        <p className="mt-2 mb-4">
          <strong>{resource.extra.strong}</strong><br />
          <span className="text-[0.82rem] text-gray-500">{resource.extra.note}</span>
        </p>
      )}
      {resource.checks && (
        <div className="mb-4 text-[0.85rem] text-gray-500 space-y-1">
          {resource.checks.map(c => <div key={c}><i className="fas fa-check text-[#6BCB77] mr-1.5"></i>{c}</div>)}
        </div>
      )}
      {resource.eduItems && (
        <div className="mb-4 text-[0.85rem] text-gray-500 space-y-1">
          {resource.eduItems.map(e => <div key={e.label}><i className={`fas ${e.icon} mr-1.5`} style={{ color: e.color }}></i>{e.label}</div>)}
        </div>
      )}
      {resource.link.to ? (
        <Link to={resource.link.to} className="text-[0.88rem] font-semibold text-[#2E7D32] inline-flex items-center gap-1.5 transition-all duration-300 hover:text-[#6BCB77] hover:gap-2.5">
          <i className={`fas ${resource.link.icon}`}></i> {resource.link.label}
        </Link>
      ) : (
        <a href={resource.link.href} {...(resource.link.external ? { target: '_blank', rel: 'noopener' } : {})}
          className="text-[0.88rem] font-semibold text-[#2E7D32] inline-flex items-center gap-1.5 transition-all duration-300 hover:text-[#6BCB77] hover:gap-2.5">
          <i className={`fas ${resource.link.icon}`}></i> {resource.link.label}
        </a>
      )}
    </div>
  );
}

export default function Resources() {
  const [activeFilter, setActiveFilter] = useState('all');
  const filtered = resources.filter(r => activeFilter === 'all' || r.cat === activeFilter);

  return (
    <>
      <PageHero title="Resources & Support" subtitle="Hotlines, legal aid, shelters, counseling — everything you need to find help" breadcrumb="Resources" />

      {/* Emergency Banner */}
      <section className="bg-[#b71c1c] py-6">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-4 text-white flex-wrap">
            <i className="fas fa-triangle-exclamation text-[1.6rem] shrink-0"></i>
            <div>
              <strong className="text-[1rem]">In immediate danger?</strong>
              <span className="opacity-90 ml-2 text-[0.95rem]">Call emergency services immediately: <strong>112</strong> (Rwanda Emergency) or <strong>3512</strong> (GBV Hotline)</span>
            </div>
            <a href="tel:3512" className="ml-auto bg-white text-[#b71c1c] px-6 py-2.5 rounded-full font-bold text-[0.9rem] shrink-0 transition-opacity hover:opacity-90">Call Hotline Now</a>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-[100px] bg-[#F8FAF9]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center">
            <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-semibold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-4">Support Services</span>
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-5">Find the Help You Need</h2>
            <p className="text-[1.1rem] text-gray-500 max-w-[600px] mx-auto">Filter by type of support to find the right resource for your situation.</p>
          </div>

          <div className="flex gap-3 flex-wrap justify-center mt-9">
            {filters.map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)}
                className={`px-5 py-2 rounded-full text-[0.88rem] font-semibold border-2 cursor-pointer transition-all duration-300 ${activeFilter === f.key ? 'bg-[#6BCB77] border-[#6BCB77] text-white' : 'bg-white border-gray-200 hover:bg-[#6BCB77] hover:border-[#6BCB77] hover:text-white'}`}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 mt-9 max-md:grid-cols-2 max-sm:grid-cols-1">
            {filtered.map((r, i) => <ResourceCard key={i} resource={r} />)}
          </div>
        </div>
      </section>

      {/* How to Report */}
      <section className="py-[100px] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center">
            <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-semibold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-4">Step by Step</span>
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-5">How to Report GBV</h2>
            <p className="text-[1.1rem] text-gray-500 max-w-[600px] mx-auto">Reporting can feel overwhelming. Here's a simple, clear guide on what to do and who to contact.</p>
          </div>
          <div className="grid grid-cols-4 gap-6 mt-12 max-md:grid-cols-2 max-sm:grid-cols-1">
            {reportingSteps.map((step) => (
              <div key={step.num} className="text-center px-5 py-7 fade-in">
                <div className="w-[72px] h-[72px] rounded-full bg-[#C8FACC] flex items-center justify-center mx-auto mb-5 text-[1.6rem] font-['Playfair_Display'] font-black text-[#2E7D32]">{step.num}</div>
                <h3 className="font-['Playfair_Display'] text-[1.1rem] mb-2.5">{step.title}</h3>
                <p className="text-[0.88rem] text-gray-500">{step.desc}</p>
              </div>
            ))}
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
