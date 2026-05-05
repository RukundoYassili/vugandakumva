const WA_URL = 'https://wa.me/250781640246?text=Hello%20Vugandakumva%20Team%2C%20I%20am%20contacting%20you%20from%20your%20website%20and%20would%20like%20to%20ask%20or%20talk%20about%20gender-based%20violence%20support.';

export default function WhatsAppButton() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp"
      style={{ animation: 'pulse-wa 2.5s infinite' }}
      className="fixed bottom-8 right-8 z-[999] w-[60px] h-[60px] rounded-full bg-[#25D366] text-white flex items-center justify-center text-[1.6rem] shadow-[0_4px_20px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_32px_rgba(37,211,102,0.6)] hover:[animation:none]"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}
