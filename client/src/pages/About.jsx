import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PageHero from '../components/PageHero';
import CTABanner from '../components/CTABanner';
import { useFadeIn } from '../hooks/useFadeIn';

const teamMembers = [
  { name: 'David Niyomugabo', role: 'Founder — Strategic Lead & Vision Holder', img: '/images/David.jpeg', fallback: 'fa-user-tie', fallbackBg: 'linear-gradient(135deg,#C8FACC,#2E7D32)' },
  { name: 'Sam NTIGURIRWA', role: 'Co-Founder — Programs & Partnership Lead', img: '/images/sam.jpeg', fallback: 'fa-user', fallbackBg: 'linear-gradient(135deg,#FFF8E1,#F4B400)', fallbackColor: '#b07d00' },
  { name: 'Aimé Felix Manzi Ngabonziza', role: 'Software Engineer — Digital Platform & Technology Lead', img: '/images/manzi.jpeg', fallback: 'fa-user', fallbackBg: 'linear-gradient(135deg,#E8F5E9,#6BCB77)', fallbackColor: '#1B5E20' },
  { name: 'RWAMASIRABO Ghislain', role: 'Software Engineer — Digital Platform & Technology Lead', img: '/images/salomon.jpeg', fallback: 'fa-user-doctor', fallbackBg: 'linear-gradient(135deg,#C8FACC,#2E7D32)' },
  { name: 'Rita XAVIERE IKUZO', role: 'Advocacy & Awareness Lead', img: '/images/ikuzo.jpeg', fallback: 'fa-user-graduate', fallbackBg: 'linear-gradient(135deg,#FFF8E1,#F4B400)', fallbackColor: '#b07d00' },
  { name: 'Aristide NIYIDUHA', role: 'Information, Research, Content & Knowledge Lead', img: '/images/aristide.jpeg', fallback: 'fa-user', fallbackBg: 'linear-gradient(135deg,#E8F5E9,#6BCB77)', fallbackColor: '#1B5E20' },
  { name: 'Eunice Flavia INEZA', role: 'Organizing Events — Community Outreach & Logistics Lead', img: '/images/Eunice.jpeg', fallback: 'fa-user', fallbackBg: 'linear-gradient(135deg,#C8FACC,#2E7D32)' },
  { name: 'Gloria Hycentha UWIMANA', role: 'Coordinator — Operations & Team Coordination Lead', img: '/images/uwimana.jpeg', fallback: 'fa-user', fallbackBg: 'linear-gradient(135deg,#FFF8E1,#F4B400)', fallbackColor: '#b07d00' },
];

