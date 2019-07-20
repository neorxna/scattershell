import React, { useState, useRef, useEffect } from 'react'
import './App.css'

const Colors = {
  Deep: '#121258',
  Med: '#5ba9ff',
  Shallow: '#7ccbff',
  Light: '#f3f1f1',
  Outline: '#000d16'
}

function Lorem() {
  return (
    <>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </>
  )
}

function App() {
  return (
    <main className={'game'}>
      <aside className={'left'}>
        <h2 className={'title title-subtitle'}>sailsongs of</h2>
        <h1 className={'title title-title'}>scattershell</h1>
        <p>
          Hello <b> foobar </b>world
        </p>
        <Lorem />
      </aside>

      <section className={'right'}>
        <Lorem />
        <br />
        <Island location={{ x: 5, y: 5 }} />
      </section>
    </main>
  )
}

const IslandTypes = {
  Rocks: 'rocks',
  Guano: 'guano',
  Small: 'small',
  Medium: 'medium',
  Large: 'large'
}

const IslandDescriptions = {
  [IslandTypes.Rocks]: 'An inhospitable outcrop of rocks.',
  [IslandTypes.Guano]: 'A barren place, covered in guano.',
  [IslandTypes.Small]: 'A small but hospitable island.',
  [IslandTypes.Medium]: 'A plentiful and hospitable island.',
  [IslandTypes.Large]: 'A massive volcanic island that can sustain a large population.',
}

const IslandSustainablePopulations = {
  [IslandTypes.Rocks]: 0,
  [IslandTypes.Guano]: 4,
  [IslandTypes.Small]: 50,
  [IslandTypes.Medium]: 100,
  [IslandTypes.Large]: 500,
}

const Resources = {
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

const ResourceMultipliers = {
}

const Boons = {
}

const Burdens = {
}

Object.freeze(IslandTypes)
Object.freeze(Resources)
Object.freeze(Boons)
Object.freeze(Burdens)


const defaultIslandProps = {
  name: 'Birdstar',
  trueName: 'Artheenkwas',
  location: { x: 5, y: 5 },
  type: IslandTypes.Guano,
  resources: [],
  population: 0,
  description: 'A group of guano islands. ',
}

function Island(_props) {
  const props = {
    ...defaultIslandProps,
    ..._props
  }

  return <pre>{JSON.stringify(props,undefined,4)}</pre>
}

export default App
