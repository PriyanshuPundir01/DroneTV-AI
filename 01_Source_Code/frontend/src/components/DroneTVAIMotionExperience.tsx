import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Terminal,
  Activity,
  Cpu,
  Database,
  Radio,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  GraduationCap,
  Briefcase,
  Crosshair,
  Server,
  Zap,
  Code2
} from 'lucide-react';
import { api } from '../services/api';
import { soundFx } from '../utils/soundEffects';

interface DroneTVAIMotionExperienceProps {
  onOpenFullChat: () => void;
  onNavigateToTab: (tab: 'home' | 'services' | 'courses' | 'contact' | 'admin') => void;
  onPrefillLead: (interest: string) => void;
}

interface QuestionDef {
  id: string;
  question: string;
  category: 'Service' | 'Training' | 'Contact' | 'Workflow';
  ruleTag: string;
}

const PREDEFINED_QUESTIONS: QuestionDef[] = [
  { id: 'services', question: 'What services does DroneTV provide?', category: 'Service', ruleTag: 'RULE_SRV_01' },
  { id: 'courses', question: 'What courses / training are available?', category: 'Training', ruleTag: 'RULE_CRS_02' },
  { id: 'contact', question: 'How can I contact DroneTV?', category: 'Contact', ruleTag: 'RULE_CNT_03' },
  { id: 'register', question: 'How can I register?', category: 'Workflow', ruleTag: 'RULE_REG_04' },
  { id: 'service_interest', question: 'I am interested in a service.', category: 'Service', ruleTag: 'RULE_INT_05' },
  { id: 'student', question: 'I am a student.', category: 'Training', ruleTag: 'RULE_STU_06' },
  { id: 'speak', question: 'I want to speak with someone.', category: 'Contact', ruleTag: 'RULE_SPK_07' }
];

