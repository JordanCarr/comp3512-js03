window.addEventListener("load", () => {
    const endpoint = "https://gist.githubusercontent.com/rconnolly/a0ad7768d65b6fa46f4e007a1cf27193/"
                     + "raw/38696e5b84cd6b66667a6b87c66c058ab2606ba2/galleries.json";

    fetch(endpoint)
        .then(response => {
            let result;

            if (response.ok) {
                result = response.json();
            } else {
                result = Promise.reject({status: response.status, statusText: response.statusText});
            }

            return result;
        })
        .catch(error => console.log(error))
        .then(data => processPageData(data))
        .catch(error => console.log(error));
});

function processPageData(data) {
    removeTemplateLetters();

    //Create data containing object that are limited in domain to simplify later logic for discrete components
    let galleryListData = data.map(gallery => gallery.nameEn);
    let paintingList = data.map(gallery => ({"Name": gallery.nameEn, "Paintings": gallery.paintings}));
    let locations = data.map(gallery => ({"Name": gallery.nameEn, "Location": gallery.location}));
    let galleryDescriptionData = data.map(gallery => ({
        "Name": gallery.nameEn,
        "Native Name": gallery.nameNative,
        "City": gallery.location.city,
        "Address": gallery.location.address,
        "Country": gallery.location.country,
        "Home": gallery.link
    }));

    populateGalleryList(galleryListData);
    populateGalleryListEvents(galleryDescriptionData, paintingList, locations);
}

function removeTemplateLetters() {
    //Remove the first text node containing placeholder letter
    let a = document.querySelector("div.a");
    a.removeChild(a.firstChild);

    let b = document.querySelector("div.b");
    b.removeChild(b.firstChild);

    let c = document.querySelector("div.c");
    c.removeChild(c.firstChild);

    let d = document.querySelector("div.d");
    d.removeChild(d.firstChild);
}

function populateGalleryList(galleryListData) {
    let galleryList = document.querySelector("#galleryList");

    galleryListData.forEach(galleryName => {
        let listItem = document.createElement("li");
        let nameNode = document.createTextNode(galleryName);
        listItem.appendChild(nameNode);

        galleryList.appendChild(listItem);
    });

    //Make gallery list section visible
    document.querySelector("div.b section").style.display = "block";
}

function populateGalleryListEvents(galleryDescriptionData, paintingList, location) {
    document.querySelectorAll("ul#galleryList li").forEach(item => item.addEventListener("click", e => {
        galleryClickHandler(e, galleryDescriptionData, paintingList, location);
    }));
}

function galleryClickHandler(e, galleryDescriptions, paintingList, locations) {
    //This assumes that there are no duplicate gallery names due to the lack of guaranteed unique identification
    let gallery = galleryDescriptions.find(desc => desc["Name"] === e.target.textContent);
    populateGalleryDescription(gallery);
    let selectedPaintings = paintingList.find(item => item["Name"] === e.target.textContent);
    let paintings = selectedPaintings["Paintings"];
    populatePaintings(paintings);
    let selectedLocation = locations.find(place => place["Name"] === e.target.textContent);
    let location = selectedLocation["Location"];
    initMap(location.latitude, location.longitude);
}

function populateGalleryDescription(data) {
    document.querySelector("#galleryName").textContent = data["Name"];
    document.querySelector("#galleryNative").textContent = data["Native Name"];
    document.querySelector("#galleryCity").textContent = data["City"];
    document.querySelector("#galleryAddress").textContent = data["Address"];
    document.querySelector("#galleryCountry").textContent = data["Country"];
    document.querySelector("#galleryHome").textContent = data["Home"];

    //Make details section visible
    document.querySelector("div.a section").style.display = "grid";
}

function populatePaintings(paintings) {
    let oldPaintingList = document.querySelector("#paintingList");
    let paintingListParent = oldPaintingList.parentElement;

    //Create new list node to replace existing node
    let paintingList = document.createElement("ul");
    paintingList.id = "paintingList";

    //Populate new list with selected paintings
    paintings.forEach(painting => {
        let listItem = document.createElement("li");
        let nameNode = document.createTextNode(painting.title);
        listItem.appendChild(nameNode);

        //Add speech synthesis of painting description to painting
        listItem.addEventListener("click", e => addVoiceSynthesisToPaintings(e, painting));

        //Add created painting list item to the painting list
        paintingList.appendChild(listItem);
    });

    //Update list of painting with new node
    paintingListParent.replaceChild(paintingList, oldPaintingList);

    //Make gallery list section visible
    document.querySelector("div.c section").style.display = "block";
}

function addVoiceSynthesisToPaintings(e, painting) {
    e.preventDefault();

    //Create text to speak and speaking object for voice over from description
    let message = painting.description;
    let utterance = new SpeechSynthesisUtterance(message);

    //Speak the description
    window.speechSynthesis.speak(utterance);
}

function initMap(latitude, longitude) {
    let mapDiv = document.querySelector("div.d");
    mapDiv.style.height = "400px";

    let map;
    if (latitude && longitude) {
        map = new google.maps.Map(mapDiv, {center: {lat: latitude, lng: longitude}, mapTypeId: "satellite", zoom: 18});
    }

    return map;
}