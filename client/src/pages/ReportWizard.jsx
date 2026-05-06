import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STEPS = ['Safety Check', 'Your Identity', 'Type of Violence', 'Incident Details', 'Help Needed', 'Evidence', 'Review'];

// ── Progress Bar ──────────────────────────────────────────────────────────────
function WizardProgress({ step }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Step {step} of {STEPS.length}</span>
        <span className="text-xs text-[#2E7D32] font-medium">{STEPS[step - 1]}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(step / STEPS.length) * 100}%`, background: 'linear-gradient(90deg,#6BCB77,#2E7D32)' }}
        />
      </div>
    </div>
  );
}

// ── Step 1: Safety Check ──────────────────────────────────────────────────────
function StepSafetyCheck({ onNext }) {
  return (
    <div className="flex flex-col items-center gap-8 text-center py-8">
      <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-4xl border-4 border-amber-100">🛡️</div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-[#1B5E20] mb-3">Are you safe right now?</h2>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">Your safety comes first. If you are in immediate danger, please call for help before continuing.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <a href="tel:112" className="flex-1 bg-red-600 text-white font-bold py-4 px-5 rounded-xl text-center hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <i className="fas fa-phone-alt text-sm"></i> Call 112
        </a>
        <a href="tel:3512" className="flex-1 bg-orange-500 text-white font-bold py-4 px-5 rounded-xl text-center hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <i className="fas fa-phone-alt text-sm"></i> GBV Hotline 3512
        </a>
      </div>
      <button
        onClick={onNext}
        className="bg-[#2E7D32] text-white font-semibold py-3 px-10 rounded-xl hover:bg-[#1B5E20] transition-colors text-base shadow-sm"
      >
        Yes, I am safe — Continue →
      </button>
      <p className="text-xs text-gray-400 max-w-xs">All reports are completely confidential. You control everything you share.</p>
    </div>
  );
}

// ── Step 2: Identity ──────────────────────────────────────────────────────────
function StepIdentity({ value, onChange, onNext, onBack }) {
  return (
    <div className="flex flex-col gap-7 py-6">
      <div className="text-center">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#1B5E20] mb-2">How would you like to continue?</h2>
        <p className="text-gray-500 text-sm">Your choice does not affect the quality of help you receive.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { val: 'anonymous', icon: '🕶️', title: 'Stay Anonymous', desc: "You'll receive a private case code. No personal details required." },
          { val: 'identified', icon: '👤', title: 'Share My Identity', desc: 'Allows counselors to provide more personalised follow-up support.' },
        ].map(({ val, icon, title, desc }) => (
          <button
            key={val}
            onClick={() => { onChange(val); onNext(); }}
            className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-md hover:-translate-y-0.5 ${value === val ? 'border-[#6BCB77] bg-[#C8FACC]/30' : 'border-gray-200 bg-white hover:border-[#6BCB77]'}`}
          >
            <span className="text-3xl block mb-3">{icon}</span>
            <span className="font-bold text-[#1B5E20] block text-base">{title}</span>
            <span className="text-gray-500 text-sm mt-1 block leading-snug">{desc}</span>
          </button>
        ))}
      </div>
      <button onClick={onBack} className="self-start text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">← Back</button>
    </div>
  );
}

// ── Step 3: Violence Type ─────────────────────────────────────────────────────
const VIOLENCE_TYPES = [
  { val: 'physical', icon: '🤜', label: 'Physical', desc: 'Hitting, kicking, pushing, burning' },
  { val: 'sexual', icon: '🚫', label: 'Sexual', desc: 'Rape, harassment, forced acts' },
  { val: 'psychological', icon: '🧠', label: 'Emotional / Psychological', desc: 'Threats, isolation, humiliation, control' },
  { val: 'economic', icon: '💰', label: 'Economic / Financial', desc: 'Controlling money, denying work or education' },
  { val: 'other', icon: '•••', label: 'Other', desc: 'Different or multiple forms of violence' },
];

