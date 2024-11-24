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
            <header className="header">
                <div className="logo">PeopleBridge</div>
                <nav className="nav">
                    <a href="#home" className="navLink">Home</a>
                    <a href="#about" className="navLink">About</a>
                    <a href="#services" className="navLink">Services</a>
                    <a href="#contact" className="navLink">Contact</a>
                    <a href="#quote" className="navLink">Get a Quote</a>
                </nav>
            </header>

            {/* Hero Section */}
            <section id="home" className="hero">
                <div className="heroContent">
                    <h1>We bridge the gap between you and dependable</h1>
                    <p>Whether you need help with home improvement, office tasks, or specialized services</p>
                    <button className="button">Get Started Now</button>
                    <div className="partners">
                        <span>Shell</span>
                        <span>Ferrari</span>
                        <span>Apple</span>
                        <span>Microsoft</span>
                    </div>
                </div>
                <div className="heroImage">
                    <img src={heroImage} alt="Hero" className="placeholderImage" />
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
                <div className="expertProfile">
                    <img src={workerImage} alt="Expert" className="expertImage" />
                    <h3>Let's Bring Your Vision to Life</h3>
                    <p>At People First, we bridge the gap between you and dependable, skilled workers...</p>
                    <button className="button">Get Started</button>
                </div>
            </section>

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
                <img src={guideImage} alt="Guide" className="guideImage" />
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
    );
};

export default LandingPage;