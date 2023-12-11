const { MongoClient, ObjectId } = require("mongodb");
const https = require("https");
const url = require("url");
const fs = require("fs");
const bcrypt = require("bcrypt");
const dbController = require("./dbQueries");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const PORT = process.env.PORT || 8000;
const SSL_KEY = process.env.SSL_KEY || fs.readFileSync("../cert/key.pem", 'utf8');
const SSL_CERT = process.env.SSL_CERT || fs.readFileSync("../cert/cert.pem", 'utf8');

const startWebServer = async(port, mongoClient) => {

    const httpsOptions = {
        key: SSL_KEY,
        cert: SSL_CERT
    }
    const visitor = {
        active: false,
        user: {
            _id: null,
            accountType: null,
            userName: null,
            firstName: null,
            lastName: null,
            address: {
                street: null,
                houseNo: null,
                apartmentNo: null,
                postalCode: null,
                city: null
            },
            phone: null,
            registeredDate: null
        }
    }
    let session = visitor;

    https.createServer(httpsOptions, async(req, res) => {
        const sendFile = (res, file, contentType) => {
            fs.readFile(file, (error, data) => {
                if(error) {
                    throw error; 
                }       
                res.writeHead(200, {"Content-Type": contentType});
                res.write(data);
                res.end();
            });
        }
        const sendRestrictedPage = (res, session, pathToPage) => {
            if(session.active) {
                if(session.user.accountType === "administrator") {
                    sendFile(res, pathToPage, "text/html");
                }
                else {
                    sendFile(res, "../public/html/forbidden.html", "text/html");
                }
            }
            else {
                sendFile(res, "../public/html/login.html", "text/html");
            }
        }
        const parseRequestBody = (req, callback) => {
            let requestBody = "";
            req.on("data", chunk => {
                requestBody += chunk.toString();
            });
            req.on("end", () => callback(JSON.parse(requestBody)));
        }
        const sendAuthRequiredResponse = () => {
            sendGenericResponse({
                message: "Ta funkcja wymaga uprawnień administratora!"
            }, 403)
        }
        const sendAdminRequiredResponse = () => {
            sendGenericResponse({
                message: "Ta funkcja wymaga uprawnień administratora!"
            }, 403)
        }
        const sendGenericResponse = (responseBody, statusCode = 200) => {
            res.writeHead(statusCode, {"Content-Type": "application/json"});
            res.write(JSON.stringify(responseBody));
            res.end();
        }

        if(req.method === "GET") {
            if(req.url === "/api/session") {
                const clientSession = {
                    active: session.active,
                    user: {
                        userName: session.user.userName,
                        accountType: session.user.accountType
                    }
                }
                sendGenericResponse(clientSession)
                session.message = undefined;
            }
            if(req.url.startsWith("/api/movie/")) {
                const movieID = new ObjectId(req.url.split("/api/movie/")[1]);
                const movie = await dbController.getMovieByID(mongoClient, movieID);
                sendGenericResponse(movie)
            }
            if(req.url.startsWith("/api/rental/")) {
                const rentalID = new ObjectId(req.url.split("/api/rental/")[1]);
                const rental = await dbController.getRentalByID(mongoClient, rentalID);
                sendGenericResponse(rental)
            }
            if(req.url.startsWith("/api/client/")) {
                const clientID = new ObjectId(req.url.split("/api/client/")[1]);
                const client = await dbController.getClientByID(mongoClient, clientID);
                sendGenericResponse(client)
            }
            if(req.url.startsWith("/api/movies")) {
                const queryParams = url.parse(req.url, true).query;
                const sortCriteria = {
                    col: queryParams.sortBy || null,
                    order: parseInt(queryParams.sortOrder) || null
                }
                const searchFilters = {
                    title: queryParams.titleFilter || null,
                    genre: queryParams.genreFilter || null
                }
                const movieList = await dbController.listMovies(mongoClient, searchFilters, sortCriteria);
                sendGenericResponse(movieList)
            }
            if(req.url.startsWith("/api/rentals")) {
                const queryParams = url.parse(req.url, true).query;
                const sortCriteria = {
                    col: queryParams.sortBy || null,
                    order: parseInt(queryParams.sortOrder) || null
                }
                const searchFilters = {
                    client: {
                        firstName: queryParams.clientFirstNameFilter || null,
                        lastName: queryParams.clientLastNameFilter || null,
                        address: queryParams.clientAddressFilter || null,
                        phone: queryParams.clientPhoneFilter || null,
                    },
                    movie: {
                        _id: queryParams.movieIdFilter || null,
                        title: queryParams.movieTitleFilter || null
                    },
                    rentDate: queryParams.rentDateFilter || null,
                    plannedReturnDate: queryParams.plannedReturnDateFilter || null,
                    actualReturnDate: queryParams.actualReturnDateFilter || null
                }
                const consideredClients = session.user.accountType === "administrator" ? "all" : [session.user];
                const rentalList = await dbController.listRentals(mongoClient, searchFilters, sortCriteria, consideredClients);
                sendGenericResponse(rentalList)
            }
            if(req.url.startsWith("/api/clients")) {
                const queryParams = url.parse(req.url, true).query;
                const sortCriteria = {
                    col: queryParams.sortBy || null,
                    order: parseInt(queryParams.sortOrder) || null
                }
                const searchFilters = {
                    userName: queryParams.userNameFilter || null,
                    accountType: queryParams.accountTypeFilter || null
                }
                const clientList = await dbController.listClients(mongoClient, searchFilters, sortCriteria);
                sendGenericResponse(clientList)
            }
            if(req.url === "/") {
                sendFile(res, session.active ? "../public/html/movies.html" : "../public/html/login.html", "text/html");
            }
            if(req.url === "/login") {
                sendFile(res, "../public/html/login.html", "text/html");
            }
            if(req.url === "/register") {
                sendFile(res, "../public/html/register.html", "text/html");
            }
            if(req.url === "/movies") {
                sendFile(res, session.active ? "../public/html/movies.html" : "../public/html/login.html", "text/html");
            }
            if(req.url.startsWith("/movie/")) {
                sendFile(res, session.active ? "../public/html/movie.html" : "../public/html/login.html", "text/html");
            }
            if(req.url === "/rentals") {
                sendFile(res, session.active ? "../public/html/rentals.html" : "../public/html/login.html", "text/html");
            }
            if(req.url === "/clients") {
                sendRestrictedPage(res, session, "../public/html/clients.html");
            }
            if(req.url === "/add_client") {
                sendRestrictedPage(res, session, "../public/html/clients/add_client.html");
            }
            if(req.url === "/add_movie") {
                sendRestrictedPage(res, session, "../public/html/movies/add_movie.html");
            }
            if(req.url === "/add_rental") {
                sendRestrictedPage(res, session, "../public/html/rentals/add_rental.html");
            }
            if(req.url.startsWith("/modify_client/")) {
                sendRestrictedPage(res, session, "../public/html/clients/modify_client.html");
            }
            if(req.url.startsWith("/modify_movie/")) {
                sendRestrictedPage(res, session, "../public/html/movies/modify_movie.html");
            }
            if(req.url.startsWith("/modify_rental/")) {
                sendRestrictedPage(res, session, "../public/html/rentals/modify_rental.html");
            }
            if(req.url === "/js/script.js") {
                sendFile(res, "../public/js/script.js", "text/javascript");
            }
            if(req.url === "/js/movies.js") {
                sendFile(res, "../public/js/movies.js", "text/javascript");
            }
            if(req.url === "/js/docList.js") {
                sendFile(res, "../public/js/docList.js", "text/javascript");
            }
            if(req.url === "/css/style.css") {
                sendFile(res, "../public/css/style.css", "text/css");
            }
            if(req.url === "/resources/imageNotAvailable.png") {
                sendFile(res, "../public/resources/imageNotAvailable.png", "image/png");
            }
        }
        else if(req.method === "POST") {
            if(req.url === "/api/register") {
                parseRequestBody(req, async(parsedRequestBody) => {
                    const userNameTaken = await dbController.isUserNameTaken(mongoClient, parsedRequestBody.userName);
                    if(userNameTaken) {
                        sendGenericResponse({
                            message: "Użytkownik o takiej nazwie już istnieje!"
                        }, 409);
                        return;
                    }
                    const userData = {
                        accountType: "user",
                        userName: parsedRequestBody.userName,
                        password: await bcrypt.hash(parsedRequestBody.password, 10),
                        firstName: parsedRequestBody.firstName,
                        lastName: parsedRequestBody.lastName,
                        address: {
                            street: parsedRequestBody.street,
                            houseNo: parsedRequestBody.houseNo,
                            apartmentNo: parsedRequestBody.apartmentNo,
                            postalCode: parsedRequestBody.postalCode,
                            city: parsedRequestBody.city,
                        },
                        phone: parsedRequestBody.phone,
                        registeredDate: new Date()
                    }
                    await dbController.register(mongoClient, userData);
                    sendGenericResponse({
                        message: "Zarejestrowano pomyślnie! Możesz się teraz zalogować."
                    })
                });
            }
            if(req.url === "/api/login") {
                parseRequestBody(req, async(parsedRequestBody) => {
                    const user = await dbController.authenticate(mongoClient, parsedRequestBody.userName);
                    const passwordCorrect = await bcrypt.compare(parsedRequestBody.password, user.haslo);
                    if(!user || !passwordCorrect) {
                        sendGenericResponse({
                            message: "Nieprawidłowa nazwa użytkownika lub hasło!"
                        }, 401);
                        return;
                    }
                    session = {
                        active: true,
                        user: {
                            _id: user._id,
                            accountType: user.typ_konta,
                            userName: user.nazwa_uzytkownika,
                            firstName: user.imie,
                            lastName: user.nazwisko,
                            address: {
                                street: user.adres.ulica,
                                houseNo: user.adres.nr_domu,
                                apartmentNo: user.adres.nr_lokalu,
                                postalCode: user.adres.kod_pocztowy,
                                city: user.adres.miejscowosc
                            },
                            phone: user.telefon,
                            registeredDate: user.data_rejestracji
                        }
                    }
                    sendGenericResponse({
                        message: "Zalogowano pomyślnie!"
                    })
                });
            }
            if(req.url === "/api/logout") {
                session = visitor;
                sendGenericResponse({
                    message: "Wylogowano pomyślnie!"
                })
            }
            if(req.url.startsWith("/api/rent/")) {
                parseRequestBody(req, async(parsedRequestBody) => {
                    const movie = {
                        _id: req.url.split("/api/rent/")[1],
                        tytul: parsedRequestBody.movieTitle
                    }
                    const rentalCount = await dbController.getClientRentalCount(mongoClient, session.user._id);
                    if(rentalCount >= 3) {
                        sendGenericResponse({
                            message: "Przekroczono limit wypożyczeń! Zwróć film by móc wypożyczyć kolejny."
                        }, 400);
                        return;
                    }
                    await dbController.addRental(mongoClient, movie, session.user);
                    sendGenericResponse({
                        message: "Wypożyczenie zaksięgowane!"
                    })
                });
            }
            if(req.url.startsWith("/api/return/")) {
                if(!session.active) {
                    sendAuthRequiredResponse();
                    return;
                }
                if(session.user.accountType !== "administrator") {
                    sendAdminRequiredResponse();
                    return;
                }
                parseRequestBody(req, async(parsedRequestBody) => {
                    const movie = {
                        _id: req.url.split("/api/return/")[1],
                        tytul: parsedRequestBody.movieTitle
                    }
                    await dbController.returnMovie(mongoClient, movie._id);
                    sendGenericResponse({
                        message: "Film zwrócony pomyślnie!"
                    });
                });
            }
            if(req.url === "/api/add_movie") {
                if(!session.active) {
                    sendAuthRequiredResponse();
                    return;
                }
                if(session.user.accountType !== "administrator") {
                    sendAdminRequiredResponse();
                    return;
                }
                parseRequestBody(req, async(parsedRequestBody) => {
                    const movieAlreadyExists = await dbController.doesMovieAlreadyExist(mongoClient, parsedRequestBody.title);
                    if(movieAlreadyExists) {
                        sendGenericResponse({
                            message: "Film o takim tytule już istnieje!"
                        }, 409);
                        return;
                    }
                    const movieData = {
                        title: parsedRequestBody.title,
                        genre: parsedRequestBody.genre,
                        director: parsedRequestBody.director,
                        duration: parsedRequestBody.duration,
                        rating: parsedRequestBody.rating,
                        description: parsedRequestBody.description,
                        cast: parsedRequestBody.cast.split(", ")
                    }
                    await dbController.addMovie(mongoClient, movieData);
                    sendGenericResponse({
                        message: "Film dodany pomyślnie!"
                    });
                });
            }
            if(req.url === "/api/add_client") {
                if(!session.active) {
                    sendAuthRequiredResponse();
                    return;
                }
                if(session.user.accountType !== "administrator") {
                    sendAdminRequiredResponse();
                    return;
                }
                parseRequestBody(req, async(parsedRequestBody) => {
                    const userNameTaken = await dbController.isUserNameTaken(mongoClient, parsedRequestBody.userName);
                    if(userNameTaken) {
                        sendGenericResponse({
                            message: "Użytkownik o takiej nazwie już istnieje!"
                        }, 409);
                        return;
                    }
                    const userData = {
                        accountType: parsedRequestBody.accountType,
                        userName: parsedRequestBody.userName,
                        password: await bcrypt.hash(parsedRequestBody.password, 10),
                        firstName: parsedRequestBody.firstName,
                        lastName: parsedRequestBody.lastName,
                        address: {
                            street: parsedRequestBody.street,
                            houseNo: parsedRequestBody.houseNo,
                            apartmentNo: parsedRequestBody.apartmentNo,
                            postalCode: parsedRequestBody.postalCode,
                            city: parsedRequestBody.city,
                        },
                        phone: parsedRequestBody.phone,
                        registeredDate: new Date()
                    }
                    await dbController.register(mongoClient, userData);
                    sendGenericResponse({
                        message: "Klient dodany pomyślnie!"
                    });
                });
            }
        }
        else if(req.method === "DELETE") {
            if(req.url.startsWith("/api/delete_movie/")) {
                if(!session.active) {
                    sendAuthRequiredResponse();
                    return;
                }
                if(session.user.accountType !== "administrator") {
                    sendAdminRequiredResponse();
                    return;
                }
                const movieID = req.url.split("/api/delete_movie/")[1];
                const movieCurrentlyRented = await dbController.isMovieCurrentlyRented(mongoClient, movieID);
                if(movieCurrentlyRented) {
                    sendGenericResponse({
                        message: "Ten film jest obecnie wypożyczony! Jego usunięcie będzie możliwe dopiero po jego zwrocie."
                    }, 409);
                    return;
                }
                await dbController.deleteMovie(mongoClient, new ObjectId(movieID));
                sendGenericResponse({
                    message: "Film usunięty pomyślnie!"
                });
            }
            if(req.url.startsWith("/api/delete_rental/")) {
                if(!session.active) {
                    sendAuthRequiredResponse();
                    return;
                }
                if(session.user.accountType !== "administrator") {
                    sendAdminRequiredResponse();
                    return;
                }
                const rentalID = req.url.split("/api/delete_rental/")[1];
                await dbController.deleteRental(mongoClient, new ObjectId(rentalID));
                sendGenericResponse({
                    message: "Wypożyczenie usunięte pomyślnie!"
                });
            }
            if(req.url.startsWith("/api/delete_client/")) {
                if(!session.active) {
                    sendAuthRequiredResponse();
                    return;
                }
                if(session.user.accountType !== "administrator") {
                    sendAdminRequiredResponse();
                    return;
                }
                const clientID = req.url.split("/api/delete_client/")[1];
                const clientHasActiveRental = await dbController.doesClientHaveActiveRental(mongoClient, new ObjectId(clientID));
                if(clientHasActiveRental) {
                    sendGenericResponse({
                        message: "Ten klient ma aktywne wypożyczenia! Jego usunięcie będzie możliwe dopiero po zwrocie wszystkich jego wypożyczeń."
                    }, 409);
                    return;
                }
                if(clientID === session.user._id.toString()) {
                    sendGenericResponse({
                        message: "Nie można usunąć samego siebie!"
                    }, 409);
                    return;
                }
                await dbController.deleteClient(mongoClient, new ObjectId(clientID));
                sendGenericResponse({
                    message: "Klient usunięty pomyślnie!"
                });
            }
        }
        else if(req.method === "PATCH") {
            if(req.url.startsWith("/api/modify_movie/")) {
                if(!session.active) {
                    sendAuthRequiredResponse();
                    return;
                }
                if(session.user.accountType !== "administrator") {
                    sendAdminRequiredResponse();
                    return;
                }
                parseRequestBody(req, async(parsedRequestBody) => {
                    const movieID = req.url.split("/api/modify_movie/")[1];
                    const movieCurrentlyRented = await dbController.isMovieCurrentlyRented(mongoClient, movieID);
                    if(movieCurrentlyRented) {
                        sendGenericResponse({
                            message: "Ten film jest obecnie wypożyczony! Jego modyfikacja będzie możliwa dopiero po jego zwrocie."
                        }, 409);
                        return;
                    }
                    const movieData = {
                        title: parsedRequestBody.title,
                        genre: parsedRequestBody.genre,
                        director: parsedRequestBody.director,
                        duration: parsedRequestBody.duration,
                        rating: parsedRequestBody.rating,
                        description: parsedRequestBody.description,
                        cast: parsedRequestBody.cast.split(", ")
                    }
                    await dbController.updateMovie(mongoClient, new ObjectId(movieID), movieData);
                    sendGenericResponse({
                        message: "Film zmodyfikowany pomyślnie!"
                    });
                });
            }
            if(req.url.startsWith("/api/modify_rental/")) {
                if(!session.active) {
                    sendAuthRequiredResponse();
                    return;
                }
                if(session.user.accountType !== "administrator") {
                    sendAdminRequiredResponse();
                    return;
                }
                parseRequestBody(req, async(parsedRequestBody) => {
                    const rentalID = req.url.split("/api/modify_rental/")[1];
                    const rentedMovie = await dbController.getMovieByID(mongoClient, new ObjectId(parsedRequestBody.movieID));
                    const rentingClient = await dbController.getClientByID(mongoClient, new ObjectId(parsedRequestBody.clientID));
                    const rentalData = {
                        userData: {
                            _id: rentingClient._id,
                            firstName: rentingClient.imie,
                            lastName: rentingClient.nazwisko,
                            address: {
                                street: rentingClient.adres.ulica,
                                houseNo: rentingClient.adres.nr_domu,
                                apartmentNo: rentingClient.adres.nr_lokalu,
                                postalCode: rentingClient.adres.kod_pocztowy,
                                city: rentingClient.adres.miejscowosc
                            },
                            phone: rentingClient.adres.telefon
                        },
                        movieData: {
                            _id: rentedMovie._id,
                            title: rentedMovie.tytul
                        },
                        data_wypozyczenia: parsedRequestBody.rentDate,
                        data_planowanego_zwrotu: parsedRequestBody.plannedReturnDate,
                        data_faktycznego_zwrotu: parsedRequestBody.actualReturnDate
                    }
                    await dbController.updateRental(mongoClient, new ObjectId(rentalID), rentalData);
                    sendGenericResponse({
                        message: "Wypożyczenie zmodyfikowane pomyślnie!"
                    });
                });
            }
            if(req.url.startsWith("/api/modify_client/")) {
                if(!session.active) {
                    sendAuthRequiredResponse();
                    return;
                }
                if(session.user.accountType !== "administrator") {
                    sendAdminRequiredResponse();
                    return;
                }
                parseRequestBody(req, async(parsedRequestBody) => {
                    const clientID = req.url.split("/api/modify_client/")[1];
                    const clientHasActiveRental = await dbController.doesClientHaveActiveRental(mongoClient, clientID);
                    if(clientHasActiveRental) {
                        sendGenericResponse({
                            message: "Ten klient ma aktywne wypożyczenia! Jego modyfikacja będzie możliwa dopiero po zwrocie wszystkich jego wypożyczeń."
                        }, 409);
                        return;
                    }
                    const userData = {
                        accountType: parsedRequestBody.accountType,
                        userName: parsedRequestBody.userName,
                        password: await bcrypt.hash(parsedRequestBody.password, 10),
                        firstName: parsedRequestBody.firstName,
                        lastName: parsedRequestBody.lastName,
                        address: {
                            street: parsedRequestBody.street,
                            houseNo: parsedRequestBody.houseNo,
                            apartmentNo: parsedRequestBody.apartmentNo,
                            postalCode: parsedRequestBody.postalCode,
                            city: parsedRequestBody.city,
                        },
                        phone: parsedRequestBody.phone,
                        registeredDate: new Date()
                    }
                    await dbController.updateClient(mongoClient, new ObjectId(clientID), userData);
                    sendGenericResponse({
                        message: "Klient zmodyfikowany pomyślnie!"
                    });
                });
            }
        }
    }).listen(port, () => {
        console.log("Serwer nasłuchuje na porcie " + port)
    });
}

const main = async() => {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        await startWebServer(PORT, client);
    } catch(error) {
        console.error(error);
    }
}

main().catch(console.error);