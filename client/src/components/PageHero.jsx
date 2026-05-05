import { Link } from 'react-router-dom';

export default function PageHero({ title, subtitle, breadcrumb }) {
  return (
    <section className="mt-[72px] bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] py-20 text-center relative overflow-hidden">
      <div className="absolute top-[-60px] right-[-60px] w-[240px] h-[240px] rounded-full bg-[rgba(107,203,119,0.15)]"></div>
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <h1 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.2rem)] font-black text-white">{title}</h1>
        {subtitle && <p className="text-white/80 text-[1.05rem] mt-3">{subtitle}</p>}
        <div className="flex items-center gap-2 justify-center mt-5">
          <Link to="/" className="text-[#6BCB77] text-[0.88rem]">Home</Link>
          <span className="text-white/50 text-[0.88rem]"><i className="fas fa-angle-right"></i></span>
          <span className="text-white text-[0.88rem]">{breadcrumb}</span>
        </div>
      </div>
    </section>
  );
}
