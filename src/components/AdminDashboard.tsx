import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Database, 
  LogOut, 
  Eye, 
  TrendingUp, 
  Edit2 
} from 'lucide-react';
import { UserProfile, OrderItem, PricingPackage } from '../types/wedding';
import { getOrders, updateOrderStatus, getPackages, updatePackagePrice, getAdminMetrics } from '../services/admin';
import { isSupabaseConfigured } from '../services/supabase';

interface AdminDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onOpenSupabaseModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onOpenSupabaseModal,
}) => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeInvitations: 0,
    totalOrders: 0,
    paidOrders: 0,
    totalRevenue: 0,
  });

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'packages' | 'security'>('orders');

  // Edit price state
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  useEffect(() => {
    getAdminMetrics().then(setMetrics);
    getOrders().then(setOrders);
    setPackages(getPackages());
  }, []);

  const handleUpdateStatus = async (orderId: string, status: 'pending' | 'paid' | 'cancelled') => {
    const ok = await updateOrderStatus(orderId, status);
    if (ok) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      getAdminMetrics().then(setMetrics);
    }
  };

  const handleSavePrice = (pkgId: string) => {
    updatePackagePrice(pkgId, tempPrice);
    setPackages(getPackages());
    setEditingPkgId(null);
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#2D4038] font-sans flex flex-col">
      
      {/* ------------------------------------------------------------- */}
      {/* HEADER */}
      {/* ------------------------------------------------------------- */}
      <header className="bg-[#2D4038] text-[#F9F6EE] px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B6A078] text-[#2D4038] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold">Nuptia SuperAdmin</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
                  Role: {user.role}
                </span>
              </div>
              <span className="text-[10px] text-[#B6A078]">
                Akses Terverifikasi: {user.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSupabaseModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#202F29] border border-[#B6A078]/40 text-xs text-[#F9F6EE] hover:bg-[#B6A078] hover:text-[#2D4038] transition"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Status Supabase</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-xs text-[#F9F6EE]/70 hover:text-white px-3 py-1.5 rounded-full border border-white/20 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* METRICS GRID */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#B6A078]/30 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#77756E] font-medium block">Estimasi Omset</span>
            <div className="font-serif text-2xl font-bold text-emerald-800 mt-1">
              Rp {metrics.totalRevenue.toLocaleString('id-ID')}
            </div>
            <span className="text-[10px] text-emerald-600 mt-0.5 block">{metrics.paidOrders} Pesanan Lunas</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#B6A078]/30 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#77756E] font-medium block">Total Pesanan</span>
            <div className="font-serif text-2xl font-bold text-[#2D4038] mt-1">
              {metrics.totalOrders}
            </div>
            <span className="text-[10px] text-amber-600 mt-0.5 block">Perlu konfirmasi pembayaran</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#B6A078]/30 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#77756E] font-medium block">Undangan Aktif</span>
            <div className="font-serif text-2xl font-bold text-[#2D4038] mt-1">
              {metrics.activeInvitations}
            </div>
            <span className="text-[10px] text-[#77756E] mt-0.5 block">Terpublikasi online</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#B6A078]/30 shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#77756E] font-medium block">Total Pengguna</span>
            <div className="font-serif text-2xl font-bold text-[#2D4038] mt-1">
              {metrics.totalUsers}
            </div>
            <span className="text-[10px] text-[#77756E] mt-0.5 block">Pelanggan terdaftar</span>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-[#B6A078]/30 gap-6 text-xs uppercase tracking-wider font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTab === 'orders' ? 'border-[#2D4038] text-[#2D4038]' : 'border-transparent text-[#77756E]'
            }`}
          >
            Pesanan & Pembayaran ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTab === 'packages' ? 'border-[#2D4038] text-[#2D4038]' : 'border-transparent text-[#77756E]'
            }`}
          >
            Manajemen Paket Harga
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTab === 'security' ? 'border-[#2D4038] text-[#2D4038]' : 'border-transparent text-[#77756E]'
            }`}
          >
            Keamanan & RLS Supabase
          </button>
        </div>

        {/* ------------------ TAB 1: ORDERS ------------------ */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#B6A078]/30 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-[#2D4038]">
                Daftar Pesanan & Status Verifikasi Pembayaran
              </h3>
              <span className="text-xs text-[#77756E]">
                Verifikasi bukti transfer sebelum mengaktifkan status Lunas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-[#77756E] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">No. Order</th>
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Judul Undangan</th>
                    <th className="py-3 px-4">Paket</th>
                    <th className="py-3 px-4">Nominal</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#F9F6EE]/60 transition">
                      <td className="py-3 px-4 font-mono font-medium text-[#2D4038]">{o.order_number}</td>
                      <td className="py-3 px-4 text-[#77756E]">{o.user_email}</td>
                      <td className="py-3 px-4 font-semibold text-[#2D4038]">{o.invitation_title}</td>
                      <td className="py-3 px-4">{o.package_name}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-800">
                        Rp {o.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          o.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          o.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {o.status !== 'paid' && (
                            <button
                              onClick={() => handleUpdateStatus(o.id, 'paid')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 transition"
                            >
                              Konfirmasi Lunas
                            </button>
                          )}
                          {o.status !== 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(o.id, 'pending')}
                              className="px-2.5 py-1 rounded-lg border border-amber-300 text-amber-700 text-[11px] font-semibold hover:bg-amber-50 transition"
                            >
                              Set Pending
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------ TAB 2: PACKAGES ------------------ */}
        {activeTab === 'packages' && (
          <div className="bg-white rounded-3xl border border-[#B6A078]/30 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2D4038]">
              Pengaturan Harga Paket Layanan
            </h3>
            <p className="text-xs text-[#77756E]">
              Admin dapat memperbarui harga diskon promo yang tampil di Landing Page.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-6 rounded-2xl bg-[#F9F6EE] border border-[#B6A078]/30">
                  <span className="text-[10px] font-bold text-[#B6A078] uppercase">{pkg.tier}</span>
                  <h4 className="font-serif text-xl font-bold text-[#2D4038] mt-1">{pkg.name}</h4>
                  
                  <div className="my-4">
                    <span className="text-xs line-through text-gray-400">Rp {pkg.price.toLocaleString('id-ID')}</span>
                    {editingPkgId === pkg.id ? (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          value={tempPrice}
                          onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                          className="px-2 py-1 rounded border border-gray-300 text-xs w-32 bg-white"
                        />
                        <button
                          onClick={() => handleSavePrice(pkg.id)}
                          className="px-2.5 py-1 rounded bg-[#2D4038] text-white text-xs font-semibold"
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-serif text-2xl font-bold text-[#2D4038]">
                          Rp {pkg.discounted_price.toLocaleString('id-ID')}
                        </span>
                        <button
                          onClick={() => {
                            setEditingPkgId(pkg.id);
                            setTempPrice(pkg.discounted_price);
                          }}
                          className="p-1.5 rounded-lg border border-[#B6A078] text-[#2D4038] hover:bg-white text-xs"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <ul className="text-xs text-[#77756E] space-y-1.5 font-light">
                    {pkg.features.slice(0, 4).map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------ TAB 3: SECURITY & RLS ------------------ */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl border border-[#B6A078]/30 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2D4038]">
              Arsitektur Keamanan & Kebijakan Row Level Security (RLS)
            </h3>
            <p className="text-xs text-[#77756E] leading-relaxed">
              Sesuai arahan spesifikasi keamanan, role Admin diproteksi melalui tabel khusus <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-emerald-800">public.user_roles</code> dengan fungsi PostgreSQL Security Definer <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-emerald-800">is_admin()</code>, bukan mengandalkan user_metadata yang dapat dimanipulasi klien.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <strong className="block font-semibold">Tabel Terlindungi RLS:</strong>
                <ul className="space-y-1">
                  <li>✓ <span className="font-mono">profiles</span> — Terbatas pemilik data & Admin</li>
                  <li>✓ <span className="font-mono">user_roles</span> — Terkunci ketat, hanya admin dapat mengelola</li>
                  <li>✓ <span className="font-mono">invitations</span> — Publik hanya baca status = 'published'</li>
                  <li>✓ <span className="font-mono">orders & payments</span> — Tertutup untuk anon, verifikasi server</li>
                  <li>✓ <span className="font-mono">rsvp_responses</span> — Validasi foreign key ke published invitations</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[#F9F6EE] border border-[#B6A078]/30 text-xs text-[#2D4038] space-y-2">
                <strong className="block font-semibold">Storage Bucket (wedding-photos):</strong>
                <p className="leading-relaxed">
                  Foto disimpan pada bucket publik terbaca dengan hak unggah terbatas untuk tipe file <code className="font-mono">image/jpeg, image/png, image/webp</code> maksimal 5MB.
                </p>
                <button
                  onClick={onOpenSupabaseModal}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold"
                >
                  <Database className="w-3.5 h-3.5 text-[#B6A078]" />
                  Buka Skrip Migration SQL
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
