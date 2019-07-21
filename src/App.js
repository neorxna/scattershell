import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import { Island, CurrentIsland } from './Island'
import ScattershellLocations from './Locations'
import ScattershellMap from './Map'
import { ResourceTypes, FoodPerResources, WoodPerResources } from './Resources'

const json = _ => JSON.stringify(_, undefined, 4)

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

const initialIslandState = {
  population: 0,
  hasTemple: false,
  isDiscovered: false,
  boonsAndBurdens: [],
  numDwellings: 0,
  numTreasures: 0
}

function App() {
  let interval = null

  /* resources */
  const [wind, setWind] = useState(0)
  const [wood, setWood] = useState(0)
  const [food, setFood] = useState(0)
  const [energy, setEnergy] = useState(0)
  const [count10, setCount10] = useState(0)
  const [progressItems, setProgressItems] = useState([])
  const [islandStates, setIslandStates] = useState(
    Object.keys(ScattershellLocations).reduce(
      (obj, key) => ({ ...obj, [key]: initialIslandState }),
      {}
    ) // { islandname: state }
  )
  const [currentIsland, setCurrentIsland] = useState('Morrigan')
  // the island that is currently being viewed.

  const getDiscoveredIslands = () =>
    Object.entries(islandStates).filter(
      ([name, islandState]) => islandState.isDiscovered
    )

  const islandsWithStates = Object.keys(ScattershellLocations).reduce(
    (obj, key) => ({
      ...obj,
      [key]: { ...ScattershellLocations[key], ...islandStates[key] }
    }),
    {}
  )

  // discover the starting island
  useEffect(() => {
    setIslandStates({
      ...islandStates,
      'Morrigan': { ...islandStates['Morrigan'], isDiscovered: true }
    })
  }, [])

  const addPerson = islandName => {
    setIslandStates({
      ...islandStates,
      [islandName]: {
        ...islandStates[islandName],
        population: islandStates[islandName].population + 1
      }
    })
    spendFood(50)
  }

  const addDwelling = islandName => {
    setIslandStates({
      ...islandStates,
      [islandName]: {
        ...islandStates[islandName],
        numDwellings: islandStates[islandName].numDwellings + 1
      }
    })
    spendWood(100)
  }

  const spendFood = amount => {
    setFood(food - amount)
  }

  const spendWood = amount => {
    setWood(food - amount)
  }

  const calculateFoodPerTick = ({ resources }) =>
    resources.reduce((total, resource) => total + FoodPerResources[resource], 0)

  const calculateWoodPerTick = ({ resources }) =>
    resources.reduce((total, resource) => total + WoodPerResources[resource], 0)

  const gameTick = () => {
    // for each discovered island, add wood and food.
    if (count10 === 4 || count10 === 9) {
      getDiscoveredIslands().forEach(([name, island]) => {
        setFood(food + calculateFoodPerTick(islandsWithStates[name]))
        setWood(wood + calculateWoodPerTick(islandsWithStates[name]))
      })

      // always +1 energy
      setEnergy(energy + 1)

      // wind tends positive?
      let windDiff = Math.floor(Math.random() * 21) - 10
      let newWind = wind + windDiff
      setWind(newWind < 0 ? 0 : newWind >= 100 ? 100 : newWind)
    }

    // faster for upgraded islands
    if (count10 % 3 === 0) {
      getDiscoveredIslands()
        .filter(([name, islandState]) => islandState.isFoodBoosted)
        .forEach(() => {
          setFood(food + 1)
        })
    }

    // if progressItems have reached their duration, trigger them
    let ready = progressItems.filter(x => x.progress >= x.duration)
    Array.prototype.forEach(item => {
      item.action()
    }, ready)

    // update the state of any progressItems
    // only put back the ones that are not ready
    let notReady = progressItems.filter(x => x.progress < x.duration)
    setProgressItems(
      notReady.map(item => ({
        ...item,
        progress: (item.progress += 1)
      }))
    )

    // keep count
    setCount10(count10 >= 9 ? 0 : count10 + 1)
  }

  useEffect(() => {
    interval = setInterval(gameTick, 250)

    return () => {
      clearInterval(interval)
    }
  })

  const [discoveredIslands, setDiscoveredIslands] = useState(
    Object.keys(ScattershellLocations)
  )

  function launchExpedition(source, destName, type) {
    if (type === 'outRigger') {
      spendWood(25)
      spendFood(50)
    }

    if (type === 'smallFleet') {
      spendWood(50)
      spendFood(250)
    }

    if (type === 'largeFleet') {
      spendWood(100)
      spendFood(500)
    }

    let duration = source.neighbourDistance[destName] * 100 // number of game ticks
    let name = `Expedition from ${source.name} to ${destName}`
    let action = () => {
      //mark this island as discovered
      setDiscoveredIslands([...discoveredIslands, destName])
    }
    let progress = 0
    setProgressItems([...progressItems, { duration, name, action }])

    // need useEffect to periodically go through each progressItem
  }

  return (
    <main className={'game'}>
      {/*<pre>{json(islandStates)}</pre>
      <pre>{slow10}</pre>*/}
      <aside className={'left'}>
        <h2 className={'title title-subtitle'}>sailsongs of</h2>
        <h1 className={'title title-title'}>scattershell</h1>
        <div>version 0.4</div>
        {/*<pre>{json(progressItems)}</pre>*/}
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

        <div className={'game-meters'}>
          <section>
            <h3>energy</h3>
            <h4 className={'energy-meter'}>{energy}</h4>
          </section>

          <section>
            <h3>total resources</h3>
            <ul>
              <li>
                <b>{wood}</b> materials
              </li>
              <li>
                <b>{food}</b> food
              </li>
              <li>
                <b>{wind}</b> wind
              </li>
            </ul>
          </section>
        </div>

        <section>
          <ScattershellMap
            places={islandsWithStates}
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
        <br />
        <Island />
        <br />
        <CurrentIsland
          {...islandsWithStates[currentIsland]}
          launchExpedition={launchExpedition}
          addPerson={addPerson}
          addDwelling={addDwelling}
          food={food}
          wood={wood}
        />
      </section>
    </main>
  )
}

export default App
