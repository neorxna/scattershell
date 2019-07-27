import React from 'react'
import './App.css'
import {
  ResourceTypes,
  RequiresGathering,
  FoodPerResources,
  WoodPerResources,
  IsDispersable
} from './Resources'
import {
  IslandTypes,
  IslandMaxPopulations,
  IslandDescriptions,
  IslandIllustrations
} from './IslandProperties'
import { developmentLevelForIsland, islandDetails } from './Game'
import { IslandActionsList } from './IslandActions'
import { VoyageChoicesList } from './IslandVoyages'

function Island(props) {
  const { island, islands, player, world, gameEvents, progress } = props
  const {
    type,
    population,
    name,
    hasSettlement,
    bonusPopulation,
    numTreasures,
    numDwellings,
    hasTemple,
    resources
  } = island

  const islandInfo = (
    <section className={'current-island-info'}>
      <h3>{name}</h3>A <b>{type} island</b>
      <p>
        <i>{IslandDescriptions[type]}</i>
      </p>
      <ul>
        <li>
          Development level: <b>{developmentLevelForIsland(island)}</b>
        </li>
        <li>
          Has settlement: <b>{hasSettlement ? 'yes' : 'no'}</b>
        </li>
        <li>
          Population: <b>{population}</b>/{IslandMaxPopulations[type]}{' '}
          {bonusPopulation > 0 ? (
            <b className={'bonus'}>+{bonusPopulation}</b>
          ) : (
            ''
          )}
        </li>
        <li>
          Treasures: <b>{numTreasures}</b>/10
        </li>
        <li>
          Dwellings: <b>{numDwellings}</b>/5
        </li>
        <li>
          Has temple: <b>{hasTemple ? 'yes' : 'no'}</b>
        </li>
        <li>
          Total food contribution: <b />
        </li>
        <li>
          Total materials contribution: <b />
        </li>
      </ul>
    </section>
  )

  const islandResources = (
    <section>
      <h3>Resources on this island</h3>
      <br /> {resources.length === 0 ? 'Nothing of use.' : ''}
      <ul>
        {resources.map(res => {
          return (
            <li key={`${res}`}>
              <h5>{res}</h5>
              <p>
                ({FoodPerResources[res]} food, {WoodPerResources[res]} materials
                per day)
              </p>
              {RequiresGathering[res] ? (
                <p>Requires at least 5 people on the island to gather.</p>
              ) : null}
              {IsDispersable[res] ? <p>Dispersable</p> : ''}
            </li>
          )
        })}
      </ul>
    </section>
  )

  const islandActions = (
    <section className={'current-island-options mv2'}>
      <IslandActionsList
        island={island}
        player={player}
        world={world}
        gameEvents={gameEvents}
      />
    </section>
  )

  const unexploredIslands = (
    <section className={'current-island-expeditions mv2'}>
      <h4>Voyages from {name}</h4>
      <VoyageChoicesList
        island={island}
        islands={islands}
        progress={progress}
        gameEvents={gameEvents}
      />
    </section>
  )

  return (
    <div className={'current-island mv2'}>
      <div className={'current-island-header'}>
        <aside className={'current-island-illustration'}>
          <figure>
            <img src={IslandIllustrations[type]} />
          </figure>
        </aside>
        {islandInfo}
      </div>
      {islandResources}
      {islandActions}
      {unexploredIslands}
    </div>
  )
}

export { Island }
