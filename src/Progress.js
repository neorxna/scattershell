import React, { useState } from 'react'
import { Actions } from './Actions'
import { ProgressIndicator } from 'office-ui-fabric-react'

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
          {items.map(item => (
            <ProgressStatusItem {...item} />
          ))}
        </ul>
      ) : null}
    </section>
  )
}

function ProgressStatusItem(props) {
  const { name, progress, duration, actionType, destName } = props
  const rounded = Math.round(progress)
  const action = Actions[actionType]
  const { text, emoji } = action

  return (
    <li key={`${actionType}-${destName}`}>
      <ProgressIndicator
        className={'progress-status-item'}
        label={`${emoji} ${text} (${rounded / duration * 100}%)`}
        description={name}
        percentComplete={Math.round(progress) / duration}
      />
    </li>
  )
}

export { useProgress, ProgressStatus }
