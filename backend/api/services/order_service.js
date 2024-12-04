const db = require('../database/database')
const fs = require('fs').promises
const path = require('path')

class OrderService {
  static async getOrderList(name) {
    let result = await db.queryOrderList(name)
    return result
  }
  static async getOrderInfo(id) {
    let info = await db.queryOrderInfo(id)
    console.log(info)
    if (info === null) {
      return {
        data: null, code: 404051, message: 'Order not exist!'
      }
    }
    let items = JSON.parse(info.items)
    const result = await Promise.all(items.map(async item => {
      let id = item.itemId
      let itemInfo = await db.queryItem(id)
      let imgData = null
      try {
        if (itemInfo.img_path) {
          const imgPath = path.join(__dirname, '..', '..', 'icon', 'icon_' + itemInfo.img_path);
          console.log(imgPath)
          imgData = await fs.readFile(imgPath)
          imgData = imgData.toString('base64')
        }
      } catch (error) {
        console.error(error)
      }
      return {
        itemId: id, name: item.name,
        price: item.price, qty: item.qty,
        brand: itemInfo.brand, ctg: itemInfo.ctg,
        subtotal: item.subtotal, tax: item.tax,
        total: item.total, img: imgData
      }
    }))
    return {
      data: result, code: 200, message: 'success'
    }
  }
}

module.exports = OrderService