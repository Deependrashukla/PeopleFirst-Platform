import React, { useState, useEffect } from "react";
import driverImage from "../assets/payment-done.png"; // Path to your dummy driver image

const DummyPaymentPage = () => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [amount, setAmount] = useState("100");
  const [aadhaarData, setAadhaarData] = useState(null);

  useEffect(() => {
    // Get Aadhaar number from localStorage
    const aadhaarNumber = localStorage.getItem("aadhaar_number");
    console.log("aadharcard:", aadhaarNumber);
    if (aadhaarNumber) {
      // Fetch Aadhaar data using the stored Aadhaar number
      fetch(`http://127.0.0.1:5000/api/details/${aadhaarNumber}`)
        .then((response) => response.json())
        .then((data) => {
          setAadhaarData(data);
        })
        .catch((error) => {
          console.error("Error fetching Aadhaar data:", error);
        });
    }
  }, []);

  const handlePayment = () => {
    setTimeout(() => {
      setPaymentCompleted(true);
    }, 2000);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  return (
    <div style={styles.container}>
      {!paymentCompleted ? (
        <div style={styles.paymentContainer}>
          <h2>Enter Amount to Pay</h2>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            style={styles.input}
          />
          <button style={styles.button} onClick={handlePayment}>
            Pay ₹{amount}
          </button>
        </div>
      ) : (
        <div style={styles.detailsContainer}>
          <h2>Payment Successful</h2>
          <img src={driverImage} alt="Driver" style={styles.image} />
          <div style={styles.contactDetails}>
            {aadhaarData ? (
              <>
                <p><strong>Name:</strong> {aadhaarData.name}</p>
                <p><strong>Phone:</strong> {aadhaarData.phone}</p>
                <p><strong>Email:</strong> {aadhaarData.email}</p>
              </>
            ) : (
              <p>Loading worker details...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  paymentContainer: {
    textAlign: "center",
  },
  input: {
    width: "200px",
    padding: "10px",
    fontSize: "16px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  detailsContainer: {
    textAlign: "center",
  },
  image: {
    width: "150px",
    borderRadius: "50%",
    margin: "20px 0",
  },
  contactDetails: {
    fontSize: "18px",
    lineHeight: "1.6",
  },
};

export default DummyPaymentPage;
