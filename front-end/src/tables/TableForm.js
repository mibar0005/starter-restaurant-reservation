import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL as url } from '../utils/api'
import { useHistory } from 'react-router-dom'
import ErrorAlert from '../layout/ErrorAlert'

//create a table form funciton
const TableForm = () => {
  const [table, setTable] = useState({table_name: "", capacity: "",})
  const [tablesError, setTablesError] = useState(null)
  const history = useHistory()
  const { table_name, capacity } = table

  //Create an add table function
  const addTable = async (table) => {
    await axios
      .post(`${url}/tables`, { data: table })
      .then((res) => res.status === 201 && history.push('/dashboard'))
      .catch((err) => {
        setTablesError({ message: err.response.data.error })
      })
  }

  //Create an onChange event handler 
  const onChange = (event) =>
    setTable({ ...table, [event.target.name]: event.target.value })

  //Create an onSubmit event handler 
  const onSubmit = (event) => {
    event.preventDefault()
    setTablesError(null)
    const newTable = {
      table_name,
      capacity: Number(capacity),
    }

    addTable(newTable)
  }

  return (
    <div className='row justify-content-center'>
      <form className='col-lg-10' onSubmit={onSubmit}>
        <h1 className='text-center py-4'>New Table</h1>

        <ErrorAlert error={tablesError} />
        <div className='form-group'>
          <label htmlFor='table_name'>Table Name</label>
          <input
            className='form-control'
            type='text'
            name='table_name'
            placeholder='Enter the table name'
            value={table_name}
            onChange={onChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='capacity'>Capacity</label>
          <input
            className='form-control'
            type='text'
            name='capacity'
            placeholder='Enter seating capacity'
            value={capacity}
            onChange={onChange}
            required
          />
        </div>

        <div className='btns mt-2'>
          <button className='btn btn-dark mr-2' type='submit'>
            Submit
          </button>

          <button
            onClick={() => history.goBack()}
            className='btn btn-secondary'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default TableForm