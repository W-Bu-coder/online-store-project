const db = require('../database/database')
const fs = require('fs').promises
const path = require('path')

class ItemService {
  static async getItemList(filtPara) {
    const data = await db.queryItemList(filtPara)
    // console.log(data)
    const items = await Promise.all(data.map(async item => {
      let imgData = null
      try {
        if (item.img_path) {
          const imgPath = path.join(__dirname, '..', '..', 'icon', 'icon_' + item.img_path);
          console.log(imgPath)
          imgData = await fs.readFile(imgPath)
          imgData = imgData.toString('base64')
        }
      } catch (error) {
        console.error('Reading failed:', item.id, error)
      }
      return {
        itemId: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock,
        brand: item.brand,
        rate: item.rate,
        ctg: item.ctg,
        img: imgData
      }
    }))
    return items
  }

  static async getItemDetails(itemId) {
    const item = await db.queryItem(itemId)
    console.log(item)
    let imgData = null
    try {
      if (item.img_path) {
        const imgPath = path.join(__dirname, '..', '..', 'img', item.img_path);
        // console.log(imgPath)
        imgData = await fs.readFile(imgPath)
        imgData = imgData.toString('base64')
      }
    } catch (error) {
      console.error('Reading failed:', item.id, error)
    }
    let data = {
      itemId: item.id,
      name: item.name,
      spec: JSON.parse(item.specification),
      price: item.price,
      stock: item.stock,
      brand: item.brand,
      rate: item.rate,
      ctg: item.ctg,
      img: imgData
    }
    return data
  }

}

module.exports = ItemService;