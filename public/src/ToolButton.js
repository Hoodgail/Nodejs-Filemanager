import Dom from "./Dom.js";
export default class ToolButton extends Dom {
    constructor({ title, icon, onclick, icon_color = "white", _title }){
        super("div", {
            className:"tool-button", onclick
        })
        if(icon)  this.add(new Dom("span", { style:`color:${icon_color};`, className:"material-icons", innerText:icon }))
        if(title) this.add(new Dom("span", { className:"title", innerText:title }));
        if(_title) tippy(this.element, {
            placement:"right",
            arrow:false,
            content:_title
        })
    }
}