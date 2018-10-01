window.addEventListener("load", function () {
    fetch("https://api.github.com/orgs/funwebdev-2nd-ed/repos")
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
        .then((data) => { console.dir(data); });
});