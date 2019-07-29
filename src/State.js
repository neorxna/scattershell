import {
  WoodPerResources,
  FoodPerResources,
  IsDispersible,
  IsGardenFood
} from './Resources'
import { ScattershellLocations } from './Locations'
import { IslandMaxPopulations } from './IslandProperties'
import {
  MaxDwellings,
  MaxGardens,
  NumVoyagers,
  calculateResourcesPerTick,
  randomChoice,
  SettlementRequiredPeople
} from './Game'
import { Actions, ActionTypes, ActionCosts } from './Actions'

function spendEnergy(id, task, fn) {
  return previous => {
    const { player } = previous
    const location = ScattershellLocations[id]
    const { resources } = location
    const { energy, food, wood } = player

    const foodScore = resources.reduce(
      (sum, resource) => sum + FoodPerResources[resource],
      0
    )
    const woodScore = resources.reduce(
      (sum, resource) => sum + WoodPerResources[resource],
      0
    )

    const playerUpdate = {
      ...player,
      food: food + foodScore * energy,
      wood: wood + woodScore * energy,
      energy: 0
    }

    return {
      ...previous,
      player: playerUpdate
    }
  }
}

function updateGameState(resourceChanges, islandUpdateFn, willSpend, free) {
  return previous => {
    const { woodΔ, foodΔ, energyΔ, windΔ } = resourceChanges
    const { player, islands, world } = previous
    const { wood, food, wind, energy } = player

    // for negative Δs, only update if we have enough
    const check = (x, Δ) => {
      let bad = x + Δ < 0
      return bad || Δ == undefined ? x : x + Δ
    }

    const updatedPlayer = {
      wood: check(wood, woodΔ),
      food: check(food, foodΔ),
      wind: Math.min(check(wind, windΔ), 100), // 100 = max wind
      energy: check(energy, energyΔ)
    }

    const insufficient =
      (woodΔ && updatedPlayer.wood === wood) ||
      (foodΔ && updatedPlayer.food === food) ||
      (windΔ && updatedPlayer.wind === wind) ||
      (energyΔ && updatedPlayer.energy === energy)

    let playerUpdate = { ...player, ...(updatedPlayer || {}) }
    let abort = islandUpdateFn != undefined && islandUpdateFn(islands) === false

    let islandsUpdate =
      islandUpdateFn == undefined ? islands : islandUpdateFn(islands)

    if (!insufficient && willSpend != undefined && !abort) willSpend()
    let update = {
      ...previous,
      player: playerUpdate,
      islands: islandsUpdate
    }

    // if all required amounts were spent, or the txn is free, apply the update
    return (!insufficient || free) && !abort ? update : previous
  }
}

const islandProperty = (islandName, updateFn) => {
  return previousIslands => {
    const island = previousIslands[islandName]
    const update = updateFn(island)
    return {
      ...previousIslands,
      [islandName]: {
        ...island,
        ...update
      }
    }
  }
}

const beginAddPerson = (islandName, task, fn) =>
  updateGameState(
    ActionCosts[ActionTypes.AddPerson],
    previousIslands => {
      const island = previousIslands[islandName]
      const { population, bonusPopulation, hasSettlement } = island
      const islandLocation = ScattershellLocations[islandName]

      const maxPopulation = IslandMaxPopulations[islandLocation.type]
      const totalPopulationLimit = bonusPopulation + maxPopulation

      return population === totalPopulationLimit || !hasSettlement
        ? false
        : previousIslands
    },
    fn
  )

const endAddPerson = islandName =>
  updateGameState(
    {},
    islandProperty(islandName, island => ({
      population: island.population + 1
    }))
  )

// TODO use action validators

const beginAddDwelling = (islandName, task, fn) =>
  updateGameState(
    ActionCosts[ActionTypes.AddDwelling],
    previousIslands => {
      const island = previousIslands[islandName]
      const { numDwellings, hasSettlement } = island

      return numDwellings === MaxDwellings || !hasSettlement
        ? false
        : previousIslands
    },
    fn
  )

const endAddDwelling = islandName =>
  updateGameState(
    {},
    islandProperty(islandName, ({ numDwellings, bonusPopulation }) => ({
      numDwellings: numDwellings + 1,
      bonusPopulation: bonusPopulation + 5
    }))
  )

const beginAddSettlement = (islandName, task, fn) =>
  updateGameState(
    ActionCosts[ActionTypes.AddSettlement],
    previousIslands => {
      const island = previousIslands[islandName]
      const { population } = island
      // requires N people on the island
      return population < SettlementRequiredPeople ? false : previousIslands
    },
    fn
  )

const endAddSettlement = (islandName, task) =>
  updateGameState(
    {},
    islandProperty(islandName, island => ({
      hasSettlement: true
    }))
  )

const beginAddTemple = (islandName, task, fn) =>
  updateGameState(
    ActionCosts[ActionTypes.AddTemple],
    previousIslands => {
      const island = previousIslands[islandName]
      const { population } = island
      // requires 5 people on the island
      return population < 5 ? false : previousIslands
    },
    fn
  )

const endAddTemple = islandName =>
  updateGameState(
    {},
    islandProperty(islandName, island => ({
      hasTemple: true
    }))
  )

