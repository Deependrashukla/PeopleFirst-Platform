import React from 'react';
import './About.css';

const About = () => {
  const contributors = [
    {
      name: "John Doe",
      role: "Frontend Developer",
      description: "Passionate about creating seamless user interfaces.",
      photo: "https://via.placeholder.com/150", // Replace with actual photo URLs
    },
    {
      name: "Jane Smith",
      role: "Backend Developer",
      description: "Loves solving complex backend problems.",
      photo: "https://via.placeholder.com/150", // Replace with actual photo URLs
    },
    {
      name: "Alice Johnson",
      role: "UI/UX Designer",
      description: "Focuses on crafting user-friendly designs.",
      photo: "https://via.placeholder.com/150", // Replace with actual photo URLs
    },
  ];

  return (
    <div className="about-container">
      <div className="about-container custom-about-section">
      <header className="about-header">
    <h1>About Us</h1>
    <p>Your trusted partner in delivering world-class services.</p>
  </header>
  
  <section className="about-mission">
    <h2>Our Mission</h2>
    <p>
      Empower professionals to provide exceptional services at your
      doorstep while enhancing customer convenience and satisfaction.
    </p>
  </section>
</div>
      

      <section className="about-contributors">
        <h2>Who We Are</h2>
        <div className="contributors-grid">
          {contributors.map((contributor, index) => (
            <div key={index} className="contributor-card">
              <img src={contributor.photo} alt={contributor.name} />
              <h3>{contributor.name}</h3>
              <p className="role">{contributor.role}</p>
              <p className="description">{contributor.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="about-footer">
        <p>Join us in reshaping service experiences worldwide.</p>
      </footer>
    </div>
  );
};

export default About;