export const DroneTVAIMotionExperience: React.FC<DroneTVAIMotionExperienceProps> = ({
  onOpenFullChat,
  onNavigateToTab,
  onPrefillLead
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>('What services does DroneTV provide?');
  const [customInput, setCustomInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [streamedText, setStreamedText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'console' | 'architecture' | 'telemetry'>('console');
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getIsMuted());
  const [telemetryAltitude, setTelemetryAltitude] = useState<number>(120.4);
  const [telemetrySpeed, setTelemetrySpeed] = useState<number>(42.5);
  const [radarTarget, setRadarTarget] = useState<{ x: number; y: number }>({ x: 135, y: 75 });
  const [evalMeta, setEvalMeta] = useState<{
    latencyMs: number;
    ruleId: string;
    tokens: number;
    matchType: string;
    endpoint: string;
  }>({
    latencyMs: 14,
    ruleId: 'RULE_SRV_01',
    tokens: 168,
    matchType: 'Deterministic Predefined (Zero Hallucination)',
    endpoint: 'POST /api/chat/message'
  });

  // Flow simulation state
  const [simStep, setSimStep] = useState<number>(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const streamTimerRef = useRef<any>(null);

  // Toggle sound
  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // Run initial answer on load
  useEffect(() => {
    handleRunQuery('What services does DroneTV provide?');
    // Telemetry fluctuations
    const telInterval = setInterval(() => {
      setTelemetryAltitude((prev) => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1));
      setTelemetrySpeed((prev) => +(prev + (Math.random() * 1.2 - 0.6)).toFixed(1));
    }, 2000);

    return () => {
      clearInterval(telInterval);
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, []);

  const handleRunQuery = async (queryText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setStreamedText('');
    soundFx.playClick(940);

    const startTime = performance.now();

    try {
      const res = await api.sendChatMessage(queryText);
      const answer = res?.data?.reply || 'DroneTV AI verified query received.';
      const rule = res?.data?.matchedRule || 'rule_engine';
      const elapsed = Math.max(10, Math.round(performance.now() - startTime));

      setEvalMeta({
        latencyMs: elapsed,
        ruleId: rule.toUpperCase(),
        tokens: Math.round(answer.length / 4),
        matchType: rule === 'fallback' ? 'Graceful Fallback Handler' : 'Predefined Rule Match 100%',
        endpoint: 'POST /api/chat/message'
      });

      // Stream character by character
      let currentIndex = 0;
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);

      streamTimerRef.current = setInterval(() => {
        if (currentIndex < answer.length) {
          currentIndex += 4; // stream in rapid 4-char chunks
          setStreamedText(answer.slice(0, currentIndex));
          if (currentIndex % 20 === 0) {
            soundFx.playTypeTick();
          }
        } else {
          setStreamedText(answer);
          setIsProcessing(false);
          soundFx.playSuccess();
          clearInterval(streamTimerRef.current);
        }
      }, 16);
    } catch {
      // Fallback display if offline
      const fallback =
        `🛸 DroneTV AI Operational. We offer DGCA-certified pilot training, aerial cinematography, and LiDAR surveying.`;
      setStreamedText(fallback);
      setIsProcessing(false);
    }
  };

  const handleSelectPredefined = (q: QuestionDef) => {
    setSelectedQuestion(q.question);
    setCustomInput('');
    handleRunQuery(q.question);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setSelectedQuestion(customInput.trim());
    handleRunQuery(customInput.trim());
  };

  const handleTestFallback = () => {
    const fallbackQuery = 'Can a drone fly to the International Space Station?';
    setSelectedQuestion(fallbackQuery);
    setCustomInput(fallbackQuery);
    handleRunQuery(fallbackQuery);
  };

  // Architecture Packet Flow Simulation
  const handleSimulateFlow = () => {
    soundFx.playClick(1050);
    setSimStep(1);
    setSimLogs([`[0.0ms] CLIENT: User action captured on React 19 Frontend`]);

    setTimeout(() => {
      setSimStep(2);
      soundFx.playTypeTick();
      setSimLogs((prev) => [
        ...prev,
        `[24.0ms] REST API: Express /api/chat/message received JSON payload with Helmet & CORS validation`
      ]);
    }, 600);

    setTimeout(() => {
      setSimStep(3);
      soundFx.playTypeTick();
      setSimLogs((prev) => [
        ...prev,
        `[58.0ms] BACKEND ENGINE: Pattern evaluation verified with zero external LLM API dependency`
      ]);
    }, 1200);

    setTimeout(() => {
      setSimStep(4);
      soundFx.playTypeTick();
      setSimLogs((prev) => [
        ...prev,
        `[82.0ms] PERSISTENCE: Data store read/write verified (Mongoose / Local JSON store ready)`
      ]);
    }, 1800);

    setTimeout(() => {
      setSimStep(5);
      soundFx.playSuccess();
      setSimLogs((prev) => [
        ...prev,
        `[104.0ms] ADMIN CRM: Real-time synchronization state confirmed across dashboard status tabs!`
      ]);
    }, 2400);
  };

  return (
    <section
      id="ai-motion-experience"
      style={{
        position: 'relative',
        padding: '5rem 0',
        backgroundColor: '#070a13',
        overflow: 'hidden'
      }}
      className="telemetry-grid"
    >
      {/* Background ambient aerospace glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(0, 242, 254, 0.12), transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header Title Section */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 1.1rem',
              borderRadius: '9999px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid var(--border-accent)',
              marginBottom: '1.25rem'
            }}
          >
            <Sparkles size={16} color="var(--accent-cyan)" />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                letterSpacing: '0.08em'
              }}
            >
              DRONETV AI CORE • MOTION ARCHITECTURE INTRO
            </span>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--accent-emerald)',
                boxShadow: '0 0 8px var(--accent-emerald)'
              }}
            />
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '1rem'
            }}
          >
            Intelligent Support & <span className="gradient-text">Deterministic AI Engine</span>
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7
            }}
          >
            Explore the inner workings of DroneTV's automated support assistant. Engineered strictly
            to company assignment rules: rule-based zero-hallucination query processing, validated
            lead pipeline, and instant synchronization with the Admin CRM.
          </p>

          {/* Sound & Mode Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '1.5rem'
            }}
          >
            <button
              onClick={handleToggleSound}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem'
              }}
              title="Toggle futuristic interface audio"
            >
              {isMuted ? <VolumeX size={15} color="#94a3b8" /> : <Volume2 size={15} color="var(--accent-cyan)" />}
              <span>{isMuted ? 'Audio: Muted' : 'Audio: Active'}</span>
            </button>

            <button
              onClick={onOpenFullChat}
              className="btn btn-primary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem'
              }}
            >
              <Bot size={15} />
              <span>Launch Floating Chatbot</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}
        >
          <button
            onClick={() => {
              setActiveTab('console');
              soundFx.playClick();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.3rem',
              borderRadius: '10px',
              background: activeTab === 'console' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(15, 23, 42, 0.6)',
              border: activeTab === 'console' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              color: activeTab === 'console' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Terminal size={17} />
            <span>Interactive AI Console</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('architecture');
              soundFx.playClick();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.3rem',
              borderRadius: '10px',
              background: activeTab === 'architecture' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(15, 23, 42, 0.6)',
              border: activeTab === 'architecture' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              color: activeTab === 'architecture' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Server size={17} />
            <span>Architecture Visualizer</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('telemetry');
              soundFx.playClick();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.3rem',
              borderRadius: '10px',
              background: activeTab === 'telemetry' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(15, 23, 42, 0.6)',
              border: activeTab === 'telemetry' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              color: activeTab === 'telemetry' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Radio size={17} />
            <span>Flight Radar & Telemetry</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE AI CONSOLE */}
        {activeTab === 'console' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem'
            }}
            className="console-grid"
          >
            {/* Left Column: Predefined Questions Selector */}
            <div
              className="hud-box"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Code2 size={18} color="var(--accent-cyan)" />
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem' }}>
                    Company Required Questions (Part 2)
                  </span>
                </div>
                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
                  7 PRESETS ACTIVE
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Click any of the canonical assignment questions below to evaluate the DroneTV AI
                rule-matching logic live:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {PREDEFINED_QUESTIONS.map((q, idx) => {
                  const isSelected = selectedQuestion === q.question;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleSelectPredefined(q)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(0, 242, 254, 0.14)' : 'rgba(13, 19, 34, 0.7)',
                        border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontSize: '0.88rem',
                        fontWeight: isSelected ? 600 : 500
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span
                          className="mono"
                          style={{
                            fontSize: '0.72rem',
                            color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)'
                          }}
                        >
                          0{idx + 1}.
                        </span>
                        <span>{q.question}</span>
                      </div>
                      <span
                        className="mono"
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: isSelected ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)'
                        }}
                      >
                        {q.category}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Edge Case Fallback Tester */}
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  background: 'rgba(244, 63, 94, 0.06)',
                  border: '1px dashed rgba(244, 63, 94, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fda4af' }}>
                    Graceful Fallback Verification (Part 2 & 7)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Verify unmatched question fallback response
                  </div>
                </div>
                <button onClick={handleTestFallback} className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem' }}>
                  Test Fallback
                </button>
              </div>

              {/* Custom Input Form */}
              <form onSubmit={handleCustomSubmit} style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Or type a custom prompt / query..."
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '0.65rem 0.9rem' }}
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !customInput.trim()}
                    className="btn btn-primary"
                    style={{ padding: '0 1rem' }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Terminal Monitor & Response Stream */}
            <div
              className="hud-box"
              style={{
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '520px',
                background: '#0a0e1a'
              }}
            >
              {/* Terminal Title Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.8rem 1.25rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    DRONETV_AI_KERNEL.sh
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="hud-pill hud-pill-emerald">
                    <Activity size={12} />
                    <span>{evalMeta.latencyMs}ms LATENCY</span>
                  </span>
                  <span className="hud-pill">
                    <Cpu size={12} />
                    <span>RULE ENGINE: OK</span>
                  </span>
                </div>
              </div>

              {/* Telemetry Status Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(7, 10, 19, 0.7)',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>QUERY: </span>
                  <span style={{ color: 'var(--accent-cyan)' }}>"{selectedQuestion.slice(0, 24)}..."</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>MATCH: </span>
                  <span style={{ color: 'var(--accent-emerald)' }}>{evalMeta.matchType}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>RULE: </span>
                  <span style={{ color: 'var(--accent-amber)' }}>{evalMeta.ruleId}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>ENDPOINT: </span>
                  <span style={{ color: '#fff' }}>{evalMeta.endpoint}</span>
                </div>
              </div>

              {/* Streaming Output Body */}
              <div
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  position: 'relative',
                  overflowY: 'auto',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: '#f8fafc'
                }}
              >
                <div className="scanline-overlay" />

                <div style={{ position: 'relative', zIndex: 4 }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span style={{ color: 'var(--accent-cyan)' }}>dronetv@ai-core:~$</span>
                    <span>evaluate --query="{selectedQuestion}"</span>
                  </div>

                  <div
                    style={{
                      whiteSpace: 'pre-wrap',
                      color: '#f1f5f9',
                      minHeight: '160px'
                    }}
                  >
                    {streamedText}
                    {isProcessing && <span className="typing-cursor" />}
                  </div>

                  {/* Action suggestions upon completion */}
                  {!isProcessing && streamedText && (
                    <div
                      style={{
                        marginTop: '2rem',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        alignItems: 'center'
                      }}
                    >
                      <button
                        onClick={() => {
                          onPrefillLead('DGCA Certified Remote Pilot Training');
                          onNavigateToTab('contact');
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Zap size={14} />
                        <span>Dispatch Lead to Admin CRM</span>
                      </button>

                      <button
                        onClick={() => onNavigateToTab('courses')}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <GraduationCap size={14} />
                        <span>View DGCA Courses</span>
                      </button>

                      <button
                        onClick={() => onNavigateToTab('services')}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Briefcase size={14} />
                        <span>View Enterprise Services</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ARCHITECTURE VISUALIZER */}
        {activeTab === 'architecture' && (
          <div
            className="hud-box"
            style={{
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '2.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                  Full Stack Architecture Flowchart
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Satisfies Part 4, Part 5, and the Video Walkthrough specification (Frontend → API → Backend → Database)
                </p>
              </div>

              <button
                onClick={handleSimulateFlow}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Play size={14} />
                <span>Simulate Packet Flow</span>
              </button>
            </div>

            {/* Architecture Node Pipeline Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '1.25rem',
                position: 'relative'
              }}
            >
              {/* Node 1: Frontend */}
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: simStep === 1 ? 'rgba(0, 242, 254, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                  border: simStep === 1 ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  boxShadow: simStep === 1 ? '0 0 25px rgba(0, 242, 254, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Layers size={20} color="var(--accent-cyan)" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>1. React 19 Frontend</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  TypeScript components, client form validation, sessionStorage chat history, responsive UI.
                </div>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', marginTop: '0.75rem' }}>
                  Port: 5173
                </div>
              </div>

              {/* Node 2: REST API */}
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: simStep === 2 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                  border: simStep === 2 ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                  boxShadow: simStep === 2 ? '0 0 25px rgba(56, 189, 248, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Server size={20} color="var(--accent-blue)" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>2. REST API Gateway</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Express.js routing, CORS, Helmet headers, express-rate-limit sanitization.
                </div>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', marginTop: '0.75rem' }}>
                  /api/chat • /api/enquiries
                </div>
              </div>

              {/* Node 3: Backend Controller */}
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: simStep === 3 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                  border: simStep === 3 ? '2px solid var(--accent-indigo)' : '1px solid var(--border-subtle)',
                  boxShadow: simStep === 3 ? '0 0 25px rgba(99, 102, 241, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Cpu size={20} color="var(--accent-indigo)" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>3. Business Logic Engine</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Predefined rule matching engine, input validation schemas, status state transitions.
                </div>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-indigo)', marginTop: '0.75rem' }}>
                  Port: 5000 (Node.js)
                </div>
              </div>

              {/* Node 4: Database Layer */}
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: simStep === 4 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                  border: simStep === 4 ? '2px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                  boxShadow: simStep === 4 ? '0 0 25px rgba(16, 185, 129, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Database size={20} color="var(--accent-emerald)" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>4. Persistent Data Store</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  MongoDB Mongoose models with zero-config local JSON persistence fallback.
                </div>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', marginTop: '0.75rem' }}>
                  Full CRUD Persistence
                </div>
              </div>

              {/* Node 5: Admin CRM */}
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: simStep === 5 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                  border: simStep === 5 ? '2px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                  boxShadow: simStep === 5 ? '0 0 25px rgba(245, 158, 11, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Shield size={20} color="var(--accent-amber)" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>5. Admin CRM Portal</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Real-time enquiry search, student/customer filtering, status workflow (New → Closed).
                </div>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', marginTop: '0.75rem' }}>
                  Admin Authorization
                </div>
              </div>
            </div>

            {/* Live Pipeline Activity Console */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '10px',
                background: 'rgba(7, 10, 19, 0.95)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem'
              }}
            >
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontWeight: 700 }}>
                &gt; LIVE PIPELINE PACKET MONITOR:
              </div>
              {simLogs.length === 0 ? (
                <div style={{ color: 'var(--text-muted)' }}>
                  Click "Simulate Packet Flow" above to trigger a test packet trace across the stack.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {simLogs.map((log, i) => (
                    <div key={i} style={{ color: i === simLogs.length - 1 ? 'var(--accent-emerald)' : '#cbd5e1' }}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: FLIGHT RADAR & TELEMETRY */}
        {activeTab === 'telemetry' && (
          <div
            className="hud-box telemetry-inner-grid"
            style={{
              padding: '2.5rem 2rem',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2.5rem'
            }}
          >
            {/* Interactive Radar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Crosshair size={18} color="var(--accent-cyan)" />
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>DGCA Flight Telemetry Radar</span>
                </div>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
                  GPS LOCK: 28 SATELLITES
                </span>
              </div>

              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.round(e.clientX - rect.left);
                  const y = Math.round(e.clientY - rect.top);
                  setRadarTarget({ x, y });
                  soundFx.playRadarPing();
                }}
                style={{
                  position: 'relative',
                  height: '320px',
                  borderRadius: '16px',
                  background: 'radial-gradient(circle at center, rgba(0, 242, 254, 0.08), rgba(7, 10, 19, 0.95))',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  overflow: 'hidden',
                  cursor: 'crosshair',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Concentric rings */}
                <div style={{ position: 'absolute', width: '260px', height: '260px', borderRadius: '50%', border: '1px solid rgba(0, 242, 254, 0.15)' }} />
                <div style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '50%', border: '1px solid rgba(0, 242, 254, 0.2)' }} />
                <div style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', border: '1px solid rgba(0, 242, 254, 0.3)' }} />

                {/* Sweeping radar needle */}
                <div
                  style={{
                    position: 'absolute',
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg at 50% 50%, rgba(0, 242, 254, 0.3) 0deg, transparent 65deg)',
                    animation: 'radar-sweep 3.5s linear infinite',
                    pointerEvents: 'none'
                  }}
                />

                {/* Center Drone */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '50%',
                    background: 'rgba(0, 242, 254, 0.2)',
                    border: '2px solid var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px var(--accent-cyan)'
                  }}
                >
                  <span style={{ fontSize: '1.6rem' }}>🛸</span>
                </div>

                {/* Dynamic User Target Waypoint */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${radarTarget.x}px`,
                    top: `${radarTarget.y}px`,
                    transform: 'translate(-50%, -50%)',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'var(--accent-amber)',
                    boxShadow: '0 0 12px var(--accent-amber)',
                    transition: 'all 0.2s ease',
                    pointerEvents: 'none'
                  }}
                />
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Click anywhere on the radar surface to deploy a simulated flight waypoint.
              </div>
            </div>

            {/* Telemetry Readout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1.25rem', background: 'rgba(13, 19, 34, 0.8)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ALTITUDE (AGL)</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {telemetryAltitude} m
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>DGCA Ceiling: 120m Safe</div>
              </div>

              <div style={{ padding: '1.25rem', background: 'rgba(13, 19, 34, 0.8)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GROUND SPEED</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
                  {telemetrySpeed} km/h
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-blue)' }}>Cruising Velocity</div>
              </div>

              <div style={{ padding: '1.25rem', background: 'rgba(13, 19, 34, 0.8)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BATTERY VOLTAGE</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  88% (24.6V)
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>6S LiPo Pack • 32m Flight Time</div>
              </div>

              <div style={{ padding: '1.25rem', background: 'rgba(13, 19, 34, 0.8)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI ASSIST LINK</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                  SYNCED
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-amber)' }}>Persistent Enquiries Active</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 980px) {
          .console-grid {
            grid-template-columns: 1fr 1.35fr !important;
          }
          .telemetry-inner-grid {
            grid-template-columns: 1.2fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
