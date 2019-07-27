import React from 'react'
import { developmentLevelForIsland } from './Game'
import { IslandMaxPopulations, IslandDescriptions } from './IslandProperties'

function IslandDetails(props) {
  const { island } = props
  const {
    name,
    type,
    population,
    bonusPopulation,
    numTreasures,
    numDwellings,
    hasSettlement,
    hasTemple
  } = island

  return (
    <section className={'current-island-info'}>
      <h3>{name}</h3>A <b>{type} island</b>
      <p>
        <i>{IslandDescriptions[type]}</i>
      </p>
      <ul>
        <li>
          <b>{developmentLevelForIsland(island)}</b>
        </li>
        {hasSettlement ? (
          <li>
            <b>has settlement</b>
          </li>
        ) : null}
        <li>
          <b>{population}</b>/{IslandMaxPopulations[type]}{' '}
          {bonusPopulation > 0 ? (
            <b className={'bonus'}>+{bonusPopulation}</b>
          ) : null}{' '}
          population
        </li>
        <li>
          <b>{numTreasures}</b>/10 treasures
        </li>
        <li>
          <b>{numDwellings}</b>/5 dwellings
        </li>
        {hasTemple ? (
          <li>
            <b>has temple</b>
          </li>
        ) : null}
        <li>
          <b /> food contribution
        </li>
        <li>
          <b /> materials contribution
        </li>
      </ul>
    </section>
  )
}

export { IslandDetails }
