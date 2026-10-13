import React, { useState } from 'react';
import { Heart, Lock, Mail, User, Phone, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { loginWithEmail, registerWithEmail, resetPasswordRequest } from '../services/auth';
import { UserProfile } from '../types/wedding';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (mode === 'login') {
      const { user, error } = await loginWithEmail(email, password);
      setIsLoading(false);
      if (error) {
        setErrorMessage(error);
      } else if (user) {
        onSuccess(user);
        onClose();
      }
    } else if (mode === 'register') {
      if (password.length < 6) {
        setIsLoading(false);
        setErrorMessage('Kata sandi minimal 6 karakter.');
        return;
      }
      const { user, error } = await registerWithEmail(email, password, fullName, phone);
      setIsLoading(false);
      if (error) {
        setErrorMessage(error);
      } else if (user) {
        onSuccess(user);
        onClose();
      }
    } else if (mode === 'forgot') {
      const res = await resetPasswordRequest(email);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setIsLoading(true);
    const { user, error } = await loginWithEmail(demoEmail, 'password123');
    setIsLoading(false);
    if (user) {
      onSuccess(user);
      onClose();
    } else if (error) {
      setErrorMessage(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#B6A078]/40 shadow-2xl p-6 sm:p-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#2D4038] text-[#B6A078] flex items-center justify-center mx-auto mb-2">
            <Heart className="w-5 h-5 fill-[#B6A078]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#2D4038]">
            {mode === 'login' ? 'Masuk ke Nuptia' : mode === 'register' ? 'Daftar Akun Baru' : 'Reset Kata Sandi'}
          </h3>
          <p className="text-xs text-[#77756E] mt-1 font-light">
            {mode === 'login'
              ? 'Kelola undangan pernikahan dan pantau tamu Anda'
              : mode === 'register'
              ? 'Mulai buat undangan pernikahan online impian Anda'
              : 'Masukkan email untuk menerima tautan pemulihan sandi'}
          </p>
        </div>

        {/* Demo Fast Logins for Testing */}
        <div className="mb-5 p-3 rounded-2xl bg-[#F9F6EE] border border-[#B6A078]/30">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#B6A078] block mb-1.5">
            Akses Cepat Pengujian:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rina@wedding.id')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-[#B6A078]/40 text-[11px] font-semibold text-[#2D4038] hover:bg-[#2D4038] hover:text-white transition"
            >
              👰 Pengantin (Rina)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@nuptia.id')}
              className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-[#B6A078]/40 text-[11px] font-semibold text-[#2D4038] hover:bg-[#2D4038] hover:text-white transition"
            >
              🛡️ Admin Bisnis
            </button>
          </div>
        </div>

        {/* Error or Success notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            {successMessage}
          </div>
        )}

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#2D4038] mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2D4038] mb-1">Nomor WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2D4038] mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#2D4038]">Kata Sandi</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#B6A078] hover:underline"
                  >
                    Lupa sandi?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#202F29] transition disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Memproses...' : mode === 'login' ? 'Masuk' : mode === 'register' ? 'Daftar Sekarang' : 'Kirim Tautan Reset'}
          </button>
        </form>

        {/* Switch mode links */}
        <div className="mt-5 text-center text-xs text-[#77756E]">
          {mode === 'login' ? (
            <span>
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(null); }}
                className="font-bold text-[#2D4038] hover:underline"
              >
                Daftar sekarang
              </button>
            </span>
          ) : (
            <span>
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); }}
                className="font-bold text-[#2D4038] hover:underline"
              >
                Masuk di sini
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
