const service = require("./seat.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

//Middleware Function

//Function to check if a seat exists
async function seatExists(req, res, next) {
  if (!req.body.data)
    return next({
      status: 400,
      message: "Data is missing!",
    })
  
  const reservationId = req.body.data.reservation_id
  const table = res.locals.table
  const { table_id, capacity } = table
  let { reservation_id } = table

  if (!reservationId) {
    return next({
      status: 400,
      message: "Missing reservation_id",
    })
  }

  if (reservation_id) {
    return next({
      status: 400,
      message: "Table is already occupied.",
    })
  }

  //Assign a reservation_id
  //Check if the reservation is valid
  reservation_id = reservationId
  let reservation = await service.read(reservationId)

  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${reservationId} cannot be found.`,
    })
  }

  if (reservation.people > capacity) {
    return next({
      status: 400,
      message: `Table ${table_id} does not have the capacity for your party. Choose another table.`,
    })
  }

  next()
}

//Update Function 
async function update(req, res, next) {
  try {
    const { table } = res.locals
    const { reservation_id } = req.body.data
    const { table_id } = req.params

    const reservation = await service.read(reservation_id)
    if (reservation.status === "seated") {
      return next({
        status: 400,
        message: `Reservation ${reservation_id} has already been seated.`,
      })
    }
    const updatedTable = { ...table, reservation_id }
    const data = await service.update(table_id, reservation_id, updatedTable)
    res.json({ data })
  } catch (err) {
    console.error(err)
  }
}

//Delete Function 
async function finish(_, res, next) {
  const table = res.locals.table
  let { reservation_id } = table

  if (!reservation_id)
    return next({
      status: 400,
      message: "This table is not occupied.",
    })

  const deleted = await service.finish(reservation_id)
  res.sendStatus(200).json({ data: deleted })
}

module.exports = {
  update: [asyncErrorBoundary(seatExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(finish)],
}