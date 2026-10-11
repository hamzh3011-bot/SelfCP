import { useState } from 'react'
import { newsletter } from '../data/content'
import { addSubscriber } from '../data/siteStore'
import Clouds from './Clouds'
import { Icon } from './Icons'
import Reveal from './Reveal'

const layers = [
  { width: '40rem', height: '14rem', top: '-4%', start: '-10rem', opacity: 0.9, blur: '6px', duration: 150 },
  { width: '22rem', height: '8rem', top: '48%', start: '70%', opacity: 0.75, blur: '10px', duration: 180, delay: 6 },
  { width: '32rem', height: '11rem', top: '70%', start: '8%', opacity: 0.8, blur: '8px', duration: 165, delay: 3 },
]

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    if (!email.trim() || busy) return
    setError('')
    setBusy(true)
    try {
      // The address is stored on the server, so the admin panel sees signups
      // from every visitor — not just from this browser.
      await addSubscriber(email)
      setDone(true)
    } catch (err) {
      setError((err && err.message) || 'ثبت عضویت انجام نشد. لطفاً دوباره تلاش کنید.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="newsletter" className="sky-band section">
      <Clouds layers={layers} />

      <div className="shell relative z-10">
        <Reveal>
          <div className="glass-panel squircle mx-auto flex max-w-3xl flex-col items-center px-7 py-14 text-center sm:px-14">
            <h2 className="t-h2 text-balance">{newsletter.title}</h2>
            <p className="t-lead mt-5 max-w-xl">{newsletter.text}</p>

            <form className="mt-9 w-full max-w-lg" onSubmit={submit}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="newsletter-email">
                  {newsletter.placeholder}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  className="field-control flex-1"
                  placeholder={newsletter.placeholder}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  style={{ background: '#fff' }}
                />
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {newsletter.cta}
                </button>
              </div>

              <p
                className={`mt-4 flex items-center justify-center gap-2 text-sm transition-opacity duration-500 ${
                  done || error ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ color: error ? '#b4372f' : 'var(--color-aero-700)' }}
                role="status"
                aria-live="polite"
              >
                <Icon name={error ? 'close' : 'sparkle'} size={17} />
                {error || (done ? 'عضویت شما ثبت شد. پیشنهادهای ویژهٔ سفر برایتان ارسال می‌شود.' : '\u00A0')}
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
