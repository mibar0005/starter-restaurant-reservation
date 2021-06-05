//Import the axios package 
import axios from 'axios'

/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from './format-reservation-date'
import formatReservationTime from './format-reservation-date'

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers()
headers.append('Content-Type', 'application/json')

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the request.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */

//Create a function to fetch json 
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options)
    if (response.status === 204) {
      return null
    }
    const answer = await response.json()
    if (answer.error) {
      return Promise.reject({ message: answer.error })
    }
    return answer.data
  } catch (error) {
    if (error.name !== "AbortError") {
      throw error
    }
    return Promise.resolve(onCancel)
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */


export async function listReservations(params, signal) {
  const newUrl = new URL(`${API_BASE_URL}/reservations`)
  Object.entries(params).forEach(([key, value]) =>
    newUrl.searchParams.append(key, value.toString())
  )
  return await fetchJson(newUrl, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime)
}

/**
 * Retrieves all existing tables.
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty array of table saved in the database.
 */

export async function listTables() {
  const { data } = await axios.get(`${API_BASE_URL}/tables`)
  return data.data
}
/**
 * Finds reservation by ID
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export const findReservation = async (reservationId) => {
  const response = await axios.get(`${API_BASE_URL}/reservations/${reservationId}`,
  {
    data: { reservation_id: reservationId },
  })
  return response.data.data
}