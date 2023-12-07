const movieSearchBox = document.querySelector("#movie-search-box");

const searchResultContainer = document.querySelector(
  "#search-result-container"
);

//get 10 movies from OMBD
async function loadMovies(keyword) {
  try {
    let url = `https://www.omdbapi.com/?s=${keyword}&apikey=75889fb8`;
    let response = await fetch(url);
    let data = await response.json();
    if (data.Response == "True") {
      data.Search.forEach((movie) => {
        let movieTitle = movie.Title;
        let movieDiv = document.createElement("div");
        let moviePoster;
        let movieYear = movie.Year;

        if (movie.Poster != "N/A") {
          moviePoster = movie.Poster;
        } else {
          // add default moviePoster
          moviePoster = "./images/defaultPoster.png";
        }
        // Appending movie details to the HTML
        movieDiv.innerHTML = `
        <div class = "movie"  data-gif-attached="false">
        <div class = "img">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movieTitle}</h3>
            <p>${movieYear}</p>
        </div>
        `;
        searchResultContainer.appendChild(movieDiv);

        // Adding a click event listener to each movie poster
        let moviePosterElement = movieDiv.querySelector(".img img");
        moviePosterElement.addEventListener("click", async (event) => {
          // Finding the closest parent movie div
          let parentMovieDiv = event.target.closest(".movie");
          try {
            // Checking if a GIF has not been attached to this movie
            if (parentMovieDiv.dataset.gifAttached == "false") {
              // Loading and attaching a GIF to the movie
              loadGif(parentMovieDiv, movieTitle);
              // Updating the data attribute to indicate that a GIF has been attached
              parentMovieDiv.dataset.gifAttached = "true";
            }
          } catch (error) {
            console.error(error);
          }
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function findMovies() {
  let keyword = movieSearchBox.value.trim();
  searchResultContainer.innerHTML = "";
  if (keyword.length > 0) {
    // Loading movies based on the search keyword
    loadMovies(keyword);
    searchResultContainer.classList.remove("disappear");
  } else {
    searchResultContainer.classList.add("disappear");
  }
}

// Function to load a GIF from Tenor API and attach it to the movie
async function loadGif(parentMovieDiv, movieTitle) {
  try {
    let url = `https://g.tenor.com/v1/search?q=${movieTitle}&key=LIVDSRZULELA&limit=1`;
    let response = await fetch(url);
    let data = await response.json();
    let imgUrl;
    data.results.forEach((gif) => {
      imgUrl = gif.media[0].nanogif.url;
    });
    if (imgUrl != "") {
      let gifDiv = document.createElement("div");
      gifDiv.innerHTML = `
        <div class = "movie">
        <div class = "img">
            <img src = "${imgUrl}">
        </div>
        `;
      parentMovieDiv.appendChild(gifDiv);
    }
  } catch (error) {
    console.log(error);
  }
}
