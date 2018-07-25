let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.setAttribute('aria-label', 'restaurant'); // for accessibility
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.src = DBHelper.imageUrlForReviews(restaurant);
  image.srcset = DBHelper.imageUrlForReviewsSrcset(restaurant);
  image.alt = restaurant.alt;

  const secondImage = document.getElementById('restaurant-img-2');
  secondImage.src = DBHelper.imageUrlForListings(restaurant);
  secondImage.srcset = DBHelper.imageUrlForListingsSrcset(restaurant);
  secondImage.alt = restaurant.alt;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.setAttribute('aria-label', 'cuisine'); // for accessibility
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('div');
    row.className = 'flex-container';

    const day = document.createElement('div');
    day.innerHTML = key;
    day.className = 'weekdays flex-item-1';
    row.appendChild(day);

    const time = document.createElement('div');
    time.innerHTML = operatingHours[key];
    time.className = 'opening-hours flex-item-2';
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.className = 'reviews-title';
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.className = 'reviews-listings flex-item';

  const section = document.createElement('section');
  section.className = 'flex-container';
  li.append(section);

  const name = document.createElement('h4');
  name.className = 'reviews-name flex-item';
  name.innerHTML = review.name;
  name.setAttribute('aria-label', 'author'); // for accessibility
  section.appendChild(name);

  const date = document.createElement('time');
  date.className = 'reviews-date flex-item';
  date.innerHTML = review.date;
  section.appendChild(date);

  const rating = document.createElement('p');
  rating.className = 'reviews-rating flex-item';

  // Show the review rating in stars
  if (review.rating === 5) {
    rating.innerHTML = '<i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="fas fa-star"></i><span class="sr-only">Five stars</span>';
  } else if (review.rating === 4) {
    rating.innerHTML = '<i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="far fa-star"></i><span class="sr-only">Four stars</span>';
  } else if (review.rating === 3) {
    rating.innerHTML = '<i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="far fa-star"></i> <i aria-hidden="true" class="far fa-star"></i><span class="sr-only">Three stars</span>';
  } else if (review.rating === 2) {
    rating.innerHTML = '<i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="far fa-star"></i> <i aria-hidden="true" class="far fa-star"></i> <i aria-hidden="true" class="far fa-star"></i><span class="sr-only">Two stars</span>';
  } else if (review.rating === 1) {
    rating.innerHTML = '<i aria-hidden="true" class="fas fa-star"></i> <i aria-hidden="true" class="far fa-star"></i> <i aria-hidden="true" class="far fa-star"></i> <i aria-hidden="true" class="far fa-star"></i> <i aria-hidden="true" class="far fa-star"></i><span class="sr-only">One star</span>';
  } else if (review.rating === 0) {
    rating.innerHTML = '<i aria-hidden="true" class="far fa-star"></i> <i aria-hidden="true" class="far fa-star"></i> <i aria-hidden="true" class="far fa-star"></i> <i aria-hidden="true" class="far fa-star"></i> <i aria-hidden="true" class="far fa-star"></i> </i><span class="sr-only">No stars</span>';
  }

  section.appendChild(rating);

  const comments = document.createElement('p');
  comments.className = 'reviews-text flex-item';
  comments.innerHTML = review.comments;
  section.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * NOT WORKING Count the average review rating
*/
function getAverageRating() {
  const avarageRating = document.getElementById(average-rating);
  const reviews = restaurant.reviews;
  var restaurantRatings = [];
  var sum = 0;
  var average = 0;

  reviews.forEach(function(review) {
    var thisRating = review.rating;
    restaurantRatings.push(thisRating);
  });

  // check there are reviews before calculating the average
  if (restaurantRatings.length > 0) {
    sum = restaurantRatings.reduce(function(a, b) { return a + b; });
    average = sum / restaurantRatings.length;
  }
  avarageRating.innerHTML = average;
  return average;
}

