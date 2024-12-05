import React, { useState }  from 'react';
import Slider from '@mui/material/Slider';
import styles from '../css/Homepage.module.css';
import downImage from '../img/down.png';
function valuetext(value) {
  return `$ ${value}`;
}
// function should transit to parent
export default function Navigation({
  onCategoryChange, onBrandsChange, onPriceLowChange, onPriceHighChange 
}) {
  // value should be passed
  const [value, setValue] = React.useState([0, 3000]);
  const [priceLow, setPriceLow] = useState(0); // 最低价格
  const [priceHigh, setPriceHigh] = useState(3000); // 最高价格
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedBrands, setSelectedBrands] = React.useState('');
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);  // 通知父组件更新Category
    
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrands(brand);
    onBrandsChange(brand);  // 通知父组件更新Brands
    
  };
   // 更新价格滑块的值
   const handlePriceChange = (event, newValue) => {
    setValue(newValue);
  };

  // 点击 Search 按钮时将滑块值传递到父组件
  const handlePriceClick = () => {
    const [low, high] = value; // 从 value 中获取最低价和最高价
    onPriceLowChange?.(low);   // 传递最低价格
    onPriceHighChange?.(high); // 传递最高价格
    
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
    return (
      <div  className = {styles.Navigation}>
        <div className = {styles.menu}>
        <button className={styles.menuTitle}>Category
          <img src={downImage} alt="down" />
        </button>
        <ul className={styles.extendMenu}>
        <li
            className={`${styles.item} ${selectedCategory === '' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('')}
          >
            ALL Category
          </li>
          <li
            className={`${styles.item} ${selectedCategory === 'Laptop' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('Laptop')}
          >
            Laptop
          </li>
          <li
            className={`${styles.item} ${selectedCategory === 'Desktop' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('Desktop')}
          >
            Desktop
          </li>
          <li
            className={`${styles.item} ${selectedCategory === 'Tablet' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('Tablet')}
          >
            Tablet
          </li>
          <li
            className={`${styles.item} ${selectedCategory === 'Hard Drive' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('Hard Drive')}
          >
            Hard Drives
          </li>
          <li
            className={`${styles.item} ${selectedCategory === 'Accessory' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('Accessory')}
          >
            Accessory
          </li>
        </ul>
        </div>

        <div className={styles.menu}>
        <button className={styles.menuTitle}>Brands
          <img src={downImage} alt="down" />
        </button>
        <ul className={styles.extendMenu}>
        <li
            className={`${styles.item} ${selectedBrands === '' ? styles.selectedNav : ''}`}
            onClick={() => handleBrandSelect('')}
          >
            ALL Brands
          </li>
          <li
            className={`${styles.item} ${selectedBrands === 'HP' ? styles.selectedNav : ''}`}
            onClick={() => handleBrandSelect('HP')}
          >
            HP
          </li>
          <li
            className={`${styles.item} ${selectedBrands === 'DELL' ? styles.selectedNav : ''}`}
            onClick={() => handleBrandSelect('DELL')}
          >
            DELL
          </li>
          <li
            className={`${styles.item} ${selectedBrands === 'APPLE' ? styles.selectedNav : ''}`}
            onClick={() => handleBrandSelect('APPLE')}
          >
            APPLE
          </li>
          <li
            className={`${styles.item} ${selectedBrands === 'LENOVO' ? styles.selectedNav : ''}`}
            onClick={() => handleBrandSelect('LENOVO')}
          >
            LENOVO
          </li>
        </ul>
        </div>

        <div className={styles.menu}>
        <button className={styles.menuTitle}>Price
          <img src={downImage} alt="down" />
        </button>
        <div className={styles.scale}>
          <Slider
          getAriaLabel={() => 'Minimum distance'}
          value={value}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          min={0}
          max={3000}
          disableSwap
          />
          <div className={styles.Checkprice} onClick={handlePriceClick} >
            Search
          </div>
        </div>
        </div>

       

        
      </div>
    );
  }
  
 