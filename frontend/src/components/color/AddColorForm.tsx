import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient'; // Import your Supabase client instance
import { IColors } from '../../models/IColor';

const AddColorForm = () => {
  const [formData, setFormData] = useState<IColors>({
    id: '',
    imageUrl: '',
    colorName: '',
    colorMedium: '',
    manufacturer: '',
    colorFamily: '',
    tags: '',
    quantity: 0,
  });

  const [file, setFile] = useState<File | null>(null);

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
          .from('colors')
          .upload(`images/${file.name}`, file);

        if (error) throw error;
        imageUrl = data?.path
          ? supabase.storage.from('colors').getPublicUrl(data.path).data.publicUrl || ''
          : '';
      }

      // Insert the color data into Supabase
      const { error: insertError } = await supabase.from('colors').insert([
        {
          colorName: formData.colorName,
          medium: formData.colorMedium,
          manufacturer: formData.manufacturer,
          colorFamily: formData.colorFamily,
          tags: formData.tags,
          quantity: formData.quantity,
          image_url: imageUrl,
          user_id: supabase.auth.user()?.id,
        },
      ]);

      if (insertError) throw insertError;

      alert('Color added successfully!');
      setFormData({
        id: '',
        imageUrl: '',
        colorName: '',
        colorMedium: '',
        manufacturer: '',
        colorFamily: '',
        tags: '',
        quantity: 0,
      });
      setFile(null);
    } catch (error) {
      console.error('Error adding color:', error);
      alert('Failed to add color. Please try again.');
    }
  };


    return (
        <form onSubmit={handleSubmit}>
             <label htmlFor="imageUrl">Upload Image</label>
            <input type="file" id="imageUrl" value={formData.imageUrl} onChange={handleFileChange} />

            <label htmlFor="colorName">Colour Name</label>
            <input type="text" id="colorName" value={formData.colorName} onChange={handleChange} required />

            <label htmlFor="colorMedium">Medium</label>
            <input type="text" id="colorMedium" value={formData.colorMedium} onChange={handleChange} required />

            <label htmlFor="manufacturer">manufacturer</label>
            <input type="text" id="manufacturer" value={formData.manufacturer} onChange={handleChange} />

            <label htmlFor="colorFamily">Colour Family</label>
            <input type="text" id="colorFamily" value={formData.colorFamily} onChange={handleChange} />

            <label htmlFor="tags">Tags (comma-separated)</label>
            <input type="text" id="tags" value={formData.tags} onChange={handleChange} />

            <label htmlFor="quantity">Quantity</label>
            <input type="number" id="quantity" value={formData.quantity} onChange={handleChange} />

            <button type="submit">Add Color</button>
        </form>
    );
};

export default AddColorForm;
