import React from "react";
//import "./ServicesPage.css";

const services = [
  // { name: "Cleaner", icon: "🧹", discount: "₹50 OFF" },
  { name: "Maid", icon: "🧼", discount: "₹75 OFF" },
  { name: "Cook", icon: "🍳", discount: "₹100 OFF" },
  { name: "Plumber", icon: "🔧", discount: "₹50 OFF" },
  { name: "Electrician", icon: "💡", discount: "₹75 OFF" },
];

const ServicesPage = () => {
  return (
    <div className="services-page">
      <h1 className="page-title">Our Services</h1>
      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="discount-badge">{service.discount}</div>
            <div className="service-icon">{service.icon}</div>
            <div className="service-name">{service.name}</div>
          </div>
        ))}
      </div>

      {/* Promotional Section */}
      <div className="promo-section">
        <h2>Special Offers</h2>
        <p>Book any service today and get an additional ₹100 off!</p>
        <button className="promo-button">Grab Offer Now</button>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials">
          <blockquote>
            "Excellent service! The plumber was very professional and fixed the issue quickly." – Rahul
          </blockquote>
          <blockquote>
            "The cleaning service was top-notch. My house looks spotless!" – Priya
          </blockquote>
        </div>
      </div>




      {/* FAQs Section */}
      <div className="faqs-section">
        <h2>FAQs</h2>
        <div className="faq-item">
          <h3>How can I book a service?</h3>
          <p>You can book a service directly on our platform by clicking on the desired service and following the steps.</p>
        </div>
        <div className="faq-item">
          <h3>What payment methods do you accept?</h3>
          <p>We accept credit/debit cards, UPI, and net banking.</p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p>© 2024 Household Services. All Rights Reserved.</p>
        <p>
          Follow us: <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="#">Twitter</a>
        </p>
      </footer>
    </div>
  );
};



export default ServicesPage;
