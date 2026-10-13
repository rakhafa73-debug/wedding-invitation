import React, { useState } from 'react';
import { Database, CheckCircle, Copy, Check, X, ShieldCheck, Key, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured, supabaseUrl, supabaseAnonKey, updateSupabaseConfig, clearSupabaseConfig } from '../services/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [urlInput, setUrlInput] = useState(supabaseUrl);
  const [keyInput, setKeyInput] = useState(supabaseAnonKey);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseConfig(urlInput, keyInput);
  };

  const handleCopySql = () => {
    // Quick reference schema commands
    const sqlText = `-- Jalankan file lengkap dari /supabase/migrations/20261013000001_initial_schema.sql di Supabase SQL Editor
-- File ini membuat tabel: profiles, user_roles, templates, packages, orders, invitations, invitation_guests, rsvp_responses, dll.
-- Beserta seluruh Row Level Security (RLS) dan seed awal.`;

    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#B6A078]/40 shadow-2xl p-6 sm:p-8 my-8 text-left text-[#2D4038]">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#2D4038] text-[#B6A078] flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2D4038]">
              Integrasi Database Supabase
            </h3>
            <p className="text-xs text-[#77756E]">
              PostgreSQL, Supabase Auth, Storage, & Row Level Security (RLS)
            </p>
          </div>
        </div>

        {/* Current status banner */}
        <div className={`p-4 rounded-2xl border mb-6 flex items-start gap-3 ${
          isSupabaseConfigured
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-[#F9F6EE] border-[#B6A078]/40 text-[#2D4038]'
        }`}>
          {isSupabaseConfigured ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-[#B6A078] shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <strong>
              {isSupabaseConfigured
                ? 'Status: Terkoneksi dengan Kredensial Supabase'
                : 'Status: Mode Demo & Penyimpanan Lokal (Offline-Resilient)'}
            </strong>
            <p className="leading-relaxed font-light">
              {isSupabaseConfigured
                ? `Aplikasi aktif berkomunikasi dengan PostgreSQL di ${supabaseUrl}. Seluruh data pelanggan dan RSVP tersinkronisasi ke server Supabase.`
                : 'Saat kredensial Supabase belum diisi, platform berjalan dalam mode demo dengan penyimpanan lokal (localStorage). Data TIDAK diklaim tersimpan ke database cloud sampai Anda mengisi kredensial resmi di bawah ini.'}
            </p>
          </div>
        </div>

        {/* Form to connect Supabase */}
        <form onSubmit={handleSaveConfig} className="space-y-4 mb-6">
          <h4 className="font-serif text-sm font-bold text-[#2D4038]">
            Hubungkan Proyek Supabase Anda
          </h4>
          
          <div>
            <label className="block text-xs font-semibold text-[#2D4038] mb-1">
              Project URL (VITE_SUPABASE_URL)
            </label>
            <input
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D4038] mb-1">
              Anon Public API Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <input
              type="text"
              required
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold hover:bg-[#202F29] transition"
            >
              Simpan & Hubungkan
            </button>
            {isSupabaseConfigured && (
              <button
                type="button"
                onClick={clearSupabaseConfig}
                className="px-4 py-2.5 rounded-full border border-rose-300 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition"
              >
                Reset ke Mode Demo
              </button>
            )}
          </div>
        </form>

        {/* Migration instructions */}
        <div className="p-4 rounded-2xl bg-[#F9F6EE] border border-[#B6A078]/30 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-serif text-xs font-bold text-[#2D4038] uppercase tracking-wider">
              Langkah Menyiapkan Database Supabase:
            </h5>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#2D4038] hover:text-[#B6A078]"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Disalin!' : 'Salin Instruksi Migration'}</span>
            </button>
          </div>

          <ol className="text-xs text-[#77756E] space-y-1.5 list-decimal list-inside font-light">
            <li>Buka dashboard <strong>Supabase</strong> di browser Anda & buat proyek baru.</li>
            <li>Buka menu <strong>SQL Editor</strong> di panel samping Supabase.</li>
            <li>Buka file <code className="bg-white px-1 py-0.5 rounded border border-gray-200 font-mono text-[11px]">/supabase/migrations/20261013000001_initial_schema.sql</code> di proyek ini, lalu salin dan jalankan (Run).</li>
            <li>Di menu <strong>Storage</strong>, buat bucket publik bernama <code className="bg-white px-1 py-0.5 rounded border border-gray-200 font-mono text-[11px]">wedding-photos</code>.</li>
            <li>Salin <strong>Project URL</strong> dan <strong>anon key</strong> dari Project Settings → API ke formulir di atas.</li>
          </ol>
        </div>

      </div>
    </div>
  );
};
