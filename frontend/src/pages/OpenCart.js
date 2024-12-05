import React, { useState, useContext,useEffect } from 'react';
import styles from '../css/header.module.css';
import CloseImage from '../img/close.png';
import CartItem from './CartItem';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import CartContext, { CartProvider } from './CartContext';
export default function OpenCart ({ setIsCartOpen }){
    const { cartItems, updateQuantity,totalPrice } = useContext(CartContext); // 使用 useContext 获取购物车数据
    console.log(cartItems);
    console.log(totalPrice);
    const [alertMessage, setAlertMessage] = useState(null); 
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        // 检查 localStorage 中是否存在 username
        const username = localStorage.getItem('username');
        if (username) {
            setIsUserLoggedIn(true); // 如果存在 username，则表示用户已登录
        } else {
            setIsUserLoggedIn(false); // 否则用户未登录
        }
    }, []);
  
    // 构造数据
    const cartData = cartItems.reduce((acc, item) => {
      acc.push({
        id: item.itemId,  // 商品的 id
        qty: item.qty     // 商品的数量
      });
      return acc;
    }, []);
    // close this cart
    const closeCart = async () => {
        const data = [
            { username: username },  // 插入用户名
            ...cartData              // 插入商品信息
          ];
        try {
            
        
                // 发送 PUT 请求更新单个商品
                const response = await fetch('http://10.147.19.129:3036/api/cart/list', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                
                if (!response.ok) {
                    console.error(`更新商品失败：`);
                } else {
                    console.log(`成功更新商品：`);
                }
            
        
        } catch (error) {
            console.error('更新购物车时发生错误:', error);
        } finally {
            // 关闭购物车
            setIsCartOpen(false);
        }
    };

    // handle the quantity change
    const handleQuantityChange = (id, newQuantity) => {
        updateQuantity(id, newQuantity); // 更新购物车中的商品数量
    };

    var tax = totalPrice * 0.13;
    var sum = totalPrice * 1.13;
    // about to payment
    const handleClick = async () => {
        const data = [
            { username: username },  // 插入用户名
            ...cartData              // 插入商品信息
          ];
        try {
            
        
                // 发送 PUT 请求更新单个商品
                const response = await fetch('http://10.147.19.129:3036/api/cart/validation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                
                if (!response.ok) {
                    console.error(`更新商品失败：`);
                } else {
                    
                    const res = await response.json();
				    console.log(res);
                    if (res.code !== 200) {
                        console.log("budi");
                        console.log('Setting alert message:', res.message);
                        const names = res.data.map(item => item.name).join(', '); // 提取每一项的 name 并用逗号连接
                        setAlertMessage(`${names} - ${res.message || 'An error occurred'}`);
                    } else {
                        setAlertMessage(null); // 清空错误消息
                        navigate('/payment', { replace: true });
                        
                       
                    }
                }
            
        
        } catch (error) {
            console.error('更新购物车时发生错误:', error);
        } 
      };

    
    // function about 
    return(
        <div className={styles.opencart}>
            {alertMessage && (
                <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
            )}
                <h1>Your Cart</h1>
                <img src={CloseImage} className={styles.close}  onClick={closeCart}  alt="Description of the image" />
                {/* it's a CartItem, need to be replace in the future */}
                <div className={styles.cartcontent}>
                {cartItems == null ? (
                    <p>Your cart is empty</p>
                ) : (
                    cartItems.map(item => (
                        <CartItem
                            key={item.itemId}
                            id={item.itemId}
                            initialQuantity={item.qty}
                            name={item.name}
                            price={item.price}
                            onQuantityChange={handleQuantityChange}
                            img={`data:image/jpeg;base64,${item.img}`} 
                            product={item}
                        />
                    ))
                )}
            </div>
        
                <div className={styles.cartsum}>
                    <p>Order Summary</p>
                    <table>
                    <tbody>

                        <tr>
                            <td>Product Subtotal</td>
                            <td className={styles.textright} id="subtotal">${totalPrice.toFixed(2)}</td>
                        </tr>

                        <tr>
                            <td>Estimated Shipping</td>
                            <td className={styles.textright}>$0.00</td>
                        </tr>

                        <tr>
                            <td>Estimated Taxes</td>
                            <td className={styles.textright} id="tax">${tax.toFixed(2)}</td>
                        </tr>

                        <tr>
                            <td>Estimated Total</td>
                            <td className={styles.textright} style={{color : 'red'}} id="estimateTotal">${sum.toFixed(2)}</td>
                        </tr>

                    </tbody>
        
                    </table>
                    
                    {isUserLoggedIn && (
                <button className={styles.buybtn} onClick={handleClick}>
                    Buy them!
                </button>
            )}
                    
                    
                        
                   
                </div>
            </div>
    );
}