import React from 'react'

function Calendar(props) {
  const { world } = props
  const { day, dayOfWeek, weekOfYear, year } = world
  return (
    <section className={'calendar-container'}>
      <p>{`day ${day}, year ${year} (week ${weekOfYear}/52)`}</p>
    </section>
  )
}

export { Calendar }