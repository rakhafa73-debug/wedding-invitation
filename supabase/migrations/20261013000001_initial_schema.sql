-- =========================================================================
-- MIGRATION: 20261013000001_initial_schema.sql
-- NUPTIA - WEDDING INVITATION SAAS PLATFORM
-- Tables, Constraints, Indexes, Triggers, RLS Policies, and Storage Setup
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. USER_ROLES TABLE (Strict RBAC, isolated from user_metadata)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT NOT NULL,
    category TEXT DEFAULT 'Modern Emerald',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PACKAGES TABLE (Pricing Tiers)
CREATE TABLE IF NOT EXISTS public.packages (
    id TEXT PRIMARY KEY,
    tier TEXT NOT NULL UNIQUE CHECK (tier IN ('silver', 'gold', 'platinum')),
    name TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    discounted_price NUMERIC(12, 2) CHECK (discounted_price >= 0),
    description TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
    title TEXT NOT NULL,
    theme_id TEXT NOT NULL REFERENCES public.templates(id) ON DELETE RESTRICT DEFAULT 'emerald-arch',
    package_tier TEXT NOT NULL REFERENCES public.packages(tier) ON DELETE RESTRICT DEFAULT 'gold',
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    is_paid BOOLEAN NOT NULL DEFAULT false,
    
    -- Design & Hero
    cover_photo TEXT,
    greeting_quote TEXT,
    verse_text TEXT,
    
    -- Couple Details (JSONB or structured columns)
    groom_name TEXT NOT NULL,
    groom_nickname TEXT NOT NULL,
    groom_parents TEXT,
    groom_photo TEXT,
    bride_name TEXT NOT NULL,
    bride_nickname TEXT NOT NULL,
    bride_parents TEXT,
    bride_photo TEXT,
    
    -- Events
    event_date DATE NOT NULL,
    akad_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    resepsi_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Additional Modules
    audio_url TEXT,
    audio_title TEXT,
    digital_envelopes JSONB DEFAULT '[]'::jsonb,
    love_stories JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup by public slug
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);

-- 6. INVITATION_GALLERIES TABLE
CREATE TABLE IF NOT EXISTS public.invitation_galleries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_invitation_galleries_inv_id ON public.invitation_galleries(invitation_id);

-- 7. INVITATION_GUESTS TABLE
CREATE TABLE IF NOT EXISTS public.invitation_guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    category TEXT CHECK (category IN ('Keluarga', 'Teman', 'VIP', 'Rekan Kerja')),
    pax_allowed INT NOT NULL DEFAULT 2 CHECK (pax_allowed >= 1 AND pax_allowed <= 20),
    slug_code TEXT NOT NULL,
    is_opened BOOLEAN DEFAULT false,
    status TEXT CHECK (status IN ('hadir', 'tidak', 'ragu', 'belum_konfirmasi')) DEFAULT 'belum_konfirmasi',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(invitation_id, slug_code)
);

CREATE INDEX IF NOT EXISTS idx_invitation_guests_inv_id ON public.invitation_guests(invitation_id);

-- 8. RSVP_RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.rsvp_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    attendance TEXT NOT NULL CHECK (attendance IN ('hadir', 'tidak', 'ragu')),
    pax INT NOT NULL DEFAULT 1 CHECK (pax >= 0 AND pax <= 10),
    message TEXT NOT NULL CHECK (char_length(message) <= 1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rsvp_responses_inv_id ON public.rsvp_responses(invitation_id);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    package_tier TEXT NOT NULL REFERENCES public.packages(tier),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled')) DEFAULT 'pending',
    payment_method TEXT DEFAULT 'manual_transfer',
    payment_proof_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_invitation_id ON public.orders(invitation_id);

-- 10. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL CHECK (status IN ('initiated', 'success', 'failed', 'refunded')) DEFAULT 'initiated',
    gateway_reference TEXT,
    raw_payload JSONB,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =========================================================================
-- AUTOMATIC TIMESTAMPS
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_invitations_modtime
    BEFORE UPDATE ON public.invitations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_orders_modtime
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & edit their own profile; Admins can view all
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- User roles: Only readable by owner or admin; only writable by admin
CREATE POLICY "Users can view their own role"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage user roles"
    ON public.user_roles FOR ALL
    USING (public.is_admin());

-- Templates & Packages: Publicly readable; writable only by Admin
CREATE POLICY "Public read templates"
    ON public.templates FOR SELECT
    USING (true);

CREATE POLICY "Admin manage templates"
    ON public.templates FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public read packages"
    ON public.packages FOR SELECT
    USING (true);

CREATE POLICY "Admin manage packages"
    ON public.packages FOR ALL
    USING (public.is_admin());

-- Invitations:
-- 1. Public can read ONLY IF status = 'published'
-- 2. Owner can read/insert/update/delete their own invitations
-- 3. Admin can read all
CREATE POLICY "Public can view published invitations"
    ON public.invitations FOR SELECT
    USING (status = 'published' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create invitations"
    ON public.invitations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invitations"
    ON public.invitations FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete own invitations"
    ON public.invitations FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- Galleries:
CREATE POLICY "Public view galleries of published invitations"
    ON public.invitation_galleries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.invitations
            WHERE invitations.id = invitation_galleries.invitation_id
              AND (invitations.status = 'published' OR invitations.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Owner manage invitation galleries"
    ON public.invitation_galleries FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.invitations
            WHERE invitations.id = invitation_galleries.invitation_id
              AND (invitations.user_id = auth.uid() OR public.is_admin())
        )
    );

-- Guests:
CREATE POLICY "Owner manage guests"
    ON public.invitation_guests FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.invitations
            WHERE invitations.id = invitation_guests.invitation_id
              AND (invitations.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Public can view specific guest info for published invitations"
    ON public.invitation_guests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.invitations
            WHERE invitations.id = invitation_guests.invitation_id
              AND invitations.status = 'published'
        )
    );

