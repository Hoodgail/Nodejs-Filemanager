import FileSystem from "./src/FileSystem.js";
import Dom from "./src/Dom.js";
import App from "./src/App.js";
import create from "./src/create.js";
import ContextMenu from "./src/ContextMenu.js";
import Logger from "./src/Logger.js";

const root = Dom.Get("#root");
const fs = new FileSystem();
const app = new App(root, { fs });
const logger = new Logger(app);
app.logger = logger;
const lt = [{
    icon: "backspace", icon_color: "#fd5555", _title: "Clear All",
    onclick() { logger.clear(); }
}];

app.init("/");

app.tool({
    icon: "keyboard_backspace",
    onclick() { if (app.path !== "/") app.init("/"); }
})

app.tool({
    icon: "keyboard_arrow_left",
    onclick() { if (app.path !== "/") app.init(app.path.split("/").slice(0, -1).join("/")) }
})


app.tool({
    icon: "delete_forever",
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
    onclick() { create("writeFile", app) }
})

app.tool({
    icon: "create_new_folder",
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

window.app = app;

logger.log("Ready 👍")