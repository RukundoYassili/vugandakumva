import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import CTABanner from '../components/CTABanner';
import { useFadeIn } from '../hooks/useFadeIn';

const gbvForms = [
  {
    id: 'physical', tag: 'Form 1', title: 'Physical Violence', img: '/images/image1.jpeg', imgAlt: 'Physical Violence Awareness',
    bg: 'linear-gradient(135deg, #6BCB77, #2E7D32)', reverse: false, btnTo: '/report', btnLabel: 'Report Safely',
    paragraphs: [
      'Physical violence involves any act of bodily force used to cause harm, pain, or injury. This includes hitting, slapping, kicking, strangling, pushing, burning, or using weapons against another person.',
      'It is one of the most visible forms of GBV, yet many victims remain silent due to fear of retaliation, economic dependency, social stigma, or lack of access to safe reporting channels.',
      <><strong>Remember:</strong> No amount of physical harm is acceptable. Everyone has the right to live without violence.</>,
    ],
  },
  {
    id: 'psychological', tag: 'Form 2', title: 'Psychological & Emotional Abuse', img: '/images/image2.jpeg', imgAlt: 'Psychological Abuse Awareness',
    bg: 'linear-gradient(135deg, #F4B400, #e0920d)', reverse: true, btnTo: '/resources', btnLabel: 'Speak to Someone',
    paragraphs: [
      "Psychological abuse includes controlling behavior, intimidation, threats, verbal abuse, humiliation, and isolation. It damages a person's sense of self-worth, mental health, and ability to make independent decisions.",
      'Unlike physical violence, emotional abuse leaves no visible marks — making it harder to identify, report, and prove. Yet its long-term impact can be equally devastating.',
      <><strong>Common tactics:</strong> Gaslighting, name-calling, threats to harm loved ones, monitoring movements, and systematic isolation from friends and family.</>,
    ],
  },
  {
    id: 'economic', tag: 'Form 3', title: 'Economic & Financial Abuse', img: '/images/image3.jpeg', imgAlt: 'Economic Abuse Awareness',
    bg: 'linear-gradient(135deg, #1B5E20, #0d3b0d)', reverse: false, btnTo: '/resources', btnLabel: 'Access Resources',
    paragraphs: [
      'Economic abuse involves controlling access to financial resources to maintain power over another person. The abuser may prevent the victim from working, steal their earnings, control all spending, or destroy property.',
      'This form of GBV creates financial dependency that traps victims in abusive relationships — because leaving feels economically impossible.',
      <><strong>Signs to watch for:</strong> Not being allowed to access money, joint accounts controlled entirely by a partner, or being required to ask permission for any purchases.</>,
    ],
  },
  {
    id: 'sexual', tag: 'Form 4', title: 'Sexual Violence', img: '/images/image4.jpeg', imgAlt: 'Sexual Violence Awareness',
    bg: 'linear-gradient(135deg, #4a148c, #7b1fa2)', reverse: true, btnTo: '/contact', btnLabel: 'Get Confidential Help',
    paragraphs: [
      'Sexual violence encompasses any non-consensual sexual act or behavior. It includes rape, sexual assault, harassment, forced marriage, and any form of unwanted sexual contact or exploitation.',
      'Sexual violence can occur within marriages and intimate relationships, in workplaces, schools, and public spaces. It is always a crime, regardless of the relationship between the perpetrator and victim.',
      <><strong>Critical fact:</strong> Consent must be freely given, reversible, informed, enthusiastic, and specific. Its absence — at any point — means no.</>,
    ],
  },
];

const warningSigns = [
  { icon: 'fa-eye-slash', title: 'Jealousy & Controlling Behavior', text: 'Partner monitors your whereabouts, controls who you see, or checks your phone without permission.' },
  { icon: 'fa-user-minus', title: 'Isolation from Support Networks', text: 'You are cut off from friends, family, or community over time — making you more dependent.' },
  { icon: 'fa-volume-xmark', title: 'Constant Criticism & Humiliation', text: 'Being frequently put down, insulted, or made to feel worthless — especially in front of others.' },
  { icon: 'fa-wallet', title: 'Financial Control', text: 'No access to money, required to account for every purchase, or prevented from working.' },
  { icon: 'fa-face-anxious-sweat', title: 'Walking on Eggshells', text: "Feeling constantly anxious about your partner's mood and altering behavior to avoid conflict." },
  { icon: 'fa-bandage', title: 'Unexplained Physical Injuries', text: 'Bruises, marks, or injuries that are explained away or minimized by either party.' },
];

