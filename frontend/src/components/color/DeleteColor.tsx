import { deleteColor } from '../../services/supabaseClient';


export const handleDeleteColor = async (colorId: string, userId: string | undefined): Promise<boolean> => {
  if (!userId) {
    console.error("User ID is undefined");
    return false; // Return false to indicate failure
  }

  try {
    await deleteColor(colorId, userId); // Wait for the deletion to complete
    return true; // Return true on successful deletion
  } catch (error) {
    console.error("Error deleting color:", error);
    return false; // Return false on error
  }
};
  