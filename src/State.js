import {
  WoodPerResources,
  FoodPerResources,
  IsDispersible,
  IsGardenFood
} from './Resources'
import { IslandMaxPopulations } from './IslandProperties'
import { ScattershellLocations } from './Locations'
import { NumVoyagers, calculateResourcesPerTick, randomChoice } from './Game'
import { Actions, ActionTypes, ActionCosts } from './Actions'
import * as ActionValidators from './ActionValidation'

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

    const playerUpdate = { ...player, ...(updatedPlayer || {}) }
    const islandUpdateFnRes =
      islandUpdateFn != undefined && islandUpdateFn(previous)
    const abort = islandUpdateFnRes === false
    const islandsUpdate =
      islandUpdateFn == undefined ? islands : islandUpdateFnRes

    if (!insufficient && willSpend != undefined && !abort) willSpend()

    const update = {
      ...previous,
      player: playerUpdate,
      islands: islandsUpdate
    }

    // if all required amounts were spent, or the txn is free, apply the update
    return (!insufficient || free) && !abort ? update : previous
  }
}

const islandProperty = (islandId, updateFn) => {
  return game => {
    const { islands } = game
    const island = islands[islandId]
    const update = updateFn(island)
    return {
      ...islands,
      [islandId]: {
        ...island,
        ...update
      }
    }
  }
}

const actionPermitted = validations =>
  validations.filter(({ met }) => !met).length === 0

const beginAddPerson = (islandId, task, willSpendFn) =>
  updateGameState(
    ActionCosts[ActionTypes.AddPerson],
    game => {
      const validations = ActionValidators.validateAddPerson(game, islandId)
      const permitted = actionPermitted(validations)
      return permitted ? game.islands : false
    },
    willSpendFn
  )

const endAddPerson = islandId =>
  updateGameState(
    {},
    islandProperty(islandId, island => ({
      population: island.population + 1
    }))
  )

// TODO use action validators

const beginAddDwelling = (islandId, task, willSpendFn) =>
  updateGameState(
    ActionCosts[ActionTypes.AddDwelling],
    game => {
      const validations = ActionValidators.validateAddDwelling(game, islandId)
      const permitted = actionPermitted(validations)
      return permitted ? game.islands : false
    },
    willSpendFn
  )

const endAddDwelling = islandId =>
  updateGameState(
    {},
    islandProperty(islandId, ({ numDwellings, bonusPopulation }) => ({
      numDwellings: numDwellings + 1,
      bonusPopulation: bonusPopulation + 5
    }))
  )

const beginAddSettlement = (islandId, task, willSpendFn) =>
  updateGameState(
    ActionCosts[ActionTypes.AddSettlement],
    game => {
      const validations = ActionValidators.validateAddSettlement(game, islandId)
      const permitted = actionPermitted(validations)
      return permitted ? game.islands : false
    },
    willSpendFn
  )

const endAddSettlement = (islandId, task) =>
  updateGameState(
    {},
    islandProperty(islandId, island => ({
      hasSettlement: true
    }))
  )

const beginAddTemple = (islandId, task, willSpendFn) =>
  updateGameState(
    ActionCosts[ActionTypes.AddTemple],
    game => {
      const validations = ActionValidators.validateAddTemple(game, islandId)
      const permitted = actionPermitted(validations)
      return permitted ? game.islands : false
    },
    willSpendFn
  )

const endAddTemple = islandId =>
  updateGameState(
    {},
    islandProperty(islandId, island => ({
      hasTemple: true
    }))
  )

const beginAddGarden = (islandId, task, willSpendFn) =>
  updateGameState(
    ActionCosts[ActionTypes.AddGarden],
    game => {
      const validations = ActionValidators.validateAddGarden(game, islandId)
      const permitted = actionPermitted(validations)
      return permitted ? game.islands : false
    },
    willSpendFn
  )

const endAddGarden = islandId =>
  updateGameState(
    {},
    islandProperty(islandId, island => {
      const { numGardens } = island
      return {
        numGardens: numGardens + 1
      }
    })
  )

const updateNothing = x => x.islands

function launchVoyage(islandId, task) {
  const { actionType, isBeginning } = task

  const removePopulationFrom = game => {
    const { islands } = game
    const island = islands[islandId]
    // make sure we can remove the population from source island
    const validations = ActionValidators.validateLaunch(game, islandId, task)
    const permitted = actionPermitted(validations)

    const numVoyagers = NumVoyagers[actionType]
    const islandsUpdate = {
      ...islands,
      [islandId]: {
        ...island,
        population: island.population - numVoyagers
      }
    }
    return permitted ? islandsUpdate : false
  }

  const { cost } = Actions[actionType]
  const voyageCost = isBeginning ? {} : cost
  const voyageUpdate = isBeginning ? updateNothing : removePopulationFrom
  return updateGameState(voyageCost, voyageUpdate)
}

/*
  when an island is discovered via voyage, the voyaging people seed the island's population.
  - unless the destination is a rocky island, in which case the people are lost.
  - a fleet of people is needed to establish a settlement.
  - a settlement allows the population to be increased by clicking 'add person'
  - the safe choice is to launch an outrigger first to scout, then a fleet to populate 
*/
function arriveVoyage(fromName, task) {
  const { toName, actionType, isBeginning } = task
  const numPeople = NumVoyagers[actionType]
  return updateGameState(
    {},
    game => {
      const { islands } = game
      const toIsland = islands[toName]
      const fromIsland = islands[fromName] || {
        scatterings: [],
        resources: []
      }

      // if there are any dispersible resources on the island and voyage is fleet,
      // transfer one at random to the destination island
      // only transfer resources that don't already exist on destination
      const { resources } = fromIsland
      const dispersibleResources =
        actionType === ActionTypes.LaunchFleet
          ? resources.filter(
              resource =>
                IsDispersible[resource] &&
                toIsland.resources.indexOf(resource) === -1
            )
          : []

      const dispersed =
        dispersibleResources.length > 0
          ? randomChoice(dispersibleResources)
          : null

      const toResources = [...toIsland.resources, dispersed].filter(
        x => x != null
      )

      const toLocation = ScattershellLocations[toName]
      const toMaxPopulation = IslandMaxPopulations[toLocation.type]
      const toTotalPopulationLimit = toIsland.bonusPopulation + toMaxPopulation

      const newPopulation = toIsland.population + numPeople
      const newPopulationLimited =
        newPopulation > toTotalPopulationLimit
          ? toTotalPopulationLimit
          : newPopulation

      return {
        ...islands,
        [toName]: {
          ...toIsland,
          isDiscovered: true,
          resources: toResources,
          scatterings: [...toIsland.scatterings],
          population: newPopulationLimited
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
