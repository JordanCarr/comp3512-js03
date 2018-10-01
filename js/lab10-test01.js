// before you start, view this url in the browser to see its sructure
const url = "https://gist.githubusercontent.com/rconnolly/1d6ac7ede49e501ff0aca8a0c2a36c8c/"
            + "raw/d21fadafd1c48eb3ab6d507993ebf5c6288a28c7/continents.json";

window.addEventListener("load", function () {

    // fetch the continents from the api in url
    fetch(url)
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
        .then(data => addContinentsToUL(data));
});

function addContinentsToUL(data) {
    let list = document.querySelector("ul");

    for (let continent of data) {
        let continentNode = document.createElement("LI");
        let nameNode = document.createTextNode(continent.name);
        continentNode.appendChild(nameNode);

        list.appendChild(continentNode);
    }
}