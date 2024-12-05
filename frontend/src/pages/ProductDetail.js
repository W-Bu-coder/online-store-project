import  React, { useEffect, useState, useContext } from 'react';
import Header from './Header';
import CommentItem from './CommentItem';
import Rating from '@mui/material/Rating';
import ComImage from '../img/computer.jpg';
import styles from '../css/productDetail.module.css';
import  CartContext from './CartContext';
export default function ProductDetail(){
    const [showAddToCart, setShowAddToCart] = useState(true); // 控制显示内容
    const [quantity, setQuantity] = useState(0); // 管理数量
    const { cartItems, addToCart, decrementQuantity,currentItemID } = useContext(CartContext);
    const currentQuantity = cartItems.find((item) => item.itemId == currentItemID)?.qty || 0;
    console.log(currentQuantity);
    console.log(cartItems);
    useEffect(() => {
        setQuantity(currentQuantity); // 初始化数量为购物车中的商品数量
        setShowAddToCart(currentQuantity === 0); // 如果当前商品数量为 0，显示 "Add to Cart" 按钮
    }, [currentItemID, cartItems]);
    console.log(currentItemID);
    const [productDetail, setProductDetail] = useState(null); 
  
   // 添加商品到购物车
  const handleAddToCart = () => {
    setShowAddToCart(false); // 隐藏 Add to Cart 按钮
    setQuantity(1); // 初始化数量为 1
    addToCart(productDetail); // 将商品添加到购物车
};

// 增加商品数量
const increment = () => {
    setQuantity(prev => prev + 1); // 增加数量
    addToCart(productDetail); // 同步添加商品
};

// 减少商品数量
const decrement = () => {
    if (quantity > 1) {
        setQuantity(prev => prev - 1); // 减少数量
        decrementQuantity(currentItemID); // 同步减少商品
    } else {
        setShowAddToCart(true); // 数量为 0 时恢复 Add to Cart 按钮
        decrementQuantity(currentItemID); // 同步减少商品
    }
};
    // Review part
   
        const [comments, setComments] = useState([]);
        const [loading, setLoading] = useState(true);  // 用于控制加载状态
        const [error, setError] = useState(null);  // 用于保存错误信息
    
        // 从 MockAPI 获取评论数据
        useEffect(() => {
            const fetchComments = async () => {
                try {
                    const response = await fetch('https://674c812654e1fca9290cc39b.mockapi.io/RateReview');
                    if (!response.ok) {
                        throw new Error('Failed to fetch comments');
                    }
                    const data = await response.json();
                    setComments(data);  // 更新评论数据
                } catch (err) {
                    setError(err.message);  // 处理错误并保存错误信息
                } finally {
                    setLoading(false);  // 无论成功还是失败，都设置加载状态为 false
                }
            };
    
            fetchComments();
        }, []);  // 空数组作为依赖，表示只在组件加载时执行一次
        // about the product detail
        useEffect(() => {
            const fetchProductDetail = async () => {
              if (!currentItemID) return;  // 如果没有商品ID，直接返回
        
              try {
                setLoading(true);
                // 使用 itemId 作为查询参数发送 GET 请求
                const response = await fetch(`http://10.147.19.129:3036/api/item/details?itemId=${currentItemID}`);
        
                if (!response.ok) {
                  throw new Error('Failed to fetch product details');
                }
        
                const detail = await response.json();
                setProductDetail(detail.data);  // 将获取的商品详细信息存储到状态中
                
              } catch (err) {
                setError(err.message);  // 记录错误信息
              } finally {
                setLoading(false);
              }
            };
        
            fetchProductDetail();  // 调用函数获取商品详细信息
          }, [currentItemID]); // 每次 `currentItemID` 变化时重新请求
          
          // 加载状态检查
  if (loading) return <div>Loading...</div>;

  // 错误处理
  if (error) return <div>Error: {error}</div>;

  // 检查是否获取到商品详情
  if (!productDetail) {
    return <div>Failed to load product details. Please try again later.</div>;
  }
  // 动态生成 spec 表格
  const renderSpecTable = () => {
    if (!productDetail.spec) return null;

    return (
      <table>
        <tbody>
          {Object.entries(productDetail.spec).map(([key, value], index) => (
            <tr key={index}>
              <td className={styles.strong}>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
    return(
        <>
            <Header/>
            <main className={styles.DetailMain}>
                    {/* show the selected Product */}
                    <div className={styles.left}>
                    {/* here is one pic */}
                    <img alt="com" src={ `data:image/jpeg;base64,${productDetail.img}` }  className={styles.pic} />
                    
                    </div>
                    <div className={styles.right}>
                        
                                <h2>{productDetail.name}</h2>
                                <h2>Price: <span className={styles.price} data-value="449.99">${productDetail.price}</span></h2>
                                <div className={styles.rate}>
                                {/* UI API of star */}
                                <Rating name="half-rating-read" defaultValue={productDetail.rate} precision={0.5} readOnly />
                                <span>
                                    <span id='point'>{productDetail.rate} </span>
                                    out of 5
                                </span>
                                </div>
                                <h2>Stock : {productDetail.stock}</h2>
                                
                                {showAddToCart ? (
                                    // 显示 "Add to Cart" 按钮
                                    <button
                                    className={styles.addcart}
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
                        
                        
                            
                           
                            
                        
                    </div>
                    <div className={styles.ContainTable}>
                        {renderSpecTable()}
                    </div>
                    
                    

                    <div className={styles.allComments}>
                        {/* should have a component of one single comment */}
                        {comments.map((comment, index) => (
                            <CommentItem
                                key={index}
                                username={comment.name}
                                date={comment.createdAt}
                                rate={comment.rate}
                                review={comment.review}
                            />
                        ))}
                       
                    </div>

            </main>

        </>


    );


}
