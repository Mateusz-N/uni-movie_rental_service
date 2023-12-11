const dbController = module.exports = {
    register: async(mongoClient, userData) => {
        return await mongoClient.db("wypozyczalnia").collection("klienci").insertOne({
            typ_konta: "klient",
            nazwa_uzytkownika: userData.userName,
            imie: userData.firstName,
            nazwisko: userData.lastName,
            haslo: userData.password,
            adres: {
                ulica: userData.address.street,
                nr_domu: userData.address.houseNo,
                nr_lokalu: userData.address.apartmentNo,
                kod_pocztowy: userData.address.postalCode,
                miejscowosc: userData.address.city
            },
            telefon: userData.phone,
            data_rejestracji: userData.registeredDate
        });
    },
    authenticate: async(mongoClient, userName) => {
        return await mongoClient.db("wypozyczalnia").collection("klienci").findOne({
            nazwa_uzytkownika: userName
        });
    },
    isUserNameTaken: async(mongoClient, userName) => {
        return await mongoClient.db("wypozyczalnia").collection("klienci").findOne({
            nazwa_uzytkownika: userName
        }) !== null;
    },

    listMovies: async(mongoClient, searchFilters, sortCriteria) => {
        const pipeline = [{
            $lookup: {
                from: "wypozyczenia",
                localField: "tytul",
                foreignField: "film.tytul",
                as: "dostepny"
            }
        }, {
            $addFields: {
                "dostepny": {
                    $let: {
                        vars: {
                            movieId: "$_id",
                        },
                        in: {
                            $eq: [{
                                $size: {
                                    $filter: {
                                        input: "$dostepny",
                                        as: "wypozyczenia",
                                        cond: {
                                            $and: [{
                                                $eq: [
                                                    "$$wypozyczenia.film.tytul", "$tytul"
                                                ]
                                            }, {
                                                $eq: [
                                                    "$$wypozyczenia.data_faktycznego_zwrotu", null
                                                ]
                                            }]
                                        }
                                    }
                                }
                            }, 0]
                        }
                    }
                }
            }
        }];
        if(searchFilters) {
            const fieldsToMatch = {};
            if(searchFilters.title) {
                fieldsToMatch.tytul = searchFilters.title
            }
            if(searchFilters.genre) {
                fieldsToMatch.gatunek = searchFilters.genre
            }
            pipeline.unshift({
                $match: fieldsToMatch
            });
        }
        if(sortCriteria && sortCriteria.col && sortCriteria.order) {
            const colNameMap = [{
                providedName: "title",
                nameInDB: "tytul"
            }, {
                providedName: "genre",
                nameInDB: "gatunek"
            }, {
                providedName: "director",
                nameInDB: "rezyser"
            }, {
                providedName: "duration",
                nameInDB: "czas_trwania_min"
            }, {
                providedName: "status",
                nameInDB: "dostepny"
            }]
            const translatedColName = colNameMap.find(field => {
                return field.providedName == sortCriteria.col;
            }).nameInDB;
            pipeline.push({
                $sort: {
                    [translatedColName]: sortCriteria.order
                }
            });
        }
        return await mongoClient.db("wypozyczalnia").collection("filmy").aggregate(pipeline).toArray();
    },
    listRentals: async(mongoClient, searchFilters, sortCriteria, consideredClients) => {
        const pipeline = [];
        if(consideredClients !== "all") {
            pipeline.push({
                $match: {
                    "dane_klienta._id": {
                        $in: consideredClients.map(client => client._id)
                    }
                }
            });
        }
        if(searchFilters) {
            const fieldsToMatch = {};
            if(searchFilters.client) {
                if(searchFilters.client.firstName) {
                    fieldsToMatch["dane_klienta.imie"] = searchFilters.client.firstName
                }
                if(searchFilters.client.lastName) {
                    fieldsToMatch["dane_klienta.nazwisko"] = searchFilters.client.lastName
                }
                if(searchFilters.client.address) {
                    let parsedAddress = searchFilters.client.address.split(", ");
                    let addressPrecise = parsedAddress[0].split(" ");
                    let houseAndApartment = addressPrecise.pop().split("/");
                    let street = addressPrecise[0];
                    let houseNo = houseAndApartment[0];
                    let apartmentNo = houseAndApartment[1];
                    let addressGeneral = parsedAddress[1].split(" ");
                    let postalCode = addressGeneral[0];
                    let city = addressGeneral[1];
                    fieldsToMatch["dane_klienta.adres.ulica"] = street;
                    fieldsToMatch["dane_klienta.adres.nr_domu"] = houseNo;
                    fieldsToMatch["dane_klienta.adres.nr_lokalu"] = apartmentNo;
                    fieldsToMatch["dane_klienta.adres.kod_pocztowy"] = postalCode
                    fieldsToMatch["dane_klienta.adres.miejscowosc"] = city;
                }
                if(searchFilters.client.phone) {
                    fieldsToMatch["dane_klienta.telefon"] = searchFilters.client.phone
                }
            }
            if(searchFilters.movie) {
                if(searchFilters.movie._id) {
                    fieldsToMatch["film._id"] = searchFilters.movie._id
                }
                if(searchFilters.movie.title) {
                    fieldsToMatch["film.tytul"] = searchFilters.movie.title
                }
            }
            if(searchFilters.rentDate) {
                try {
                    fieldsToMatch.data_wypozyczenia = generateDateMatchPipeline(searchFilters.rentDate);
                }
                catch{}
            }
            if(searchFilters.plannedReturnDate) {
                try {
                    fieldsToMatch.data_planowanego_zwrotu = generateDateMatchPipeline(searchFilters.plannedReturnDate);
                }
                catch{}
            }
            if(searchFilters.actualReturnDate) {
                try {
                    fieldsToMatch.data_faktycznego_zwrotu = generateDateMatchPipeline(searchFilters.actualReturnDate);
                }
                catch{}
            }
            pipeline.push({
                $match: fieldsToMatch
            });
        }
        if(sortCriteria && sortCriteria.col && sortCriteria.order) {
            const colNameMap = [{
                providedName: "client_firstName",
                nameInDB: "dane_klienta.imie"
            }, {
                providedName: "client_lastName",
                nameInDB: "dane_klienta.nazwisko"
            }, {
                providedName: "client_phone",
                nameInDB: "dane_klienta.telefon"
            }, {
                providedName: "client_address",
                nameInDB: "dane_klienta.adres"
            }, {
                providedName: "movie_id",
                nameInDB: "film._id"
            }, {
                providedName: "movie_title",
                nameInDB: "film.tytul"
            }, {
                providedName: "rentDate",
                nameInDB: "data_wypozyczenia"
            }, {
                providedName: "plannedReturnDate",
                nameInDB: "data_planowanego_zwrotu"
            }, {
                providedName: "actualReturnDate",
                nameInDB: "data_faktycznego_zwrotu"
            }]
            const translatedColName = colNameMap.find(field => {
                return field.providedName == sortCriteria.col;
            }).nameInDB;
            pipeline.push({
                $sort: {
                    [translatedColName]: sortCriteria.order
                }
            });
        }
        return await mongoClient.db("wypozyczalnia").collection("wypozyczenia").aggregate(pipeline).toArray();
    },
    listClients: async(mongoClient, searchFilters, sortCriteria) => {
        const pipeline = [];
        if(searchFilters) {
            const fieldsToMatch = {};
            if(searchFilters.userName) {
                fieldsToMatch.nazwa_uzytkownika = searchFilters.userName
            }
            if(searchFilters.accountType) {
                fieldsToMatch.typ_konta = searchFilters.accountType
            }
            pipeline.unshift({
                $match: fieldsToMatch
            });
        }
        if(sortCriteria && sortCriteria.col && sortCriteria.order) {
            const colNameMap = [{
                providedName: "accountType",
                nameInDB: "typ_konta"
            }, {
                providedName: "userName",
                nameInDB: "nazwa_uzytkownika"
            }, {
                providedName: "firstName",
                nameInDB: "imie"
            }, {
                providedName: "lastName",
                nameInDB: "nazwisko"
            }, {
                providedName: "password",
                nameInDB: "haslo"
            }, {
                providedName: "street",
                nameInDB: "adres.ulica"
            }, {
                providedName: "houseNo",
                nameInDB: "adres.nr_domu"
            }, {
                providedName: "apartmentNo",
                nameInDB: "adres.nr_lokalu"
            }, {
                providedName: "postalCode",
                nameInDB: "adres.kod_pocztowy"
            }, {
                providedName: "city",
                nameInDB: "adres.miejscowosc"
            }, {
                providedName: "phone",
                nameInDB: "telefon"
            }, {
                providedName: "registeredDate",
                nameInDB: "data_rejestracji"
            }]
            const translatedColName = colNameMap.find(field => {
                return field.providedName == sortCriteria.col;
            }).nameInDB;
            pipeline.push({
                $sort: {
                    [translatedColName]: sortCriteria.order
                }
            });
        }
        return await mongoClient.db("wypozyczalnia").collection("klienci").aggregate(pipeline).toArray();
    },

    getMovieByID: async(mongoClient, movieID) => {
        const movieCurrentlyRented = await dbController.isMovieCurrentlyRented(mongoClient, movieID.toString());
        const docs = await mongoClient.db("wypozyczalnia").collection("filmy").aggregate([{
            $match: {
                _id: movieID
            }
        }, {
            $addFields: {
                "dostepny": !movieCurrentlyRented
            }
        }]).toArray() || null;
        if(docs) {
            return docs[0];
        }
        return null;
    },
    getRentalByID: async(mongoClient, rentalID) => {
        const docs = await mongoClient.db("wypozyczalnia").collection("wypozyczenia").aggregate([{
            $match: {
                _id: rentalID
            }
        }]).toArray() || null;
        if(docs) {
            return docs[0];
        }
        return null;
    },
    getClientByID: async(mongoClient, clientID) => {
        const docs = await mongoClient.db("wypozyczalnia").collection("klienci").aggregate([{
            $match: {
                _id: clientID
            }
        }]).toArray() || null;
        if(docs) {
            return docs[0];
        }
        return null;
    },
    getClientRentalCount: async(mongoClient, userID) => {
        const docs = await mongoClient.db("wypozyczalnia").collection("wypozyczenia").find({
            "dane_klienta._id": userID,
            "data_faktycznego_zwrotu": null
        }).toArray() || null;
        if(docs) {
            return docs.length;
        }
        return 0;
    },

    addMovie: async(mongoClient, movieData) => {
        return await mongoClient.db("wypozyczalnia").collection("filmy").insertOne({
            tytul: movieData.title,
            gatunek: movieData.genre,
            rezyser: movieData.director,
            czas_trwania_min: movieData.duration,
            ocena: movieData.rating,
            opis: movieData.description,
            aktorzy: movieData.cast,
            data_dodania: new Date()
        });
    },
    addRental: async(mongoClient, movie, userData) => {
        const rentDate = new Date();
        const plannedReturnDate = new Date();
        plannedReturnDate.setDate(rentDate.getDate() + 2);
        return await mongoClient.db("wypozyczalnia").collection("wypozyczenia").insertOne({
            dane_klienta: {
                _id: userData._id,
                imie: userData.firstName,
                nazwisko: userData.lastName,
                adres: {
                    ulica: userData.address.street,
                    nr_domu: userData.address.houseNo,
                    nr_lokalu: userData.address.apartmentNo,
                    kod_pocztowy: userData.address.postalCode,
                    miejscowosc: userData.address.city
                },
                telefon: userData.phone
            },
            film: movie,
            data_wypozyczenia: rentDate,
            data_planowanego_zwrotu: plannedReturnDate,
            data_faktycznego_zwrotu: null
        });
    },
    
    updateMovie: async(mongoClient, movieID, movieData) => {
        return await mongoClient.db("wypozyczalnia").collection("filmy").updateOne({
            _id: movieID
        }, {
            $set: {
                tytul: movieData.title,
                gatunek: movieData.genre,
                rezyser: movieData.director,
                czas_trwania_min: movieData.duration,
                ocena: movieData.rating,
                opis: movieData.description,
                aktorzy: movieData.cast
            }
        });
    },
    updateRental: async(mongoClient, rentalID, rentalData) => {
        return await mongoClient.db("wypozyczalnia").collection("wypozyczenia").updateOne({
            _id: rentalID
        }, {
            $set: {
                "dane_klienta._id": rentalData.userData._id,
                "dane_klienta.imie": rentalData.userData.firstName,
                "dane_klienta.nazwisko": rentalData.userData.lastName,
                "dane_klienta.adres.ulica": rentalData.userData.address.street,
                "dane_klienta.adres.nrDomu": rentalData.userData.address.houseNo,
                "dane_klienta.adres.nrLokalu": rentalData.userData.address.apartmentNo,
                "dane_klienta.adres.kod_pocztowy": rentalData.userData.address.postalCode,
                "dane_klienta.adres.miejscowosc": rentalData.userData.address.city,
                "dane_klienta.telefon": rentalData.userData.phone,
                "film._id": rentalData.movieData._id,
                "film.tytul": rentalData.movieData.title,
                "data_wypozyczenia": new Date(rentalData.rentDate),
                "data_planowanego_zwrotu": new Date(rentalData.plannedReturnDate),
                "data_faktycznego_zwrotu": new Date(rentalData.actualReturnDate)
            }
        });
    },
    updateClient: async(mongoClient, userID, userData) => {
        return await mongoClient.db("wypozyczalnia").collection("klienci").updateOne({
            _id: userID
        }, {
            $set: {
                typ_konta: userData.accountType,
                nazwa_uzytkownika: userData.userName,
                imie: userData.firstName,
                nazwisko: userData.lastName,
                haslo: userData.password,
                adres: {
                    ulica: userData.address.street,
                    nr_domu: userData.address.houseNo,
                    nr_lokalu: userData.address.apartmentNo,
                    kod_pocztowy: userData.address.postalCode,
                    miejscowosc: userData.address.city
                },
                telefon: userData.phone
            }
        });
    },
    returnMovie: async(mongoClient, movieID) => {
        return await mongoClient.db("wypozyczalnia").collection("wypozyczenia").updateOne({
            "film._id": movieID,
            "data_faktycznego_zwrotu": null
        }, {
            $set: {
                "data_faktycznego_zwrotu": new Date()
            }
        });
    },

    deleteMovie: async(mongoClient, movieID) => {
        return await mongoClient.db("wypozyczalnia").collection("filmy").deleteOne({
            "_id": movieID
        });
    },
    deleteRental: async(mongoClient, rentalID) => {
        return await mongoClient.db("wypozyczalnia").collection("wypozyczenia").deleteOne({
            "_id": rentalID
        });
    },
    deleteClient: async(mongoClient, userID) => {
        return await mongoClient.db("wypozyczalnia").collection("klienci").deleteOne({
            "_id": userID
        });
    },

    doesMovieAlreadyExist: async(mongoClient, movieTitle) => {
        return await mongoClient.db("wypozyczalnia").collection("filmy").findOne({
            "tytul": movieTitle
        }) !== null;
    },
    doesClientHaveActiveRental: async(mongoClient, userID) => {
        return await mongoClient.db("wypozyczalnia").collection("wypozyczenia").findOne({
            "dane_klienta._id": userID,
            "data_faktycznego_zwrotu": null
        }) !== null;
    },
    isMovieCurrentlyRented: async(mongoClient, movieID) => {
        return await mongoClient.db("wypozyczalnia").collection("wypozyczenia").findOne({
            "film._id": movieID,
            "data_faktycznego_zwrotu": null
        }) !== null;
    }
}

const generateDateMatchPipeline = (dateString) => {
    const date = new Date(dateString);
    date.setTime(date.getTime() - date.getTimezoneOffset()*60000)

    const date_dayAfter = new Date(date.getTime());
    date_dayAfter.setDate(date.getDate() + 1);

    date.setUTCHours(0, 0, 0, 0);
    date_dayAfter.setUTCHours(0, 0, 0, 0);

    return {
        $gte: date,
        $lte: date_dayAfter
    };
}