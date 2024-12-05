import React, { useState, useContext,useEffect }  from 'react';
import styles from '../css/Homepage.module.css';
import { Link } from 'react-router-dom';
import  CartContext from './CartContext';
import { useNavigate } from 'react-router-dom';

// gain things from given data is enough
export default function ProductCard({ product }) {
  const [showAddToCart, setShowAddToCart] = useState(true); // 控制显示 Add to Cart 按钮
  const [quantity, setQuantity] = useState(0); // 管理数量
  const { cartItems, addToCart, decrementQuantity, setItemID } = useContext(CartContext); // 从 CartContext 获取方法
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
  useEffect(() => {
      // 检查商品是否已经存在购物车中
      const existingItem = cartItems.find(item => item.itemId == product.itemId);
      if (existingItem) {
          setShowAddToCart(false); // 商品已在购物车中，隐藏 Add to Cart 按钮
          setQuantity(existingItem.qty); // 设置购物车中该商品的数量
      }else{
        setShowAddToCart(true);
      }
  }, [cartItems, product.id]); // 当购物车内容或商品 ID 变化时触发

  // 添加商品到购物车
  const handleAddToCart = () => {
      setShowAddToCart(false); // 隐藏 Add to Cart 按钮
      setQuantity(1); // 初始化数量为 1
      addToCart(product); // 将商品添加到购物车
  };

  // 增加商品数量
  const increment = () => {
      setQuantity(prev => prev + 1); // 增加数量
      addToCart(product); // 同步添加商品
  };

  // 减少商品数量
  const decrement = () => {
      if (quantity > 1) {
          setQuantity(prev => prev - 1); // 减少数量
          decrementQuantity(product.itemId); // 同步减少商品
      } else {
          setShowAddToCart(true); // 数量为 0 时恢复 Add to Cart 按钮
          decrementQuantity(product.itemId); // 同步减少商品
      }
  };
  const handleDetailClick = async (itemID) => {
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
              setItemID(itemID); // 设置当前商品的ID
              console.log(itemID);
              navigate('/detail', { replace: true });
          }
      
  
  } catch (error) {
      console.error('更新购物车时发生错误:', error);
  } 
      
      
    };
  return (
    <div className={styles.productCard}>
      <img src={ `data:image/jpeg;base64,${product.img}` } alt={product.productName} />
      <p>{product.name}</p>
      <p>${product.price}</p>
      <p>Rate : {product.rate}</p>
      <p>Stock : {product.stock}</p>
      {showAddToCart ? (
        // 显示 "Add to Cart" 按钮
        <button
          className={styles.productOption}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      ) : (
        // 显示数量和加减按钮
        <div className={styles.op}>
        <span className={styles.less}  onClick={decrement}>-</span>
        <span className={styles.num}>{quantity}</span>
        <span className={styles.more} onClick={increment}>+</span>
      </div>
      )}
      
      <button className={styles.productOption}    onClick={() => handleDetailClick(product.itemId)} >
       
        See more detail
       
        </button>
    </div>
  );
}


