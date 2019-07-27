import { DevelopmentLevel, IslandMaxPopulations } from './IslandProperties'
import { ScattershellLocations } from './Locations'
import {
  WoodPerResources,
  FoodPerResources,
  RequiresGathering
} from './Resources'
import { ActionTypes } from './Actions'

function developmentLevelForIsland(island) {
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

function calculateResourcesPerTick(resourceType, id, hasGatherers) {
  const PerResources = PerResourcesForResourceType[resourceType]
  const { resources } = ScattershellLocations[id]
  return resources.reduce(
    (total, resource) =>
      total +
      (!RequiresGathering[resource] ||
      (RequiresGathering[resource] && hasGatherers)
        ? PerResources[resource]
        : 0),
    0
  )
}

const islandsDetails = islands => {
  const islandNames = Object.keys(ScattershellLocations)

  return islandNames.reduce((obj, key) => {
    const loc = ScattershellLocations[key]
    const state = islands ? islands[key] : {}
    return {...obj, [key]: {...loc, ...state}}
    /*const state = islands[key]
    return {
      ...obj,
      [key]: { ...loc, ...(state || {}) }
    }*/
  }, {})
}

const StartingLocation = ScattershellLocations.Morrigan.name

const NumVoyagers = {
  [ActionTypes.LaunchOutrigger]: 2,
  [ActionTypes.LaunchFleet]: 5
}

const PerResourcesForResourceType = {
  wood: WoodPerResources,
  food: FoodPerResources
}

const Seasons = {
  Winter: 'winter',
  Spring: 'spring',
  Summer: 'summer',
  Harvest: 'harvest'
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

const InitialGameState = {
  islands: Object.keys(ScattershellLocations).reduce(
    (obj, key) => ({ ...obj, [key]: InitialIslandState }),
    {}
  ),
  player: InitialPlayerState,
  world: InitialWorldState
}

const MaxDwellings = 5

export {
  developmentLevelForIsland,
  islandsDetails,
  calculateResourcesPerTick,
  InitialGameState,
  MaxDwellings,
  Seasons,
  NumVoyagers,
  StartingLocation
}
