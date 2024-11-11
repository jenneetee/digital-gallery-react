import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContent';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const Cart: React.FC = () => {
    //Cart variables
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [error, setError] = useState('');

    // Function to go back to the previous page
    const handleContinueShopping = () => {
        navigate('/dashboard/gallery'); // Goes back one step in the history stack
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
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <button onClick={handleContinueShopping}>Continue Shopping</button>
        </div>
    );
};

export default Cart;