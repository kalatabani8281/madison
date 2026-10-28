import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { HOST_CONTACT, MADISONS_UNIT } from '../data/unitData';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ExternalLink,
  Calendar,
  Phone,
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface ChatSupportProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenBooking: () => void;
}

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  checkin: `Check-in is from 2:00 PM onwards, and checkout is by 12:00 PM (Noon). If you need an early check-in or late check-out, please let Madison know in advance and we'll check room turn-around timing!`,
  pool: `Yes! Complimentary swimming pool access at Horizons 101 is included with your stay. You'll receive guest pool passes upon check-in. The pool is open Tuesdays through Sundays from 6:00 AM to 8:00 PM (Mondays reserved for routine maintenance).`,
  wifi: `We provide fast, dedicated fiber Wi-Fi in the unit with speeds up to 100 Mbps—ideal for remote work, Zoom meetings, and 4K Netflix streaming on the smart TV.`,
  guests: `The condo comfortably accommodates up to 4 guests (a queen bed plus sofa/floor bedding). A 5th guest is possible upon special request if everyone is comfortable with the cozy space. Rate includes 2 guests; extra guests are ₱500/night each.`,
  payment: `We accept QR Ph (instant scan with GCash, Maya, ShopeePay, BDO, BPI, UnionBank, etc.), direct bank transfers, or a 50% cash downpayment before check-in.`,
  monthly: `Yes! For stays longer than 28 days, Madison provides special discounted monthly rates with utility arrangement options. Send us your dates and we'll prepare a custom quote!`,
  location: `We are located inside Horizons 101, 57 General Maxilom Avenue (Mango Ave), Cebu City. We are walking distance to Mango Square, Robinson's Fuente, Cebu Doctors Hospital, and just 5–10 minutes to Ayala Center Cebu.`
};

export const ChatSupport: React.FC<ChatSupportProps> = ({
  isOpen,
  onToggle,
  onOpenBooking
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'host',
      senderName: 'Madison (Host)',
      text: `Hello and welcome to Stay at Madison's Cebu! I'm happy to help you with anything regarding our cozy Horizons 101 condo. What can I help you plan?`,
      timestamp: 'Just now',
      quickReplies: [
        'Check-in & checkout times',
        'Swimming pool access',
        'Wi-Fi speed & amenities',
        'How does QR Ph payment work?',
        'Monthly stay discounts'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Answer intelligently using real property knowledge
    setTimeout(() => {
      const lower = text.toLowerCase();
      let answer = '';

      if (lower.includes('check') || lower.includes('time') || lower.includes('arrive') || lower.includes('early')) {
        answer = KNOWLEDGE_RESPONSES.checkin;
      } else if (lower.includes('pool') || lower.includes('swim')) {
        answer = KNOWLEDGE_RESPONSES.pool;
      } else if (lower.includes('wifi') || lower.includes('internet') || lower.includes('work') || lower.includes('speed')) {
        answer = KNOWLEDGE_RESPONSES.wifi;
      } else if (lower.includes('guest') || lower.includes('pax') || lower.includes('people') || lower.includes('capacity') || lower.includes('5')) {
        answer = KNOWLEDGE_RESPONSES.guests;
      } else if (lower.includes('pay') || lower.includes('gcash') || lower.includes('maya') || lower.includes('qr') || lower.includes('bank') || lower.includes('card')) {
        answer = KNOWLEDGE_RESPONSES.payment;
      } else if (lower.includes('month') || lower.includes('long') || lower.includes('discount')) {
        answer = KNOWLEDGE_RESPONSES.monthly;
      } else if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('near') || lower.includes('ayala') || lower.includes('airport')) {
        answer = KNOWLEDGE_RESPONSES.location;
      } else if (lower.includes('book') || lower.includes('reserve') || lower.includes('date') || lower.includes('available')) {
        answer = `You can select your dates right on our live booking calendar! We'll sync it to Google Calendar and send an automated confirmation email immediately. Would you like to pick your dates now?`;
      } else {
        answer = `Thank you for asking! Stay at Madison's Cebu is located at Horizons 101 on General Maxilom Ave. Nightly rates start from ₱1,750 for 2 guests. Feel free to message Madison directly on Facebook Messenger for custom arrangements!`;
      }

      const hostMsg: ChatMessage = {
        id: `host-${Date.now()}`,
        sender: 'host',
        senderName: 'Madison (Host)',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, hostMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <aside aria-label="Host Chat Support" className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button when closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0f766e] hover:bg-[#115e59] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-white"
          aria-label="Open host chat support"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></span>
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide">
            Chat with Madison
          </span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div
          role="region"
          aria-label="Chat conversation window"
          className="w-[90vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-[#f7f4ec] rounded-2xl border border-[#ded5c2] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Chat Header */}
          <div className="bg-[#0f766e] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-serif-heading font-bold text-sm">
                  M
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0f766e]"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">Madison's Cebu Host Support</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
                  Online · Horizons 101 Host
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fbf9f4]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#787164]">
                  <span>{msg.senderName}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed max-w-[85%] ${
                    msg.sender === 'user'
                      ? 'bg-[#0f766e] text-white rounded-br-xs'
                      : 'bg-white text-[#1c1917] border border-[#e4dcce] rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Quick Reply Chips if provided */}
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(reply)}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white hover:bg-[#efe8d8] text-[#3d362b] border border-[#d8d0bd] transition-colors cursor-pointer text-left shadow-xs"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-[#e4dcce] w-16 shadow-xs">
                <span className="w-1.5 h-1.5 bg-[#0f766e] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#0f766e] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-[#0f766e] rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Footer Links */}
          <div className="px-3 py-1.5 bg-[#f0ebd9] border-t border-[#e2dbcc] flex items-center justify-between text-[11px] text-[#635b4e]">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1 text-[#0f766e] hover:underline font-semibold cursor-pointer"
            >
              <Calendar className="w-3 h-3" />
              Check Dates on Calendar
            </button>
            <a
              href={HOST_CONTACT.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0f766e] hover:underline font-semibold"
            >
              Facebook Messenger ↗
            </a>
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#e2dbcc] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about Horizons 101, dates, rules..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f7f4ec] border border-[#ded5c2] focus:outline-hidden focus:ring-1 focus:ring-[#0f766e] text-[#1c1917]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#0f766e] hover:bg-[#115e59] disabled:opacity-40 text-white transition-colors cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};
