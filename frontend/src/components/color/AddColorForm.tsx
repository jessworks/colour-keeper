import { useState } from 'react';
import { supabase } from '../../services/supabaseClient'; // Import your Supabase client instance
import { IColors } from '../../models/IColor';

const AddColorForm = () => {
  const [formData, setFormData] = useState<Omit<IColors, 'id'>>({
    imageUrl: '',
    colorName: '',
    colorMedium: '',
    manufacturer: '',
    colorFamily: '',
    tags: '',
    quantity: 0,
  });

  const [file, setFile] = useState<File | null>(null);
  const [isFormVisible, setFormVisible] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = formData.imageUrl;

      // Upload the image to Supabase Storage
      if (file) {
        const { data, error } = await supabase.storage
          .from('colors-images')
          .upload(`images/${file.name}`, file);

        if (error) throw new Error('Failed to upload image.');
        
        imageUrl = data?.path
          ? supabase.storage.from('colors-images').getPublicUrl(data.path).data.publicUrl || ''
          : '';
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('User not authenticated');
      }

      const userId = session.user.id; // Get the user ID from the session

      // Insert the color data into Supabase
      const { error: insertError } = await supabase.from('colors').insert([
        {
          imageUrl: imageUrl || null,
          colorName: formData.colorName,
          colorMedium: formData.colorMedium,
          manufacturer: formData.manufacturer || null,
          colorFamily: formData.colorFamily || null,
          tags: formData.tags || null,
          quantity: formData.quantity || null,
          user_id: userId,
        },
      ]);

      if (insertError) throw new Error ('Failed to add color to database.');

      alert('Color added successfully!');

      setFormData({
        imageUrl: '',
        colorName: '',
        colorMedium: '',
        manufacturer: '',
        colorFamily: '',
        tags: '',
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
          <input type="text" id="colorName" name="colorName" value={formData.colorName} onChange={handleChange} required />

          <label htmlFor="colorMedium">Medium*</label>
          <input type="text" id="colorMedium" name="colorMedium" value={formData.colorMedium} onChange={handleChange} required />

          <label htmlFor="manufacturer">Manufacturer</label>
          <input type="text" id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} />

          <label htmlFor="colorFamily">Colour Family</label>
          <input type="text" id="colorFamily" name="colorFamily" value={formData.colorFamily} onChange={handleChange} />

          <label htmlFor="tags">Tags (ex: cold, opaque)</label>
          <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} />

          <label htmlFor="quantity">Quantity</label>
          <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} />

          <button type="submit">Add Color</button>
        </form>
      )}
    </div>
  );
};

export default AddColorForm;