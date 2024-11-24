import React from 'react';
import { Link, Outlet } from 'react-router-dom'; // Import Link and Outlet
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  return (
    <>
      <nav className="navbar">
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
        </ul>
      </nav>
      <Outlet /> {/* Outlet is used to render the matched child route */}
    </>
  );
};

export default Navbar;
