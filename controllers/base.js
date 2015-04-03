'use strict';

/**
 * BaseApiController - takes a data provider object to initialize
 * @param dataProvider
 * @constructor
 */
function BaseApiController(model) {
    this.model = model;
}


// Interface.
/**
 * getOne
 * @param {object} res - response see restify docs
 * @param {object} req - request see restify docs
 * @param {function} next - next triggers the next handler to be called. Injected by restify
 */
BaseApiController.prototype.getOne = function (res, req, next) {

};

/**
 * getMany
 * @param {object} res - response see restify docs
 * @param {object} req - request see restify docs
 * @param {function} next - next triggers the next handler to be called. Injected by restify
 */
BaseApiController.prototype.getMany = function (res, req, next) {

};

/**
 *
 * @param {object} res - response see restify docs
 * @param {object} req - request see restify docs
 * @param {function} next - next triggers the next handler to be called. Injected by restify
 */
BaseApiController.prototype.post = function (res, req, next) {

};

/**
 *
 * @param {object} res - response see restify docs
 * @param {object} req - request see restify docs
 * @param {function} next - next triggers the next handler to be called. Injected by restify
 */
BaseApiController.prototype.put = function (res, req, next) {

};

/**
 *
 * @param {object} res - response see restify docs
 * @param {object} req - request see restify docs
 * @param {function} next - next triggers the next handler to be called. Injected by restify
 */
BaseApiController.prototype.del = function (res, req, next) {

};

module.exports = BaseApiController;
