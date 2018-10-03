function initMap() {

}

window.addEventListener("load", function () {
    const endpoint = "https://gist.githubusercontent.com/" + "rconnolly/a0ad7768d65b6fa46f4e007a1cf27193/"
                     + "raw/38696e5b84cd6b66667a6b87c66c058ab2606ba2/" + "galleries.json";

    fetch(endpoint)
        .then(response => {
            let result;

            if (response.ok) {
                result = response.json();
            } else {
                result = Promise.reject({
                                            status: response.status,
                                            statusText: response.statusText
                                        });
            }

            return result;
        })
        .catch(error => console.log(error))
        .then(data => processPageData(data));
});

function processPageData(data) {
    let galleryListData = data.map(gallery => gallery.nameEn);
    let galleryDescriptionData = data.map(gallery => ({
        "Name": gallery.nameEn,
        "Native Name": gallery.nameNative,
        "City": gallery.location.city,
        "Address": gallery.location.address,
        "Country": gallery.location.country,
        "Home": gallery.link
    }));

    populateGalleryList(galleryListData);
    populateGalleryListEvents(galleryDescriptionData);

    //Make gallery list section visible
    document.querySelector("div.b section").style.display = "block";
}

function populateGalleryList(list) {
    let galleryList = document.querySelector("#galleryList");

    list.forEach(galleryName => {
        let listItem = document.createElement("LI");
        let nameNode = document.createTextNode(galleryName);

        listItem.appendChild(nameNode);

        galleryList.appendChild(listItem);
    });
}

function galleryClickHandler(e, galleryDescriptions) {
    //This assumes that there are no duplicate gallery names due to the lack of guaranteed unique identification
    let gallery = galleryDescriptions.find(desc => desc["Name"] === e.target.textContent);
    populateGalleryDescription(gallery);
}

function populateGalleryListEvents(galleryDescriptionData) {
    document.querySelectorAll("ul#galleryList li")
            .forEach(item => item.addEventListener("click", e => galleryClickHandler(e, galleryDescriptionData)));
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
