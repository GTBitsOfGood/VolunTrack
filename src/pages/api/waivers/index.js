//const { validationResult, matchedData } = require("express-validator");
//const { CREATE_EVENT_VALIDATOR} = require("../../../../server/validators");

import multer from 'multer';
const express = require("express");
const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/files',
        filename: (req, file, cb) => cb(null, file.originalname)
    })
});



export default async function handler(req, res, next) {
    if (req.method === "GET") {
        return res.status(200).json({
            message: "test"
        });

    } else if (req.method === "POST") {
        //await addWaiver()
        
        upload.single('test');
        
        //console.log(req.body);
        //console.log(req);
        console.log(req.file);

        res.json({
            message: "Waiver successfully added!",
        });
    } else {
        res.status(404).json({message: "Invalid Request Method"});
    }
}


