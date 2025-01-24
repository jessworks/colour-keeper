import  { useState } from 'react';
import { IUser } from '../../models/IUser';
import { supabase } from '../../services/supabaseClient';

export const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<IUser | null>(null);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      // Step 1: Sign in the user with Supabase Authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Step 2: If authentication is successful, fetch user data from the `users` table
      if (authData?.user) {
        const { user: authUser } = authData;
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', authUser.id)
          .single(); // Fetch the user from the 'users' table

        if (userError) {
          throw new Error(userError.message);
        }

        // Set the user data in the state
        if (userData) {
          setUser({
            id: userData.user_id,
            username: userData.username,
            email: userData.email,
          });
          setSuccess('Login successful!');
        }
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      {error && <div>{error}</div>}
      {success && <div>{success}</div>}

      {user && <div>Hello {user.username}! Let's look at some colours.</div>}
    </div>
  );
};
