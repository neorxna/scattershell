import {DevelopmentLevel, IslandMaxPopulations} from './IslandProperties'

const developmentLevelForIsland = island => {
  // max population reached and treasures found
  if (island.numTreasures === 10 && island.hasTemple) {
    return DevelopmentLevel.Advanced
  }
  if (island.hasTemple || island.numTreasures > 5) {
    return DevelopmentLevel.HighlyDeveloped
  }
  // max population reached
  if (island.population === IslandMaxPopulations[island.type]) {
    return DevelopmentLevel.Developed
  }
  //max population not yet reached
  if (island.population > 5) {
    return DevelopmentLevel.Burgeoning
  }
  return DevelopmentLevel.Undeveloped
}

const Actions = {
  LaunchOutrigger: 'outrigger',
  LaunchSmallFleet: 'small fleet',
  LaunchLargeFleet: 'large fleet'
}

const ActionCosts = {
  [Actions.LaunchOutrigger]: {
    woodΔ: -25,
    foodΔ: -50,
    energyΔ: 0
  },
  [Actions.LaunchSmallFleet]: {
    woodΔ: -50,
    foodΔ: -250,
    energyΔ: 0
  },
  [Actions.LaunchLargeFleet]: {
    woodΔ: -100,
    foodΔ: -500,
    energyΔ: 0
  }
}

const initialIslandState = {
  population: 0,
  hasTemple: false,
  isDiscovered: false,
  boonsAndBurdens: [],
  numDwellings: 0,
  numTreasures: 0
}


export { developmentLevelForIsland, ActionCosts, Actions, initialIslandState }