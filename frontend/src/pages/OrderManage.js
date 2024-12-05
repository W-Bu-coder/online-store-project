import React, { useState,useEffect }  from 'react';
import HistoryItem from './HistoryItem';
import OrderCode from './OrderCode';
import styles from '../css/Dashboard.module.css';
import ConfirmOrder from './ConfirmOrder';
export default function OrderManage(){
    const [order,setOrder] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [history,setHistory] = useState([]);
    const [item, setItem] = useState('');
    const [user, setUser] = useState('');
    const [time, setTime] = useState('');
    const [card, setCard] = useState('');
    
    const [alertMessage, setAlertMessage] = useState(null); 
    const totalPrice = history.reduce((acc, item) => {
        return acc + item.price * item.qty; // 计算每个项的价格 * 数量，并累加
    }, 0);
        const tax = totalPrice*0.13;
        const sum = tax+totalPrice;
    const handleDetailClick = async (order) => {
        console.log('Detail clicked for order ID:', order);
        setSelectedOrderId(order.id); // 更新选中的 order ID
        const new1 = order.id.slice(1);
        console.log(new1);
        try {
            const response = await fetch(`http://10.147.19.129:3036/api/order/details?orderId=${new1}`);
            if (!response.ok) {
                throw new Error('Failed to fetch purchase history');
            }
            const data = await response.json();
            console.log(data); // 打印响应数据
            setHistory(data.data); // 更新购买历史数据
            console.log(history);
            setItem(order.id); 
            setUser(order.user_id); 
            setCard(order.card);
        } catch (err) {
            console.error("Error:", err); 
        } 
    };
    const handleDeleteOrder = (orderId) => {
        // 过滤掉被删除的订单
        console.log(orderId);
        localStorage.removeItem('orderId');
        localStorage.setItem('orderId',orderId);
        setAlertMessage("11111");
        
    };
    // 删除订单的函数
    const handleNewOrder = () => {
        const orderId = localStorage.getItem('orderId'); // 从 localStorage 获取订单 ID
        if (orderId) {
            // 执行删除操作（比如调用后端 API）
            const updateOrder = order.filter(order => order.id !== orderId);
            setOrder(updateOrder); // 更新订单列表
        } else {
            console.log("Order ID not found in localStorage");
        }
    };
    useEffect(() => {
        const orderList = async () => {
            
            try {
                const response = await fetch('http://10.147.19.129:3036/api/order/fullist');
                if (!response.ok) {
                    throw new Error('Failed to fetch purchase history');
                }
                const data = await response.json();
                console.log(data.data);
                setOrder(data.data);
            } catch (err) {
                console.log("error");
            } 
        };

        orderList(); // 在useEffect内直接调用
    }, []); // 只在组件首次加载时调用一次
    return(
        <div className={styles.OrderPart}>
             {alertMessage && (
                <ConfirmOrder itemId={localStorage.getItem('orderId')}  onClose={() => setAlertMessage(null)} onDelete={() => handleNewOrder(localStorage.getItem('orderId'))}  />
            )}
            <div className={styles.orderList}>
                <div className={styles.Order}>
                    <span className={styles.orderLeft}>
                        OrderID
                    </span>
                    <span className={styles.orderRight}  style={{  lineHeight: '6vh' }} >
                        Operation
                    </span>
                </div>
                {/* should have more suitable with the structure--componet */}
                {order.map((order, index) => (
                    <OrderCode 
                    key={order.id || index} // 确保有唯一的 key
                    order={order} // 传递整个订单对象作为 props
                    onDetailClick={handleDetailClick} 
                    onDeleteClick={handleDeleteOrder}
                    />
                ))}
            </div>

            <div className={styles.OrderDetail}>
                {/* <h2>Order Detail</h2> */}
                <h2>Order ID: <span>{item}</span></h2>
                <div className={styles.detail}>
                
                    <div className={styles.product}>
                    
                    {/* have a component just like what in history */}
                    {/* <HistoryItem  styles={styles}  /> */}
                    {history.length > 0 ? (
                    history.map((item, index) => (
                    <HistoryItem  styles={styles} key={index} data={item} />
                    ))
                    ) : (
                    <p>No purchase history available.</p>
                     )}
                    </div>
                    <div className={styles.OrderDetailRight}>
                    <div className={styles.address}>
                        <h3>
                            User Name
                        </h3>
                        <p>
                            {user}
                        </p>
                        
                    </div>
                    <div className={styles.pay}>
                        <h3>
                           Payment method 
                        </h3>
                        <p className={styles.payment}>
                            
                            {card}
                        </p>
                    </div>
                    <div>
                       
                        <div className={styles.price}>
                            <strong>
                                Subtotal
                            </strong>
                            <span>
                                $ {totalPrice.toFixed(2)}
                            </span>
                        </div>

                        <div className={styles.price}>
                            <strong>
                                Taxs
                            </strong>
                            <span>
                            $ {tax.toFixed(2)}
                            </span>
                        </div>

                        <div className={styles.price}>
                            <h3>
                                Total
                            </h3>
                            <h3 className={styles.totalprice}>
                                
                            $ {sum.toFixed(2)}

                                
                            </h3>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}