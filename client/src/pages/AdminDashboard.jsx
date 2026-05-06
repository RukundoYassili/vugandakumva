import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STATUS_LABELS = { submitted: 'Submitted', reviewed: 'Reviewed', assigned: 'Assigned', in_progress: 'In Progress', resolved: 'Resolved' };
const RISK_COLORS = { high: 'bg-red-100 text-red-700', medium: 'bg-orange-100 text-orange-700', low: 'bg-green-100 text-green-700' };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [cases, setCases] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [updating, setUpdating] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [counselorMsg, setCounselorMsg] = useState('');

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem('vugandakumva_session') || 'null');
      const user = JSON.parse(localStorage.getItem('vugandakumva_user') || 'null');
      const role = user?.user_metadata?.role;
      if (!session || !['counselor', 'admin', 'legal'].includes(role)) {
        navigate('/auth');
        return;
      }
      setAuthUser(user);
      setAuthToken(session.access_token);
    } catch {
      navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    if (authToken) loadCases();
  }, [authToken, statusFilter, riskFilter]);

  const loadCases = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (riskFilter) params.set('risk', riskFilter);
      const res = await fetch(`/api/admin/cases?${params}`, { headers: { Authorization: `Bearer ${authToken}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCases(json.cases);
      setTotal(json.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (code) => {
    try {
      const res = await fetch(`/api/case/${code}`, { headers: { Authorization: `Bearer ${authToken}` } });
      const json = await res.json();
      setDetail(json);
    } catch {}
  };

  const selectCase = (c) => {
    setSelected(c);
    setDetail(null);
    setNoteInput('');
    setCounselorMsg('');
    loadDetail(c.case_code);
  };

  const updateStatus = async (newStatus) => {
    if (!selected) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/cases/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ status: newStatus, note: noteInput || null }),
      });
      if (!res.ok) throw new Error('Update failed');
      setNoteInput('');
      await loadCases();
      const updated = { ...selected, status: newStatus };
      setSelected(updated);
      await loadDetail(selected.case_code);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const sendCounselorMessage = async () => {
    if (!counselorMsg.trim() || !selected) return;
    try {
      await fetch(`/api/case/${selected.case_code}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ content: counselorMsg.trim(), senderRole: 'counselor' }),
      });
      setCounselorMsg('');
      await loadDetail(selected.case_code);
    } catch (err) {
      alert(err.message);
    }
  };

  const role = authUser?.user_metadata?.role;
  const canUpdate = role === 'admin' || role === 'counselor';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAF9] pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-['Playfair_Display'] font-bold text-[#1B5E20]">Staff Dashboard</h1>
              <p className="text-sm text-gray-500">
                Logged in as <strong className="text-gray-700">{authUser?.user_metadata?.full_name || authUser?.email}</strong>
                {' · '}<span className="capitalize bg-[#C8FACC] text-[#1B5E20] text-xs font-semibold px-2 py-0.5 rounded-full">{role}</span>
              </p>
            </div>
            <div className="text-sm text-gray-500">{total} total case{total !== 1 ? 's' : ''}</div>
          </div>

          <div className="flex gap-5">
            {/* Case list panel */}
            <div className="w-full max-w-sm flex-shrink-0">
              {/* Filters */}
              <div className="bg-white rounded-xl border border-gray-100 p-3 mb-3 flex gap-2 shadow-sm">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#6BCB77]">
                  <option value="">All Statuses</option>
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#6BCB77]">
                  <option value="">All Risks</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

              <div className="flex flex-col gap-2 max-h-[calc(100vh-220px)] overflow-y-auto">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)
                  : cases.length === 0
                    ? <div className="text-center text-gray-400 text-sm py-8">No cases found</div>
                    : cases.map(c => (
                      <button
                        key={c.id}
                        onClick={() => selectCase(c)}
                        className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm ${selected?.id === c.id ? 'border-[#6BCB77] bg-[#C8FACC]/20' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-mono font-bold text-[#2E7D32] text-sm">{c.case_code}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${RISK_COLORS[c.risk_level]}`}>{c.risk_level}</span>
                        </div>
                        <p className="text-xs text-gray-500 capitalize">{(c.violence_type || []).join(', ')}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString('en-GB')}</span>
                          <span className="text-xs font-medium text-gray-600 capitalize">{STATUS_LABELS[c.status] || c.status}</span>
                        </div>
                      </button>
                    ))
                }
              </div>
            </div>

            {/* Detail panel */}
            <div className="flex-1 min-w-0">
              {!selected ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center h-64 text-gray-400 text-sm">
                  <div className="text-center">
                    <i className="fas fa-mouse-pointer text-3xl mb-3 block text-gray-200"></i>
                    Select a case from the list to view details
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                  {/* Case header */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-mono font-bold text-2xl text-[#2E7D32]">{selected.case_code}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Received {new Date(selected.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${RISK_COLORS[selected.risk_level]}`}>{selected.risk_level} risk</span>
                    </div>
                  </div>

                  {/* Case details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAF9] rounded-xl p-4">
                    <Field label="Identity" value={selected.identity_type} />
                    <Field label="Status" value={STATUS_LABELS[selected.status] || selected.status} />
                    <Field label="Violence Type" value={(selected.violence_type || []).join(', ')} />
                    <Field label="Help Needed" value={(selected.help_needed || []).join(', ')} />
                    {selected.incident_date && <Field label="Date" value={new Date(selected.incident_date).toLocaleDateString('en-GB')} />}
                    {selected.incident_location && <Field label="Location" value={selected.incident_location} />}
                    {selected.incident_description && <Field label="Description" value={selected.incident_description} wide />}
                    {selected.people_involved && <Field label="People Involved" value={selected.people_involved} />}
                  </div>

                  {/* Timeline */}
                  {detail?.timeline?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Timeline</p>
                      <div className="flex flex-col gap-2">
                        {detail.timeline.map(t => (
                          <div key={t.id} className="flex items-start gap-3 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6BCB77] mt-1.5 flex-shrink-0"></div>
                            <div>
                              <span className="font-semibold text-gray-700 capitalize">{STATUS_LABELS[t.status] || t.status}</span>
                              {t.note && <span className="text-gray-500"> — {t.note}</span>}
                              <span className="text-gray-400 block">{new Date(t.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chat messages */}
                  {detail?.messages?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Messages</p>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto bg-gray-50 rounded-xl p-3">
                        {detail.messages.map(m => (
                          <div key={m.id} className={`text-xs p-2 rounded-lg max-w-[80%] ${m.sender_role === 'user' ? 'bg-white border border-gray-200 self-end' : 'bg-[#C8FACC]/50 self-start text-[#1B5E20]'}`}>
                            <span className="font-semibold capitalize block mb-0.5">{m.sender_role}</span>
                            {m.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions for counselors/admins */}
                  {canUpdate && (
                    <div className="border-t border-gray-100 pt-5 flex flex-col gap-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Update Case</p>

                      <div className="flex flex-wrap gap-2">
                        {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                          <button
                            key={val}
                            onClick={() => updateStatus(val)}
                            disabled={updating || selected.status === val}
                            className={`text-xs font-semibold py-1.5 px-4 rounded-lg transition-colors border ${selected.status === val ? 'border-[#6BCB77] bg-[#C8FACC]/30 text-[#1B5E20]' : 'border-gray-200 hover:border-[#6BCB77] hover:text-[#1B5E20] text-gray-600'} disabled:opacity-50`}
                          >
                            {updating ? <i className="fas fa-circle-notch fa-spin mr-1"></i> : null}
                            {lbl}
                          </button>
                        ))}
                      </div>

                      <div>
                        <textarea
                          value={noteInput}
                          onChange={e => setNoteInput(e.target.value)}
                          placeholder="Add a note to the timeline (optional)…"
                          rows={2}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6BCB77] resize-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <input
                          value={counselorMsg}
                          onChange={e => setCounselorMsg(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') sendCounselorMessage(); }}
                          placeholder="Send a message to the survivor…"
                          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#6BCB77]"
                        />
                        <button onClick={sendCounselorMessage} disabled={!counselorMsg.trim()} className="bg-[#2E7D32] text-white px-4 rounded-xl hover:bg-[#1B5E20] transition-colors disabled:opacity-40 text-xs font-semibold">
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, value, wide }) {
  if (!value) return null;
  return (
    <div className={wide ? 'col-span-full' : ''}>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
    </div>
  );
}
