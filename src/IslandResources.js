import React from 'react'
import {
  FoodPerResources,
  WoodPerResources,
  IsDispersible,
  RequiresGathering,
  IsGardenFood,
  ResourceTypes
} from './Resources'
import { ScattershellLocations } from './Locations'

function IslandResources(props) {
  const { island } = props
  const { resources, name, population, numGardens } = island
  return (
    <section className={'current-island-resources'}>
      {resources.length === 0 ? (
        'Nothing to use.'
      ) : (
        <ul>
          {resources.map(res => {
            const foodQty = FoodPerResources[res]
            const woodQty = WoodPerResources[res]
            const title = `${foodQty} food, ${woodQty} materials per day ${
              numGardens > 0 && IsGardenFood[res]
                ? `plus ${numGardens} food from gardens`
                : ''
            }`
            const wasDispersed =
              ScattershellLocations[island.name].resources.filter(
                other => other === res
              ).length === 0

            const requiresGathering = RequiresGathering[res]
            const requiresGatheringSatisfied =
              requiresGathering && population >= 5 ? '✔' : null
            const isDispersible = IsDispersible[res]
            return (
              <li title={title} key={`${res}`}>
                <b>{res}</b> {'⚒️'.repeat(woodQty)} {'🥝'.repeat(foodQty)}{' '}
                {numGardens > 0 && IsGardenFood[res]
                  ? '🥬'.repeat(numGardens)
                  : ''}
                {requiresGathering || isDispersible ? (
                  <ul className={'current-island-resources-details'}>
                    <li>
                      {requiresGathering
                        ? '- requires 5 people to gather'
                        : null}
                      {requiresGatheringSatisfied}
                    </li>
                    <li>{isDispersible ? '- dispersible' : null}</li>
                    <li>{wasDispersed ? '- was dispersed here' : null }</li>
                    <li>{res===ResourceTypes.Guano ? '- will provide bonus to garden' : null}</li>
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export { IslandResources }
