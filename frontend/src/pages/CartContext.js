import React, { createContext, useState, useEffect} from 'react';
// create cart context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentItemID, setCurrentItemID] = useState(null);//see product detail
  const [userName, setUsername] = useState(null);//get the user loged
  const username = localStorage.getItem('username');
  // console.log(username);
  // 从后端获取购物车数据
  useEffect(() => {
    const fetchCartData = async () => {
      if(!username){
        return;
      }
      try {
        const username = localStorage.getItem('username');
        const response = await fetch(`http://10.147.19.129:3036/api/cart/list?username=${username}`); // 假设这是获取购物车数据的API
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.data || []); // 将获取到的数据存储到 cartItems 中
          console.log(data);
        } else {
          console.error('Failed to fetch cart data');
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, []); // 空数组，确保只在组件加载时请求一次
  // add product to cart
  
  // Add product to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // 检查购物车中是否已有该商品
      console.log(prevItems);
      const existingItem = prevItems.find((cartItem) => cartItem.itemId === item.itemId);
      
      if (existingItem) {
        // 如果商品已存在，增加其数量
        return prevItems.map((cartItem) =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      } else {
        // 如果商品不存在，添加新商品并设置数量为 1
        return [...prevItems, { ...item, qty: 1 }];
      }
    });
  };

  const decrementQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.itemId === itemId) {
            const newQty = item.qty - 1; // 减少数量
            
              return { ...item, qty: newQty }; // 否则返回减少后的商品
           
          }
          return item; // 如果不是目标商品，保持不变
        })
        .filter((item) => item.qty != 0) // 过滤掉值为 null 的商品，真正删除
    );
  };
  
  

  // 从购物车移除商品
  const removeFromCart = async (itemId) => {  // 使 removeFromCart 成为 async 函数
    const itemToRemove = cartItems.find(item => item.itemId === itemId);

    if (!itemToRemove) {
        console.error('商品不存在');
        return;
    }

    // 更新前端 cartItems 数据
    setCartItems((prevItems) => prevItems.filter(item => item.itemId !== itemId));
    console.log(cartItems);

    
};

  // 更新商品数量
  const updateQuantity = (itemId, newProductNum) => {
   
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId ? { ...item, productNum: newProductNum } : item
      )
    );
  };
  const calculateTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const calculateSum = () => {
    return cartItems.reduce((totalNum, item) => totalNum + item.qty, 0);
  };
  const totalPrice = calculateTotalPrice();
  const totalNum = calculateSum();
  //save the new itemid
  const setItemID = (id) => {
    setCurrentItemID(id);  // 设置当前商品的ID
  };
  const setLogname = (name) => {
    setUsername(name);
    console.log('CartProvider state userName:', userName);
  }
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, totalPrice, totalNum, currentItemID, setItemID, setLogname,userName, decrementQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;