import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  RefreshCw, 
  Trash2, 
  Code, 
  BookOpen, 
  ShieldCheck, 
  FileCode, 
  HelpCircle, 
  Lightbulb,
  AlertTriangle,
  Clipboard,
  Check,
  Zap,
  Network,
  Key,
  Eye,
  EyeOff,
  Settings,
  X,
  Paperclip,
  FileImage,
  Sparkles,
  FileText
} from 'lucide-react';

export default function ChatWorkspace({ onClose }) {
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('user_gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [revealKey, setRevealKey] = useState(false);

  const [customModel, setCustomModel] = useState(() => localStorage.getItem('user_gemini_model') || 'gemini-3.5-flash');
  const [selectedPresetModel, setSelectedPresetModel] = useState(() => {
    const saved = localStorage.getItem('user_gemini_model') || 'gemini-3.5-flash';
    const presets = ['gemini-3.5-flash', 'gemini-3.5-pro', 'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash-exp'];
    return presets.includes(saved) ? saved : 'custom';
  });

  useEffect(() => {
    localStorage.setItem('user_gemini_api_key', customApiKey);
  }, [customApiKey]);

  useEffect(() => {
    localStorage.setItem('user_gemini_model', customModel);
  }, [customModel]);

  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: 'Hello! Ask right away :)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null); // { base64: string, name: string, type: string }
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'docs' | 'backend'
  const [isCopied, setIsCopied] = useState({});

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const getMimeByName = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'application/pdf';
    if (ext === 'csv') return 'text/csv';
    if (ext === 'json') return 'application/json';
    if (['txt', 'md', 'html', 'css', 'js', 'ts', 'tsx', 'jsx', 'log', 'ini', 'yaml', 'yml'].includes(ext)) return 'text/plain';
    return 'application/octet-stream';
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimeType = file.type || getMimeByName(file.name);
    const isAllowed = mimeType.startsWith('image/') || 
                      mimeType === 'application/pdf' || 
                      mimeType.startsWith('text/') || 
                      mimeType === 'application/json';

    if (!isAllowed) {
      setErrorMessage('Unsupported file type. Please upload images, PDFs, text, CSV, or JSON files.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('File size is too large (supports up to 8MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFile({
        base64: reader.result,
        name: file.name,
        type: mimeType
      });
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read selected file.');
    };
    reader.readAsDataURL(file);
    // Reset file input value so same file can be selected again
    e.target.value = '';
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      const mimeType = item.type;
      const isAllowed = mimeType.startsWith('image/') || 
                        mimeType === 'application/pdf' || 
                        mimeType.startsWith('text/') || 
                        mimeType === 'application/json';
      
      if (isAllowed) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setAttachedFile({
              base64: reader.result,
              name: file.name || `pasted-file.${mimeType.split('/')[1] || 'txt'}`,
              type: mimeType
            });
          };
          reader.onerror = () => {
            setErrorMessage('Failed to read pasted file.');
          };
          reader.readAsDataURL(file);
          e.preventDefault();
        }
        break;
      }
    }
  };

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend || isLoading) return;

    // Clear error
    setErrorMessage('');

    // Save transient copy of the attached file, then clear the input state
    const currentAttachedFile = attachedFile;
    setAttachedFile(null);

    // Append User Message to local state
    const userMessage = {
      role: 'user',
      content: textToSend,
      image: currentAttachedFile ? currentAttachedFile.base64 : undefined,
      imageMimeType: currentAttachedFile ? currentAttachedFile.type : undefined,
      fileName: currentAttachedFile ? currentAttachedFile.name : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history to send (excluding the initial greeting)
      const chatHistory = messages
        .filter((_, idx) => idx > 0) // Skip first default welcome message
        .map(msg => ({
          role: msg.role,
          content: msg.content,
          image: msg.image || undefined,
          imageMimeType: msg.imageMimeType || undefined
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
          customApiKey: customApiKey.trim() || undefined,
          model: customModel || undefined,
          image: currentAttachedFile ? { mimeType: currentAttachedFile.type, data: currentAttachedFile.base64 } : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server returned an error');
      }

      // Add AI reply to chat state
      setMessages(prev => [...prev, {
        role: 'model',
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err) {
      console.error('Chat error:', err);
      // Restore attached state if sending failed so user doesn't lose it
      if (currentAttachedFile) {
        setAttachedFile(currentAttachedFile);
      }
      setErrorMessage(err.message || 'Failed to connect to the AI service. Is your secure backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'model',
        content: 'Hello again! Chat history has been reset. What subject should we tackle next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setErrorMessage('');
  };

  const applyQuickPrompt = (prompt) => {
    setInputText(prompt);
  };

  // Quick action prompt options
  const SUGGESTED_PROMPTS = [
    { title: "Water Cycle", prompt: "Explain the steps of the water cycle like I am 12." },
    { title: "Italian Practice", prompt: "Help me practice Italian. What are the rules of Italian plural nouns?" },
    { title: "Grammar Rules", prompt: "Explain what passive voice means and give 3 examples of rewriting to active." },
    { title: "Coding Logic", prompt: "Explain how a QuickSort algorithm works conceptually." }
  ];

  const handleCopyCode = (id, text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setIsCopied(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  // Render text blocks cleanly (math, tables, bullet points, etc.)
  const renderMessageContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      // Basic Bold/Italic formatting
      const parseInline = (str) => {
        let parts = [];
        let cur = str;
        // Match bold **text**
        const boldRegex = /\*\*(.*?)\*\*/g;
        let lastIndex = 0;
        let match;
        
        while ((match = boldRegex.exec(str)) !== null) {
          const index = match.index;
          if (index > lastIndex) {
            parts.push(str.substring(lastIndex, index));
          }
          parts.push(<strong key={`b-${index}`} className="font-bold text-[var(--accent-color)]">{match[1]}</strong>);
          lastIndex = boldRegex.lastIndex;
        }
        
        if (lastIndex < str.length) {
          parts.push(str.substring(lastIndex));
        }
        
        return parts.length > 0 ? parts : str;
      };

      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="text-xs font-bold font-mono text-[var(--text-primary)] border-l-2 border-[var(--accent-color)] pl-2 mt-3 mb-1.5 uppercase">{parseInline(trimmed.replace(/^###\s*/, ''))}</h4>;
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 text-xs text-[var(--text-muted)] leading-relaxed ml-3 mb-1">
            <span className="text-[var(--accent-color)] mt-1 text-[8px]">◼</span>
            <span>{parseInline(trimmed.substring(2))}</span>
          </div>
        );
      }
      if (/^\d+\.\s*/.test(trimmed)) {
        const cleaned = trimmed.replace(/^\d+\.\s*/, '');
        return (
          <div key={idx} className="flex items-start gap-1.5 text-xs text-[var(--text-muted)] leading-relaxed ml-3 mb-1">
            <span className="font-mono text-[10px] font-bold text-[var(--accent-color)]">{trimmed.match(/^\d+/)[0]}.</span>
            <span>{parseInline(cleaned)}</span>
          </div>
        );
      }
      if (trimmed === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-[var(--text-muted)] leading-relaxed mb-1.5 last:mb-0">
          {parseInline(line)}
        </p>
      );
    });
  };

  const envExampleCode = `# .env
# Store sensitive API keys on the server. Never commit this to Git!
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE`;

  const expressSnippet = `// server.ts
import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // Convert client-side turn history format to Gemini SDK standard structure
    const contents = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are a helpful, expert companion educator tutor."
      }
    });

    res.json({ response: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`;

  const providerSwapSnippet = `// How to swap to another AI provider (e.g. OpenAI):
// 1. Install official SDK: npm i openai
// 2. Import into server.ts: import OpenAI from 'openai';
// 3. Initialize: const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// 4. Update the endpoint code:
/*
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  const messages = (history || []).map(msg => ({
    role: msg.role === 'model' ? 'assistant' : 'user',
    content: msg.content
  }));
  messages.push({ role: 'user', content: message });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,
  });

  return res.json({ response: completion.choices[0].message.content });
});
*/`;

  return (
    <div id="ai-chat-root" className="w-full flex flex-col min-h-[500px] gap-0 flex-1 animate-fade-in">
      
      {/* LEFT SECTION: Modern Chat Window (cols 7) */}
      <div className="w-full flex flex-col bg-[var(--bg-secondary)] border-b md:border border-[var(--card-border)] rounded-none shadow-none overflow-hidden min-h-[520px] flex-1">
        {/* Header toolbar */}
        <div className="p-4 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[var(--accent-color)]/10 text-[var(--accent-color)] p-2 rounded-xl overflow-hidden flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.18, 1],
                  rotate: [0, 15, -15, 0],
                  filter: ["drop-shadow(0px 0px 0px var(--accent-color))", "drop-shadow(0px 0px 5px var(--accent-color))", "drop-shadow(0px 0px 0px var(--accent-color))"]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="flex items-center justify-center"
              >
                <Sparkles className="w-4.5 h-4.5" />
              </motion.div>
            </div>
            <div>
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--text-primary)]">Gemini</h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Model Selector dropdown/input combo */}
            <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-lg px-2.5 py-1 text-[11px] font-mono shadow-sm">
              <span className="text-[9px] uppercase font-bold text-[var(--accent-color)] mr-1 md:inline-block hidden">Model:</span>
              <select
                value={selectedPresetModel}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedPresetModel(val);
                  if (val !== 'custom') {
                    setCustomModel(val);
                  }
                }}
                className="bg-transparent border-none outline-none font-bold text-[var(--accent-color)] cursor-pointer text-[10px]"
                style={{ colorScheme: 'dark' }}
              >
                <option value="gemini-3.5-flash" style={{ backgroundColor: 'var(--card-bg, #120e2e)', color: 'var(--text-primary, #ddd6fe)' }}>gemini-3.5-flash (Fast)</option>
                <option value="gemini-3.5-pro" style={{ backgroundColor: 'var(--card-bg, #120e2e)', color: 'var(--text-primary, #ddd6fe)' }}>gemini-3.5-pro (Smart)</option>
                <option value="gemini-2.5-flash" style={{ backgroundColor: 'var(--card-bg, #120e2e)', color: 'var(--text-primary, #ddd6fe)' }}>gemini-2.5-flash (Standard)</option>
                <option value="gemini-2.5-pro" style={{ backgroundColor: 'var(--card-bg, #120e2e)', color: 'var(--text-primary, #ddd6fe)' }}>gemini-2.5-pro (Logic)</option>
                <option value="gemini-2.0-flash-exp" style={{ backgroundColor: 'var(--card-bg, #120e2e)', color: 'var(--text-primary, #ddd6fe)' }}>gemini-2.0-flash-exp (Expo)</option>
                <option value="custom" style={{ backgroundColor: 'var(--card-bg, #120e2e)', color: 'var(--text-primary, #ddd6fe)' }}>Custom ID...</option>
              </select>
            </div>

            {selectedPresetModel === 'custom' && (
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="Enter model-id..."
                className="w-24 md:w-32 text-[10px] font-mono rounded-lg py-1 px-2 border border-[var(--card-border)] bg-[var(--input-fill)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                title="Type any custom Gemini model identifier string"
              />
            )}

            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wide border rounded-lg transition-all duration-150 cursor-pointer ${
                customApiKey.trim()
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                  : 'hover:bg-[var(--accent-color)]/15 text-[var(--text-muted)] hover:text-[var(--accent-color)] border-[var(--card-border)] hover:border-[var(--accent-color)]/30'
              }`}
              title="Configure Personal Gemini API Key"
              type="button"
            >
              <Key className="w-3.5 h-3.5" />
              {customApiKey.trim() ? "Key Loaded" : "Set Key"}
            </button>

            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-500 text-[10px] font-bold font-mono uppercase tracking-wide border border-[var(--card-border)] hover:border-rose-500/30 rounded-lg transition-all duration-150 cursor-pointer"
              title="Reset Conversation"
              type="button"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Chat
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-500/10 text-[var(--accent-color)] hover:text-[var(--accent-hover)] text-[10px] font-bold font-mono uppercase tracking-wide border border-[var(--card-border)] hover:border-[var(--accent-color)] rounded-lg transition-all duration-150 cursor-pointer"
                title="Close Socratic AI Tutor"
                type="button"
              >
                <X className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                Close
              </button>
            )}
          </div>
        </div>

        {/* API Key Panel Drawer */}
        {showKeyInput && (
          <div className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--card-border)] flex flex-col gap-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold font-mono tracking-wider text-[var(--accent-color)] flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Custom API Settings
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                Saved in browser LocalStorage.
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              By default, requests utilize the secure server key. You can paste your own <strong>Gemini API Key</strong> below to load quota from your account directly.
            </p>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type={revealKey ? "text" : "password"}
                  placeholder="Paste your Gemini API Key here (starts with AIzaSy...)"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  className="w-full text-xs font-mono rounded-lg py-2 pl-3 pr-9 border border-[var(--card-border)] bg-[var(--input-fill)] text-[var(--text-primary)] placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                />
                <button
                  onClick={() => setRevealKey(!revealKey)}
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  {revealKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {customApiKey && (
                <button
                  onClick={() => { setCustomApiKey(''); }}
                  className="px-2.5 py-2 text-[10px] font-bold font-mono text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-all cursor-pointer"
                  title="Clear Key"
                  type="button"
                >
                  Clear Key
                </button>
              )}
            </div>
            {customApiKey && (
              <p className="text-[9px] text-emerald-500 font-mono mt-0.5 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-500" /> API key configured! The AI tutor will use your key for all study queries.
              </p>
            )}
          </div>
        )}

        {/* Message stream area */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[55vh] md:h-[62vh] min-h-[450px] bg-[var(--bg-primary)]/30">
          
          {messages.map((msg, index) => {
            const isModel = msg.role === 'model';
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, ease: [0.215, 0.610, 0.355, 1] }}
                className={`flex gap-3 max-w-[85%] ${isModel ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Badge */}
                <div className={`w-7 h-7 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 select-none shadow-sm ${
                  isModel 
                    ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/30' 
                    : 'bg-[var(--text-primary)] text-[var(--bg-color)]'
                }`}>
                  {isModel ? 'AI' : 'ME'}
                </div>

                {/* Message Bubble Content */}
                <div className="flex flex-col gap-1">
                  <div className={`p-3.5 rounded-2xl relative border ${
                    isModel 
                      ? 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] rounded-tl-none' 
                      : 'bg-[var(--accent-color)]/10 text-[var(--text-primary)] border-[var(--accent-color)]/20 rounded-tr-none'
                  }`}>
                    {msg.image && (
                      <div className="mb-2 flex justify-center w-full">
                        {(!msg.imageMimeType || msg.imageMimeType.startsWith('image/')) ? (
                          <img 
                            src={msg.image} 
                            alt="Attached visual context" 
                            className="max-w-full sm:max-w-xs max-h-48 rounded-lg object-contain border border-[var(--card-border)] bg-black/10 mx-auto" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)]/40 border border-[var(--card-border)] w-full max-w-sm">
                            <div className="h-10 w-10 shrink-0 rounded-lg bg-[var(--accent-color)]/10 text-[var(--accent-color)] flex items-center justify-center">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <span className="text-[9px] font-bold font-mono text-[var(--accent-color)] uppercase tracking-wider block">Attachment Doc</span>
                              <span className="text-xs font-mono text-[var(--text-primary)] truncate block select-all font-semibold">{msg.fileName || 'document.pdf'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {renderMessageContent(msg.content)}
                  </div>
                  <span className={`text-[9px] font-mono text-[var(--text-muted)] px-1 ${!isModel && 'text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-3 max-w-[85%] mr-auto"
            >
              <div className="w-7 h-7 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/30 animate-pulse">
                AI
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)] rounded-tl-none flex items-center gap-1.5 min-w-[60px] justify-center">
                <motion.span 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-1.5 h-1.5 bg-[var(--accent-color)] rounded-full" 
                />
                <motion.span 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                  className="w-1.5 h-1.5 bg-[var(--accent-color)]/80 rounded-full" 
                />
                <motion.span 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                  className="w-1.5 h-1.5 bg-[var(--accent-color)]/50 rounded-full" 
                />
              </div>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs flex items-start gap-2 max-w-[95%] mx-auto"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold underline">Connection Warning</p>
                <p className="text-[11px] mt-0.5 leading-normal">{errorMessage}</p>
                <p className="text-[10px] font-mono mt-1 text-rose-400">Ensure your server-side API key is set in Settings > Secrets.</p>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>



        {/* Thumbnail Preview for attached files */}
        {attachedFile && (
          <div className="px-4 py-2 bg-[var(--bg-secondary)] border-t border-[var(--card-border)] flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              {attachedFile.type.startsWith('image/') ? (
                <img src={attachedFile.base64} alt="Attachment miniature" className="w-10 h-10 rounded border border-[var(--card-border)] object-cover" />
              ) : (
                <div className="w-10 h-10 rounded border border-[var(--card-border)] bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-[9px] font-bold font-mono text-[var(--accent-color)] uppercase block">Pending Attachment</span>
                <span className="text-[10px] font-mono text-[var(--text-primary)] truncate max-w-xs block font-semibold">{attachedFile.name}</span>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => setAttachedFile(null)} 
              className="px-2.5 py-1 text-[9px] font-bold font-mono uppercase tracking-wide bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded border border-rose-500/20 transition-all cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}

        {/* Form input controls */}
        <form 
          onSubmit={handleSendMessage}
          className="p-3 border-t border-[var(--card-border)] bg-[var(--card-bg)] flex gap-2 items-center"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,application/pdf,text/*,application/json" 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-10 w-10 shrink-0 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--accent-color)]/5 hover:border-[var(--accent-color)]/40 text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-all flex items-center justify-center cursor-pointer"
            title="Attach image or static document (PDF, TXT, CSV, JSON)"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <div className="flex-1 relative flex items-center">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onPaste={handlePaste}
              placeholder="Ask a question..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--card-border)] rounded-xl py-2.5 pl-3 pr-16 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-inner resize-none h-10 min-h-[40px] max-h-[80px] focus:outline-none focus:border-[var(--accent-color)] transition-colors leading-normal"
              rows={1}
            />
            <div className="absolute right-3 text-[9px] font-mono text-[var(--text-muted)] select-none pointer-events-none">
              ⏎ Send
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`h-10 w-10 shrink-0 rounded-xl font-bold font-mono uppercase tracking-wide text-[10px] flex items-center justify-center transition-all ${
              !inputText.trim() || isLoading
                ? 'bg-[var(--card-border)] text-[var(--text-muted)] cursor-not-allowed'
                : 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-md hover:opacity-90 active:scale-95 cursor-pointer'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
