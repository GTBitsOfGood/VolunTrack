import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import glob from 'glob';
import fs from 'fs'


const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {       
            glob('./public/files/*', function (er, files) {
                for (const filePath of files) {
                    const splits = filePath.split('/');
                    const [fileName, extension] = splits[3].split('.');
                    if (fileName === file.fieldname && ('.'+extension) !== path.extname(file.originalname)) {
                        fs.unlinkSync(filePath);
                    }
                }
            })
            cb(null, './public/files/');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + path.extname(file.originalname));
        },
        
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            return cb(new Error("Only pdf/doc/docx are allowed"), false);
        }
    },
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.post('/api/waivers/', upload.fields([
    { name: 'adult', maxCount: 1 },
    { name: 'minor', maxCount: 1 }
  ]), (req, res) => {
    res.status(200).json({ data: 'success' });
});


export default apiRoute;

export const config = {
    api: {
        bodyParser: false,
    },
};


