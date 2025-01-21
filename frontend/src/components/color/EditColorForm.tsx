import { useState } from 'react';
import { editColor } from '../../services/supabaseClient';
import { IColors } from '../../models/IColor';

interface EditColorFormProps {
  color: IColors;
  onSave: (updatedColor: IColors) => void;
  onCancel: () => void;
}

export const EditColorForm = ({ color, onSave, onCancel }: EditColorFormProps) => {
  const [formData, setFormData] = useState<IColors>({
    ...color,
    manufacturer: color.manufacturer || '',
    colorFamily: color.colorFamily || '',
    tags: color.tags || '',
    quantity: color.quantity ?? 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(0, Number(value)) : value, // Prevent negative quantity
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the service function to update the color
      await editColor(formData.id, {
        colorName: formData.colorName,
        colorMedium: formData.colorMedium,
        manufacturer: formData.manufacturer,
        colorFamily: formData.colorFamily,
        tags: formData.tags,
        quantity: formData.quantity,
      });

      onSave(formData); // Notify the parent component with the updated color
    } catch (error) {
      console.error('Error updating color:', error);
      alert('Failed to update color. Please try again.');
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
        placeholder="Enter the color name"
      />

      <label htmlFor="colorMedium">Medium*</label>
      <input
        type="text"
        id="colorMedium"
        name="colorMedium"
        value={formData.colorMedium}
        onChange={handleChange}
        required
        placeholder="e.g., Watercolor, Oil"
      />

      <label htmlFor="manufacturer">Manufacturer</label>
      <input
        type="text"
        id="manufacturer"
        name="manufacturer"
        value={formData.manufacturer}
        onChange={handleChange}
        placeholder="Enter the manufacturer"
      />

      <label htmlFor="colorFamily">Color Family</label>
      <input
        type="text"
        id="colorFamily"
        name="colorFamily"
        value={formData.colorFamily}
        onChange={handleChange}
        placeholder="e.g., Red, Blue"
      />

      <label htmlFor="tags">Tags</label>
      <input
        type="text"
        id="tags"
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        placeholder="e.g., warm, opaque"
      />

      <label htmlFor="quantity">Quantity</label>
      <input
        type="number"
        id="quantity"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        min={0}
        placeholder="Enter the quantity"
      />

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};


