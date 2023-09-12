"use strict";

// Fetch data from TMBDP API
async function fetchAPIData(endpoint) {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

    // Display spinner before/during data being fetched
    showSpinner()

	const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-UK`);

	const data = await response.json();

    // Once data is fetched, hide the spinner
    hideSpinner();

	return data;
}

// Make request to search
async function searchAPIData(endpoint) {
	const API_KEY = global.api.apiKey;
	const API_URL = global.api.apiUrl;

    // Display spinner before/during data being fetched
    showSpinner()

	const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-UK&query=${global.search.term}`);

	const data = await response.json();

    // Once data is fetched, hide the spinner
    hideSpinner();

	return data;
}

// Search movies/shows

async function search() {
	const queryString = window.location.search;
	// console.log(queryString);
	const urlParams = new URLSearchParams(queryString);
	global.search.type = urlParams.get('type');
	global.search.term = urlParams.get('search-term');

	// Show alerts depending on search
	if (global.search.term !== '' && global.search.term !== null) {
		// @todo - make request and display results
		const { results, total_pages, page } = await searchAPIData();
		// console.log(results);

		if (results.length === 0) {
			showAlert('No results found');
			return;
		}

		displaySearchResults(results);

		document.querySelector('#search-term').value = '';

	} else {
		showAlert('Please enter a search term');
	}
}

// Function to display search results
function displaySearchResults(results) {
	results.forEach((result) => {
		const div = document.createElement("div");
		div.classList.add("card");
		div.innerHTML = `
            <a href="${global.search.type}-details.html?id=${result.id}">
                ${
                    result.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" class="card-img-top" alt="${global.search.type === 'movie' ? result.title : result.name}" />` : `<img src="images/no-image.jpg" class="card-img-top" alt="${global.search.type === 'movie' ? result.title : result.name}" />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
                </p>
            </div>			
        `;

        document.querySelector('#search-results').appendChild(div);
	});
}

// Displaying spinner func
function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

// Hiding spinner func
function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}

