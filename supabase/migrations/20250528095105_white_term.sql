/*
  # Create profiles table and security policies

  1. New Types
    - `user_role` enum with values 'user' and 'admin'
  
  2. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `role` (user_role, default: 'user')
      - `username` (text, nullable)
      - `updated_at` (timestamptz, default: now())
      - `created_at` (timestamptz, default: now())
      - `is_guest` (boolean, default: false)
  
  3. Security
    - Enable RLS on profiles table
    - Add policies for:
      - Users can read own profile
      - Users can update own profile
      - Users can delete own profile
      - Admins can read all profiles
      - Users can insert their own profile
*/

-- Drop existing objects if they exist
DROP TABLE IF EXISTS profiles;
DROP TYPE IF EXISTS user_role;

-- Create user_role enum type
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role DEFAULT 'user',
  username text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  is_guest boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO public
  USING (auth.uid() = id);

CREATE POLICY "User can update own profile"
  ON profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "User can delete own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles profiles_1
      WHERE profiles_1.id = auth.uid() AND profiles_1.role = 'admin'
    )
  );

CREATE POLICY "User can insert profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create trigger to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();