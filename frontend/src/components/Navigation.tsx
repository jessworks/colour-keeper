import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <nav className='navbar'>

      <ul className='nav'>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/Colors">Colours</Link></li>
      </ul>
    </nav>
  );
};