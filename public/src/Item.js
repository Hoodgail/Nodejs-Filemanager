import Dom from "./Dom.js";
import ContextMenu from "./ContextMenu.js"

import rename from "./util/rename.js";

export default class Item extends Dom {
    constructor(information, { icon, full_name, icon_name }, app){
        super("div", { className:"item", onclick: (e) => this.onclick(e) });
        const Scope = this;
        this.app = app;
        this.information = information;
        this.full_name = full_name;
        this.icon_name = icon_name;
        this.icon = icon;
        this.path = this.app.path + (this.app.path.endsWith("/")?"":"/") + this.full_name;
        this.selected = false;
        console.log(this);
        this.add(
            new Dom("div", {
                className:"switch",
                eval(){ Scope.select_switch = this.element },
                onclick(e){
                    e.stopPropagation();
                    Scope.toggleselect()
                }
            }),
            new Dom("div", {
                className:"icon",
                append:[ { element:this.icon } ]
            }),
            new Dom("span", { innerText:this.full_name })
        );
        
        this.contex = new ContextMenu(this.element, [
            { text:"open", onclick:() => this.onclick() },
            { text:"rename", onclick:() => rename(this) },
            { text:"delete", color:"#fd5555", onclick:() => this.delete() },
        ]);
        this.contex.install();
    }
    log_select(){
        const selected = this.app.items.filter(e=>e.selected);
        this.app.logger.log(`${selected.length.toString().fontcolor("gold")} selected`);
    }
    select(){
        this.selected = true;
        this.classList.add("selected");
        this.log_select()
    }
    unselect(){
        this.selected = false;
        this.classList.remove("selected");
        this.log_select()
    }
    toggleselect(){
        this.selected = !this.selected;
        this.select_switch.classList.toggle("selected");
        this.log_select()
    }
    rename(new_name){
        let new_path = [...this.path.split("/").slice(0, -1), new_name].join("/");
        this.app.fs.rename(this.path, new_path)
           .then(() => this.app.refresh())
    }
    delete(config = {}){
        const { refresh = true, remove = false } = config;
        const then = () => {
            if(refresh) this.app.refresh();
            if(remove) this.element.remove();
            this.app.logger.log(`${"delete".fontcolor("#F44336")} : ${this.type.fontcolor("grey")} ${this.path}`)
        }
        if(this.type == "file"){
            return this.app.fs.unlink(this.path).then(res => {
                then()
                return res;
            })
        } else if(this.type == "folder") {
            return this.app.fs.rmdir(this.path, { recursive: true }).then(res => {
                then()
                return res;
            })
        }
    }
};