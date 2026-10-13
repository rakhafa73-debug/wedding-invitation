export type UserRole = 'admin' | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface WeddingCouple {
  groom_name: string;
  groom_nickname: string;
  groom_parents: string;
  groom_photo: string;
  bride_name: string;
  bride_nickname: string;
  bride_parents: string;
  bride_photo: string;
}

export interface WeddingEvent {
  title: string;
  date: string;
  time_start: string;
  time_end: string;
  venue_name: string;
  address: string;
  maps_url: string;
  maps_embed_url?: string;
}

export interface DigitalEnvelope {
  bank_name: string;
  account_number: string;
  account_holder: string;
  qris_url?: string;
}

export interface LoveStoryMilestone {
  year_or_date: string;
  title: string;
  story: string;
  photo?: string;
}

export interface InvitationData {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  theme_id: string;
  package_tier: 'silver' | 'gold' | 'platinum';
  status: 'draft' | 'published' | 'archived';
  is_paid: boolean;
  
  // Design & Hero
  cover_photo: string;
  greeting_quote: string;
  verse_text?: string;
  
  // Couple
  couple: WeddingCouple;
  
  // Events
  event_date: string;
  akad: WeddingEvent;
  resepsi: WeddingEvent;
  
  // Modules
  audio_url?: string;
  audio_title?: string;
  digital_envelopes: DigitalEnvelope[];
  love_stories: LoveStoryMilestone[];
  gallery_photos: string[];
  
  // Customization
  primary_color?: string;
  accent_gold?: string;
  bg_cream?: string;
  
  created_at: string;
  updated_at: string;
}

export interface GuestItem {
  id: string;
  invitation_id: string;
  name: string;
  phone?: string;
  category?: 'Keluarga' | 'Teman' | 'VIP' | 'Rekan Kerja';
  pax_allowed: number;
  slug_code: string;
  is_opened?: boolean;
  status?: 'hadir' | 'tidak' | 'ragu' | 'belum_konfirmasi';
  created_at: string;
}

export interface RSVPResponseItem {
  id: string;
  invitation_id: string;
  guest_name: string;
  attendance: 'hadir' | 'tidak' | 'ragu';
  pax: number;
  message: string;
  created_at: string;
}

export interface PricingPackage {
  id: string;
  tier: 'silver' | 'gold' | 'platinum';
  name: string;
  price: number;
  discounted_price: number;
  description: string;
  features: string[];
  is_popular?: boolean;
}

export interface OrderItem {
  id: string;
  order_number: string;
  user_id: string;
  user_email: string;
  invitation_id: string;
  invitation_title: string;
  package_name: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  payment_method: string;
  payment_proof_url?: string;
  created_at: string;
}

export interface AuditLogItem {
  id: string;
  user_email: string;
  action: string;
  details: string;
  timestamp: string;
}
