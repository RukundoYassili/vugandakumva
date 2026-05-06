import { Link } from 'react-router-dom';

export default function PageHero({ title, subtitle, breadcrumb }) {
  return (
    <section className="mt-[72px] bg-gradient-to-br from-[#2E7D32] via-[#388E3C] to-[#1B5E20] py-24 text-center relative overflow-hidden">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 pattern-dots opacity-40 pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-[-40px] right-[-60px] w-[300px] h-[300px] rounded-full bg-[#6BCB77]/20 orb-float-slow pointer-events-none" />
      <div className="absolute bottom-[30px] left-[-80px] w-[260px] h-[260px] rounded-full bg-[#4CAF50]/15 orb-float-mid pointer-events-none" />
      <div className="absolute top-[25%] right-[18%] w-[130px] h-[130px] rounded-full bg-[#F4B400]/10 orb-float-fast pointer-events-none" />

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="inline-flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-[#F4B400]" />
          <span className="text-[#F4B400] text-[0.72rem] font-bold tracking-[0.2em] uppercase">{breadcrumb}</span>
          <div className="w-8 h-px bg-[#F4B400]" />
        </div>

        <h1 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
          {title}
        </h1>

        {subtitle && (
          <p className="text-white/80 text-[1.05rem] mt-4 max-w-[560px] mx-auto leading-[1.75]">{subtitle}</p>
        )}

        <div className="flex items-center gap-2 justify-center mt-7">
          <Link to="/" className="text-[#6BCB77] text-[0.85rem] hover:text-white transition-colors duration-200">
            Home
          </Link>
          <i className="fas fa-angle-right text-white/40 text-[0.75rem]"></i>
          <span className="text-white/90 text-[0.85rem]">{breadcrumb}</span>
        </div>
      </div>

      {/* Wave bottom — transitions into white page content */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full h-[72px] block" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,36 C200,72 440,4 720,36 C1000,68 1240,12 1440,36 L1440,72 L0,72 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
