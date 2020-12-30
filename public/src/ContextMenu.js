import Dom from "./Dom.js";
export default class ContextMenu {
    constructor(container, items) {
        this.container = container;
        if(!window.contex_map) window.contex_map = new Map();
        this.dom = null;
        this.shown = false;
        this.root = true;
        this.parent = null;
        this.submenus = [];
        this.id = (Math.random() * Date.now()).toString(36) + "." + Date.now().toString(36);
        this.items = items;
        this._onclick = e => {
            this.container.focus();
            if (this.dom && e.target != this.dom &&
                e.target.parentElement != this.dom &&
                !e.target.classList.contains('item') &&
                !e.target.parentElement.classList.contains('item')) {
                this.hideAll();
            }
        };

        this._oncontextmenu = e => {
            e.preventDefault();
            e.stopPropagation();

            this.hideAll();
            this.show(e.clientX, e.clientY);
            window.contex_map.forEach((contex, id) => {
                if(id == this.id) return;
                contex.hideAll();
            })
        };

        this._oncontextmenu_keydown = e => {
            if (e.keyCode != 93) return;
            e.preventDefault();
            e.stopPropagation();

            this.hideAll();
            this.show(e.clientX, e.clientY);
            window.contex_map.forEach((contex, id) => {
                if(id == this.id) return;
                contex.hideAll();
            })
        };

        this._onblur = e => {
            if (!this.dom) return;
            let clickedOutside = true;

            e.path.forEach(item => {
                if (!clickedOutside) return;
                if (item.id === 'this.id') clickedOutside = false;
            });

            if (clickedOutside) this.hideAll();
        }
        window.contex_map.set(this.id, this);
    }

    getMenuDom() {
        const menu = new Dom('div', { className: "context", id:this.id });
        for (const item of this.items) menu.add(this.generateItem(item));
        menu.event("contextmenu", (e) => (e.preventDefault(), this.hideAll()))
        return menu;
    }

    generateItem(data) {
        const item = new Dom('div', { className: !data ? "separator" : "contex-item" });

        if (!data) return item;

        if (data.hasOwnProperty('color') && /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.color.toString())) {
            item.style = { color: data.color }
        }

        const label = new Dom('span', {
            className: "label",
            innerText: data.hasOwnProperty('text') ? data['text'].toString() : ''
        });
        item.add(label);

        if (data.hasOwnProperty('disabled') && data['disabled']) {
            item.element.classList.add('disabled');
        } else {
            item.element.classList.add('enabled');
        }

        const hotkey = new Dom('span', {
            classList: "hotkey",
            innerText: data.hasOwnProperty('hotkey') ? data['hotkey'].toString() : ''
        });
        item.add(hotkey);

        if (data.hasOwnProperty('subitems') && Array.isArray(data['subitems']) && data['subitems'].length > 0) {
            const menu = new ContextMenu(this.container, data['subitems']);
            menu.root = false;
            menu.parent = this;

            const openSubItems = e => {
                if (data.hasOwnProperty('disabled') && data['disabled'] == true)
                    return;

                this.hideSubMenus();

                const x = this.dom.offsetLeft + this.dom.clientWidth + item.offsetLeft;
                const y = this.dom.offsetTop + item.offsetTop;

                if (!menu.shown) {
                    menu.show(x, y);
                } else {
                    menu.hide();
                }
            };

            this.submenus.push(menu);

            item.element.classList.add('has-subitems');
            item.event('click', openSubItems);
            item.event('mousemove', openSubItems);
        } else if (data.hasOwnProperty('submenu') && data['submenu'] instanceof ContextMenu) {
            const menu = data['submenu'];
            menu.root = false;
            menu.parent = this;

            const openSubItems = e => {
                if (data.hasOwnProperty('disabled') && data['disabled'] == true)
                    return;

                this.hideSubMenus();

                const x = this.dom.offsetLeft + this.dom.clientWidth + item.offsetLeft;
                const y = this.dom.offsetTop + item.offsetTop;

                if (!menu.shown) {
                    menu.show(x, y);
                } else {
                    menu.hide();
                }
            };

            this.submenus.push(menu);

            item.element.classList.add('has-subitems');
            item.event('click', openSubItems);
            item.event('mousemove', openSubItems);
        } else {
            item.event('click', e => {
                this.hideSubMenus();

                if (item.element.classList.contains('disabled'))
                    return;

                if (data.hasOwnProperty('onclick') && typeof data['onclick'] === 'function') {
                    const event = {
                        handled: false,
                        item: item,
                        label: label,
                        hotkey: hotkey,
                        items: this.items,
                        data: data
                    };

                    data['onclick'](event);

                    if (!event.handled) {
                        this.hide();
                    }
                } else {
                    this.hide();
                }
            });

            item.event('mousemove', e => {
                this.hideSubMenus();
            });
        }

        return item;
    }

    hideAll() {
        if (this.root && !this.parent) {
            if (this.shown) {
                this.hideSubMenus();

                this.shown = false;
                this.container.parentElement.removeChild(this.dom.element);

                if (this.parent && this.parent.shown) {
                    this.parent.hide();
                }
            }

            return;
        }

        this.parent.hide();
    }

    hide() {
        if (this.dom && this.shown) {
            this.shown = false;
            this.hideSubMenus();
            this.container.parentElement.removeChild(this.dom.element);

            if (this.parent && this.parent.shown) {
                this.parent.hide();
            }
        }
    }

    hideSubMenus() {
        for (const menu of this.submenus) {
            if (menu.shown) {
                menu.shown = false;
                menu.container.removeChild(menu.dom.element);
            }
            menu.hideSubMenus();
        }
    }

    show(x, y) {
        this.dom = this.getMenuDom();

        this.dom.element.style.left = `${x}px`;
        this.dom.element.style.top = `${y}px`;

        this.shown = true;
        new Dom(this.container.parentElement).add(this.dom);
    }

    install() {
        this.container.addEventListener('contextmenu', this._oncontextmenu);
        this.container.addEventListener('keydown', this._oncontextmenu_keydown);
        this.container.addEventListener('click', this._onclick);
        document.addEventListener('contextmenu', this.__onblur);
        document.addEventListener('click', this._onblur);
    }

    uninstall() {
        this.dom = null;
        this.container.removeEventListener('contextmenu', this._oncontextmenu);
        this.container.removeEventListener('keydown', this._oncontextmenu_keydown);
        this.container.removeEventListener('click', this._onclick);
        document.removeEventListener('click', this.__onblur);
        document.removeEventListener('contextmenu', this.__onblur);
    }
}