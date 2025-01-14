import { createClient } from '@supabase/supabase-js';
import { IUser } from '../models/IUser';


// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

/*
export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<IUser> => {
  
 // Step 1: Sign up the user with Supabase Authentication
  const { data, error } = await supabase.auth.signUp({ 
    email,
    password,
  });

  if (error) {
    throw new Error(error.message); //handle signup error
  }


  // Return the mapped IUser object
  if (data.user) {
    return {
      id: data.user.id,
      username,
      email,
      password, // Avoid storing raw passwords like this in production!
      };
    }

  throw new Error('User registration failed.');
};
*/

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
      password, // Avoid exposing the password in production!
    };
  }

  throw new Error('User registration failed.');
};
