import Folder from "./Folder.js";
import Dom from "./Dom.js";
import File from "./File.js";
import ToolButton from "./ToolButton.js";
export default class App {
    constructor(root, { fs }) {
        this.root = root;
        this.fs = fs;
        this.path = null
        this.items = [];
        this.listing = new Dom("div", { className: "listing" });
        this.tools = new Dom("div", { className: "tools" });
        this.info = new Dom("div", { className:"info" });
        this.pathDisplay = new Dom("div", { className:"path" });

        this.editor = new Map();

        this.root.add(this.listing, new Dom("div", {
             className:"detail" 
        }).add(this.info, this.pathDisplay), this.tools);
    }
    formatBytes(bytes) {
        var marker = 1024; // Change to 1000 if required
        var decimal = 3; // Change as required
        var kiloBytes = marker; // One Kilobyte is 1024 bytes
        var megaBytes = marker * marker; // One MB is 1024 KB
        var gigaBytes = marker * marker * marker; // One GB is 1024 MB
        var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

        // return bytes if less than a KB
        if (bytes < kiloBytes) return bytes + " Bytes";
        // return KB if less than a MB
        else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
        // return MB if less than a GB
        else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
        // return GB if less than a TB
        else return (bytes / gigaBytes).toFixed(decimal) + " GB";
    }
    renderInfo(object) {
        this.info.clear();
        Object.keys(object).forEach(name => {
            this.info.add(
                new Dom("div", {
                    className: "tag",
                    innerHTML: `${name}: ${object[name].fontcolor("grey")}`
                })
            )
        })
    }
    renderPath(path, onclick){
        const pathArray = path.split("/");
        function generateInput(dir, onclick){
            return new Dom("span", {
                className:"dir-item",
                append:[
                    new Dom("span", { 
                        className:"dir", innerText:dir,
                        onclick
                    }),
                    new Dom("span", { className:"slash", innerText:"/" }),
                ]
            })
        }
        return [generateInput("__basedir", () => onclick("/")), ...pathArray.filter(r=>r).map((dir, index) => {
            index = index + 2;
            return generateInput(dir, function(){
                pathArray.length = index;
                onclick(pathArray.join("/"));
            })
        })]
    }
    tool(){ this.tools.add(new ToolButton(...arguments)) }
    isValidFileName(fname){
        var rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
        var rg2=/^\./; // cannot start with dot (.)
        var rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
        return rg1.test(fname)&&!rg2.test(fname)&&!rg3.test(fname);
    }
    refresh(){ this.init(this.path, true) }
    init(path = "/", ignoresamepath) {
        // renders the listing
        if(!ignoresamepath) if(path === this.path) return;
        this.path = path;
        this.items = [];
        this.fs.readdir(path)
            .then(dir => {
                this.listing.clear();
                dir.forEach(data => {
                    if (data.isFile) {
                        const file = new File(data, this)
                        this.items.push(file)
                        this.listing.add(file);
                    }
                    if(data.isDirectory) {
                        const folder = new Folder(data, this);
                        this.items.push(folder);
                        this.listing.add(folder);
                    }
                })
            });

        this.fs.disk("")
            .then(([{ _used, _available, _capacity }]) => {
                this.renderInfo({
                    Available: this.formatBytes(_available),
                    Capacity: _capacity,
                    Used: this.formatBytes(_used)
                })
            });
        this.pathDisplay.clear();
        this.pathDisplay.add(...this.renderPath(this.path, path => this.init(path)))
    }
}