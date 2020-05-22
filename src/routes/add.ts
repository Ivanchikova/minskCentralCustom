import Router  from 'express';
import Detector  from '../models/detectors';
import auth from '../middleware/auth';
import { Request, Response, NextFunction } from "express";
import { sensorValidators } from '../utils/validators';
import { validationResult } from 'express-validator';

const router = Router();

router.get('/', (req, res) => {
    res.render('add', {
        title: "Новый датчик",
        isAdd: true
    });
});

router.post('/', sensorValidators, auth, async (req: Request, res: Response) => {
    const error = validationResult(req);

    if(!error.isEmpty()) {
      return res.status(422).render('add', {
        title: "New detector",
        isAdd: true,
        error: error.array()[0].msg,
        data: {
          location: req.body.location,
        }
      })
    }
    try {
        await Detector.create({
        location: req.body.location,
      })
      res.redirect('/sensors');
    }
    catch(e) {
        console.log(e);
    }
});

export default router;