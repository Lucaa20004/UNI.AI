import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export function useSupabaseQuery<T>(
  key: string[],
  query: () => Promise<{ data: T | null; error: PostgrestError | null }>
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await query();
      if (error) throw error;
      return data;
    },
  });
}

export function useSupabaseMutation<T, TVariables>(
  key: string[],
  mutationFn: (variables: TVariables) => Promise<{ data: T | null; error: PostgrestError | null }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const { data, error } = await mutationFn(variables);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}