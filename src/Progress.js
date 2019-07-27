import React, { useState } from 'react'
import { Actions } from './Actions'

function useProgress() {
  const [items, setItems] = useState([])
  const tick = wind => {
    // if any progressItems have reached their duration, trigger them
    items
      .filter(x => x.progress >= x.duration)
      .forEach(item => {
        item.action()
      })

    // update the state of any progressItems
    // only put back the ones that are still not ready
    setItems(previous =>
      previous
        .filter(x => x.progress < x.duration)
        .map(item => {
          let progress = item.progress + 1 + 0.05 * wind
          return {
            ...item,
            progress: progress > item.duration ? item.duration : progress
          }
        })
    )
  }

  const add = item => setItems(previous => [...previous, item])

  return { items, add, tick }
}

function ProgressStatus(props) {
  const { progress } = props
  const { items } = progress

  return (
    <section className={'journeys-container'}>
      {items.length > 0 ? (
        <ul>
          {items.map(item => {
            const { name, progress, duration, actionType, destName } = item
            const { emoji } = Actions[actionType]
            return (
              <li key={`${actionType}-${destName}`}>
                {emoji} {name} ({Math.round(progress)} / {duration} progress)
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
}

export { useProgress, ProgressStatus }
