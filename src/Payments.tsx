import React, { useState } from 'react';
import { db } from './firebase.js';  
import { doc, collection, addDoc } from 'firebase/firestore';  // Firestore methods

function Payments() {
  // State variables for form inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [userId, setUserId] = useState('');  // To identify the user
  const [successMessage, setSuccessMessage] = useState('');

  // Function to handle payment submission
  const handlePayment = async () => {
    try {
      if (!userId) {
        setSuccessMessage('Please provide a valid User ID.');
        return;
      }

      // Reference to the user's document
      const userDocRef = doc(db, 'users', userId);

      // Add payment details as a subcollection under the user's document
      await addDoc(collection(userDocRef, 'payments'), {
        cardNumber: cardNumber,
        cvv: cvv,
        expiryDate: expiryDate,
        nameOnCard: nameOnCard,
      });

      setSuccessMessage('Payment details successfully stored for user!');
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
        User ID:
      </div>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

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

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default Payments;
