export default async function rename(file){
    let app = file.app;
    const result = await Swal.fire({
        title: 'File name',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Rename file',
        showLoaderOnConfirm: true
    });
    if(!result.isConfirmed) return;
    if(!result.value) return new Toastify({ text:"No name was givin", duration:1000 }).showToast();
    if(!app.isValidFileName(result.value)) return new Toastify({ text:"Invalid name", duration:1000 }).showToast();
    file.rename(result.value);
    app.logger.log(`${"rename".fontcolor("#fd67fd")} : ${result.value.fontcolor("grey")}`);
    new Toastify({ text:`File was renamed to ${result.value}`, duration:1000 }).showToast();
}