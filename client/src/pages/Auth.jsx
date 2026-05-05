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

  const inputClass = "w-full px-[18px] py-3.5 rounded-[12px] border border-gray-200 bg-gray-50 font-['DM_Sans'] text-[0.95rem] outline-none transition-all duration-300 focus:border-[#6BCB77] focus:bg-white focus:shadow-[0_0_0_4px_rgba(107,203,119,0.12)]";
  const labelClass = "block mb-2 font-medium text-[#2D2D2D] font-['DM_Sans']";

  return (
    <div className="mt-[72px] bg-[#F8FAF9] min-h-[70vh] flex items-center justify-center px-5 py-20">
      <div className="bg-white rounded-[20px] p-12 w-full max-w-[480px] shadow-[0_4px_30px_rgba(46,125,50,0.12)] fade-in visible max-sm:p-8">
        {loggedIn ? (
          <div className="text-center">
            <div className="text-[3.5rem] text-[#6BCB77] mb-5"><i className="fas fa-user-circle"></i></div>
            <h2 className="font-['Playfair_Display'] text-[2.2rem] mb-2">Welcome Back!</h2>
            <p className="text-gray-500 text-[0.95rem] mb-8">You are officially signed into Vugandakumva and connected to the support network.</p>
            <p className="text-[#2E7D32] font-semibold mb-6">{userName}</p>
            <button onClick={handleLogout}
              className="w-full py-4 rounded-full border border-gray-200 text-[#2D2D2D] font-semibold text-[1.05rem] cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              Sign Out
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-center gap-2.5 px-3.5 py-3.5 mb-6 rounded-[12px] bg-[#ffebee] text-[#d32f2f] border border-[#ffcdd2] text-[0.95rem]">
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2.5 px-3.5 py-3.5 mb-6 rounded-[12px] bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] text-[0.95rem]">
                <i className="fas fa-check-circle"></i> {success}
              </div>
            )}

            <div className="text-center mb-7">
              <h2 className="font-['Playfair_Display'] text-[2.2rem] text-[#2D2D2D] mb-1.5">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-gray-500 text-[0.95rem]">{isSignup ? 'Join us securely in supporting the mission.' : 'Sign in to securely access support.'}</p>
            </div>

            <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
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
                className="w-full py-4 bg-[#6BCB77] text-white border-none rounded-full text-[1.05rem] font-semibold cursor-pointer transition-all duration-300 mt-3 flex justify-center items-center hover:bg-[#2E7D32] hover:-translate-y-0.5 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:translate-y-0">
                {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i> {isSignup ? 'Creating...' : 'Signing in...'}</> : (isSignup ? 'Create Account' : 'Sign In')}
              </button>

              <div className="text-center mt-6 text-[0.95rem] text-gray-500">
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <button type="button" onClick={() => { setIsSignup(s => !s); setError(''); setSuccess(''); }}
                  className="text-[#6BCB77] font-semibold cursor-pointer bg-transparent border-none">
                  {isSignup ? 'Sign in here' : 'Create one safely'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
