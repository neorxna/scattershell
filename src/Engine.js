import React, { useState, useEffect } from 'react'
import { InitialGameState, StartingLocation } from './Game'
import { ActionTypes, Actions } from './Actions'
import { gameTick, worldTick, launchVoyage } from './State'

const tickInterval = 2000

function useScattershellEngine(messageProvider, progressProvider) {
  const [gameState, setGameState] = useState(InitialGameState)
  const [deltas, setDeltas] = useState({
    woodΔ: 0,
    foodΔ: 0,
    energyΔ: 0,
    windΔ: 0
  })

  const { clearOneMessage, postMessage } = messageProvider

  useEffect(() => {
    // discover the starting island on game launch
    doAction(ActionTypes.LaunchFleet, 'Beginning', {
      toName: StartingLocation,
      isBeginning: true,
      actionType: ActionTypes.LaunchFleet
    })
  }, [])

  const tick = () => {
    // The game loop.
    const { player } = gameState
    const { wind } = player

    setGameState(gameTick(deltas => setDeltas(deltas)))
    setGameState(worldTick())
    progressProvider.tick(wind)
    clearOneMessage()
  }

  const doAction = (actionType, islandName, task) => {
    const action = Actions[actionType]
    const {
      beginStateChange,
      endStateChange,
      finishMessage,
      getDuration,
      getName
    } = action
    setGameState(
      beginStateChange(islandName, task, () => {
        progressProvider.add({
          ...action,
          onFinished: () => {
            setGameState(endStateChange(islandName, task))
            postMessage(finishMessage(islandName, task))
          },
          actionType,
          duration: getDuration(task),
          name: getName(task),
          progress: 0
        })
      })
    )
  }

  return { gameState, doAction, tick, deltas }
}

export { useScattershellEngine, tickInterval }
