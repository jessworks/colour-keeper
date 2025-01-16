import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

const Logout = () => {
  const [message, setMessage] = useState<string>('');

  const handleLogout = async () => {
    setMessage('');

    try {
      // Log the user out using Supabase Authentication
      await supabase.auth.signOut();

      // Reset the frontend state (e.g., user state in a parent component)
      setMessage('Logout successful!');
      // You might want to redirect the user to the login or home page after logout
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

export default Logout;
