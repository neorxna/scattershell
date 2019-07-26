import React, { useState, useRef, useEffect } from 'react'
import { Fabric, registerIcons, loadTheme } from 'office-ui-fabric-react'

import './App.css'
import { CurrentIsland } from './Island'
import ScattershellLocations from './Locations'
import ScattershellMap from './Map'
import { fabricIcons, fabricTheme, Colors } from './Theme'
import {
  ResourceTypes,
  RequiresGathering,
  FoodPerResources,
  WoodPerResources
} from './Resources'
import {
  Seasons,
  Actions,
  ActionCosts,
  InitialIslandState,
  InitialPlayerState,
  InitialWorldState,
  MaxDwellings
} from './Game'
import { IslandTypes, IslandMaxPopulations } from './IslandProperties'

const VERSION = '0.6'
const START_LOCATION = ScattershellLocations.Morrigan.name
const intervalDuration = 500

const json = _ => JSON.stringify(_, undefined, 4)

registerIcons(fabricIcons)
loadTheme(fabricTheme)

/* https://overreacted.io/making-setinterval-declarative-with-react-hooks/ */
function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

function App() {
  const [count, setCount] = useState(0)
  const [count100, setCount100] = useState(0)
  const [messages, setMessages] = useState([])

  const [deltas, setDeltas] = useState({
    woodΔ: 0,
    foodΔ: 0,
    energyΔ: 0,
    windΔ: 0
  })

  const [progressItems, setProgressItems] = useState([])
  const [gameState, setGameState] = useState({
    islands: Object.keys(ScattershellLocations).reduce(
      (obj, key) => ({ ...obj, [key]: InitialIslandState }),
      {}
    ),
    player: InitialPlayerState,
    world: InitialWorldState
  })

  const { wind, wood, food, energy } = gameState.player

  // the island that is currently being viewed.
  const [currentIsland, setCurrentIsland] = useState(START_LOCATION)

  const islandsWithStates = () =>
    Object.keys(ScattershellLocations).reduce(
      (obj, key) => ({
        ...obj,
        [key]: { ...ScattershellLocations[key], ...gameState.islands[key] }
      }),
      {}
    )

  useEffect(() => {
    /* Game launch */
    // discover the starting island
    launchVoyage('Home', START_LOCATION, Actions.LaunchFleet, true)
  }, [])

  // helper function to update nested state
  const updateGameState = (
    resourceChanges,
    islandUpdateFn,
    willSpend,
    free
  ) => {
    setGameState(previous => {
      let { woodΔ, foodΔ, energyΔ, windΔ } = resourceChanges

      // for negative Δs, only update if we have enough
      const check = (x, Δ) => {
        let bad = x + Δ < 0
        return bad || Δ == undefined ? x : x + Δ
      }

      let player = {
        wood: check(previous.player.wood, woodΔ),
        food: check(previous.player.food, foodΔ),
        wind: Math.min(check(previous.player.wind, windΔ), 100), // 100 = max wind
        energy: check(previous.player.energy, energyΔ)
      }

      let insufficient =
        (woodΔ && player.wood === previous.player.wood) ||
        (foodΔ && player.food === previous.player.food) ||
        (windΔ && player.wind === previous.player.wind) ||
        (energyΔ && player.energy === previous.player.energy)

      let playerUpdate = { ...previous.player, ...(player || {}) }
      let abort =
        islandUpdateFn != undefined &&
        islandUpdateFn(previous.islands) === false

      let islandsUpdate =
        islandUpdateFn == undefined
          ? previous.islands
          : islandUpdateFn(previous.islands)

      let worldUpdate = previous.world

      if (!insufficient && willSpend != undefined && !abort) willSpend()

      let update = {
        player: playerUpdate,
        islands: islandsUpdate,
        world: worldUpdate
      }

      // if all required amounts were spent, or the txn is free, apply the update
      return (!insufficient || free) && !abort ? update : previous
    })
  }

  const postMessage = msg =>
    setMessages(previous => [...previous, { live: 10, text: msg }])

  const setDiscovered = voyage => {
    /*
    when an island is discovered via voyage, the voyaging people seed the island's population.
    - unless the destination is a rocky island, in which case the people are lost.
    - a fleet of people is needed to establish a settlement.
    - a settlement allows the population to be increased by clicking 'add person'
    - the safe choice is to launch an outrigger first to scout, then a fleet to populate 
    
    */
    const { fromName, toName, numPeople, actiontype } = voyage
    const to = ScattershellLocations[toName]
    const isInhospitable = to.type === IslandTypes.Rocks

    const successMsg = `A ${to.type} island was encountered!`
    const rocksMsg = `An inhospitable outcrop of rocks was encountered. The ${numPeople} voyagers perished.`
    const msg = `The ${actiontype} voyage from ${fromName} arrived at ${toName}. ${
      isInhospitable ? rocksMsg : successMsg
    }`
    postMessage(msg)

    updateGameState(
      {},
      previousIslands => {
        let previousTo = previousIslands[toName]
        let previousFrom = previousIslands[fromName] || { scatterings: [] }
        return {
          ...previousIslands,
          [toName]: {
            ...previousTo,
            isDiscovered: true,
            scatterings: previousFrom.scatterings,
            population: isInhospitable ? 0 : previousTo.population + numPeople
          }
        }
      },
      null,
      true // free
    )
  }

  const addPerson = islandName => {
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
      () => {
        postMessage(`a child was born in ${islandName}!`)
      }
    )
  }

  const addDwelling = islandName =>
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
      () => {
        postMessage(`a dwelling was built in ${islandName}!`)
      }
    )

  const addSettlement = islandName =>
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
      () => {
        postMessage(`a settlement was built in ${islandName}!`)
      }
    )

  const spendEnergy = island =>
    setGameState(previous => {
      let { resources } = island
      let { energy, food, wood } = previous.player

      let foodScore = resources.reduce(
        (sum, resource) => sum + FoodPerResources[resource],
        0
      )
      let woodScore = resources.reduce(
        (sum, resource) => sum + WoodPerResources[resource],
        0
      )

      let player = {
        ...previous.player,
        food: food + foodScore * energy,
        wood: wood + woodScore * energy,
        energy: 0
      }

      return {
        ...previous,
        player
      }
    })

  const updateWorldState = worldFn =>
    setGameState(previous => {
      const { world } = previous
      return {
        ...previous,
        world: worldFn(world)
      }
    })

  const calculatePerTick = (PerResources, { resources }, hasGatherers) =>
    resources.reduce(
      (total, resource) =>
        total +
        (!RequiresGathering[resource] ||
        (RequiresGathering[resource] && hasGatherers)
          ? PerResources[resource]
          : 0),
      0
    )

  const gameTick = () => {
    // The game loop.

    setGameState(previous => {
      const { player, islands } = previous
      const { wood, food, energy, wind } = player

      let foodΔ = 0,
        woodΔ = 0,
        energyΔ = 1,
        windΔ = Math.floor(Math.random() * 21) - 10

      Object.entries(islands)
        .filter(([name, island]) => island.isDiscovered)
        .forEach(([name, island]) => {
          let islandLocation = ScattershellLocations[name]
          let hasGatherers = island.population >= 5
          foodΔ += calculatePerTick(
            FoodPerResources,
            islandLocation,
            hasGatherers
          )
          woodΔ += calculatePerTick(
            WoodPerResources,
            islandLocation,
            hasGatherers
          )
          foodΔ -= island.population
        })

      setDeltas({
        woodΔ,
        foodΔ,
        energyΔ,
        windΔ
      })

      const newWood = wood + woodΔ,
      newFood = food + foodΔ,
      newEnergy = energy + energyΔ,
      newWind = wind + windΔ
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
    })

    // if any progressItems have reached their duration, trigger them
    progressItems
      .filter(x => x.progress >= x.duration)
      .forEach(item => {
        item.action()
      })

    // update the state of any progressItems
    // only put back the ones that are still not ready
    setProgressItems(previous =>
      previous
        .filter(x => x.progress < x.duration)
        .map(item => {
          let progress = item.progress + 1 + 0.05 * wind
          return {
            ...item,
            progress: progress > item.duration ? item.duration : progress
          }
        })
    )

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

    setMessages(previous =>
      previous
        .filter(msg => msg.live > 0)
        .map(msg => ({ ...msg, live: msg.live - 1 }))
    )
  }

  // Set the game loop interval
  useInterval(gameTick, intervalDuration)

  function launchVoyage(fromName, toName, actiontype, isInitial) {
    const NumVoyagers = {
      [Actions.LaunchOutrigger]: 2,
      [Actions.LaunchFleet]: 5
    }

    const removePopulationFrom = previousIslands => {
      // remove the population
      let previousFrom = previousIslands[fromName]
      let numVoyagers = NumVoyagers[actiontype]
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

    const addProgressTask = () => {
      // if spending was successful, append new task to progressItems
      setProgressItems(previous => {
        const voyage = {
          duration: isInitial
            ? 10
            : ScattershellLocations[fromName].neighbourDistance[toName] * 10,
          isInitial,
          name: isInitial
            ? `Voyage to ${toName}`
            : `Voyage from ${fromName} to ${toName} by ${actiontype}`,
          fromName,
          toName,
          actiontype,
          numPeople: NumVoyagers[actiontype],
          progress: 0
        }

        const action = () => {
          //mark this island as discovered
          setDiscovered(voyage)
        }

        return [...previous, { ...voyage, action }]
      })
    }

    if (isInitial) {
      addProgressTask()
    } else {
      updateGameState(
        ActionCosts[actiontype],
        removePopulationFrom,
        addProgressTask
      )
    }
  }

  const { woodΔ, foodΔ, energyΔ, windΔ } = deltas
  const deltaView = Δ =>
    Δ === 0 ? null : (
      <span
        className={'game-meter-delta'}
        style={{ color: Δ > 0 ? Colors.Green : 'red' }}
      >{`${Δ > 0 ? '+' : ''}${Δ}`}</span>
    )
  const journeys = (
    <section className={'journeys-container'}>
      {progressItems.length > 0 ? (
        <ul>
          {progressItems.map(item => {
            let { name, progress, duration, action, destName } = item
            return (
              <li key={`journey-${action}-${destName}`}>
                ⛵ {name} ({Math.round(progress)} / {duration} progress)
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
  const gameMeters = (
    <section className={'game-meters-container'}>
      <ul className={'game-meters'}>
        <li>
          <h4 className={'game-meter-number'}>
            {wood} {deltaView(woodΔ)}
          </h4>{' '}
          materials
        </li>
        <li>
          <h4 className={'game-meter-number'}>
            {food} {deltaView(foodΔ)}
          </h4>{' '}
          food
        </li>
        <li>
          <h4 className={'game-meter-number'}>
            {wind} {deltaView(windΔ)}
          </h4>{' '}
          wind
        </li>
        <li>
          <h4 className={'game-meter-number'}>
            {energy} {deltaView(energyΔ)}
          </h4>{' '}
          energy
        </li>
      </ul>
    </section>
  )

  const messagesView = (
    <section className={'messages-container'}>
      <ul>
        {messages.map(({ text }) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </section>
  )

  const { day, dayOfWeek, weekOfYear, year } = gameState.world
  const calendarView = (
    <section className={'calendar-container'}>
      <p>{`day ${day}, year ${year} (week ${weekOfYear}/52)`}</p>
    </section>
  )

  return (
    <Fabric>
      <main className={'game'}>
        <aside className={'left'}>
          <h2 className={'title title-subtitle'}>sailsongs of</h2>
          <h1 className={'title title-title'} title={VERSION}>
            scattershell
          </h1>

          {/*<section>
          <ul style={{ padding: '0px' }}>
            <li>
              <a href='javascript:;'>new game</a>
            </li>
            <li>
              <a href='javascript:;'>save game</a>
            </li>
          </ul>
        </section>
        */}
          <div className={'fixed'}>
            {gameMeters}
            {journeys}
            {messagesView}
            {calendarView}
          </div>
          <section>
            <ScattershellMap
              places={islandsWithStates()}
              currentIsland={currentIsland}
              setCurrentIsland={setCurrentIsland}
            />
          </section>

          {/*<section>
          <h3>total scores</h3>
          <ul>
            <li>islands discovered</li>
            <li>population</li>
            <li>dwellings</li>
            <li>treasures</li>
            <li>temples</li>
          <0/ul>
        </section>*/}
        </aside>

        <section className={'right'}>
          <CurrentIsland
            island={islandsWithStates()[currentIsland]}
            islands={islandsWithStates()}
            launchVoyage={launchVoyage}
            addPerson={addPerson}
            addDwelling={addDwelling}
            food={food}
            wind={wind}
            wood={wood}
            energy={energy}
            progressItems={progressItems}
            spendEnergy={spendEnergy}
            addSettlement={addSettlement}
          />
        </section>
      </main>
    </Fabric>
  )
}

export default App

/* scatterings
- slower/faster travel (harness wind)
- slower/faster harvesting of {materials|food}
- higher/lower population cost
- intensive agriculture / intensive foraging / intensive fishing
- trade routes / isolation
*/
