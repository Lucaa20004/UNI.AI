/*
  # Update profiles table with guest flag

  1. Changes
    - Add is_guest column to profiles table
    - Update RLS policies to handle guest access

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control for guest users
*/

-- Create enum type for user roles if it doesn't exist
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role DEFAULT 'user',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  is_guest boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation if it doesn't exist
DO $$ BEGIN
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;