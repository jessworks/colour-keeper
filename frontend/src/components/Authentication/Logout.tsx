import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useLoggedInUser } from '../../hooks/useLoggedInUser';


export const Logout = () => {
  const [message, setMessage] = useState<string>('');
  const { clearUser } = useLoggedInUser(); // Access the clearUser function

  const handleLogout = async () => {
    clearUser(); // Explicitly clear user state
    setMessage('');

    try {
      await supabase.auth.signOut();

      setMessage('Logout successful!');
      setTimeout(() => setMessage(''), 3000);
     
    } catch (err) {
      console.error(err);
      setMessage('Error logging out');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      {message && <p>{message}</p>}
    </div>
  );
};
