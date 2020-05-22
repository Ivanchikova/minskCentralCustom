import Router from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/users';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import { registerValidators } from '../utils/validators';

import { EmailService } from '../service/email/email-service';
import container from '../container';
import { TYPES } from '../types';
import { Configuration } from '../configuration/configuration';

const emailService = container.get<EmailService>(TYPES.EmailService);
const configuration = container.get<Configuration>(TYPES.Configuration);
const router = Router();

router.get('/auth/login', async (req, res) => {
    res.render('auth/login',
        {
            title: "Авторизация",
            isLogin: true,
            RegisterError: req.flash('RegisterError'),
            LoginError: req.flash('LoginError')
        });
});

router.get('/auth/logout', async (req, res) => {
    req!.session!.destroy(() => {
        res.redirect('/auth/login#login');
    })
});

router.post('/auth/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        const candidate = await User.findOne({ login });
        if (candidate) {
            const areSome = await bcrypt.compare(password, candidate.password);
            if (areSome) {
                req!.session!.user = candidate;
                req!.session!.isAuthenticated = true;
                req!.session!.save(err => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/');
                });
            }
            else {
                req.flash('LoginError', 'Ошибка входа, проверь вводимые данные');
                res.redirect('/auth/login#login');
            }
        }
        else {
            req.flash('LoginError', 'Ошибка входа, проверь вводимые данные');
            res.redirect('/auth/login#login');
        }
    }
    catch (e) {
        console.log(e);
    }
});

router.post('/auth/register', registerValidators, async (req: any, res: any) => {
    const { fio, login, email, password, confirm } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('RegisterError', errors.array()[0].msg);
        return res.status(422).redirect('/auth/login#register');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ fio, login, email, password: passwordHash, confirm });
    await user.save();

    res.redirect('/auth/login#login');

    return emailService.sendRegisterMail(email);
});

router.get('/auth/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль?',
        error: req.flash('error')
    })
});

router.post('/auth/reset', async (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer): Promise<void> => {
            if (err) {
                req.flash('error', 'Что-то пошло не так попробуйте позже');
                res.redirect('/auth/reset');
            }
            const token = buffer.toString('hex');
            const candidate = await User.findOne({ email: req.body.email });

            if (!candidate) {
                req.flash('error', 'Такого поьзоватея нет');
                res.redirect('/auth/reset');
            }

            candidate.resetTolen = token;
            candidate.resetTolenExp = Date.now() + 60 * 60 * 1000;
            await candidate.save();

            const restoreUrl = `${configuration.baseUrl}/auth/password/${token}`;

            emailService.sendRestorePasswordMail(candidate.email, restoreUrl)

            res.redirect('/auth/login');
        })
    }
    catch (e) {
        console.log(e);
    }
});

router.get('/auth/password/:tolen', async (req, res) => {
    if (!req.params.tolen) {
        return res.redirect('/auth/reset');
    }
    try {
        const candidate = await User.findOne({
            resetTolen: req.params.tolen,
            resetTolenExp: { $gt: Date.now() }
        })
        if (!candidate) {
            res.redirect('/auth/login');
        } else {
            res.render('auth/password', {
                title: 'Restore access',
                error: req.flash('error'),
                userId: candidate._id.toString(),
                tolen: req.params.tolen
            })
        }
    }
    catch (e) {
        console.log(e);
    }
});

router.post('/auth/password', async (req, res) => {
    try {
        const candidate = await User.findOne({
            resetTolen: req.body.tolen,
            _id: req.body.userId,
            resetTolenExp: { $gt: Date.now() }
        });
        if (candidate) {
            candidate.password = await bcrypt.hash(req.body.password, 10);
            candidate.resetTolen = undefined;
            candidate.resetTolenExp = undefined;
            await candidate.save();
            res.redirect('/auth/login');
        } else {
            req.flash('LoginError', 'Token lifetime expired');
            res.redirect('/auth/login');
        }
    }
    catch (e) {
        console.log(e);
    }
});
export default router;