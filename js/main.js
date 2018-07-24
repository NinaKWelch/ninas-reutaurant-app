let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

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
  addTitleToMap();
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
 * NOT WORKING: Add title to map for accessibility
 */
function addTitleToMap() {
  const mapFrame = document.getElementsByTagName('iframe');

  mapFrame.title = 'Google map';
  return mapFrame;
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.className = 'restaurant-listing flex-item';

  const restaurantLink = document.createElement('a');
  restaurantLink.href = DBHelper.urlForRestaurant(restaurant);
  restaurantLink.className = 'flex-container';
  li.append(restaurantLink);

  const image = document.createElement('img');
  image.className = 'listing-img flex-item-3';
  image.srcset = DBHelper.imageUrlForListingsSrcset(restaurant);
  image.src = DBHelper.imageUrlForListings(restaurant);
  image.alt = restaurant.alt;
  restaurantLink.append(image);

  const name = document.createElement('h3');
  name.className = 'listing-name flex-item-1';
  name.innerHTML = restaurant.name;
  restaurantLink.append(name);

  const cuisineType = document.createElement('h4');
  cuisineType.className = 'listing-cuisine flex-item-2';
  cuisineType.innerHTML = restaurant.cuisine_type;
  restaurantLink.append(cuisineType);

  const more = document.createElement('div');
  more.className = 'more-info flex-item-4';
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
  info.innerHTML = 'Check Reviews';
  more.append(info);

  const rating = document.createElement('div');
  rating.className = 'listing-stats';
  more.append(rating);

  const ratingAvarage = document.createElement('span');
  ratingAvarage.className = 'listing-rating';
  ratingAvarage.innerHTML = '<i aria-hidden="true" class="fas fa-star"></i><i aria-hidden="true" class="fas fa-star"></i><i aria-hidden="true" class="fas fa-star"></i><i aria-hidden="true" class="fas fa-star-half-alt"></i><i aria-hidden="true" class="far fa-star"></i><span class="sr-only">Three and half stars</span>';
  rating.append(ratingAvarage);

  const reviewLength = document.createElement('span');
  reviewLength.className = 'listing-reviews';
  reviewLength.setAttribute('name', 'number of reviews');
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


