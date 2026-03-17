import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

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
            if (existItem.qty < product.stock) {
                setCartItems(
                    cartItems.map((x) =>
                        x._id === product._id ? { ...x, qty: x.qty + 1 } : x
                    )
                );
                return true;
            } else {
                toast.warning(`Only ${product.stock} items available in stock`, {
                    position: "bottom-right",
                    autoClose: 2000,
                });
                return false;
            }
        } else {
            if (product.stock > 0) {
                setCartItems([...cartItems, { ...product, qty: 1 }]);
                return true;
            } else {
                toast.error(`${product.name} is out of stock`, {
                    position: "bottom-right",
                    autoClose: 2000,
                });
                return false;
            }
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x._id !== id));
    };

    const increaseQty = (id) => {
        const item = cartItems.find((x) => x._id === id);
        if (item && item.qty < item.stock) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === id ? { ...x, qty: x.qty + 1 } : x
                )
            );
        } else if (item) {
            toast.warning(`Max stock reached (${item.stock})`, {
                position: "bottom-right",
                autoClose: 2000,
            });
        }
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
