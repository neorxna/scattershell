import React, { useState, useRef, useEffect } from 'react'
import './App.css'

const IslandTypes = {
  Rocks: 'rocky',
  Guano: 'guano',
  Small: 'small',
  Medium: 'medium',
  Large: 'large'
}

const IslandDescriptions = {
  [IslandTypes.Rocks]:
    'You are disappointed to find an inhospitable outcrop of rocks in the middle of the ocean.',
  [IslandTypes.Guano]:
    'This place is covered in guano, hospitable only to the many gulls that dwell here.',
  [IslandTypes.Small]: 'You look out upon a modest but hospitable island.',
  [IslandTypes.Medium]:
    'You are relieved to find a plentiful and hospitable island.',
  [IslandTypes.Large]:
    'You are glad to the gods to find a massive volcanic island, capable of sustaining a large population.'
}

const IslandMaxPopulations = {
  [IslandTypes.Rocks]: 0,
  [IslandTypes.Guano]: 25,
  [IslandTypes.Small]: 100,
  [IslandTypes.Medium]: 500,
  [IslandTypes.Large]: 1000
}

const defaultIslandProps = {
  id: '1',
  name: 'Birdstar',
  trueName: 'Artheenkwas',
  isDiscovered: true,
  x: 30,
  y: 30,
  type: IslandTypes.Guano,
  resources: [],
  neighbours: ['Great Ark', 'Shellcove', 'Holystone'],
  neighbourDistance: {
    'Great Ark': 359,
    Shellcove: 28,
    Holystone: 62
  },
  population: 0,
  numTreasures: 0,
  numDwellings: 0,
  hasTemple: false
}

const DevelopmentLevel = {
  Undeveloped: 'undeveloped',
  Burgeoning: 'burgeoning',
  Developed: 'developed',
  HighlyDeveloped: 'highly developed',
  Advanced: 'advanced'
}

const developmentLevel = props => {
  // max population reached and treasures found
  if (props.numTreasures === 10 && props.hasTemple) {
    return DevelopmentLevel.Advanced
  }
  if (props.hasTemple || props.numTreasures > 5) {
    return DevelopmentLevel.HighlyDeveloped
  }
  // max population reached
  if ((props.population = IslandMaxPopulations[props.type])) {
    return DevelopmentLevel.Developed
  }
  //max population not yet reached
  if (props.population > 5) {
    return DevelopmentLevel.Burgeoning
  }
  return DevelopmentLevel.Undeveloped
}

function CurrentIsland(_props) {
  const props = {
    ...defaultIslandProps,
    ..._props
  }
  const expeditionChoices = () => (
    <ul>
      {props.neighbours
        .filter(neighbour => !neighbour.discovered)
        .map(neighbour => (
          <li>
            Launch expedition to {neighbour} -
            <i> {props.neighbourDistance[neighbour]} km away</i>
            <br />
            <ul>
              <li>
                <a
                  href={''}
                  onClick={() =>
                    props.launchExpedition(props, neighbour, 'outrigger')
                  }
                >
                  Launch outrigger
                </a>{' '}
                <b>(25 wood, 50 food, 2 people)</b>
              </li>
              <li>
                <a
                  href={''}
                  onClick={() =>
                    props.launchExpedition(props.name, neighbour, 'smallFleet')
                  }
                >
                  Launch small fleet
                </a>{' '}
                <b>(50 wood, 250 food, 5 people)</b>
              </li>
              <li>
                <a
                  href={''}
                  onClick={() =>
                    props.launchExpedition(props.name, neighbour, 'largeFleet')
                  }
                >
                  Launch large fleet
                </a>{' '}
                <b>(100 wood, 500 food, 10 people)</b>
              </li>
            </ul>
          </li>
        ))}
    </ul>
  )

  const islandOptions = () => (
    <ul className={'island-options'}>
      <li>
        <a href=';' className={'island-options-link'}>
          spend energy
        </a>
        <div className={'island-options-details'}>
          Use your current energy on this island to foster development.
        </div>
      </li>
      <li>
        <a href=';' className={'island-options-link'}>
          build dwelling
        </a>
        <div className={'island-options-details'}>
          Build a dwelling to house more people on this island. Up to five
          dwellings can be built on this island.
        </div>
      </li>
      <li>
        <a href=';' className={'island-options-link'}>
          build temple
        </a>
        <div className={'island-options-details'}>
          <p>
            Build a temple to find treasures to increase the prestige of the
            island. Can only be built on a medium or larger island.
          </p>
          <p>
            Building a temple will bring forth a boon or burden for this island
            and its descendants.
          </p>
        </div>
      </li>
    </ul>
  )

  const island = props
  return (
    <>
      <section className={'mv2 measure'}>
        <h3>{island.name}</h3>
        <ul>
          <li>
            <i>{island.hasTemple ? island.trueName : 'True name unknown'}</i>
          </li>
          <li>
            A <b>{island.type} island</b>
            <br />
            <i>{IslandDescriptions[island.type]}</i>
          </li>
        </ul>
        {islandOptions()}
      </section>
      <section className={'mv2'}>
        <h4>Unexplored Islands</h4>
        <i>
          The wind and sea whisper rumors of nearby islands waiting to be
          discovered.
        </i>
        {expeditionChoices()}
      </section>
    </>
  )
}

function Island(_props) {
  const props = {
    ...defaultIslandProps,
    ..._props
  }

  return <></>
}

const defaultTreasureProps = {

}

function Treasure(_props) {

  // TODO add treasure tickers in App state
  // when ticker reaches 100, can click Treasure again to receive boon
  const props = {
    ...defaultTreasureProps,
    ..._props
  }
  return <a>Harvest the rewards of treasure</a>
}

export { Island, CurrentIsland, IslandTypes }
