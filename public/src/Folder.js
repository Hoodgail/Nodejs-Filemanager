import Item from "./Item.js";
import Icons from "./Icons.js";

export default class Folder extends Item {
    constructor(information, app){
        super(information, {
            full_name:information.name,
            icon_name:"folder",
            icon:Icons.get("folder")
        }, app);
        this.information = information;
        this.app = app;
        this.type = "folder";
    }

    onclick(event){
        const path = this.app.path + (this.app.path.endsWith("/")?"":"/") + this.full_name;
        this.app.init(path);
        this.app.logger.log(`${"open".fontcolor("lightgreen")} ${path.fontcolor("grey")}`);
    }

};