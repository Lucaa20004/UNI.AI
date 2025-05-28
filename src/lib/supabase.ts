import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zjrjeyrfviqmdmfytruv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqcmpleXJmdmlxbWRtZnl0cnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Mjg0MjEsImV4cCI6MjA2NDAwNDQyMX0.fbYc9MZB5lmtoi53knNZ_Cjbf87P1YF_NglYKYjVVDc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);