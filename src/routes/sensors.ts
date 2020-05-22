import Router from 'express';
import Detector from '../models/detectors';
import keys from '../keys';
import fetch from 'node-fetch';
import auth from '../middleware/auth';
import { Request, Response, NextFunction } from "express";
import { sensorValidators } from '../utils/validators';
const router = Router();
const KELVIN = 273.15;

router.get('/sensors',  async (req, res) => {
    const detector = await Detector.findAll();
    res.render('sensors', {
        title: "Датчики",
        isSensors: true,
        isDelete: false,
        detector
    });
});

router.get('/sensors/edit/:id', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    const detector = await Detector.findByPk(req.params.id);
    if (detector !== null) {
    res.render('sensor-edit', {
        title: `Датчик ${detector.location}`,
        layout: 'empty', 
        detector
    })
  }
});

router.get('/sensors/:id', async (req, res) => {
    const detector = await Detector.findByPk(req.params.id);

    if (detector !== null) {
        const urlWeather = (`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(detector.location)}&appid=${keys.API_URL}`);
        const resp = await fetch(urlWeather);
        try {
            const mySity = await resp.json();
            const temp = Math.trunc(mySity.main.temp - KELVIN);
            res.render('sensor', {
                title: `Датчик ${detector.location}`,
                layout: 'empty', 
                detector,
                mySity,
                temp
            });
        }
        catch {
            res.render('sensor', {
                title: `Датчик ${detector.location}`,
                layout: 'empty', 
                detector,
            });
        }

    }

})

router.post('/edit', sensorValidators, auth, async (req: Request, res: Response) => {

    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;

    delete req.body.id;
    const location = req.body.location;
    await Detector.update({location}, { where: {
                           id  }
                           });
    res.redirect('/sensors');
})

router.post('/delete', auth, async (req, res) => {
    try {
            await Detector.destroy({
                    where: {
                     id: req.body.id}});
            res.redirect('/sensors');
    }
    catch(e) {
    console.log(e);
    }

})

export default router;