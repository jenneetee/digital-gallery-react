import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartContextType {
    cartItems: string[];
    addToCart: (id: string) => void;
    removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};


export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<string[]>([]);
    const navigate = useNavigate();
    const addToCart = (itemId: string) => {
        // Prevent adding duplicate items to the cart
        setCartItems((prevItems) => {
            if (prevItems.includes(itemId)) {
                return prevItems; // Do nothing if item is already in the cart
            }
            return [...prevItems, itemId]; // Add the item if it's not in the cart
        });
        navigate('/cart');
    };
    const removeFromCart = (id: string) => setCartItems((prevItems) => prevItems.filter(item => item !== id));

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};