function TeamCard({ member }) {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(46,125,50,0.15)] text-center group mx-2">
      <div className="h-[240px] overflow-hidden relative">
        <img src={member.img} alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={e => {
            e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;background:${member.fallbackBg};display:flex;align-items:center;justify-content:center;font-size:4rem;color:${member.fallbackColor || 'white'}"><i class="fas ${member.fallback}"></i></div>`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      </div>
      <div className="p-6">
        <h4 className="font-['Playfair_Display'] text-[1.05rem] font-bold mb-1.5">{member.name}</h4>
        <span className="text-[0.78rem] text-[#2E7D32] font-semibold block mb-4 leading-[1.4]">{member.role}</span>
        <div className="flex gap-2 justify-center">
          {[
            { href: 'https://www.linkedin.com/company/vugandakumvainitiative', icon: 'fa-linkedin-in', label: 'LinkedIn' },
            { href: 'https://www.twitter.com/vugandakumvainitiative', icon: 'fa-x-twitter', label: 'Twitter' },
            { href: 'mailto:vugandakumvainitiative@gmail.com', icon: 'fa-envelope', label: 'Email' },
          ].map(({ href, icon, label }) => (
            <a key={icon} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener" aria-label={label}
              className="w-[32px] h-[32px] rounded-full bg-[#C8FACC] flex items-center justify-center text-[0.75rem] text-[#2E7D32] transition-all duration-300 hover:bg-[#6BCB77] hover:text-white hover:-translate-y-0.5">
              <i className={`fab ${icon}`}></i>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const visualRef = useFadeIn();
  const contentRef = useFadeIn();

  return (
    <>
      <PageHero title="About Vugandakumva" subtitle="Our story, our mission, and the people driving change" breadcrumb="About" />

      {/* Mission / Vision / Values */}
      <section className="py-[100px] bg-[#F8FAF9]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center">
            <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-bold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-4">Our Purpose</span>
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-4">Mission, Vision &amp; Values</h2>
            <p className="text-[1.05rem] text-gray-500 max-w-[600px] mx-auto">Everything we do is guided by a commitment to dignity, safety, and justice for every person.</p>
          </div>
          <div className="grid grid-cols-3 gap-7 mt-14 max-md:grid-cols-1">
            {[
              { icon: 'fa-bullseye', title: 'Our Mission', text: 'To raise awareness, educate communities, and provide accessible support pathways that reduce gender-based violence and empower survivors to reclaim their lives.', borderColor: '#6BCB77', iconBg: '#C8FACC', iconColor: '#2E7D32' },
              { icon: 'fa-eye', title: 'Our Vision', text: 'A society where every individual lives free from gender-based violence — where communities actively protect the vulnerable and perpetrators are held accountable.', borderColor: '#F4B400', iconBg: '#FFF8E1', iconColor: '#e0920d' },
              { icon: 'fa-star', title: 'Our Values', text: 'Dignity, compassion, courage, inclusivity, and transparency guide every program, partnership, and conversation we engage in — no matter the context.', borderColor: '#2E7D32', iconBg: '#E8F5E9', iconColor: '#1B5E20' },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-[24px] p-9 text-center shadow-[0_2px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(46,125,50,0.12)]"
                style={{ borderTop: `4px solid ${card.borderColor}` }}>
                <div className="w-[76px] h-[76px] rounded-full flex items-center justify-center text-[1.9rem] mx-auto mb-6"
                  style={{ background: card.iconBg, color: card.iconColor }}>
                  <i className={`fas ${card.icon}`}></i>
                </div>
                <h3 className="font-['Playfair_Display'] text-[1.35rem] mb-3">{card.title}</h3>
                <p className="text-[0.92rem] text-gray-500 leading-[1.7]">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-[100px] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 gap-[80px] items-center max-md:grid-cols-1 max-md:gap-14">
            <div ref={visualRef} className="fade-in">
              <div className="rounded-[24px] overflow-hidden shadow-[0_8px_48px_rgba(46,125,50,0.15)] h-[500px]">
                <img src="/images/image6.jpeg" alt="Our Story – Vugandakumva"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={e => { e.target.parentElement.style.background = 'linear-gradient(135deg,#2E7D32,#6BCB77)'; e.target.style.display = 'none'; }} />
              </div>
            </div>
            <div ref={contentRef} className="fade-in">
              <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-bold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-5">Our Story</span>
              <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-6">Born from Silence.<br/>Built for Change.</h2>
              <p className="text-gray-500 mb-5 text-[0.97rem] leading-[1.8]">
                Vugandakumva — a Kinyarwanda phrase meaning <strong className="text-[#2E7D32]">"Speak, I Can Hear"</strong> — was born from a simple, urgent truth: most victims of gender-based violence suffer in silence, not because they don't want help, but because no one is listening.
              </p>
              <p className="text-gray-500 mb-5 text-[0.97rem] leading-[1.8]">
                Founded in <strong>2025</strong> by <strong>David Niyomugabo</strong>, Vugandakumva set out to change that reality. What started as small community conversations has grown into a meaningful awareness initiative reaching communities across Rwanda.
              </p>
              <p className="text-gray-500 mb-9 text-[0.97rem] leading-[1.8]">
                Today, we run education programs in schools, collaborate with local authorities, train community health workers, and maintain digital resources for survivors and allies everywhere.
              </p>
              <div className="grid grid-cols-2 gap-5 mb-9">
                <div className="bg-[#C8FACC] rounded-[20px] p-6 text-center">
                  <span className="font-['Playfair_Display'] text-[2.5rem] font-black text-[#2E7D32] block">8</span>
                  <span className="text-[0.82rem] text-[#2E7D32] font-bold">Team Members</span>
                </div>
                <div className="bg-[#FFF8E1] rounded-[20px] p-6 text-center">
                  <span className="font-['Playfair_Display'] text-[2.5rem] font-black text-[#b07d00] block">10</span>
                  <span className="text-[0.82rem] text-[#b07d00] font-bold">People Reached So Far</span>
                </div>
              </div>
              <Link to="/contact"
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-[30px] bg-[#6BCB77] text-white font-bold text-[0.95rem] shadow-[0_4px_24px_rgba(107,203,119,0.4)] transition-all duration-300 hover:bg-[#2E7D32] hover:-translate-y-0.5">
                Partner With Us <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team Carousel */}
      <section className="py-[100px] bg-[#F8FAF9] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-bold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-4">The People</span>
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-4">Meet Our Dedicated Team</h2>
            <p className="text-[1.05rem] text-gray-500 max-w-[600px] mx-auto">Eight passionate advocates, educators, and community leaders committed to ending GBV, one conversation at a time.</p>
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1.2}
            centeredSlides={true}
            spaceBetween={24}
            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop
            navigation={{ nextEl: '.team-next', prevEl: '.team-prev' }}
            pagination={{ clickable: true, el: '.team-pagination' }}
            breakpoints={{
              640: { slidesPerView: 2.2, spaceBetween: 24 },
              900: { slidesPerView: 3.1, spaceBetween: 28 },
              1200: { slidesPerView: 4, spaceBetween: 28, centeredSlides: false },
            }}
            className="pb-14 px-4"
          >
            {teamMembers.map((member) => (
              <SwiperSlide key={member.name}>
                <TeamCard member={member} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="team-prev absolute top-1/2 left-4 -translate-y-[calc(50%+28px)] z-10 w-[48px] h-[48px] rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center text-[#2E7D32] transition-all duration-300 hover:bg-[#6BCB77] hover:text-white hover:border-[#6BCB77]">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="team-next absolute top-1/2 right-4 -translate-y-[calc(50%+28px)] z-10 w-[48px] h-[48px] rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center text-[#2E7D32] transition-all duration-300 hover:bg-[#6BCB77] hover:text-white hover:border-[#6BCB77]">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="team-pagination mt-2 flex justify-center gap-2" />
      </section>

      <CTABanner
        title="Ready to Support Our Mission?"
        subtitle="Whether you want to volunteer, partner, or simply raise awareness — there is a place for you in this movement."
        primaryLabel="Get Involved"
        primaryTo="/contact"
        secondaryLabel="Explore Awareness"
        secondaryTo="/awareness"
      />
    </>
  );
}
