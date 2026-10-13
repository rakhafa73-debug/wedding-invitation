import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ExternalLink, 
  Edit3, 
  Users, 
  CheckCircle, 
  Clock, 
  Copy, 
  Share2, 
  Trash2, 
  Archive, 
  Eye, 
  FileText, 
  Send, 
  Heart,
  ChevronRight,
  Filter
} from 'lucide-react';
import { InvitationData, GuestItem, RSVPResponseItem, UserProfile } from '../types/wedding';
import { getCustomerInvitations, getGuestsForInvitation, addGuest, deleteGuest, saveInvitation } from '../services/invitations';
import { getRSVPsForInvitation } from '../services/rsvp';

interface CustomerDashboardProps {
  user: UserProfile;
  onEditInvitation: (invitation: InvitationData) => void;
  onOpenPublicInvitation: (slug: string, guestCode?: string) => void;
  onCreateNewInvitation: () => void;
  onLogout: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  onEditInvitation,
  onOpenPublicInvitation,
  onCreateNewInvitation,
  onLogout,
}) => {
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [selectedInv, setSelectedInv] = useState<InvitationData | null>(null);
  const [activeTab, setActiveTab] = useState<'invitations' | 'guests' | 'rsvps'>('invitations');
  
  // Guests & RSVPs for currently selected invitation
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [rsvps, setRsvps] = useState<RSVPResponseItem[]>([]);

  // Add guest form
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCategory, setGuestCategory] = useState<'Teman' | 'Keluarga' | 'VIP' | 'Rekan Kerja'>('Teman');
  const [guestPax, setGuestPax] = useState(2);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Load user's invitations
  useEffect(() => {
    getCustomerInvitations(user.id).then((list) => {
      setInvitations(list);
      if (list.length > 0 && !selectedInv) {
        setSelectedInv(list[0]);
      }
    });
  }, [user.id]);

  // Load guests & RSVPs whenever selected invitation changes
  useEffect(() => {
    if (selectedInv) {
      getGuestsForInvitation(selectedInv.id).then(setGuests);
      getRSVPsForInvitation(selectedInv.id).then(setRsvps);
    }
  }, [selectedInv]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInv || !guestName.trim()) return;

    const newGuest = await addGuest(
      selectedInv.id,
      guestName.trim(),
      guestPhone.trim(),
      guestCategory,
      guestPax
    );

    setGuests([newGuest, ...guests]);
    setGuestName('');
    setGuestPhone('');
    setShowAddGuestModal(false);
  };

  const handleDeleteGuest = async (id: string) => {
    if (confirm('Hapus tamu ini dari daftar undangan?')) {
      await deleteGuest(id);
      setGuests(guests.filter(g => g.id !== id));
    }
  };

  const handleCopyGuestLink = (g: GuestItem) => {
    if (!selectedInv) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://nuptiawedding.id';
    const link = `${origin}/i/${selectedInv.slug}?to=${encodeURIComponent(g.name)}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(g.id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleToggleArchive = async (inv: InvitationData) => {
    const nextStatus = inv.status === 'archived' ? 'published' : 'archived';
    const updated = await saveInvitation({ ...inv, status: nextStatus });
    setInvitations(invitations.map(i => i.id === inv.id ? updated : i));
    if (selectedInv?.id === inv.id) {
      setSelectedInv(updated);
    }
  };

  const totalHadir = rsvps.filter(r => r.attendance === 'hadir').reduce((acc, r) => acc + r.pax, 0);

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#2D4038] font-sans flex flex-col">
      
      {/* ------------------------------------------------------------- */}
      {/* HEADER */}
      {/* ------------------------------------------------------------- */}
      <header className="bg-white border-b border-[#B6A078]/30 px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2D4038] flex items-center justify-center text-[#B6A078]">
              <Heart className="w-4 h-4 fill-[#B6A078]" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-[#2D4038]">Nuptia Dashboard</span>
              <span className="block text-[10px] text-[#77756E] uppercase tracking-wider">
                Selamat Datang, {user.full_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCreateNewInvitation}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#202F29] transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#B6A078]" />
              Buat Undangan Baru
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-full border border-gray-300 text-xs text-[#77756E] hover:bg-gray-100 transition"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#B6A078]/30 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#77756E] font-medium block">Total Undangan</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2D4038] mt-1">{invitations.length}</div>
            <span className="text-[10px] text-emerald-600 mt-0.5 block">
              {invitations.filter(i => i.status === 'published').length} Aktif / Published
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#B6A078]/30 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#77756E] font-medium block">Tamu Tercatat</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2D4038] mt-1">{guests.length}</div>
            <span className="text-[10px] text-[#77756E] mt-0.5 block">Siap kirim via WhatsApp</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#B6A078]/30 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#77756E] font-medium block">Konfirmasi Hadir</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">{totalHadir} Pax</div>
            <span className="text-[10px] text-emerald-600 mt-0.5 block">Dari {rsvps.length} RSVP</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#B6A078]/30 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#77756E] font-medium block">Doa & Ucapan</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#2D4038] mt-1">{rsvps.length}</div>
            <span className="text-[10px] text-[#B6A078] mt-0.5 block">Di buku tamu digital</span>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-[#B6A078]/30 gap-6 text-xs uppercase tracking-wider font-semibold">
          <button
            onClick={() => setActiveTab('invitations')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTab === 'invitations'
                ? 'border-[#2D4038] text-[#2D4038]'
                : 'border-transparent text-[#77756E] hover:text-[#2D4038]'
            }`}
          >
            Daftar Undangan ({invitations.length})
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTab === 'guests'
                ? 'border-[#2D4038] text-[#2D4038]'
                : 'border-transparent text-[#77756E] hover:text-[#2D4038]'
            }`}
          >
            Buku Tamu & Personalisasi Link ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTab === 'rsvps'
                ? 'border-[#2D4038] text-[#2D4038]'
                : 'border-transparent text-[#77756E] hover:text-[#2D4038]'
            }`}
          >
            Data Kehadiran & Doa ({rsvps.length})
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: DAFTAR UNDANGAN */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'invitations' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="rounded-3xl border border-[#B6A078]/30 bg-white overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                        inv.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {inv.status}
                      </span>
                      <span className="text-[11px] font-semibold text-[#B6A078] uppercase">
                        Paket {inv.package_tier}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-20 rounded-t-2xl rounded-b-md overflow-hidden border border-[#B6A078] bg-[#2D4038] shrink-0">
                        <img src={inv.cover_photo} alt={inv.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#2D4038] leading-tight">
                          {inv.couple.groom_nickname} & {inv.couple.bride_nickname}
                        </h3>
                        <p className="text-xs text-[#77756E] mt-1 font-light">
                          {inv.akad.date}
                        </p>
                        <p className="text-[11px] font-mono text-[#2D4038]/70 mt-1">
                          /i/{inv.slug}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#F9F6EE] border-t border-[#B6A078]/20 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onEditInvitation(inv)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold hover:bg-[#202F29] transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#B6A078]" />
                      Edit Undangan
                    </button>
                    <button
                      onClick={() => onOpenPublicInvitation(inv.slug)}
                      className="p-2 rounded-xl border border-[#B6A078] text-[#2D4038] hover:bg-white transition"
                      title="Buka Undangan Publik"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleArchive(inv)}
                      className="p-2 rounded-xl border border-gray-300 text-gray-500 hover:bg-white transition"
                      title={inv.status === 'archived' ? 'Aktifkan Kembali' : 'Arsipkan'}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: BUKU TAMU & PERSONALISASI LINK */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'guests' && selectedInv && (
          <div className="bg-white rounded-3xl border border-[#B6A078]/30 p-6 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2D4038]">
                  Manajemen Tamu Undangan: {selectedInv.couple.groom_nickname} & {selectedInv.couple.bride_nickname}
                </h3>
                <p className="text-xs text-[#77756E] mt-0.5">
                  Setiap tamu memiliki tautan personal dengan sapaan khusus saat membuka undangan.
                </p>
              </div>

              <button
                onClick={() => setShowAddGuestModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold hover:bg-[#202F29] transition"
              >
                <Plus className="w-3.5 h-3.5 text-[#B6A078]" />
                Tambah Tamu Baru
              </button>
            </div>

            {/* Guests Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-[#77756E] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Nama Tamu</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">WhatsApp / Telp</th>
                    <th className="py-3 px-4">Jatah Pax</th>
                    <th className="py-3 px-4">Status RSVP</th>
                    <th className="py-3 px-4 text-right">Aksi & Kirim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {guests.map((g) => {
                    const guestUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/i/${selectedInv.slug}?to=${encodeURIComponent(g.name)}`;
                    const waMessage = encodeURIComponent(
                      `Kepada Yth. ${g.name}\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di pernikahan kami:\n*The Wedding of ${selectedInv.couple.groom_nickname} & ${selectedInv.couple.bride_nickname}*\n\nBuka undangan resmi Anda di:\n${guestUrl}\n\nTerima kasih.`
                    );

                    return (
                      <tr key={g.id} className="hover:bg-[#F9F6EE]/60 transition">
                        <td className="py-3.5 px-4 font-semibold text-[#2D4038]">{g.name}</td>
                        <td className="py-3.5 px-4 text-[#77756E]">{g.category || 'Teman'}</td>
                        <td className="py-3.5 px-4 text-[#77756E]">{g.phone || '-'}</td>
                        <td className="py-3.5 px-4">{g.pax_allowed} Org</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            g.status === 'hadir' ? 'bg-emerald-100 text-emerald-800' :
                            g.status === 'ragu' ? 'bg-amber-100 text-amber-800' :
                            g.status === 'tidak' ? 'bg-rose-100 text-rose-800' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {g.status === 'belum_konfirmasi' ? 'Belum Konfirmasi' : g.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleCopyGuestLink(g)}
                              className="p-1.5 rounded-lg border border-[#B6A078]/40 hover:bg-white text-[#2D4038] transition"
                              title="Salin Tautan Personal"
                            >
                              {copiedLink === g.id ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <a
                              href={`https://api.whatsapp.com/send?${g.phone ? `phone=${g.phone.replace(/[^0-9]/g, '')}&` : ''}text=${waMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                              title="Kirim Pesan WhatsApp"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeleteGuest(g.id)}
                              className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 transition"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: DATA RSVP & DOA RESTU */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'rsvps' && selectedInv && (
          <div className="bg-white rounded-3xl border border-[#B6A078]/30 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2D4038]">
                  Konfirmasi Kehadiran & Doa Restu
                </h3>
                <p className="text-xs text-[#77756E]">
                  Total {rsvps.length} tamu telah merespons undangan pernikahan Anda.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rsvps.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-[#F9F6EE] border border-[#B6A078]/20 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#2D4038]">{r.guest_name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      r.attendance === 'hadir' ? 'bg-emerald-100 text-emerald-800' :
                      r.attendance === 'ragu' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {r.attendance === 'hadir' ? `Hadir (${r.pax} Orang)` : r.attendance === 'ragu' ? 'Masih Ragu' : 'Tidak Hadir'}
                    </span>
                  </div>
                  <p className="text-xs text-[#77756E] leading-relaxed italic font-light">
                    "{r.message}"
                  </p>
                  <span className="text-[10px] text-gray-400 mt-2 block">
                    {new Date(r.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: TAMBAH TAMU */}
      {/* ------------------------------------------------------------- */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-[#B6A078]/40 shadow-2xl">
            <h3 className="font-serif text-xl text-[#2D4038] font-bold mb-1">
              Tambah Tamu Undangan
            </h3>
            <p className="text-xs text-[#77756E] mb-4">
              Masukkan nama tamu untuk membuat tautan undangan personal.
            </p>

            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D4038] mb-1">Nama Tamu / Gelar</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Contoh: Rizky Ramadhan, S.T. & Keluarga"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#B6A078] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2D4038] mb-1">Kategori Tamu</label>
                  <select
                    value={guestCategory}
                    onChange={(e) => setGuestCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="Teman">Teman</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="VIP">VIP</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D4038] mb-1">Jatah Tamu (Pax)</label>
                  <select
                    value={guestPax}
                    onChange={(e) => setGuestPax(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    {[1, 2, 3, 4, 5, 10].map((n) => (
                      <option key={n} value={n}>{n} Orang</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D4038] mb-1">Nomor WhatsApp (Opsional)</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold hover:bg-[#202F29]"
                >
                  Simpan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
