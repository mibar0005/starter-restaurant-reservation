const knex = require("../db/connection")

//Create function for tables and return all tables 
const create = (newTable) =>
  knex("tables")
    .insert(newTable)
    .returning("*")

//Function for reading tables 
const read = (tableId) =>
  knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .first()

//Function for list
const list = () =>
  knex("tables")
    .select("*")
    .orderBy("table_name")

module.exports = {
  create,
  read,
  list,
}