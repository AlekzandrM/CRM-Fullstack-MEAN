const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

// (get) localhost:5000/api/order?offset=2&limit=5
module.exports.getAll = async (req, res) => {
    const query = {
        user: req.user.id //описывает запрос в базу по конкр. юзеру
    }
    // Все условия пойдут в .find(query)
    // Если есть в запросе query Дата старта.
    if (req.query.start) {
        query.date = { // у любого заказа есть поле date
            $gte: req.query.start // Больше или равно
        }
    }
    // Если есть в запросе query Дата конца.
    if (req.query.end) {
        if (!query.date) {
            query.date = {}
        }
        query.date['$lte'] = req.query.end
    }
    // Если надо получить определенный заказ
    if (req.query.order) {
        query.order = +req.query.order
    }

    try {
        const orders = await Order
            .find(query)
            .sort({date: -1}) // по убыванию
            .skip(+req.query.offset) //колич пропуск. элем - отступ
            .limit(+req.query.limit) //колич отображ. элементов на стр

        res.status(200).json(orders)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async (req, res) => {
    try {
        const  lastOrder = await  Order // Достаем все заказы юзера в порядке убывания
            .findOne({user: req.user.id})
            .sort({date: -1})

        const maxOrder = lastOrder ? lastOrder.order : 0

        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder +1
        }).save()
        res.status(201).json(order)
    } catch (e) {
        errorHandler(res, e)
    }
}
