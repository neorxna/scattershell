const ActionTypes = {
  LaunchOutrigger: 'launch outrigger',
  LaunchFleet: 'launch fleet',
  AddPerson: 'new child',
  AddDwelling: 'build dwelling',
  AddSettlement: 'build settlement',
  AddGarden: 'plant garden'
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
    energyΔ: -25,
  },
  [ActionTypes.AddDwelling]: {
    woodΔ: -100,
  },
  [ActionTypes.AddSettlement]: {
    woodΔ: -250,
  },
  [ActionTypes.AddGarden]: {
    woodΔ: -500
  },
}

const Actions = {
  [ActionTypes.LaunchOutrigger]: {
    text: 'outrigger launched',
    emoji: '⛵',
    cost: ActionCosts[ActionTypes.LaunchOutrigger]
  },
  [ActionTypes.LaunchFleet]: {
    text: 'fleet launched',
    emoji: '⛵',
    cost: ActionCosts[ActionTypes.LaunchFleet]
  },
  [ActionTypes.AddPerson]: {
    text: 'child born',
    emoji: '',
    cost: ActionCosts[ActionTypes.AddPerson]
  },
  [ActionTypes.AddDwelling]: {
    text: 'dwelling built',
    emoji: '',
    cost: ActionCosts[ActionTypes.AddDwelling]
  },
  [ActionTypes.AddSettlement]: {
    text: 'settlement built',
    emoji: '',
    cost: ActionCosts[ActionTypes.AddSettlement]
  },
  [ActionTypes.AddGarden]: {
    text: 'garden planted',
    emoji: '',
    cost: ActionCosts[ActionTypes.AddGarden]
  }
}

export { Actions, ActionCosts, ActionTypes }