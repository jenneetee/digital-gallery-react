import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';  // Firestore method

function Confirmation() {
    const { id } = useParams<{ id: string }>();
    const [payment, setPayment] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchPayment = async () => {
        try {
            // Reference to the payments subcollection within the user's document
            if (id) {
                const user = auth.currentUser;
                const userDoc = query(collection(db, 'users'), where('uid', '==', user.uid));
                const querySnapshot = await getDocs(userDoc);
                if (querySnapshot.empty) {
                    return;
                }
                const userDocRef = querySnapshot.docs[0].ref;
                const paymentRef = doc(userDocRef, 'payments', id);
                const paymentDoc = await getDoc(paymentRef);
                if (paymentDoc.exists()) {
                    setPayment(paymentDoc.data());
                } else {
                    setError('Payment not found');
                }
            }
        } catch (err) {
            console.error("Error fetching payments:", err);
            setError("Failed to fetch payments. Please try again later.");
        }
    };

    useEffect(() => {
        fetchPayment();
    }, [id]);

    return (
        <div>
            <h1>Payment Confirmation</h1>
            <h3>Thank you for your purchase!</h3>
            <p>Payment ID: {id}</p>
            {error && <p>{error}</p>}
            {payment && (
                <div>
                    <p>Date: {payment.createdAt ? payment.createdAt.toDate().toLocaleDateString() : 'Date not available'}</p>
                    <p>Purchase:  
                    {payment.purchase && payment.purchase.length > 0 ? (
                        <ul>
                        {payment.purchase.map((itemId) => (
                            <li key={itemId}>
                                <Link to={`/artwork/${itemId}`}>Artwork ID: {itemId}</Link>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <span> No items in the purchase.</span>
                    )}
                    </p>
                    <p>Amount: ${payment.price.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
} 

export default Confirmation;