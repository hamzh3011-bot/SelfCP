import { useRef, useState } from 'react'
import { searchFields } from '../data/content'
import { addBooking } from '../data/siteStore'
import { Icon } from './Icons'

const today = new Date().toISOString().slice(0, 10)

// A <select> can only display a value that exists among its options, so after
// swapping origin and destination each list keeps the current city selectable.
const withCurrent = (options, current) => (options.includes(current) ? options : [current, ...options])

export default function FlightSearch() {
  const [from, setFrom] = useState('تهران')
  const [to, setTo] = useState('استانبول')
  const [depart, setDepart] = useState('')
  const [back, setBack] = useState('')
  const [passengers, setPassengers] = useState(searchFields.passengers[0])
  const [cabin, setCabin] = useState(searchFields.cabin[0])
  const [status, setStatus] = useState('')
  const statusRef = useRef(null)

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  const submit = (event) => {
    event.preventDefault()
    // Every search is filed in the admin panel's bookings inbox.
    addBooking({ from, to, depart, back, passengers, cabin })
    const when = depart ? ` برای تاریخ ${depart}` : ''
    setStatus(`در حال آماده‌سازی پروازهای ${from} به ${to}${when}، ${passengers}، کلاس ${cabin}.`)
  }

  return (
    <form className="glass-panel squircle p-4 sm:p-5 lg:p-6" onSubmit={submit} aria-label="جست‌وجوی پرواز">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-end">
        {/* مبدا ← مقصد */}
        <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-end lg:col-span-4">
          <div className="field flex-1">
            <label className="field-label" htmlFor="fs-from">
              مبدا
            </label>
            <select
              id="fs-from"
              className="field-control"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            >
              {withCurrent(searchFields.origin, from).map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="swap-btn self-center sm:self-end sm:mb-[3px]"
            onClick={swap}
            aria-label="جابجایی مبدا و مقصد"
          >
            <Icon name="swap" size={20} />
          </button>

          <div className="field flex-1">
            <label className="field-label" htmlFor="fs-to">
              مقصد
            </label>
            <select
              id="fs-to"
              className="field-control"
              value={to}
              onChange={(event) => setTo(event.target.value)}
            >
              {withCurrent(searchFields.destination, to).map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field lg:col-span-2">
          <label className="field-label" htmlFor="fs-depart">
            تاریخ رفت
          </label>
          <input
            id="fs-depart"
            type="date"
            className="field-control"
            min={today}
            value={depart}
            onChange={(event) => setDepart(event.target.value)}
          />
        </div>

        <div className="field lg:col-span-2">
          <label className="field-label" htmlFor="fs-back">
            تاریخ برگشت
          </label>
          <input
            id="fs-back"
            type="date"
            className="field-control"
            min={depart || today}
            value={back}
            onChange={(event) => setBack(event.target.value)}
          />
        </div>

        <div className="field lg:col-span-2">
          <label className="field-label" htmlFor="fs-passengers">
            مسافران
          </label>
          <select
            id="fs-passengers"
            className="field-control"
            value={passengers}
            onChange={(event) => setPassengers(event.target.value)}
          >
            {searchFields.passengers.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="field lg:col-span-2">
          <label className="field-label" htmlFor="fs-cabin">
            کلاس پروازی
          </label>
          <select
            id="fs-cabin"
            className="field-control"
            value={cabin}
            onChange={(event) => setCabin(event.target.value)}
          >
            {searchFields.cabin.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-12">
          <button type="submit" className="btn btn-primary w-full">
            <Icon name="search" size={19} />
            جست‌وجوی پرواز
          </button>
        </div>
      </div>

      <p
        ref={statusRef}
        className={`mt-3 text-center text-sm transition-opacity duration-500 ${
          status ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ color: 'var(--color-aero-700)' }}
        role="status"
        aria-live="polite"
      >
        {status || '\u00A0'}
      </p>
    </form>
  )
}
