import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import UserManage from './UserManage';
import ProductManage from './ProductManage.js';
import OrderManage from './OrderManage';
import styles from '../css/Dashboard.module.css';

export default function Dashboard(){
    const [activeTab, setActiveTab] = useState(0);
    const admin = localStorage.getItem('username');
    
    const menuItems = [
        
        'Products',
        'Orders',
      ];
    const tabContents = [
        (
            <ProductManage />
        ),(
            <OrderManage />
        )
    ];
    return(
        <main className={styles.dashboard}>
            {/* left navigation bar */}
            <div className={styles.LeftNav}>
                <h1>
                    <Link to="/">
                        Computer Store
                    </Link>
                </h1>
                <p className={styles.manage}>Management</p>
                <ul>
                {menuItems.map((item, index) => (
                    <li
                    key={index}
                    className={activeTab === index ? styles.active : ''}
                    onClick={() => setActiveTab(index)} // 点击切换选项
                    >
                    {item}
                    </li>
                ))}
                </ul>
            </div>
            <div className={styles.Right}>
                <h2>Dashboard</h2>
                <p className={styles.adminName}>Admin : <span>{admin}</span></p>
                <div className={styles.content}>
                    {/* if it's user bodard */}
                    {tabContents[activeTab]}
                    {/* if it's product also its the func to add */}
                    
                </div>
                

            </div>
        </main>
    );
}