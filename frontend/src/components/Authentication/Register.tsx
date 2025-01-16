import React, { useState } from 'react';
import { IUser } from '../../models/IUser';
import { registerUser } from '../../services/supabaseClient';


const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');
    
  const [user, setUser] = useState<IUser | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const registeredUser = await registerUser(username, email, password);
      setUser(registeredUser);  // Store the user object in the state
      setSuccess('Registration successful!');
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  };


  return (
    <div>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
       
        <button type="submit">Register</button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}

      {/* Display the welcome message if user is registered */}
      {user && <div>Welcome, {user.username}!</div>}

    </div>
  );
};

export default Register;

