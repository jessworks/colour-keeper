import { createClient } from '@supabase/supabase-js';
import { IUser } from '../models/IUser';


// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);


export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<IUser> => {
  // Step 1: Sign up the user with Supabase Authentication
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // Step 2: Insert user details into the `users` table
  if (authData.user) {
    const { id: userId } = authData.user; // Extract user_id from the auth response

    const { error: dbError } = await supabase.from('users').insert([
      {
        user_id: userId, // Use the same user_id from Supabase Auth
        username,
        email,
      },
    ]);

    if (dbError) {
      throw new Error(dbError.message);
    }

    // Return the IUser object
    return {
      id: userId,
      username,
      email,
    };
  }

  throw new Error('User registration failed.');
};


export const fetchUserDetails = async (userId: string): Promise<IUser> => {
  const { data, error } = await supabase
    .from('users') // Table name as string
    .select('user_id, username, email') // Columns to fetch
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(`Error fetching user details: ${error.message}`);
  }

  // Map fields from the database to IUser
  return {
    id: data.user_id, // `user_id` from database becomes `id`
    username: data.username,
    email: data.email,
  };
};


export const fetchUserColors = async (userId: string) => {
  const { data, error } = await supabase
    .from('colors')
    .select('*') // Select all fields or specify required ones
    .eq('user_id', userId); // Match colors to the user's user_id

  if (error) {
    console.error('Error fetching colors:', error);
    throw new Error(`Error fetching colors: ${error.message}`);
  }

  return data;
};
