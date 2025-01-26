import { useEffect, useState } from 'react';
import { fetchUserColors } from '../../services/supabaseClient';
import { IColor } from '../../models/IColor';
import { useLoggedInUser } from '../../hooks/useLoggedInUser';
import { EditColorForm } from './EditColorForm';


export const ColorList = () => {
  const [colors, setColors] = useState<IColor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingColor, setEditingColor] = useState<IColor | null>(null); // Track color being edited
  const { user } = useLoggedInUser(); // Get the logged-in user info

  useEffect(() => {
    if (!user) {
      console.log('No user logged in.');
      return;
    }

    const fetchColors = async () => {
      try {
        const data = await fetchUserColors(user.id);
        console.log('Fetched colors:', data); // Debugging line to check fetched data
        setColors(data || []);

      } catch (err) {
        console.error('Error fetching user colors:', err);
        setError('Failed to load colors.');
      }
    };
    
    fetchColors();
  }, [user]);

   // Log when editingColor changes
   useEffect(() => {
    if (editingColor) {
      console.log('Editing color:', editingColor);
    }
  }, [editingColor]); // Dependency on editingColor to log each time it changes

  const handleEdit = (color: IColor) => {
    console.log('Editing color:', color);
    setEditingColor(color);
    console.log('Current editingColor:', editingColor);

  };

  const handleSave = (updatedColor: IColor) => {
    setColors((prevColors) =>
      prevColors.map((color) =>
        color.id === updatedColor.id ? updatedColor : color
      )
    );

    setEditingColor(null); // Close the edit form after saving
  };

  const handleCancel = () => {
    setEditingColor(null); // Close the edit form without saving
  };

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div>
      <h2>Your Colors</h2>
      
      {colors.length === 0 ? (
        <p>No colors found.</p>
      ) : (
        <ul>
          {colors.map((color) => (
            <li key={color.id}>
              <img src={color.imageUrl} alt={color.colorName} style={{ width: '50px', height: '50px' }} />
              <p>Colour Name: {color.colorName}</p>
              <p>Medium: {color.colorMedium}</p>
              {color.manufacturer && <p>Manufacturer: {color.manufacturer}</p>}
              {color.colorFamily && (<p>Colour Family: {color.colorFamily}</p>)}
              {color.tags && (<p>Tags: {color.tags}</p>)}
              {color.quantity && color.quantity > 0 && <p>Quantity: {color.quantity}</p>}
              <button onClick={() => handleEdit(color)}>Edit</button>
            </li>
          ))}
        </ul>
      )}


      {/* Render the EditColorForm when a color is being edited */}
      {editingColor && (
        <EditColorForm
          color={editingColor}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

    </div>
  );
};