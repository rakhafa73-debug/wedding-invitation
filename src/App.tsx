import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { PublicInvitation } from './components/PublicInvitation';
import { CustomerDashboard } from './components/CustomerDashboard';
import { InvitationEditor } from './components/InvitationEditor';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { SupabaseModal } from './components/SupabaseModal';
import { InvitationData, PricingPackage, UserProfile } from './types/wedding';
import { getInvitationBySlug, getCustomerInvitations, saveInvitation } from './services/invitations';
import { getCurrentUser, logoutUser } from './services/auth';
import { getPackages } from './services/admin';
import { INITIAL_INVITATIONS } from './data/seedData';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function App() {
  // Current user session
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'landing' | 'public_invitation' | 'dashboard' | 'editor' | 'admin'>('landing');
  const [activeSlug, setActiveSlug] = useState<string>('rina-dimas');
  const [activeInvitation, setActiveInvitation] = useState<InvitationData>(INITIAL_INVITATIONS[0]);
  const [packages, setPackages] = useState<PricingPackage[]>([]);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  // Initialize
  useEffect(() => {
    // 1. Check user session
    getCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    // 2. Load packages
    setPackages(getPackages());

    // 3. Check URL path for public invitation slug: e.g. /i/rina-dimas
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/i/')) {
        const slug = path.replace('/i/', '').split('/')[0].split('?')[0];
        if (slug) {
          getInvitationBySlug(slug).then((inv) => {
            if (inv) {
              setActiveInvitation(inv);
              setActiveSlug(slug);
              setCurrentView('public_invitation');
            }
          });
        }
      }
    }
  }, []);

  // Listen for browser popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/i/')) {
        const slug = path.replace('/i/', '').split('/')[0].split('?')[0];
        if (slug) {
          getInvitationBySlug(slug).then((inv) => {
            if (inv) {
              setActiveInvitation(inv);
              setActiveSlug(slug);
              setCurrentView('public_invitation');
            }
          });
        }
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handlers
  const handleOpenPublicInvitation = async (slug: string) => {
    const inv = await getInvitationBySlug(slug);
    if (inv) {
      setActiveInvitation(inv);
      setActiveSlug(slug);
      setCurrentView('public_invitation');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', `/i/${slug}`);
      }
    }
  };

  const handleSelectPackage = (pkg: PricingPackage) => {
    if (!currentUser) {
      setAuthMode('register');
      setShowAuthModal(true);
    } else {
      // Create new draft with this package
      handleCreateNewInvitation(pkg.tier);
    }
  };

  const handleCreateNewInvitation = (tier: 'silver' | 'gold' | 'platinum' = 'gold') => {
    const newInv: InvitationData = {
      id: 'inv-' + Math.random().toString(36).substring(2, 9),
      user_id: currentUser?.id || 'usr-temp',
      slug: 'pernikahan-' + Math.random().toString(36).substring(2, 7),
      title: 'The Wedding of Pengantin',
      theme_id: 'emerald-arch',
      package_tier: tier,
      status: 'draft',
      is_paid: false,
      cover_photo: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85',
      greeting_quote: 'Assalamu’alaikum Warahmatullahi Wabarakatuh\nDengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk merayakan hari pernikahan kami.',
      verse_text: '“Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu...” (QS. Ar-Rum: 21)',
      couple: {
        groom_name: 'Nama Lengkap Pria, S.T.',
        groom_nickname: 'Pria',
        groom_parents: 'Putra dari Bpk. ... & Ibu ...',
        groom_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85',
        bride_name: 'Nama Lengkap Wanita, S.Ked',
        bride_nickname: 'Wanita',
        bride_parents: 'Putri dari Bpk. ... & Ibu ...',
        bride_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
      },
      event_date: '2026-12-20',
      akad: {
        title: 'Akad Nikah',
        date: 'Minggu, 20 Desember 2026',
        time_start: '08:00',
        time_end: '10:00 WIB',
        venue_name: 'Masjid Agung',
        address: 'Jl. Utama No. 1, Jakarta',
        maps_url: 'https://maps.google.com',
      },
      resepsi: {
        title: 'Resepsi Pernikahan',
        date: 'Minggu, 20 Desember 2026',
        time_start: '11:00',
        time_end: '14:00 WIB',
        venue_name: 'Grand Ballroom',
        address: 'Jl. Utama No. 1, Jakarta',
        maps_url: 'https://maps.google.com',
      },
      audio_url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=romantic-acoustic-guitar-wedding-111956.mp3',
      audio_title: 'Romantic Acoustic',
      digital_envelopes: [
        {
          bank_name: 'BCA',
          account_number: '1234567890',
          account_holder: 'Nama Mempelai',
        }
      ],
      love_stories: [],
      gallery_photos: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setActiveInvitation(newInv);
    setCurrentView('editor');
  };

  const handleSaveInvitation = async (inv: InvitationData) => {
    const saved = await saveInvitation(inv);
    setActiveInvitation(saved);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setCurrentView('landing');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6EE] font-sans antialiased text-[#2D4038]">
      
      {/* ------------------------------------------------------------- */}
      {/* VIEW 1: PUBLIC INVITATION VIEW */}
      {/* ------------------------------------------------------------- */}
      {currentView === 'public_invitation' && (
        <div className="relative">
          {/* Floating Back to Nuptia Hub Button */}
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => {
                setCurrentView(currentUser ? (currentUser.role === 'admin' ? 'admin' : 'dashboard') : 'landing');
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', '/');
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#202F29]/90 text-[#F9F6EE] text-xs font-semibold border border-[#B6A078]/40 shadow-xl backdrop-blur-md hover:bg-[#2D4038] hover:text-[#B6A078] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda Nuptia</span>
            </button>
          </div>

          <PublicInvitation
            invitation={activeInvitation}
            isPreviewMode={false}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 2: LANDING PAGE */}
      {/* ------------------------------------------------------------- */}
      {currentView === 'landing' && (
        <LandingPage
          packages={packages}
          featuredInvitation={INITIAL_INVITATIONS[0]}
          onOpenPublicInvitation={handleOpenPublicInvitation}
          onSelectPackage={handleSelectPackage}
          onOpenAuth={(mode) => {
            if (currentUser) {
              setCurrentView(currentUser.role === 'admin' ? 'admin' : 'dashboard');
            } else {
              setAuthMode(mode);
              setShowAuthModal(true);
            }
          }}
          onOpenSupabaseModal={() => setShowSupabaseModal(true)}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 3: CUSTOMER DASHBOARD */}
      {/* ------------------------------------------------------------- */}
      {currentView === 'dashboard' && currentUser && (
        <CustomerDashboard
          user={currentUser}
          onEditInvitation={(inv) => {
            setActiveInvitation(inv);
            setCurrentView('editor');
          }}
          onOpenPublicInvitation={handleOpenPublicInvitation}
          onCreateNewInvitation={() => handleCreateNewInvitation('gold')}
          onLogout={handleLogout}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 4: INVITATION EDITOR */}
      {/* ------------------------------------------------------------- */}
      {currentView === 'editor' && (
        <InvitationEditor
          initialInvitation={activeInvitation}
          onSave={handleSaveInvitation}
          onBack={() => setCurrentView(currentUser ? 'dashboard' : 'landing')}
          onOpenPublic={handleOpenPublicInvitation}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 5: ADMIN DASHBOARD */}
      {/* ------------------------------------------------------------- */}
      {currentView === 'admin' && currentUser && (
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
          onOpenSupabaseModal={() => setShowSupabaseModal(true)}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODALS */}
      {/* ------------------------------------------------------------- */}
      <AuthModal
        isOpen={showAuthModal}
        initialMode={authMode}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <SupabaseModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />

    </div>
  );
}

export default App;
