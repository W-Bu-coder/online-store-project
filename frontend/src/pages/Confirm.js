import React, { useState }  from 'react';
import styles from '../css/Alert.module.css';
import CloseImage from '../img/close.png';
export default function Confirm({itemId, onClose, onDeleteSuccess  }){
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
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://10.147.19.129:3036/api/item/info?itemId=${itemId}`, { // 替换为后端 API 地址
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }), // 将 itemId 作为 JSON 数据发送
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Item deleted successfully:', result);
                onClose();
                onDeleteSuccess();
                setIsVisible(false); // 请求成功后隐藏弹窗
                
            } else {
                console.error('Failed to delete item:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error while deleting item:', error);
        }
    };
    return(
        <div className={styles.DeleteCom}>
            <h3>Confirm<img alt="ConfirmDelete" className={styles.confirmClose} src={CloseImage} onClick={handleClose}  /></h3>
            <div className={styles.ConfirmDetail}>
                <p>Do you really want to delete?</p>
                <button id="Back" className={styles.deleteback} onClick={handleClose}  >Back</button>
                <button className={styles.deleteback} onClick={handleDelete}>Confirm</button>
            </div>
        </div>
    );
}