import React, { useState } from 'react'
import { listReservations } from '../utils/api'
import ReservationList from '../reservations/ReservationList'

import ErrorAlert from '../layout/ErrorAlert'

const Search = () => {
  const [searchReservations, setSearchReservations] = useState([])
  const [userInput, setUserInput] = useState("")
  const [err, setErr] = useState(null)
  const onChange = (event) => setUserInput(event.target.value)

  const onSubmit = (event) => {
    event.preventDefault()
    const abortController = new AbortController()
    listReservations({ mobile_number: userInput }, abortController.signal)
      .then(setSearchReservations)
      .catch((err) => {
        setErr({
           message: err.message
           })
      })
  }

  return (
    <div className='row justify-content-center'>
      <form className='col-lg-10' onSubmit={onSubmit}>
        <h1 className='text-center py-4'>Search Reservations</h1>

        <ErrorAlert error={err} />
        <div className='form-group'>
          <label htmlFor='mobile_number'>Search by mobile number</label>
          <input
            name='mobile_number'
            className='form-control'
            onChange={onChange}
          />
        </div>

        <button className='btn btn-dark' type='submit'>Find</button>
        {searchReservations.length ? (
          searchReservations.map((reservation, index) => (
            <ReservationList reservation={reservation} key={index} />
          ))
        ) : (
          <h5 className='text-white mt-3'>No reservations found</h5>
        )}
        
      </form>
    </div>
  )
}

export default Search