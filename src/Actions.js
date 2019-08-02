import { ScattershellLocations } from './Locations'
import {
  validateAddDwelling,
  validateAddGarden,
  validateAddPerson,
  validateAddSettlement,
  validateAddTemple,
  validateLaunch
} from './ActionValidation'
import * as State from './State'
import { IslandTypes } from './IslandProperties'

const ActionTypes = {
  LaunchOutrigger: 'outrigger voyage',
  LaunchFleet: 'fleet voyage',
  AddPerson: 'new child',
  AddDwelling: 'build dwelling',
  AddSettlement: 'raise settlement',
  AddGarden: 'plant garden',
  AddTemple: 'build temple',
  SpendEnergy: 'accept offerings'
}

const ActionCosts = {
  [ActionTypes.LaunchOutrigger]: {
    woodΔ: -25,
    foodΔ: -50,
    energyΔ: -10
  },
  [ActionTypes.LaunchFleet]: {
    woodΔ: -100,
    foodΔ: -200,
    energyΔ: -20
  },
  [ActionTypes.AddPerson]: {
    foodΔ: -50,
    energyΔ: -25
  },
  [ActionTypes.AddDwelling]: {
    woodΔ: -100
  },
  [ActionTypes.AddSettlement]: {
    woodΔ: -250
  },
  [ActionTypes.AddGarden]: {
    woodΔ: -500
  },
  [ActionTypes.AddTemple]: {
    woodΔ: -1000,
    foodΔ: -1000,
    energyΔ: -100
  }
}

const finishVoyage = actionInstance => {
  const { islandName, actionType, task } = actionInstance
  const { toName, destinationIsDiscovered } = task
  const { numPeople } = Actions[actionType]
  const to = ScattershellLocations[toName]
  const isInhospitable = to.type === IslandTypes.Rocks

  const successMsg = destinationIsDiscovered
    ? `The voyage disembarked safely.`
    : `A ${to.type} island was discovered!`

  const rocksMsg = `An inhospitable outcrop of rocks was encountered. The ${numPeople} voyagers perished.`
  const msg = `The voyage from ${islandName} arrived at ${toName}. ${
    isInhospitable ? rocksMsg : successMsg
  }`
  return msg
}

const getVoyageDuration = task => {
  const { islandName, toName, isBeginning } = task
  return isBeginning
    ? 10
    : ScattershellLocations[islandName].neighbourDistance[toName] * 10
}

const getVoyageName = task => {
  const {
    actionType,
    destinationIsDiscovered,
    islandName,
    toName,
    isBeginning
  } = task
  return isBeginning
    ? `Voyage to ${toName}`
    : `Voyage from ${islandName} to ${
        destinationIsDiscovered ? toName : 'an undiscovered land'
      }`
}

const Actions = {
  [ActionTypes.SpendEnergy]: {
    text: 'accept offerings',
    beginStateChange: State.spendEnergy,
    endStateChange: () => {},
    finishMessage: () => {},
    emoji: '⚡',
    validate: () => [{ met: true }],
    getDuration: () => {},
    getName: () => {},
    hidden: true // don't show in progress
  },
  [ActionTypes.LaunchOutrigger]: {
    text: 'launch outrigger',
    beginStateChange: State.launchVoyage,
    endStateChange: State.arriveVoyage,
    finishMessage: finishVoyage,
    emoji: '⛵',
    cost: ActionCosts[ActionTypes.LaunchOutrigger],
    validate: validateLaunch,
    getDuration: getVoyageDuration,
    getName: getVoyageName,
    numPeople: 2
  },
  [ActionTypes.LaunchFleet]: {
    text: 'launch fleet',
    beginStateChange: State.launchVoyage,
    endStateChange: State.arriveVoyage,
    finishMessage: finishVoyage,
    emoji: '⛵',
    cost: ActionCosts[ActionTypes.LaunchFleet],
    validate: validateLaunch,
    getDuration: getVoyageDuration,
    getName: getVoyageName,
    numPeople: 5
  },
  [ActionTypes.AddPerson]: {
    text: 'spawn person',
    beginStateChange: State.beginAddPerson,
    endStateChange: State.endAddPerson,
    emoji: '👶',
    finishMessage: ({ islandName }) => `a child was born in ${islandName}!`,
    cost: ActionCosts[ActionTypes.AddPerson],
    validate: validateAddPerson,
    getDuration: () => 20,
    getName: task => `person`
  },
  [ActionTypes.AddDwelling]: {
    text: 'build dwelling',
    emoji: '🏠',
    cost: ActionCosts[ActionTypes.AddDwelling],
    beginStateChange: State.beginAddDwelling,
    endStateChange: State.endAddDwelling,
    finishMessage: ({ islandName }) => `a dwelling was built in ${islandName}!`,
    // todo settlement required
    validate: validateAddDwelling,
    getDuration: () => 20,
    getName: task => `dwelling`
  },
  [ActionTypes.AddSettlement]: {
    // todo already has settlement
    text: 'raise settlement',
    beginStateChange: State.beginAddSettlement,
    endStateChange: State.endAddSettlement,
    emoji: '🏠',
    finishMessage: ({ islandName }) => {
      return `a settlement was raised in ${islandName}!`
    },
    cost: ActionCosts[ActionTypes.AddSettlement],
    validate: validateAddSettlement,
    getDuration: () => 40,
    getName: task => `settlement`
  },

  [ActionTypes.AddGarden]: {
    text: 'plant garden',
    beginStateChange: State.beginAddGarden,
    endStateChange: State.endAddGarden,
    emoji: '🥬',
    finishMessage: ({ islandName }) => `a garden was planted in ${islandName}!`,
    cost: ActionCosts[ActionTypes.AddGarden],
    validate: validateAddGarden,
    getDuration: () => 40,
    getName: task => `garden`
  },

  [ActionTypes.AddTemple]: {
    text: 'build temple',
    emoji: '🙏',
    beginStateChange: State.beginAddTemple,
    endStateChange: State.endAddTemple,
    cost: ActionCosts[ActionTypes.AddGarden],
    finishMessage: ({ islandName }) => `a temple was built in ${islandName}!`,
    validate: validateAddTemple,
    getDuration: () => 100,
    getName: task => `temple`
  }
}

export { Actions, ActionCosts, ActionTypes }
