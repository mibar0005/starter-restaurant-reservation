const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")


//Middleware Function

//Function to check if a table exists
async function tableExists(req, res, next) {
  const { table_id } = req.params
  let table = await service.read(table_id)
  const error = { status: 404, message: `Table ${table_id} cannot be found.` }

  if (table) {
    res.locals.table = table
    return next()
  }

  next(error)
}

async function validateNewTable(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: "Data Missing!" })
  const { table_name, capacity, reservation_id } = req.body.data
  if (!table_name || !capacity)
    return next({
      status: 400,
      message: "Please complete the following: table_name, capacity.",
    })

  if (table_name.length <= 1)
    return next({
      status: 400,
      message: "table_name must be at least two characters",
    })

  res.locals.table = {
    table_name,
    capacity,
    reservation_id,
  }
  next()
}


//Create Function 
async function create(_, res) {
  const data = await service.create(res.locals.table)
  res.status(201).json({
    data: data[0],
  })
}

//Read Function 
async function read(_, res) {
  res.json({
    data: res.locals.table,
  })
}

//List Function 
async function list(_, res) {
  const tables = await service.list()
  res.json({ data: tables })
}

module.exports = {
  create: [asyncErrorBoundary(validateNewTable), asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  list: [asyncErrorBoundary(list)],
  tableExists,
}