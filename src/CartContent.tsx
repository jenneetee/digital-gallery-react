import React, { createContext, useContext, useState, ReactNode } from 'react';

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

    const addToCart = (id: string) => setCartItems((prevItems) => [...prevItems, id]);
    const removeFromCart = (id: string) => setCartItems((prevItems) => prevItems.filter(item => item !== id));

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};