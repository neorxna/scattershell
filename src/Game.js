import { DevelopmentLevel, IslandMaxPopulations } from './IslandProperties'
import { ScattershellLocations } from './Locations'
import {
  WoodPerResources,
  FoodPerResources,
  RequiresGathering,
  ResourceTypes,
  IsGardenFood
} from './Resources'
import { ActionTypes } from './Actions'

const randomChoice = x => x[Math.floor(Math.random() * x.length)]
const SettlementRequiredPeople = 2

function developmentLevelForIsland(island) {
  // max population reached and treasures found
  /*if (island.numTreasures === 10 && island.hasTemple) {
    return DevelopmentLevel.Advanced
  }
  if (island.hasTemple || island.numTreasures > 5) {
    return DevelopmentLevel.HighlyDeveloped
  }*/

  const { hasTemple, numGardens, population, numDwellings } = island

  if (hasTemple && numGardens === MaxGardens && numDwellings === MaxDwellings) {
    return DevelopmentLevel.Advanced
  }

  // max population reached
  if (population === IslandMaxPopulations[island.type]) {
    return DevelopmentLevel.Developed
  }
  //max population not yet reached
  if (population >= 5) {
    return DevelopmentLevel.Burgeoning
  }
  return DevelopmentLevel.Undeveloped
}

function calculateResourcesPerTick(resourceType, island) {
  const { population, resources, numGardens } = island
  const PerResourcesForResourceType = {
    wood: WoodPerResources,
    food: FoodPerResources
  }
  const hasGatherers = population >= 5
  const PerResources = PerResourcesForResourceType[resourceType]

  // for every garden, add a point for horticultural resources
  const getsGuanoBonus =
    resources.filter(resource => resource === ResourceTypes.Guano).length > 0

  return population === 0
    ? 0
    : resources.reduce((total, resource) => {
        const horitculturalBonus = IsGardenFood[resource] ? numGardens : 0
        const guanoBonus = horitculturalBonus > 0 && getsGuanoBonus ? 2 : 0
        return (
          total +
          (!RequiresGathering[resource] ||
          (RequiresGathering[resource] && hasGatherers)
            ? PerResources[resource] + horitculturalBonus + guanoBonus
            : 0)
        )
      }, 0)
}

const islandsDetails = islands => {
  const islandNames = Object.keys(ScattershellLocations)
  return islandNames.reduce((obj, key) => {
    const loc = ScattershellLocations[key]
    const state = islands ? islands[key] : {}
    return { ...obj, [key]: { ...loc, ...state } }
  }, {})
}

const StartingLocation = ScattershellLocations.Morrigan.name

const NumVoyagers = {
  [ActionTypes.LaunchOutrigger]: 2,
  [ActionTypes.LaunchFleet]: 5
}

const Seasons = {
  Winter: 'winter',
  Spring: 'spring',
  Summer: 'summer',
  Harvest: 'harvest'
}

const initialIslandState = islandId => ({
  population: 0,
  hasTemple: false,
  hasSettlement: false,
  isDiscovered: false,
  scatterings: [],
  resources: ScattershellLocations[islandId].resources,
  numDwellings: 0,
  numTreasures: 0,
  bonusPopulation: 0,
  numGardens: 0
})

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
    (obj, islandId) => ({ ...obj, [islandId]: initialIslandState(islandId) }),
    {}
  ),
  player: InitialPlayerState,
  world: InitialWorldState
}

const MaxDwellings = 5
const MaxGardens = 5

export {
  randomChoice,
  developmentLevelForIsland,
  islandsDetails,
  calculateResourcesPerTick,
  InitialGameState,
  MaxDwellings,
  MaxGardens,
  Seasons,
  NumVoyagers,
  StartingLocation,
  SettlementRequiredPeople
}
