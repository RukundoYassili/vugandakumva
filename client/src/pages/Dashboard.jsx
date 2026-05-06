import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STATUS_FLOW = ['submitted', 'reviewed', 'assigned', 'in_progress', 'resolved'];
const STATUS_LABELS = {
  submitted: 'Report Submitted',
  reviewed: 'Case Reviewed',
  assigned: 'Assigned to Counselor',
  in_progress: 'Support in Progress',
  resolved: 'Case Resolved',
};
const STATUS_ICONS = {
  submitted: 'fa-file-alt',
  reviewed: 'fa-search',
  assigned: 'fa-user-check',
  in_progress: 'fa-hands-helping',
  resolved: 'fa-check-circle',
};

export default function Dashboard() {
  const [codeInput, setCodeInput] = useState('');
  const [activeCode, setActiveCode] = useState('');
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('status');
  const [msgInput, setMsgInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-load saved code on mount
  useEffect(() => {
    const saved = localStorage.getItem('vugandakumva_case_code');
    if (saved) {
      setCodeInput(saved);
      loadCase(saved);
    }
  }, []);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    if (tab === 'chat') messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [caseData?.messages, tab]);

  // Poll for updates every 10s when chat tab is open
  useEffect(() => {
    if (!activeCode || tab !== 'chat') return;
    const interval = setInterval(() => loadCase(activeCode, true), 10000);
    return () => clearInterval(interval);
  }, [activeCode, tab]);

  const loadCase = async (code, silent = false) => {
    if (!silent) { setLoading(true); setError(''); }
    try {
      const res = await fetch(`/api/case/${code.trim().toUpperCase()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Case not found');
      setCaseData(json);
      setActiveCode(code.trim().toUpperCase());
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const sendMessage = async () => {
    const content = msgInput.trim();
    if (!content || !activeCode) return;
    setSending(true);
    try {
      const res = await fetch(`/api/case/${activeCode}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, senderRole: 'user' }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setMsgInput('');
      await loadCase(activeCode, true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  const currentStepIndex = STATUS_FLOW.indexOf(caseData?.case?.status);
  const riskColor = { high: 'bg-red-50 text-red-700 border-red-200', medium: 'bg-orange-50 text-orange-700 border-orange-200', low: 'bg-green-50 text-green-700 border-green-200' };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAF9] pt-20">
        <div className="max-w-3xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-['Playfair_Display'] font-bold text-[#1B5E20]">My Dashboard</h1>
            <p className="text-gray-500 mt-1 text-sm">Track your case, chat with a counselor, and access support resources.</p>
          </div>

          {/* Case lookup */}
          {!caseData ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col items-center text-center gap-6 max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#C8FACC] flex items-center justify-center text-3xl">🔑</div>
                <div>
                  <h2 className="text-xl font-['Playfair_Display'] font-bold text-[#1B5E20] mb-2">Enter Your Case Code</h2>
                  <p className="text-gray-500 text-sm">Your case code was shown after you submitted your report (format: VN-26-XXXXXX).</p>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={e => setCodeInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && loadCase(codeInput)}
                    placeholder="VN-26-XXXXXX"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center font-mono font-bold text-lg tracking-widest focus:outline-none focus:border-[#6BCB77] focus:ring-1 focus:ring-[#6BCB77]/40 uppercase"
                  />
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <button
                    onClick={() => loadCase(codeInput)}
                    disabled={!codeInput.trim() || loading}
                    className="bg-[#2E7D32] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#1B5E20] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <><i className="fas fa-circle-notch fa-spin text-sm"></i> Loading…</> : 'Access My Case'}
                  </button>
                </div>
                <p className="text-xs text-gray-400">Don't have a case code? <Link to="/report" className="text-[#2E7D32] font-semibold hover:underline">Submit a report</Link></p>
              </div>
            </div>
          ) : (
            <>
              {/* Case header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Case Code</p>
                  <p className="font-mono font-bold text-2xl text-[#2E7D32] tracking-widest">{caseData.case.case_code}</p>
                  <p className="text-xs text-gray-400 mt-1">Submitted {new Date(caseData.case.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${riskColor[caseData.case.risk_level]}`}>
                    {caseData.case.risk_level} risk
                  </span>
                  <button onClick={() => { setCaseData(null); setActiveCode(''); }} className="text-xs text-gray-400 hover:text-gray-600">Switch Case</button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-white rounded-xl p-1 mb-4 border border-gray-100 shadow-sm">
                {[{ id: 'status', icon: 'fa-chart-line', label: 'Status' }, { id: 'chat', icon: 'fa-comments', label: 'Chat Support' }, { id: 'info', icon: 'fa-info-circle', label: 'Case Info' }].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-[#2E7D32] text-white shadow-sm' : 'text-gray-500 hover:text-[#2E7D32] hover:bg-gray-50'}`}
                  >
                    <i className={`fas ${t.icon} text-xs`}></i>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab: Status Timeline */}
              {tab === 'status' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-['Playfair_Display'] font-bold text-[#1B5E20] text-lg mb-6">Case Progress</h3>
                  <div className="relative flex flex-col gap-0">
                    {STATUS_FLOW.map((status, i) => {
                      const done = i <= currentStepIndex;
                      const current = i === currentStepIndex;
                      const timelineEntry = caseData.timeline?.find(t => t.status === status);
                      return (
                        <div key={status} className="flex items-start gap-4 pb-6 relative">
                          {i < STATUS_FLOW.length - 1 && (
                            <div className={`absolute left-5 top-10 w-0.5 h-full -z-0 ${done ? 'bg-[#6BCB77]' : 'bg-gray-100'}`} />
                          )}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${current ? 'border-[#2E7D32] bg-[#2E7D32]' : done ? 'border-[#6BCB77] bg-[#6BCB77]' : 'border-gray-200 bg-white'}`}>
                            <i className={`fas ${STATUS_ICONS[status]} text-sm ${done ? 'text-white' : 'text-gray-300'}`}></i>
                          </div>
                          <div className="flex-1 pt-1.5">
                            <p className={`font-semibold text-sm ${current ? 'text-[#1B5E20]' : done ? 'text-gray-700' : 'text-gray-400'}`}>{STATUS_LABELS[status]}</p>
                            {timelineEntry && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(timelineEntry.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                {timelineEntry.note && <span className="block text-gray-500 mt-0.5">{timelineEntry.note}</span>}
                              </p>
                            )}
                            {current && <span className="inline-block mt-1 text-xs bg-[#C8FACC] text-[#1B5E20] font-semibold px-2 py-0.5 rounded-full">Current Status</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab: Chat */}
              {tab === 'chat' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col" style={{ height: '480px' }}>
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#6BCB77] animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">Support Chat</span>
                      <span className="text-xs text-gray-400">— messages are reviewed by a counselor</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    {caseData.messages?.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-400">
                        <i className="fas fa-comments text-4xl text-gray-200"></i>
                        <p className="text-sm">No messages yet. Send a message to start chatting with a counselor.</p>
                      </div>
                    )}
                    {caseData.messages?.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.sender_role === 'user' ? 'bg-[#2E7D32] text-white rounded-br-sm' : msg.sender_role === 'system' ? 'bg-gray-50 text-gray-500 italic text-xs px-3 py-1.5 rounded-full' : 'bg-[#F0FDF4] text-gray-800 border border-[#C8FACC] rounded-bl-sm'}`}>
                          {msg.sender_role === 'counselor' && <span className="block text-xs text-[#2E7D32] font-semibold mb-1">Counselor</span>}
                          {msg.content}
                          <span className="block text-right text-[10px] opacity-60 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      <textarea
                        value={msgInput}
                        onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                        placeholder="Type a message… (Enter to send)"
                        rows={2}
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6BCB77] resize-none"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!msgInput.trim() || sending}
                        className="bg-[#2E7D32] text-white px-4 rounded-xl hover:bg-[#1B5E20] transition-colors disabled:opacity-40 flex-shrink-0 flex items-center justify-center"
                      >
                        {sending ? <i className="fas fa-circle-notch fa-spin text-sm"></i> : <i className="fas fa-paper-plane text-sm"></i>}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Case Info */}
              {tab === 'info' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
                  <h3 className="font-['Playfair_Display'] font-bold text-[#1B5E20] text-lg">Case Summary</h3>
                  <InfoRow label="Identity Type" value={caseData.case.identity_type === 'anonymous' ? 'Anonymous' : 'Identified'} />
                  <InfoRow label="Type of Violence" value={(caseData.case.violence_type || []).join(', ')} />
                  {caseData.case.incident_date && <InfoRow label="Date of Incident" value={new Date(caseData.case.incident_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />}
                  {caseData.case.incident_location && <InfoRow label="Location" value={caseData.case.incident_location} />}
                  {caseData.case.incident_description && <InfoRow label="Description" value={caseData.case.incident_description} multiline />}
                  {caseData.case.people_involved && <InfoRow label="Persons Involved" value={caseData.case.people_involved} />}
                  <InfoRow label="Help Requested" value={(caseData.case.help_needed || []).join(', ')} />
                  <InfoRow label="Risk Level" value={caseData.case.risk_level?.toUpperCase()} />
                  <InfoRow label="Case Status" value={STATUS_LABELS[caseData.case.status] || caseData.case.status} />

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-4">Need to add more information or evidence to your case?</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to="/resources" className="flex-1 text-center bg-[#C8FACC] text-[#1B5E20] font-semibold py-3 px-5 rounded-xl hover:bg-[#6BCB77] hover:text-white transition-colors text-sm">
                        <i className="fas fa-book-open mr-2"></i>Resources & Rights
                      </Link>
                      <a href="tel:3512" className="flex-1 text-center border-2 border-gray-200 text-gray-600 font-semibold py-3 px-5 rounded-xl hover:border-[#6BCB77] hover:text-[#2E7D32] transition-colors text-sm">
                        <i className="fas fa-phone-alt mr-2"></i>Call Hotline 3512
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Emergency banner */}
          <div className="mt-6 bg-red-50 border border-red-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-exclamation-triangle text-red-500"></i>
              <span className="text-sm font-medium text-red-700">In immediate danger?</span>
            </div>
            <a href="tel:112" className="bg-red-600 text-white font-bold py-2 px-5 rounded-lg text-sm hover:bg-red-700 transition-colors flex-shrink-0">
              Call 112 Now
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InfoRow({ label, value, multiline }) {
  if (!value) return null;
  return (
    <div className={multiline ? '' : 'flex items-start justify-between gap-4'}>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0">{label}</span>
      <span className={`text-gray-700 text-sm ${multiline ? 'mt-1 block leading-relaxed' : 'text-right'}`}>{value}</span>
    </div>
  );
}
