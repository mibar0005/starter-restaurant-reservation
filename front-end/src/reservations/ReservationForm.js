import React, { useEffect, useState } from 'react'
import { API_BASE_URL as url, findReservation } from '../utils/api'
import { useHistory, useParams } from 'react-router'
import axios from 'axios'
import ErrorAlert from '../layout/ErrorAlert'

const ReservationForm = ({ setDate }) => {
  const hist = useHistory();
  const { reservation_id } = useParams();
  const [newReservation, setNewReservation] = useState({
    first_name: "",
    last_name: "",
    reservation_date: "",
    reservation_time: "",
    mobile_number: "",
    people: "",
  })
  const [resErr, setResErr] = useState(null)

  useEffect(() => {
    const abortController = new AbortController()
    reservation_id && findReservation(reservation_id).then(setNewReservation)
    return () => abortController.abort()
  }, [])

  const { first_name, last_name, mobile_number, reservation_time } = newReservation
  let { reservation_date, people } = newReservation
  newReservation.reservation_date = newReservation.reservation_date.slice(0, 10)

//Function to add a new reservation 
  const addNewRes = (newReservation) => {
    axios
      .post(`${url}/reservations`, { data: newReservation })
      .then((res) => {
        res.status === 201 &&
          hist.push(`/dashboard?date=${newReservation.reservation_date}`)
      })
      .catch((err) => {
        setResErr({ message: err.response.data.error })
      })
  }

  //Function to update the reservation
  const updateRes = async (newReservation) => {
    axios
      .put(`${url}/reservations/${newReservation.reservation_id}`,
      {
        data: newReservation,
      })
      .then((res) => {
        res.status === 200 &&
          hist.push(`/dashboard?date=${newReservation.reservation_date}`)
      })
      .catch((err) => {
        setResErr({ message: err.response.data.error })
      })
  }

  const onChange = (event) => setNewReservation({ ...newReservation, [event.target.name]: event.target.value });

  const onSubmit = (event) => {
    event.preventDefault()
    setResErr(null)
    newReservation.people = Number(newReservation.people)

    if (!reservation_id) {
      addNewRes(newReservation)
    } else {
      updateRes(newReservation)
    }
    setDate(newReservation.reservation_date)
  }

  return (
    <div className='row justify-content-center'>
      <form className='col-lg-10' onSubmit={onSubmit}>
        <h1 className='text-center py-4'>{newReservation.reservation_id ? 'Edit' : 'New'} Reservation</h1>

        <ErrorAlert error={resErr} />
        <div className='form-group'>
          <label htmlFor='first_name'>First Name</label>
          <input
            className='form-control'
            type='text'
            name='first_name'
            placeholder='First name'
            value={first_name}
            onChange={onChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='last_name'>Last Name</label>
          <input
            className='form-control'
            type='text'
            name='last_name'
            placeholder='Last name'
            value={last_name}
            onChange={onChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='mobile_number'>Mobile Number</label>
          <input
            className='form-control'
            type='tel'
            name='mobile_number'
            placeholder='xxx-xxx-xxxx'
            value={mobile_number}
            onChange={onChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='reservation_date'>Reservation Date</label>
          <input
            className='form-control'
            type='date'
            name='reservation_date'
            id='reservation_date'
            value={reservation_date}
            onChange={onChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='reservation_time'>Time</label>
          <input
            className='form-control'
            type='time'
            name='reservation_time'
            id='reservation_time'
            value={reservation_time}
            onChange={onChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='people'>Party Size</label>
          <input
            className='form-control'
            type='text'
            name='people'
            id='people'
            placeholder="Party size"
            value={people}
            onChange={onChange}
            required
          />
        </div>

        <div className='buttons mt-2'>
          <button className='btn btn-dark mr-2' type='submit'>Submit</button>
          <button onClick={() => hist.goBack()} className='btn btn-secondary'>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default ReservationForm