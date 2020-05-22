import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const allowedType = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (allowedType.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

export default multer({
    storage, fileFilter
});
