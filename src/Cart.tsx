import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContent';
import { auth } from './firebase';

const Cart: React.FC = () => {
    //Cart variables
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();

    // Function to go back to the previous page
    const handleContinueShopping = () => {
        navigate(-1); // Goes back one step in the history stack
    };

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
            <button onClick={handleContinueShopping}>Continue Shopping</button>
        </div>
    );
};

export default Cart;