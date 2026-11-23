import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DroneTVIntroAnimation } from './components/DroneTVIntroAnimation';
import { CustomCursor } from './components/CustomCursor';
import { ServicesSection } from './components/ServicesSection';
import { CoursesSection } from './components/CoursesSection';
import { EnquiryForm } from './components/EnquiryForm';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { api, AdminUser } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'courses' | 'contact' | 'admin'>('home');
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [prefilledInterest, setPrefilledInterest] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => api.getAdminUser());
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);

  const showToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

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
      if (api.isAdminAuthenticated() && adminUser) {
        setActiveTab('admin');
      } else {
        setShowAdminLoginModal(true);
      }
    } else {
      setActiveTab('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminTabClick = (tab: 'home' | 'services' | 'courses' | 'contact' | 'admin') => {
    if (tab === 'admin') {
      if (api.isAdminAuthenticated() && adminUser) {
        setActiveTab('admin');
      } else {
        setShowAdminLoginModal(true);
      }
    } else {
      setActiveTab(tab);
    }
  };

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setShowAdminLoginModal(false);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    api.clearAdminSession();
    setAdminUser(null);
    setActiveTab('home');
    showToast('info', 'Logged out of Admin Portal successfully.', 'Signed Out');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showIntro && (
        <DroneTVIntroAnimation onComplete={() => setShowIntro(false)} />
      )}

      <CustomCursor />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <Navbar
        activeTab={activeTab}
        setActiveTab={handleAdminTabClick}
        openChatbot={() => setIsChatbotOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
        isAdminAuthenticated={Boolean(adminUser)}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
      />

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
            />
          </div>
        )}

        {activeTab === 'admin' && (
          adminUser && api.isAdminAuthenticated() ? (
            <AdminDashboard
              showToast={showToast}
              adminUser={adminUser}
              onLogout={handleLogout}
            />
          ) : (
            <div style={{ padding: '6rem 1rem', textAlign: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowAdminLoginModal(true)}
              >
                Open Admin Login
              </button>
            </div>
          )
        )}
      </main>

      {/* Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => {
          setShowAdminLoginModal(false);
          if (activeTab === 'admin' && (!adminUser || !api.isAdminAuthenticated())) {
            setActiveTab('home');
          }
        }}
        onSuccess={handleAdminLoginSuccess}
        showToast={showToast}
      />

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

      <Footer
        onNavigate={handleAdminTabClick}
        onOpenChat={() => setIsChatbotOpen(true)}
      />
    </div>
  );
}

export default App;
