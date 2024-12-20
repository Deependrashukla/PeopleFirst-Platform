import React, { useState } from 'react';

const RazorpayPayment = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Make an API request to your backend to create an order
    const response = await fetch('http://localhost:5000/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 1000 }), // Amount in paise
    });
    
    const { order_id, razorpay_key } = await response.json();
    
    // Initialize Razorpay payment gateway
    const options = {
      key: razorpay_key, // Your Razorpay API key
      amount: 1000, // Amount to be paid (in paise)
      currency: 'INR',
      order_id: order_id,
      handler: function (response) {
        // Handle successful payment
        console.log('Payment Successful', response);
      },
      prefill: {
        name: 'Sonal Gupta',
        email: 'sonal@gupta.com',
        contact: '1234567890',
      },
      theme: {
        color: '#F37254',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setLoading(false);
  };

  return (
    <div>
      {/* <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing Payment...' : 'Pay with Razorpay'}
      </button> */}
    </div>
  );
};

export default RazorpayPayment;