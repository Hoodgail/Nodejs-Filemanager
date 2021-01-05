export default async function create(fn, app){
    let args = [];
    if(fn !== "mkdir") args.push("");
    const result = await Swal.fire({
        title: 'File name',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Create File',
        showLoaderOnConfirm: true
    });
    if(!result.isConfirmed) return;
    if(!result.value) return new Toastify({ text:"No name was givin", duration:1000 }).showToast();
    if(!app.isValidFileName(result.value)) return new Toastify({ text:"Invalid name", duration:1000 }).showToast();
    await app.fs[fn](app.path + (app.path.endsWith("/")?"":"/") + result.value, ...args);
    app.refresh();
    app.logger.log(`${fn.fontcolor("lightgreen")} : ${result.value.fontcolor("grey")}`);
    new Toastify({ text:`${result.value} was created!`, duration:1000 }).showToast();
}