export default function download(data, filename, type = "application/octet-stream") {
	let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
       
    let blob = new Blob([data], {type: type}),
        url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}