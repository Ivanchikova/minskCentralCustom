import Router  from 'express';
import auth from '../middleware/auth';
import User from '../models/users';

const router = Router();

router.get('/profile', auth, async (req, res) => {
    res.render('profile', {
        title:  'Profile',
        isProfile: true,
        user: req.body.user,
    })
});

router.post('/profile', auth, async (req, res) => {
    try {
        const candidate = await User.findByPk(req.body.user.id);
        console.log(candidate);
         const toChange = {
               fio: req.body.fio,
               avatarURL: ''
        };

         if (req.file) {
            toChange.avatarURL = req.file.destination + '/' + req.file.filename;
         }
        
        Object.assign(candidate, toChange);
        if( candidate !=  null) {
        await candidate.save();
        }
        res.redirect('/profile');
    }
    catch(e) {
        console.log(e);
    }

});

export default router;