import React, { useState, useContext,useEffect } from 'react';
import styles from '../css/header.module.css';
import SearchImage from '../img/Search.png';
import UserImage from '../img/user.png';
import CartImage from '../img/shoppingcart.png';
import OpenCart from './OpenCart';
import { Link } from 'react-router-dom';
import CartContext, { CartProvider } from './CartContext';
import { useNavigate } from 'react-router-dom';

export default function Header(){
    const { totalPrice, totalNum,cartItems } = useContext(CartContext);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
  
    // 构造数据
    const cartData = cartItems.reduce((acc, item) => {
      acc.push({
        id: item.itemId,  // 商品的 id
        qty: item.qty     // 商品的数量
      });
      return acc;
    }, []);
        // State to control the visibility of the cart
      const [isCartOpen, setIsCartOpen] = useState(false);
      // whether there is a user
      
        const [isLog, setLog] = useState(false);
    
        useEffect(() => {
          const userName = localStorage.getItem('username');
            if (userName != null) {
                setLog(true); // 当 username 存在时，更新 isLog 为 true
            } else {
                setLog(false); // 当 username 不存在时，更新 isLog 为 false
            }
        }, []); 
    
        // Function to toggle the cart visibility
        const toggleCart = () => {
          setIsCartOpen(!isCartOpen);
        };

        const handleDetailClick = async () => {
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
             
                    navigate('/userprofile', { replace: true });
                }
            
        
        } catch (error) {
            console.error('更新购物车时发生错误:', error);
        } 
      }
        const homePage = async () => {
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
             
                    navigate('/', { replace: true });
                }
            
        
        } catch (error) {
            console.error('更新购物车时发生错误:', error);
        } 
            
            
          };
       
    return(
        <>
            <header className={styles.AppHeader}>
            <h1>
                <Link to = "/" onClick={homePage} > 
                Computer Store
                </Link>
                </h1>
            
            <div className={styles.Right}>

                <div className={styles.user}>
                    <img alt="search_icon" src={UserImage} className={styles.userIcon} id="user"/>
                    
                      <button  onClick={isLog ?  handleDetailClick : undefined} >
                        <Link to={isLog ? "/userprofile" : "/login"}>
                        {isLog ? "Profile" : "Log in"}
                        </Link>
                    </button>  
                   
                    
                </div>
               
                <div className={styles.cart} onClick={toggleCart}>
                      <span className={styles.number}>
                        {totalNum}
                      </span>
                    <img src={CartImage} alt="Description of the image" className={styles.cartIcon} id='cart' /> 
                    <span className={styles.sumprice}>
                    Total: $<span id="sumPrice">{totalPrice.toFixed(2)}</span>
                      </span> 
                </div>

             
                

            </div>
            </header>

            {isCartOpen && (
               
                    <OpenCart setIsCartOpen={setIsCartOpen} />
               
                
                )}

            

        
        </>
        

        
        
    );
}
