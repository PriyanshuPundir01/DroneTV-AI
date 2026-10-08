import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  X,
  RotateCcw,
  Sparkles,
  User,
  ArrowRight,
  Loader2,
  FileText,
  AlertCircle,
  CheckCircle2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { ChatMessage, QuickQuestionItem } from '../types/chat';
import { CreateEnquiryInput } from '../types/enquiry';
import { api } from '../services/api';
import { soundFx } from '../utils/soundEffects';

interface ChatbotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onOpenEnquiryModalWithInterest?: (interest: string) => void;
}

const PREDEFINED_QUESTIONS: QuickQuestionItem[] = [
  { id: 'services', question: 'What services does DroneTV provide?' },
  { id: 'courses', question: 'What courses / training are available?' },
  { id: 'contact', question: 'How can I contact DroneTV?' },
  { id: 'register', question: 'How can I register?' },
  { id: 'service_interest', question: 'I am interested in a service.' },
  { id: 'student', question: 'I am a student.' },
  { id: 'speak', question: 'I want to speak with someone.' }
];

const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'bot',
  text:
    `👋 **Greetings from DroneTV!**\n\n` +
    `I am your **AI Support & Lead Assistant**. I can answer questions about our **DGCA-certified drone pilot training**, **aerial cinematography**, **LiDAR surveying**, and registration processes.\n\n` +
    `Choose one of the quick questions below or type your query:`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestions: [
    'What services does DroneTV provide?',
    'What courses / training are available?',
    'How can I register?',
    'I am a student.'
  ]
};

const getFreshWelcomeMessage = (): ChatMessage => ({
  id: `msg-welcome-${Date.now()}`,
  sender: 'bot',
  text:
    `👋 **Greetings from DroneTV!**\n\n` +
    `I am your **AI Support & Lead Assistant**. I can answer questions about our **DGCA-certified drone pilot training**, **aerial cinematography**, **LiDAR surveying**, and registration processes.\n\n` +
    `Choose one of the quick questions below or type your query:`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestions: [
    'What services does DroneTV provide?',
    'What courses / training are available?',
    'How can I register?',
    'I am a student.'
  ]
});

