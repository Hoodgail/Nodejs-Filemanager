import FileSystem from "./src/FileSystem.js";
import Dom from "./src/Dom.js";
import App from "./src/App.js";
import create from "./src/create.js";
import ContextMenu from "./src/ContextMenu.js";

const root = Dom.Get("#root");
const fs = new FileSystem();
const app = new App(root, { fs });

app.init("/");

app.tool({
    icon:"keyboard_backspace",
    onclick(){ if(app.path !== "/") app.init("/"); }
})

app.tool({
    icon:"keyboard_arrow_left",
    onclick(){ if(app.path !== "/") app.init(app.path.split("/").slice(0, -1).join("/")) }
})


app.tool({
    icon:"delete_forever",
    icon_color:"#fd5555",
    onclick(){
        const selected = app.items.filter(e=>e.selected);
        console.log(selected)
    }
})

app.tool({
    icon:"create",
    onclick(){ create("writeFile", app) }
})

app.tool({
    icon:"create_new_folder",
    async onclick(){ create("mkdir", app) }
});

new ContextMenu(root.element, [
    { text:"Create New File", onclick(){ create("writeFile", app) } },
    { text:"Create New Folder", onclick(){ create("mkdir", app) } },
    { text:"Refresh", onclick(){ app.refresh() } }
]).install();

window.app = app;