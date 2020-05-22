import Router  from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/users';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Request, Response, NextFunction } from "express";
import { validationResult } from 'express-validator';
import { registerValidators } from '../utils/validators';
import regEmail from '../emails/registration';
import resetEmail from '../emails/reset';
import { Sequelize, Model, DataTypes, BuildOptions, Op } from 'sequelize';

const router = Router();
const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'ca45bf9cd12e9a',
        pass: 'f444b40921548f'
     }
});

router.get('/auth/login', async (req, res) => {
    res.render('auth/login',
    {
        title: "Authorization",
        isLogin: true,
        RegisterError: req.flash('RegisterError'),
        LoginError: req.flash('LoginError')
    });
});

router.get('/auth/logout', async (req, res) => {
     req.session!.destroy(() => {
     res.redirect('/auth/login#login');
    });
});

router.post('/auth/login', async (req, res) => {
    try {
        const {login, password} = req.body;
        const candidate = await User.findOne({ where: { login }});
        if (candidate) {
            const areSome = await bcrypt.compare(password, candidate.password);
            if (areSome) {
                req.session!.user = candidate;
                req.session!.isAuthenticated = true;
                req.session!.save(err => {
                   if(err) {
                    throw err;
                   } 
                res.redirect('/');
                });
            }
            else {
                req.flash('LoginError','Ошибка входа, проверь вводимые данные');
                res.redirect('/auth/login#login');
            }
        }   
        else {
            req.flash('LoginError','Ошибка входа, проверь вводимые данные');
            res.redirect('/auth/login#login');
        }
    }
    catch(e) {
        console.log(e);
    }
});

router.post('/auth/register', registerValidators, async (req: Request, res: Response) => {
    try {
    const {fio, login, email, password, confirm} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('RegisterError', errors.array()[0].msg);
        return res.status(422).redirect('/auth/login#register');
      }
        const passwordBcryptsjs =  await bcrypt.hash(password, 10);
        await User.create({fio, login, email, password: passwordBcryptsjs, confirm});
        res.redirect('/auth/login#login');
        transporter.sendMail(regEmail(email), (err, info) => {
            if(err) {
                console.log(err);
            }
            console.log(info);
        });
      }
    catch(e) {
        console.log(e);
    }
});

router.get('/auth/reset', (req, res) => {
    res.render('auth/reset', {
       title: 'Forgot your password?',
       error: req.flash('error')
    })
});

router.post('/auth/reset', (req, res) => {
    try {
    crypto.randomBytes(32, async (err, buffer) => {
        if(err) {
            req.flash('error', 'Что-то пошло не так попробуйте позже');
            res.redirect('/auth/reset');
        }
            const tolen = buffer.toString('hex');
            const candidate =  await User.findOne({ where: {email: req.body.email }});

        if(candidate) {
            candidate.resetTolen = tolen;
            candidate.resetTolenExp = Date.now() + 60 * 60 * 1000;
            await candidate.save();
            transporter.sendMail(resetEmail(candidate.email, tolen), (err, info) => {
                if (err) {
                    console.log(err);
                }
                console.log(info);
            });
            res.redirect('/auth/login');
        }
        else {
            req.flash('error', 'Такого пользователя нет');
            res.redirect('/auth/reset');
        }
    })
}
    catch(e) {
        console.log(e);
    }
});

router.get('/auth/password/:tolen', async (req, res) => {
        if (!req.params.tolen) {
           return  res.redirect('/auth/reset');
        }
        try {      
        const candidate =  await User.findOne({ where: {

              resetTolen: req.params.tolen,
              [Op.and]:
              {resetTolenExp: {[Op.gt]: Date.now()}}}
        })
        if (!candidate) {
            res.redirect('/auth/login');
        } else {
            res.render('auth/password', {
                    title: 'Restore access',
                    error: req.flash('error'),
                    userId: candidate.id.toString(),
                    tolen: req.params.tolen
            })
        }
    }
    catch(e) {
        console.log(e);
    }
});

router.post('/auth/password', async (req, res) => {
    try {
        const candidate = await User.findOne({ where: {
                resetTolen: req.body.tolen,
                id: req.body.userId,
                resetTolenExp: {$gt: Date.now()}}
        });
        if(candidate) {
            candidate.password =  await bcrypt.hash(req.body.password, 10);
            candidate.resetTolen = undefined;
            candidate.resetTolenExp = undefined;
            await candidate.save();
            res.redirect('/auth/login');
        } else {
            req.flash('LoginError', 'Token lifetime expired');
            res.redirect('/auth/login');
        }   
    }
    catch(e) {
        console.log(e);
    }
});
export default router;