//Import db/connection 
const knex = require("../db/connection")

//Create Resevation
const create = (newReservation) =>
  knex("reservations").insert(newReservation).returning("*")

//Read reservations
const read = (reservationId) =>
  knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first()

//Update reservation
const update = (reservationId, updatedStatus) =>
  knex("reservations")
    .select("status")
    .where({ reservation_id: reservationId })
    .update(updatedStatus, "*")

//List Reservation
const list = (reservationDate) =>
  knex("reservations")
    .select("*")
    .where({ reservation_date: reservationDate })
    .orderBy("reservation_time")

//Search Reservation
const search = (mobile_number) =>
  knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, '')}%`
    )
    .orderBy("reservation_date")

module.exports = {
  create,
  read,
  update,
  list,
  search,
}