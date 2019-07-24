import React from 'react'
import './App.css'
import { ResourceTypes, FoodPerResources, WoodPerResources } from './Resources'
import { Colors } from './Theme'
import {
  IslandTypes,
  IslandMaxPopulations,
  IslandDescriptions,
  IslandIllustrations
} from './IslandProperties'
import { developmentLevelForIsland, Actions } from './Game'
import { Link } from 'office-ui-fabric-react'

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

function CurrentIsland(props) {
  const {
    island,
    islands,
    launchExpedition,
    wood,
    food,
    energy,
    wind,
    addDwelling,
    addPerson,
    progressItems
  } = {
    ...defaultIslandProps,
    ...props
  }

  const undiscoveredNeighbours = island.neighbours.filter(
    neighbourName =>
      !islands[neighbourName].isDiscovered &&
      progressItems.filter(
        progressItem => progressItem.destName === neighbourName
      ).length === 0
  )

  const expeditionChoices = () => (
    <ul>
      {undiscoveredNeighbours.map((neighbour, n) => (
        <li
          key={`${neighbour}`}
          style={{
            marginBottom: '1em',
            paddingTop: '1em',
            ...(n > 0 ? { borderTop: `1px solid ${Colors.Outline}` } : {})
          }}
        >
          Launch expedition to <b>{neighbour}</b> -
          <i> {island.neighbourDistance[neighbour]} km away</i>
          <br />
          <br />
          <ul>
            <li>
              <Link
                onClick={() =>
                  launchExpedition(island, neighbour, Actions.LaunchOutrigger)
                }
              >
                Launch outrigger
              </Link>{' '}
              costs 25 materials, 50 food, 10 energy.
            </li>
            <li>
              <Link
              disabled
                onClick={() =>
                  launchExpedition(island, neighbour, Actions.LaunchSmallFleet)
                }
              >
                Launch small fleet
              </Link>{' '}
              costs 50 materials, 250 food, 10 energy. risks 5 people
            </li>
            <li>
              <Link
              disabled
                onClick={() =>
                  launchExpedition(island, neighbour, Actions.LaunchLargeFleet)
                }
              >
                Launch large fleet
              </Link>{' '}
              costs 100 materials, 500 food, 10 energy. risks 10 people
            </li>
          </ul>
        </li>
      ))}
    </ul>
  )
  const canAddPerson =
    island.population < IslandMaxPopulations[island.type] && food >= 50
  const canAddDwelling = island.numDwellings < 5 && wood >= 100

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
        <Link
          onClick={() => {
            addPerson(island.name)
          }}
          disabled={!canAddPerson}
          className={'island-options-link'}
        >
          👶 add person
        </Link>
        <div className={'island-options-details'}>
          <p>
            Add a person to this island's population. Costs <b>50 food</b>.
          </p>
          {!canAddPerson && food < 50 ? '🙅‍♀️ not enough food' : ''}
          {!canAddPerson && food >= 50 ? '🙅‍♀️ max population reached' : ''}
        </div>
      </li>
      <li>
        <Link
          onClick={() => {
            addDwelling(island.name)
          }}
          disabled={!canAddDwelling}
          className={'island-options-link'}
        >
          🏠 build dwelling
        </Link>
        <div className={'island-options-details'}>
          <p>
            Build a dwelling to house more people on this island. Up to five
            dwellings can be built on this island. Costs <b>100 materials</b>.
          </p>
          {!canAddDwelling && wood < 100 ? '🙅‍♀️ not enough materials' : ''}
          {!canAddDwelling && wood >= 100 ? '🙅‍♀️ max reached' : ''}
        </div>
      </li>
      <li>
        <Link disabled className={'island-options-link'}>
          🙏 build temple
        </Link>
        <div className={'island-options-details'}>
          <p>
            Build a temple to find treasures to increase the prestige of the
            island. Costs <b>1000 food</b> and <b>1000 energy</b>.
          </p>
          <p>
            Building a temple will bring forth a boon or burden for this island
            and its descendants.
          </p>
        </div>
      </li>
    </ul>
  )

  const islandInfo = (
    <section className={'current-island-info'}>
      <h3>{island.name}</h3>A <b>{island.type} island</b>
      <p>
        <i>{IslandDescriptions[island.type]}</i>
      </p>
      <ul>
        <li>
          Development level: <b>{developmentLevelForIsland(island)}</b>
        </li>
        <li>
          Population: <b>{island.population}</b>/
          {IslandMaxPopulations[island.type]}
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
    </section>
  )

  const islandResources = (
    <section>
      <h3>Resources on this island</h3>
      <br /> {island.resources.length === 0 ? 'Nothing of use.' : ''}
      <ul>
        {island.resources.map(res => {
          return (
            <li key={`${island.name}_${res}`}>
              <b>{res}</b>
              <br />
              <i>
                ({FoodPerResources[res]} food, {WoodPerResources[res]} materials
                per tick)
              </i>
            </li>
          )
        })}
      </ul>
    </section>
  )

  const unexploredIslands = (
    <section className={'current-island-expeditions mv2'}>
      <h4>Unexplored Islands</h4>
      {undiscoveredNeighbours.length === 0 ? (
        <i>There are no other islands nearby to discover.</i>
      ) : (
        <>
          <i>
            The wind and sea whisper rumors of nearby islands waiting to be
            discovered.
          </i>
          {expeditionChoices()}
        </>
      )}
    </section>
  )

  return (
    <div className={'current-island mv2'}>
      <div className={'current-island-header'}>
        <aside className={'current-island-illustration'}>
          <figure>
            <img src={IslandIllustrations[island.type]} />
          </figure>
        </aside>
        {islandInfo}
      </div>
      {islandResources}
      <section className={'current-island-options mv2'}>
        {islandOptions()}
      </section>
      {unexploredIslands}
    </div>
  )
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

export { CurrentIsland }
