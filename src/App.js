import React, { useState, useRef, useEffect } from 'react'
import { Fabric, registerIcons, loadTheme } from 'office-ui-fabric-react'

import './App.css'
import { CurrentIsland } from './Island'
import ScattershellLocations from './Locations'
import ScattershellMap from './Map'
import { fabricIcons, fabricTheme } from './Theme'
import { ResourceTypes, FoodPerResources, WoodPerResources } from './Resources'
import { Actions, ActionCosts, initialIslandState } from './Game'

const VERSION='0.5.1'
const json = _ => JSON.stringify(_, undefined, 4)

registerIcons(fabricIcons)
loadTheme(fabricTheme)

/* island state:
 - population ( adds in exchange for food, up to numDwellings * 5 or population limit)
 - hasTemple
 - isDiscovered
 - boonsAndBurdens (when island is discovered, it gets initialised with source list)
 - numDwellings ( allows higher population. requires wood)
 - numTreasures ( slowly add over time with temple. gives food and wood bonus when clicked)

 global state:
 - wood ( auto increments * multipliers)
 - food (auto increments * multipliers)
 - wind (varies randomly but always > 0)

 island disovered: 
 - set isDiscovered=true on dest
 - copy source boonsAndBurdens to dest
 - initialise with number of people (outrigger, small fleet or large fleet)
 */


const intervalDuration = 500

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

  const [progressItems, setProgressItems] = useState([])
  const [gameState, setGameState] = useState(
    {
      islands: Object.keys(ScattershellLocations).reduce(
        (obj, key) => ({ ...obj, [key]: initialIslandState }),
        {}
      ),
      /* Store player and islands in the same state to ensure all changes are atomic */
      player: {
        wood: 0,
        food: 0,
        wind: 0,
        energy: 0
      }
    } // { islandname: islandstate, ... }
  )

  const { wind, wood, food, energy } = gameState.player

  const [currentIsland, setCurrentIsland] = useState('Morrigan')
  // the island that is currently being viewed.

  const getDiscoveredIslands = () =>
    Object.entries(gameState.islands).filter(
      ([name, islandState]) => islandState.isDiscovered
    )

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
    setDiscovered('Morrigan')
  }, [])

  // helper function to update nested state
  const updateGameState = (
    resourceChanges,
    islandName,
    islandUpdate,
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

      if (!insufficient && willSpend != undefined) willSpend()

      let update = {
        player: { ...previous.player, ...(player || {}) },
        islands: {
          ...previous.islands,
          ...(islandName && islandUpdate
            ? {
                [islandName]: {
                  ...previous.islands[islandName],
                  ...islandUpdate
                }
              }
            : {})
        }
      }

      // if all required amounts were spent, or the txn is free, apply the update
      return !insufficient || free ? update : previous
    })
  }
  const setDiscovered = islandName => {
    console.log(`discovered ${islandName}`)
    updateGameState({}, islandName, { isDiscovered: true }, null, true)
  }

  const addPerson = islandName =>
    updateGameState({ foodΔ: -50 }, islandName, {
      population: gameState.islands[islandName].population + 1
    })

  const addDwelling = islandName =>
    updateGameState({ woodΔ: -100 }, islandName, {
      numDwellings: gameState.islands[islandName].numDwellings + 1
    })

  const calculateFoodPerTick = ({ resources }) =>
    resources.reduce((total, resource) => total + FoodPerResources[resource], 0)

  const calculateWoodPerTick = ({ resources }) =>
    resources.reduce((total, resource) => total + WoodPerResources[resource], 0)

  const gameTick = () => {
    let foodΔ = 0,
      woodΔ = 0,
      energyΔ = 0,
      windΔ = 0

    // keep count
    setCount(count === 9 ? 0 : count + 1)

    // for each discovered island, add wood and food.
    if (count === 4 || count === 9) {
      getDiscoveredIslands().forEach(([name, island]) => {
        foodΔ += calculateFoodPerTick(ScattershellLocations[name])
        woodΔ += calculateWoodPerTick(ScattershellLocations[name])
      })

      // always +1 energy
      energyΔ = 1

      // wind tends positive?
      windΔ = Math.floor(Math.random() * 21) - 10
    }
    // faster for upgraded islands  TODO
    /*if (count % 3 === 0) {
      getDiscoveredIslands()
        .filter(([name, islandState]) => islandState.isFoodBoosted)
        .forEach(() => {
          setFood(food + 1)
        })
    }*/

    // if any progressItems have reached their duration, trigger them
    progressItems
      .filter(x => x.progress >= x.duration)
      .forEach(item => {
        item.action()
      })

    // update the state of any progressItems
    // only put back the ones that are not ready
    let notReady = progressItems.filter(x => x.progress < x.duration)
    setProgressItems(
      notReady.map(item => {
        return {
          ...item,
          progress: item.progress + 1 + 0.05 * wind
        }
      })
    )

    updateGameState({
      woodΔ,
      foodΔ,
      energyΔ,
      windΔ
    })
  }

  // Set the game loop interval
  useInterval(gameTick, intervalDuration)

  function launchExpedition(source, destName, actiontype) {
    // spend the resources immediately
    updateGameState(ActionCosts[actiontype], null, null, () => {
      // if spending was successful, append new task to progressItems
      setProgressItems([
        ...progressItems,
        {
          duration: source.neighbourDistance[destName] * 10,
          name: `Expedition from ${
            source.name
          } to ${destName} via ${actiontype}`,
          source,
          destName,
          action: () => {
            //mark this island as discovered
            setDiscovered(destName)
          },
          progress: 0
        }
      ])
    })
  }

  return (
    <Fabric>
      <main className={'game'}>
        <aside className={'left'}>
          <h2 className={'title title-subtitle'}>sailsongs of</h2>
          <h1 className={'title title-title'} title={VERSION}>scattershell</h1>

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

          <section className={'game-meters-container'}>
            <ul className={'game-meters'}>
              <li>
                <h4 className={'game-meter-number'}>{wood}</h4> materials
              </li>
              <li>
                <h4 className={'game-meter-number'}>{food}</h4> food
              </li>
              <li>
                <h4 className={'game-meter-number'}>{wind}</h4> wind
              </li>
              <li>
                <h4 className={'game-meter-number'}>{energy}</h4> energy
              </li>
            </ul>
          </section>

          <section className={'journeys-container'}>
            <h4>In progress</h4>
            {progressItems.length > 0 ? (
              <ul>
                {progressItems.map(item => {
                  let { name, progress, duration, action, destName } = item
                  return (
                    <li key={`journey-${action}-${destName}`}>
                      {name} ({Math.round(progress / 10)} / {duration / 10})
                    </li>
                  )
                })}
              </ul>
            ) : (
              'nothing in progress'
            )}
          </section>

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
            launchExpedition={launchExpedition}
            addPerson={addPerson}
            addDwelling={addDwelling}
            food={food}
            wind={wind}
            wood={wood}
            energy={energy}
            progressItems={progressItems}
          />
        </section>
      </main>
    </Fabric>
  )
}

export default App

/* scatterings
- slower/faster travel (harness wind)
- 
*/
