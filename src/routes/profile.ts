import Router from 'express';
import auth from '../middleware/auth';
import Users from '../models/users';


const router = Router();

router.get('/profile', auth, async (req, res) => {
    res.render('profile', {
        title: 'Profile',
        isProfile: true,
        user: req.body.user.toObject(),
    })
    console.log(req.body.user.avatarURL);
    // console.log(req.body.user.toObject());
});

router.post('/profile', auth, async (req, res) => {
    try {
        const candidate = await Users.findById(req.body.user._id);

        const toChange = {
            fio: req.body.fio,
            avatarURL: ''
        };

        console.log(req.file);

        if (req.file) {
            toChange.avatarURL = req.file.destination + '/' + req.file.filename;
        }

        Object.assign(candidate, toChange);
        await candidate.save();
        res.redirect('/profile');
    }
    catch (e) {
        console.log(e);
    }

});

export default router;