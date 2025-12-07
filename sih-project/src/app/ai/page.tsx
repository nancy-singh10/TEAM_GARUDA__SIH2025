"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, Volume2, VolumeX, Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ModeToggle } from "../components/ModeToggle";

// Inline cn utility to avoid import issues
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// 1. Import ReactMarkdown and remarkGfm
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
};

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hello! I'm your Energy Assistant. How can I help you optimize your campus energy today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setIsSpeaking(false);
      audioRef.current.onerror = () => setIsSpeaking(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // TTS function with API fallback to browser TTS
  const speakText = async (text: string, lang: string = selectedLanguage) => {
    // Remove markdown syntax for cleaner speech
    const cleanText = text
      .replace(/[#*_`\[\]]/g, "")
      .replace(/\n+/g, ". ")
      .trim();

    if (!cleanText) return;

    setIsSpeaking(true);

    try {
      // Try API first
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanText,
          languageCode: lang,
        }),
      });

      const data = await response.json();

      // Check if we should use browser TTS
      if (data.useBrowserTTS || !data.audioContent) {
        // Use browser's Web Speech API with better voice selection
        useBrowserTTS(cleanText, lang);
      } else {
        // Use API audio
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.src = "";

        const audioBlob = await fetch(`data:audio/mpeg;base64,${data.audioContent}`).then(r => r.blob());
        const audioUrl = URL.createObjectURL(audioBlob);

        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("TTS Error, falling back to browser:", error);
      // Fallback to browser TTS
      useBrowserTTS(cleanText, lang);
    }
  };

  // Browser-based TTS with improved voice selection
  const useBrowserTTS = (text: string, lang: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    // Find the best voice for the language
    let selectedVoice = voices.find(voice => voice.lang === lang);

    // Fallback: try to find any voice that starts with the language code
    if (!selectedVoice) {
      const langCode = lang.split("-")[0];
      selectedVoice = voices.find(voice => voice.lang.startsWith(langCode));
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    // Stop audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    // Stop browser speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleAutoSpeak = () => {
    setAutoSpeak(!autoSpeak);
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  // Language options for TTS
  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "hi-IN", name: "हिन्दी (Hindi)" },
    { code: "bn-IN", name: "বাংলা (Bengali)" },
    { code: "ta-IN", name: "தமிழ் (Tamil)" },
    { code: "te-IN", name: "తెలుగు (Telugu)" },
    { code: "mr-IN", name: "मराठी (Marathi)" },
    { code: "es-ES", name: "Español (Spanish)" },
    { code: "fr-FR", name: "Français (French)" },
    { code: "de-DE", name: "Deutsch (German)" },
    { code: "ja-JP", name: "日本語 (Japanese)" },
    { code: "zh-CN", name: "中文 (Chinese)" },
    { code: "ar-XA", name: "العربية (Arabic)" },
    { code: "pt-BR", name: "Português (Portuguese)" },
    { code: "ru-RU", name: "Русский (Russian)" },
    { code: "ko-KR", name: "한국어 (Korean)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: history,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(response.statusText || "Failed to fetch response");
      }

      const aiMessageId = (Date.now() + 1).toString();
      const aiMessagePlaceholder: Message = {
        id: aiMessageId,
        role: "ai",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessagePlaceholder]);
      setIsLoading(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let fullContent = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        fullContent += chunkValue;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: msg.content + chunkValue }
              : msg
          )
        );
      }

      // Auto-speak the complete AI response
      if (autoSpeak && fullContent) {
        setTimeout(() => speakText(fullContent), 300);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsLoading(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I apologize, but I encountered an error processing your request. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full relative">
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Energy AI Assistant</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Powered by Garuda AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm">
              <Languages size={16} className="text-slate-600 dark:text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300 hidden sm:inline">
                {languages.find(l => l.code === selectedLanguage)?.name || "English"}
              </span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
                    selectedLanguage === lang.code && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-speak Toggle */}
          <button
            onClick={toggleAutoSpeak}
            className={cn(
              "p-2 rounded-lg transition-all",
              autoSpeak
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            )}
            title={autoSpeak ? "Auto-speak enabled" : "Auto-speak disabled"}
          >
            {autoSpeak ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {/*<ModeToggle />*/}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex gap-4 max-w-3xl",
                message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-emerald-600 text-white"
                )}
              >
                {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  "p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden",
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none"
                )}
              >
                {/* 2. React Markdown Implementation */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Override HTML elements to style them correctly within the bubble
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => <span className="font-bold">{children}</span>,
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match && !String(children).includes("\n");
                      return isInline ? (
                        <code className={cn("px-1 py-0.5 rounded text-xs font-mono", message.role === "user" ? "bg-blue-700 text-white" : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200")}>
                          {children}
                        </code>
                      ) : (
                        <div className="relative my-4 rounded-lg overflow-hidden bg-slate-950 text-slate-50 border border-slate-800">
                          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                            {match ? match[1] : "code"}
                          </div>
                          <pre className="p-4 overflow-x-auto text-xs md:text-sm font-mono scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>

                <div className="flex items-center justify-between mt-2">
                  <div
                    className={cn(
                      "text-[10px] opacity-70",
                      message.role === "user" ? "text-blue-100" : "text-slate-400"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {message.role === "ai" && message.content && (
                    <button
                      onClick={() => isSpeaking ? stopSpeaking() : speakText(message.content)}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title={isSpeaking ? "Stop speaking" : "Read aloud"}
                    >
                      {isSpeaking ? (
                        <VolumeX size={14} className="text-slate-500 dark:text-slate-400" />
                      ) : (
                        <Volume2 size={14} className="text-slate-500 dark:text-slate-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 mr-auto max-w-3xl"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              <span className="text-sm text-slate-500">Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 md:p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 dark:to-transparent sticky bottom-0">
        <form
          onSubmit={handleSubmit}
          className="relative max-w-4xl mx-auto flex items-center gap-2"
        >
          <div className="relative flex-1 group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about energy optimization, consumption trends..."
              className="w-full p-4 pr-12 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-lg text-slate-900 dark:text-white placeholder:text-slate-400"
              disabled={isLoading || input.length > 2000}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}