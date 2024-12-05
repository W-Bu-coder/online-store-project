import React, { useState,useContext,useEffect } from 'react';
import styles from '../css/UserProfile.module.css';
import PurchaseItem from './PurchaseItem';
export default function (){
    const  userName =localStorage.getItem('username');
    const [loading, setLoading] = useState(true);  // 用于控制加载状态
    const [error, setError] = useState(null);
    const [user,setUser] = useState(null);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    // see history
    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://10.147.19.129:3036/api/order/list?username=${localStorage.getItem('username')}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch purchase history');
                }
                const data = await response.json();
                setPurchaseHistory(data.data); // 更新购买历史数据
            } catch (err) {
                setError(err.message); // 错误处理
            } finally {
                setLoading(false);
            }
        };

        fetchPurchaseHistory(); // 在useEffect内直接调用
    }, []); // 只在组件首次加载时调用一次
    return(
        <div className= {styles.All}>
          <h1>History</h1>
          {purchaseHistory.length > 0 ? (
                purchaseHistory.map((item, index) => (
                    <PurchaseItem
                        key={index}
                        data = {item}
                    />
                ))
            ) : (
                !loading && <p>No purchase history available.</p>
            )}
            </div>
    );
}