export default async function create(fn, app){
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
    await app.fs[fn](app.path + (app.path.endsWith("/")?"":"/") + result.value, "");
    app.refresh();
    new Toastify({ text:`${result.value} was created!`, duration:1000 }).showToast();
}