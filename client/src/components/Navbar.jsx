import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const WA_URL = 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      const session = localStorage.getItem('vugandakumva_session');
      const userData = localStorage.getItem('vugandakumva_user');
      if (session && userData) {
        const user = JSON.parse(userData);
        const name = user.user_metadata?.full_name || 'My Account';
        setAuthUser(name.split(' ')[0]);
      }
    } catch {}
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    `text-[0.92rem] font-medium relative pb-1 transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#6BCB77] after:transition-all after:duration-300 ${
      isActive ? 'text-[#2E7D32] after:w-full' : 'text-[#2D2D2D] hover:text-[#2E7D32] after:w-0 hover:after:w-full'
    }`;

  return (
    <header
      id="header"
      className="fixed top-0 left-0 right-0 z-[1000] bg-white/97 backdrop-blur-[10px]"
      style={{ boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.12)' : '0 2px 20px rgba(0,0,0,0.08)', transition: 'box-shadow 0.3s ease' }}
    >
      <nav className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[72px]">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Vugandakumva Logo" className="w-12 h-12 rounded-full object-cover border-2 border-[#6BCB77] shadow-[0_0_0_3px_rgba(107,203,119,0.2)]" />
          <div className="font-['Playfair_Display'] text-[1.25rem] font-bold text-[#2E7D32] leading-tight">
            Vugandakumva
            <span className="block text-[0.7rem] font-normal text-gray-400 tracking-[0.08em] uppercase font-['DM_Sans']">Speak, I Can Hear</span>
          </div>
        </Link>

        <ul className={`flex items-center gap-8 ${menuOpen ? 'active' : ''} max-md:fixed max-md:top-[72px] max-md:left-0 max-md:right-0 max-md:bg-white max-md:flex-col max-md:items-start max-md:gap-0 max-md:shadow-lg ${menuOpen ? 'max-md:max-h-[500px]' : 'max-md:max-h-0 max-md:overflow-hidden'} max-md:transition-all max-md:duration-400`}>
          {[{ to: '/', label: 'Home' }, { to: '/about', label: 'About' }, { to: '/awareness', label: 'Awareness' }, { to: '/resources', label: 'Resources' }, { to: '/contact', label: 'Contact' }].map(({ to, label }) => (
            <li key={to} className="max-md:w-full max-md:border-b max-md:border-gray-100">
              <NavLink to={to} className={({ isActive }) => `${navLinkClass({ isActive })} max-md:block max-md:px-6 max-md:py-4`} onClick={closeMenu} end={to === '/'}>
                {label}
              </NavLink>
            </li>
          ))}
          <li className="max-md:w-full max-md:border-b max-md:border-gray-100">
            <NavLink to="/auth" className={({ isActive }) => `${navLinkClass({ isActive })} max-md:block max-md:px-6 max-md:py-4`} onClick={closeMenu}>
              <i className="fas fa-user-circle mr-1"></i>
              {authUser ? authUser : 'Login'}
            </NavLink>
          </li>
          <div className="flex items-center gap-3 max-md:px-6 max-md:py-4">
            {[
              { href: 'https://www.facebook.com/vugandakumvainitiative', icon: 'fa-facebook-f', label: 'Facebook' },
              { href: 'https://www.instagram.com/vugandakumvainitiative', icon: 'fa-instagram', label: 'Instagram' },
              { href: 'https://www.twitter.com/vugandakumvainitiative', icon: 'fa-x-twitter', label: 'Twitter/X' },
              { href: 'https://www.youtube.com/@vugandakumvainitiative', icon: 'fa-youtube', label: 'YouTube' },
            ].map(({ href, icon, label }) => (
              <a key={href} href={href} target="_blank" rel="noopener" aria-label={label}
                className="w-[34px] h-[34px] rounded-full bg-[#C8FACC] flex items-center justify-center text-[0.8rem] text-[#2E7D32] transition-all duration-300 hover:bg-[#6BCB77] hover:text-white hover:-translate-y-0.5">
                <i className={`fab ${icon}`}></i>
              </a>
            ))}
          </div>
        </ul>

        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle Menu"
          className="hidden max-md:flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-1"
        >
          <span className={`w-6 h-0.5 bg-[#2D2D2D] rounded transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-[#2D2D2D] rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-[#2D2D2D] rounded transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}></span>
        </button>
      </nav>
    </header>
  );
}
