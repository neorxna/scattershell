import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import { Island, CurrentIsland } from './Island'

const json = _ => JSON.stringify(_, undefined, 4)

const Colors = {
  Deep: '#121258',
  Med: '#5ba9ff',
  Shallow: '#7ccbff',
  Light: '#f3f1f1',
  Outline: '#000d16'
}

function App() {
  let interval = null

  const [wind, setWind] = useState(0)
  const updateWind = () => {
    let newWind = setWind()
  }

  const gameTick = () => {
    console.log('game tick')
  }

  useEffect(() => {
    interval = setInterval(gameTick, 500)
    return () => {
      clearInterval(interval)
    }
  })

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

  function launchExpedition(source, dest, type) {
    return
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
        <Island location={{ x: 5, y: 5 }} />
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
