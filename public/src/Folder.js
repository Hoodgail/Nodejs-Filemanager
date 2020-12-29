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
    }

    onclick(event){
        this.app.init(this.app.path + "/" + this.information.name)
    }

};