// Function for displaying popular movies
async function displayPopularMovies() {
	const { results } = await fetchAPIData("movie/popular");
	// console.log(results);

	results.forEach((movie) => {
		const div = document.createElement("div");
		div.classList.add("card");
		div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                ${
                    movie.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />` : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                    <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>			
        `;

        document.querySelector('#popular-movies').appendChild(div);
	});
}

// Function for displaying popular tv shows
async function displayPopularShows() {
	const { results } = await fetchAPIData("tv/popular");
	// console.log(results);

	results.forEach((show) => {
		const div = document.createElement("div");
		div.classList.add("card");
		div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
                ${
                    show.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}" />` : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.name}" />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">
                    <small class="text-muted">Air Date: ${show.first_air_date}</small>
                </p>
            </div>			
        `;

        document.querySelector('#popular-shows').appendChild(div);
	});
}

// Display movie details
async function displayMovieDetails() {
    // window.location.search retrieves the query string part of the URL
    // Where the movie id is
    const movieId = window.location.search.split('=')[1];

    const movie = await fetchAPIData(`movie/${movieId}`);

    // Overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path);

    const div = document.createElement('div');
    
    div.innerHTML = `
    <div class="details-top">
					<div>
                    ${
                        movie.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />` : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
                    }
					</div>
					<div>
						<h2>${movie.title}</h2>
						<p>
							<i class="fas fa-star text-primary"></i>
							${movie.vote_average.toFixed(1)}/ 10
						</p>
						<p class="text-muted">Release Date: ${movie.release_date}</p>
						<p>
							${movie.overview}
						</p>
						<h5>Genres</h5>
						<ul class="list-group">
							${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
						</ul>
						<a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
					</div>
				</div>
				<div class="details-bottom">
					<h2>Movie Info</h2>
					<ul>
						<li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
						<li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
						<li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
						<li><span class="text-secondary">Status:</span> ${movie.status}</li>
					</ul>
					<h4>Production Companies</h4>
					<div class="list-group">
                        ${movie.production_companies.map(company => `<span>${company.name}</span>`).join('')}
                    </div>
				</div>
    `;
    document.querySelector('#movie-details').appendChild(div);
    console.log(movieId);
}

// Display show details
async function displayShowDetails() {
    // window.location.search retrieves the query string part of the URL
    // Where the movie id is
    const showId = window.location.search.split('=')[1];

    const show = await fetchAPIData(`tv/${showId}`);

    // Overlay for background image
    displayBackgroundImage('tv', show.backdrop_path);

    const div = document.createElement('div');
    
    div.innerHTML = `
    <div class="details-top">
					<div>
                    ${
                        show.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}" />` : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.name}" />`
                    }
					</div>
					<div>
						<h2>${show.name}</h2>
						<p>
							<i class="fas fa-star text-primary"></i>
							${show.vote_average.toFixed(1)}/ 10
						</p>
						<p class="text-muted">Last Air Date: ${show.last_air_date}</p>
						<p>
							${show.overview}
						</p>
						<h5>Genres</h5>
						<ul class="list-group">
							${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
						</ul>
						<a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
					</div>
				</div>
				<div class="details-bottom">
					<h2>Show Info</h2>
					<ul>
						<li><span class="text-secondary">Number of Episodes:</span> ${show.number_of_episodes}</li>
						<li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}</li>
						<li><span class="text-secondary">Status:</span> ${show.status}</li>
					</ul>
					<h4>Production Companies</h4>
					<div class="list-group">
                        ${show.production_companies.map(company => `<span>${company.name}</span>`).join('')}
                    </div>
				</div>
    `;
    document.querySelector('#show-details').appendChild(div);
    // console.log(movieId);
}

// Display backdrop on details pages
function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv);
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

// Formatting numbers
function addCommasToNumber(number) {
    // Using regex to add comma after every third number 
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Display slider movies
async function displaySlider() {
	const {results} = await fetchAPIData('movie/now_playing');

	console.log(results);

	results.forEach(movie => {
		const div = document.createElement('div');

		div.classList.add('swiper-slide');
		div.innerHTML = `
		<a href="movie-details.html?id=${movie.id}">
			<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
		</a>
		<h4 class="swiper-rating"><i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10</h4>
		`;

		document.querySelector('.swiper-wrapper').appendChild(div);

		initSwiper();
	})
}

function initSwiper() {
	const swiper = new Swiper('.swiper', {
		slidesPerView: 1,
		spaceBetween: 30,
		freeMode: true,
		loop: true,
		autoplay: {
			delay: 4000,
			disableOnInteraction: false
		},
		breakpoints: {
			500: {
				slidesPerView: 2
			},
			700: {
				slidesPerView: 3
			},
			1200: {
				slidesPerView: 4
			}
		}
	})
}

// Building a simple router
// To run specific javascript / functions on specific pages

// console.log(window.location.pathname);

// global state variable
const global = {
	currentPage: window.location.pathname,
	search: {
		term: '',
		type: '',
		page: 1,
		totalPages: 1
	},
	api: {
		apiKey: "adf63fbd25c5258d61c110fbaf9f62a4",
		apiUrl: "https://api.themoviedb.org/3/"
	}
};
// console.log(global.currentPage);

// Initialise app
// Simple router logic for executing function required for each specified page
function init() {
	switch (global.currentPage) {
		case "/":
		case "/index.html":
			console.log("Home");
			displayPopularMovies();
			displaySlider();
			break;
		case "/shows.html":
			console.log("Shows");
            displayPopularShows();
			break;
		case "/movie-details.html":
			console.log("Movie Details");
            displayMovieDetails();
			break;
		case "/tv-details.html":
			console.log("TV Details");
            displayShowDetails()
			break;
		case "/search.html":
			console.log("Search");
			search();
			break;
	}

	higlightActiveLink();
}

// Show alerts
function showAlert(message, className = 'error') {
	const alertEl = document.createElement('div');
	alertEl.classList.add('alert', className);
	alertEl.appendChild(document.createTextNode(message));
	document.querySelector('#alert').appendChild(alertEl);

	// After a certain amount of time the alert go away
	setTimeout(() => {
		alertEl.remove()
	}, 3000);
}

// Highlight active link
function higlightActiveLink() {
	const links = document.querySelectorAll(".nav-link");

	links.forEach((link) => {
		if (link.getAttribute("href") === global.currentPage) {
			link.classList.add("active");
		}
	});
}

// Only gets triggered when all the DOM elements are loaded on the page for the init func to execute
// Basically when the initial HTML document has been completely loaded and parsed
document.addEventListener("DOMContentLoaded", init);
