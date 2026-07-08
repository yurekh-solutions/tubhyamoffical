import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, User, Loader2, Volume2, VolumeX, Globe, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/config/api';
import { toast } from 'sonner';
import ainosImg from '@/assets/ainos.jpeg';

type Lang = 'en' | 'hi' | 'mr';

const LANG_LABELS: Record<Lang, string> = { en: 'English', hi: 'हिंदी', mr: 'मराठी' };

const GREETINGS: Record<Lang, string> = {
  en: "Hi! I'm ainos, Tubhyam's AI blog assistant. Ask me about fashion trends, styling tips, outfit ideas, or anything you'd like to read about!",
  hi: "नमस्ते! मैं ainos हूँ, Tubhyam की AI ब्लॉग असिस्टेंट। मुझसे फैशन ट्रेंड्स, स्टाइलिंग टिप्स, आउटफिट आइडियाज़ या कुछ भी पूछें!",
  mr: "नमस्कार! मी ainos आहे, Tubhyam ची AI ब्लॉग असिस्टंट. मला फॅशन ट्रेंड्स, स्टाइलिंग टिप्स, आउटफिट आयडियाज किंवा काहीही विचारा!"
};

const QUICK_ACTIONS: Record<Lang, { label: string; message: string }[]> = {
  en: [
    { label: 'Track Order', message: 'I want to track my order' },
    { label: 'Shipping Info', message: 'What are your shipping policies?' },
    { label: 'Return Policy', message: 'What is your return policy?' },
    { label: 'Size Guide', message: 'How do I know my size?' }
  ],
  hi: [
    { label: 'ऑर्डर ट्रैक करें', message: 'मुझे अपनी ऑर्डर ट्रैक करनी है' },
    { label: 'शिपिंग जानकारी', message: 'आपकी शिपिंग पॉलिसी क्या है?' },
    { label: 'रिटर्न पॉलिसी', message: 'आपकी रिटर्न पॉलिसी क्या है?' },
    { label: 'साइज़ गाइड', message: 'मुझे कैसे पता चलेगा मेरा साइज़?' }
  ],
  mr: [
    { label: 'ऑर्डर ट्रॅक करा', message: 'मला माझी ऑर्डर ट्रॅक करायची आहे' },
    { label: 'शिपिंग माहिती', message: 'तुमची शिपिंग पॉलिसी काय आहे?' },
    { label: 'रिटर्न पॉलिसी', message: 'तुमची रिटर्न पॉलिसी काय आहे?' },
    { label: 'साइझ गाइड', message: 'मला माझा साइझ कसा कळेल?' }
  ]
};

// Voice config per language — known female voice names per platform
const FEMALE_VOICE_NAMES: Record<Lang, string[]> = {
  en: ['heera', 'zira', 'hazel', 'susan', 'linda', 'samantha', 'victoria', 'karen', 'moira', 'fiona', 'tessa', 'google uk english female', 'google us english', 'microsoft zira', 'microsoft heera', 'microsoft online natural'],
  hi: ['kalpana', 'google हिन्दी', 'google hindi', 'microsoft kalpana', 'veena'],
  mr: ['kalpana', 'google हिन्दी', 'google hindi', 'microsoft kalpana', 'veena'],
};

const MALE_VOICE_NAMES = ['david', 'mark', 'james', 'george', 'daniel', 'alex', 'fred', 'rishi', 'male'];

