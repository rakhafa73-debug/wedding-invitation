import { supabase, isSupabaseConfigured } from './supabase';
import { InvitationData, GuestItem } from '../types/wedding';
import { INITIAL_INVITATIONS, INITIAL_GUESTS } from '../data/seedData';

const INVITATIONS_STORAGE_KEY = 'nuptia_invitations_store';
const GUESTS_STORAGE_KEY = 'nuptia_guests_store';

function getLocalInvitations(): InvitationData[] {
  const stored = localStorage.getItem(INVITATIONS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(INITIAL_INVITATIONS));
    return INITIAL_INVITATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_INVITATIONS;
  }
}

function saveLocalInvitations(items: InvitationData[]) {
  localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(items));
}

function getLocalGuests(): GuestItem[] {
  const stored = localStorage.getItem(GUESTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(INITIAL_GUESTS));
    return INITIAL_GUESTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_GUESTS;
  }
}

function saveLocalGuests(items: GuestItem[]) {
  localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(items));
}

// 1. Get published invitation by slug (Public view)
export async function getInvitationBySlug(slug: string): Promise<InvitationData | null> {
  const cleanSlug = slug.toLowerCase().trim();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', cleanSlug)
        .eq('status', 'published')
        .single();

      if (!error && data) {
        // Map database record to InvitationData
        return {
          id: data.id,
          user_id: data.user_id,
          slug: data.slug,
          title: data.title,
          theme_id: data.theme_id,
          package_tier: data.package_tier,
          status: data.status,
          is_paid: data.is_paid,
          cover_photo: data.cover_photo,
          greeting_quote: data.greeting_quote,
          verse_text: data.verse_text,
          couple: {
            groom_name: data.groom_name,
            groom_nickname: data.groom_nickname,
            groom_parents: data.groom_parents,
            groom_photo: data.groom_photo,
            bride_name: data.bride_name,
            bride_nickname: data.bride_nickname,
            bride_parents: data.bride_parents,
            bride_photo: data.bride_photo,
          },
          event_date: data.event_date,
          akad: data.akad_details || {},
          resepsi: data.resepsi_details || {},
          audio_url: data.audio_url,
          audio_title: data.audio_title,
          digital_envelopes: data.digital_envelopes || [],
          love_stories: data.love_stories || [],
          gallery_photos: [],
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Supabase getInvitationBySlug query failed, falling back to local data', e);
    }
  }

  const list = getLocalInvitations();
  const found = list.find(inv => inv.slug.toLowerCase() === cleanSlug);
  return found || null;
}

// 2. Get customer invitations
export async function getCustomerInvitations(userId?: string): Promise<InvitationData[]> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          ...d,
          couple: {
            groom_name: d.groom_name,
            groom_nickname: d.groom_nickname,
            groom_parents: d.groom_parents,
            groom_photo: d.groom_photo,
            bride_name: d.bride_name,
            bride_nickname: d.bride_nickname,
            bride_parents: d.bride_parents,
            bride_photo: d.bride_photo,
          },
          akad: d.akad_details || {},
          resepsi: d.resepsi_details || {},
          digital_envelopes: d.digital_envelopes || [],
          love_stories: d.love_stories || [],
          gallery_photos: [],
        }));
      }
    } catch (e) {
      console.warn('Supabase getCustomerInvitations failed, using local', e);
    }
  }

  const all = getLocalInvitations();
  if (userId) {
    const userInvs = all.filter(i => i.user_id === userId);
    if (userInvs.length > 0) return userInvs;
  }
  return all;
}

// 3. Create or save an invitation
export async function saveInvitation(invitation: InvitationData): Promise<InvitationData> {
  const invitations = getLocalInvitations();
  const existingIdx = invitations.findIndex(i => i.id === invitation.id);

  const updatedItem: InvitationData = {
    ...invitation,
    updated_at: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    invitations[existingIdx] = updatedItem;
  } else {
    invitations.unshift(updatedItem);
  }

  saveLocalInvitations(invitations);

  // If Supabase is connected, sync to DB
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('invitations').upsert({
        id: updatedItem.id,
        user_id: updatedItem.user_id,
        slug: updatedItem.slug,
        title: updatedItem.title,
        theme_id: updatedItem.theme_id,
        package_tier: updatedItem.package_tier,
        status: updatedItem.status,
        is_paid: updatedItem.is_paid,
        cover_photo: updatedItem.cover_photo,
        greeting_quote: updatedItem.greeting_quote,
        verse_text: updatedItem.verse_text,
        groom_name: updatedItem.couple.groom_name,
        groom_nickname: updatedItem.couple.groom_nickname,
        groom_parents: updatedItem.couple.groom_parents,
        groom_photo: updatedItem.couple.groom_photo,
        bride_name: updatedItem.couple.bride_name,
        bride_nickname: updatedItem.couple.bride_nickname,
        bride_parents: updatedItem.couple.bride_parents,
        bride_photo: updatedItem.couple.bride_photo,
        event_date: updatedItem.event_date,
        akad_details: updatedItem.akad,
        resepsi_details: updatedItem.resepsi,
        audio_url: updatedItem.audio_url,
        audio_title: updatedItem.audio_title,
        digital_envelopes: updatedItem.digital_envelopes,
        love_stories: updatedItem.love_stories,
        updated_at: updatedItem.updated_at,
      });
    } catch (e) {
      console.warn('Failed to upsert to Supabase', e);
    }
  }

  return updatedItem;
}

// 4. Delete an invitation
export async function deleteInvitation(invitationId: string): Promise<boolean> {
  let list = getLocalInvitations();
  list = list.filter(i => i.id !== invitationId);
  saveLocalInvitations(list);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('invitations').delete().eq('id', invitationId);
    } catch (e) {
      console.warn('Supabase delete failed', e);
    }
  }
  return true;
}

// 5. Guests Management
export async function getGuestsForInvitation(invitationId: string): Promise<GuestItem[]> {
  const guests = getLocalGuests();
  return guests.filter(g => g.invitation_id === invitationId);
}

export async function addGuest(invitationId: string, name: string, phone: string, category: any, pax: number): Promise<GuestItem> {
  const guests = getLocalGuests();
  const slugCode = name.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

  const newGuest: GuestItem = {
    id: 'gst-' + Math.random().toString(36).substring(2, 9),
    invitation_id: invitationId,
    name: name.trim(),
    phone: phone.trim(),
    category: category || 'Teman',
    pax_allowed: pax || 2,
    slug_code: slugCode,
    is_opened: false,
    status: 'belum_konfirmasi',
    created_at: new Date().toISOString(),
  };

  guests.unshift(newGuest);
  saveLocalGuests(guests);
  return newGuest;
}

export async function deleteGuest(guestId: string): Promise<boolean> {
  let guests = getLocalGuests();
  guests = guests.filter(g => g.id !== guestId);
  saveLocalGuests(guests);
  return true;
}
