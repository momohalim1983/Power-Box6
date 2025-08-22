import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL ||
  "https://mylaafierzsaabrmhcml.supabase.co";
const supabaseKey =
  import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bGFhZmllcnpzYWFicm1oY21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MjE3NjYsImV4cCI6MjA3MTI5Nzc2Nn0.NieaPGzGiJKc3pMeYUqGEuw5x2_-2tQeV2S0-iPPPtc";

export const supabase = createClient(supabaseUrl, supabaseKey);
