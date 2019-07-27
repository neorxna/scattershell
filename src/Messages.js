import React, { useState } from 'react'

function useMessaging() {
  const [messages, setMessages] = useState([])

  const postMessage = msg =>
    setMessages(previous => [...previous, { live: 10, text: msg }])

  const clearOneMessage = () =>
    setMessages(previous =>
      previous
        .filter(msg => msg.live > 0)
        .map(msg => ({ ...msg, live: msg.live - 1 }))
    )

  return { postMessage, messages, clearOneMessage }
}

function Messages(props) {
  const { messaging } = props
  const { messages } = messaging
  return (
    <section className={'messages-container'}>
      <ul>
        {messages.map(({ text }) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </section>
  )
}

export { useMessaging, Messages }
