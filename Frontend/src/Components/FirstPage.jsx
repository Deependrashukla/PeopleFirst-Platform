// src/FirstPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FirstPage.css';
import img1 from '../assets/people.png';
import img2 from '../assets/image2.png';
import img3 from '../assets/image3.png';

const FirstPage = () => {
  const images = [img1, img2, img3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate(); // Safe to use useNavigate here

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleGetStartedClick = () => {
    navigate('/select-role/customer'); // Navigate to the role selection page
  };

  return (
    <div className="first-page-container">
      <header className="hero-section">
        <h1>People First</h1>
        <p>Your well-being is our priority</p>
        <img
          src={images[currentImageIndex]}
          alt="Slideshow"
          className="slideshow-image"
        />
        <button className="cta-button" onClick={handleGetStartedClick}>
          Get Started
        </button>
      </header>
      <section className="intro-section">
        <h2>Why People First?</h2>
        <p>
          We believe in building a world where people come first. Our goal is to
          ensure that everyone gets the opportunity to thrive in their work,
          personal lives, and communities.
        </p>
      </section>
    </div>
  );
};

export default FirstPage;
