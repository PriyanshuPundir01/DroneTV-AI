import React, { useState, useEffect } from 'react';
import {
  Send,
  User,
  Mail,
  Phone,
  Briefcase,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { CreateEnquiryInput, UserType } from '../types/enquiry';
import { api } from '../services/api';

interface EnquiryFormProps {
  prefilledInterest?: string;
  onSuccess?: () => void;
  showToast: (type: 'success' | 'error' | 'info', message: string, title?: string) => void;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  prefilledInterest,
  onSuccess,
  showToast
}) => {
  const [formData, setFormData] = useState<CreateEnquiryInput>({
    name: '',
    email: '',
    phone: '',
    userType: 'Student',
    interest: prefilledInterest || 'DGCA Certified Remote Pilot Training',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  useEffect(() => {
    if (prefilledInterest) {
      setFormData((prev) => ({ ...prev, interest: prefilledInterest }));
    }
  }, [prefilledInterest]);

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number (e.g. +91 9876543210).';
    }

    if (!formData.userType) {
      errs.userType = 'Please select a user category.';
    }

    if (!formData.interest.trim()) {
      errs.interest = 'Please specify service or course of interest.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please write a brief enquiry or question.';
    } else if (formData.message.trim().length < 5) {
      errs.message = 'Message must be at least 5 characters long.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('error', 'Please resolve the highlighted validation errors before submitting.', 'Validation Error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.createEnquiry(formData);
      if (response.success) {
        setSubmittedSuccessfully(true);
        showToast(
          'success',
          `Thank you ${formData.name}! Your enquiry (#${response.data._id.slice(-6)}) has been logged. Our flight specialist will connect with you shortly.`,
          'Enquiry Submitted'
        );
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.message || 'Submission was not completed.');
      }
    } catch (err: any) {
      const serverErrors = err.errors;
      if (serverErrors) {
        setErrors(serverErrors);
        showToast('error', 'Backend rejected the submission due to validation constraints.', 'Validation Failed');
      } else {
        showToast(
          'error',
          err.message || 'Network or database error encountered while processing your lead. Please retry.',
          'Submission Error'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      userType: 'Student',
      interest: 'DGCA Certified Remote Pilot Training',
      message: ''
    });
    setErrors({});
    setSubmittedSuccessfully(false);
  };

  return (
    <section id="contact" style={{ padding: '5rem 0', position: 'relative' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'start'
          }}
          className="enquiry-grid"
        >
          {/* Left Column: Context & Contact Details */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                background: 'rgba(0, 242, 254, 0.1)',
                border: '1px solid var(--border-accent)',
                color: 'var(--accent-cyan)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '1rem'
              }}
            >
              <Sparkles size={14} />
              CONNECT WITH DRONETV
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
              Submit Your <span className="gradient-text">Lead or Student Enquiry</span>
            </h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                marginBottom: '2rem'
              }}
            >
              Whether you are an aspiring drone pilot, college student seeking scholarships, or an
              enterprise needing industrial UAV mapping and aerial cinematography, our operations team
              is ready to assist.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                className="glass-card"
                style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <div
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: '10px',
                    background: 'rgba(0, 242, 254, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Phone size={20} color="var(--accent-cyan)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CALL OR WHATSAPP</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                    +91 88043 49999 / +91 63032 30227
                  </div>
                </div>
              </div>

              <div
                className="glass-card"
                style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <div
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Mail size={20} color="var(--accent-emerald)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DIRECT EMAIL</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                    pindipolu@ipageums.com / support@dronetv.in
                  </div>
                </div>
              </div>

              <div
                className="glass-card"
                style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <div
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircle2 size={20} color="var(--accent-amber)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SERVICE LEVEL AGREEMENT</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                    Guaranteed response within 2-4 business hours
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Collection Form Card */}
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              border: '1px solid var(--border-accent)',
              borderRadius: '20px',
              position: 'relative'
            }}
          >
            {submittedSuccessfully ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.25rem',
                  animation: 'modal-appear 0.3s ease'
                }}
              >
                <div
                  style={{
                    width: '4.5rem',
                    height: '4.5rem',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '2px solid var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-glow-emerald)'
                  }}
                >
                  <CheckCircle2 size={36} color="var(--accent-emerald)" />
                </div>

                <h3 style={{ fontSize: '1.6rem', color: '#fff' }}>Enquiry Logged Successfully!</h3>

                <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.6 }}>
                  Thank you, <strong>{formData.name}</strong>. Your enquiry regarding{' '}
                  <span style={{ color: 'var(--accent-cyan)' }}>{formData.interest}</span> has been
                  transmitted directly to the DroneTV Operations CRM.
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '1rem'
                  }}
                >
                  <button onClick={handleReset} className="btn btn-primary">
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.35rem' }}>
                    Enquiry & Registration Form
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    All fields below are validated on both client and backend for full security.
                  </p>
                </div>

                {/* Name Field */}
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    <User size={14} /> Full Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Priyanshu Pundir"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? 'has-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <div className="form-error">
                      <AlertCircle size={12} /> {errors.name}
                    </div>
                  )}
                </div>

                {/* Email & Phone Dual Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}
                >
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      <Mail size={14} /> Email Address <span style={{ color: 'var(--accent-rose)' }}>*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="pilot@dronetv.in"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'has-error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <div className="form-error">
                        <AlertCircle size={12} /> {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">
                      <Phone size={14} /> Contact Phone <span style={{ color: 'var(--accent-rose)' }}>*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'has-error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.phone && (
                      <div className="form-error">
                        <AlertCircle size={12} /> {errors.phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* User Type & Interest Dual Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}
                >
                  <div className="form-group">
                    <label className="form-label" htmlFor="userType">
                      <HelpCircle size={14} /> You Are: <span style={{ color: 'var(--accent-rose)' }}>*</span>
                    </label>
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className={`form-select ${errors.userType ? 'has-error' : ''}`}
                      disabled={isSubmitting}
                    >
                      <option value="Student">Student (Seeking Course/License)</option>
                      <option value="Customer">Customer (Enterprise/Commercial Service)</option>
                      <option value="Other">Other / Partnership</option>
                    </select>
                    {errors.userType && (
                      <div className="form-error">
                        <AlertCircle size={12} /> {errors.userType}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="interest">
                      <Briefcase size={14} /> Service / Course Interest <span style={{ color: 'var(--accent-rose)' }}>*</span>
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className={`form-select ${errors.interest ? 'has-error' : ''}`}
                      disabled={isSubmitting}
                    >
                      <optgroup label="Certified Courses & Training">
                        <option value="DGCA Certified Remote Pilot Training">DGCA Certified Remote Pilot Training (RPC)</option>
                        <option value="FPV Racing & Freestyle Masterclass">FPV Racing & Freestyle Masterclass</option>
                        <option value="Commercial Aerial Cinematography Flight School">Aerial Cinematography Flight School</option>
                        <option value="Drone Assembly & Maintenance Technician">Drone Assembly & Avionics Tech</option>
                      </optgroup>
                      <optgroup label="Commercial Enterprise Services">
                        <option value="Aerial Cinematography & Live Broadcasting">Aerial Cinematography & Live Broadcast</option>
                        <option value="LiDAR Mapping & Topographical Surveying">LiDAR Mapping & Surveying</option>
                        <option value="Agricultural Drone Spraying & Survey">Agricultural Drone Spraying & Survey</option>
                        <option value="Industrial Solar & Wind Turbine Inspection">Industrial Infrastructure Inspection</option>
                        <option value="Surveillance & Perimeter Security">Surveillance & Emergency Operations</option>
                        <option value="Custom Enterprise Fleet Operation">Custom Fleet Operation</option>
                      </optgroup>
                    </select>
                    {errors.interest && (
                      <div className="form-error">
                        <AlertCircle size={12} /> {errors.interest}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    <MessageSquare size={14} /> Message / Project Details <span style={{ color: 'var(--accent-rose)' }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your batch timing preference, student qualification, or commercial project requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`form-textarea ${errors.message ? 'has-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <div className="form-error">
                      <AlertCircle size={12} /> {errors.message}
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    fontSize: '1rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.8 : 1
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      <span>Transmitting Enquiry to DroneTV...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Submit Lead Enquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .enquiry-grid {
            grid-template-columns: 1fr 1.1fr !important;
          }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
