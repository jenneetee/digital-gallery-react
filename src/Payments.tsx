import React, { useState } from 'react';
import { db } from './firebase.js';  // Import Firebase config
import { collection, addDoc } from 'firebase/firestore';  // Firestore methods

function Payments() {
  // State variables for form inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // Success message state

  // Function to handle form submission
  const handlePayment = async () => {
    try {
      // Save payment details to Firestore
      await addDoc(collection(db, 'payments'), {
        cardNumber: cardNumber,
        cvv: cvv,
        expiryDate: expiryDate,
        nameOnCard: nameOnCard,
      });

      // Set success message and clear input fields
      setSuccessMessage('Payment details successfully stored!');
      setCardNumber('');
      setCvv('');
      setExpiryDate('');
      setNameOnCard('');
    } catch (error) {
      console.error('Error saving payment details:', error);
      setSuccessMessage('Error processing payment. Please try again.');
    }
  };

  return (
    <div>
      <h1>Enter Payment Details</h1>

      <div>
        Name on Card:
      </div>
      <input
        type="text"
        value={nameOnCard}
        onChange={(e) => setNameOnCard(e.target.value)}
      />

      <div>
        Card Number:
      </div>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />

      <div>
        CVV:
      </div>
      <input
        type="text"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
      />

      <div>
        Expiry Date (MM/YY):
      </div>
      <input
        type="text"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />

      <div>
        <button onClick={handlePayment}>Submit Payment</button>
      </div>

      {/* Display success message if payment was processed */}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default Payments;
