// Navigation.tsx
import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/Colors">Colours</Link></li>
      </ul>
    </nav>
  );
};