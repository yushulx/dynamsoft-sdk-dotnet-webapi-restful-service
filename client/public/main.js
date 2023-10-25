// Get Dynamsoft products.
let host = placeholder = 'http://192.168.8.72:5000/';
let dropdown = document.getElementById("dropdown");
function selectChanged() {
    switchProduct(dropdown.value)
}

function hideAll() {
    let divElement = document.getElementById("dwt");
    divElement.style.display = "none";

    divElement = document.getElementById("dbr");
    divElement.style.display = "none";

    divElement = document.getElementById("dlr");
    divElement.style.display = "none";

    divElement = document.getElementById("ddn");
    divElement.style.display = "none";
}

function switchProduct(name) {
    if (name === 'Dynamic Web TWAIN') {
        let divElement = document.getElementById("dwt");
        divElement.style.display = "block";

        divElement = document.getElementById("dbr");
        divElement.style.display = "none";

        divElement = document.getElementById("dlr");
        divElement.style.display = "none";

        divElement = document.getElementById("ddn");
        divElement.style.display = "none";
    }
    else if (name === 'Dynamsoft Barcode Reader') {
        let divElement = document.getElementById("dbr");
        divElement.style.display = "block";

        divElement = document.getElementById("dwt");
        divElement.style.display = "none";

        divElement = document.getElementById("dlr");
        divElement.style.display = "none";

        divElement = document.getElementById("ddn");
        divElement.style.display = "none";
    }
    else if (name == 'Dynamsoft Label Recognizer') {
        let divElement = document.getElementById("dlr");
        divElement.style.display = "block";

        divElement = document.getElementById("dwt");
        divElement.style.display = "none";

        divElement = document.getElementById("dbr");
        divElement.style.display = "none";

        divElement = document.getElementById("ddn");
        divElement.style.display = "none";
    }
    else if (name == 'Dynamsoft Document Normalizer') {
        let divElement = document.getElementById("ddn");
        divElement.style.display = "block";

        divElement = document.getElementById("dwt");
        divElement.style.display = "none";

        divElement = document.getElementById("dbr");
        divElement.style.display = "none";

        divElement = document.getElementById("dlr");
        divElement.style.display = "none";
    }
}

async function connect() {
    dropdown.innerHTML = "";
    host = document.getElementById("host").value == "" ? placeholder : document.getElementById("host").value;

    try {
        const response = await fetch(host + 'dynamsoft/product', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status == 200) {
            const products = await response.json();

            products.forEach(element => {
                let optionElement = document.createElement("option");
                optionElement.value = element;
                optionElement.text = element;
                dropdown.appendChild(optionElement);
            });
            switchProduct(dropdown.value)
        }
        else {
            hideAll();
        }

    } catch (error) {
        console.log(error);
    }


}

// Dynamic Web TWAIN
let selectSources = document.getElementById("sources");
let devices = [];

async function getDevices() {
    selectSources.innerHTML = "";
    let url = host + 'dynamsoft/dwt/getdevices';
    const response = await fetch(url, { "method": "GET" });

    if (response.status == 200) {

        try {
            let json = await response.json();
            if (json) {
                devices = json;
                json.forEach(element => {
                    let option = document.createElement("option");
                    option.text = element['name'];
                    option.value = element['name'];
                    selectSources.add(option);
                });
            }
        } catch (error) {
            console.log(error)
        }

    }
}

async function acquireImage() {
    let url = host + 'dynamsoft/dwt/ScanDocument';
    if (devices.length > 0 && selectSources.selectedIndex >= 0) {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: devices[selectSources.selectedIndex]['device']
        });

        const contentType = response.headers.get('Content-Type');
        const result = await response.text();
        console.log(result)

        url = host + 'dynamsoft/dwt/GetImageStream/' + result;

        response = await fetch(url, { method: 'GET' });

        let imageBlob = await response.blob();
        let img = document.getElementById('document-image');
        url = URL.createObjectURL(imageBlob);
        img.src = url;

        let option = document.createElement("option");
        option.selected = true;
        option.text = url;
        option.value = url;

        let thumbnails = document.getElementById("thumb-box");
        let newImage = document.createElement('img');
        newImage.setAttribute('src', url);
        if (thumbnails != null) {
            thumbnails.appendChild(newImage);
            newImage.addEventListener('click', e => {
                if (e != null && e.target != null) {
                    let target = e.target;
                    img.src = target.src;
                }
            });
        }
    }

}





