const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')
const moment = require('moment')

module.exports.overview = async (req, res) => {
    try {
        // список всех заказов в системе в []
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        // карта по дням в какой день сколько заказов в {}
        const ordersMap = getOrdersMap(allOrders)
        // заказы за вчера
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
        // 5. Общая выручка
        const totalGain = calculatePrice(allOrders)
        // 6. Выручка в день
        const gainPerDay = totalGain / daysNumber
        // 7. Выручка за вчера
        const yesterdayGain = calculatePrice(yesterdayOrders)
        // 8. % выручки
        const gainPercent = (((yesterdayGain / gainPerDay) -1 ) * 100).toFixed(2)
        // 9. Сравнение выручки
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
        // 10. Сравнение количества заказов
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
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

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.quantity * item.cost
        }, 0)
        return total += orderPrice
    }, 0)
}
