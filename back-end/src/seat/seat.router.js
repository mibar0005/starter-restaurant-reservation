/**
 * Defines the router for seat resources.
 *
 * @type {Router}
 */

//Import the necessary files and dependencies
 const router = require("express").Router({ mergeParams: true })
 const controller = require("./seat.controller")
 const methodNotAllowed = require("../errors/methodNotAllowed")
 
 router
   .route("/")
   .put(controller.update)
   .delete(controller.delete)
   .all(methodNotAllowed)
 
 module.exports = router