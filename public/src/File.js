import Item from "./Item.js";
import Icons from "./Icons.js";
import Editor from "./Editor.js";
function format({ name }) {
    return {
        extention: name.split(".").pop().toLowerCase(),
        name: name.split(".").slice(0, -1).join("."),
        full_name: name,
        icon_name: name.split(".").pop().toLowerCase() || "file",
        icon: Icons.get(name.split(".").pop().toLowerCase()) || Icons.get("file")
    }
};

export default class File extends Item {
    constructor(information, app) {
        const others = format(information);
        super(information, others, app);
        this.information = information;
        this.app = app;
        this.__blob = null;
        this.type = "file";
    }
    get __images() {
        return Object.values(mimelite._types).filter(r => r.startsWith("image"))
    }
    get __type() { return mimelite.getType(this.icon_name || "") }
    get isImage() {
        return this.__images.includes(mimelite.getType(this.icon_name || "txt"))
    }

    async onclick(event) {
        const Scope = this;
        if (this.isImage) {
            const blob = this.__blob || await this.app.fs.getFileBlob(this.path);
            if (!this.__blob) this.__blob = blob;
            Swal.fire({ imageUrl: URL.createObjectURL(blob) })
        }
        else if (this.app.editor.has(this.path)) this.app.editor.get(this.path).init()
        else {
            const editor = new Editor(this.path, () => { }, this.app, this);
            this.app.editor.set(this.path, editor);
            editor.init();
            editor.tool({
                icon: "save",
                icon_color: "grey",
                onclick: async () => {
                    const cm = await editor.cm;
                    Scope.app.fs.writeFile(this.path, cm.getValue())
                        .then(() => new Toastify({ text: "Saved!", duration: 1000 }).showToast())
                        .catch(() => new Toastify({ text: "Failed to save!", duration: 1000 }).showToast())
                }
            });
        }
    }
};