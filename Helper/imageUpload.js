
async function imageUpload() {
    try {
        upload.array('image');
        let storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'upload')
            },
            filename: (req, file, cb) => {
                console.log("file.fieldname  ", file.fieldname);
                console.log("final file name :::   ", Date.now() + path.extname(file.originalname));
                req.body.imageFileName = (file.fieldname + '-' + Date.now() + path.extname(file.originalname));
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        });
        let upload = multer({ storage: storage });
    }
    catch (e) {
        console.log("Send Email error", e);
        return e;
    }
}

module.exports = imageUpload;