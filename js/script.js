"use strict";

// Fetch data from TMBDP API
async function fetchAPIData(endpoint) {
	const API_KEY = "adf63fbd25c5258d61c110fbaf9f62a4";
	const API_URL = "https://api.themoviedb.org/3/";

    // Display spinner before/during data being fetched
    showSpinner()

	const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-UK`);

	const data = await response.json();

    // Once data is fetched, hide the spinner
    hideSpinner();

	return data;
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

// Building a simple router
// To run specific javascript / functions on specific pages

// console.log(window.location.pathname);

// global state variable
const global = {
	currentPage: window.location.pathname,
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
			break;
		case "/shows.html":
			console.log("Shows");
            displayPopularShows();
			break;
		case "/movie-details.html":
			console.log("Movie Details");
			break;
		case "/tv-details.html":
			console.log("TV Details");
			break;
		case "/search.html":
			console.log("Search");
			break;
	}

	higlightActiveLink();
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
