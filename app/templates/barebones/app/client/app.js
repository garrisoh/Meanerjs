'use strict';

/**
 * This module defines the root app and is used for any functionality independent of the current page.
 *
 * Note: The angular session is not persisted across pages, so this script will be rerun on page load.
 * You can use this file to provide functionality common across pages when you do not need persistence, or
 * to persist across pages, you can use this file to access local storage.
 */

// Create root app instance
angular.module('app', []);
