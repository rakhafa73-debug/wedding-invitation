import { supabase, isSupabaseConfigured } from './supabase';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export async function uploadWeddingPhoto(
  file: File,
  folder: 'couples' | 'gallery' | 'covers' = 'gallery'
): Promise<{ success: boolean; url?: string; error?: string }> {
  // 1. Validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { success: false, error: 'Hanya format JPG, PNG, atau WebP yang diperbolehkan.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: 'Ukuran foto maksimal 5MB.' };
  }

  // 2. If Supabase is connected, try uploading to 'wedding-photos' bucket
  if (isSupabaseConfigured && supabase) {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;

      const { data, error } = await supabase.storage
        .from('wedding-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('wedding-photos')
          .getPublicUrl(fileName);

        return { success: true, url: publicUrlData.publicUrl };
      }
    } catch (e: any) {
      console.warn('Supabase storage upload failed, falling back to local object URL', e);
    }
  }

  // 3. Fallback: Create optimized base64 or object URL for demo/offline use
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({ success: true, url: e.target?.result as string });
    };
    reader.onerror = () => {
      resolve({ success: false, error: 'Gagal membaca file gambar.' });
    };
    reader.readAsDataURL(file);
  });
}