const preventionCards = [
  { icon: 'fa-chalkboard-teacher', cat: 'Individuals', title: 'Educate Yourself & Others', text: 'Learn to recognize GBV in all its forms. Share resources, speak up when you witness abuse, and challenge harmful gender norms in everyday conversations.', bg: 'linear-gradient(135deg, #C8FACC, #6BCB77)' },
  { icon: 'fa-people-group', cat: 'Communities', title: 'Build Safe Communities', text: 'Create safe spaces for survivors. Support local shelters, advocate for better laws, and partner with organizations fighting GBV at the grassroots level.', bg: 'linear-gradient(135deg, #6BCB77, #2E7D32)' },
  { icon: 'fa-landmark', cat: 'Institutions', title: 'Demand Policy Change', text: 'Advocate for strong GBV legislation, survivor-centered court processes, trained law enforcement, and institutional accountability at all levels of government.', bg: 'linear-gradient(135deg, #2E7D32, #1B5E20)' },
];

function GBVSection({ form }) {
  const visualRef = useFadeIn();
  const textRef = useFadeIn();

  const visual = (
    <div ref={visualRef} className={form.reverse ? 'fade-in-right' : 'fade-in-left'}>
      <div className="rounded-[24px] overflow-hidden h-[380px] shadow-[0_8px_40px_rgba(0,0,0,0.15)] relative group">
        <div className="absolute inset-0 rounded-[24px]" style={{ background: form.bg }} />
        <div className="absolute inset-0 pattern-dots opacity-20 rounded-[24px]" />
        <img src={form.img} alt={form.imgAlt}
          className="absolute inset-0 w-full h-full object-cover opacity-70 rounded-[24px] transition-transform duration-700 group-hover:scale-105"
          onError={e => { e.target.style.display = 'none'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-[24px]" />
        <span className="absolute top-4 left-4 z-10 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[0.72rem] font-bold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full">
          {form.tag}
        </span>
      </div>
    </div>
  );

  const text = (
    <div ref={textRef} className={form.reverse ? 'fade-in-left' : 'fade-in-right'}>
      <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-semibold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-4">{form.tag}</span>
      <h2 className="font-['Playfair_Display'] text-[2rem] mb-5" id={form.id}>{form.title}</h2>
      {form.paragraphs.map((p, i) => <p key={i} className="text-[0.97rem] text-gray-500 mb-4 leading-[1.8]">{p}</p>)}
      <Link to={form.btnTo}
        className="inline-flex items-center gap-2.5 mt-4 px-8 py-3.5 rounded-[30px] bg-[#6BCB77] text-white font-bold text-[0.92rem] shadow-[0_4px_20px_rgba(107,203,119,0.4)] transition-all duration-300 hover:bg-[#2E7D32] hover:gap-4 hover:-translate-y-0.5">
        {form.btnLabel} <i className="fas fa-arrow-right"></i>
      </Link>
    </div>
  );

  return (
    <div className={`grid grid-cols-2 gap-[80px] items-center mb-[80px] max-md:grid-cols-1 max-md:gap-10`}>
      {form.reverse ? <>{text}{visual}</> : <>{visual}{text}</>}
    </div>
  );
}

export default function Awareness() {
  const bannerRef = useFadeIn();
  const signsRef = useFadeIn();

  return (
    <>
      <PageHero title="GBV Awareness" subtitle="Understanding is the foundation of prevention" breadcrumb="Awareness" />

      {/* GBV Forms */}
      <section className="py-[100px] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div ref={bannerRef} className="fade-in bg-gradient-to-r from-[#C8FACC] to-[#EBF5EB] border-l-4 border-[#6BCB77] rounded-r-[16px] p-5 mb-12 flex gap-4 items-start shadow-[0_2px_12px_rgba(107,203,119,0.12)]">
            <div className="w-10 h-10 rounded-full bg-[#6BCB77] flex items-center justify-center shrink-0">
              <i className="fas fa-info-circle text-white text-[0.95rem]"></i>
            </div>
            <div>
              <strong className="text-[#2E7D32] text-[0.92rem] block mb-0.5">What is Gender-Based Violence?</strong>
              <span className="text-[0.88rem] text-[#2E7D32]/80">GBV refers to harmful acts directed at an individual based on their gender. It affects people of all backgrounds, ages, and communities worldwide.</span>
            </div>
          </div>
          {gbvForms.map(form => <GBVSection key={form.id} form={form} />)}
        </div>
      </section>

      {/* Warning Signs */}
      <section className="py-[100px] bg-[#F8FAF9] relative overflow-hidden" id="signs">
        <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full bg-[#F4B400]/6 orb-float-slow pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center">
            <span className="inline-block bg-[#FFF8E1] text-[#e0920d] text-[0.75rem] font-bold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-4">Early Recognition</span>
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-5">Warning Signs of GBV</h2>
            <p className="text-[1.05rem] text-gray-500 max-w-[600px] mx-auto mb-12">Recognizing the signs early can save lives. Know what to look for in yourself and those around you.</p>
          </div>
          <div ref={signsRef} className="fade-in bg-white rounded-[24px] p-10 shadow-[0_4px_28px_rgba(0,0,0,0.07)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F4B400] via-[#6BCB77] to-[#2E7D32]" />
            <h3 className="font-['Playfair_Display'] text-[1.5rem] mb-6">
              <i className="fas fa-triangle-exclamation text-[#F4B400] mr-2.5"></i>Signs in a Relationship
            </h3>
            <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
              {warningSigns.map((sign) => (
                <div key={sign.title} className="flex gap-3 items-start p-4 rounded-[16px] hover:bg-[#F8FAF9] transition-colors duration-200">
                  <div className="w-10 h-10 rounded-[10px] bg-[#FFF8E1] flex items-center justify-center shrink-0 text-[#e0920d]">
                    <i className={`fas ${sign.icon}`}></i>
                  </div>
                  <div>
                    <h5 className="text-[0.92rem] font-semibold mb-1">{sign.title}</h5>
                    <p className="text-[0.82rem] text-gray-500 leading-[1.6]">{sign.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prevention */}
      <section className="py-[100px] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center">
            <span className="inline-block bg-[#C8FACC] text-[#2E7D32] text-[0.75rem] font-semibold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-4">Prevention</span>
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3rem)] leading-[1.2] mb-5">How We Can All Prevent GBV</h2>
            <p className="text-[1.05rem] text-gray-500 max-w-[600px] mx-auto mb-12">Prevention is everyone's responsibility. Here's how communities, individuals, and institutions can take action.</p>
          </div>
          <div className="grid grid-cols-3 gap-7 mt-4 max-md:grid-cols-2 max-sm:grid-cols-1">
            {preventionCards.map((card) => (
              <article key={card.title} className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(107,203,119,0.2)] flex flex-col group">
                <div className="h-[200px] flex items-center justify-center relative overflow-hidden" style={{ background: card.bg }}>
                  <div className="absolute inset-0 pattern-dots opacity-20" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-white/10" />
                  <i className={`fas ${card.icon} text-[4rem] text-white/85 relative z-10 group-hover:scale-110 transition-transform duration-400`}></i>
                  <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-[0.68rem] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full border border-white/30 z-10">{card.cat}</span>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="font-['Playfair_Display'] text-[1.2rem] font-bold mb-2.5">{card.title}</h3>
                  <p className="text-[0.9rem] text-gray-500 leading-[1.7] flex-1">{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Knowledge is the First Step to Action"
        subtitle="Explore our resources, share this information with your network, and reach out if you or someone you know needs help."
        primaryLabel="View Resources"
        primaryTo="/resources"
        secondaryLabel="Contact Us"
        secondaryTo="/contact"
      />
    </>
  );
}
