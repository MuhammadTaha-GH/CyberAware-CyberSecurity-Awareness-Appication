
import { createClient } from '@supabase/supabase-js';

// Project URL and Anon/Publishable Key provided by the user.
// WARNING: The Secret Key (service_role) should NEVER be used in the client-side code
// as it bypasses all Row Level Security (RLS) and exposes your entire database.
const supabaseUrl = 'https://lorvjqmxvbggbmogfsno.supabase.co';
const supabaseAnonKey = 'sb_publishable_N4UCstea60E5HEXmSCAwmg_EPhyNq9T';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
