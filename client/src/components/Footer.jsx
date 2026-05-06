import { Link } from 'react-router-dom';

const WA_URL = 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.';

const socialLinks = [
  { href: 'https://www.facebook.com/vugandakumvainitiative', icon: 'fa-facebook-f', label: 'Facebook' },
  { href: 'https://www.instagram.com/vugandakumvainitiative', icon: 'fa-instagram', label: 'Instagram' },
  { href: 'https://www.twitter.com/vugandakumvainitiative', icon: 'fa-x-twitter', label: 'Twitter/X' },
  { href: 'https://www.linkedin.com/company/vugandakumvainitiative', icon: 'fa-linkedin-in', label: 'LinkedIn' },
  { href: 'https://www.youtube.com/@vugandakumvainitiative', icon: 'fa-youtube', label: 'YouTube' },
  { href: 'https://www.tiktok.com/@vugandakumvainitiative', icon: 'fa-tiktok', label: 'TikTok' },
];

const SocialIcon = ({ href, icon, label }) => (
  <a href={href} target="_blank" rel="noopener" aria-label={label}
    className="w-[38px] h-[38px] rounded-full bg-white/10 flex items-center justify-center text-white text-[0.85rem] transition-all duration-300 hover:bg-[#6BCB77] hover:scale-110 hover:-translate-y-0.5">
    <i className={`fab ${icon}`}></i>
  </a>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-[0.88rem] opacity-70 transition-all duration-300 hover:opacity-100 hover:text-[#6BCB77] hover:pl-1.5 inline-flex items-center gap-2">
      <i className="fas fa-angle-right text-[#6BCB77] text-[0.75em]"></i> {children}
    </Link>
  </li>
);

export default function Footer() {
  return (
    <footer className="bg-[#1B5E20] text-white/85 relative overflow-hidden">
      {/* Subtle dot pattern for depth */}
      <div className="absolute inset-0 pattern-dots-dark opacity-60 pointer-events-none" />

      {/* Subtle orb accents */}
      <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-[#2E7D32]/40 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[240px] h-[240px] rounded-full bg-[#388E3C]/30 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 pt-[72px] pb-12 border-b border-white/10 max-md:grid-cols-2 max-sm:grid-cols-1">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="Vugandakumva Logo" className="h-11 rounded-full border-2 border-[#6BCB77]/50 shadow-[0_0_0_3px_rgba(107,203,119,0.15)]" />
              <div>
                <span className="font-['Playfair_Display'] text-[1.2rem] font-bold text-white block">Vugandakumva</span>
                <span className="text-[0.65rem] text-[#6BCB77] tracking-[0.12em] uppercase font-['DM_Sans']">Speak, I Can Hear</span>
              </div>
            </div>
            <p className="text-[0.88rem] leading-[1.75] opacity-70 mb-6">
              Breaking the silence on gender-based violence through education, advocacy, and community support. Founded by <strong className="text-white/90">David Niyomugabo</strong>, 2025. Every voice matters.
            </p>
            <div className="flex gap-2.5 flex-wrap">
              {socialLinks.map(s => <SocialIcon key={s.href} {...s} />)}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Playfair_Display'] text-[1rem] font-bold text-white mb-5 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#6BCB77]">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/awareness">Awareness</FooterLink>
              <FooterLink to="/resources">Resources</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/report">Report a Case</FooterLink>
              <FooterLink to="/dashboard">Track My Case</FooterLink>
            </ul>
          </div>

          {/* Awareness Resources */}
          <div>
            <h4 className="font-['Playfair_Display'] text-[1rem] font-bold text-white mb-5 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#6BCB77]">
              Awareness
            </h4>
            <ul className="space-y-2.5">
              <FooterLink to="/awareness">What is GBV?</FooterLink>
              <FooterLink to="/awareness#signs">Warning Signs</FooterLink>
              <FooterLink to="/resources">Hotlines &amp; Help</FooterLink>
              <FooterLink to="/resources">Legal Rights</FooterLink>
              <FooterLink to="/resources">Support Groups</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-['Playfair_Display'] text-[1rem] font-bold text-white mb-5 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#6BCB77]">
              Get In Touch
            </h4>
            {[
              { icon: 'fa-map-marker-alt', content: 'Kigali, Rwanda' },
              { icon: 'fa-phone', href: 'tel:+250781640246', content: '+250 781 640 246' },
              { icon: 'fa-phone', href: 'tel:+250791274264', content: '+250 791 274 264' },
              { icon: 'fa-envelope', href: 'mailto:vugandakumvainitiative@gmail.com', content: 'vugandakumvainitiative@gmail.com' },
            ].map((item, i) => (
              <p key={i} className="text-[0.88rem] opacity-70 mb-3 flex items-start gap-2.5">
                <i className={`fas ${item.icon} text-[#6BCB77] mt-0.5 shrink-0`}></i>
                {item.href
                  ? <a href={item.href} className="hover:text-[#6BCB77] transition-colors duration-200">{item.content}</a>
                  : item.content}
              </p>
            ))}
            <p className="text-[0.88rem] opacity-70 mb-3 flex items-start gap-2.5">
              <i className="fab fa-whatsapp text-[#6BCB77] mt-0.5 shrink-0"></i>
              <a href={WA_URL} target="_blank" rel="noopener" className="hover:text-[#6BCB77] transition-colors duration-200">Chat on WhatsApp</a>
            </p>

            {/* Emergency */}
            <div className="mt-5 p-3.5 rounded-xl bg-[rgba(244,180,0,0.12)] border border-[#F4B400]/30 flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#F4B400]/20 flex items-center justify-center shrink-0">
                <i className="fas fa-phone-volume text-[#F4B400] text-[0.9rem]"></i>
              </span>
              <div>
                <span className="text-[#F4B400] text-[0.72rem] font-bold uppercase tracking-[0.1em] block">Emergency</span>
                <a href="tel:112" className="text-white font-bold text-[1.1rem] font-['Playfair_Display'] hover:text-[#F4B400] transition-colors">112</a>
                <span className="text-white/60 text-[0.72rem] block">24/7 Rwanda Emergency Line</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 flex items-center justify-between flex-wrap gap-3 max-sm:flex-col max-sm:text-center">
          <p className="text-[0.82rem] opacity-50">© 2025 Vugandakumva Initiative · Founded by David Niyomugabo. All rights reserved.</p>
          <p className="text-[0.82rem] opacity-50">
            Designed with <i className="fas fa-heart text-[#6BCB77]"></i> for survivors everywhere &nbsp;·&nbsp;{' '}
            <a href="#" className="text-[#6BCB77] opacity-100 hover:opacity-80 transition-opacity">Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
