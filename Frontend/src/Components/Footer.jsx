// src/Footer.js
import React from 'react';
import './Footer.css'; // We'll add styles in this file

const Footer = () => {
  return (
    <footer className="footer">
      <div>
      <footer className="footer">
                <p>&copy; 2024 PeopleBridge, Inc. All rights reserved.</p>
                <div className="footerLinks">
                    <a href="/" className="footerLink">Home</a>
                    <a href="/about" className="footerLink">About</a>
                    <a href="/services" className="footerLink">Services</a>
                    <a href="/contact" className="footerLink">Contact</a>
                    <a href="/privacy" className="footerLink">Privacy Policy</a>
                </div>
            </footer>
        </div>
    </footer>
  );
};

export default Footer;
