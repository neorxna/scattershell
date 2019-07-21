import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import { ResourceTypes, FoodPerResources, WoodPerResources } from './Resources'

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

const IslandIllustrations = {
  [IslandTypes.Rocks]: '/island_types/rock.png',
  [IslandTypes.Guano]: '/island_types/gull3.png',
  [IslandTypes.Small]: '/island_types/shells.png',
  [IslandTypes.Medium]: '/island_types/coconuts.png',
  [IslandTypes.Large]: '/island_types/volcano.png'
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
  if (props.population === IslandMaxPopulations[props.type]) {
    return DevelopmentLevel.Developed
  }
  //max population not yet reached
  if (props.population > 5) {
    return DevelopmentLevel.Burgeoning
  }
  return DevelopmentLevel.Undeveloped
}

const canAddPerson = island =>
  island.population > IslandMaxPopulations[island.type]
const canAddDwelling = island => false

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
            Launch expedition to <b>{neighbour}</b> -
            <i> {props.neighbourDistance[neighbour]} km away</i>
            <br />
            <br />
            <ul>
              <li>
                <a
                  href={'javascript:;'}
                  onClick={() =>
                    props.launchExpedition(props, neighbour, 'outrigger')
                  }
                >
                  Launch outrigger
                </a>{' '}
                (costs 25 resources, 50 food, risks 2 people)
              </li>
              <li>
                <a
                  href={'javascript:;'}
                  onClick={() =>
                    props.launchExpedition(props.name, neighbour, 'smallFleet')
                  }
                >
                  Launch small fleet
                </a>{' '}
                (costs 50 resources, 250 food, risks 5 people)
              </li>
              <li>
                <a
                  href={'javascript:;'}
                  onClick={() =>
                    props.launchExpedition(props.name, neighbour, 'largeFleet')
                  }
                >
                  Launch large fleet
                </a>{' '}
                (costs 100 resources, 500 food, risks 10 people)
              </li>
            </ul>
          </li>
        ))}
    </ul>
  )

  const island = props
  const canAddPerson =
    island.population < IslandMaxPopulations[island.type] && props.food >= 50
  const canAddDwelling = island.numDwellings < 5 && props.wood >= 100

  const islandOptions = () => (
    <ul className={'island-options measure'}>
      {/*<li>
        <a href=';' className={'island-options-link'}>
          spend energy
        </a>
        <div className={'island-options-details'}>
          Use your current energy on this island to foster development.
        </div>
      </li>*/}
      <li>
        <a
          href='javascript:;'
          onClick={() => {
            if (canAddPerson) props.addPerson(island.name)
          }}
          disabled={!canAddPerson}
          className={'island-options-link'}
        >
          add person
        </a>
        <div className={'island-options-details'}>
          Add a person to this island's population. Costs <b>50 food</b>{' '}
          {!props.food >= 50 && '(not enough)'}
        </div>
      </li>
      <li>
        <a
          href='javascript:;'
          onClick={() => {
            if (canAddDwelling) props.addDwelling(island.name)
          }}
          className={'island-options-link'}
        >
          build dwelling
        </a>
        <div className={'island-options-details'}>
          Build a dwelling to house more people on this island. Up to five
          dwellings can be built on this island.
          <br />
          Costs <b>100 materials</b> {!props.wood >= 100 && '(not enough)'}
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

  const [showingExpeditionChoices, setShowingExpeditionChoices] = useState(
    false
  )

  const json = _ => JSON.stringify(_, undefined, 4)

  return (
    <div className={'current-island mv2'}>
      <div className={'current-island-header'}>
        <aside className={'current-island-illustration'}>
          <figure>
            <img src={IslandIllustrations[island.type]} />
          </figure>
        </aside>
        <section className={'current-island-info measure'}>
          <h3>{island.name}</h3>A <b>{island.type} island</b>
          <p>
            <i>{IslandDescriptions[island.type]}</i>
          </p>
          <ul style={{ fontSize: '.8em' }}>
            <li>
              Development level: <b>{developmentLevel(island)}</b>
            </li>
            <li>
              Population: <b>{island.population}</b>/{IslandMaxPopulations[island.type]}
            </li>
            <li>
              Treasures: <b>{island.numTreasures}</b>/10
            </li>
            <li>
              Dwellings: <b>{island.numDwellings}</b>/5
            </li>
            <li>
              Has temple: <b>{island.hasTemple ? 'yes' : 'no'}</b>
            </li>
          </ul>
          Resources on this island:
          <ul style={{ fontSize: '.8em' }}>
            {island.resources.map(res => {
              return (
                <li>
                  <b>{res}</b>
                  <br />
                  <i>
                    ({FoodPerResources[res]} food, {WoodPerResources[res]}{' '}
                    materials per tick)
                  </i>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
      <section className={'current-island-options mv2'}>
        {islandOptions()}
      </section>
      <section className={'current-island-expeditions mv2'}>
        <h4>Unexplored Islands</h4>

        {props.neighbours.length === 0 ? (
          <i>There are no islands nearby to explore.</i>
        ) : (
          <>
            <i>
              The wind and sea whisper rumors of nearby islands waiting to be
              discovered.
            </i>
            {!showingExpeditionChoices ? (
              <>
                <br />
                <a
                  href={'javascript:;'}
                  onClick={() => setShowingExpeditionChoices(true)}
                >
                  Show expedition choices
                </a>
              </>
            ) : (
              expeditionChoices()
            )}
          </>
        )}
      </section>
    </div>
  )
}

function Island(_props) {
  const props = {
    ...defaultIslandProps,
    ..._props
  }

  return <></>
}

const defaultTreasureProps = {}

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
