import { useEffect, useState } from 'react';
import { fetchUserColors } from '../../services/supabaseClient';
import { IColor } from '../../models/IColor';
import { useLoggedInUser } from '../../hooks/useLoggedInUser';
import { EditColorForm } from './EditColorForm';
import  defaultColorImg from '../../assets/color-img-default.jpg';

import { handleDeleteColor } from './deleteColor';


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

 
/*
  const handleDelete = async (colorId: string) => {
    if (!user?.id) {
      console.error("User not logged in.");
      return;
    }

    const isDeleted = await handleDeleteColor(colorId, user.id);

    if (isDeleted) {
      // Update the state by removing the deleted color
      setColors((prevColors) => prevColors.filter((color) => color.id !== colorId));
    } else {
      console.error("Failed to delete color.");
    }
  };
  */

  const handleDelete = async (colorId: string) => {
    if (!user?.id) {
      console.error("User not logged in.");
      return;
    }

    // Ask for confirmation before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this color?");
    
    if (confirmDelete) {
      const isDeleted = await handleDeleteColor(colorId, user.id);

      if (isDeleted) {
        // Update the state by removing the deleted color
        setColors((prevColors) => prevColors.filter((color) => color.id !== colorId));
      } else {
        console.error("Failed to delete color.");
      }
    } else {
      console.log("Deletion canceled.");
    }
  };
  


  return (
    <div>
      <h2>Your Colours</h2>
      
      {colors.length === 0 ? (
        <p>No colors found.</p>
      ) : (
        <ul className="color-list">
          {colors.map((color) => (
            <li key={color.id}>
              <img
              src={color.imageUrl || defaultColorImg}
              alt={color.colorName}
              style={{ width: '200px', height: '75px' }}
              />
              <p>Colour Name: {color.colorName}</p>
              <p>Medium: {color.colorMedium}</p>
              {color.manufacturer && <p>Manufacturer: {color.manufacturer}</p>}
              {color.colorFamily && (<p>Colour Family: {color.colorFamily}</p>)}
              {color.tags && (<p>Tags: {color.tags}</p>)}
              {color.quantity && color.quantity > 0 && <p>Quantity: {color.quantity}</p>}

              <button onClick={() => handleEdit(color)}>Edit</button>
              <button onClick={() => handleDelete(color.id)}>Delete</button>

              {/* Render the EditColorForm when a color is being edited */}
              {editingColor && (
                <EditColorForm
                  color={editingColor}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};