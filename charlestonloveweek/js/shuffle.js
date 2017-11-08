'use strict';

var Shuffle = window.Shuffle;

var Demo = function (element) {
  this.categories = Array.from(document.querySelectorAll('.checkboxes input'));
  this.organizations = document.querySelectorAll('.form__controls select')[0];
  this.search = document.querySelectorAll('.search__inner input')[0];
  this.startDateElement = document.getElementById('start-date');
  this.endDateElement = document.getElementById('end-date');

  this.shuffle = new Shuffle(element, {
    easing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', // easeOutQuart
    sizer: '.the-sizer',
  });

  this.filters = {
    categories: this._getCurrentCategoryFilters(),
    organizations: this._getCurrentOrganizationFilters(),
  };

  this._bindEventListeners();
};

/**
 * Bind event listeners for when the filters change.
 */
Demo.prototype._bindEventListeners = function () {
  this._onCategoryChange = this._handleCategoryChange.bind(this);
  this._onOrganizationChange = this._handleOrganizationChange.bind(this);
  this._onSearchChange = this._handleSearchChange.bind(this);
  this._onDateChange = this._handleDateChange.bind(this);

  this.categories.forEach(function (input) {
    input.addEventListener('change', this._onCategoryChange);
  }, this);

  this.organizations.addEventListener('change', this._onOrganizationChange);

  this.search.addEventListener('keyup', this._onSearchChange);

  this.startDateElement.addEventListener('datechange', this._onDateChange);
  
  this.endDateElement.addEventListener('datechange', this._onDateChange);
};

/**
 * Process date click event
 */
Demo.prototype._handleDateChange = function(evt) {
  var elementId = evt.target.id;
  var processedId = elementId.replace('-', '');
  this[processedId] = evt.target.value ? new Date(evt.target.value) : '';
  
  this.filter();
}
/**
 * process Search text
 */
Demo.prototype._processSearch = function (element) {
  var titleElement = element.querySelector('.event .event__title');
  var titleText = titleElement.textContent.toLowerCase().trim();

  return this.searchText ? titleText.indexOf(this.searchText) !== -1 : true;
}

/**
 * process dates
 */
Demo.prototype._processDates = function (element) {
  var startDateElement = new Date(element.getAttribute('data-start-date'));
  var endDateElement = new Date(element.getAttribute('data-end-date'));
  
  var datePass=true;
  if( this.startdate ) {
    var startDate = new Date(this.startdate);
    datePass = startDateElement > startDate;
  }
  if ( datePass && this.enddate ) {
    var endDate = new Date(this.enddate)
    datePass = datePass && (endDate > endDateElement);
  } else if ( this.enddate ){
    var endDate = new Date(this.enddate)
    datePass = endDate > endDateElement;
  }
  return datePass;
}

Demo.prototype._handleSearchChange = function (evt) {
  this.searchText = evt.target.value.toLowerCase();

  this.filter();
}

/**
 * Get the values of each checked input.
 * @return {Array.<string>}
 */
Demo.prototype._getCurrentCategoryFilters = function () {
  return this.categories.filter(function (input) {
    return input.checked;
  }).map(function (input) {
    return input.value;
  });
};

/**
 * Get the values of each `active` button.
 * @return {Array.<string>}
 */
Demo.prototype._getCurrentOrganizationFilters = function () {
  return this.organizations.value
};

/**
 * A category input check state changed, update the current filters and filte.r
 */
Demo.prototype._handleCategoryChange = function () {
  this.filters.categories = this._getCurrentCategoryFilters();
  this.filter();
};

/**
 * Organization select was changed. Update filters and display.
 * @param {Event} evt Click event object.
 */
Demo.prototype._handleOrganizationChange = function (evt) {
  var select = evt.currentTarget;

  var selectedOption = select.options[select.selectedIndex];

  this.filters.organizations = selectedOption.getAttribute('value')?[selectedOption.getAttribute('value')]:[];

  this.filter();
};

/**
 * Filter shuffle based on the current state of filters.
 */
Demo.prototype.filter = function () {
  if (this.hasActiveFilters()) {
    this.shuffle.filter(this.itemPassesFilters.bind(this));
  } else {
    this.shuffle.filter(Shuffle.ALL_ITEMS);
  }
};

/**
 * If any of the arrays in the `filters` property have a length of more than zero,
 * that means there is an active filter.
 * @return {boolean}
 */
Demo.prototype.hasActiveFilters = function () {
  return Object.keys(this.filters).some(function (key) {
    return this.filters[key].length > 0;
  }, this) || this.searchText || this.startdate || this.enddate;
};

/**
 * Determine whether an element passes the current filters.
 * @param {Element} element Element to test.
 * @return {boolean} Whether it satisfies all current filters.
 */
Demo.prototype.itemPassesFilters = function (element) {
  if(element.children[0].className.split(' ').includes('event__get_more_container')) {
    return true;
  }
  var categories = this.filters.categories;
  var organizations = this.filters.organizations;
  var category = element.getAttribute('data-category');
  var organziation = element.getAttribute('data-organization');

  // If there are active shape filters and this shape is not in that array.
  if (categories.length > 0 && !categories.includes(category)) {
    return false;
  }

  // If there are active color filters and this color is not in that array.
  if (organizations.length > 0 && !organizations.includes(organziation)) {
    return false;
  }

  return this._processSearch(element) && this._processDates(element);
};

document.addEventListener('DOMContentLoaded', function () {
  if(document.querySelector('.events__container')) {
    window.demo = new Demo(document.querySelector('.events__container'));
  }
});