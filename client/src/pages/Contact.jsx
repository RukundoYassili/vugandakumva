import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

const WA_URL = 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.';

const socialLinks = [
  { href: 'https://www.facebook.com/vugandakumvainitiative', icon: 'fa-facebook-f', label: 'Facebook' },
  { href: 'https://www.instagram.com/vugandakumvainitiative', icon: 'fa-instagram', label: 'Instagram' },
  { href: 'https://www.twitter.com/vugandakumvainitiative', icon: 'fa-x-twitter', label: 'Twitter/X' },
  { href: 'https://www.linkedin.com/company/vugandakumvainitiative', icon: 'fa-linkedin-in', label: 'LinkedIn' },
  { href: 'https://www.youtube.com/@vugandakumvainitiative', icon: 'fa-youtube', label: 'YouTube' },
  { href: 'https://www.tiktok.com/@vugandakumvainitiative', icon: 'fa-tiktok', label: 'TikTok' },
];

const involveCards = [
  { icon: 'fa-hands-helping', cat: 'Volunteer', title: 'Volunteer With Us', text: "Join our network of community educators, event coordinators, and support volunteers. Your time makes a direct difference in survivors' lives.", link: { href: 'mailto:vugandakumvainitiative@gmail.com?subject=Volunteer%20Application', label: 'Apply to Volunteer' }, bg: 'linear-gradient(135deg, #C8FACC, #6BCB77)' },
  { icon: 'fa-handshake', cat: 'Partner', title: 'Organizational Partnership', text: 'We collaborate with NGOs, government bodies, healthcare providers, and educational institutions to expand our reach and impact.', link: { href: 'mailto:vugandakumvainitiative@gmail.com?subject=Partnership%20Inquiry', label: 'Explore Partnership' }, bg: 'linear-gradient(135deg, #FFF8E1, #F4B400)', iconColor: '#555' },
  { icon: 'fa-share-nodes', cat: 'Share', title: 'Spread Awareness', text: 'Follow us on social media, share our content, and help us reach more communities. Awareness is one of the most powerful tools we have.', link: { href: 'https://www.facebook.com/vugandakumvainitiative', label: 'Follow Our Pages', external: true }, bg: 'linear-gradient(135deg, #2E7D32, #1B5E20)' },
];

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSent(true);
      setSending(false);
      setTimeout(() => { setSent(false); e.target.reset(); }, 3000);
    }, 800);
  };

  const inputClass = "w-full px-[18px] py-3 border-2 border-gray-200 rounded-[12px] font-['DM_Sans'] text-[0.92rem] text-[#2D2D2D] bg-[#F8FAF9] outline-none transition-all duration-300 focus:border-[#6BCB77] focus:bg-white focus:shadow-[0_0_0_4px_rgba(107,203,119,0.12)]";
  const labelClass = "block text-[0.85rem] font-semibold mb-2 text-[#2D2D2D]";

  return (
    <div className="bg-white rounded-[20px] p-12 shadow-[0_4px_24px_rgba(0,0,0,0.07)] fade-in max-sm:p-7">
      <h3 className="font-['Playfair_Display'] text-[1.8rem] mb-2">Send Us a Message</h3>
      <p className="text-[0.9rem] text-gray-500 mb-8">All messages are handled with strict confidentiality. We typically respond within 24 hours.</p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-2 gap-5 mb-5 max-sm:grid-cols-1">
          <div>
            <label htmlFor="fname" className={labelClass}>First Name *</label>
            <input type="text" id="fname" name="fname" placeholder="Your first name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="lname" className={labelClass}>Last Name</label>
            <input type="text" id="lname" name="lname" placeholder="Your last name" className={inputClass} />
          </div>
        </div>
        <div className="mb-5">
          <label htmlFor="email" className={labelClass}>Email Address *</label>
          <input type="email" id="email" name="email" placeholder="your@email.com" required className={inputClass} />
        </div>
        <div className="mb-5">
          <label htmlFor="phone" className={labelClass}>Phone / WhatsApp Number</label>
          <input type="tel" id="phone" name="phone" placeholder="+250 781 640 246" className={inputClass} />
        </div>
        <div className="mb-5">
          <label htmlFor="subject" className={labelClass}>Subject / Reason for Contact *</label>
          <select id="subject" name="subject" required className={inputClass}>
            <option value="" disabled defaultValue>Select a reason...</option>
            <option value="support">I need support / help</option>
            <option value="report">I want to report GBV</option>
            <option value="volunteer">I want to volunteer</option>
            <option value="partner">Partnership / Collaboration</option>
            <option value="media">Media / Press Inquiry</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-5">
          <label htmlFor="message" className={labelClass}>Your Message *</label>
          <textarea id="message" name="message" placeholder="Write your message here. All information is kept confidential..." required className={`${inputClass} resize-y min-h-[130px]`}></textarea>
        </div>
        <div className="flex items-start gap-2.5 mb-5">
          <input type="checkbox" id="consent" name="consent" required className="mt-1 w-auto" />
          <label htmlFor="consent" className="text-[0.82rem] text-gray-500 font-normal">I understand that my information will be kept confidential and used only to respond to my message.</label>
        </div>
        <button type="submit" disabled={sending || sent}
          className={`w-full flex justify-center items-center gap-2 px-8 py-4 rounded-[30px] text-white font-semibold text-[0.95rem] transition-all duration-300 ${sent ? 'bg-[#2E7D32]' : 'bg-[#6BCB77] hover:bg-[#2E7D32] hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(107,203,119,0.4)]'}`}>
          {sent ? <><i className="fas fa-check"></i> Message Sent!</> : <><i className="fas fa-paper-plane"></i> Send Message</>}
        </button>
      </form>
    </div>
  );
}

