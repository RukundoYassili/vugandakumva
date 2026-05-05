import { Link } from 'react-router-dom';

const WA_URL = 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.';

export default function CTABanner({ title, subtitle, primaryLabel, primaryTo, secondaryLabel, secondaryTo, secondaryHref }) {
  return (
    <section className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] py-[80px] relative overflow-hidden">
      <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-[rgba(107,203,119,0.15)]"></div>
      <div className="absolute bottom-[-80px] left-[-80px] w-[250px] h-[250px] rounded-full bg-[rgba(107,203,119,0.1)]"></div>
      <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
        <h2 className="font-['Playfair_Display'] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white mb-4">{title}</h2>
        <p className="text-white/80 text-[1.05rem] mb-9 max-w-[600px] mx-auto">{subtitle}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to={primaryTo}
            className="inline-block px-8 py-3.5 rounded-[30px] bg-[#6BCB77] text-white font-semibold text-[0.95rem] shadow-[0_4px_20px_rgba(107,203,119,0.4)] transition-all duration-300 hover:bg-[#2E7D32] hover:shadow-[0_6px_28px_rgba(46,125,50,0.45)] hover:-translate-y-0.5">
            {primaryLabel}
          </Link>
          {secondaryTo ? (
            <Link to={secondaryTo}
              className="inline-block px-8 py-3.5 rounded-[30px] border-2 border-white text-white font-semibold text-[0.95rem] transition-all duration-300 hover:bg-white hover:text-[#2E7D32] hover:-translate-y-0.5">
              {secondaryLabel}
            </Link>
          ) : (
            <a href={secondaryHref || WA_URL} target="_blank" rel="noopener"
              className="inline-block px-8 py-3.5 rounded-[30px] border-2 border-white text-white font-semibold text-[0.95rem] transition-all duration-300 hover:bg-white hover:text-[#2E7D32] hover:-translate-y-0.5">
              <i className="fab fa-whatsapp mr-2 text-[1.1em]"></i>{secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
