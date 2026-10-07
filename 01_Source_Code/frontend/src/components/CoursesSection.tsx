import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Zap,
  Info
} from 'lucide-react';

interface CoursesSectionProps {
  onSelectCourse: (courseName: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ onSelectCourse }) => {
  const [selectedSyllabusCourse, setSelectedSyllabusCourse] = useState<string | null>(null);

  const courses = [
    {
      id: 'dgca-rpc',
      title: 'DGCA Certified Remote Pilot Certification (RPC)',
      subtitle: 'Small & Medium Category Commercial Pilot License',
      level: 'Govt Certified',
      duration: '5 Days (40 Hours)',
      badge: 'DGCA Authorized',
      badgeColor: 'var(--accent-emerald)',
      highlight: 'Mandatory license for legal commercial drone flying in India.',
      syllabus: [
        'Aviation Regulations & DigitalSky Portal Compliance',
        'Principles of Flight, Aerodynamics & Weather Analysis',
        'Emergency Procedures & Fail-Safe Protocols (RTH/Failsafe)',
        'Mandatory Flight Simulator Hours (Solo & Supervised)',
        'Live Outdoor Flight Training with DGCA Examiner Flight Test'
      ],
      eligibility: '18+ Years, 10th Standard Pass, Valid Passport / Indian ID',
      fee: '₹35,000 + GST',
      tag: 'Most Popular'
    },
    {
      id: 'fpv-mastery',
      title: 'FPV Freestyle & Racing Drone Masterclass',
      subtitle: 'Acro Mode Mastery & High-Performance Drone Engineering',
      level: 'Intermediate to Advanced',
      duration: '3 Weeks (Weekend Batches)',
      badge: 'High Performance',
      badgeColor: 'var(--accent-cyan)',
      highlight: 'Fly manual acro mode without gyro stabilization with digital HD goggles.',
      syllabus: [
        'Acro Mode Muscle Memory & Simulator Drills',
        'Soldering, PDB, 4-in-1 ESC Wiring & Betaflight PID Tuning',
        'Analog vs DJI O3 / Walksnail Digital HD FPV Systems',
        'High-Speed Gap Shooting & Cinematic Proximity Lines',
        'Field Repairs, LiPo Battery Safety & Power Management'
      ],
      eligibility: 'Enthusiasts, Drone Gamers, Commercial Filmmakers',
      fee: '₹24,999 + GST',
      tag: 'Skill Specialization'
    },
    {
      id: 'aerial-cinema',
      title: 'Commercial Aerial Cinematography Flight School',
      subtitle: 'Hollywood Flight Moves & Director-Pilot Coordination',
      level: 'Specialization',
      duration: '2 Weeks (Intensive)',
      badge: 'Cinema Pro',
      badgeColor: 'var(--accent-amber)',
      highlight: 'Move from amateur drone operator to professional cinema camera pilot.',
      syllabus: [
        'Camera Motion Grammar: Orbit, Reveal, Parallax, Crane and Bird-eye',
        'Dual-Operator Master Wheels & Remote Gimbal Coordination',
        'Log Profiles (D-Log/Apple ProRes) and Exposure Zebras in Mid-Air',
        'Action Tracking & Car Chases with Dynamic Speeds',
        'Color Grading LUT Workflows for Commercial Delivery'
      ],
      eligibility: 'Photographers, Videographers & Existing Pilot License Holders',
      fee: '₹28,500 + GST',
      tag: 'Creative Career'
    },
    {
      id: 'maintenance-assembly',
      title: 'Drone Assembly, Avionics & Maintenance Tech',
      subtitle: 'Hardware Fabrication, Wiring & Flight Controller Diagnostics',
      level: 'Hardware Technical',
      duration: '10 Days (Theory + Lab)',
      badge: 'Hardware Lab',
      badgeColor: 'var(--accent-indigo)',
      highlight: 'Hands-on lab training to build, repair, and maintain multirotor drones.',
      syllabus: [
        'Carbon Fiber Frame Geometry & Aerodynamic Load Balancing',
        'Brushless Motors, KV Ratings & Propeller Thrust Calculations',
        'Pixhawk / ArduPilot Autonomous Mission Planning & Waypoints',
        'Sensor Integration: GPS, RTK/PPK GNSS, LiDAR & Optical Flow',
        'Troubleshooting Electrical Faults, Telemetry & Blackbox Logs'
      ],
      eligibility: 'Engineering / Diploma Students & Drone Technicians',
      fee: '₹22,000 + GST',
      tag: 'Engineering Focus'
    }
  ];

  return (
    <section id="courses" style={{ padding: '5rem 0', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--accent-emerald)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '1rem'
            }}
          >
            <GraduationCap size={14} />
            DRONETV FLIGHT ACADEMY
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Govt-Recognized <span className="gradient-text">Drone Training Programs</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Gain industry-accredited certifications with 100% hands-on flight simulator practice,
            DGCA authorized instructors, and comprehensive placement support.
          </p>
        </div>

        {/* Courses Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="glass-card"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '16px',
                position: 'relative'
              }}
            >
              <div>
                {/* Header tags */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {course.tag}
                  </span>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.3rem 0.7rem',
                      borderRadius: '9999px',
                      background: `${course.badgeColor}20`,
                      color: course.badgeColor,
                      border: `1px solid ${course.badgeColor}40`
                    }}
                  >
                    {course.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem', color: '#fff' }}>
                  {course.title}
                </h3>

                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--accent-cyan)',
                    fontWeight: 500,
                    marginBottom: '1rem'
                  }}
                >
                  {course.subtitle}
                </div>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem'
                  }}
                >
                  {course.highlight}
                </p>

                {/* Course Metadata pills */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    padding: '0.9rem',
                    borderRadius: '10px',
                    background: 'rgba(13, 19, 34, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Clock size={16} color="var(--accent-cyan)" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Duration</div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc' }}>
                        {course.duration}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Award size={16} color="var(--accent-emerald)" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Standard Fee</div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                        {course.fee}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Syllabus Highlights Preview */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>Curriculum Highlights:</span>
                    <button
                      onClick={() =>
                        setSelectedSyllabusCourse(
                          selectedSyllabusCourse === course.id ? null : course.id
                        )
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-cyan)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {selectedSyllabusCourse === course.id ? 'Collapse' : 'Expand All'}
                    </button>
                  </div>

                  <ul
                    style={{
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    {(selectedSyllabusCourse === course.id
                      ? course.syllabus
                      : course.syllabus.slice(0, 3)
                    ).map((item, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.45rem',
                          fontSize: '0.825rem',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <CheckCircle
                          size={14}
                          color="var(--accent-emerald)"
                          style={{ marginTop: '2px', flexShrink: 0 }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer */}
              <div
                style={{
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={16} color="var(--accent-emerald)" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    DGCA Certified
                  </span>
                </div>

                <button
                  onClick={() => onSelectCourse(course.title)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <BookOpen size={14} />
                  <span>Enrol / Inquire</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Student Special Notice */}
        <div
          className="glass-card"
          style={{
            marginTop: '3rem',
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            borderRadius: '12px',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            background: 'rgba(168, 85, 247, 0.05)'
          }}
        >
          <div
            style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Zap size={22} color="#c084fc" />
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.2rem' }}>
              Are you currently a college or polytechnic student?
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Get up to 20% academic concession on DGCA RPC pilot batches with your student ID card.
              Ask our AI Assistant or submit an enquiry selecting <strong>Student</strong> as your user type.
            </p>
          </div>

          <button
            onClick={() => onSelectCourse('DGCA Remote Pilot Certification - Student Track')}
            className="btn btn-secondary btn-sm"
          >
            <span>Student Concession</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
