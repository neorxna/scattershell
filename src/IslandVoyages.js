import React from 'react'
import { Link } from 'office-ui-fabric-react'
import { ActionTypes, Actions } from './Actions'
import { Colors } from './Theme'
import { IslandAction } from './IslandActions'
import { ScattershellLocations } from './Locations'

function VoyageChoicesList(props) {
  const { island, islands, progress, game, doAction } = props
  const { name, neighbours } = island

  /* allow voyages to neighbours that have a population less than 5  */
  const voyagableNeighbours = neighbours.filter(
    neighbourName =>
      //!islands[neighbourName].isDiscovered &&
      islands[neighbourName].population < 5 &&
      progress.items.filter(item => item.destName === neighbourName).length ===
        0
  )

  return (
    <>
      <section className={'voyage-hints'}>
        <p className={'hint-text measure'}>
          <h5>Outrigger</h5>
          If the destination island is hospitable, it will be populated with the
          2 voyagers.
        </p>
        <p className={'hint-text measure'}>
          <h5>Fleet</h5>
          If the destination island is hospitable, it will be populated with the
          5 voyagers. If there are any dispersible resources on this island, one
          will be chosen at random and transferred to the destination island.
        </p>
      </section>
      <ul className={'voyages'}>
        {voyagableNeighbours.map((toName, n) => {
          const destination = islands[toName]
          const { isDiscovered } = destination
          const fromName = name
          const distance =
            ScattershellLocations[fromName].neighbourDistance[toName]
          return (
            <li
              style={{
                marginBottom: '1em',
                marginBottom: '1em',
                paddingTop: '1em',
                ...(n > 0 ? { borderTop: `1px solid ${Colors.Outline}` } : {})
              }}
            >
              <h4>
                Voyage to {isDiscovered ? toName : 'an undiscovered land'} -{' '}
                {distance} worlds away{' '}
                {isDiscovered ? '(already discovered)' : ''}
              </h4>
              <br />
              <IslandAction
                actionType={ActionTypes.LaunchOutrigger}
                onActionClicked={() => {
                  doAction(ActionTypes.LaunchOutrigger, name, {
                    actionType: ActionTypes.LaunchOutrigger,
                    isBeginning: false,
                    toName,
                    fromName
                  })
                }}
                validate={() =>
                  Actions[ActionTypes.LaunchOutrigger].validate(game, name, {})
                }
              />
              <IslandAction
                actionType={ActionTypes.LaunchFleet}
                onActionClicked={() => {
                  doAction(ActionTypes.LaunchFleet, name, {
                    actionType: ActionTypes.LaunchFleet,
                    isBeginning: false,
                    toName,
                    fromName
                  })
                }}
                validate={() =>
                  Actions[ActionTypes.LaunchFleet].validate(game, name, {})
                }
              />
            </li>
          )
        })}
      </ul>
    </>
  )
}

export { VoyageChoicesList }
