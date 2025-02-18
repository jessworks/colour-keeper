import { useState } from 'react';
import { editColor } from '../../services/supabaseClient';
import { IColor } from '../../models/IColor';
import { useLoggedInUser } from '../../hooks/useLoggedInUser';


interface EditColorFormProps {
  color: IColor;
  onSave: (updatedColor: IColor) => void; // Callback to refresh the color list after saving
  onCancel: () => void; // Callback to close the edit form
}


export const EditColorForm = ({ color, onSave, onCancel }: EditColorFormProps) => {
  const [updatedColor, setUpdatedColor] = useState<IColor>(color);
  const [error, setError] = useState<string | null>(null);

  const loggedInUser  = useLoggedInUser();
  const userId = loggedInUser?.user?.id;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedColor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting update:', updatedColor);

    if (!userId) {
      setError('User is not logged in');
      return;
    }

    /* !! problemet börjar här !!
        --> den ska uppdatera det som ligger under färgens id, men får inte uppdatera själva id
        --> updatedData: Partial<IColor> uppdaterar det som ändrats
        --> borde updatedColor useState vara som 'Partial<IColor>'?
        --> säger updatedColor att allt i IColor ska in?
            --> om ja, hur stoppar jag det?
    */
    try {
      await editColor(updatedColor.id, updatedColor, userId); // Update in Supabase
      onSave(updatedColor); // Refresh local state in parent

    } catch (err) {
      console.error('Failed to update color:', err);  // ref. supabaseClient.tsx 161
      setError('Failed to save changes. Please try again.');
    }
  };


  return (
    <div className="form-container edit-color-form-container">
      <form onSubmit={handleSubmit} className="edit-color-form">
        <h3>Edit Color</h3>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label htmlFor="colorName">Color Name*</label>
        <input
          type="text"
          id="colorName"
          name="colorName"
          value={updatedColor.colorName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="colorMedium">Medium*</label>
        <input
          type="text"
          id="colorMedium"
          name="colorMedium"
          value={updatedColor.colorMedium}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="manufacturer">Manufacturer</label>
        <input
          type="text"
          id="manufacturer"
          name="manufacturer"
          value={updatedColor.manufacturer || ''}
          onChange={handleInputChange}
        />

        <label htmlFor="colorFamily">Color Family</label>
        <input
          type="text"
          id="colorFamily"
          name="colorFamily"
          value={updatedColor.colorFamily || ''}
          onChange={handleInputChange}
        />

        <label htmlFor="tags">Tags (ex: cold, opaque)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={(updatedColor.tags || []).join(', ')}
          onChange={(e) =>
            setUpdatedColor((prev) => ({
              ...prev,
              tags: e.target.value.split(',').map((tag) => tag.trim()),
            }))
          }
        />

        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={updatedColor.quantity || 0}
          onChange={handleInputChange}
        />

        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};
