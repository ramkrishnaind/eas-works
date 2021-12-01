
function uploadFile(Models) {
    async function uploadFiles(req, res) {
        console.log(req.body);
        console.log(req.files);
        res.json({ message: "Successfully uploaded files" });9
    }
    return uploadFiles;
}
module.exports = uploadFile;