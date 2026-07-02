import { createClient } from '@supabase/supabase-js';

// Read configuration with fallback to the user's provided values
// @ts-ignore
const rawUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mzcksxtcyzvgzlvhbkaw.supabase.co/rest/v1/';
// @ts-ignore
const rawKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Yc4Rz2D5G0BdRpH-iQyCXA_4_E4CBaz';

// Clean the Supabase URL by removing surrounding quotes, parentheses, trailing spaces, and rest/v1 suffixes
const cleanUrl = rawUrl
  ? rawUrl.trim()
      .replace(/^['"(\s]+|['")\s]+$/g, '') // Strip quotes, parentheses, spaces at start/end
      .replace(/\/rest\/v1\/?$/, '')        // Remove /rest/v1 suffix
      .replace(/\/$/, '')                  // Remove trailing slash
  : '';

// Clean the Supabase Anon Key as well
const supabaseKey = rawKey
  ? rawKey.trim().replace(/^['"(\s]+|['")\s]+$/g, '')
  : '';

console.log('[Supabase Client] Initializing...');
console.log('[Supabase Client] Clean URL is: ' + cleanUrl);
console.log('[Supabase Client] Key length: ' + (supabaseKey ? supabaseKey.length : 0));
console.log('[Supabase Client] Key start/end preview: ' + (supabaseKey ? (supabaseKey.substring(0, 6) + '...' + supabaseKey.substring(supabaseKey.length - 4)) : 'None'));

export const supabase = createClient(cleanUrl, supabaseKey);

