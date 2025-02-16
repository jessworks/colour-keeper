import { useState, useEffect, useRef } from 'react';
import { Navigation } from './Navigation';
import '../styles/components/header.scss';


export const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTop = useRef(0); // Use useRef to store the last scroll position

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset; //alternative to pageYOffset

      if (currentScroll > lastScrollTop.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollTop.current = currentScroll <= 0 ? 0 : currentScroll; // Update the scroll position
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <header className={`header ${isVisible ? 'visible' : 'hidden'}`}>
      <h1>Colour Keeper</h1>
      <Navigation />
    </header>
  );
};
