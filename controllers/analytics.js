const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')
const moment = require('moment')

module.exports.overview = async (req, res) => {
    try {
        // список всех заказов в системе в []
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        // карта по дням в какой день сколько заказов в {}
        const ordersMap = getOrdersMap(allOrders)
        // колич заказов за вчера
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []

        // Количество заказов вчера
        const yesterdayOrdersNumber = yesterdayOrders.length
        // 1. Количество заказов:
        const totalOrdersNumber = allOrders.length
        // 2. Количество дней с заказами всего
        const daysNumber = Object.keys(ordersMap).length
        // 3. Заказов в день
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0)
        // 4. % для количества заказов
        // ((заказов вчера / кол-во заказов в день) -1 ) * 100
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) -1 ) * 100).toFixed(2)

        res.status(200).json({
            gain: {
                percent: '',
                compare: '',
                yesterday: '',
                isHigher: ''
            },
            orders: {
                percent: '',
                compare: '',
                yesterday: '',
                isHigher: ''
            }
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.analytics = (req, res) => {

}

function getOrdersMap(orders = [] ) {
    const daysOrders = {}

    orders.forEach(order => {
        // date-ключь, опред-ся через дату заказа: '12.05.20'
        const date = moment(order.date).format('DD.MM.YYYY')
        // не включать в аналитику сегодняшний день
        if (date === moment().format('DD.MM.YYYY')) {
            return
        }
        // если у daysOrders нет поля date
        if(!daysOrders[date]) {
            daysOrders[date] = []
        }
        // если у daysOrders есть ключь date ложим в него заказ
        // { '12.05.20': [ {order1}, {order2} ] }
        daysOrders[date].push(order)
    })
    return daysOrders
}
