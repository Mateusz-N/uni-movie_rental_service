window.onload = async() => {
    await handleSession();
    const loginForm = document.forms["loginForm"];
    const registerForm = document.forms["registerForm"];
    const add_movieForm = document.forms["add_movieForm"];
    const add_rentalForm = document.forms["add_rentalForm"];
    const add_clientForm = document.forms["add_clientForm"];
    const modify_movieForm = document.forms["modify_movieForm"];
    const modify_rentalForm = document.forms["modify_rentalForm"];
    const modify_clientForm = document.forms["modify_clientForm"];
    const movieArticle = document.getElementById("movie");
    const movieList = document.getElementById("movieList");
    const rentalList = document.getElementById("rentalList");
    const clientList = document.getElementById("clientList");
    if(loginForm) {
        setupFullSizeForm("login", loginForm, "/api/login");
    }
    if(registerForm) {
        setupFullSizeForm("register", registerForm, "/api/register");
    }
    if(add_movieForm) {
        setupFullSizeForm("add_movie", add_movieForm, "/api/add_movie");
    }
    if(add_rentalForm) {
        setupFullSizeForm("add_rental", add_rentalForm, "/api/add_rental");
    }
    if(add_clientForm) {
        setupFullSizeForm("add_client", add_clientForm, "/api/add_client");
    }
    if(modify_movieForm) {
        const movieID = window.location.href.split("/").pop();
        setupFullSizeForm("modify_movie", modify_movieForm, "/api/modify_movie/" + movieID);
        fillModifyMovieForm(modify_movieForm, movieID);
    }
    if(modify_rentalForm) {
        const rentalID = window.location.href.split("/").pop();
        setupFullSizeForm("modify_rental", modify_rentalForm, "/api/modify_rental/" + rentalID);
        fillModifyRentalForm(modify_rentalForm, rentalID);
    }
    if(modify_clientForm) {
        const clientID = window.location.href.split("/").pop();
        setupFullSizeForm("modify_client", modify_clientForm, "/api/modify_client/" + clientID);
        fillModifyClientForm(modify_clientForm, clientID);
    }
    if(movieArticle) {
        const movieID = window.location.href.split("/").pop();
        setupMovieDetails(movieID);
    }
    if(movieList) {
        const searchFilters = {
            titleFilter: null,
            genreFilter: null
        }
        setupDocList(movieList, "movie", searchFilters);
    }
    if(rentalList) {
        const searchFilters = {
            clientFirstNameFilter: null,
            clientLastNameFilter: null,
            clientAddressFilter: null,
            clientPhoneFilter: null,
            movieIdFilter: null,
            movieTitleFilter: null,
            rentDateFilter: null,
            plannedReturnDateFilter: null,
            actualReturnDateFilter: null
        }
        setupDocList(rentalList, "rental", searchFilters);
    }
    if(clientList) {
        const searchFilters = {
            userNameFilter: null,
            accountTypeFilter: null
        }
        setupDocList(clientList, "client", searchFilters);
    }
}

const handleSession = async() => {
    await fetch("https://localhost:8000/api/session")
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            if(data.active) {
                sessionStorage.setItem("active", "true");
                sessionStorage.setItem("userName", data.user.userName);
                sessionStorage.setItem("accountType", data.user.accountType);
                return;
            }
            sessionStorage.setItem("active", "false")
        })
        .catch(console.error);
    const session = {
        active: sessionStorage.getItem("active") === "true",
        userName: sessionStorage.getItem("userName"),
        accountType: sessionStorage.getItem("accountType")
    };
    if(session.active) {
        generateNavbarItem("a", "Filmy", "/movies", ["navbarItem"], "linkMovies");
        generateNavbarItem("a", "Wypożyczenia", "/rentals", ["navbarItem"], "linkRentals");
        if(session.accountType === "administrator") {
            generateNavbarItem("a", "Klienci", "/clients", ["navbarItem"], "linkClients");
        }
        generateNavbarItem("p", "Zalogowano jako " + session.userName, "", ["navbarItem", "accountItem", "accountItem_first"], "textLoggedAs");
        const btnLogout = generateNavbarItem("a", "Wyloguj się", "/logout", ["navbarItem", "accountItem"], "btnLogout");
        btnLogout.addEventListener("click", sendLogoutRequest);
        return;
    }
    generateNavbarItem("a", "Zarejestruj się", "/register", ["navbarItem", "accountItem", "accountItem_first"], "btnRegister");
    generateNavbarItem("a", "Zaloguj się", "/login", ["navbarItem", "accountItem"], "btnLogin");
}

