import React, { useState } from 'react';
import { 
  Save, 
  Eye, 
  Upload, 
  Calendar, 
  MapPin, 
  Heart, 
  Gift, 
  Music, 
  ArrowLeft, 
  Check, 
  Plus, 
  Trash2, 
  Smartphone, 
  ExternalLink 
} from 'lucide-react';
import { InvitationData, DigitalEnvelope, LoveStoryMilestone } from '../types/wedding';
import { PublicInvitation } from './PublicInvitation';
import { uploadWeddingPhoto } from '../services/storage';

interface InvitationEditorProps {
  initialInvitation: InvitationData;
  onSave: (invitation: InvitationData) => Promise<void>;
  onBack: () => void;
  onOpenPublic: (slug: string) => void;
}

export const InvitationEditor: React.FC<InvitationEditorProps> = ({
  initialInvitation,
  onSave,
  onBack,
  onOpenPublic,
}) => {
  const [data, setData] = useState<InvitationData>({ ...initialInvitation });
  const [activeTab, setActiveTab] = useState<'couple' | 'events' | 'greeting' | 'envelopes' | 'gallery' | 'publish'>('couple');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);

  const handleSave = async (updatedStatus?: 'draft' | 'published') => {
    setIsSaving(true);
    setSaveSuccess(false);

    const toSave: InvitationData = {
      ...data,
      status: updatedStatus || data.status,
      updated_at: new Date().toISOString(),
    };

    if (updatedStatus) {
      setData(toSave);
    }

    await onSave(toSave);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(targetField);
    const res = await uploadWeddingPhoto(file);
    setIsUploading(null);

    if (res.success && res.url) {
      if (targetField === 'cover_photo') {
        setData({ ...data, cover_photo: res.url });
      } else if (targetField === 'groom_photo') {
        setData({
          ...data,
          couple: { ...data.couple, groom_photo: res.url },
        });
      } else if (targetField === 'bride_photo') {
        setData({
          ...data,
          couple: { ...data.couple, bride_photo: res.url },
        });
      } else if (targetField === 'gallery') {
        setData({
          ...data,
          gallery_photos: [...data.gallery_photos, res.url],
        });
      }
    } else {
      alert(res.error || 'Gagal mengunggah foto.');
    }
  };

  // Add envelope
  const handleAddEnvelope = () => {
    const newEnv: DigitalEnvelope = {
      bank_name: 'BCA',
      account_number: '',
      account_holder: '',
    };
    setData({
      ...data,
      digital_envelopes: [...data.digital_envelopes, newEnv],
    });
  };

  const handleRemoveEnvelope = (idx: number) => {
    const list = [...data.digital_envelopes];
    list.splice(idx, 1);
    setData({ ...data, digital_envelopes: list });
  };

  // Fullscreen preview
  if (showFullscreenPreview) {
    return (
      <PublicInvitation
        invitation={data}
        isPreviewMode={true}
        onClosePreview={() => setShowFullscreenPreview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#2D4038] flex flex-col font-sans">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP ACTION BAR */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#B6A078]/30 px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl border border-[#B6A078]/40 hover:bg-[#F9F6EE] text-[#2D4038] transition"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold text-[#2D4038]">{data.title}</h1>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  data.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {data.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-[11px] text-[#77756E]">
                Tautan: /i/{data.slug}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFullscreenPreview(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#B6A078] text-[#2D4038] text-xs font-semibold hover:bg-[#F9F6EE] transition"
            >
              <Eye className="w-3.5 h-3.5 text-[#B6A078]" />
              <span className="hidden sm:inline">Pratinjau Layar Penuh</span>
            </button>

            {data.status === 'published' && (
              <button
                onClick={() => onOpenPublic(data.slug)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#2D4038] text-[#2D4038] text-xs font-semibold hover:bg-white transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Buka Undangan Publik</span>
              </button>
            )}

            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#202F29] transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-[#B6A078]" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Draft'}</span>
            </button>

            {data.status !== 'published' && (
              <button
                onClick={() => handleSave('published')}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#B6A078] text-[#2D4038] text-xs font-bold uppercase tracking-wider hover:bg-[#A38C62] transition shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Publikasikan</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white text-xs py-2 text-center font-medium shadow-inner animate-fade-in">
          Perubahan undangan berhasil disimpan!
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2-COLUMN WORKSPACE: LEFT EDITOR, RIGHT LIVE PREVIEW */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: EDITING FORM (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#B6A078]/30 shadow-sm overflow-hidden">
          
          {/* Subtabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto p-2 bg-[#F9F6EE]/60 gap-1 text-xs font-medium">
            {[
              { id: 'couple', label: '1. Mempelai' },
              { id: 'events', label: '2. Acara & Lokasi' },
              { id: 'greeting', label: '3. Sambutan & Ayat' },
              { id: 'envelopes', label: '4. Amplop Digital' },
              { id: 'gallery', label: '5. Galeri & Kisah' },
              { id: 'publish', label: '6. Tautan & Publikasi' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#2D4038] text-[#F9F6EE] font-semibold'
                    : 'text-[#77756E] hover:text-[#2D4038] hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-6">
            
            {/* ------------------ TAB 1: MEMPELAI ------------------ */}
            {activeTab === 'couple' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg text-[#2D4038] font-bold">Foto Cover Utama (Arch Frame)</h3>
                  <p className="text-xs text-[#77756E] mb-3">Foto ini akan ditampilkan di cover arch bernuansa emas pada bagian Hero.</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-28 rounded-t-[40px] rounded-b-md border border-[#B6A078] overflow-hidden bg-[#2D4038]">
                      <img src={data.cover_photo} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold cursor-pointer hover:bg-[#202F29]">
                        <Upload className="w-3.5 h-3.5 text-[#B6A078]" />
                        {isUploading === 'cover_photo' ? 'Mengunggah...' : 'Unggah Foto Cover'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'cover_photo')}
                        />
                      </label>
                      <p className="text-[10px] text-[#77756E] mt-1">Rekomendasi rasio vertikal (3:4 atau 4:5), maks 5MB.</p>
                    </div>
                  </div>
                </div>

                <div className="gold-divider my-4"></div>

                {/* Mempelai Pria */}
                <div>
                  <h3 className="font-serif text-base text-[#2D4038] font-bold mb-3">Mempelai Pria</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#2D4038] mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={data.couple.groom_name}
                        onChange={(e) => setData({ ...data, couple: { ...data.couple, groom_name: e.target.value } })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#2D4038] mb-1">Nama Panggilan</label>
                      <input
                        type="text"
                        value={data.couple.groom_nickname}
                        onChange={(e) => setData({ ...data, couple: { ...data.couple, groom_nickname: e.target.value } })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[#2D4038] mb-1">Keterangan Orang Tua</label>
                      <input
                        type="text"
                        value={data.couple.groom_parents}
                        onChange={(e) => setData({ ...data, couple: { ...data.couple, groom_parents: e.target.value } })}
                        placeholder="Putra dari Bpk. ... & Ibu ..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="gold-divider my-4"></div>

                {/* Mempelai Wanita */}
                <div>
                  <h3 className="font-serif text-base text-[#2D4038] font-bold mb-3">Mempelai Wanita</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#2D4038] mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={data.couple.bride_name}
                        onChange={(e) => setData({ ...data, couple: { ...data.couple, bride_name: e.target.value } })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#2D4038] mb-1">Nama Panggilan</label>
                      <input
                        type="text"
                        value={data.couple.bride_nickname}
                        onChange={(e) => setData({ ...data, couple: { ...data.couple, bride_nickname: e.target.value } })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[#2D4038] mb-1">Keterangan Orang Tua</label>
                      <input
                        type="text"
                        value={data.couple.bride_parents}
                        onChange={(e) => setData({ ...data, couple: { ...data.couple, bride_parents: e.target.value } })}
                        placeholder="Putri dari Bpk. ... & Ibu ..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------ TAB 2: ACARA & LOKASI ------------------ */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-[#2D4038] mb-1">Tanggal Utama Pernikahan (Untuk Countdown)</label>
                  <input
                    type="date"
                    value={data.event_date}
                    onChange={(e) => setData({ ...data, event_date: e.target.value })}
                    className="w-full sm:w-60 px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#F9F6EE] border border-[#B6A078]/30 space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#2D4038]">Detail Akad Nikah / Pemberkatan</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#77756E] mb-1">Hari & Tanggal</label>
                      <input
                        type="text"
                        value={data.akad.date}
                        onChange={(e) => setData({ ...data, akad: { ...data.akad, date: e.target.value } })}
                        placeholder="Sabtu, 24 Oktober 2026"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#77756E] mb-1">Waktu</label>
                      <input
                        type="text"
                        value={`${data.akad.time_start} - ${data.akad.time_end}`}
                        onChange={(e) => {
                          const parts = e.target.value.split('-');
                          setData({ 
                            ...data, 
                            akad: { 
                              ...data.akad, 
                              time_start: parts[0]?.trim() || '', 
                              time_end: parts[1]?.trim() || '' 
                            } 
                          });
                        }}
                        placeholder="08:00 - 10:00 WIB"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-[#77756E] mb-1">Nama Gedung / Masjid / Tempat</label>
                      <input
                        type="text"
                        value={data.akad.venue_name}
                        onChange={(e) => setData({ ...data, akad: { ...data.akad, venue_name: e.target.value } })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-[#77756E] mb-1">Alamat Lengkap</label>
                      <input
                        type="text"
                        value={data.akad.address}
                        onChange={(e) => setData({ ...data, akad: { ...data.akad, address: e.target.value } })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-[#77756E] mb-1">Tautan Google Maps</label>
                      <input
                        type="url"
                        value={data.akad.maps_url}
                        onChange={(e) => setData({ ...data, akad: { ...data.akad, maps_url: e.target.value } })}
                        placeholder="https://maps.google.com/?q=..."
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F9F6EE] border border-[#B6A078]/30 space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#2D4038]">Detail Resepsi Pernikahan</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#77756E] mb-1">Hari & Tanggal</label>
                      <input
                        type="text"
                        value={data.resepsi.date}
                        onChange={(e) => setData({ ...data, resepsi: { ...data.resepsi, date: e.target.value } })}
                        placeholder="Sabtu, 24 Oktober 2026"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#77756E] mb-1">Waktu</label>
                      <input
                        type="text"
                        value={`${data.resepsi.time_start} - ${data.resepsi.time_end}`}
                        onChange={(e) => {
                          const parts = e.target.value.split('-');
                          setData({ 
                            ...data, 
                            resepsi: { 
                              ...data.resepsi, 
                              time_start: parts[0]?.trim() || '', 
                              time_end: parts[1]?.trim() || '' 
                            } 
                          });
                        }}
                        placeholder="11:00 - 14:00 WIB"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-[#77756E] mb-1">Nama Tempat / Ballroom</label>
                      <input
                        type="text"
                        value={data.resepsi.venue_name}
                        onChange={(e) => setData({ ...data, resepsi: { ...data.resepsi, venue_name: e.target.value } })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-[#77756E] mb-1">Alamat Lengkap</label>
                      <input
                        type="text"
                        value={data.resepsi.address}
                        onChange={(e) => setData({ ...data, resepsi: { ...data.resepsi, address: e.target.value } })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-[#77756E] mb-1">Tautan Google Maps</label>
                      <input
                        type="url"
                        value={data.resepsi.maps_url}
                        onChange={(e) => setData({ ...data, resepsi: { ...data.resepsi, maps_url: e.target.value } })}
                        placeholder="https://maps.google.com/?q=..."
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------ TAB 3: SAMBUTAN & AYAT ------------------ */}
            {activeTab === 'greeting' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#2D4038] mb-1">Kutipan Ayat Suci / Doa</label>
                  <textarea
                    rows={4}
                    value={data.verse_text}
                    onChange={(e) => setData({ ...data, verse_text: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none leading-relaxed"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D4038] mb-1">Kata Sambutan Pembuka</label>
                  <textarea
                    rows={4}
                    value={data.greeting_quote}
                    onChange={(e) => setData({ ...data, greeting_quote: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none leading-relaxed"
                  ></textarea>
                </div>
              </div>
            )}

            {/* ------------------ TAB 4: AMPLOP DIGITAL ------------------ */}
            {activeTab === 'envelopes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base text-[#2D4038] font-bold">Rekening & Amplop Digital</h3>
                    <p className="text-xs text-[#77756E]">Kelola nomor rekening atau e-wallet untuk kemudahan tamu memberikan tanda kasih.</p>
                  </div>
                  <button
                    onClick={handleAddEnvelope}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold hover:bg-[#202F29]"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#B6A078]" />
                    Tambah Rekening
                  </button>
                </div>

                {data.digital_envelopes.map((env, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F9F6EE] border border-[#B6A078]/30 flex flex-col gap-3 relative">
                    <button
                      onClick={() => handleRemoveEnvelope(idx)}
                      className="absolute top-3 right-3 text-rose-500 hover:text-rose-700"
                      title="Hapus Rekening"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                      <div>
                        <label className="block text-[11px] text-[#77756E] mb-1">Bank / E-Wallet</label>
                        <input
                          type="text"
                          value={env.bank_name}
                          onChange={(e) => {
                            const list = [...data.digital_envelopes];
                            list[idx].bank_name = e.target.value;
                            setData({ ...data, digital_envelopes: list });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#77756E] mb-1">Nomor Rekening</label>
                        <input
                          type="text"
                          value={env.account_number}
                          onChange={(e) => {
                            const list = [...data.digital_envelopes];
                            list[idx].account_number = e.target.value;
                            setData({ ...data, digital_envelopes: list });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#77756E] mb-1">Atas Nama (Pemilik)</label>
                        <input
                          type="text"
                          value={env.account_holder}
                          onChange={(e) => {
                            const list = [...data.digital_envelopes];
                            list[idx].account_holder = e.target.value;
                            setData({ ...data, digital_envelopes: list });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ------------------ TAB 5: GALERI & KISAH ------------------ */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-base text-[#2D4038] font-bold">Galeri Foto Prewedding</h3>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold cursor-pointer hover:bg-[#202F29]">
                      <Upload className="w-3.5 h-3.5 text-[#B6A078]" />
                      {isUploading === 'gallery' ? 'Mengunggah...' : 'Tambah Foto'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'gallery')}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {data.gallery_photos.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#B6A078]/40 group">
                        <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                          onClick={() => {
                            const next = [...data.gallery_photos];
                            next.splice(idx, 1);
                            setData({ ...data, gallery_photos: next });
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-md opacity-0 group-hover:opacity-100 transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gold-divider my-4"></div>

                <div>
                  <h3 className="font-serif text-base text-[#2D4038] font-bold mb-2">Musik Latar Romantis</h3>
                  <label className="block text-xs font-medium text-[#2D4038] mb-1">URL Audio MP3</label>
                  <input
                    type="url"
                    value={data.audio_url || ''}
                    onChange={(e) => setData({ ...data, audio_url: e.target.value })}
                    placeholder="https://...mp3"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white"
                  />
                  <p className="text-[10px] text-[#77756E] mt-1">Gunakan link file MP3 langsung (contoh instrumen piano/akustik).</p>
                </div>
              </div>
            )}

            {/* ------------------ TAB 6: TAUTAN & PUBLIKASI ------------------ */}
            {activeTab === 'publish' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-base text-[#2D4038] font-bold mb-1">Kustomisasi Tautan (Slug URL)</h3>
                  <p className="text-xs text-[#77756E] mb-3">Tautan publik ini yang akan Anda bagikan kepada sanak saudara dan teman.</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-mono">https://nuptiawedding.id/i/</span>
                    <input
                      type="text"
                      value={data.slug}
                      onChange={(e) => setData({ ...data, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono font-semibold focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F9F6EE] border border-[#B6A078]/30">
                  <h4 className="font-serif text-sm font-bold text-[#2D4038] mb-1">Status Publikasi Undangan</h4>
                  <p className="text-xs text-[#77756E] mb-3">Undangan yang berstatus 'Published' dapat diakses oleh publik dan menerima konfirmasi RSVP.</p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSave('published')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        data.status === 'published' ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-300 text-gray-700'
                      }`}
                    >
                      ✓ Published (Aktif)
                    </button>
                    <button
                      onClick={() => handleSave('draft')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        data.status === 'draft' ? 'bg-amber-600 text-white' : 'bg-white border border-gray-300 text-gray-700'
                      }`}
                    >
                      Draft (Tertutup)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE PHONE PREVIEW (5 cols) */}
        <div className="lg:col-span-5 sticky top-20 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 text-xs text-[#77756E]">
            <Smartphone className="w-4 h-4 text-[#B6A078]" />
            <span className="font-medium">Live Mobile Preview (Real-Time)</span>
          </div>

          <div className="relative w-[340px] h-[640px] rounded-[44px] p-3 bg-[#202F29] border-4 border-[#B6A078] shadow-2xl flex flex-col">
            {/* Speaker hole */}
            <div className="w-24 h-4 bg-[#2D4038] rounded-b-xl mx-auto mb-1 z-20 shrink-0"></div>

            {/* Inner iframe-like preview container */}
            <div className="flex-1 w-full rounded-[32px] overflow-y-auto bg-[#F9F6EE] border border-[#B6A078]/30">
              <PublicInvitation
                invitation={data}
                guestNameParam="Bapak/Ibu/Saudara/i"
                isPreviewMode={false}
              />
            </div>

            {/* Home indicator */}
            <div className="w-28 h-1 bg-[#F9F6EE]/40 rounded-full mx-auto mt-2 shrink-0"></div>
          </div>
        </div>

      </div>
    </div>
  );
};
