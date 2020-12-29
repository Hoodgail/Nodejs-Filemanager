import Dom from "./Dom.js";
import ContextMenu from "./ContextMenu.js"
export default class Item extends Dom {
    constructor(information, { icon, full_name, icon_name }, app){
        super("div", { className:"item", onclick: (e) => this.onclick(e) });
        const Scope = this;
        this.app = app;
        this.information = information;
        this.full_name = full_name;
        this.icon_name = icon_name;
        this.icon = icon;
        this.path = this.app.path + (this.app.path.endsWith("/")?"":"/") + this.information.full_name;
        this.selected = false;
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
            { text:"delete", color:"#fd5555", onclick:() => this.delete() }
        ]);
        this.contex.install();
    }
    select(){
        this.selected = true;
        this.classList.add("selected");
    }
    unselect(){
        this.selected = false;
        this.classList.remove("selected");
    }
    toggleselect(){
        this.selected = !this.selected;
        this.select_switch.classList.toggle("selected");
    }
    delete(){ return (this.app.refresh(), this.app.fs.unlink(this.path)) }
};