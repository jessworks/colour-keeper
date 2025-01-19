import { useEffect, useState } from 'react';
import { fetchUserColors } from '../../services/supabaseClient';
import { IColors } from '../../models/IColor';
import { useLoggedInUser } from '../../hooks/useLoggedInUser';

const ColorList = () => {
  const [colors, setColors] = useState<IColors[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useLoggedInUser(); // Get the logged-in user info

  useEffect(() => {
    if (!user) {
      console.log('No user logged in.');
      return;
    }

    const fetchColors = async () => {
      try {
        const data = await fetchUserColors(user.id);
        setColors(data || []);
      } catch (err) {
        if (err instanceof Error) {
          // Now TypeScript knows that err is an instance of Error
          console.error('Error fetching user colors:', err);
          setError(err.message);
        } else {
          // Handle case where err is not an instance of Error
          console.error('Unexpected error:', err);
          setError('An unknown error occurred.');
        }
      }
    };
    
  

    fetchColors();
  }, [user]);

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
              <p><strong>Name:</strong> {color.colorName}</p>
              <p><strong>Medium:</strong> {color.colorMedium}</p>
              {color.manufacturer && <p><strong>Manufacturer:</strong> {color.manufacturer}</p>}
              {color.quantity !== undefined && <p><strong>Quantity:</strong> {color.quantity}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ColorList;
