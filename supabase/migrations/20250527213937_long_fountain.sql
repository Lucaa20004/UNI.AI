/*
  # Authentication and Profiles Setup
  
  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users
      - `role` (user_role enum) - User role (user/admin)
      - `username` (text, nullable) - Optional username
      - `updated_at` (timestamptz) - Last update timestamp
      - `created_at` (timestamptz) - Creation timestamp
      - `is_guest` (boolean) - Guest user flag
  
  2. Security
    - Enable RLS on profiles table
    - Add policies for profile access
    - Create trigger for new user profile creation
*/

-- Create enum type for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role DEFAULT 'user',
  username text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  is_guest boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
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

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();