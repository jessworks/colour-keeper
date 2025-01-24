import { useState } from 'react';
import { editColor } from '../../services/supabaseClient';
import { IColor } from '../../models/IColor';

interface EditColorFormProps {
  color: IColor;
  onSave: () => void; // Callback to refresh the color list after saving
  onCancel: () => void; // Callback to close the edit form
}

export const EditColorForm: React.FC<EditColorFormProps> = ({ color, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<IColor, 'id'>>(color);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      const cleanedTags = value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');
      setFormData((prev) => ({ ...prev, tags: cleanedTags }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editColor(color.id, formData);
      alert('Color updated successfully!');
      onSave(); // Refresh the list
    } catch (error) {
      console.error('Failed to update color:', error);
      alert('Error updating color. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Color</h3>

      <label htmlFor="colorName">Color Name*</label>
      <input
        type="text"
        id="colorName"
        name="colorName"
        value={formData.colorName}
        onChange={handleChange}
        required
      />

      <label htmlFor="colorMedium">Medium*</label>
      <input
        type="text"
        id="colorMedium"
        name="colorMedium"
        value={formData.colorMedium}
        onChange={handleChange}
        required
      />

      <label htmlFor="manufacturer">Manufacturer</label>
      <input
        type="text"
        id="manufacturer"
        name="manufacturer"
        value={formData.manufacturer || ''}
        onChange={handleChange}
      />

      <label htmlFor="colorFamily">Color Family</label>
      <input
        type="text"
        id="colorFamily"
        name="colorFamily"
        value={formData.colorFamily || ''}
        onChange={handleChange}
      />

      <label htmlFor="tags">Tags (comma-separated)</label>
      <input
        type="text"
        id="tags"
        name="tags"
        value={(formData.tags || []).join(', ')}
        onChange={handleChange}
      />

      <label htmlFor="quantity">Quantity</label>
      <input
        type="number"
        id="quantity"
        name="quantity"
        value={formData.quantity || 0}
        onChange={handleChange}
      />

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};
