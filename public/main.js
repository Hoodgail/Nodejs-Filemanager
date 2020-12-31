import FileSystem from "./src/FileSystem.js";
import Dom from "./src/Dom.js";
import App from "./src/App.js";
import create from "./src/create.js";
import ContextMenu from "./src/ContextMenu.js";
import Logger from "./src/Logger.js";
import auth from "/auth.js";

const root = Dom.Get("#root");
const fs = new FileSystem();
const app = new App(root, { fs });
const logger = new Logger(app);
app.logger = logger;
const lt = [{
    icon: "backspace", icon_color: "#fd5555", _title: "Clear All",
    onclick() { logger.clear(); }
}];

if(!auth) app.init("/");
if(auth) Swal.fire({
    title: 'Password',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Sign in',
    showLoaderOnConfirm: true
}).then(async ({ value, isConfirmed }) => {
    if(!isConfirmed) return;
    const { default:isValid } = await import("/password/" + value);
    if(!isValid) return Swal.fire("Unorthorized", "The password you typed in was invalid", "error");
    fs.password = value;
    app.init("/")
});

app.tool({
    icon: "keyboard_backspace",
    _title:"First page",
    onclick() { if (app.path !== "/") app.init("/"); }
})

app.tool({
    icon: "keyboard_arrow_left",
    _title:"Back",
    onclick() { if (app.path !== "/") app.init(app.path.split("/").slice(0, -1).join("/")) }
})


app.tool({
    icon: "delete_forever",
    _title:"Delete forever",
    icon_color: "#fd5555",
    async onclick() {
        const selected = app.items.filter(e => e.selected);
        if (selected.length === 0) return new Toastify({
            text: "You have no items selected",
            duration: 1600
        }).showToast();
        for (let index in selected) {
            let item = selected[index]
            item.deleted = true;
            await item.delete({
                refresh: false,
                remove: true
            });
            app.items = app.items.filter(e => !e.deleted);
            logger.log(`${"delete".fontcolor("#F44336")} : ${item.type.fontcolor("grey")} ${item.full_name}`);
        }
        app.refresh();
        new Toastify({ text: `Deleted ${selected.length} item${selected.length > 1 ? "s" : ""}`, duration: 1600 }).showToast()
    }
})

app.tool({
    icon: "create",
    _title:"Create File",
    onclick() { create("writeFile", app) }
})

app.tool({
    icon: "create_new_folder",
    _title:"Create Folder",
    onclick() { create("mkdir", app) }
});
new ContextMenu(root.element, [
    { text: "Create New File", onclick() { create("writeFile", app) } },
    { text: "Create New Folder", onclick() { create("mkdir", app) } },
    { text: "Refresh", onclick() { app.refresh(); logger.log("Refreshed 👍") } }
]).install();

lt.forEach(config => logger.tool(config));
new ContextMenu(
    logger.element,
    lt.map(({ _title, onclick }) => ({ text:_title, onclick }))
).install()

logger.log("Ready 👍")