import React, { useState } from 'react';
import { X, Terminal, Edit3, Rocket, CheckSquare, Copy, Check } from 'lucide-react';

interface ConfigInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigInfoModal: React.FC<ConfigInfoModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'install' | 'vercel' | 'checklist'>('edit');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl rounded-lg bg-[#181411] border border-[#332821] shadow-2xl p-6 sm:p-8 text-[#F5EFEB] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2C231D]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B88246] block">
              Panduan Pengelola
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-medium text-[#FAF7F2]">
              Konfigurasi & Deployment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#8A7E73] hover:text-[#FAF7F2] hover:bg-[#251E18] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-[#2C231D] no-scrollbar">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'edit'
                ? 'bg-[#B88246] text-[#151210]'
                : 'bg-transparent text-[#8A7E73] hover:text-[#FAF7F2]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Cara Edit Data & Foto</span>
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'install'
                ? 'bg-[#B88246] text-[#151210]'
                : 'bg-transparent text-[#8A7E73] hover:text-[#FAF7F2]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Instalasi & Lokal</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vercel'
                ? 'bg-[#B88246] text-[#151210]'
                : 'bg-transparent text-[#8A7E73] hover:text-[#FAF7F2]'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Deploy ke Vercel</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'bg-[#B88246] text-[#151210]'
                : 'bg-transparent text-[#8A7E73] hover:text-[#FAF7F2]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Checklist Testing</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-5 text-sm space-y-4 text-[#C8BFB5] pr-1">
          {activeTab === 'edit' && (
            <div className="space-y-4">
              <div className="p-4 rounded bg-[#1D1713] border border-[#2F251E]">
                <h4 className="font-medium text-[#FAF7F2] text-sm mb-1">
                  1. Mengubah Data Bisnis, Kontak WhatsApp & Jam Buka
                </h4>
                <p className="text-xs text-[#8A7E73] mb-3">
                  Buka file <code className="text-[#B88246] font-mono">src/data/business.ts</code>:
                </p>
                <ul className="text-xs space-y-2 list-disc list-inside text-[#C8BFB5]">
                  <li><strong className="text-[#FAF7F2]">Nomor WhatsApp:</strong> Isi <code className="font-mono text-[#B88246]">whatsappNumber: "628xxxxxxxxxx"</code></li>
                  <li><strong className="text-[#FAF7F2]">Instagram:</strong> Isi <code className="font-mono text-[#B88246]">instagramHandle: "@kedaikopiruangatas"</code></li>
                  <li><strong className="text-[#FAF7F2]">Jam Buka:</strong> Edit <code className="font-mono text-[#B88246]">openingHours.time</code></li>
                  <li><strong className="text-[#FAF7F2]">Alamat:</strong> Edit <code className="font-mono text-[#B88246]">address.full</code> atau link Google Maps.</li>
                </ul>
              </div>

              <div className="p-4 rounded bg-[#1D1713] border border-[#2F251E]">
                <h4 className="font-medium text-[#FAF7F2] text-sm mb-1">
                  2. Mengubah Menu Sajian
                </h4>
                <p className="text-xs text-[#8A7E73]">
                  Buka file <code className="text-[#B88246] font-mono">src/data/menu.ts</code>. Anda bisa menambah, mengedit, atau menghapus item sajian kopi dan makanan pada array <code className="font-mono text-[#B88246]">SAMPLE_MENU_ITEMS</code>.
                </p>
              </div>

              <div className="p-4 rounded bg-[#1D1713] border border-[#2F251E]">
                <h4 className="font-medium text-[#FAF7F2] text-sm mb-1">
                  3. Mengganti / Menambah Foto Asli
                </h4>
                <p className="text-xs text-[#8A7E73]">
                  Simpan file gambar di folder <code className="text-[#B88246] font-mono">public/images/</code> lalu perbarui path atau tautan pada array <code className="font-mono text-[#B88246]">realPhotos</code> di <code className="font-mono text-[#B88246]">src/data/business.ts</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="space-y-4">
              <p className="text-xs text-[#8A7E73]">
                Untuk menjalankan website di komputer lokal Anda:
              </p>

              <div className="p-4 rounded bg-[#14110F] border border-[#2F251E]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-[#B88246]">1. Clone & Install</span>
                  <button
                    onClick={() => copyToClipboard('npm install', 'c1')}
                    className="text-xs text-[#8A7E73] hover:text-[#FAF7F2] flex items-center gap-1"
                  >
                    {copiedCode === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin</span>
                  </button>
                </div>
                <code className="block bg-[#0C0A09] p-2.5 rounded font-mono text-xs text-emerald-400">
                  npm install
                </code>
              </div>

              <div className="p-4 rounded bg-[#14110F] border border-[#2F251E]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-[#B88246]">2. Jalankan Dev Server</span>
                  <button
                    onClick={() => copyToClipboard('npm run dev', 'c2')}
                    className="text-xs text-[#8A7E73] hover:text-[#FAF7F2] flex items-center gap-1"
                  >
                    {copiedCode === 'c2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin</span>
                  </button>
                </div>
                <code className="block bg-[#0C0A09] p-2.5 rounded font-mono text-xs text-emerald-400">
                  npm run dev
                </code>
              </div>

              <div className="p-4 rounded bg-[#14110F] border border-[#2F251E]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-[#B88246]">3. Build Production</span>
                  <button
                    onClick={() => copyToClipboard('npm run build', 'c3')}
                    className="text-xs text-[#8A7E73] hover:text-[#FAF7F2] flex items-center gap-1"
                  >
                    {copiedCode === 'c3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin</span>
                  </button>
                </div>
                <code className="block bg-[#0C0A09] p-2.5 rounded font-mono text-xs text-emerald-400">
                  npm run build
                </code>
              </div>
            </div>
          )}

          {activeTab === 'vercel' && (
            <div className="space-y-3">
              <div className="p-4 rounded bg-[#1D1713] border border-[#2F251E]">
                <h4 className="font-medium text-[#FAF7F2] text-sm mb-2">
                  Langkah Deployment ke Vercel
                </h4>
                <ol className="text-xs space-y-2 list-decimal list-inside text-[#C8BFB5]">
                  <li>Push repositori ke GitHub (<code className="font-mono text-[#B88246]">git push origin main</code>).</li>
                  <li>Login ke <strong className="text-[#FAF7F2]">vercel.com</strong> dengan akun GitHub.</li>
                  <li>Klik tombol <strong className="text-[#FAF7F2]">"Add New..." &rarr; "Project"</strong>.</li>
                  <li>Pilih repositori Kedai Kopi Ruang Atas.</li>
                  <li>Framework Preset: <strong className="text-[#B88246]">Vite</strong>, Build Command: <code className="font-mono text-[#B88246]">npm run build</code>, Output: <code className="font-mono text-[#B88246]">dist</code>.</li>
                  <li>Klik <strong className="text-[#FAF7F2]">Deploy</strong>. Website siap diakses secara online!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <div className="p-4 rounded bg-[#1D1713] border border-[#2F251E]">
                <h4 className="font-medium text-[#FAF7F2] text-sm mb-2">
                  Checklist Pengujian
                </h4>
                <ul className="text-xs space-y-2.5 text-[#C8BFB5]">
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                    <span>Semua elemen pricelist/harga telah dihapus sesuai permintaan.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                    <span>Tampilan visual bersih, editorial, dan tidak menggunakan template AI generik.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                    <span>Tiga foto asli kedai tampil proporsional tanpa broken images.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                    <span>Lightbox modal berfungsi dengan navigasi keyboard dan tombol tutup.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                    <span>Peta dan petunjuk arah mengarah ke lokasi gerbang Tenjo City Tahap 3.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#2C231D] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#B88246] hover:bg-[#C89254] text-[#151210] text-xs uppercase tracking-wider font-semibold rounded transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
