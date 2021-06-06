//Import the necessary files and dependencies
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Middleware functions

//Function to ensure the reservation exists
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;

  let reservation = await service.read(reservation_id);

  const error = {
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  };

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next(error);
}

//Function to validate the reservation
async function validateReservation(req, res, next) {
  if (!req.body.data)
    return next({ status: 400, message: "Data Missing!" });
  const {
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time,
    status,
  } = req.body.data;

  let updatedStatus = status;

  if (
    !first_name ||
    !last_name ||
    !mobile_number ||
    !people ||
    !reservation_date ||
    !reservation_time
  )
    return next({
      status: 400,
      message:
        "Please complete the following: first_name, last_name, mobile_number, people, reservation_date, and reservation_time.",
    });

  if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/))
    return next({ status: 400, message: "reservation_date is invalid!" });

  if (!reservation_time.match(/\d{2}:\d{2}/))
    return next({ status: 400, message: "reservation_time is invalid!" });

  if (typeof people !== "number")
    return next({ status: 400, message: "people is not a number!" });

  if (!status) updatedStatus = "booked";

  if (status === "seated")
    return next({ status: 400, message: "reservation is already seated" });

  if (status === "finished")
    return next({ status: 400, message: "reservation is already finished" });

  res.locals.newReservation = {
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time,
    status: updatedStatus,
  };

  next();
}

//function to check if the time is valid
async function isValidDateTime(req, _, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const date = new Date(reservation_date);
  let today = new Date();
  const resDate = new Date(reservation_date).toUTCString();

  if (resDate.includes("Tue")) {
    return next({
      status: 400,
      message: "Sorry, we are closed on Tuesdays. Please choose another day.",
    });
  }

  if (
    date.valueOf() < today.valueOf() &&
    date.toUTCString().slice(0, 16) !== today.toUTCString().slice(0, 16)
  )
    return next({
      status: 400,
      message: "Reservations must be made in the future!",
    });

  if (reservation_time < "10:30" || reservation_time > "21:30") {
    return next({
      status: 400,
      message: "Sorry, we are closed at that time. Please choose another time.",
    });
  }
  next();
}


//Create function 
async function create(_, res) {
  const data = await service.create(res.locals.newReservation);
  res.status(201).json({
    data: data[0],
  });
}

//Read Function 
async function read(_, res) {
  res.json({
    data: res.locals.reservation,
  });
}

//Update Function 
const update = async (req, res) => {
  const { reservation } = res.locals;
  const updatedReservation = { ...reservation, ...req.body.data };
  const { reservation_id } = reservation;
  const data = await service.update(reservation_id, updatedReservation);
  res.json({ data: data[0] });
};

//Create an function to update the status 
async function updateStatus(req, res, next) {
  const newStatus = req.body.data.status;
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  const { reservation } = res.locals;
  const { reservation_id } = reservation;
  let { status } = reservation;

  if (!validStatus.includes(newStatus)) {
    return next({
      status: 400,
      message: "Cannot accept unknown status",
    });
  }

  if (status === "finished") {
    return next({
      status: 400,
      message: "Cannot change finished reservation",
    });
  }

  const updatedReservation = { ...reservation, ...req.body.data };
  const data = await service.update(reservation_id, updatedReservation);
  res.json({ data: { status: newStatus } });
}

//List function 
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let results = null;

  !date
    ? (results = await service.search(mobile_number))
    : (results = await service.list(date));

  results = results.filter((result) => {
    return result.status !== "finished";
  });

  res.json({ data: results });
}

module.exports = {
  create: [
    asyncErrorBoundary(validateReservation),
    asyncErrorBoundary(isValidDateTime),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(validateReservation),
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateStatus),
  ],
  list: [asyncErrorBoundary(list)],
};