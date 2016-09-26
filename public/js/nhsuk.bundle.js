/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const cookieMessage = __webpack_require__(2);

	cookieMessage('global-cookies-banner');


/***/ },
/* 2 */
/***/ function(module, exports) {

	/* global document */
	function setCookie(name, value, options = {}) {
	  let cookieString = `${name}=${value}; path=/`;

	  if (options.days) {
	    const date = new Date();
	    date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
	    cookieString = `${cookieString}; expires=${date.toGMTString()}`;
	  }

	  if (document.location.protocol === 'https:') {
	    cookieString = `${cookieString}; Secure`;
	  }

	  document.cookie = cookieString;
	}

	function getCookie(name) {
	  const nameEQ = `${name}=`;
	  const cookies = document.cookie.split(';');

	  for (let i = 0, len = cookies.length; i < len; i++) {
	    let cookie = cookies[i];

	    while (cookie.charAt(0) === ' ') {
	      cookie = cookie.substring(1, cookie.length);
	    }

	    if (cookie.indexOf(nameEQ) === 0) {
	      return decodeURIComponent(cookie.substring(nameEQ.length));
	    }
	  }

	  return null;
	}

	module.exports = (id) => {
	  const banner = document.getElementById(id);

	  if (banner && getCookie('nhsuk_seen_cookie_message') === null) {
	    banner.style.display = 'block';
	    setCookie('nhsuk_seen_cookie_message', 'yes', { days: 28 });
	  }
	};


/***/ }
/******/ ]);