const express = require("express");
//const cors = require("cors");
const fs = require('fs');
const readdir = require('fs-readdir-with-file-types');
const nodeDiskInfo = require('node-disk-info');
const http = require("http");
const { promisify } = require('util');

const api = {};


// api functions
api.get__readFile = promisify(fs.readFile);
api.get__readFileMeta = require('file-metadata');
api.post__writeFile = promisify(fs.writeFile);
api.post__mkdir = async function (dir) {
    if (!fs.existsSync(dir)) return await promisify(fs.mkdir)(dir);
}
api.delete__unlink = promisify(fs.unlink);
api.get__readdir = async function () {
    const res = await readdir(...arguments);
    return res.map(function (e) {
        e.isDirectory = e.isDirectory();
        e.isFile = e.isFile();
        return e
    })
};
api.get__disk = async function () {
    const res = await nodeDiskInfo.getDiskInfo();
    return res;
}

const app = express();
app.use(express.json());
app.use(express.static("public"));
const server = http.Server(app);

// to enable other site to use this api... (remove if you dont want that)
//app.use(cors());

// returns the availeable api functions
app.get("/ApiPath.js", function (req, res) {
    res.header("content-type", "application/javascript")
        .send(`export default ${JSON.stringify(Object.keys(api))}`)
})


Object.keys(api).forEach(function (name) {
    const method = name.split("__")[0];
    const path = name.split("__")[1];
    app[method]("/api/fs/" + path, async function (req, res) {
        let { args = "[]" } = req[method == "post" ? "body" : "query"];
        try {
            // gets and returns the data requested by the client
            args = JSON.parse(args);
            args[0] = __dirname + args[0];
            const data = await api[name](...args);
            return res.send({ success: true, data });
        } catch (e) {

            // returns the error
            return res.send({ success: false, error: e.toString() });
        }
    })
});


const port = 3000;
// starts the server on port... PORT: <port>
server.listen(port, function(){ 
    console.log("Server listening on : ", port);
});

app.get("/terminal", (req, res) => res.sendFile(__dirname + "/public/terminal.html"))