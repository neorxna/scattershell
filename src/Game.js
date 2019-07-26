import { DevelopmentLevel, IslandMaxPopulations } from './IslandProperties'

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
  if (island.population >= 5) {
    return DevelopmentLevel.Burgeoning
  }
  return DevelopmentLevel.Undeveloped
}

const Actions = {
  LaunchOutrigger: 'outrigger',
  LaunchFleet: 'fleet'
}

const Seasons = {
  Rainy: 'rainy season',
  Dry: 'dry season'
}

const ActionCosts = {
  [Actions.LaunchOutrigger]: {
    woodΔ: -25,
    foodΔ: -50,
    energyΔ: -10
  },
  [Actions.LaunchFleet]: {
    woodΔ: -100,
    foodΔ: -200,
    energyΔ: -20
  }
}

const InitialIslandState = {
  population: 0,
  hasTemple: false,
  hasSettlement: false,
  isDiscovered: false,
  scatterings: [],
  numDwellings: 0,
  numTreasures: 0,
  bonusPopulation: 0
}

const InitialPlayerState = {
  wood: 0,
  food: 0,
  wind: 0,
  energy: 0
}

const InitialWorldState = {
  day: 1,
  dayOfWeek: 1, // 1-7
  weekOfYear: 1, // 1-52
  season: Seasons.Rainy,
  year: 1
}

const MaxDwellings = 5

export {
  Seasons,
  developmentLevelForIsland,
  ActionCosts,
  Actions,
  InitialIslandState,
  InitialPlayerState,
  InitialWorldState,
  MaxDwellings
}
