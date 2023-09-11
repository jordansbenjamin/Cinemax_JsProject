"use strict";

// Fetch data from TMBDP API
async function fetchAPIData(endpoint) {
	const API_KEY = "adf63fbd25c5258d61c110fbaf9f62a4";
	const API_URL = "https://api.themoviedb.org/3/";

	const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-UK`);

    const data = await response.json();

    return data;
}

// Function for displaying popular movies
async function displayPopularMovies() {
    const {results} = await fetchAPIData('movie/popular')
    console.log(results);
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
