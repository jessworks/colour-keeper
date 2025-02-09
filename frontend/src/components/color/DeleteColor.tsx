import { deleteColor } from '../../services/supabaseClient';


/*
export const handleDeleteColor = async (
  colorId: string, // This is the color's id
  user: IUser | null,
  onDelete: (deletedColorId: string) => void
) => {
  if (!user) return;

  const confirmDelete = window.confirm('Are you sure you want to delete this color?');
  if (!confirmDelete) return;

  try {
    await deleteColor(colorId, user.id); // Pass correct values
    onDelete(colorId); // Remove color from UI
  } catch (err) {
    console.error('Error deleting color:', err);
  }
};
*/



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

  
  