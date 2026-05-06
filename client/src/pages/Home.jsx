import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CTABanner from '../components/CTABanner';
import { useFadeIn } from '../hooks/useFadeIn';
import { useCounter } from '../hooks/useCounter';

const WA_URL = 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.';

const slides = [
  {
    bg: '/images/image1.png',
    tag: 'Digital Reporting — Now Live',
    title: 'Your Report.\nYour Safety.\nOur Promise.',
    desc: 'Submit an anonymous report securely from anywhere. Our team responds with care, confidentiality, and urgency. Your voice matters — and now it has a safe channel.',
    primary: { label: 'Report Safely', to: '/report', icon: 'fa-file-alt' },
    secondary: { label: 'Track My Case', to: '/dashboard' },
  },
  {
    bg: '/images/image2.png',
    tag: 'Education is Power',
    title: 'Know the Signs.\nTake a Stand.',
    desc: 'Understanding GBV is the first step toward ending it. Access our educational resources and share awareness with your community.',
    primary: { label: 'View Resources', to: '/resources' },
    secondary: { label: 'Our Mission', to: '/about' },
  },
  {
    bg: '/images/image3.png',
    tag: 'Community & Support',
    title: 'You Are Not Alone.\nWe Stand With You.',
    desc: 'Survivors deserve dignity, support, and justice. Reach out to our team confidentially — we are here to listen and help.',
    primary: { label: 'Get Support', to: '/contact' },
    secondary: { label: 'Find Help', to: '/resources' },
  },
  {
    bg: '/images/image4.png',
    tag: 'Every Voice Matters',
    title: 'Speak Up.\nSomeone Will Hear You.',
    desc: 'Vugandakumva means "Speak, I Can Hear." We are listening — every story matters, every survivor deserves to be heard and supported.',
    primary: { label: 'Speak to Us', to: '/contact' },
    secondary: { label: 'Our Work', to: '/awareness' },
  },
  {
    bg: '/images/image5.png',
    tag: 'Community First',
    title: 'Together We Build\nSafer Communities.',
    desc: 'Real change begins at home, in schools, and in our neighborhoods. Join Vugandakumva and help build a future free from violence.',
    primary: { label: 'Meet Our Team', to: '/about' },
    secondary: { label: 'Volunteer', to: '/contact' },
  },
  {
    bg: '/images/image6.png',
    tag: 'Justice & Healing',
    title: 'Healing is Possible.\nHope is Here.',
    desc: 'Recovery from GBV takes courage, community, and compassion. We walk alongside survivors every step of the way — from crisis to healing.',
    primary: { label: 'Find Support', to: '/resources' },
    secondary: { label: 'Contact Us', to: '/contact' },
  },
];

function HeroSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section aria-label="Hero Image Slider" className="mt-[72px] relative h-[calc(100vh-72px)] min-h-[520px] max-h-[860px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        loop
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        pagination={{ clickable: true, el: '.hero-pagination' }}
        className="w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="relative w-full h-full">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[8000ms]"
              style={{ backgroundImage: `url('${slide.bg}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
            <div className="absolute inset-0 flex items-center px-[8%]">
              <div className="max-w-[660px]">
                <span className="inline-block bg-[#F4B400] text-[#333] text-[0.72rem] font-black tracking-[0.14em] uppercase px-5 py-[7px] rounded-full mb-6 shadow-[0_4px_20px_rgba(244,180,0,0.45)]">
                  {slide.tag}
                </span>
                <h1 className="font-['Playfair_Display'] text-[clamp(2.4rem,5.5vw,4rem)] font-black text-white leading-[1.08] mb-6 whitespace-pre-line drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                  {slide.title}
                </h1>
                <p className="text-[1.1rem] text-white/85 mb-9 max-w-[520px] leading-[1.72]">{slide.desc}</p>
                <div className="flex gap-4 flex-wrap">
                  <Link to={slide.primary.to}
                    className="inline-flex items-center gap-2.5 px-9 py-4 rounded-[30px] bg-[#6BCB77] text-white font-bold text-[0.95rem] shadow-[0_4px_24px_rgba(107,203,119,0.5)] transition-all duration-300 hover:bg-[#2E7D32] hover:shadow-[0_8px_36px_rgba(46,125,50,0.55)] hover:-translate-y-0.5">
                    {slide.primary.icon && <i className={`fas ${slide.primary.icon} text-sm`}></i>}
                    {slide.primary.label}
                  </Link>
                  <Link to={slide.secondary.to}
                    className="inline-block px-9 py-4 rounded-[30px] border-2 border-white/70 text-white font-bold text-[0.95rem] backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-[#2E7D32] hover:border-white hover:-translate-y-0.5">
                    {slide.secondary.label}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nav arrows */}
      <button ref={prevRef} aria-label="Previous slide"
        className="absolute top-1/2 left-6 -translate-y-1/2 z-10 w-[52px] h-[52px] rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center text-lg cursor-pointer transition-all duration-300 hover:bg-[#6BCB77] hover:border-[#6BCB77] hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <i className="fas fa-chevron-left"></i>
      </button>
      <button ref={nextRef} aria-label="Next slide"
        className="absolute top-1/2 right-6 -translate-y-1/2 z-10 w-[52px] h-[52px] rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center text-lg cursor-pointer transition-all duration-300 hover:bg-[#6BCB77] hover:border-[#6BCB77] hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <i className="fas fa-chevron-right"></i>
      </button>

      <div className="hero-pagination absolute bottom-7 left-0 right-0 flex justify-center gap-2.5 z-10" />

      {/* Wave at the bottom of the hero */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none z-10">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="w-full h-[56px] block" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,28 C360,56 1080,0 1440,28 L1440,56 L0,56 Z" fill="rgba(27,94,32,0.95)" />
        </svg>
      </div>
    </section>
  );
}

/* Announcement bar — after hero slider */
function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#1B5E20] py-4 relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 max-sm:flex-col max-sm:text-center">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#F4B400] flex items-center justify-center shrink-0 glow-pulse">
              <i className="fas fa-satellite-dish text-[#1B5E20] text-[0.8rem]"></i>
            </span>
            <span className="text-white text-[0.9rem]">
              <strong>New:</strong> Secure digital reporting is now live — report anonymously, track your case, and chat with a counselor.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/report"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#2E7D32] font-bold text-[0.82rem] transition-all duration-300 hover:bg-[#F4B400] hover:text-white shadow-sm">
              <i className="fas fa-file-alt text-xs"></i> Report Now
            </Link>
            <Link to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/50 text-white font-medium text-[0.82rem] transition-all duration-300 hover:bg-white/15">
              <i className="fas fa-chart-line text-xs"></i> Track Case
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ target, suffix, label, source }) {
  const [display, ref] = useCounter(target, suffix);
  return (
    <div ref={ref} className="text-white text-center group">
      <span className="font-['Playfair_Display'] text-[3rem] font-black text-[#6BCB77] block leading-none mb-2 group-hover:scale-110 transition-transform duration-300">
        {display}
      </span>
      <span className="text-[0.88rem] opacity-80 tracking-[0.04em] leading-[1.4]">{label}</span>
      <small className="block text-[0.7rem] opacity-50 mt-1.5 tracking-[0.04em]">{source}</small>
    </div>
  );
}

function StatsRibbon() {
  return (
    <section className="bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#1B5E20] py-14 relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-4 gap-10 max-md:grid-cols-2 max-sm:grid-cols-1">
          <StatItem target={840} suffix="M+" label="Women have experienced physical or sexual violence in their lifetime" source="UN Women, November 2025" />
          <StatItem target={1} suffix=" in 3" label="Women globally subjected to intimate partner or sexual violence" source="WHO Global Estimates, 2024" />
          <StatItem target={38} suffix="%" label="Of all murders of women committed by an intimate partner" source="WHO Fact Sheet, 2024" />
          <StatItem target={60} suffix="%" label="Of women killed intentionally in 2024 were murdered by partners or family" source="UN Women, 2024" />
        </div>
      </div>
    </section>
  );
}

function AboutPreview() {
  const visualRef = useFadeIn();
  const contentRef = useFadeIn();
  return (
    <section className="bg-white py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 gap-[80px] items-center max-md:grid-cols-1 max-md:gap-14">
          <div ref={visualRef} className="fade-in-left relative">
            <div className="rounded-[24px] overflow-hidden shadow-[0_8px_48px_rgba(46,125,50,0.18)]">
              <div className="h-[440px] overflow-hidden">
                <img src="/images/image5.jpeg" alt="Vugandakumva community awareness"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={e => { e.target.parentElement.style.background = 'linear-gradient(135deg,#C8FACC,#6BCB77)'; e.target.style.display = 'none'; }} />
              </div>
            </div>
            <div className="absolute bottom-[-20px] right-[-20px] bg-[#F4B400] rounded-[20px] p-6 shadow-[0_12px_36px_rgba(244,180,0,0.4)] text-center">
              <span className="font-['Playfair_Display'] text-[2.2rem] font-black block">2025</span>
              <span className="text-[0.78rem] font-bold uppercase tracking-[0.08em]">Founded</span>
            </div>
          </div>

          <div ref={contentRef} className="fade-in-right">
            <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-bold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-5">Who We Are</span>
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-5">
              A Movement Built on<br/>Courage &amp; Compassion
            </h2>
            <p className="text-[1.05rem] text-gray-500 mb-8 leading-[1.8]">
              Vugandakumva, meaning <strong className="text-[#2E7D32]">"Speak, I Can Hear"</strong> is a grassroots initiative founded by <strong>David Niyomugabo</strong> in 2025, dedicated to fighting gender-based violence through education, advocacy, and community empowerment.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'Community led education programs reaching thousands each year',
                'Safe reporting channels for survivors and witnesses',
                'Partnerships with local authorities and health organizations',
                'Youth engagement and school-based awareness campaigns',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.95rem] text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-[#C8FACC] flex items-center justify-center shrink-0 mt-0.5">
                    <i className="fas fa-check text-[#2E7D32] text-[0.72rem]"></i>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/about"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-[30px] bg-[#6BCB77] text-white font-bold text-[0.95rem] shadow-[0_4px_24px_rgba(107,203,119,0.4)] transition-all duration-300 hover:bg-[#2E7D32] hover:gap-4 hover:-translate-y-0.5">
              Our Full Story <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const awarenessCards = [
  { icon: 'fa-hand-fist', cat: 'Physical', title: 'Physical Violence', text: "Any act of physical force used to cause harm, injury, or suffering — including hitting, kicking, burning, and other bodily harm.", to: '/awareness#physical', gradient: 'from-[#C8FACC] to-[#6BCB77]', catColor: '#1B5E20' },
  { icon: 'fa-comment-slash', cat: 'Emotional', title: 'Psychological Abuse', text: "Controlling behavior, verbal abuse, threats, isolation, and manipulation that damage a person's mental health and self-worth.", to: '/awareness#psychological', gradient: 'from-[#6BCB77] to-[#2E7D32]', catColor: '#fff' },
  { icon: 'fa-coins', cat: 'Economic', title: 'Economic Abuse', text: 'Controlling access to finances, preventing employment, and creating financial dependency as a means of power and control.', to: '/awareness#economic', gradient: 'from-[#2E7D32] to-[#1B5E20]', catColor: '#C8FACC' },
];

function AwarenessPreview() {
  return (
    <section className="bg-[#F8FAF9] py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-bold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-4">What Is GBV?</span>
          <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-4">Understanding Gender-Based Violence</h2>
          <p className="text-[1.05rem] text-gray-500 max-w-[600px] mx-auto">GBV takes many forms. Knowledge is our most powerful tool for prevention and response.</p>
        </div>
        <div className="grid grid-cols-3 gap-7 max-md:grid-cols-2 max-sm:grid-cols-1">
          {awarenessCards.map((card) => (
            <article key={card.title}
              className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.06)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(107,203,119,0.22)] flex flex-col group">
              <div className={`h-[200px] flex items-center justify-center relative bg-gradient-to-br ${card.gradient} overflow-hidden`}>
                <div className="absolute inset-0 pattern-dots opacity-20" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-gradient-to-br from-white/10 to-transparent" />
                <i className={`fas ${card.icon} text-[4.5rem] text-white/80 group-hover:scale-110 transition-transform duration-400 relative z-10`}></i>
                <span className="absolute top-4 left-4 text-[0.68rem] font-black tracking-[0.1em] uppercase px-3 py-1 rounded-full z-10"
                  style={{ background: 'rgba(255,255,255,0.2)', color: card.catColor === '#fff' ? 'white' : card.catColor, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                  {card.cat}
                </span>
              </div>
              <div className="p-7 flex-1 flex flex-col">
                <h3 className="font-['Playfair_Display'] text-[1.25rem] font-bold mb-3">{card.title}</h3>
                <p className="text-[0.9rem] text-gray-500 leading-[1.7] flex-1">{card.text}</p>
                <Link to={card.to} className="inline-flex items-center gap-2 mt-6 text-[#2E7D32] text-[0.88rem] font-bold transition-all duration-300 hover:gap-3.5 hover:text-[#6BCB77]">
                  Learn more <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link to="/awareness"
            className="inline-block px-9 py-4 rounded-[30px] bg-[#6BCB77] text-white font-bold text-[0.95rem] shadow-[0_4px_24px_rgba(107,203,119,0.4)] transition-all duration-300 hover:bg-[#2E7D32] hover:-translate-y-0.5">
            Explore All Forms of GBV
          </Link>
        </div>
      </div>
    </section>
  );
}

function ImpactNumbers() {
  const ref1 = useFadeIn();
  const ref2 = useFadeIn();
  const ref3 = useFadeIn();
  const refs = [ref1, ref2, ref3];
  const items = [
    { num: '8', label: 'Team Members', sub: 'Passionate advocates & educators', icon: 'fa-users', color: '#2E7D32', bg: '#C8FACC' },
    { num: '2025', label: 'Year Founded', sub: 'Breaking the silence since day one', icon: 'fa-calendar-star', color: '#b07d00', bg: '#FFF8E1' },
    { num: '112', label: 'Emergency Line', sub: 'Always available in Rwanda', icon: 'fa-phone-volume', color: '#8e1f1f', bg: '#ffeef0' },
  ];
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
          {items.map((item, i) => (
            <div key={item.label} ref={refs[i]}
              className="fade-in flex items-center gap-6 p-7 rounded-[24px] border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(46,125,50,0.12)] transition-all duration-300 hover:-translate-y-1">
              <div className="w-[64px] h-[64px] rounded-[18px] flex items-center justify-center shrink-0 text-[1.5rem]"
                style={{ background: item.bg, color: item.color }}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <div>
                <span className="font-['Playfair_Display'] text-[2.5rem] font-black block leading-none" style={{ color: item.color }}>{item.num}</span>
                <strong className="text-[0.92rem] text-[#2D2D2D] block mt-1">{item.label}</strong>
                <span className="text-[0.78rem] text-gray-400">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Reporting feature spotlight section */
function ReportingSpotlight() {
  const ref = useFadeIn();
  return (
    <section className="bg-[#F8FAF9] py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div ref={ref} className="fade-in glass rounded-[32px] overflow-hidden shadow-[0_8px_48px_rgba(46,125,50,0.12)] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32]/5 to-[#6BCB77]/10 pointer-events-none" />
          <div className="grid grid-cols-2 gap-0 max-md:grid-cols-1 relative z-10">
            {/* Left: info */}
            <div className="p-12 max-md:p-8">
              <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-bold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-5">
                Secure Reporting System
              </span>
              <h2 className="font-['Playfair_Display'] text-[clamp(1.8rem,3.5vw,2.5rem)] leading-[1.2] mb-5">
                Report Safely.<br/>Stay Anonymous.
              </h2>
              <p className="text-[1rem] text-gray-600 leading-[1.8] mb-8">
                Our digital reporting system lets survivors and witnesses submit reports securely — with or without creating an account. Every case is assigned a unique code so you can track its progress and communicate with our counselors.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: 'fa-user-secret', label: 'Anonymous', desc: 'No account required' },
                  { icon: 'fa-lock', label: 'Encrypted', desc: 'Your data is protected' },
                  { icon: 'fa-headset', label: 'Counselor Chat', desc: 'Confidential support' },
                  { icon: 'fa-route', label: 'Case Tracking', desc: 'Follow your case' },
                ].map(f => (
                  <div key={f.label} className="flex items-start gap-3">
                    <span className="w-9 h-9 rounded-xl bg-[#C8FACC] flex items-center justify-center shrink-0">
                      <i className={`fas ${f.icon} text-[#2E7D32] text-[0.85rem]`}></i>
                    </span>
                    <div>
                      <strong className="text-[0.88rem] text-[#2D2D2D] block">{f.label}</strong>
                      <span className="text-[0.78rem] text-gray-400">{f.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link to="/report"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[30px] bg-[#2E7D32] text-white font-bold text-[0.92rem] shadow-[0_4px_20px_rgba(46,125,50,0.35)] transition-all duration-300 hover:bg-[#1B5E20] hover:-translate-y-0.5">
                  <i className="fas fa-file-alt"></i> Start a Report
                </Link>
                <Link to="/dashboard"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[30px] border-2 border-[#2E7D32] text-[#2E7D32] font-bold text-[0.92rem] transition-all duration-300 hover:bg-[#2E7D32] hover:text-white hover:-translate-y-0.5">
                  <i className="fas fa-search"></i> Track a Case
                </Link>
              </div>
            </div>

            {/* Right: visual */}
            <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] p-12 flex flex-col justify-center relative overflow-hidden max-md:p-8">
              <div className="absolute inset-0 pattern-dots opacity-30" />
              <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-[#6BCB77]/20 orb-float-slow pointer-events-none" />
              <div className="absolute bottom-[-20px] left-[-20px] w-[140px] h-[140px] rounded-full bg-[#4CAF50]/20 orb-float-mid pointer-events-none" />
              <div className="space-y-4 relative z-10">
                {[
                  { step: '01', title: 'Safety Check', desc: 'We ask if you\'re safe right now' },
                  { step: '02', title: 'Submit Report', desc: 'Describe what happened, anonymously' },
                  { step: '03', title: 'Get Case Code', desc: 'Your unique case tracking number' },
                  { step: '04', title: 'Counselor Support', desc: 'Chat confidentially with our team' },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-4 glass-dark rounded-2xl p-4">
                    <span className="font-['Playfair_Display'] text-[#F4B400] text-[1.4rem] font-black shrink-0 leading-none mt-0.5">{s.step}</span>
                    <div>
                      <strong className="text-white text-[0.9rem] block">{s.title}</strong>
                      <span className="text-white/65 text-[0.8rem]">{s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSlider />
      <AnnouncementBar />
      <StatsRibbon />
      <AboutPreview />
      <AwarenessPreview />
      <ReportingSpotlight />
      <ImpactNumbers />
      <CTABanner
        title="If You or Someone You Know Needs Help"
        subtitle="You don't have to face this alone. Report anonymously, track your case, or reach out to our team directly — we are confidential, compassionate, and ready to help."
        primaryLabel="Report Anonymously"
        primaryTo="/report"
        secondaryLabel="WhatsApp Us"
        secondaryHref={WA_URL}
      />
    </>
  );
}
