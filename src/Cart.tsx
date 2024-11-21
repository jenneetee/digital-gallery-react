import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContent';
import { db, auth } from './firebase';
import { doc, getDoc, query, collection, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';

const Cart: React.FC = () => {
    //Cart variables
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [error, setError] = useState('');
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    // Function to go back to the previous page
    const handleContinueShopping = () => {
        navigate('/dashboard/gallery'); // Goes back one step in the history stack
    };

    useEffect(() => {
        // Load PayPal script
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
        script.async = true;
        document.body.appendChild(script);

        // Render PayPal button once the script is loaded
        script.onload = () => {
            const paypal = (window as any).paypal;
            if (paypal) {
                paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: totalPrice.toFixed(2), // Set the total amount for the order
                                },
                            }],
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then(details => {
                            alert(`Transaction completed by ${details.payer.name.given_name}`);
                            handlePayment().then(id => {
                                if (id) navigate(`/confirmation/${id}`);
                            });
                            // You could navigate to a confirmation page or handle other logic here.
                        });
                    },
                    onError: (err) => {
                        console.error("PayPal Checkout onError", err);
                        alert("There was an error with your payment.");
                        console.log(totalPrice);
                    }
                }).render('#paypal-button-container'); // Render PayPal button into #paypal-button-container
            }
        };
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [clientId, cartItems, totalPrice]);

    const handlePayment = async () => {
        try {
            const user = auth.currentUser;
            const userId = user.uid;
        
            const userDoc = query(collection(db, 'users'), where('uid', '==', user.uid));
            const querySnapshot = await getDocs(userDoc);
            if (querySnapshot.empty) {
                console.error('User document does not exist:', userId);
                return;
            }
        
            const userDocRef = querySnapshot.docs[0].ref;
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.data(); // Fetches the entire document data as an object
            console.log("User data:", userData);
            
            if (userData) {
                // Add payment details as a subcollection under the user's document
                const docRef = await addDoc(collection(userDocRef, 'payments'), {
                    uid: userId,
                    name: userData.displayName,
                    email: userData.email,
                    price: totalPrice,
                    purchase: cartItems,
                    createdAt: new Date(),
                });
                await updateDoc(docRef, {
                    paymentId: docRef.id,
                })
                return docRef.id;
            }

        } catch (error) {
          console.error('Error saving payment details:', error);
        }
      };
    

    const calculatePrice = async () => {
        let total = 0;
        try {
            for (const itemId of cartItems) {
                // Fetch the artwork data from Firebase using the itemId
                const artworkDoc = await getDoc(doc(db, 'artworks', itemId));
                
                if (artworkDoc.exists()) {
                    const artworkData = artworkDoc.data();
                    const price = artworkData?.price || 0; // Use 0 if price doesn't exist
                    total += price;
                }
            }

            setTotalPrice(total); // Update the total price state
        } catch (err) {
            console.error('Error fetching artwork prices:', err);
            setError('Error calculating price');
        }
    }

    useEffect(() => {
        calculatePrice();
    }, [cartItems]);

    return (
        <div className="cart">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <ul>
                    {cartItems.map((itemId) => (
                        <li key={itemId}>
                            <Link to={`/artwork/${itemId}`}>Artwork ID: {itemId}</Link>
                            <button onClick={() => removeFromCart(itemId)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <h4>Total Price: ${totalPrice.toFixed(2)}</h4> <br />
            <button onClick={handleContinueShopping}>Continue Shopping</button> <br /> <br />

            <h4>Checkout:</h4>
            <div id="paypal-button-container"></div>
        </div>
    );
};

export default Cart;