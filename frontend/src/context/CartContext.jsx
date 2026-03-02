import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (error) {
                console.error("Failed to parse cart items from local storage", error);
                localStorage.removeItem('cartItems');
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === product._id ? { ...x, qty: x.qty + 1 } : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, qty: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x._id !== id));
    };

    const increaseQty = (id) => {
        setCartItems(
            cartItems.map((x) =>
                x._id === id ? { ...x, qty: x.qty + 1 } : x
            )
        );
    }

    const decreaseQty = (id) => {
        const item = cartItems.find((x) => x._id === id);
        if (item.qty === 1) {
            removeFromCart(id);
        } else {
            setCartItems(
                cartItems.map((x) =>
                    x._id === id ? { ...x, qty: x.qty - 1 } : x
                )
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart, totalPrice, totalQty }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
