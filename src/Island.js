import React from 'react'
import './App.css'
import { IslandResources } from './IslandResources'
import { IslandIllustrations } from './IslandProperties'
import { IslandDetails } from './IslandDetails'
import { IslandActionsList } from './IslandActions'
import { VoyageChoicesList } from './IslandVoyages'

function Island(props) {
  const { island, islands, player, world, gameEvents, progress } = props
  const { type, name, resources } = island

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
        <IslandDetails island={island} />
      </div>
      <IslandResources island={island} />
      {islandActions}
      {unexploredIslands}
    </div>
  )
}

export { Island }
