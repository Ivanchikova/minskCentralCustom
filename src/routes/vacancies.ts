import Router from 'express';
import FreeVacancy from '../models/vacancies';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import { Request, Response, NextFunction } from "express";
import { vacancyValidators } from '../utils/validators';
const router = Router();

router.get('/',  async (req, res) => {
    const freeVacancy = await FreeVacancy.findAll();
    res.render('vacancies', {
        title: "Вакансии",
        isVacancies: true,
        isDelete: false,
        freeVacancy
    });
});

router.get('/edit/:id', auth, admin, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    const freeVacancy = await FreeVacancy.findByPk(req.params.id);
    if (freeVacancy !== null) {
    res.render('vacancy-edit', {
        title: `Датчик ${freeVacancy.jobVacancy}`,
        layout: 'empty', 
        freeVacancy
    })
  }
});

router.get('/:id', async (req, res) => {
    const freeVacancy = await FreeVacancy.findByPk(req.params.id);

    if (freeVacancy !== null) {
        try {
            res.render('vacancy', {
                title: `Датчик ${freeVacancy.jobVacancy}`,
                layout: 'empty', 
                freeVacancy,
            });
        }
        catch {
            res.redirect('/vacancies');
        }

    }

})

router.post('/edit', vacancyValidators, auth, admin, async (req: Request, res: Response) => {

    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;

    delete req.body.id;
    const  { jobVacancy, description, wage } = req.body;
    await FreeVacancy.update({ jobVacancy, description, wage }, { where: {
                           id  }
                           });
    res.redirect('/vacancies');
})

router.post('/delete', auth, admin, async (req, res) => {
    try {
            await FreeVacancy.destroy({
                    where: {
                     id: req.body.id}});
            res.redirect('/vacancies');
    }
    catch(e) {
    console.log(e);
    }

})

export default router;