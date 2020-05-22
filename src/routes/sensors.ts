import Router from 'express';
import Detectors from '../models/detector';
import auth from '../middleware/auth';
import { sensorValidators } from '../utils/validators';
import { validationResult } from 'express-validator';
const router = Router();

router.get('/sensors', async (req, res) => {
    const detector = await Detectors.find();
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
    const detector = await Detectors.findById(req.params.id);
    res.render('sensor-edit', {
        title: `Датчик ${detector.name_detector}`,
        layout: 'empty',
        detector
    })
});

router.get('/sensors/:id', async (req, res) => {
    const detector = await Detectors.findById(req.params.id);
    res.render('sensor', {
        title: `Датчик ${detector.name_detector}`,
        layout: 'empty',
        detector
    });
})

router.post('/edit', sensorValidators, auth, async (req: any, res: any) => {

    const error = validationResult(req);
    const { id } = req.body;

    if (!error.isEmpty()) {
        return res.status(422).redirect(`/sensors/edit/${id}?allow=true`);
    }

    delete req.body.id;
    await Detectors.findOneAndUpdate({ _id: id }, req.body);
    res.redirect('/sensors');
})

router.post('/delete', auth, async (req, res) => {
    try {
        await Detectors.deleteOne({ _id: req.body.id });
        res.redirect('/sensors');
    }
    catch (e) {
        console.log(e);
    }

})

export default router;