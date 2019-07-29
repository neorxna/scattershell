import React, { useState } from 'react'
import { Actions, ActionTypes } from './Actions'
import { ProgressIndicator } from 'office-ui-fabric-react'

function useProgress() {
  const [items, setItems] = useState([])
  const tick = wind => {
    // if any progressItems have reached their duration, trigger them
    items
      .filter(x => x.progress >= x.duration)
      .forEach(item => {
        item.onFinished(item)
      })

    // update the state of any progressItems
    // only put back the ones that are still not ready
    setItems(previous =>
      previous
        .filter(x => x.progress < x.duration)
        .map(item => {
          const { duration, actionType } = item
          const isVoyage =
            actionType === ActionTypes.LaunchFleet ||
            actionType === ActionTypes.LaunchOutrigger
          const progress = item.progress + 1 + (isVoyage ? (0.05 * wind) : 0)
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
  const { name, progress, duration, actionType, destName, text, emoji } = props
  const roundedPct = Math.round((progress / duration) * 100)
  return (
    <li key={`${actionType}-${destName}`}>
      <ProgressIndicator
        className={'progress-status-item'}
        label={`${emoji} ${text} (${roundedPct}%)`}
        description={name}
        percentComplete={progress / duration}
      />
    </li>
  )
}

export { useProgress, ProgressStatus }