const VOICE_LANG: Record<Lang, string> = {
  en: 'en',
  hi: 'hi',
  mr: 'mr'
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETINGS.en, timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance>(null);
  const latestTranscriptRef = useRef('');
  const sendToBackendRef = useRef<(text: string) => Promise<void>>();

  // Find best female voice for a language
  const getVoice = useCallback((language: Lang): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;
    const langPrefix = VOICE_LANG[language];
    const femaleNames = FEMALE_VOICE_NAMES[language];

    // 1. Exact match: known female name + matching language
    const exact = voices.find(v =>
      v.lang.startsWith(langPrefix) &&
      femaleNames.some(fn => v.name.toLowerCase().includes(fn))
    );
    if (exact) return exact;

    // 2. Known female name in any English variant (en-US, en-GB, en-IN)
    const femaleAny = voices.find(v =>
      v.lang.startsWith('en') &&
      femaleNames.some(fn => v.name.toLowerCase().includes(fn))
    );
    if (femaleAny && language === 'en') return femaleAny;

    // 3. For Hindi/Marathi: prefer hi-IN voice that is NOT male
    if (language === 'hi' || language === 'mr') {
      const hiVoice = voices.find(v =>
        v.lang.startsWith('hi') &&
        !MALE_VOICE_NAMES.some(mn => v.name.toLowerCase().includes(mn))
      );
      if (hiVoice) return hiVoice;
      // Fallback: any Hindi voice
      const anyHi = voices.find(v => v.lang.startsWith('hi'));
      if (anyHi) return anyHi;
    }

    // 4. Any voice in the language that's not male
    const notMale = voices.find(v =>
      v.lang.startsWith(langPrefix) &&
      !MALE_VOICE_NAMES.some(mn => v.name.toLowerCase().includes(mn))
    );
    if (notMale) return notMale;

    // 5. Last resort: any voice in the language
    const anyVoice = voices.find(v => v.lang.startsWith(langPrefix));
    return anyVoice || voices[0] || null;
  }, []);

  // Speak text aloud — uses Google Translate TTS for Hindi/Marathi (no native browser voices)
  const speak = useCallback((text: string, language: Lang) => {
    if (!voiceOn || typeof window === 'undefined') return;
    window.speechSynthesis?.cancel();

    // For Hindi/Marathi: use Google Translate TTS (free, female voice, no API key)
    if (language === 'hi' || language === 'mr') {
      const tl = language === 'hi' ? 'hi' : 'mr';
      // Google TTS splits text into chunks — use first 200 chars for preview
      const chunk = text.substring(0, 200);
      const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(chunk)}`);
      audio.volume = 1.0;
      audio.play().catch(() => {
        // Fallback: use best available English female voice if Google TTS is blocked
        if (window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(text);
          const voice = getVoice('en');
          if (voice) utterance.voice = voice;
          utterance.rate = 1.0;
          utterance.pitch = 1.08;
          window.speechSynthesis.speak(utterance);
        }
      });
      return;
    }

    // English: use SpeechSynthesis with female voice
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoice('en');
    if (voice) utterance.voice = voice;
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.08; // Natural professional female voice
    utterance.volume = 1.0;
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voiceOn, getVoice]);

  const sendOrSetInput = useCallback((text: string) => {
    if (!text.trim()) {
      toast(lang === 'hi' ? 'कोई आवाज़ नहीं सुनाई दी। कृपया दोबारा बोलें।' : lang === 'mr' ? 'कोणताही आवाज़ ऐकू आला नाही. कृपया पुन्हा बोला.' : "Couldn't catch that. Please try speaking again.");
      return;
    }
    setInputValue(text);
    setTimeout(() => {
      const userMessage: Message = { role: 'user', content: text.trim(), timestamp: new Date() };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);
      sendToBackendRef.current?.(text.trim());
    }, 50);
  }, [lang]);

  const sendToBackend = async (text: string) => {
    try {
      const trackKeywords = ['track', 'order', 'where is', 'delivery', 'shipment', 'tracking'];
      const hasTrackIntent = trackKeywords.some(kw => text.toLowerCase().includes(kw));
      const hasPhoneNumber = /\d{10}/.test(text);
      const action = hasTrackIntent && hasPhoneNumber ? 'track_order' : undefined;

      const response = await api.post<{ success: boolean; reply: string }>('/chat', {
        message: text,
        conversationHistory: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        action
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.reply || (lang === 'hi' ? 'माफ़ करें, मैं अभी यह प्रोसेस नहीं कर पाई। कृपया दोबारा कोशिश करें।' : lang === 'mr' ? 'माफ करा, मी आत्ता हे प्रोसेस करू शकत नाही. कृपया पुन्हा प्रयत्न करा.' : "Sorry, I couldn't process that right now. Please try again."),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      speak(assistantMessage.content, lang);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: lang === 'hi' ? 'माफ़ करें, कनेक्शन में दिक्कत है।' : lang === 'mr' ? 'माफ करा, कनेक्शन मध्ये समस्या आहे.' : "Sorry, connection issue. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      speak(errorMessage.content, lang);
    } finally {
      setIsLoading(false);
    }
  };
  sendToBackendRef.current = sendToBackend;

  // Voice input (speech-to-text)
  const initRecognition = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = VOICE_LANG[lang] === 'mr' ? 'mr-IN' : VOICE_LANG[lang] === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      latestTranscriptRef.current = transcript;
      setInputValue(transcript);
    };

    recognition.onerror = (event) => {
      if (event.error !== 'aborted') console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      const finalText = latestTranscriptRef.current;
      if (finalText.trim()) {
        sendOrSetInput(finalText);
      } else {
        toast(lang === 'hi' ? 'कोई आवाज़ नहीं सुनाई दी।' : lang === 'mr' ? 'कोणताही आवाज़ ऐकू आला नाही.' : "Didn't catch that. Try again.");
      }
      latestTranscriptRef.current = '';
    };

    recognitionRef.current = recognition;
  }, [lang, sendOrSetInput]);

  const startListening = useCallback(() => {
    stopSpeaking();
    latestTranscriptRef.current = '';
    initRecognition();
    if (!recognitionRef.current) {
      toast('Voice input not supported in this browser.');
      return;
    }
    setInputValue('');
    setIsListening(true);
    try { recognitionRef.current.start(); } catch { setIsListening(false); }
  }, [initRecognition]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  // Load voices on mount (async in some browsers)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  // Update greeting when language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ ...prev[0], content: GREETINGS[lang] }];
      }
      return prev;
    });
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    await sendToBackend(inputValue.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = QUICK_ACTIONS[lang];

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
  };

  const toggleVoice = () => {
    if (voiceOn) stopSpeaking();
    setVoiceOn(!voiceOn);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); speak(GREETINGS[lang], lang); }}
          className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-card text-card-foreground text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us!
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] shadow-2xl flex flex-col border-2 border-primary/20">
          {/* Header */}
          <CardHeader className="bg-primary text-primary-foreground p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={ainosImg} alt="AINOS" className="w-10 h-10 rounded-full object-cover border-2 border-primary-foreground/30" style={{ objectPosition: 'center 70%' }} />
                <div>
                  <CardTitle className="text-lg">ainos</CardTitle>
                  <p className="text-xs text-primary-foreground/80">AI Blog Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Language Selector */}
                <div className="relative">
                  <button onClick={() => setShowLangMenu(!showLangMenu)} className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors text-primary-foreground" title="Language">
                    <Globe className="w-4 h-4" />
                  </button>
                  {showLangMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl z-50 min-w-[120px] overflow-hidden">
                      {(['en', 'hi', 'mr'] as Lang[]).map(l => (
                        <button key={l} onClick={() => { setLang(l); setShowLangMenu(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${lang === l ? 'font-bold text-primary' : 'text-card-foreground'}`}>
                          {LANG_LABELS[l]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Voice Toggle */}
                <button onClick={toggleVoice} className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors text-primary-foreground" title={voiceOn ? 'Mute voice' : 'Enable voice'}>
                  {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                {/* Close */}
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-primary-foreground/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <img src={ainosImg} alt="AINOS" className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-primary/30" style={{ objectPosition: 'center 70%' }} />
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className={`flex items-center gap-2 mt-1`}>
                      <p className={`text-xs ${
                        message.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground/60'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {message.role === 'assistant' && voiceOn && (
                        <button onClick={() => speak(message.content, lang)} className="p-0.5 rounded hover:bg-muted-foreground/10 transition-colors" title="Listen">
                          <Volume2 className="w-3 h-3 text-muted-foreground/50" />
                        </button>
                      )}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-primary/30">
                  <img src={ainosImg} alt="AINOS" className="w-full h-full object-cover" style={{ objectPosition: 'center 70%' }} />
                </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <p className="text-xs text-muted-foreground mb-2">
                {lang === 'hi' ? 'त्वरित क्रियाएं:' : lang === 'mr' ? 'जलद क्रिया:' : 'Quick actions:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      setInputValue(action.message);
                      setTimeout(handleSendMessage, 100);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border flex-shrink-0">
            {isListening && (
              <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-500 font-medium">{lang === 'hi' ? '🎤 सुन रही हूँ... बोलें' : lang === 'mr' ? '🎤 ऐकत आहे... बोला' : '🎤 Listening... speak now'}</span>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? 'Listening... speak now' : 'Type your message...'}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={toggleListening}
                disabled={isLoading}
                size="icon"
                variant={isListening ? 'destructive' : 'outline'}
                className={`shrink-0 relative ${isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''}`}
                title={isListening ? 'Tap to stop & send' : 'Tap to speak'}
              >
                {isListening ? <Square className="w-4 h-4 fill-white" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by ainos • <a href="https://wa.me/917039382706" className="underline">WhatsApp Support</a> • {LANG_LABELS[lang]}
            </p>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIChatWidget;
