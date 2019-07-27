import React, { useState, useEffect } from 'react'
import { InitialGameState, StartingLocation, NumVoyagers } from './Game'
import { IslandTypes } from './IslandProperties'
import { ScattershellLocations } from './Locations'
import { ActionTypes } from './Actions'
import * as State from './State'

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
    launchVoyage('Home', StartingLocation, ActionTypes.LaunchFleet, true)
  }, [])

  const gameTick = () => {
    // The game loop.
    const { player } = gameState
    const { wind } = player

    setGameState(State.gameTick(deltas => setDeltas(deltas)))

    setGameState(State.worldTick())

    progressProvider.tick(wind)
    clearOneMessage()
  }

  function launchVoyage(fromName, toName, actionType, isBeginning) {
    const depart = () => {
      // if spending was successful, append new task to progressItems
      const voyage = {
        duration: isBeginning
          ? 10
          : ScattershellLocations[fromName].neighbourDistance[toName] * 10,
        isBeginning,
        name: isBeginning
          ? `Voyage to ${toName}`
          : `Voyage from ${fromName} to ${toName} by ${actionType}`,
        fromName,
        toName,
        actionType,
        numPeople: NumVoyagers[actionType],
        progress: 0
      }

      const action = () => {
        //mark this island as discovered
        arriveVoyage(voyage)
      }

      progressProvider.add({ ...voyage, action })
    }

    if (isBeginning) depart()
    else setGameState(State.launchVoyage(fromName, toName, actionType, depart))
  }

  const arriveVoyage = voyage => {
    const { fromName, toName, numPeople, actiontype } = voyage
    const to = ScattershellLocations[toName]
    const isInhospitable = to.type === IslandTypes.Rocks

    const successMsg = `A ${to.type} island was encountered!`
    const rocksMsg = `An inhospitable outcrop of rocks was encountered. The ${numPeople} voyagers perished.`
    const msg = `The ${actiontype} voyage from ${fromName} arrived at ${toName}. ${
      isInhospitable ? rocksMsg : successMsg
    }`
    postMessage(msg)
    setGameState(State.arriveVoyage(voyage))
  }

  const spendEnergy = islandName => setGameState(State.spendEnergy(islandName))

  const addSettlement = islandName =>
    setGameState(
      State.addSettlement(islandName, () => {
        postMessage(`a settlement was built in ${islandName}!`)
      })
    )

  const addDwelling = islandName =>
    setGameState(
      State.addDwelling(islandName, () => {
        postMessage(`a dwelling was built in ${islandName}!`)
      })
    )

  const addPerson = islandName =>
    setGameState(
      State.addPerson(islandName, () => {
        postMessage(`a child was born in ${islandName}!`)
      })
    )

  const gameEvents = {
    spendEnergy,
    addSettlement,
    addDwelling,
    addPerson,
    launchVoyage,
    gameTick
  }

  return { gameState, gameEvents, deltas }
}

export { useScattershellEngine }
