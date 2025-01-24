import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';


export const Logout = () => {
  const [message, setMessage] = useState<string>('');

  const handleLogout = async () => {
    setMessage('');

    try {
      await supabase.auth.signOut();

      // Reset the frontend state (e.g., user state in a parent component)
      setMessage('Logout successful!');
     
    } catch (err) {
      console.error(err);
      setMessage('Error logging out');
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      {message && <div>{message}</div>}
    </div>
  );
};
