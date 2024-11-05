import React, { useState } from 'react';
import { db, auth } from './firebase.js';  
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';  // Firestore methods
import './Payments.css';

const Payments: React.FC = () => {
  // State variables for form inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Function to handle payment submission
  const handlePayment = async () => {
    try {
      const user = auth.currentUser;
      const userId = user.uid;

      const userDoc = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(userDoc);
      if (querySnapshot.empty) {
        console.error('User document does not exist:', userId);
        setSuccessMessage('User document does not exist.');
        return;
      }

      const userDocRef = querySnapshot.docs[0].ref;

      // Add payment details as a subcollection under the user's document
      await addDoc(collection(userDocRef, 'payments'), {
        uid: userId,
        cardNumber: cardNumber,
        cvv: cvv,
        expiryDate: expiryDate,
        nameOnCard: nameOnCard,
        createdAt: new Date(),
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
    <div className="payments-container">
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
        <br />
        <button onClick={handlePayment}>Submit Payment</button>
      </div>

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default Payments;
