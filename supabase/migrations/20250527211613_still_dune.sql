/*
  # Add guest flag to profiles table

  1. Changes
    - Add is_guest column to profiles table with default false
*/

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT FALSE;