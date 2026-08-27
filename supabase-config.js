// ============================================
// GAME OVER TECH — Configuración de Supabase
// La "publishable key" es segura de exponer en el navegador:
// está diseñada para eso, protegida por las políticas RLS
// que configuramos en la base de datos.
// ============================================
const SUPABASE_URL = "https://fvwdsplgnhnlyckggmow.supabase.co";
const SUPABASE_KEY = "sb_publishable_AnrwgFyjOy2q17DqB14w_A_RcVbwBHS";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
