/**
 * Represents a DOM element.
 * @constructor
 * @param {string} domName - DOM element name.
 * @param {object} config - DOM attributes.
 * @author [name] hoodgail benjamin
 */
export default class Dom {
    constructor(domName = "div", config = {}) {
        const scope = this;
        this.element = typeof domName == "string" ? document.createElement(domName) : domName;
        this.setProperties(config)
    }
    setProperties(config) {
        Object.keys(config).forEach(name => this.property(name, config[name]));
    }
    property(name, value){
        switch(name){
            case "append":
            case "add": this.add(...value) 
            break;
            case "eval": value.apply(this)
            break;
            case"style": this.style = value;
            break;
            default: this.element[name] = value
        }
    }
    add(...doms) {
        this.element.append(...doms.map(r => r.element))
        return this
    }
    toString() {
        return "Dom {. . .}"
    }
    trim() {
        this.element.innerHTML = this.element.innerText.trim()
    }
    clear() {
        this.element.innerHTML = ""
    }
    get(query = "div", config = {}, all = false){
        return Dom.Get(query, config, all, this.element)
    }
    static Get(query = "div", config = {}, all = false, body = document){
        let res = body["querySelector"+(!all?"":"All")](query)
        if(all) res = [...res].map(element => new Dom(element, config));
            else res = new Dom(res, config)
        return res
    }
    event(){ return this.element.addEventListener(...arguments) }
    set display(display = "block"){ this.style = { display } }
    set background(background){ this.style = { background } }
    set click(fn){ this.element.addEventListener("click", fn) }
    get html(){ return this.element.innerHTML }
    set html(data) {
        if(data instanceof Dom) { this.add(data) }
        else if (typeof data == "string") { this.element.innerHTML = data }
    }
    set style(style) {
        if(typeof style == "string") return this.element.style = style;
        const scope = this;
        Object.keys(style).forEach(function (name) {
            scope.element.style[name] = style[name];
        });
    }
}