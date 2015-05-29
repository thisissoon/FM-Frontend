"use strict";
/**
 * @module   FM.api.ERRORS
 * @author   SOON_
 */
angular.module("FM.api.ERRORS", [

])
/**
 * @constant
 * @property {Object} ERRORS
 */
.constant("ERRORS", {
    "AUTH_VALIDATION_TITLE": "Sorry guys...",
    "AUTH_VALIDATION_MESSAGE": "You need to be a member of SOON_ or This Here.",
    "UNKNOWN_TITLE": "Something strange happened...",
    "STATUS_401_TITLE": "Unauthorised",
    "STATUS_401_MESSAGE": "You need to be logged in to do that.",
    "STATUS_403_TITLE": "Forbidden",
    "STATUS_403_MESSAGE": "You're not permitted to perform the requested operation.",
    "STATUS_404_TITLE": "Not Found",
    "STATUS_404_MESSAGE": "The requested resource could not be found."
});
