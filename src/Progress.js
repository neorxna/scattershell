import React from 'react'
import { Actions, ActionTypes } from './Actions'
import { ProgressIndicator } from 'office-ui-fabric-react'

function useProgress() {
  const tick = (onProgressItemBeginning, onProgressItemFinished) => {
    // return an update to the game state that ticks all progress items as needed.
    // only put back the ones that are still not ready
    return game => {
      const { progressItems, player } = game
      const { wind } = player

      // take all the updates by progressItems and merge them into the new state
      var gameUpdates = game

      progressItems
        .filter(x => x.progress === 0)
        .forEach(progressItem => {
          gameUpdates = onProgressItemBeginning(progressItem)(gameUpdates)
        })

      progressItems
        .filter(x => x.progress >= x.duration)
        .forEach(progressItem => {
          gameUpdates = onProgressItemFinished(progressItem)(gameUpdates)
        })

      const updatedProgressItems = progressItems
        .filter(x => x.progress < x.duration)
        .map(item => {
          const { duration, actionType } = item
          const isVoyage =
            actionType === ActionTypes.LaunchFleet ||
            actionType === ActionTypes.LaunchOutrigger
          const progress = item.progress + 1 + (isVoyage ? 0.05 * wind : 0)
          return {
            ...item,
            progress: progress > item.duration ? item.duration : progress
          }
        })
      
      return {
        ...gameUpdates,
        progressItems: updatedProgressItems
      }
    }
  }

  const add = progressItem => {
    return game => {
      const progressItems = [...game.progressItems, progressItem]
      return {
        ...game,
        progressItems
      }
    }
  }

  return { add, tick }
}

function ProgressStatus(props) {
  const { game } = props
  const { progressItems } = game

  return (
    <section className={'journeys-container'}>
      {progressItems.length > 0 ? (
        <ul>
          {progressItems.map(item => (
            <ProgressStatusItem {...item} />
          ))}
        </ul>
      ) : null}
    </section>
  )
}

function ProgressStatusItem(props) {
  const { name, task, progress, duration, actionType, destName } = props
  const { emoji, text, hidden } = Actions[actionType]
  const roundedPct = Math.round((progress / duration) * 100)
  const description =
    actionType === ActionTypes.LaunchFleet ||
    actionType === ActionTypes.LaunchOutrigger
      ? name
      : '' // TODO island name
  return hidden ? null : (
    <li key={`${actionType}-${destName}`}>
      <ProgressIndicator
        className={'progress-status-item'}
        label={`${emoji} ${text} (${roundedPct}%)`}
        description={description}
        percentComplete={progress / duration}
      />
    </li>
  )
}

export { useProgress, ProgressStatus }