const setupFullSizeForm = (purpose, form, action) => {
    const errorTextNode = document.getElementById(purpose + "Form_error");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let requestBody;
        let method = "POST";
        if(purpose === "login") {
            requestBody = {
                userName: form["userName"].value,
                password: form["password"].value
            }
        }
        else if(purpose === "register") {
            requestBody = {
                userName: form["userName"].value,
                password: form["password"].value,
                firstName: form["firstName"].value,
                lastName: form["lastName"].value,
                street: form["street"].value,
                houseNo: form["houseNo"].value,
                apartmentNo: form["apartmentNo"].value,
                postalCode: form["postalCode"].value,
                city: form["city"].value,
                phone: form["phone"].value,
            }
        }
        else if(purpose === "add_movie" || purpose === "modify_movie") {
            requestBody = {
                title: form["title"].value,
                genre: form["genre"].value,
                director: form["director"].value,
                duration: form["duration"].value,
                rating: form["rating"].value,
                description: form["description"].value,
                cast: form["cast"].value
            }
        }
        else if(purpose === "add_client" || purpose === "modify_client") {
            requestBody = {
                accountType: form["accountType"].value,
                userName: form["userName"].value,
                password: form["password"].value,
                firstName: form["firstName"].value,
                lastName: form["lastName"].value,
                street: form["street"].value,
                houseNo: form["houseNo"].value,
                apartmentNo: form["apartmentNo"].value,
                postalCode: form["postalCode"].value,
                city: form["city"].value,
                phone: form["phone"].value,
            }
        }
        else if(purpose === "add_rental" || purpose === "modify_rental") {
            requestBody = {
                clientID: form["clientID"].value,
                movieID: form["movieID"].value,
                rentDate: form["rentDate"].value,
                plannedReturnDate: form["plannedReturnDate"].value,
                actualReturnDate: form["actualReturnDate"].value
            }
        }
        if(purpose === "modify_movie" || purpose === "modify_client" || purpose === "modify_rental") {
            method = "PATCH"
        }
        sendFormRequest(requestBody, action, method, errorTextNode);
    });
    Array.from(form.getElementsByTagName("input")).forEach(input => {
        input.addEventListener("input", () => {
            errorTextNode.style.display = "none";
            errorTextNode.textContent = "";
        });
    });
}

const sendFormRequest = (requestBody, route, method, errorTextNode) => {
    console.log(requestBody, route, method)
    sendRequest(requestBody, route, method)
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
            errorTextNode.style.display = "inline-block";
            if(response.status === 401 || response.status === 409) {
                response.json().then(data => errorTextNode.textContent = data.message);
            }
        })
        .then((data) => {
            if(data) {
                alert(data.message);
                window.location.href = "/";
            }
        })
        .catch(console.error);
}

const sendGenericRequest = (requestBody, route, method) => {
    sendRequest(requestBody, route, method)
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
            if(response.status === 400 || response.status === 409) {
                response.json().then(data => alert(data.message));
            }
            if(response.status === 401) {
                response.json().then(data => {
                    alert(data.message);
                    window.location.href = "/login";
                });
            }
        })
        .then((data) => {
            if(data) {
                alert(data.message);
                window.location.reload();
            }
        })
        .catch(console.error);
}

const sendLogoutRequest = () => {
    sendRequest({}, "/api/logout", "POST")
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            alert(data.message);
            sessionStorage.clear();
            window.location.href = "/";
        })
        .catch(console.error);
}

const sendRequest = (requestBody, route, method) => {
    console.log(requestBody, route, method)
    return fetch("https://localhost:8000" + route, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
}

const fillModifyMovieForm = async(form, movieID) => {
    const movie = await fetchDocByID(movieID, "movie");
    form["title"].value = movie.tytul;
    form["genre"].value = movie.gatunek;
    form["director"].value = movie.rezyser;
    form["duration"].value = movie.czas_trwania_min;
    form["rating"].value = movie.ocena;
    form["description"].value = movie.opis;
    form["cast"].value = movie.aktorzy.join(", ");
}

const fillModifyRentalForm = async(form, rentalID) => {
    const rental = await fetchDocByID(rentalID, "rental");
    form["clientID"].value = rental.dane_klienta._id;
    form["movieID"].value = rental.film._id;
    form["rentDate"].value = new Date(rental.data_wypozyczenia).toISOString().substr(0, 10);;
    form["plannedReturnDate"].value = new Date(rental.data_planowanego_zwrotu).toISOString().substr(0, 10);;
    form["actualReturnDate"].value = new Date(rental.data_faktycznego_zwrotu).toISOString().substr(0, 10);;
}

const fillModifyClientForm = async(form, clientID) => {
    const client = await fetchDocByID(clientID, "client");
    form["accountType"].value = client.typ_konta;
    form["userName"].value = client.nazwa_uzytkownika;
    form["password"].value = client.haslo;
    form["firstName"].value = client.imie;
    form["lastName"].value = client.nazwisko;
    form["street"].value = client.adres.ulica;
    form["houseNo"].value = client.adres.nr_domu;
    form["apartmentNo"].value = client.adres.nr_lokalu;
    form["postalCode"].value = client.adres.kod_pocztowy;
    form["city"].value = client.adres.miejscowosc;
    form["phone"].value = client.telefon;
}

const fetchDocByID = async(id, collectionName) => {
    return fetch("https://localhost:8000/api/" + collectionName + "/" + id)
        .then((response) => {
            if(response.ok) {
                return response.json()
            }
        })
        .then((data) => data)
        .catch(console.error);
}



const generateNavbarItem = (textTag, textContent, linkHref, itemClassList, itemID) => {
    const navbarItems = document.getElementById("navbarItems");
    const item = document.createElement("li");
    const text = document.createElement(textTag);
    text.textContent = textContent;
    if(textTag === "a") {
        text.setAttribute("href", linkHref);
    }
    item.classList.add(...itemClassList);
    item.setAttribute("id", itemID);
    item.appendChild(text);
    navbarItems.appendChild(item);
    return item;
}