const STORAGE_KEY = 'dronetv_chat_session_history';

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
  onNavigateToSection,
  onOpenEnquiryModalWithInterest
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore parse failure
    }
    return [INITIAL_BOT_MESSAGE];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInChatForm, setShowInChatForm] = useState(false);
  const [inChatInterest, setInChatInterest] = useState('DGCA Certified Remote Pilot Training');
  const [isResetting, setIsResetting] = useState(false);
  const [resetBanner, setResetBanner] = useState(false);

  // In-chat lead capture fields
  const [leadForm, setLeadForm] = useState<CreateEnquiryInput>({
    name: '',
    email: '',
    phone: '',
    userType: 'Student',
    interest: 'DGCA Certified Remote Pilot Training',
    message: ''
  });
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist session history
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage unavailable
    }
    scrollToBottom();
  }, [messages, showInChatForm]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (textToSend === undefined) setInputText('');
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage(query);
      const data = response?.data;

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data?.reply || 'Received query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data?.suggestions,
        actions: data?.actions
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // Client-side rule evaluation fallback if network dropped
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text:
          `⚡ **DroneTV AI Response:**\n\n` +
          `Thank you for asking: "${query}". You can explore our certified drone pilot courses, book aerial cinematographers, or submit an official enquiry below. Our flight team will contact you promptly!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'What services does DroneTV provide?',
          'What courses / training are available?',
          'How can I register?'
        ]
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    soundFx.playClick(650);
    setIsResetting(true);

    const freshMsg = getFreshWelcomeMessage();
    setMessages([freshMsg]);
    setInputText('');
    setShowInChatForm(false);
    setLeadErrors({});

    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([freshMsg]));
    } catch {
      // Storage unavailable
    }

    setResetBanner(true);
    setTimeout(() => setIsResetting(false), 500);
    setTimeout(() => setResetBanner(false), 2800);
  };

  const handleActionClick = (action: { label: string; actionType: string; payload?: string }) => {
    if (action.actionType === 'navigate' && action.payload) {
      onNavigateToSection(action.payload.replace('#', ''));
    } else if (action.actionType === 'open_enquiry') {
      setShowInChatForm(true);
      if (action.payload) {
        setInChatInterest(
          action.payload === 'training'
            ? 'DGCA Certified Remote Pilot Training'
            : action.payload === 'service'
            ? 'Aerial Cinematography & Live Broadcasting'
            : 'General Enquiry'
        );
      }
    }
  };

  const handleInChatLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

    if (!leadForm.name.trim()) errs.name = 'Name is required.';
    if (!leadForm.email.trim() || !emailRegex.test(leadForm.email.trim())) {
      errs.email = 'Valid email is required.';
    }
    if (!leadForm.phone.trim() || !phoneRegex.test(leadForm.phone.trim())) {
      errs.phone = 'Valid phone is required.';
    }
    if (!leadForm.message.trim()) errs.message = 'Please include a message.';

    if (Object.keys(errs).length > 0) {
      setLeadErrors(errs);
      return;
    }

    setIsSubmittingLead(true);
    try {
      const payload: CreateEnquiryInput = {
        ...leadForm,
        interest: inChatInterest || leadForm.interest
      };

      const res = await api.createEnquiry(payload);
      if (res.success) {
        setShowInChatForm(false);
        const botSuccessMessage: ChatMessage = {
          id: `bot-lead-success-${Date.now()}`,
          sender: 'bot',
          text:
            `✅ **Enquiry Received Successfully!**\n\n` +
            `Thank you **${leadForm.name}**! Your enquiry regarding **${payload.interest}** has been registered in the DroneTV database under ID \`#${res.data._id.slice(-6)}\`.\n\n` +
            `A DroneTV flight coordinator will contact you at **${leadForm.phone}** shortly!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: [
            'What courses / training are available?',
            'What services does DroneTV provide?'
          ]
        };
        setMessages((prev) => [...prev, botSuccessMessage]);
        // Reset lead form
        setLeadForm({
          name: '',
          email: '',
          phone: '',
          userType: 'Student',
          interest: 'DGCA Certified Remote Pilot Training',
          message: ''
        });
        setLeadErrors({});
      }
    } catch (err: any) {
      setLeadErrors({
        submit: err.message || 'Error saving enquiry. Please retry.'
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <>
      {/* Floating Widget Trigger Badge */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="chatbot-trigger"
          aria-label="Open DroneTV AI Assistant"
          title="DroneTV AI Support Assistant"
        >
          <Bot size={26} />
          {/* Subtle radar ping ring */}
          <span
            style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              border: '2px solid var(--accent-cyan)',
              animation: 'pulse-subtle 2s infinite',
              pointerEvents: 'none'
            }}
          />
        </button>
      )}

      {/* Main Chatbot Flyout Panel */}
      {isOpen && (
        <div className="chatbot-panel">
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(7, 10, 19, 0.95)',
              borderBottom: '1px solid var(--border-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '2.25rem',
                  height: '2.25rem',
                  borderRadius: '8px',
                  background: 'var(--gradient-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={18} color="#070a13" />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                  DroneTV AI Assistant
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />
                  Rule-Based Engine Active
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={handleResetConversation}
                className="btn btn-secondary btn-icon btn-sm"
                title="Refresh / Reset chat history"
                aria-label="Refresh conversation history"
                style={{
                  width: '2.1rem',
                  height: '2.1rem',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <RotateCcw
                  size={15}
                  style={{
                    transition: 'transform 0.5s ease',
                    transform: isResetting ? 'rotate(-360deg)' : 'none'
                  }}
                />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary btn-icon btn-sm"
                title="Close chat window"
                aria-label="Close chat window"
                style={{ width: '2.1rem', height: '2.1rem', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Reset Banner Notification */}
          {resetBanner && (
            <div
              style={{
                padding: '0.45rem 1rem',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--accent-emerald)',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-mono)',
                animation: 'modal-appear 0.2s ease'
              }}
            >
              <CheckCircle2 size={13} />
              <span>Conversation history refreshed successfully</span>
            </div>
          )}

          {/* Chat Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backgroundColor: 'rgba(10, 14, 26, 0.6)'
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    gap: '0.35rem'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      maxWidth: '88%',
                      flexDirection: isUser ? 'row-reverse' : 'row'
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: '1.8rem',
                        height: '1.8rem',
                        borderRadius: '50%',
                        background: isUser ? 'rgba(99, 102, 241, 0.3)' : 'rgba(0, 242, 254, 0.2)',
                        border: isUser ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      {isUser ? <User size={13} color="#a5b4fc" /> : <Bot size={13} color="var(--accent-cyan)" />}
                    </div>

                    {/* Bubble */}
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        backgroundColor: isUser ? 'rgba(99, 102, 241, 0.25)' : 'rgba(19, 29, 51, 0.95)',
                        border: isUser ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                        color: '#f8fafc',
                        fontSize: '0.875rem',
                        lineHeight: 1.55,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {/* Formatted Markdown-like simple bold rendering */}
                      {msg.text.split('\n').map((line, idx) => (
                        <p key={idx} style={{ marginBottom: line.trim() ? '0.35rem' : '0.5rem' }}>
                          {line}
                        </p>
                      ))}

                      {/* Action buttons attached to message */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.65rem' }}>
                          {msg.actions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(act)}
                              style={{
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                background: 'rgba(0, 242, 254, 0.15)',
                                border: '1px solid var(--border-accent)',
                                color: 'var(--accent-cyan)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                            >
                              <span>{act.label}</span>
                              <ArrowRight size={12} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0 2.3rem' }}>
                    {msg.timestamp}
                  </span>

                  {/* Contextual Suggestions Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        marginTop: '0.3rem',
                        marginLeft: isUser ? '0' : '2.3rem',
                        maxWidth: '85%'
                      }}
                    >
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sug)}
                          style={{
                            padding: '0.3rem 0.65rem',
                            borderRadius: '9999px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          💬 {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* In-chat Lead Form Drawer (Part 3) */}
            {showInChatForm && (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  animation: 'modal-appear 0.2s ease',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={16} color="var(--accent-cyan)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                      In-Chat Enquiry Submission
                    </span>
                  </div>
                  <button
                    onClick={() => setShowInChatForm(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleInChatLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className={`form-input ${leadErrors.name ? 'has-error' : ''}`}
                      style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                    />
                    {leadErrors.name && <span style={{ fontSize: '0.7rem', color: '#fb7185' }}>{leadErrors.name}</span>}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className={`form-input ${leadErrors.email ? 'has-error' : ''}`}
                      style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                    />
                    {leadErrors.email && <span style={{ fontSize: '0.7rem', color: '#fb7185' }}>{leadErrors.email}</span>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone (+91 9876543210) *"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className={`form-input ${leadErrors.phone ? 'has-error' : ''}`}
                      style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                    />
                    {leadErrors.phone && <span style={{ fontSize: '0.7rem', color: '#fb7185' }}>{leadErrors.phone}</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <select
                      value={leadForm.userType}
                      onChange={(e) => setLeadForm({ ...leadForm, userType: e.target.value as any })}
                      className="form-select"
                      style={{ padding: '0.55rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <option value="Student">Student</option>
                      <option value="Customer">Customer</option>
                      <option value="Other">Other</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Course/Service"
                      value={inChatInterest}
                      onChange={(e) => setInChatInterest(e.target.value)}
                      className="form-input"
                      style={{ padding: '0.55rem 0.75rem', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Enquiry Message or Requirements... *"
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      className={`form-textarea ${leadErrors.message ? 'has-error' : ''}`}
                      style={{ minHeight: '60px', padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                    />
                    {leadErrors.message && <span style={{ fontSize: '0.7rem', color: '#fb7185' }}>{leadErrors.message}</span>}
                  </div>

                  {leadErrors.submit && (
                    <div style={{ fontSize: '0.75rem', color: '#fb7185', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> {leadErrors.submit}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      {isSubmittingLead ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
                      <span>Submit Enquiry</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInChatForm(false)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>
                <Loader2 size={16} className="spin" />
                <span>DroneTV Assistant is searching knowledge base...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Predefined Quick Questions Drawer */}
          <div
            style={{
              padding: '0.6rem 0.85rem',
              backgroundColor: 'rgba(7, 10, 19, 0.95)',
              borderTop: '1px solid var(--border-subtle)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              display: 'flex',
              gap: '0.4rem'
            }}
          >
            {messages.length > 1 && (
              <button
                type="button"
                onClick={handleResetConversation}
                title="Clear conversation history and start fresh"
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.35)',
                  color: '#fda4af',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <RotateCcw size={12} />
                <span>Clear History</span>
              </button>
            )}
            {PREDEFINED_QUESTIONS.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSendMessage(q.question)}
                style={{
                  padding: '0.35rem 0.7rem',
                  borderRadius: '9999px',
                  background: 'rgba(0, 242, 254, 0.08)',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {q.question}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(13, 19, 34, 0.98)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              placeholder="Type your question or choose above..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{
                flex: 1,
                padding: '0.65rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(7, 10, 19, 0.8)',
                color: '#fff',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              disabled={isLoading}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="btn btn-primary btn-sm"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                padding: 0,
                borderRadius: '8px',
                opacity: !inputText.trim() ? 0.6 : 1
              }}
              title="Send Message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
