import React, { useState }  from 'react';
import styles from '../css/Alert.module.css';
import CloseImage from '../img/close.png';
export default function Alert({ message, onClose }){
    const [isVisible, setIsVisible] = useState(true); // 控制 div 的显示状态

    const handleClose = () => {
        setIsVisible(false); // 点击时隐藏组件
        onClose(); // 调用关闭回调，父组件清空消息
    };
    if (!isVisible) {
        return null; // 如果不显示，直接返回 null
    }

    if (!isVisible) {
        return null; // 如果不显示，直接返回 null
    }
    return(
        <div className={styles.DeleteCom}>
            <h3>Error!<img alt="ConfirmDelete" className={styles.confirmClose} src={CloseImage} onClick={handleClose}  /></h3>
            <div className={styles.ConfirmDetail}>
                <p>{message}</p>
                <button id="Back" className={styles.Back} onClick={handleClose}  >Back</button>
                
            </div>
        </div>
    );
}