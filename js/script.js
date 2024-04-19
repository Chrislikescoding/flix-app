const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: "xxxxxx",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};
// T start - display most popular movies
const displayPopularMovies = async () => {
  const { results } = await fetchAPIDATA("movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = ` <a href="movie-details.html?id=${movie.id}">
                      ${
                        movie.poster_path
                          ? `<img
                             src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                             class="card-img-top"
                             alt="movie.title"
                             />`
                          : `<img
                             src="./images/no-image-top"
                             class="card-img-top"
                             alt="movie.title"
                             />`
                      }
                              </a>
                            <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text">
                              <small class="text-muted">Release: ${
                                movie.release_date
                              }</small>
                      </p>
                      </div>`;

    document.querySelector("#popular-movies").appendChild(div);
  });
};

// display most popular tv shows

const displayPopularShows = async () => {
  const { results } = await fetchAPIDATA("tv/popular");

  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = ` <a href="tv-details.html?id=${show.id}">
                      ${
                        show.poster_path
                          ? `<img
                             src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                             class="card-img-top"
                             alt="show.name"
                             />`
                          : `<img
                             src="./images/no-image-top"
                             class="card-img-top"
                             alt="show.name"
                             />`
                      }
                              </a>
                            <div class="card-body">
                            <h5 class="card-title">${show.name}</h5>
                            <p class="card-text">
                              <small class="text-muted">First aired: ${
                                show.first_air_date
                              }</small>
                      </p>
                      </div>`;

    document.querySelector("#popular-shows").appendChild(div);
  });
};

// display individual show Details

const displayShowDetails = async () => {
  const showId = window.location.search.split("=")[1];
  const show = await fetchAPIDATA(`tv/${showId}`);

  // Overlay for background image

  displayBackgroundImage("tv", show.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
  <div>
  ${
    show.poster_path
      ? `<img
         src="https://image.tmdb.org/t/p/w500${show.poster_path}"
         class="card-img-top"
         alt="show.name"
         />`
      : `<img
         src="./images/no-image-top"
         class="card-img-top"
         alt="show.name"
         />`
  }
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
    <p>
     ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
       ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href=${show.homepage} target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li><span class="text-secondary">Last Episode to Air</span> ${
      show.last_episode_to_air.name
    }</li>

    <li><span class="text-secondary">Status:</span> ${show.status} </li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
  ${show.production_companies
    .map((company) => `<span>${company.name}</span>`)
    .join(", ")}
</div>
</div>
`;

  document.querySelector("#show-details").appendChild(div);
};

//  show individual movie details
const displayMovieDetails = async () => {
  const movieId = window.location.search.split("=")[1];
  const movie = await fetchAPIDATA(`movie/${movieId}`);

  // Overlay for background image

  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
  <div>
  ${
    movie.poster_path
      ? `<img
         src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
         class="card-img-top"
         alt="movie.title"
         />`
      : `<img
         src="./images/no-image-top"
         class="card-img-top"
         alt="movie.title"
         />`
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
     ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
       ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href=${
      movie.homepage
    } target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes </li>
    <li><span class="text-secondary">Status:</span> ${movie.status} </li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
  ${movie.production_companies
    .map((company) => `<span>${company.name}</span>`)
    .join(", ")}
</div>
</div>
`;

  document.querySelector("#movie-details").appendChild(div);
};

// Display back drop on details pages- looks cool!
const displayBackgroundImage = (type, backgroundPath) => {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.2";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
};

// search movies/shows
// add in the search criteria with some validation
const search = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    //make request and display results, else alert
    const { results, total_pages, page, total_results } = await searchApiData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No results found");
      return;
    }
    displaySearchResults(results);

    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter a search term", "error");
  }
};

// show the results found

const displaySearchResults = (results) => {
  //clear previous results
  document.querySelector("#search-results").innerHTML = " ";
  document.querySelector("#search-results-heading").innerHTML = " ";
  document.querySelector("#pagination").innerHTML = " ";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = ` <a href="${global.search.type}-details.html?id=${
      result.id
    }">
                      ${
                        result.poster_path
                          ? `<img
                             src="https://image.tmdb.org/t/p/w500/${
                               result.poster_path
                             }"
                             class="card-img-top"
                             alt="${
                               global.search.type === "movie"
                                 ? result.title
                                 : result.name
                             }"
                             />`
                          : `<img
                             src="./images/no-image-top"
                             class="card-img-top"
                             alt="${
                               global.search.type === "movie"
                                 ? result.title
                                 : result.name
                             }"
                             />`
                      }
                              </a>
                            <div class="card-body">
                            <h5 class="card-title">${
                              global.search.type === "movie"
                                ? result.title
                                : result.name
                            }</h5>
                            <p class="card-text">
                              <small class="text-muted">Release: ${
                                global.search.type === "movie"
                                  ? result.release_date
                                  : result.first_air_date
                              }</small>
                      </p>
                      </div>`;
    document.querySelector("#search-results-heading").innerHTML = `
                              <h2>${results.length} of ${global.search.totalResults}
                              Results for ${global.search.term}</h2>

    `;
    document.querySelector("#search-results").appendChild(div);
  });
  displayPagination();
};

// Create and display pagination for search where there is more than one page

const displayPagination = () => {
  const div = document.createElement("div");

  div.classList.add("pagination");

  div.innerHTML = ` <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;
  document.querySelector("#pagination").appendChild(div);

  //disable prev button if on first page

  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  //disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // next page button pressed
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });

  // prev page utton pressed
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchApiData();
    displaySearchResults(results);
  });
};
// display slider movies - havent managed to get this to work properly yet

async function displaySlider() {
  const { results } = await fetchAPIDATA("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
    <img src=""https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
    </a>
    <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
    </h4>
    `;
    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
}
// initialise the swiper
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      displayOnInteraction: false,
    },

    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}
// Fetch data from TMDB API
const fetchAPIDATA = async (endpoint) => {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  hideSpinner();

  return data;
};

// retrieve the data where a search has been entered
const searchApiData = async () => {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );

  const data = await response.json();

  hideSpinner();

  return data;
};
// spinner shown while loading
const showSpinner = () => {
  document.querySelector(".spinner").classList.add("show");
};
//hide spinner after use
const hideSpinner = () => {
  document.querySelector(".spinner").classList.remove("show");
};

const highlightActiveLink = () => {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
};
// Show a custom Alert - text and classname can be passed in

const showAlert = (message, className = "error") => {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
};

//Edit a number with commas
const addCommasToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// routing step
const init = () => {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      search();
      break;
  }
  highlightActiveLink();
};

document.addEventListener("DOMContentLoaded", init);
