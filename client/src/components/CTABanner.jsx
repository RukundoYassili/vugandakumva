import { Link } from 'react-router-dom';

const WA_URL = 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.';

export default function CTABanner({ title, subtitle, primaryLabel, primaryTo, secondaryLabel, secondaryTo, secondaryHref }) {
  return (
    <section className="relative overflow-hidden py-[100px]">
      {/* Wave top — cuts into the section above */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full h-[72px] block" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,36 C200,0 440,68 720,36 C1000,4 1240,60 1440,36 L1440,0 L0,0 Z" fill="white" />
        </svg>
      </div>

      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 gradient-animated"
        style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32, #388E3C, #1B5E20)' }} />
      <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-[-60px] right-[-60px] w-[340px] h-[340px] rounded-full bg-[#6BCB77]/20 orb-float-slow pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-60px] w-[300px] h-[300px] rounded-full bg-[#81C784]/15 orb-float-mid pointer-events-none" />
      <div className="absolute top-[35%] left-[45%] w-[110px] h-[110px] rounded-full bg-[#F4B400]/10 orb-float-fast pointer-events-none" />

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-[#F4B400]" />
          <span className="text-[#F4B400] text-[0.72rem] font-bold tracking-[0.2em] uppercase">Take Action</span>
          <div className="w-8 h-px bg-[#F4B400]" />
        </div>

        <h2 className="font-['Playfair_Display'] text-[clamp(1.8rem,3.5vw,2.9rem)] font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          {title}
        </h2>
        <p className="text-white/80 text-[1.05rem] mb-10 max-w-[620px] mx-auto leading-[1.75]">
          {subtitle}
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link to={primaryTo}
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-[30px] bg-white text-[#2E7D32] font-bold text-[0.95rem] shadow-[0_4px_28px_rgba(0,0,0,0.22)] transition-all duration-300 hover:bg-[#F4B400] hover:text-white hover:shadow-[0_8px_36px_rgba(244,180,0,0.45)] hover:-translate-y-1">
            {primaryLabel}
          </Link>

          {secondaryTo ? (
            <Link to={secondaryTo}
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-[30px] border-2 border-white/60 text-white font-bold text-[0.95rem] backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-[#2E7D32] hover:border-transparent hover:-translate-y-1">
              {secondaryLabel}
            </Link>
          ) : (
            <a href={secondaryHref || WA_URL} target="_blank" rel="noopener"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-[30px] border-2 border-white/60 text-white font-bold text-[0.95rem] backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-[#2E7D32] hover:border-transparent hover:-translate-y-1">
              <i className="fab fa-whatsapp text-[1.1em]"></i>{secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
