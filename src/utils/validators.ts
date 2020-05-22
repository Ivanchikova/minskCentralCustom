import { check } from 'express-validator';
import User from '../models/users';

export const registerValidators = [
    check('fio', "Минимально 3 символа для fio").isLength({ min: 3 })
        .trim(),

    check('login', "Минимально 3 символа для login").isLength({ min: 3 })
        .custom(async (value, { req }) => {
            try {
                const candidate = await User.findOne({ login: value });
                if (candidate) {
                    return Promise.reject('Такой пользователь уже существует');
                }
            }
            catch (e) {
                console.log(e);
            }
        })
        .trim(),
    check('email', 'Введите корректно email')
        .isEmail()
        .normalizeEmail(),

    check('password', 'Минимально 6 значений, наличие латиницы и цифр')
        .isLength({ min: 6, max: 56 })
        .isAlphanumeric()
        .trim(),

    check('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать');
        }
        return true;
    })
        .trim()
];

export const sensorValidators = [
    check('model_detector', 'Минимальное количество символов 2').isLength({ min: 2 })
        .trim(),
    check('name_detector', 'Минимальное количество символов 2').isLength({ min: 2 })
        .trim(),
    check('producing_country', 'Минимальное количество символов 2').isLength({ min: 2 })
        .trim(),
];
