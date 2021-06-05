const knex = require('../db/connection')

const read = (reservationId) =>
  knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first()

const update = async (tableId, reservationId, updatedTable) => {
  return knex.transaction(async function (trunx) {
    await trunx("tables")
      .select("*")
      .where({ table_id: tableId })
      .update(updatedTable, "*")
    return await trunx("reservations")
      .select("*")
      .where({ reservation_id: reservationId })
      .update({ status: "seated" })
  })
}

const finish = async (reservationId) => {
  return knex.transaction(async function (trunx) {
    await trunx("reservations")
      .where({ reservation_id: reservationId })
      .update({ status: "finished" })
    return await trunx("tables")
      .where({ reservation_id: reservationId })
      .update({ reservation_id: null })
  })
}

module.exports = {read, update, finish}