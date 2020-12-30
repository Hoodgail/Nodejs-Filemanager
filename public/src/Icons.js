import * as iconsSVG from "./IconsSVG.js";
const Icons = new Map();

const get = Icons.get;

Icons.set("file", {
    fill:"grey",
    d:iconsSVG.mdiFile
});
Icons.set("folder", {
    fill:"#ffc064",
    d:iconsSVG.mdiFolder
});
Icons.set("js", {
    fill:"yellow",
    d:iconsSVG.mdiLanguageJavascript
});
Icons.set("html", {
    fill:"orange",
    d:iconsSVG.mdiLanguageHtml5
});
Icons.set("json", {
    fill:"yellow",
    d:iconsSVG.mdiCodeJson
});
Icons.set("css", {
    fill:"purple",
    d:iconsSVG.mdiLanguageCss3
});

Icons.get = function() {
    const data = get.apply(this, arguments);
    if(!data) return;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg'); 
    const path = document.createElementNS("http://www.w3.org/2000/svg", 'path'); 
    svg.setAttribute("viewBox", "0 0 24 24");
    path.setAttribute("d", data.d); 
    if(data.fill) path.setAttribute("fill", data.fill); 
    svg.append(path)
    return svg;
}

export default Icons;