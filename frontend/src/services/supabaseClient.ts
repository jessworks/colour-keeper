import { createClient } from '@supabase/supabase-js';
import { IUser } from '../models/IUser';
import { IColor } from '../models/IColor';


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
    .select('user_id, username, email') // remove email?
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


export const uploadImage = async (file: File): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('colors-images')
    .upload(`images/${file.name}`, file);

  if (error) {
    throw new Error('Failed to upload image.');
  }

  // Return the public URL of the uploaded image
  return supabase.storage.from('colors-images').getPublicUrl(data.path).data.publicUrl || '';
};

export const addColor = async (userId: string, colorData: Omit<IColor, 'id'>) => {
  try {
    const { data, error } = await supabase.from('colors').insert([
      {
        user_id: userId,
        colorName: colorData.colorName,
        colorMedium: colorData.colorMedium,
        manufacturer: colorData.manufacturer || null,
        colorFamily: colorData.colorFamily || null,
        tags: colorData.tags || null, 
        quantity: colorData.quantity || null,
        imageUrl: colorData.imageUrl || null,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding color:', error);
    throw error;
  }
};


export const fetchUserColors = async (userId: string) => {
  const { data, error } = await supabase
    .from('colors')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching colors:', error);
    throw new Error(`Error fetching colors: ${error.message}`);
  }

  return data;
};


export const editColor = async (id: string, updatedData: Partial<IColor>, userId: string): Promise<void> => {
  try {
    console.log('User ID:', userId);
    
    // Check if the color belongs to the current user by verifying user_id in the colors table
    const { data: color, error: selectError } = await supabase
      .from('colors')
      .select('user_id')
      .eq('id', id)  // Using 'id' to identify the color
      .single(); // Ensures only one result is returned
    if (selectError) {
      throw new Error('Error fetching color: ' + selectError.message);
    }

    console.log('Color User ID:', color?.user_id);

    // !! problemet börjar här !! console.log visar att User ID = ColorUser ID
    if (color?.user_id !== userId) {
      throw new Error('You are not authorized to edit this color');
    }

    /*
    !! försöker update 'id' i 'colors' !! 'id' har inget input fält 
      --> IColors i EditColorForm.tsx problemet?
    */
    const dataExcludeId = Object.assign({}, updatedData);
    delete dataExcludeId.id;

    const { error } = await supabase
      .from('colors')
      .update(dataExcludeId)
      .eq('id', id); 
    if (error) {
      throw new Error('Failed to update color: ' + error.message); // ger det här och 'column "id" can only be updataded in DEFAULT' ref. EditColorForm.tsx 43
    }

    console.log('Color updated successfully');
  } catch (error) {
    console.log(updatedData);
    console.error('Error updating color:', error);
    throw error;
  }
};


export const deleteColor = async (id: string, userId: string): Promise<void> => {
  try {
    // Check if the color belongs to the user
    const { data: color, error: fetchError } = await supabase
      .from('colors')
      .select('user_id')
      .eq('id', id) // 'id' refers to the color ID
      .single();

    if (fetchError) {
      throw new Error('Error fetching color: ' + fetchError.message);
    }

    if (color?.user_id !== userId) {
      throw new Error('You are not authorized to delete this color');
    }

    // Delete the color
    const { error: deleteError } = await supabase
      .from('colors')
      .delete()
      .eq('id', id); // 'id' still refers to the color ID

    if (deleteError) {
      throw new Error('Failed to delete color: ' + deleteError.message);
    }

    console.log('Color deleted successfully');
  } catch (error) {
    console.error('Error deleting color:', error);
    throw error;
  }
};
