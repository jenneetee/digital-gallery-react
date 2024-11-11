import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContent';

const Cart: React.FC = () => {
    //Cart variables
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    // Function to go back to the previous page
    const handleContinueShopping = () => {
        navigate(-1); // Goes back one step in the history stack
    };

    useEffect(() => {
        // Load PayPal script
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
        script.async = true;
        document.body.appendChild(script);

        // Checks if Client ID exists
        if (!clientId) {
            console.log(import.meta.env);
            console.log("PayPal Client ID:", clientId);
            console.error("PayPal Client ID is missing.");
            return;
        }

        // Render PayPal button once the script is loaded
        script.onload = () => {
            const paypal = (window as any).paypal;
            if (paypal) {
                paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: 100.00, // Set the total amount for the order
                                },
                            }],
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then(details => {
                            alert(`Transaction completed by ${details.payer.name.given_name}`);
                            // You could navigate to a confirmation page or handle other logic here.
                        });
                    },
                    onError: (err) => {
                        console.error("PayPal Checkout onError", err);
                        alert("There was an error with your payment.");
                    }
                }).render('#paypal-button-container'); // Render PayPal button into #paypal-button-container
            }
        };
        return () => {
            document.body.removeChild(script);
        };
    }, [clientId, cartItems]);

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
            <div id="paypal-button-container"></div>
            <button onClick={handleContinueShopping}>Continue Shopping</button>
        </div>
    );
};

export default Cart;