// TODO generic begin validator
const beginAddGarden = (islandName, task, fn) =>
  updateGameState(
    ActionCosts[ActionTypes.AddGarden],
    previousIslands => {
      // requires 3 people and not islands > 5
      const island = previousIslands[islandName]
      const { numGardens } = island
      const isMaxGardens = numGardens === MaxGardens
      return isMaxGardens ? false : previousIslands
    },
    fn
  )

const endAddGarden = islandName =>
  updateGameState(
    {},
    islandProperty(islandName, island => {
      const { numGardens } = island
      return {
        numGardens: numGardens + 1
      }
    })
  )
/*
  when an island is discovered via voyage, the voyaging people seed the island's population.
  - unless the destination is a rocky island, in which case the people are lost.
  - a fleet of people is needed to establish a settlement.
  - a settlement allows the population to be increased by clicking 'add person'
  - the safe choice is to launch an outrigger first to scout, then a fleet to populate 
  
*/
function arriveVoyage(fromName, voyage) {
  const { toName, actionType } = voyage
  const numPeople = NumVoyagers[actionType]
  return updateGameState(
    {},
    previousIslands => {
      const previousTo = previousIslands[toName]
      const previousFrom = previousIslands[fromName] || {
        scatterings: [],
        resources: []
      }

      // ensure we don't go over the max population of the destination
      const toLocation = ScattershellLocations[toName]
      const maxPopulation = IslandMaxPopulations[toLocation.type]

      const { bonusPopulation } = previousTo
      const { resources } = previousFrom

      const totalPopulationLimit = bonusPopulation + maxPopulation
      const maxPop = previousTo.population + numPeople >= totalPopulationLimit

      // if there are any dispersible resources on the island and voyage is fleet,
      // transfer one at random to the destination island
      // only transfer resources that don't already exist on destination
      const dispersibleResources =
        actionType === ActionTypes.LaunchFleet
          ? resources.filter(
              resource =>
                IsDispersible[resource] &&
                previousTo.resources.indexOf(resource) === -1
            )
          : []

      const dispersed =
        dispersibleResources.length > 0 ? randomChoice(dispersibleResources) : null

      const toResources = [...previousTo.resources, dispersed].filter(
        x => x != null
      )

      return {
        ...previousIslands,
        [toName]: {
          ...previousTo,
          isDiscovered: true,
          resources: toResources,
          scatterings: [...previousFrom.scatterings],
          population: maxPop
            ? previousTo.population
            : previousTo.population + numPeople
        }
      }
    },
    null,
    true // free
  )
}

function gameTick(fn) {
  return previous => {
    const { player, islands } = previous
    const { wood, food, energy, wind } = player

    let foodΔ = 0,
      woodΔ = 0,
      energyΔ = 1,
      windΔ = Math.floor(Math.random() * 21) - 10

    // only give resources for discovered islands with at least one person
    Object.entries(islands)
      .filter(([id, island]) => island.isDiscovered && island.population > 0)
      .forEach(([id, island]) => {
        foodΔ += calculateResourcesPerTick('food', island)
        woodΔ += calculateResourcesPerTick('wood', island)
        foodΔ -= island.population
        // bonus energy if island has temple
        energyΔ += island.hasTemple ? 1 : 0
      })

    fn({ foodΔ, woodΔ, energyΔ, windΔ })

    const newWood = wood + woodΔ,
      newFood = food + foodΔ,
      newEnergy = energy + energyΔ,
      newWind = Math.min(100, wind + windΔ)

    // don't let anything go below zero
    return {
      ...previous,
      player: {
        ...player,
        wood: newWood < 0 ? 0 : newWood,
        food: newFood < 0 ? 0 : newFood,
        energy: newEnergy < 0 ? 0 : newEnergy,
        wind: newWind < 0 ? 0 : newWind
      }
    }
  }
}

const updateWorldState = worldFn => previous => {
  const { world } = previous
  return {
    ...previous,
    world: worldFn(world)
  }
}

const worldTick = () =>
  updateWorldState(previousWorld => {
    let { day, dayOfWeek, weekOfYear, year } = previousWorld
    return {
      day: day + 1,
      dayOfWeek: dayOfWeek === 7 ? 1 : dayOfWeek + 1, // 1-7
      weekOfYear:
        weekOfYear === 52 ? 1 : dayOfWeek === 7 ? weekOfYear + 1 : weekOfYear, // 1-52
      year: weekOfYear === 52 ? year + 1 : year
    }
  })

function launchVoyage(fromName, task, fn) {
  const { actionType, toName, isBeginning } = task

  const removePopulationFrom = previousIslands => {
    // remove the population from source island
    let previousFrom = previousIslands[fromName]
    let numVoyagers = NumVoyagers[actionType]
    let enough = previousFrom.population >= numVoyagers

    // make sure we have enough people on the fromIsland
    return enough
      ? {
          ...previousIslands,
          [fromName]: {
            ...previousFrom,
            population: previousFrom.population - numVoyagers
          }
        }
      : false
  }

  const { cost } = Actions[actionType]
  const voyageCost = isBeginning ? {} : cost
  const voyageUpdate = isBeginning ? x => x : removePopulationFrom
  return updateGameState(voyageCost, voyageUpdate, fn)
}

export {
  gameTick,
  worldTick,
  arriveVoyage,
  launchVoyage,
  spendEnergy,
  beginAddGarden,
  beginAddDwelling,
  beginAddPerson,
  beginAddSettlement,
  beginAddTemple,
  endAddDwelling,
  endAddPerson,
  endAddSettlement,
  endAddGarden,
  endAddTemple
}
