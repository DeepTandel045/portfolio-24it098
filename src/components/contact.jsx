import { useState } from 'react'

function Contact() {
  const [message, setMessage] = useState('')
  const [showHelp, setShowHelp] = useState(false)

  return (
    <section className="page contact-page">
      <div className="hero-card contact-card">
        <p className="eyebrow">Contact</p>
        <h2>Send a message</h2>
        <p>
          This form is controlled with <code>useState</code> and updates in real
          time.
        </p>

        <label className="field-label" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          className="message-input"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type your message here"
          rows="6"
        />

        <div className="contact-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={() => setShowHelp((current) => !current)}
          >
            {showHelp ? 'Hide help' : 'Show help'}
          </button>
          <span className="char-count">{message.length} characters</span>
        </div>

        {showHelp ? (
          <p className="help-box">
            Keep the message short and clear. The text above is mirrored live
            below.
          </p>
        ) : null}

        <div className="preview-box">
          <h3>Live preview</h3>
          <p>{message || 'Start typing to see the preview here.'}</p>
        </div>
      </div>
    </section>
  )
}

export default Contact