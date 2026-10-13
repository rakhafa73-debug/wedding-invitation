import { supabase, isSupabaseConfigured } from './supabase';
import { RSVPResponseItem } from '../types/wedding';
import { INITIAL_RSVPS } from '../data/seedData';

const RSVPS_STORAGE_KEY = 'nuptia_rsvps_store';

function getLocalRSVPs(): RSVPResponseItem[] {
  const stored = localStorage.getItem(RSVPS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(RSVPS_STORAGE_KEY, JSON.stringify(INITIAL_RSVPS));
    return INITIAL_RSVPS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_RSVPS;
  }
}

function saveLocalRSVPs(items: RSVPResponseItem[]) {
  localStorage.setItem(RSVPS_STORAGE_KEY, JSON.stringify(items));
}

export async function getRSVPsForInvitation(invitationId: string): Promise<RSVPResponseItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as RSVPResponseItem[];
      }
    } catch (e) {
      console.warn('Supabase getRSVPs failed, using local store', e);
    }
  }

  const all = getLocalRSVPs();
  return all.filter(r => r.invitation_id === invitationId);
}

export async function submitRSVP(
  invitationId: string,
  guestName: string,
  attendance: 'hadir' | 'tidak' | 'ragu',
  pax: number,
  message: string
): Promise<{ success: boolean; data?: RSVPResponseItem; error?: string }> {
  // Input validation
  const cleanName = guestName.trim();
  const cleanMessage = message.trim();

  if (!cleanName) {
    return { success: false, error: 'Silakan masukkan nama Anda.' };
  }

  if (pax < 0 || pax > 10) {
    return { success: false, error: 'Jumlah tamu harus antara 1 sampai 10 orang.' };
  }

  if (cleanMessage.length > 1000) {
    return { success: false, error: 'Ucapan maksimal 1000 karakter.' };
  }

  const newRSVP: RSVPResponseItem = {
    id: 'rsvp-' + Math.random().toString(36).substring(2, 9),
    invitation_id: invitationId,
    guest_name: cleanName,
    attendance,
    pax: attendance === 'tidak' ? 0 : Math.max(1, pax),
    message: cleanMessage,
    created_at: new Date().toISOString(),
  };

  // Local storage save
  const list = getLocalRSVPs();
  list.unshift(newRSVP);
  saveLocalRSVPs(list);

  // If Supabase is connected, insert record
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('rsvp_responses').insert({
        id: newRSVP.id,
        invitation_id: invitationId,
        guest_name: cleanName,
        attendance,
        pax: newRSVP.pax,
        message: cleanMessage,
      });

      if (error) {
        console.warn('Supabase insert RSVP returned error:', error);
      }
    } catch (e: any) {
      console.warn('Failed to insert RSVP to Supabase', e);
    }
  }

  return { success: true, data: newRSVP };
}
