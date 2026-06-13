import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Volume2, 
  Play, 
  Maximize2, 
  Download, 
  Globe, 
  ArrowLeft, 
  RefreshCw, 
  HelpCircle, 
  Languages, 
  Image as ImageIcon, 
  Cpu, 
  Activity, 
  Compass, 
  Clock, 
  Trash2,
  Copy,
  Check,
  Moon,
  Sun,
  Key,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Zap
} from 'lucide-react';

const SYSTEM_PROMPTS = [
  {
    title: "Quantum Physics for Kids",
    text: "Explain Quantum Physics to an 8-year-old using simple sandbox analogies.",
    icon: Sparkles,
    category: "Science"
  },
  {
    title: "Step-by-step Algebra Solver",
    text: "Show me step-by-step how to solve x^2 - 5x + 6 = 0 with a clear proof of each step.",
    icon: Cpu,
    category: "Math"
  },
  {
    title: "Draw a Retro Space Station",
    text: "A highly detailed retro 16-bit pixel-art space station orbiting a glowing purple neon planet, cosmic, vibrant colors, clean vector look.",
    icon: ImageIcon,
    category: "Art/Image"
  },
  {
    title: "Italian Audio Greeting",
    text: "Good morning class! Today we are learning beautiful Italian verbs and we will have an amazing study session together.",
    icon: Volume2,
    category: "Voice"
  },
  {
    title: "Syllable Spanish Translation",
    text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    icon: Languages,
    category: "Translation"
  }
];

const MODELS_LIST = [
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    type: "chat",
    desc: "Default fast text, great for summarization, writing, and general study help.",
    tag: "Core Model"
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro (Thinking)",
    type: "chat",
    desc: "Advanced reasoning, complex coding, mathematics, and deep STEM logic.",
    tag: "Pro reasoning"
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash Lite",
    type: "chat",
    desc: "Ultra lightweight and lightning fast answers for casual queries.",
    tag: "Instant"
  },
  {
    id: "gemini-2.5-flash-image",
    name: "Gemini 2.5 Flash Image",
    type: "image",
    desc: "Fast image generation and sketching from text descriptors.",
    tag: "Imaging"
  },
  {
    id: "gemini-3.1-flash-image",
    name: "Gemini 3.1 Flash Image HD",
    type: "image",
    desc: "Vibrant high-definition image generation supporting custom aspect ratios.",
    tag: "Vapor/HD"
  },
  {
    id: "imagen-4.0-generate-001",
    name: "Imagen 4 Pro Artistry",
    type: "image",
    desc: "Google's state-of-the-art Imagen model for photorealistic and artistic outputs.",
    tag: "Artistic"
  },
  {
    id: "gemini-3.1-flash-tts-preview",
    name: "Gemini Text-to-Speech",
    type: "tts",
    desc: "Transforms written prompt text into cheerful spoken conversational audio.",
    tag: "Spoken Voice"
  },
  {
    id: "gemini-3.5-live-translate-preview",
    name: "Gemini Core Translator",
    type: "translation",
    desc: "Translates paragraphs instantly into European, Asian, or Middle Eastern languages.",
    tag: "Translator"
  }
];

