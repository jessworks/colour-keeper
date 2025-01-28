import { useState } from 'react';
import { Link } from 'react-router-dom';


export const Navigation = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className={`navbar ${isActive ? 'active' : ''}`}>
       <button className={`burger-menu ${isActive ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle Menu">
        <span className={isActive ? 'bar active' : 'bar'}></span>
        <span className={isActive ? 'bar active' : 'bar'}></span>
        <span className={isActive ? 'bar active' : 'bar'}></span>
      </button>

      <ul className="nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/Colors">Colours</Link></li>
      </ul>
    </nav>
  );
};