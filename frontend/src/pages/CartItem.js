import React, { useState, useContext, useEffect } from 'react';
import DeleteImage from '../img/delete.png';
import styles from '../css/header.module.css';
import CartContext from './CartContext';

export default function CartItem({ id, initialQuantity, name, price, img, product }) {
    const [quantity, setQuantity] = useState(initialQuantity);
    const { removeFromCart, decrementQuantity, addToCart } = useContext(CartContext);

    // Function to decrease quantity
    const decrement = () => {
        setQuantity((prev) => prev - 1);
    };

    // Function to increase quantity
    const increment = () => {
        setQuantity((prev) => prev + 1);
    };

    // Function to remove item from cart
    const handleRemoveItem = () => {
        removeFromCart(id);
    };

    // useEffect to handle changes in quantity
    useEffect(() => {
        if (quantity === 0) {
            removeFromCart(id); // Remove item when quantity reaches 0
        } else if (quantity > initialQuantity) {
            addToCart(product); // Add item to cart when quantity is increased
        } else if (quantity < initialQuantity) {
            decrementQuantity(product.itemId); // Decrement item when quantity is decreased
        }
    }, [quantity, removeFromCart, addToCart, decrementQuantity, id, initialQuantity, product]);

    return (
        <div className={styles.product}>
            <img alt="com" src={img} className={styles.pic} />
            <div className={styles.info}>
                <p>{name}</p>
                <p>Price : <span> ${price}</span> </p>
                <div className={styles.op}>
                    <span className={styles.less} onClick={decrement}>-</span>
                    <span className={styles.num}>{quantity}</span>
                    <span className={styles.more} onClick={increment}>+</span>
                </div>
            </div>
            <img 
                src={DeleteImage} 
                className={styles.delete} 
                onClick={handleRemoveItem} 
                alt="Delete" 
            />
        </div>
    );
}
