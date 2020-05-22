import Router from 'express';
import Detectors from '../models/detector';
import auth from '../middleware/auth';
import { sensorValidators } from '../utils/validators';
import { validationResult } from 'express-validator';

const router = Router();

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: "Новый датчик",
    isAdd: true
  });
});

router.post('/', sensorValidators, auth, async (req: any, res: any) => {

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).render('add', {
      title: "Новый датчик",
      isAdd: true,
      error: error.array()[0].msg,
      data: {
        model_detector: req.body.model_detector,
        name_detector: req.body.name_detector,
        producing_country: req.body.producing_country
      }
    })
  }

  const detector = new Detectors({
    model_detector: req.body.model_detector,
    name_detector: req.body.name_detector,
    producing_country: req.body.producing_country
  });

  try {
    await detector.save();
    res.redirect('/sensors');
  }
  catch (e) {
    console.log(e);
  }
});

export default router;