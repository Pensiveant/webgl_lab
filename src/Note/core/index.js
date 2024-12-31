async function requestFile(filePath) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', filePath, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let shaderSource = xhr.responseText;
                resolve(shaderSource);
            }
        };
        xhr.send();
    })
}

export { requestFile };
