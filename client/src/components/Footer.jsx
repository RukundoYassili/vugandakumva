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
    className="w-[38px] h-[38px] rounded-full bg-white/10 flex items-center justify-center text-white text-[0.9rem] transition-all duration-300 hover:bg-[#6BCB77] hover:-translate-y-0.5">
    <i className={`fab ${icon}`}></i>
  </a>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-[0.88rem] opacity-75 transition-all duration-300 hover:opacity-100 hover:text-[#6BCB77] hover:pl-1 inline-flex items-center gap-2">
      <i className="fas fa-angle-right"></i> {children}
    </Link>
  </li>
);

export default function Footer() {
  return (
    <footer className="bg-[#1B5E20] text-white/85 pt-[72px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 pb-12 border-b border-white/10 max-md:grid-cols-2 max-sm:grid-cols-1">

          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="Vugandakumva Logo" className="h-11 rounded-full" />
              <span className="font-['Playfair_Display'] text-[1.2rem] font-bold text-white">Vugandakumva</span>
            </div>
            <p className="text-[0.9rem] leading-[1.7] opacity-75 mb-6">
              <em>"Speak, I Can Hear"</em> Breaking the silence on gender-based violence through education, advocacy, and community support. Founded by David Niyomugabo, 2025. Every voice matters.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map(s => <SocialIcon key={s.href} {...s} />)}
            </div>
          </div>

          <div>
            <h4 className="font-['Playfair_Display'] text-[1rem] font-bold text-white mb-5 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#6BCB77]">Quick Links</h4>
            <ul className="space-y-2.5">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/awareness">Awareness</FooterLink>
              <FooterLink to="/resources">Resources</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-['Playfair_Display'] text-[1rem] font-bold text-white mb-5 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#6BCB77]">Awareness Resources</h4>
            <ul className="space-y-2.5">
              <FooterLink to="/awareness">What is GBV?</FooterLink>
              <FooterLink to="/awareness#signs">Warning Signs</FooterLink>
              <FooterLink to="/resources">Hotlines &amp; Help</FooterLink>
              <FooterLink to="/resources">Legal Rights</FooterLink>
              <FooterLink to="/resources">Support Groups</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-['Playfair_Display'] text-[1rem] font-bold text-white mb-5 pb-3 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-[#6BCB77]">Get In Touch</h4>
            {[
              { icon: 'fa-map-marker-alt', content: 'Kigali, Rwanda' },
              { icon: 'fa-phone', href: 'tel:+250781640246', content: '+250 781 640 246' },
              { icon: 'fa-phone', href: 'tel:+250791274264', content: '+250 791 274 264' },
              { icon: 'fa-envelope', href: 'mailto:vugandakumvainitiative@gmail.com', content: 'vugandakumvainitiative@gmail.com' },
            ].map((item, i) => (
              <p key={i} className="text-[0.88rem] opacity-75 mb-3 flex items-start gap-2.5">
                <i className={`fas ${item.icon} text-[#6BCB77] mt-1 shrink-0`}></i>
                {item.href ? <a href={item.href} className="hover:text-[#6BCB77] transition-colors">{item.content}</a> : item.content}
              </p>
            ))}
            <p className="text-[0.88rem] opacity-75 mb-3 flex items-start gap-2.5">
              <i className="fab fa-whatsapp text-[#6BCB77] mt-1 shrink-0"></i>
              <a href={WA_URL} target="_blank" rel="noopener" className="hover:text-[#6BCB77] transition-colors">Chat on WhatsApp</a>
            </p>
          </div>
        </div>

        <div className="py-5 flex items-center justify-between flex-wrap gap-3 max-sm:flex-col max-sm:text-center">
          <p className="text-[0.82rem] opacity-60">© 2025 Vugandakumva Initiative · Founded by David Niyomugabo. All rights reserved.</p>
          <p className="text-[0.82rem] opacity-60">
            Designed with <i className="fas fa-heart text-[#6BCB77]"></i> for survivors everywhere |{' '}
            <a href="#" className="text-[#6BCB77] opacity-100">Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
