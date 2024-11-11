import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase.js';  
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';  // Firestore methods
import './Payments.css';

const Payments: React.FC = () => {
  // State variables for form inputs
  const [payments, setPayments] = useState<any[]>([]);  // Store payments in state
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPayments = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
            const userDoc = query(collection(db, 'users'), where('uid', '==', user.uid));
            const userSnapshot = await getDocs(userDoc);
                if (userSnapshot.empty) {
                    return;
                }
                const userDocRef = userSnapshot.docs[0].ref;
          const userPaymentsQuery = query(collection(userDocRef, 'payments'));
          const paymentsSnapshot = await getDocs(userPaymentsQuery);
          
          // Map through payments snapshot and store in state
          const paymentsList = paymentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPayments(paymentsList); // Update the state with fetched payments
        } catch (err) {
          setError('Failed to load payments');
          console.error('Error fetching payments:', err);
        }
      } else {
        setError('User is not authenticated');
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="payments-container">
      <h1>Payments</h1>
        {payments.map((payment) => (
            <li key={payment.id}>
              <Link to={`/confirmation/${payment.id}`}>Payment ID: {payment.id}</Link>
            </li>
          ))}
    </div>
  );
}

export default Payments;