-- RSVP:
-- Anyone can view responses for a published invitation
CREATE POLICY "Public view RSVPs of published invitations"
    ON public.rsvp_responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.invitations
            WHERE invitations.id = rsvp_responses.invitation_id
              AND (invitations.status = 'published' OR invitations.user_id = auth.uid() OR public.is_admin())
        )
    );

-- Anyone can submit RSVP if invitation is published (validated)
CREATE POLICY "Public can insert RSVP for published invitations"
    ON public.rsvp_responses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.invitations
            WHERE invitations.id = rsvp_responses.invitation_id
              AND invitations.status = 'published'
        )
    );

-- Orders: Owner can view/create; Admin can manage all
CREATE POLICY "Users can view own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can update orders"
    ON public.orders FOR UPDATE
    USING (public.is_admin());

-- Audit logs: Read & write by Admin
CREATE POLICY "Admin manage audit logs"
    ON public.audit_logs FOR ALL
    USING (public.is_admin());

-- =========================================================================
-- INITIAL SEED DATA
-- =========================================================================
INSERT INTO public.packages (id, tier, name, price, discounted_price, description, features, is_popular)
VALUES 
('pkg-silver', 'silver', 'Silver Romance', 149000, 99000, 'Cocok untuk pernikahan intim sederhana', 
 '["Desain Responsif", "Hitung Mundur Acara", "Peta Google Maps", "Maksimal 150 Nama Tamu", "Amplop Digital (1 Rekening)", "Masa Aktif 3 Bulan"]'::jsonb, false),
('pkg-gold', 'gold', 'Gold Emerald', 249000, 179000, 'Pilihan terfavorit dengan fitur lengkap dan eksklusif', 
 '["Tema Emerald & Gold Eksklusif", "Personalisasi Tamu Tanpa Batas", "RSVP & Ucapan Real-Time", "Amplop Digital & QRIS", "Galeri Foto (Hingga 12 Foto)", "Musik Latar Romantis", "Kirim Undangan WhatsApp 1-Klik", "Masa Aktif 12 Bulan"]'::jsonb, true),
('pkg-platinum', 'platinum', 'Platinum Royal', 399000, 299000, 'Kemewahan paripurna dengan custom domain & live streaming', 
 '["Semua Fitur Gold", "Domain Kustom (namapasangan.id)", "Galeri Foto & Video Tanpa Batas", "Integrasi Live Streaming YouTube/Zoom", "Cerita Cinta / Love Story Timeline", "Fitur QR Code Check-in Tamu di Lokasi", "Dukungan Prioritas VIP 24/7", "Masa Aktif Selamanya"]'::jsonb, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.templates (id, name, description, thumbnail_url, category, is_active)
VALUES
('emerald-arch', 'Emerald Arch Luxury', 'Desain signature dengan latar Deep Green (#2D4038), bingkai foto arch bergaris emas, dan tipografi serif klasik yang megah.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 'Modern Emerald', true),
('royal-botanical', 'Royal Botanical Cream', 'Kombinasi sentuhan dedaunan botanical emas dengan latar pearl cream dan aksen hijau sage yang lembut.', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', 'Botanical', true),
('minimalist-gold', 'Minimalist Pearl Gold', 'Konsep ultra-elegan minimalis dengan tipografi Cormorant Garamond, aksen garis emas halus, dan ruang bernapas yang luas.', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', 'Minimalist', true)
ON CONFLICT (id) DO NOTHING;
