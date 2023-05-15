import { apiKey } from './api/apiKey.js'

const key = apiKey;

const moviesDiv = document.querySelector('.movies');
const searchInput = document.querySelector('.search-movie');
const checkInput = document.querySelector('.check-movie');
const searchItem = document.querySelector('.search-icon');

let isFavorite = false;

searchItem.addEventListener('click', searchReturn);
checkInput.addEventListener('click', listFavorites);

function clearMovies(){
  moviesDiv.innerHTML = '';
}

searchInput.addEventListener('keyup', function(event) {
  if (event.keyCode == 13) {
    searchReturn()
    return
  }
})

async function searchMovie(){

  const movieSearch = searchInput.value;

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieSearch}&language=en-US&page=1`;

  const fetchResponse = await fetch(url)
  
  const { results } = await fetchResponse.json()
  // recebe os resultados em JSON e os retorna

  return results
}

async function searchReturn(){

  if(searchInput.value != ''){
    clearMovies();
    const movies = await searchMovie();
    movies.forEach(movie => renderMovie(movie))
  }else{
    clearMovies();
    const movies = await getPopularMovies();
    movies.forEach(movie => renderMovie(movie))
  }
}


async function listFavorites(){
  if(checkInput.checked){
    clearMovies();
    const movies = getFavoriteMovies() || []
    movies.forEach(movie => renderMovie(movie))
  }else{
    clearMovies();
    const movies = await getPopularMovies();
    movies.forEach(movie => renderMovie(movie));
  }
}

function favoriteMovie(event, movie){
  isFavorite = !isFavorite;

  if(isFavorite === false){
    event.target.src = "images/heart.svg";
    const movies = getFavoriteMovies() || []
    if(movies.find( m => m.id === movie.id)){
      const newMovies = movies.filter(m => m.id != movie.id);
      localStorage.setItem('favoriteMovies', JSON.stringify(newMovies))
    }
  }else{
    event.target.src = "images/heart-fill.svg"

    const movies = getFavoriteMovies() || []
    movies.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(movies));
  }
}

async function getPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${key}`
  const fetchResponse = await fetch(url)
  
  const { results } = await fetchResponse.json()
  // recebe os resultados em JSON e os retorna

  return results
}

function getFavoriteMovies() {
  return JSON.parse(localStorage.getItem('favoriteMovies'));
}

window.onload =  async function() {
  const movies = await getPopularMovies();
  movies.forEach(movie => renderMovie(movie))
}

// Renderizar toda a estrutura do filme na página
function renderMovie(movie) {

    const movieItem = document.createElement("div");
    movieItem.classList.add('movie-item');
    moviesDiv.appendChild(movieItem);

    const movieInfo = document.createElement("div");
    movieInfo.classList.add('movie-informations');
    movieItem.appendChild(movieInfo);

    const movieImg = document.createElement("div")
    movieImg.classList.add('movie-image');
    const image = document.createElement("img");
    image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    image.alt =  movie.title;
    movieImg.appendChild(image); 

    const movieText = document.createElement("div")
    movieText.classList.add('movie-text');
    const title = document.createElement("h4");
    title.textContent = movie.title;

    const movieRating = document.createElement("div")
    movieRating.classList.add('rating-favorites');

    const rating = document.createElement("div")
    rating.classList.add('rating');
    const ratingImg = document.createElement("img");
    ratingImg.src = "images/star.png"
    const ratingText = document.createElement("span");
    ratingText.textContent = movie.vote_average;

    const favorite = document.createElement("div")
    favorite.classList.add('favorite');
    const favImg = document.createElement("img");
    favImg.src = "images/heart.svg";
    favImg.addEventListener('click', (event) => favoriteMovie(event, movie)); 
    const favText = document.createElement("span");
    favText.textContent = "Favoritar";

    rating.appendChild(ratingImg);
    rating.appendChild(ratingText);

    favorite.appendChild(favImg);
    favorite.appendChild(favText);

    movieRating.appendChild(rating);
    movieRating.appendChild(favorite);

    movieText.appendChild(title); 
    movieText.appendChild(movieRating);

    const movieDescription = document.createElement("div")
    movieDescription.classList.add('movie-description');
    const description = document.createElement("span");
    description.textContent = movie.overview;

    movieDescription.appendChild(description);

    movieInfo.appendChild(movieImg);
    movieInfo.appendChild(movieText);
    movieItem.appendChild(movieDescription);

    moviesDiv.appendChild(movieItem);
    
}
