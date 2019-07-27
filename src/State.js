import { WoodPerResources, FoodPerResources } from './Resources'
import { ScattershellLocations } from './Locations'
import { IslandMaxPopulations } from './IslandProperties'
import { MaxDwellings, NumVoyagers, calculateResourcesPerTick } from './Game'
import { Actions } from './Actions'

function spendEnergy(id) {
  return previous => {
    const { islands, player } = previous
    const island = islands[id]
    const { resources } = island
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

const addPerson = (islandName, fn) =>
  updateGameState(
    { foodΔ: -50 },
    previousIslands => {
      const island = previousIslands[islandName]
      const { population, bonusPopulation, hasSettlement } = island
      const islandLocation = ScattershellLocations[islandName]

      const maxPopulation = IslandMaxPopulations[islandLocation.type]
      const totalPopulationLimit = bonusPopulation + maxPopulation

      return population === totalPopulationLimit || !hasSettlement
        ? false
        : {
            ...previousIslands,
            [islandName]: {
              ...island,
              population: population + 1
            }
          }
    },
    fn
  )

const addDwelling = (islandName, fn) =>
  updateGameState(
    { woodΔ: -100 },
    previousIslands => {
      const island = previousIslands[islandName]
      const { numDwellings, bonusPopulation, hasSettlement } = island

      return numDwellings === MaxDwellings || !hasSettlement
        ? false
        : {
            ...previousIslands,
            [islandName]: {
              ...island,
              numDwellings: numDwellings + 1,
              bonusPopulation: bonusPopulation + 5
            }
          }
    },
    fn
  )

const addSettlement = (islandName, fn) =>
  updateGameState(
    { woodΔ: -250 },
    previousIslands => {
      const island = previousIslands[islandName]
      const { population } = island
      // requires 5 people on the island
      return population < 5
        ? false
        : {
            ...previousIslands,
            [islandName]: {
              ...island,
              hasSettlement: true
            }
          }
    },
    fn
  )

/*
  when an island is discovered via voyage, the voyaging people seed the island's population.
  - unless the destination is a rocky island, in which case the people are lost.
  - a fleet of people is needed to establish a settlement.
  - a settlement allows the population to be increased by clicking 'add person'
  - the safe choice is to launch an outrigger first to scout, then a fleet to populate 
  
*/
function arriveVoyage(voyage) {
  const { fromName, toName, numPeople } = voyage
  return updateGameState(
    {},
    previousIslands => {
      const previousTo = previousIslands[toName]
      const previousFrom = previousIslands[fromName] || { scatterings: [] }

      // ensure we don't go over the max population of the destination
      const toLocation = ScattershellLocations[toName]
      const { maxPopulation } = toLocation
      const { bonusPopulation } = previousTo

      const totalPopulationLimit = bonusPopulation + maxPopulation
      const maxPop = previousTo.population + numPeople >= totalPopulationLimit
      return {
        ...previousIslands,
        [toName]: {
          ...previousTo,
          isDiscovered: true,
          scatterings: previousFrom.scatterings,
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
      windΔ = Math.min(100,Math.floor(Math.random() * 21) - 10)

    Object.entries(islands)
      .filter(([id, island]) => island.isDiscovered && island.population > 0)
      .forEach(([id, island]) => {
        let hasGatherers = island.population >= 5
        foodΔ += calculateResourcesPerTick('food', id, hasGatherers)
        woodΔ += calculateResourcesPerTick('wood', id, hasGatherers)
        foodΔ -= island.population
      })

    fn({ foodΔ, woodΔ, energyΔ, windΔ })

    const newWood = wood + woodΔ,
      newFood = food + foodΔ,
      newEnergy = energy + energyΔ,
      newWind = wind + windΔ

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

function launchVoyage(fromName, toName, actionType, fn) {
  const removePopulationFrom = previousIslands => {
    // remove the population
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

  return updateGameState(cost, removePopulationFrom, fn)
}

export {
  spendEnergy,
  addPerson,
  addDwelling,
  addSettlement,
  gameTick,
  worldTick,
  launchVoyage,
  arriveVoyage
}
