import { IslandMaxPopulations } from './IslandProperties'
import { MaxDwellings, MaxGardens, SettlementRequiredPeople } from './Game'
import { ActionCosts, ActionTypes } from './Actions'

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

const validateLaunchOutrigger = (game, islandId, task) =>
  validateAction(ActionTypes.LaunchOutrigger, game, islandId, 2)

const validateLaunchFleet = (game, islandId, task) =>
  task.isBeginning
    ? [{ met: true }]
    : validateAction(ActionTypes.LaunchFleet, game, islandId, 5)

const validateAddPerson = (game, islandId) => {
  const { islands } = game
  const island = islands[islandId]
  const { type, population } = island
  const maxPopulationReached = population === IslandMaxPopulations[type]
  // todo settlement required
  return [
    ...validateAction(ActionTypes.AddPerson, game, islandId),
    {
      met: !maxPopulationReached,
      text: maxPopulationReached ? 'max population reached' : ''
    }
  ]
}

const validateAddDwelling = (game, islandId) => {
  const { islands } = game
  const island = islands[islandId]
  const { numDwellings } = island
  const isMaxDwellings = numDwellings === MaxDwellings
  return [
    ...validateAction(ActionTypes.AddDwelling, game, islandId),
    {
      met: !isMaxDwellings,
      text: isMaxDwellings ? 'max dwellings built here' : ''
    }
  ]
}

const validateAddSettlement = (game, islandId) =>
  validateAction(ActionTypes.AddSettlement, game, islandId, SettlementRequiredPeople)

// todo requires settlement
const validateAddTemple = (game, islandId) =>
  validateAction(ActionTypes.AddTemple, game, islandId)

// todo requires settlement
const validateAddGarden = (game, islandId) => {
  const { islands } = game
  const island = islands[islandId]
  const { numGardens } = island
  const isMaxGardens = numGardens === MaxGardens
  return [
    ...validateAction(ActionTypes.AddGarden, game, islandId, 5),
    {
      met: !isMaxGardens,
      text: isMaxGardens ? 'max gardens planted here' : ''
    }
  ]
}

export {
  validateAddDwelling,
  validateAddGarden,
  validateAddPerson,
  validateAddSettlement,
  validateAddTemple,
  validateLaunchFleet,
  validateLaunchOutrigger
}
