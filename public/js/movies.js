const setupMovieDetails = async(movieID) => {
    const movie = await fetchDocByID(movieID, "movie");
    document.getElementById("movie_heading").textContent = movie.tytul;
    document.getElementById("movie_property_genre_value").textContent = movie.gatunek;
    document.getElementById("movie_property_director_value").textContent = movie.rezyser;
    document.getElementById("movie_property_duration_value").textContent = movie.czas_trwania_min;
    document.getElementById("movie_property_rating_value").textContent = movie.ocena + "/10";
    document.getElementById("movie_property_cast_value").textContent = movie.aktorzy.join(", ");
    const movie_property_cast_value = document.getElementById("movie_property_status_value")
    let movieStatus;
    if(movie.dostepny) {
        movieStatus = {
            key: "rent",
            value: "Wypożycz",
            linkTo: "/api/rent/" + movie._id,
            requestMethod: "POST",
            fieldsToSend: [{
                key: "movieID",
                value: movie._id
            }, {
                key: "movieTitle",
                value: movie.tytul
            }]
        };
    }
    else {
        movieStatus = {
            key: "rent",
            value: "Niedostępny"
        };
        movie_property_cast_value.classList.add("movie_unavailable");
    }
    displayDocPropertyInNode(movie_property_cast_value, movieStatus, movie)
    document.getElementById("movie_property_description_value").textContent = movie.opis;
}