export default function GeminiSandbox({ isStandalone = false, onBackToApp }) {
  const [model, setModel] = useState("gemini-3.5-flash");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [voice, setVoice] = useState("Zephyr");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [userApiKey, setUserApiKey] = useState(() => {
    return localStorage.getItem('gemini-sandbox-user-api-key') || '';
  });

  const [showApiKey, setShowApiKey] = useState(false);

  const handleApiKeyChange = (val) => {
    setUserApiKey(val.trim());
    localStorage.setItem('gemini-sandbox-user-api-key', val.trim());
  };
  
  // Chat history state
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('gemini-sandbox-chat');
      return saved ? JSON.parse(saved) : [{
        role: 'model',
        type: 'text',
        content: "Hi there! I am your Gemini AI educational companion. Select a model below to explore high-speed text, custom image creation, text-to-speech audio synthesis, or instant translation!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }];
    } catch {
      return [];
    }
  });

  const chatEndRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('gemini-sandbox-chat', JSON.stringify(messages));
    } catch (e) {
      // Ignore storage errors in sandbox
    }
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle setting model and pre-filling details
  const currentModelInfo = MODELS_LIST.find(m => m.id === model) || MODELS_LIST[0];

  const handleLaunchAboutBlank = () => {
    const targetUrl = "about:blank";
    const win = window.open(targetUrl, "_blank");
    if (!win) {
      alert("Popup blocked! Please allow popups to open the Gemini AI Sandbox cloaked.");
      return;
    }

    // Embed current route with isStandalone query parameter to trigger pure Gemini sandbox mode
    const iframeSrc = `${window.location.origin}${window.location.pathname}?view=gemini-only${window.location.hash}`;
    const googleClassroomFavicon = "https://ssl.gstatic.com/classroom/favicon.png";
    const title = "Home - Classroom";

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <link rel="icon" type="image/png" href="${googleClassroomFavicon}">
        <meta charset="utf-8">
        <style>
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #0c0a09; }
          iframe { width: 100vw; height: 100vh; border: none; display: block; }
        </style>
      </head>
      <body>
        <iframe src="${iframeSrc}" allow="fullscreen" referrerpolicy="no-referrer"></iframe>
      </body>
      </html>
    `);
    win.document.close();
  };

  const handleClearHistory = () => {
    const initialMsg = [{
      role: 'model',
      type: 'text',
      content: `Chat cleared. Ready for your next query using ${currentModelInfo.name}.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
    setMessages(initialMsg);
  };

  const executeGeminiCall = async (userPromptText) => {
    if (!userPromptText.trim()) return;

    // Build the user message bubble
    const userMsg = {
      role: 'user',
      type: currentModelInfo.type,
      content: userPromptText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      meta: currentModelInfo.name
    };

    setMessages(prev => [...prev, userMsg]);
    setPrompt("");
    setIsLoading(true);

    // Set interactive loading descriptions based on mode
    let loadMsg = "Gemini is analyzing details...";
    if (currentModelInfo.type === 'image') loadMsg = `Prompting ${currentModelInfo.name} to paint canvas...`;
    else if (currentModelInfo.type === 'tts') loadMsg = "Compiling text and synthesizing vocal wave guides...";
    else if (currentModelInfo.type === 'translation') loadMsg = `Translating vocabulary into ${targetLanguage}...`;
    setLoadingMsg(loadMsg);

    try {
      // Build conversation contents context to preserve memory for standard chats
      const historyContents = [];
      const relevantMsgs = messages.slice(-10); // Lookback limit
      for (const m of relevantMsgs) {
        if (m.type === 'text') {
          historyContents.push({
            role: m.role,
            parts: [{ text: m.content }]
          });
        }
      }
      historyContents.push({
        role: 'user',
        parts: [{ text: userPromptText }]
      });

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          prompt: userPromptText,
          contents: currentModelInfo.type === 'chat' ? historyContents : undefined,
          mode: currentModelInfo.type,
          voice: voice,
          targetLanguage: targetLanguage,
          userApiKey: userApiKey
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server status ${response.status}`);
      }

      const data = await response.json();

      let answerMsg = {
        role: 'model',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: currentModelInfo.type,
        content: data.text || ""
      };

      if (currentModelInfo.type === 'image' && data.image) {
        answerMsg.type = 'image';
        answerMsg.imageUrl = data.image; // dataUri payload
      } else if (currentModelInfo.type === 'tts' && data.audio) {
        answerMsg.type = 'audio';
        answerMsg.audioUrl = data.audio; // dataUri wave audio
      }

      setMessages(prev => [...prev, answerMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'model',
        type: 'text',
        content: `❌ Error: ${err.message || 'Call failed. Make sure your GEMINI_API_KEY is configured in Settings > Secrets panel.'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      setLoadingMsg("");
    }
  };

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300 overflow-hidden font-sans">
      
      {/* Top Banner Control Panel */}
      <div className="border-b border-[var(--card-border)] bg-[var(--bg-secondary)] p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-sm z-10 transition-colors">
        
        <div className="flex items-center gap-3">
          {!isStandalone && (
            <button
              onClick={onBackToApp}
              className="p-2 rounded-full cursor-pointer hover:bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent-color)] text-[var(--accent-color)] active:scale-95 transition-all"
              title="Return to Study Workspaces"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] animate-pulse">
              <Bot className="w-5.5 h-5.5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-1.5 leading-none">
                <span>Gemini AI Academic Center</span>
                <span className="text-[10px] uppercase font-mono tracking-widest bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/30 px-2 py-0.5 rounded-full font-black">
                  SANDBOX
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium mt-1">Multi-modal playground with history hiding overlays</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3.5 w-full lg:w-auto">
          {/* Models Choice select */}
          <div className="flex items-center bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full px-3 py-1.5 text-xs text-[var(--text-muted)] font-mono shadow-sm">
            <span className="text-[10px] uppercase font-black text-[var(--accent-color)] mr-2">Engine:</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-[var(--text-primary)] cursor-pointer py-0.5"
            >
              {MODELS_LIST.map((m) => (
                <option key={m.id} value={m.id} className="bg-[var(--card-bg)] text-[var(--text-primary)]">
                  {m.name} ({m.tag})
                </option>
              ))}
            </select>
          </div>

          {/* Suffix Sinker option */}
          <button
            onClick={handleLaunchAboutBlank}
            className="text-xs bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/30 hover:border-[var(--accent-color)] py-2 px-4 rounded-full font-bold flex items-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm ml-auto lg:ml-0"
            title="Launch completely invisible Gemini AI Chat session in about:blank container tab to bypass web trackers"
          >
            <Globe className="w-4 h-4 animate-spin-slow" />
            <span>CLOAK IN ABOUT:BLANK</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* Left Side: Parameters, Quick Prompts and Info */}
        <div className="w-full lg:w-80 border-r border-[var(--card-border)] bg-[var(--bg-secondary)] overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin transition-colors">
          
          <div className="p-3.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl">
            <h3 className="text-xs font-black uppercase text-[var(--accent-color)] tracking-wider mb-1">Active Engine Details</h3>
            <p className="text-xs font-semibold">{currentModelInfo.name}</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-relaxed">{currentModelInfo.desc}</p>
            
            {/* Conditional Input Parameters per Model type */}
            {currentModelInfo.type === 'tts' && (
              <div className="mt-4 border-t border-[var(--card-border)]/50 pt-3 flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Select Voice Tone:</label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full bg-[var(--input-fill)] border border-[var(--card-border)] rounded-lg p-1.5 text-xs text-[var(--text-primary)] cursor-pointer"
                >
                  <option value="Zephyr">Zephyr (Warm)</option>
                  <option value="Puck">Puck (Cheerful)</option>
                  <option value="Charon">Charon (Professional)</option>
                  <option value="Kore">Kore (Clear Reader)</option>
                  <option value="Fenrir">Fenrir (Deep Vocal)</option>
                </select>
              </div>
            )}

            {currentModelInfo.type === 'translation' && (
              <div className="mt-4 border-t border-[var(--card-border)]/50 pt-3 flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Target Language:</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-[var(--input-fill)] border border-[var(--card-border)] rounded-lg p-1.5 text-xs text-[var(--text-primary)] cursor-pointer select-none"
                >
                  <option value="Spanish">Spanish 🇪🇸</option>
                  <option value="French">French 🇫🇷</option>
                  <option value="German">German 🇩🇪</option>
                  <option value="Italian">Italian 🇮🇹</option>
                  <option value="Japanese">Japanese 🇯🇵</option>
                  <option value="Chinese">Chinese 🇨🇳</option>
                  <option value="Arabic">Arabic 🇸🇦</option>
                  <option value="Hindi">Hindi 🇮🇳</option>
                </select>
              </div>
            )}
          </div>

          {/* Custom API Key Configurator and Helpers */}
          <div className="flex flex-col gap-4">
            {/* Action Title */}
            <div className="border-t border-[var(--card-border)]/50 pt-3">
              <h4 className="text-xs font-black uppercase text-[var(--accent-color)] tracking-wider mb-2 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-violet-500 animate-pulse" />
                <span>Custom API Key Code</span>
              </h4>
              
              <div className="p-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl flex flex-col gap-2.5 select-text shadow-inner">
                <div className="text-[10px] leading-relaxed text-[var(--text-muted)]">
                  {userApiKey ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Active: Using Custom Credentials
                    </span>
                  ) : (
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 animate-bounce-slow" />
                      Fallback: Using Default Shared Key
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={userApiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="Enter AI Studio API Key..."
                    className="w-full bg-[var(--input-fill)] border border-[var(--card-border)] focus:border-violet-500 rounded-lg p-2 pr-12 text-xs font-mono text-[var(--text-primary)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(p => !p)}
                    className="absolute right-2 top-1.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[10px] font-bold cursor-pointer hover:bg-[var(--text-primary)]/5 rounded select-none"
                  >
                    {showApiKey ? "HIDE" : "SHOW"}
                  </button>
                </div>

                {userApiKey && (
                  <button
                    onClick={() => handleApiKeyChange('')}
                    className="text-[10px] font-mono font-bold text-red-500 hover:underline cursor-pointer bg-red-500/5 hover:bg-red-500/10 py-1 px-2 rounded border border-red-500/10 self-start transition-colors"
                  >
                    Reset to default key
                  </button>
                )}
              </div>
            </div>

            {/* How to acquire free credentials guide */}
            <div className="border-t border-[var(--card-border)]/50 pt-3">
              <h4 className="text-xs font-black uppercase text-[var(--text-muted)] tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-violet-400" />
                <span>How to Get your Free Key</span>
              </h4>
              <div className="p-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl flex flex-col gap-2.5 select-text text-left">
                <div className="text-[10.5px] text-violet-400 bg-violet-400/5 border border-violet-400/15 p-3 rounded-lg leading-relaxed shadow-sm">
                  💡 <span className="font-semibold text-violet-300">tharaniidaranthamizhmani@gmail.com</span>, follow these direct steps to instantly get your own key for higher quotas:
                </div>
                
                <ol className="text-[10px] text-[var(--text-muted)] list-decimal pl-3.5 space-y-2 leading-normal">
                  <li>Navigate to official <span className="font-semibold text-[var(--text-primary)]">Google AI Studio</span>.</li>
                  <li>In the top toolbar, click <span className="font-bold text-[var(--text-primary)]">Get API Key</span>.</li>
                  <li>Click <span className="font-bold text-[var(--text-primary)]">Create API Key</span>, pick or start a Cloud project, and copy your token paste-ready above.</li>
                </ol>
                
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600 hover:to-indigo-600 text-violet-400 hover:text-white border border-violet-500/30 hover:border-violet-500 text-xs font-bold font-mono py-1.5 px-3 rounded-lg text-center flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <span>AI Studio Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--card-border)]/50 pt-3 mt-4">
            <button
              onClick={handleClearHistory}
              className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              title="Wipe and clear complete chat history logs"
            >
              <Trash2 className="w-4 h-4" />
              <span>CLEAN CHAT SESSION</span>
            </button>
          </div>
        </div>

        {/* Right Side: Dynamic Chat Interface */}
        <div className="flex-1 flex flex-col bg-[var(--bg-color)] relative overflow-hidden min-w-0">
          
          {/* Chat scrolling log */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-thin flex flex-col gap-4">
            {messages.map((m, idx) => {
              const isUser = m.role === 'user';
              return (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isUser ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}
                >
                  <div className={`p-2 rounded-xl border h-fit ${
                    isUser 
                      ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)] border-[var(--accent-color)]/30 shadow-sm' 
                      : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] shadow-sm'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1 justify-start">
                      <span className="text-[10px] font-mono font-extrabold uppercase opacity-40">{isUser ? 'Student User' : 'Gemini AI'}</span>
                      <span className="text-[9px] font-mono opacity-30">{m.time}</span>
                      {m.meta && (
                        <span className="text-[8px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 py-0.2 rounded uppercase">
                          {m.meta}
                        </span>
                      )}
                    </div>

                    <div className={`p-4 rounded-2xl shadow-sm text-sm border font-medium ${
                      isUser 
                        ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)]' 
                        : m.isError 
                        ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                        : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)]'
                    }`}>
                      {/* Standard text messages */}
                      {m.type === 'text' && (
                        <p className="whitespace-pre-wrap leading-relaxed select-text">{m.content}</p>
                      )}

                      {/* Imaging models */}
                      {m.type === 'image' && (
                        <div className="flex flex-col gap-3">
                          <p className="font-semibold">{m.content}</p>
                          {m.imageUrl ? (
                            <div className="relative group overflow-hidden rounded-xl border border-[var(--card-border)] bg-black/40">
                              <img 
                                src={m.imageUrl} 
                                alt="Generated visual" 
                                className="max-w-full h-auto max-h-[350px] object-contain mx-auto"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                                <a 
                                  href={m.imageUrl} 
                                  download={`gemini-${idx}.png`}
                                  className="p-2 bg-[var(--accent-color)] text-[var(--bg-color)] rounded-full hover:scale-110 active:scale-95 transition-all text-xs font-bold"
                                  title="Download compiled image artifact file"
                                >
                                  <Download className="w-5 h-5" />
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="h-44 flex items-center justify-center bg-black/10 rounded-xl border border-dashed border-[var(--card-border)]">
                              <span className="text-xs text-[var(--text-muted)]">No image data payload retrieved</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TTS Voice models */}
                      {m.type === 'audio' && (
                        <div className="flex flex-col gap-3 select-none">
                          <p className="font-semibold italic">"{m.content || prompt}"</p>
                          {m.audioUrl ? (
                            <div className="bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-xl p-3 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <Volume2 className="w-5 h-5 text-[var(--accent-color)] animate-pulse" />
                                <div>
                                  <span className="text-xs font-mono font-bold block">Synthesized Voice</span>
                                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Format: 24kHz Stereo Wave</span>
                                </div>
                              </div>
                              <audio 
                                controls 
                                src={m.audioUrl} 
                                className="h-9 w-full max-w-[200px]"
                              />
                            </div>
                          ) : (
                            <div className="text-xs text-red-400">Audio initialization failed.</div>
                          )}
                        </div>
                      )}

                      {/* Translator direct block */}
                      {m.type === 'translation' && (
                        <div className="flex flex-col gap-1 select-text">
                          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">Professional Translation Output:</span>
                          <p className="font-mono text-base font-bold text-[var(--accent-color)]">{m.content}</p>
                        </div>
                      )}
                    </div>

                    {/* Copy/Feedback line */}
                    {!isUser && m.type === 'text' && (
                      <div className="flex justify-end mt-1">
                        <button
                          onClick={() => handleCopyText(m.content, idx)}
                          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-color)] flex items-center gap-1 bg-[var(--card-bg)] px-2 py-1 rounded border border-[var(--card-border)] select-none transition-colors"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-green-500" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Glowing loading ring inside chat */}
            {isLoading && (
              <div className="mr-auto flex gap-3 max-w-[75%] items-start animate-fade-in">
                <div className="p-2 rounded-xl bg-indigo-600 animate-spin whitespace-nowrap">
                  <RefreshCw className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-4 rounded-2xl shadow-sm text-xs text-[var(--text-muted)] flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-ping" />
                    <span className="font-semibold font-mono tracking-wide">{loadingMsg}</span>
                  </div>
                  <div className="w-48 bg-[var(--bg-secondary)] h-1 rounded-full overflow-hidden">
                    <div className="bg-[var(--accent-color)] h-full w-[45%] animate-pulse" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick instructions indicator */}
          <div className="px-4 py-1 border-t border-[var(--card-border)] bg-[var(--bg-secondary)] text-[10px] text-[var(--text-muted)] flex justify-between font-mono">
            <span>Powered by @google/genai SDK Integration</span>
            <span>Target: {currentModelInfo.name}</span>
          </div>

          {/* Bottom Prompt send form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              executeGeminiCall(prompt);
            }}
            className="p-4 border-t border-[var(--card-border)] bg-[var(--bg-secondary)] flex gap-3 items-center"
          >
            <input
              type="text"
              placeholder={
                currentModelInfo.type === 'image' 
                  ? "Describe the illustration you want to generate details for..." 
                  : currentModelInfo.type === 'tts' 
                  ? "What should the voice cheerfully say to the students?" 
                  : currentModelInfo.type === 'translation'
                  ? "Input educational phrase to translate instantly..."
                  : "How can I help you study or program today?"
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-[var(--input-fill)] border border-[var(--card-border)] text-sm rounded-full py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-[var(--text-primary)] placeholder:opacity-50 shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="p-3 rounded-full bg-[var(--accent-color)] text-[var(--bg-color)] border border-[var(--card-border)] hover:scale-105 hover:bg-opacity-90 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center h-10 w-10 shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

        </div>
        
      </div>

    </div>
  );
}
