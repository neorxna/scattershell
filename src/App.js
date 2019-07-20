import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import { Island, CurrentIsland } from './Island'
import ScattershellLocations from './Locations'
import ScattershellMap from './Map'

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

function App() {
  let interval = null

  const [wind, setWind] = useState(0)
  const [progressItems, setProgressItems] = useState([])

  const gameTick = () => {
    // TODO increase food and wood each tick, randomly vary wind

    // if progressItems have reached their duration, trigger them
    let ready = progressItems.filter(x => x.progress >= x.duration)
    Array.prototype.forEach(item => {
      item.action()
    }, ready)
    // TODO remove those progressItems

    // update the state of any progressItems
    setProgressItems(
      progressItems.map(item => ({
        ...item,
        progress: (item.progress += 1)
      }))
    )
  }

  useEffect(() => {
    interval = setInterval(gameTick, 500)

    return () => {
      clearInterval(interval)
    }
  })

  const [discoveredIslands, setDiscoveredIslands] = useState(
    Object.keys(ScattershellLocations)
  )

  /*
  const [resources, setResources] = useState(
    Object.keys(Resources).reduce((obj, key) => ({ ...obj, [key]: 0 }), {})
  )

  function spendResource(resourceName, amount) {
    setResources({
      ...resources,
      [resourceName]: resources[resourceName] - amount
    })
  }*/

  function launchExpedition(source, destName, type) {
    // TODO type of expedition, spend resources
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
      <aside className={'left'}>
        <h2 className={'title title-subtitle'}>sailsongs of</h2>
        <h1 className={'title title-title'}>scattershell</h1>

        <section>
          <ul style={{ padding: '0px' }}>
            <li>
              <a href=';'>new game</a>
            </li>
            <li>
              <a href=';'>save game</a>
            </li>
          </ul>
        </section>

        <section>
          <ScattershellMap />
        </section>

        <section>
          <h3>energy</h3>
          <h4>{}</h4>
        </section>

        <section>
          <h3>total resources</h3>
          <ul>
            <li>wood</li>
            <li>food</li>
          </ul>
        </section>

        <section>
          <h3>total scores</h3>
          <ul>
            <li>population</li>
            <li>dwellings</li>
            <li>treasures</li>
            <li>temples</li>
          </ul>
        </section>
      </aside>

      <section className={'right'}>
        <Island />
        <br />
        <CurrentIsland launchExpedition={launchExpedition} />
      </section>
    </main>
  )
}

const ResourceTypes = {
  Shellfish: 'shellfish',
  Fish: 'ocean fish',
  Pigs: 'pigs',
  Birds: 'birds',
  BushFood: 'bush food',
  Coconuts: 'coconuts',
  RootVegetables: 'root vegetables',
  PreciousShells: 'precious shells',
  FreshWater: 'fresh water',
  Flax: 'flax',
  Bamboo: 'bamboo',
  SturdyWood: 'sturdy wood'
}

const Resources = {
  Wood: 'wood',
  Food: 'food'
}
// TODO

const ResourceTypeMultipliers = {}
const Boons = {}
const Burdens = {}

export default App
