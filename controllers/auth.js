const User = require('../models/User')

module.exports.login = function (req, res) {
    res.status(200).json({
        login: {
            email: req.body.email,
            password: req.body.password
        }
    })
}

module.exports.register = async (req, res) => {
    //email password
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        //Пользователь существует, нужно отправить ошибку
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой.'
        })
    } else {
        //Нужно создать пароль
    }
}
