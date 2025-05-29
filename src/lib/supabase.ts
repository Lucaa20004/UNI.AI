import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kcdyrmcfqmvafaouhusn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZHlybWNmcW12YWZhb3VodXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MDU4NzEsImV4cCI6MjA2NDA4MTg3MX0.RJDunm5agnFcX5OCVa-vciweyDDnReDjEQKAULLgtb4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);