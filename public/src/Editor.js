import Dom from "./Dom.js"
import ToolButton from "./ToolButton.js"
export default class Editor extends Dom {
    constructor(path, onload, app, item) {
        super("div", { className: "editor-child" })
        this.app = app;
        this.onload = onload;
        this.item = item;
        this.path = path;
        this.editor = new Dom("div", { className:"editor-editor" })
        this.meta = new Dom("div", { className:"editor-meta" })
        this.editor.style = { height:"-webkit-fill-available" }
        this.tools = new Dom("div", { className:"editor-tools" })
        this.__init = false;
        this.setting = {
            lineNumbers: true,
            autoRefresh:true
        };
        this.add(this.tools, new Dom("div", { 
            style:"height:-webkit-fill-available;",
            append:[
                //this.meta, //for future use
                this.editor
            ],
            className:"editor-editor-holder" }));
        this.cm = null;
    }
    createCM(path, onload) {
        return this.app.fs.readFile(path, "utf8")
            .then(file => {
                this.editor.clear();
                this.setting.value = file
                this.setting.theme = "vs-dark";
                this.setting.language = (mimelite.getType(path.split(".").pop() || "text") || "text/plain").split("/").pop();
                const editor = monaco.editor.create(this.editor.element, this.setting);
                return (onload(), editor)
            });
    }
    tool(){ this.tools.add(new ToolButton(...arguments)) }
    init(){
        Swal.fire({
            customClass:{
                container:"editor-container",
                confirmButton:"material-icons"
            },
            confirmButtonText:"close",
            html:this.element
        })
        if(this.__init == false){
            this.__init = true;
            this.cm = this.createCM(this.path, this.onload);
        }
    }
}