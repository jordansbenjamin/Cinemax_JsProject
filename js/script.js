"use strict";

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
        case '/':
            console.log('Home');
            break;
        case '/shows.html':
            console.log('Shows');
            break;
        case '/movie-details.html':
            console.log('Movie Details');
            break;
        case '/tv-details.html':
            console.log('TV Details');
            break;
        case '/search.html':
            console.log('Search');
            break;
    }
}

// Only gets triggered when all the DOM elements are loaded on the page for the init func to execute
// Basically when the initial HTML document has been completely loaded and parsed
document.addEventListener('DOMContentLoaded', init);