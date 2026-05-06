import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const session = localStorage.getItem('vugandakumva_session');
      const userData = localStorage.getItem('vugandakumva_user');
      if (session && userData) {
        const user = JSON.parse(userData);
        setUserName(user.user_metadata?.full_name || 'My Account');
        setLoggedIn(true);
      }
    } catch {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      const body = isSignup ? { email, password, name } : { email, password };
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      if (data.session) localStorage.setItem('vugandakumva_session', JSON.stringify(data.session));
      if (data.user) localStorage.setItem('vugandakumva_user', JSON.stringify(data.user));
      setSuccess(isSignup ? 'Account created! Welcome to Vugandakumva.' : 'Signed in successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await fetch('/auth/logout', { method: 'POST' }); } catch {}
    localStorage.removeItem('vugandakumva_session');
    localStorage.removeItem('vugandakumva_user');
    setLoggedIn(false);
    navigate('/');
  };

  const inputClass = "w-full px-[18px] py-3.5 rounded-[12px] border-2 border-gray-200 bg-[#F8FAF9] font-['DM_Sans'] text-[0.95rem] outline-none transition-all duration-300 focus:border-[#6BCB77] focus:bg-white focus:shadow-[0_0_0_4px_rgba(107,203,119,0.12)]";
  const labelClass = "block mb-2 text-[0.85rem] font-semibold text-[#2D2D2D]";

  return (
    <div className="mt-[72px] min-h-[calc(100vh-72px)] relative overflow-hidden flex items-center justify-center px-5 py-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32] via-[#388E3C] to-[#1B5E20]" />
      <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-[#6BCB77]/20 orb-float-slow pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full bg-[#4CAF50]/15 orb-float-mid pointer-events-none" />
      <div className="absolute top-[40%] left-[15%] w-[140px] h-[140px] rounded-full bg-[#F4B400]/10 orb-float-fast pointer-events-none" />

      {/* Form card */}
      <div className="bg-white rounded-[28px] p-12 w-full max-w-[480px] shadow-[0_24px_80px_rgba(0,0,0,0.25)] relative z-10 max-sm:p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img src="/images/logo.png" alt="Vugandakumva" className="w-12 h-12 rounded-full border-2 border-[#6BCB77]/50 shadow-[0_0_0_4px_rgba(107,203,119,0.12)] group-hover:border-[#6BCB77] transition-all" />
            <div className="text-left">
              <span className="font-['Playfair_Display'] text-[1.1rem] font-bold text-[#2E7D32] block">Vugandakumva</span>
              <span className="text-[0.65rem] text-gray-400 tracking-[0.1em] uppercase">Speak, I Can Hear</span>
            </div>
          </Link>
        </div>

        {loggedIn ? (
          <div className="text-center">
            <div className="w-[80px] h-[80px] rounded-full bg-[#C8FACC] flex items-center justify-center mx-auto mb-5">
              <i className="fas fa-user-check text-[#2E7D32] text-[2rem]"></i>
            </div>
            <h2 className="font-['Playfair_Display'] text-[2rem] mb-2">Welcome Back!</h2>
            <p className="text-gray-500 text-[0.92rem] mb-2">Signed in as</p>
            <p className="text-[#2E7D32] font-bold text-[1rem] mb-8">{userName}</p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/dashboard" className="flex-1 py-3.5 bg-[#6BCB77] text-white rounded-full font-bold text-[0.92rem] text-center transition-all hover:bg-[#2E7D32] hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(107,203,119,0.35)]">
                <i className="fas fa-chart-line mr-2"></i>My Dashboard
              </Link>
              <button onClick={handleLogout} className="flex-1 py-3.5 border-2 border-gray-200 text-gray-600 rounded-full font-semibold text-[0.92rem] cursor-pointer bg-transparent transition-all hover:border-gray-300 hover:bg-gray-50">
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3.5 mb-6 rounded-[12px] bg-[#ffebee] text-[#d32f2f] border border-[#ffcdd2] text-[0.88rem]">
                <i className="fas fa-exclamation-circle shrink-0"></i> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2.5 px-4 py-3.5 mb-6 rounded-[12px] bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] text-[0.88rem]">
                <i className="fas fa-check-circle shrink-0"></i> {success}
              </div>
            )}

            <div className="mb-7">
              <h2 className="font-['Playfair_Display'] text-[2rem] text-[#2D2D2D] mb-1.5">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-gray-500 text-[0.9rem] leading-[1.6]">{isSignup ? 'Join us securely in supporting the mission.' : 'Sign in to access your case dashboard and support.'}</p>
            </div>

            <form onSubmit={handleSubmit}>
              {isSignup && (
                <div className="mb-5">
                  <label htmlFor="name" className={labelClass}>Full Name</label>
                  <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className={inputClass} />
                </div>
              )}
              <div className="mb-5">
                <label htmlFor="email" className={labelClass}>Email Address</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className={inputClass} />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className={labelClass}>Password</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className={inputClass} />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 bg-[#6BCB77] text-white rounded-[30px] text-[0.95rem] font-bold cursor-pointer transition-all duration-300 flex justify-center items-center gap-2.5 hover:bg-[#2E7D32] hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(107,203,119,0.4)] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none">
                {loading
                  ? <><i className="fas fa-spinner fa-spin"></i>{isSignup ? 'Creating...' : 'Signing in...'}</>
                  : isSignup ? <><i className="fas fa-user-plus"></i>Create Account</> : <><i className="fas fa-sign-in-alt"></i>Sign In</>}
              </button>

              <div className="text-center mt-6 text-[0.9rem] text-gray-500">
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <button type="button" onClick={() => { setIsSignup(s => !s); setError(''); setSuccess(''); }}
                  className="text-[#2E7D32] font-bold cursor-pointer bg-transparent border-none hover:text-[#6BCB77] transition-colors">
                  {isSignup ? 'Sign in here' : 'Create one safely'}
                </button>
              </div>
            </form>

            {/* Anonymous report nudge */}
            <div className="mt-7 pt-6 border-t border-gray-100 text-center">
              <p className="text-[0.82rem] text-gray-400 mb-3">Don't want an account?</p>
              <Link to="/report"
                className="inline-flex items-center gap-2 text-[#2E7D32] text-[0.85rem] font-bold hover:text-[#6BCB77] transition-colors">
                <i className="fas fa-user-secret"></i> Report anonymously without signing in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
