let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []
/*var ratings = []
var averageRating = 0;*/

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Calculate average rating from reviews and add them to the webpage.
 */

/*calcAvarageRating = (reviews = self.restaurant.reviews) => {
  const stars = document.createElement('span');
  stars.className = 'rating-stars';

  reviews.forEach(review => {
    var rating = review.rating;
    ratings.push(rating);
  });
  averageRating = ratings => ratings.reduce((a, b) => a + b, 0) / ratings.length;
  stars.append(averageRating);
}

var ratings = [];
var sum = 0;
var averageRating = 0;

function calcAvarageRating() {
  for (var i = 0; i < restaurants.length; i++) {
  var reviews = restaurants[i].reviews;

  for (var j = 0; j < reviews.length; j++) {
    var rating = reviews[j].rating;
      ratings.push(rating);
    };
  sum = ratings.reduce(add, 0);
  averageRating = sum / reviews.length;
  return averageRating;
  }
}
*/



/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.className = 'restaurant-listing flex-item'; // add a flex-item class to list item

  const restaurantLink = document.createElement('a'); // wrap the contents of the list item in a link
  restaurantLink.href = DBHelper.urlForRestaurant(restaurant);
  restaurantLink.className = 'flex-container'; // add a flex-container class to list item
  li.append(restaurantLink);

  const image = document.createElement('img');
  image.className = 'listing-img flex-item-3'; // add a flex-item-3 class to image
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  restaurantLink.append(image);

  const name = document.createElement('h3');
  name.className = 'listing-name flex-item-1'; // add a flex-item-1 class to name
  name.innerHTML = restaurant.name;
  restaurantLink.append(name);

  const cuisineType = document.createElement('h4');
  cuisineType.className = 'listing-cuisine flex-item-2'; // add a flex-item-2 class to cuisine
  cuisineType.innerHTML = restaurant.cuisine_type;
  restaurantLink.append(cuisineType);

  const more = document.createElement('div');
  more.className = 'more-info flex-item-4'; // add a flex-item-4 class to rest of the info
  restaurantLink.append(more);

  const neighborhood = document.createElement('h5');
  neighborhood.className = 'listing-area';
  neighborhood.innerHTML = restaurant.neighborhood;
  more.append(neighborhood);

  const address = document.createElement('address');
  address.className = 'listing-address';
  address.innerHTML = restaurant.address;
  more.append(address);

  const info = document.createElement('button');
  info.className = 'listing-info';
  info.innerHTML = 'View Details';
  more.append(info);

  const rating = document.createElement('div');
  rating.className = 'listing-stats';
  more.append(rating);

  const ratingAvarage = document.createElement('span');
  ratingAvarage.className = 'listing-rating';
  ratingAvarage.innerHTML = '<i class="fas fa-star"></i> ' + ' <i class="fas fa-star"></i> ' + ' <i class="fas fa-star"></i> ' + ' <i class="fas fa-star-half-alt"></i> ' + ' <i class="far fa-star"></i>';
  rating.append(ratingAvarage);

  const reviewLength = document.createElement('span');
  reviewLength.className = 'listing-reviews';
  reviewLength.innerHTML = ' \( ' + restaurant.reviews.length + ' \)';
  rating.append(reviewLength);

  return li
}


/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}
