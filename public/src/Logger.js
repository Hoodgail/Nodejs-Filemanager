import Dom from "./Dom.js";
import ToolButton from "./ToolButton.js";
export default class Logger extends Dom {
    constructor(app){
        super("div", { className:"log hidden-log" });
        this.__logs = [];
        this.tools = new Dom("div", { className:"log-tools" })
        this.logs = new Dom("div", { className:"log-logs" })
        this.items = new Dom("div", { className:"log-items" }).add(this.tools, this.logs)
        this.info = new Dom("div", { className:"log-info", onclick:()=>this.toggle() });

        this.add(this.items, this.info);
        app.root.add(this);
    }
    toggle(){ this.element.classList.toggle("hidden-log") }
    tool(){ this.tools.add(new ToolButton(...arguments)) }
    clear(){
        this.__logs = [];
        this.logs.clear();
        this.info.clear();
        this.toggle();
    }
    log(text){ 
        this.__logs.push(text, Date.now()); 
        this.logs.add(new Dom("div", { className:"log-item", innerHTML:text }))
        this.info.clear();
        this.info.add(
            new Dom("div", {
                className:"log-text",
                innerHTML:text,
            }),
            new Dom("div", {
                className:"material-icons info-up",
                innerText:"expand_less"
            }),
            new Dom("div", {
                className:"material-icons info-down",
                innerText:"expand_more"
            })
        )
    }
}