import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Bug, 
  CheckCircle2, 
  BookOpen, 
  Network, 
  Shield, 
  Cpu, 
  Play, 
  Copy, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Award,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';
import { MarkdownView } from './MarkdownView';
import { UserSubscription } from '../types';

interface ICTStudyAssistantProps {
  subscription: UserSubscription;
  onOpenSubscriptionModal: () => void;
}

type ICTSubMode = 'explainer' | 'debugger' | 'networking' | 'quiz' | 'databases';

export const ICTStudyAssistant: React.FC<ICTStudyAssistantProps> = ({
  subscription,
  onOpenSubscriptionModal,
}) => {
  const [subMode, setSubMode] = useState<ICTSubMode>('explainer');
  const [language, setLanguage] = useState('python');
  const [codeSnippet, setCodeSnippet] = useState(
`def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

# Test array
numbers = [38, 27, 43, 3, 9, 82, 10]
print("Sorted:", quicksort(numbers))`
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizExplanation, setShowQuizExplanation] = useState<Record<number, boolean>>({});

  // Subnet calculator states
  const [ipInput, setIpInput] = useState('192.168.10.5');
  const [cidrInput, setCidrInput] = useState('24');

  const languages = [
    { id: 'python', name: 'Python 3.12' },
    { id: 'typescript', name: 'TypeScript / JS' },
    { id: 'java', name: 'Java 21' },
    { id: 'cpp', name: 'C++ 20' },
    { id: 'sql', name: 'SQL (PostgreSQL)' },
    { id: 'rust', name: 'Rust' },
    { id: 'bash', name: 'Linux Bash' },
  ];

  // Curated interactive ICT Quizzes
  const quizBank = [
    {
      question: 'Which OSI layer is responsible for end-to-end reliability, flow control, and port addressing?',
      options: [
        'Layer 2 - Data Link Layer',
        'Layer 3 - Network Layer',
        'Layer 4 - Transport Layer (TCP/UDP)',
        'Layer 7 - Application Layer',
      ],
      correctIndex: 2,
      explanation: 'The Transport Layer (Layer 4) provides transparent transfer of data between end users, using protocols like TCP for reliable delivery and UDP for fast transmission. Port numbers (0-65535) exist at this layer.',
    },
    {
      question: 'What is the Worst-Case Time Complexity of the QuickSort algorithm when the pivot is poorly chosen?',
      options: [
        'O(log n)',
        'O(n log n)',
        'O(n²)',
        'O(n)',
      ],
      correctIndex: 2,
      explanation: 'When an unbalanced partition occurs (e.g., sorting an already sorted array with the first element as pivot), QuickSort degrades to O(n²). Randomized pivots or Median-of-Three prevent this.',
    },
    {
      question: 'In relational database design, what condition MUST be met for a relation to be in 3rd Normal Form (3NF)?',
      options: [
        'It must have no composite primary keys',
        'It must be in 2NF and have no transitive dependencies on non-prime attributes',
        'All attributes must be encrypted',
        'It must have exactly three foreign keys',
      ],
      correctIndex: 1,
      explanation: '3NF requires the relation to already satisfy 2NF, and every non-key attribute must depend strictly on the primary key, directly and non-transitively (no X -> Y -> Z).',
    },
    {
      question: 'Which of the following IP address blocks is designated as RFC 1918 Private IPv4 address space?',
      options: [
        '8.8.8.0/24',
        '172.16.0.0 to 172.31.255.255',
        '127.0.0.0/8',
        '1.1.1.0/24',
      ],
      correctIndex: 1,
      explanation: 'RFC 1918 specifies three private address ranges: 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0 - 172.31.255.255), and 192.168.0.0/16.',
    },
  ];

  const handleAnalyze = async (action: 'explain' | 'debug' | 'optimize') => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ict-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          code: codeSnippet,
          language,
          question: errorMessage,
          topic: `Programming in ${language}`,
        }),
      });

      const data = await response.json();
      setAnalysisResult(data.result || data.reply || 'No analysis available.');
    } catch (err: any) {
      setAnalysisResult(`Error analyzing code: ${err?.message || 'Server communication error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick calculate IPv4 Subnetting
  const calculateSubnet = () => {
    const cidr = parseInt(cidrInput) || 24;
    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = Math.max(0, totalHosts - 2);
    const maskBits = (0xffffffff << (32 - cidr)) >>> 0;
    const subnetMask = [
      (maskBits >>> 24) & 255,
      (maskBits >>> 16) & 255,
      (maskBits >>> 8) & 255,
      maskBits & 255,
    ].join('.');

    return {
      subnetMask,
      totalHosts,
      usableHosts,
      cidr: `/${cidr}`,
      networkClass: cidr <= 8 ? 'Class A' : cidr <= 16 ? 'Class B' : 'Class C/CIDR',
    };
  };

  const subnetInfo = calculateSubnet();

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-8 py-6 bg-[#050814] text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0b1333] via-[#111942] to-[#16123d] border border-blue-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Specialized Study Hub</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                ICT & Programming Study Assistant
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Master computer science concepts, debug syntax errors with root-cause traces, compute networking subnets, and prepare for ICT certifications.
              </p>
            </div>

            {/* Sub-mode selector buttons */}
            <div className="flex flex-wrap gap-1.5 bg-[#070b1a] p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
              <button
                onClick={() => setSubMode('explainer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  subMode === 'explainer'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Code Explainer</span>
              </button>

              <button
                onClick={() => setSubMode('debugger')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  subMode === 'debugger'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bug className="w-3.5 h-3.5" />
                <span>Bug Hunter</span>
              </button>

              <button
                onClick={() => setSubMode('networking')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  subMode === 'networking'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Networks & OSI</span>
              </button>

              <button
                onClick={() => setSubMode('quiz')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  subMode === 'quiz'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Exam Quiz</span>
              </button>
            </div>
          </div>
        </div>

        {/* MODE 1: Code Explainer & Big-O Analyzer */}
        {subMode === 'explainer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#090d24] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    Source Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-[#0f173b] border border-slate-700 text-xs text-blue-300 px-3 py-1.5 rounded-lg focus:outline-none"
                  >
                    {languages.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Paste or Edit Code Snippet:
                  </label>
                  <textarea
                    rows={12}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full font-mono text-xs p-3 rounded-xl bg-[#060917] border border-slate-700/80 text-emerald-300 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleAnalyze('explain')}
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Cpu className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Explain Logic & Complexity</span>
                  </button>

                  <button
                    onClick={() => handleAnalyze('optimize')}
                    disabled={isLoading}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                    title="Optimize code"
                  >
                    Optimize
                  </button>
                </div>
              </div>

              {/* Sample Code Presets */}
              <div className="p-3.5 rounded-2xl bg-[#080d22] border border-slate-800/80 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Quick Code Samples to Test:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setLanguage('python');
                      setCodeSnippet(`def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]

print("Fib(50) =", fibonacci_memo(50))`);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
                  >
                    Dynamic Fibonacci
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('sql');
                      setCodeSnippet(`SELECT 
    d.department_name, 
    COUNT(e.id) AS total_employees,
    AVG(e.salary) AS avg_salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id
WHERE e.hire_date >= '2025-01-01'
GROUP BY d.department_name
HAVING COUNT(e.id) > 5
ORDER BY avg_salary DESC;`);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
                  >
                    SQL Aggregation & Join
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('typescript');
                      setCodeSnippet(`async function fetchWithRetry<T>(url: string, retries: number = 3): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return (await res.json()) as T;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, attempt * 1000));
    }
  }
  throw new Error("Failed after retries");
}`);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
                  >
                    TS Async Retry Pattern
                  </button>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7">
              <div className="bg-[#090d24] border border-slate-800 rounded-2xl p-5 min-h-[460px] shadow-xl flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    Eng Manuh AI Breakdown & Complexity Report
                  </h3>
                  {analysisResult && (
                    <button
                      onClick={() => navigator.clipboard.writeText(analysisResult)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Report
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400">
                      <Cpu className="w-10 h-10 text-purple-500 animate-spin" />
                      <p className="text-xs font-mono">Analyzing AST, memory buffers, and Big-O efficiency...</p>
                    </div>
                  ) : analysisResult ? (
                    <MarkdownView content={analysisResult} />
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
                      <Terminal className="w-12 h-12 text-slate-700" />
                      <p className="text-sm font-medium text-slate-400">Ready to break down your code.</p>
                      <p className="text-xs text-slate-500 max-w-sm">
                        Click "Explain Logic & Complexity" to receive a comprehensive line-by-line review, architectural notes, and runtime analysis.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: Bug Hunter & Syntax Debugger */}
        {subMode === 'debugger' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#090d24] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Bug className="w-4 h-4 text-rose-400" />
                    Broken Code Snippet
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-[#0f173b] border border-slate-700 text-xs text-blue-300 px-3 py-1.5 rounded-lg focus:outline-none"
                  >
                    {languages.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  rows={8}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="Paste buggy code here..."
                  className="w-full font-mono text-xs p-3 rounded-xl bg-[#060917] border border-slate-700/80 text-rose-300 focus:outline-none focus:border-rose-500 leading-relaxed resize-none"
                />

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Error Log / Traceback (Optional):
                  </label>
                  <input
                    type="text"
                    value={errorMessage}
                    onChange={(e) => setErrorMessage(e.target.value)}
                    placeholder="e.g. IndexError: list index out of range at line 14"
                    className="w-full text-xs p-2.5 rounded-xl bg-[#060917] border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <button
                  onClick={() => handleAnalyze('debug')}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? <Cpu className="w-4 h-4 animate-spin" /> : <Bug className="w-4 h-4" />}
                  <span>Locate Bugs & Provide Fixed Code</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-[#090d24] border border-slate-800 rounded-2xl p-5 min-h-[420px] shadow-xl flex flex-col">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Bug Diagnosis & Corrected Solution
                </h3>

                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400">
                      <Cpu className="w-10 h-10 text-rose-500 animate-spin" />
                      <p className="text-xs font-mono">Tracing memory references and syntax violations...</p>
                    </div>
                  ) : analysisResult ? (
                    <MarkdownView content={analysisResult} />
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                      <Bug className="w-10 h-10 text-slate-700" />
                      <p className="text-sm font-medium text-slate-400">No bugs inspected yet</p>
                      <p className="text-xs text-slate-500">
                        Paste your faulty code and click "Locate Bugs" to get a line-by-line fix.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: Networks & OSI & Subnet Calculator */}
        {subMode === 'networking' && (
          <div className="space-y-6">
            {/* Interactive Subnetting Tool */}
            <div className="p-5 rounded-3xl bg-[#090d24] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                    <Network className="w-5 h-5 text-blue-400" />
                    IPv4 Subnet & CIDR Calculator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Essential for ICT networking certification and network architecture design.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    IPv4 Address
                  </label>
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    className="w-full bg-[#060a17] border border-slate-700 text-sm font-mono text-blue-300 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    CIDR Prefix (/1 to /30)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={cidrInput}
                    onChange={(e) => setCidrInput(e.target.value)}
                    className="w-full bg-[#060a17] border border-slate-700 text-sm font-mono text-purple-300 px-3 py-2 rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="bg-[#060a17] border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Subnet Mask
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {subnetInfo.subnetMask}
                  </span>
                </div>

                <div className="bg-[#060a17] border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Usable Host Addresses
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-400">
                    {subnetInfo.usableHosts.toLocaleString()} hosts
                  </span>
                </div>
              </div>
            </div>

            {/* OSI 7-Layer Visual Matrix */}
            <div className="bg-[#090d24] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                <Layers className="w-5 h-5 text-indigo-400" />
                OSI 7-Layer Interactive Reference Chart
              </h3>

              <div className="space-y-2.5">
                {[
                  { num: 7, name: 'Application', proto: 'HTTP, HTTPS, DNS, SSH, FTP', pdu: 'Data', color: 'from-blue-600/30 to-blue-500/20 text-blue-300' },
                  { num: 6, name: 'Presentation', proto: 'TLS/SSL, JSON, JPEG, ASCII', pdu: 'Data', color: 'from-indigo-600/30 to-indigo-500/20 text-indigo-300' },
                  { num: 5, name: 'Session', proto: 'NetBIOS, RPC, Sockets, SIP', pdu: 'Data', color: 'from-violet-600/30 to-violet-500/20 text-violet-300' },
                  { num: 4, name: 'Transport', proto: 'TCP (reliable), UDP (fast), SCTP', pdu: 'Segment / Datagram', color: 'from-purple-600/30 to-purple-500/20 text-purple-300' },
                  { num: 3, name: 'Network', proto: 'IPv4, IPv6, ICMP, OSPF, BGP', pdu: 'Packet', color: 'from-fuchsia-600/30 to-fuchsia-500/20 text-fuchsia-300' },
                  { num: 2, name: 'Data Link', proto: 'Ethernet (802.3), Wi-Fi (802.11), MAC', pdu: 'Frame', color: 'from-emerald-600/30 to-emerald-500/20 text-emerald-300' },
                  { num: 1, name: 'Physical', proto: 'Fiber Optic, Cat6 RJ45, Radio Waves', pdu: 'Bits (0 & 1)', color: 'from-amber-600/30 to-amber-500/20 text-amber-300' },
                ].map((layer) => (
                  <div
                    key={layer.num}
                    className={`p-3 rounded-2xl bg-gradient-to-r ${layer.color} border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center font-mono font-bold text-xs text-white">
                        L{layer.num}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {layer.name} Layer
                        </h4>
                        <p className="text-[11px] text-slate-300">{layer.proto}</p>
                      </div>
                    </div>
                    <div className="text-right sm:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">PDU</span>
                      <span className="text-xs font-mono font-semibold text-white">{layer.pdu}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE 4: Interactive Exam & Quiz Simulator */}
        {subMode === 'quiz' && (
          <div className="bg-[#090d24] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
                  <Award className="w-5 h-5 text-amber-400" />
                  ICT & Computer Science Certification Simulator
                </h3>
                <p className="text-xs text-slate-400">
                  Question {activeQuizIndex + 1} of {quizBank.length}
                </p>
              </div>

              {/* Progress pills */}
              <div className="flex gap-1.5">
                {quizBank.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveQuizIndex(i)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeQuizIndex === i
                        ? 'bg-amber-500 text-black shadow-md'
                        : selectedQuizAnswers[i] !== undefined
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-900 text-slate-500'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Question Card */}
            <div className="p-5 rounded-2xl bg-[#060a18] border border-slate-800 space-y-4">
              <h4 className="text-base sm:text-lg font-bold text-slate-100">
                {quizBank[activeQuizIndex].question}
              </h4>

              <div className="space-y-2.5">
                {quizBank[activeQuizIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedQuizAnswers[activeQuizIndex] === optIdx;
                  const isAnswered = selectedQuizAnswers[activeQuizIndex] !== undefined;
                  const isCorrect = optIdx === quizBank[activeQuizIndex].correctIndex;

                  let optClass = 'bg-[#0b1029] border-slate-800 text-slate-200 hover:border-blue-500/50';

                  if (isAnswered) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                    } else if (isSelected) {
                      optClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    }
                  } else if (isSelected) {
                    optClass = 'bg-blue-900/60 border-blue-500 text-white';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        setSelectedQuizAnswers({
                          ...selectedQuizAnswers,
                          [activeQuizIndex]: optIdx,
                        });
                        setShowQuizExplanation({
                          ...showQuizExplanation,
                          [activeQuizIndex]: true,
                        });
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between ${optClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-black/40 flex items-center justify-center font-mono text-xs font-bold text-slate-400">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation box */}
              {showQuizExplanation[activeQuizIndex] && (
                <div className="p-4 rounded-xl bg-[#091133] border border-blue-500/40 text-xs sm:text-sm text-blue-200 space-y-1.5 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-blue-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Eng Manuh AI Verified Explanation:
                  </div>
                  <p className="leading-relaxed">
                    {quizBank[activeQuizIndex].explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={activeQuizIndex === 0}
                onClick={() => setActiveQuizIndex((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 disabled:opacity-40 cursor-pointer"
              >
                Previous Question
              </button>

              <button
                disabled={activeQuizIndex === quizBank.length - 1}
                onClick={() => setActiveQuizIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white disabled:opacity-40 cursor-pointer"
              >
                Next Question →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
