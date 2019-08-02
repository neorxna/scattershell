import React from 'react'
import './App.css'
import { IslandResources } from './IslandResources'
import { IslandIllustrations } from './IslandProperties'
import { IslandDetails } from './IslandDetails'
import { IslandActionsList } from './IslandActions'
import { VoyageChoicesList } from './IslandVoyages'

function Island(props) {
  const { game, island, islands, doAction, progressProvider } = props
  const { player, world } = game
  const { type, name, resources, isDiscovered } = island

  const islandActions = (
    <section className={'current-island-options mv2'}>
      <IslandActionsList
        game={game}
        island={island}
        doAction={doAction}
      />
    </section>
  )

  const unexploredIslands = (
    <section className={'current-island-expeditions mv2'}>
      <h4>Voyages from {name}</h4>
      <VoyageChoicesList
        island={island}
        islands={islands}
        game={game}
        doAction={doAction}
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
        <IslandResources island={island} />
      </div>
      {isDiscovered ? islandActions : null}
      {isDiscovered ? unexploredIslands : null}
    </div>
  )
}

export { Island }
