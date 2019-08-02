import React, { useState, useEffect } from 'react'
import { InitialGameState, StartingLocation } from './Game'
import { ActionTypes, Actions } from './Actions'
import { gameTick, worldTick } from './State'
import { useProgress } from './Progress'
import { useLoadSave } from './LoadSave'

const tickInterval = 1000

function useScattershellEngine(messageProvider) {
  const [gameState, setGameState] = useState(InitialGameState)
  const [deltas, setDeltas] = useState({
    woodΔ: 0,
    foodΔ: 0,
    energyΔ: 0,
    windΔ: 0
  })

  const progress = useProgress()
  const progressProvider = {
    add: item => setGameState(progress.add(item)),
    tick: progress.tick
  }

  const { clearOneMessage, postMessage } = messageProvider
  const loadSave = useLoadSave(gameState)
  const loadSaveProvider = {
    loadState: saveFile => setGameState(loadSave.loadState(saveFile)),
    serializeState: loadSave.serializeState
  }
  useEffect(() => {
    // discover the starting island on game launch
    newGame()
  }, [])

  const onProgressItemFinished = progressItem => {
    const { actionType, islandName, task } = progressItem
    const action = Actions[actionType]
    postMessage(action.finishMessage(progressItem))
    return action.endStateChange(islandName, task)
  }

  const onProgressItemBeginning = progressItem => {
    const { actionType, islandName, task } = progressItem
    const action = Actions[actionType]
    return action.beginStateChange(islandName, task)
  }

  const tick = () => {
    setGameState(game => {
      // The game loop.
      const worldTickFn = worldTick()
      const gameTickFn = gameTick(deltas => setDeltas(deltas))
      const progressTickFn = progressProvider.tick(
        onProgressItemBeginning,
        onProgressItemFinished
      )

      var gameUpdate = game
      gameUpdate = gameTickFn(gameUpdate)
      gameUpdate = progressTickFn(gameUpdate)
      gameUpdate = worldTickFn(gameUpdate)
      return gameUpdate
    })

    clearOneMessage()
  }

  const newGame = () =>
    doAction(ActionTypes.LaunchFleet, 'Beginning', {
      toName: StartingLocation,
      isBeginning: true,
      actionType: ActionTypes.LaunchFleet
    })

  const doAction = (actionType, islandName, task) => {
    const action = Actions[actionType]
    const { getDuration, getName } = action
    const destinationIsDiscovered =
      task.toName && gameState.islands[task.toName].isDiscovered
    progressProvider.add({
      task,
      actionType,
      duration: getDuration(task),
      name: getName(task),
      islandName,
      progress: 0,
      destinationIsDiscovered
    })
  }

  return {
    gameState,
    doAction,
    tick,
    deltas,
    newGame,
    progressProvider,
    loadSaveProvider
  }
}

export { useScattershellEngine, tickInterval }
