import React from 'react';
import './FirstPage.css';
import heroImage from '../assets/fp.png'; // Import image from src or move it to public
import quality from '../assets/quality.png';
import satisfaction from '../assets/satisfaction.png';
import workerImage from '../assets/worker.png';
import guideImage from '../assets/hand.png';


const LandingPage = () => {
    return (
        <div>
            {/* Header */}
            {/* <header className="header">
                <div className="logo">People First</div>
                <nav className="nav">
                    <a href="/" className="navLink">Home</a>
                    <a href="/about" className="navLink">About</a>
                    <a href="/services" className="navLink">Services</a>
                    <a href="/contact" className="navLink">Contact</a>
                    
                </nav>
            </header> */}

          {/* Hero Section */}
            <section id="home" className="hero">
            <div className="heroContent">
                <h1 className="heroTitle">We bridge the gap between you and dependable</h1>
                <p className="heroSubtitle">
                Whether you need help with home improvement, office tasks, or specialized services
                </p>
                <button className="button">Get Started Now</button>
                <div className="partners">
                <span>Shell</span>
                <span>Ferrari</span>
                <span>Apple</span>
                <span>Microsoft</span>
                </div>
            </div>
            <div className="heroImage">
                <img src={heroImage} alt="Hero" />
            </div>
            </section>
            


              {/* Experts Section */}
              <section className="experts">
                <h2>Our Experts</h2>
                <p>Meet the skilled professionals ready to assist you</p>
            <div className="expertsNav">
                <span>Call Us</span>
                <span>Schedule</span>
                <span>Explore Services</span>
                <span>FAQ</span>
                <span>Learn More</span>
            </div>
            <div className="imageContainer">
                <img src={workerImage} alt="Expert" />
                <img src={guideImage} alt="Guide" />
                <img src={quality} alt="Quality" />
                <img src={satisfaction} alt="Satisfaction" />
            </div>
            </section>

                  {/* Testimonials Section */}
<div className="testimonials-section">
  <h2>What Our Customers Say</h2>
  <div className="testimonials-grid">
    <div className="testimonial-card">
      <div className="testimonial-content">
        <p>"The cleaner did a fantastic job. My house has never looked better!"</p>
      </div>
      <div className="testimonial-author">
        <span>⭐⭐⭐⭐⭐</span>
        <h4>– Riya</h4>
      </div>
    </div>
    <div className="testimonial-card">
      <div className="testimonial-content">
        <p>"The electrician was punctual and fixed everything perfectly."</p>
      </div>
      <div className="testimonial-author">
        <span>⭐⭐⭐⭐⭐</span>
        <h4>– Suresh</h4>
      </div>
    </div>
    <div className="testimonial-card">
      <div className="testimonial-content">
        <p>"Great service by the plumber. Efficient and courteous!"</p>
      </div>
      <div className="testimonial-author">
        <span>⭐⭐⭐⭐⭐</span>
        <h4>– Anjali</h4>
      </div>
    </div>
    <div className="testimonial-card">
      <div className="testimonial-content">
        <p>"The cook provided was excellent. Delicious meals every day!"</p>
      </div>
      <div className="testimonial-author">
        <span>⭐⭐⭐⭐⭐</span>
        <h4>– Ravi</h4>
      </div>
    </div>
  </div>
</div>


          


            {/* Careers Section */}
            <section className="careers">
                <h2>Careers</h2>
                <p>Join Our Growing Team</p>
                <button className="button">Apply Now</button>
            </section>

            {/* Resources Section */}
            <section className="resources">
                <h2>Helpful Guides</h2>
                <p>Explore our library of informative resources...</p>
                <button className="button">Learn More</button>
                <div className="imageContainer">
                <img src={guideImage} alt="Guide" />
                </div>
            </section>


            {/* Company Section */}
            <section className="company">
                <h2>Company</h2>
                <div className="companyCards">
                    <div className="card">
                        <h3>Quality Assured</h3>
                        <p>Our rigorous vetting process ensures you receive top-notch service.</p>
                    </div>
                    <div className="card">
                        <h3>Customer Satisfaction</h3>
                        <p>We're committed to your complete satisfaction, from start to finish.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            
        </div>
    );
};

export default LandingPage;