function StepViolenceType({ value, onChange, onNext, onBack }) {
  const toggle = (val) => onChange(value.includes(val) ? value.filter(v => v !== val) : [...value, val]);
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="text-center">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#1B5E20] mb-2">What type of violence did you experience?</h2>
        <p className="text-gray-500 text-sm">Select all that apply. This information is confidential.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {VIOLENCE_TYPES.map(({ val, icon, label, desc }) => (
          <button
            key={val}
            onClick={() => toggle(val)}
            className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${value.includes(val) ? 'border-[#6BCB77] bg-[#C8FACC]/25' : 'border-gray-200 bg-white hover:border-[#6BCB77]'}`}
          >
            <span className="text-2xl mt-0.5">{icon}</span>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-[#1B5E20] block text-sm">{label}</span>
              <span className="text-gray-500 text-xs leading-snug block">{desc}</span>
            </div>
            {value.includes(val) && <i className="fas fa-check-circle text-[#6BCB77] text-base flex-shrink-0 mt-0.5"></i>}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">← Back</button>
        <button
          onClick={onNext}
          disabled={value.length === 0}
          className="bg-[#2E7D32] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#1B5E20] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ── Step 4: Incident Details ───────────────────────────────────────────────────
function StepIncidentDetails({ value, onChange, onNext, onBack }) {
  const field = 'border border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:border-[#6BCB77] focus:ring-1 focus:ring-[#6BCB77]/40 text-sm bg-white transition-colors';
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="text-center">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#1B5E20] mb-2">Tell us about what happened</h2>
        <p className="text-gray-500 text-sm">All fields are optional — share only what you feel comfortable with.</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">When did it happen?</label>
            <input type="date" value={value.incidentDate} onChange={e => onChange({ incidentDate: e.target.value })} className={field} max={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Where did it happen?</label>
            <input type="text" value={value.incidentLocation} onChange={e => onChange({ incidentLocation: e.target.value })} placeholder="e.g. Home, street, workplace…" className={field} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Describe what happened</label>
          <textarea
            value={value.incidentDescription}
            onChange={e => onChange({ incidentDescription: e.target.value })}
            rows={4}
            placeholder="Describe what happened in your own words. Take your time — there are no wrong answers."
            className={`${field} resize-none`}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Who was involved? <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
          <input type="text" value={value.peopleInvolved} onChange={e => onChange({ peopleInvolved: e.target.value })} placeholder="e.g. partner, family member, colleague, stranger…" className={field} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">← Back</button>
        <button onClick={onNext} className="bg-[#2E7D32] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#1B5E20] transition-colors">Continue →</button>
      </div>
    </div>
  );
}

// ── Step 5: Help Needed ───────────────────────────────────────────────────────
const HELP_OPTIONS = [
  { val: 'counseling', icon: '💬', label: 'Counseling / Emotional Support', desc: 'Talking to a trauma-informed counselor' },
  { val: 'shelter', icon: '🏠', label: 'Safe Shelter / Protection', desc: 'Finding a safe place to stay' },
  { val: 'medical', icon: '🏥', label: 'Medical Support', desc: 'Medical care and documentation' },
  { val: 'legal', icon: '⚖️', label: 'Legal Aid', desc: 'Legal advice, rights, and representation' },
  { val: 'unsure', icon: '❓', label: "I'm not sure yet", desc: 'I just need someone to talk to' },
];

function StepHelpNeeded({ value, onChange, onNext, onBack }) {
  const toggle = (val) => onChange(value.includes(val) ? value.filter(v => v !== val) : [...value, val]);
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="text-center">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#1B5E20] mb-2">What kind of help do you need?</h2>
        <p className="text-gray-500 text-sm">You can select more than one. This helps us connect you with the right support.</p>
      </div>
      <div className="flex flex-col gap-3">
        {HELP_OPTIONS.map(({ val, icon, label, desc }) => (
          <button
            key={val}
            onClick={() => toggle(val)}
            className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${value.includes(val) ? 'border-[#6BCB77] bg-[#C8FACC]/25' : 'border-gray-200 bg-white hover:border-[#6BCB77]'}`}
          >
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-[#1B5E20] block text-sm">{label}</span>
              <span className="text-gray-500 text-xs">{desc}</span>
            </div>
            {value.includes(val) && <i className="fas fa-check-circle text-[#6BCB77] text-base flex-shrink-0"></i>}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">← Back</button>
        <button
          onClick={onNext}
          disabled={value.length === 0}
          className="bg-[#2E7D32] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#1B5E20] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ── Step 6: Evidence Upload ───────────────────────────────────────────────────
function StepEvidence({ value, onChange, onNext, onBack }) {
  const [dragging, setDragging] = useState(false);

  const addFiles = (files) => {
    const allowed = ['image/', 'audio/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats'];
    const valid = Array.from(files).filter(f => allowed.some(t => f.type.startsWith(t))).slice(0, 5);
    onChange([...value, ...valid].slice(0, 5));
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="text-center">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#1B5E20] mb-2">Add Evidence <span className="text-gray-400 font-normal text-lg">(Optional)</span></h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">Photos, audio recordings, or documents. You can also add evidence later from your dashboard.</p>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragging ? 'border-[#6BCB77] bg-[#C8FACC]/20' : 'border-gray-200 hover:border-[#6BCB77] hover:bg-gray-50'}`}
      >
        <i className="fas fa-cloud-upload-alt text-4xl text-gray-300 mb-3 block"></i>
        <p className="text-gray-500 mb-4 text-sm">Drag files here, or click below to select</p>
        <label className="cursor-pointer inline-block bg-[#C8FACC] text-[#1B5E20] font-semibold py-2 px-6 rounded-lg hover:bg-[#6BCB77] hover:text-white transition-colors text-sm">
          Choose Files
          <input type="file" multiple accept="image/*,audio/*,.pdf,.doc,.docx" className="hidden" onChange={e => addFiles(e.target.files)} />
        </label>
        <p className="text-xs text-gray-400 mt-3">Max 10 MB per file · up to 5 files · Images, audio, PDF, Word</p>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        <i className="fas fa-lock mt-0.5 flex-shrink-0"></i>
        <span>All files are encrypted at rest. Only you and authorised counselors can access your evidence. You decide who sees it.</span>
      </div>

      {value.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{value.length} file(s) selected</p>
          {value.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <i className={`fas ${f.type.startsWith('image/') ? 'fa-image' : f.type.startsWith('audio/') ? 'fa-music' : 'fa-file-alt'} text-[#6BCB77] text-sm flex-shrink-0`}></i>
                <span className="text-sm text-gray-700 truncate">{f.name}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">({(f.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 ml-3 text-xs flex-shrink-0">Remove</button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">← Back</button>
        <button onClick={onNext} className="bg-[#2E7D32] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#1B5E20] transition-colors">Continue →</button>
      </div>
    </div>
  );
}

// ── Step 7: Review & Submit ───────────────────────────────────────────────────
const VIOLENCE_LABELS = { physical: 'Physical', sexual: 'Sexual', psychological: 'Emotional / Psychological', economic: 'Economic / Financial', other: 'Other' };
const HELP_LABELS = { counseling: 'Counseling', shelter: 'Safe Shelter', medical: 'Medical', legal: 'Legal Aid', unsure: 'Not sure yet' };

function ReviewRow({ label, value, multiline }) {
  if (!value) return null;
  return (
    <div className={multiline ? '' : 'flex items-start justify-between gap-4 min-w-0'}>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block flex-shrink-0">{label}</span>
      <span className={`text-gray-700 text-sm ${multiline ? 'mt-1 block leading-relaxed' : 'text-right max-w-[65%]'}`}>{value}</span>
    </div>
  );
}

function StepSummary({ report, onNext, onBack, submitting, submitError }) {
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="text-center">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#1B5E20] mb-2">Review Your Report</h2>
        <p className="text-gray-500 text-sm">Please confirm everything is correct before submitting securely.</p>
      </div>

      <div className="bg-[#F8FAF9] rounded-2xl p-6 flex flex-col gap-4 border border-gray-100">
        <ReviewRow label="Identity" value={report.identityType === 'anonymous' ? 'Anonymous' : 'Identified'} />
        <ReviewRow label="Type of Violence" value={report.violenceType.map(v => VIOLENCE_LABELS[v] || v).join(', ')} />
        <ReviewRow label="Date" value={report.incidentDate} />
        <ReviewRow label="Location" value={report.incidentLocation} />
        <ReviewRow label="What Happened" value={report.incidentDescription} multiline />
        <ReviewRow label="Who Was Involved" value={report.peopleInvolved} />
        <ReviewRow label="Help Needed" value={report.helpNeeded.map(h => HELP_LABELS[h] || h).join(', ')} />
        {report.files.length > 0 && <ReviewRow label="Evidence" value={`${report.files.length} file(s) attached`} />}
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm flex items-start gap-2">
          <i className="fas fa-exclamation-circle mt-0.5 flex-shrink-0"></i>
          <span>{submitError}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button onClick={onBack} disabled={submitting} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm disabled:opacity-40">← Back</button>
        <button
          onClick={onNext}
          disabled={submitting}
          className="bg-[#2E7D32] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#1B5E20] transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
        >
          {submitting
            ? <><i className="fas fa-circle-notch fa-spin text-sm"></i> Submitting…</>
            : <><i className="fas fa-lock text-sm"></i> Submit Report Securely</>
          }
        </button>
      </div>
    </div>
  );
}

// ── Step 8: Confirmation ──────────────────────────────────────────────────────
function StepConfirmation({ result }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (result?.caseCode) localStorage.setItem('vugandakumva_case_code', result.caseCode);
  }, [result]);

  const copyCode = () => {
    navigator.clipboard?.writeText(result?.caseCode).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const riskBanner = {
    high: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: '⚠️', msg: 'Our response team has been notified. This is being treated as a priority case.' },
    medium: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', icon: '📋', msg: 'A counselor will review your case and reach out soon with guidance.' },
    low: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', icon: '✅', msg: 'Your report has been logged. A counselor will follow up with you.' },
  };
  const banner = riskBanner[result?.riskLevel] || riskBanner.low;

  return (
    <div className="flex flex-col items-center gap-8 py-10 text-center">
      <div className="w-24 h-24 rounded-full bg-[#C8FACC] flex items-center justify-center border-4 border-[#6BCB77]/30">
        <i className="fas fa-check-circle text-5xl text-[#2E7D32]"></i>
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-[#1B5E20] mb-3">Your Report Has Been Received</h2>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">Thank you for trusting us. You are not alone, and we are here for you every step of the way.</p>
      </div>

      <div className={`border rounded-xl px-6 py-3 text-sm font-medium flex items-center gap-2 ${banner.bg} ${banner.text}`}>
        <span>{banner.icon}</span>
        <span>{banner.msg}</span>
      </div>

      <div className="bg-[#F8FAF9] rounded-2xl p-8 w-full max-w-sm border border-gray-100 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Case Code</p>
        <p className="text-3xl font-bold text-[#2E7D32] tracking-widest font-mono mb-2">{result?.caseCode}</p>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          Save this code carefully — it is your private key to track this report and access your dashboard.
        </p>
        <button
          onClick={copyCode}
          className="text-xs bg-[#C8FACC] text-[#1B5E20] font-semibold py-2 px-5 rounded-lg hover:bg-[#6BCB77] hover:text-white transition-colors"
        >
          {copied ? <><i className="fas fa-check mr-1"></i> Copied!</> : <><i className="far fa-copy mr-1"></i> Copy Code</>}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link to="/dashboard" className="flex-1 bg-[#2E7D32] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#1B5E20] transition-colors text-center shadow-sm">
          Go to My Dashboard →
        </Link>
        <Link to="/" className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-4 px-6 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors text-center text-sm">
          Return to Home
        </Link>
      </div>
    </div>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────────────────
export default function ReportWizard() {
  const [step, setStep] = useState(1);
  const [report, setReport] = useState({
    identityType: 'anonymous',
    violenceType: [],
    incidentDate: '',
    incidentLocation: '',
    incidentDescription: '',
    peopleInvolved: '',
    helpNeeded: [],
    files: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);

  const update = (fields) => setReport(prev => ({ ...prev, ...fields }));
  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const submitReport = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identityType: report.identityType,
          violenceType: report.violenceType,
          incidentDate: report.incidentDate || null,
          incidentLocation: report.incidentLocation || null,
          incidentDescription: report.incidentDescription || null,
          peopleInvolved: report.peopleInvolved || null,
          helpNeeded: report.helpNeeded,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      if (report.files.length > 0) {
        for (const file of report.files) {
          const fd = new FormData();
          fd.append('file', file);
          await fetch(`/api/case/${data.caseCode}/evidence`, { method: 'POST', body: fd });
        }
      }

      setResult(data);
      setStep(8);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      {/* Minimal header with quick exit */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <img src="/images/logo.png" alt="Vugandakumva" className="w-9 h-9 rounded-full object-cover border-2 border-[#6BCB77] flex-shrink-0" />
            <span className="font-['Playfair_Display'] font-bold text-[#2E7D32] text-base truncate">Vugandakumva</span>
          </Link>
          <button
            onClick={() => window.location.replace('https://www.google.com')}
            className="flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold py-2 px-4 rounded-lg border border-red-200 flex-shrink-0"
          >
            <i className="fas fa-times-circle text-sm"></i>
            Quick Exit
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          {step < 8 && <WizardProgress step={step} />}

          {step === 1 && <StepSafetyCheck onNext={next} />}
          {step === 2 && <StepIdentity value={report.identityType} onChange={v => update({ identityType: v })} onNext={next} onBack={back} />}
          {step === 3 && <StepViolenceType value={report.violenceType} onChange={v => update({ violenceType: v })} onNext={next} onBack={back} />}
          {step === 4 && <StepIncidentDetails value={report} onChange={update} onNext={next} onBack={back} />}
          {step === 5 && <StepHelpNeeded value={report.helpNeeded} onChange={v => update({ helpNeeded: v })} onNext={next} onBack={back} />}
          {step === 6 && <StepEvidence value={report.files} onChange={v => update({ files: v })} onNext={next} onBack={back} />}
          {step === 7 && <StepSummary report={report} onNext={submitReport} onBack={back} submitting={submitting} submitError={submitError} />}
          {step === 8 && <StepConfirmation result={result} />}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 max-w-md mx-auto">
          🔒 This report is encrypted and stored securely. Your information is never sold or shared without your consent.
          For immediate danger, call <a href="tel:112" className="text-red-500 font-semibold">112</a>.
        </p>
      </main>
    </div>
  );
}
