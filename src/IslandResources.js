import React from 'react'
import {
  FoodPerResources,
  WoodPerResources,
  IsDispersable,
  RequiresGathering
} from './Resources'

function IslandResources(props) {
  const { island } = props
  const { resources } = island
  return (
    <section className={'current-island-resources'}>
      <h3>Resources on this island</h3>
      <br /> {resources.length === 0 ? 'Nothing to use.' : ''}
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
}

export { IslandResources }
