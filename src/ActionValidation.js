import { IslandMaxPopulations } from './IslandProperties'
import {
  MaxDwellings,
  MaxGardens,
  SettlementRequiredPeople,
  NumVoyagers
} from './Game'
import { ActionCosts, ActionTypes } from './Actions'
import { IsGardenFood } from './Resources'
import { ScattershellLocations } from './Locations'

function checkCosts(player, actionCosts) {
  const { food, wood, energy } = player

  const foodCost = actionCosts['foodΔ']
  const woodCost = actionCosts['woodΔ']
  const energyCost = actionCosts['energyΔ']

  const foodDiff = food + foodCost
  const woodDiff = wood + woodCost
  const energyDiff = energy + energyCost

  return [
    foodCost == null
      ? null
      : foodDiff >= 0
      ? { met: true, text: `${-foodCost} food ✔` }
      : { met: false, text: `not enough food (need ${-foodDiff})` },
    woodCost == null
      ? null
      : woodDiff >= 0
      ? { met: true, text: `${-woodCost} materials ✔` }
      : { met: false, text: `not enough materials (need ${-woodDiff})` },
    energyCost == null
      ? null
      : energyDiff >= 0
      ? { met: true, text: `${-energyCost} energy ✔` }
      : { met: false, text: `not enough energy (need ${-energyDiff})` }
  ].filter(x => x != null)
}

function validateAction(actionType, game, islandId, populationRequired) {
  const { player, islands } = game
  const island = islands[islandId]
  const { population } = island

  const actionCosts = ActionCosts[actionType]

  const populationMet =
    populationRequired == null
      ? null
      : population >= populationRequired
      ? { met: true, text: `${populationRequired} people ✔` }
      : {
          met: false,
          text: `not enough people (need ${populationRequired -
            population} more)`
        }

  return [...checkCosts(player, actionCosts), populationMet].filter(
    x => x != null
  )
}

const validateLaunch = (game, islandId, task) => {
  const { progressItems, islands } = game
  const { actionType } = task

  const isAlreadyGoing =
    progressItems.filter(otherItem => {
      const isSameActionType = actionType === otherItem.actionType
      const isSameIsland = islandId === otherItem.islandName
      const isGoingToSameDestination =
        isSameActionType && task.toName === otherItem.task.toName
      const justStarted = otherItem.progress === 0
      return isSameIsland && isGoingToSameDestination && !justStarted
    }).length > 0

  return [
    ...validateAction(actionType, game, islandId, NumVoyagers[actionType]),
    {
      met: !isAlreadyGoing,
      text: isAlreadyGoing ? `already voyaging` : ''
    }
  ]
}

const validateAddPerson = (game, islandId) => {
  const { islands, progressItems } = game
  const actionType = ActionTypes.AddPerson
  const island = islands[islandId]
  const { population, bonusPopulation, hasSettlement } = island
  const islandLocation = ScattershellLocations[islandId]

  const maxPopulation = IslandMaxPopulations[islandLocation.type]
  const totalPopulationLimit = bonusPopulation + maxPopulation

  // include population in progress
  const queuedPopulation = progressItems.filter(progressItem => {
    return (
      progressItem.actionType === actionType &&
      progressItem.islandName === islandId
    )
  }).length // assumes 1 person per action

  const maxPopulationReached =
    population + queuedPopulation === totalPopulationLimit

  return [
    ...validateAction(actionType, game, islandId),
    {
      met: !maxPopulationReached,
      text: maxPopulationReached ? 'max population reached' : ''
    },
    {
      met: hasSettlement,
      text: !hasSettlement ? 'no settlement' : ''
    }
  ]
}

const validateAddDwelling = (game, islandId) => {
  const actionType = ActionTypes.AddDwelling
  const { islands, progressItems } = game
  const island = islands[islandId]
  const { numDwellings, hasSettlement } = island
  const inProgress = progressItems.filter(
    progressItem =>
      progressItem.actionType === actionType &&
      progressItem.islandName === islandId
  ).length // assumes 1 dwelling per action

  const isMaxDwellings = numDwellings + inProgress === MaxDwellings
  return [
    ...validateAction(ActionTypes.AddDwelling, game, islandId),
    {
      met: !isMaxDwellings,
      text: isMaxDwellings ? 'max dwellings built here' : ''
    },
    {
      met: hasSettlement,
      text: !hasSettlement ? 'no settlement' : ''
    }
  ]
}

const validateAddSettlement = (game, islandId) => {
  const { progressItems } = game
  const actionType = ActionTypes.AddSettlement
  const inProgress =
    progressItems.filter(
      progressItem =>
        progressItem.actionType === actionType &&
        progressItem.islandName === islandId
    ).length === 1

  return [
    ...validateAction(
      ActionTypes.AddSettlement,
      game,
      islandId,
      SettlementRequiredPeople
    ),
    {
      met: !inProgress,
      text: inProgress ? 'settlement in progress' : ''
    }
  ]
}

const validateAddTemple = (game, islandId) => {
  const { progressItems } = game
  const actionType = ActionTypes.AddTemple
  const inProgress =
    progressItems.filter(
      progressItem =>
        progressItem.actionType === actionType &&
        progressItem.islandName === islandId
    ).length === 1

  return [
    ...validateAction(ActionTypes.AddTemple, game, islandId),
    {
      met: !inProgress,
      text: inProgress ? 'temple in progress' : ''
    }
  ]
}

// todo requires settlement
const validateAddGarden = (game, islandId) => {
  const { islands, progressItems } = game
  const island = islands[islandId]
  const { resources, numGardens } = island

  // include any gardens in progress
  const actionType = ActionTypes.AddGarden
  const inProgressGardens = progressItems.filter(
    progressItem =>
      progressItem.actionType === actionType &&
      progressItem.islandName === islandId
  ).length

  const isMaxGardens = numGardens + inProgressGardens === MaxGardens

  // make sure the island has at least one horticultural resource
  const hasHorticulturalResources =
    resources.filter(res => IsGardenFood[res]).length > 0

  return [
    ...validateAction(ActionTypes.AddGarden, game, islandId, 5),
    {
      met: !isMaxGardens,
      text: isMaxGardens ? 'max gardens planted here' : ''
    },
    {
      met: hasHorticulturalResources,
      text: hasHorticulturalResources
        ? 'island has horticultural resources ✔'
        : 'no horticultural resources here'
    }
  ]
}

export {
  validateAddDwelling,
  validateAddGarden,
  validateAddPerson,
  validateAddSettlement,
  validateAddTemple,
  validateLaunch
}
