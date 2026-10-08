import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DroneTVIntroAnimation } from './components/DroneTVIntroAnimation';
import { CustomCursor } from './components/CustomCursor';
import { ServicesSection } from './components/ServicesSection';
import { CoursesSection } from './components/CoursesSection';
import { EnquiryForm } from './components/EnquiryForm';
import { AdminDashboard } from './components/AdminDashboard';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AdminUser } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'courses' | 'contact' | 'admin'>('home');
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [prefilledInterest, setPrefilledInterest] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const defaultAdminUser: AdminUser = {
    name: 'Priyanshu Pundir',
    email: 'admin@dronetv.in',
    role: 'Lead Administrator'
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectService = (serviceName: string) => {
    setPrefilledInterest(serviceName);
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('info', `Preselected "${serviceName}" in the enquiry form.`, 'Service Selected');
  };

  const handleSelectCourse = (courseName: string) => {
    setPrefilledInterest(courseName);
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('info', `Preselected "${courseName}" in the enquiry form.`, 'Course Selected');
  };

  const handleNavigateToSection = (sectionId: string) => {
    if (sectionId === 'services') {
      setActiveTab('services');
    } else if (sectionId === 'courses') {
      setActiveTab('courses');
    } else if (sectionId === 'contact') {
      setActiveTab('contact');
    } else if (sectionId === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* DroneTV Cinematic Boot & Startup Introduction Animation */}
      {showIntro && (
        <DroneTVIntroAnimation onComplete={() => setShowIntro(false)} />
      )}

      {/* Aerospace Drone Telemetry Reticle Cursor */}
      <CustomCursor />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Primary Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openChatbot={() => setIsChatbotOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Main View Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <>
            <Hero
              onOpenChat={() => setIsChatbotOpen(true)}
              onExploreCourses={() => {
                setActiveTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreServices={() => {
                setActiveTab('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onReplayIntro={() => setShowIntro(true)}
            />
            <ServicesSection onSelectService={handleSelectService} />
            <CoursesSection onSelectCourse={handleSelectCourse} />
            <EnquiryForm
              prefilledInterest={prefilledInterest}
              showToast={showToast}
              onSuccess={() => {
                // Enquiry submitted successfully
              }}
            />
          </>
        )}

        {activeTab === 'services' && (
          <div style={{ paddingTop: '1.5rem' }}>
            <ServicesSection onSelectService={handleSelectService} />
          </div>
        )}

        {activeTab === 'courses' && (
          <div style={{ paddingTop: '1.5rem' }}>
            <CoursesSection onSelectCourse={handleSelectCourse} />
          </div>
        )}

        {activeTab === 'contact' && (
          <div style={{ paddingTop: '1.5rem' }}>
            <EnquiryForm
              prefilledInterest={prefilledInterest}
              showToast={showToast}
              onSuccess={() => {
                // Success action
              }}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            showToast={showToast}
            adminUser={defaultAdminUser}
          />
        )}
      </main>

      {/* Floating AI Chatbot Widget */}
      <ChatbotWidget
        isOpen={isChatbotOpen}
        onOpen={() => setIsChatbotOpen(true)}
        onClose={() => setIsChatbotOpen(false)}
        onNavigateToSection={handleNavigateToSection}
        onOpenEnquiryModalWithInterest={(interest) => {
          setPrefilledInterest(interest);
          setActiveTab('contact');
          setIsChatbotOpen(false);
        }}
      />

      {/* Aerospace Footer */}
      <Footer
        onNavigate={setActiveTab}
        onOpenChat={() => setIsChatbotOpen(true)}
      />
    </div>
  );
}

export default App;