export default function Contact() {
  return (
    <>
      <PageHero title="Contact Us" subtitle="We are here to listen. Reach out anytime — confidentially and without judgment." breadcrumb="Contact" />

      {/* Contact Section */}
      <section className="py-[100px] bg-[#F8FAF9]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-[1fr_1.5fr] gap-[60px] max-md:grid-cols-1">

            <div className="fade-in">
              <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-[20px] p-10 text-white">
                <h3 className="font-['Playfair_Display'] text-[1.6rem] mb-3">Get in Touch</h3>
                <p className="opacity-80 text-[0.95rem] mb-9">Whether you need support, want to volunteer, or are looking to partner — we welcome all conversations. Every message is read with care.</p>
                {[
                  { icon: 'fa-map-marker-alt', title: 'Our Location', content: 'Kigali, Rwanda' },
                  { icon: 'fa-phone', title: 'Phone', lines: [{ href: 'tel:+250781640246', text: '+250 781 640 246' }, { href: 'tel:+250791274264', text: '+250 791 274 264' }] },
                  { icon: 'fa-envelope', title: 'Email', lines: [{ href: 'mailto:vugandakumvainitiative@gmail.com', text: 'vugandakumvainitiative@gmail.com' }] },
                  { icon: 'fa-whatsapp', title: 'WhatsApp', isFab: true, lines: [{ href: WA_URL, text: '+250 781 640 246', external: true }], note: 'Available 24/7 for urgent support' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start mb-7">
                    <div className="w-12 h-12 rounded-[12px] bg-white/15 flex items-center justify-center text-[1.1rem] shrink-0">
                      <i className={`${item.isFab ? 'fab' : 'fas'} ${item.icon}`}></i>
                    </div>
                    <div>
                      <h5 className="text-[0.8rem] uppercase tracking-[0.08em] opacity-70 mb-1">{item.title}</h5>
                      {item.content ? <p className="text-[0.95rem]">{item.content}</p> : (
                        <>
                          {item.lines.map(l => (
                            <a key={l.href} href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener' } : {})} className="block text-[0.95rem] hover:text-[#C8FACC] transition-colors">{l.text}</a>
                          ))}
                          {item.note && <span className="text-[0.82rem] opacity-75">{item.note}</span>}
                        </>
                      )}
                    </div>
                  </div>
                ))}

                <div className="mt-8 pt-6 border-t border-white/15">
                  <p className="text-[0.82rem] opacity-80 mb-3.5 uppercase tracking-[0.08em]">Follow Us</p>
                  <div className="flex gap-2.5 flex-wrap">
                    {socialLinks.map(s => (
                      <a key={s.href} href={s.href} target="_blank" rel="noopener" aria-label={s.label}
                        className="w-[38px] h-[38px] rounded-full bg-white/10 flex items-center justify-center text-white text-[0.9rem] transition-all duration-300 hover:bg-[#6BCB77] hover:-translate-y-0.5">
                        <i className={`fab ${s.icon}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-[#b71c1c] rounded-[16px] p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <i className="fas fa-triangle-exclamation text-[1.4rem]"></i>
                  <strong className="text-[1rem]">In Immediate Danger?</strong>
                </div>
                <p className="text-[0.88rem] opacity-90 mb-4">Do not wait. Call emergency services immediately or use the GBV hotline.</p>
                <a href="tel:3512" className="inline-flex items-center gap-2 bg-white text-[#b71c1c] px-5 py-2.5 rounded-full font-bold text-[0.9rem]">
                  <i className="fas fa-phone-volume"></i> Call 3512 – GBV Hotline
                </a>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Ways to Get Involved */}
      <section className="py-[100px] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center">
            <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-semibold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-4">Get Involved</span>
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-5">Other Ways to Connect</h2>
            <p className="text-[1.1rem] text-gray-500 max-w-[600px] mx-auto mb-12">There are many ways to support the Vugandakumva mission beyond reaching out directly.</p>
          </div>
          <div className="grid grid-cols-3 gap-7 max-md:grid-cols-2 max-sm:grid-cols-1">
            {involveCards.map((card) => (
              <article key={card.title} className="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(107,203,119,0.2)] flex flex-col fade-in">
                <div className="h-[200px] flex items-center justify-center relative" style={{ background: card.bg }}>
                  <i className={`fas ${card.icon} text-[4rem] opacity-80 absolute`} style={{ color: card.iconColor || 'white' }}></i>
                  <span className="absolute top-4 left-4 bg-[#2E7D32] text-white text-[0.68rem] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full">{card.cat}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-['Playfair_Display'] text-[1.2rem] font-bold mb-2.5">{card.title}</h3>
                  <p className="text-[0.9rem] text-gray-500 leading-[1.6] flex-1">{card.text}</p>
                  <a href={card.link.href} {...(card.link.external ? { target: '_blank', rel: 'noopener' } : {})}
                    className="inline-flex items-center gap-2 mt-5 text-[#2E7D32] text-[0.88rem] font-semibold transition-all duration-300 hover:gap-3 hover:text-[#6BCB77]">
                    {card.link.label} <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
