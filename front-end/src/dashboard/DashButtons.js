import React from 'react'
import { today, previous, next } from '../utils/date-time'

const DashButtons = ({ date, setDate }) => {
  const day = today()
  const yesterday = previous(date)
  const followingDay = next(date)

  return (
    <div>
      <button className='btn btn-dark' onClick={() => setDate(yesterday)}>{' '} Previous</button>
      <button className='btn btn-dark' onClick={() => setDate(day)}>Today</button>
      <button className='btn btn-dark' onClick={() => setDate(followingDay)}>Next</button>
    </div>
  )
}

export default DashButtons