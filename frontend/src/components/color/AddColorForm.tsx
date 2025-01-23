import { useState } from 'react';
import { supabase, uploadImage, addColor } from '../../services/supabaseClient'; // Import functions
import { IColors } from '../../models/IColor';

export const AddColorForm = () => {
  const [formData, setFormData] = useState<Omit<IColors, 'id'>>({
    imageUrl: '',
    colorName: '',
    colorMedium: '',
    manufacturer: '',
    colorFamily: '',
    tags: [], // Tags should be an array
    quantity: 0,
  });

  const [file, setFile] = useState<File | null>(null);
  const [isFormVisible, setFormVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      const cleanedTags = value
        .split(',') // Split by comma
        .map((tag) => tag.trim()) // Trim spaces around each tag
        .filter((tag) => tag !== ''); // Remove empty tags
      
      setFormData((prev) => ({
        ...prev,
        tags: cleanedTags, // Update the tags array in formData
      }));

      // Update the input field to show cleaned tags with proper spacing
      e.target.value = cleanedTags.join(', '); // Show comma-separated tags in the input field
      
    } else {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value 
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      let imageUrl = formData.imageUrl;
  
      // Upload the image if a file is provided
      if (file) {
        imageUrl = await uploadImage(file);
      }
  
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
  
      if (sessionError || !session) {
        throw new Error('User not authenticated');
      }
  
      const userId = session.user.id; // Get the user's ID from the session
  
      // Add the color to the database
      await addColor(userId, {
        ...formData,
        imageUrl,
      });
  
      alert('Color added successfully!');
  
      // Reset the form
      setFormData({
        imageUrl: '',
        colorName: '',
        colorMedium: '',
        manufacturer: '',
        colorFamily: '',
        tags: [], // Reset to an empty array
        quantity: 0,
      });
  
      setFile(null);
      setFormVisible(false);
    } catch (error) {
      console.error('Error adding color:', error);
      alert('Failed to add color. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={() => setFormVisible((prev) => !prev)}>
        {isFormVisible ? 'Cancel' : 'Add Color'}
      </button>
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="imageUrl">Upload Image of Color</label>
          <input type="file" id="imageUrl" onChange={handleFileChange} />

          <label htmlFor="colorName">Colour Name*</label>
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
            value={formData.manufacturer}
            onChange={handleChange}
          />

          <label htmlFor="colorFamily">Colour Family</label>
          <input
            type="text"
            id="colorFamily"
            name="colorFamily"
            value={formData.colorFamily}
            onChange={handleChange}
          />

          <label htmlFor="tags">Tags (ex: cold, opaque)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags.join(', ')} // Join tags with commas to display them in the input
            onChange={handleChange}
          />

          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />

          <button type="submit">Add Color</button>
        </form>
      )}
    </div>
  );
};
