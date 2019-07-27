import React from 'react'
import { Link } from 'office-ui-fabric-react'
import { ActionTypes } from './Actions'
import { Colors } from './Theme'

function VoyageChoicesList(props) {
  const { island, islands, beginAction, progress } = props
  const { neighbours } = island
  const canLaunchOutrigger = true
  const canLaunchFleet = true

  const launchVoyage = (fromName, toName, actiontype) => {

  }

  /* allow voyages to neighbours that have a population less than 5  */
  const voyagableNeighbours = neighbours.filter(
    neighbourName =>
      //!islands[neighbourName].isDiscovered &&
      islands[neighbourName].population < 5 &&
      progress.items.filter(
        item => item.destName === neighbourName
      ).length === 0
  )
  /*
  let undiscoveredMessage = (
    <i>
      The wind and sea whisper rumors of nearby islands waiting to be
      discovered.
    </i>
  ) */

  return (
    <ul className={'measure'}>
      {voyagableNeighbours.map((neighbourName, n) => {
        const neighbour = islands[neighbourName]
        return (
          <li
            key={`voyagechoice-${neighbourName}`}
            style={{
              marginBottom: '1em',
              paddingTop: '1em',
              ...(n > 0 ? { borderTop: `1px solid ${Colors.Outline}` } : {})
            }}
          >
            Launch voyage to{' '}
            <b>{neighbour.isDiscovered ? neighbourName : 'a rumored land'}</b> -
            <i> {island.neighbourDistance[neighbourName]} km away</i>{' '}
            {neighbour.isDiscovered ? '(already discovered)' : null}
            <br />
            <br />
            <ul>
              <li>
                <Link
                  onClick={() =>
                    launchVoyage(
                      island.name,
                      neighbourName,
                      ActionTypes.LaunchOutrigger
                    )
                  }
                  disabled={!canLaunchOutrigger}
                >
                  Launch outrigger
                </Link>{' '}
                <p>Costs 25 materials, 50 food, 10 energy, 2 people.</p>
                <p>
                  If the destination island is hospitable, it will be populated
                  with the 2 voyagers.
                </p>
              </li>
              <li>
                <Link
                  onClick={() =>
                    launchVoyage(
                      island.name,
                      neighbourName,
                      ActionTypes.LaunchFleet
                    )
                  }
                  disabled={!canLaunchFleet}
                >
                  Launch fleet
                </Link>{' '}
                <p>
                  Costs 100 materials, 200 food, 20 energy, 5 people. Required
                  to populate the destination island.{' '}
                </p>
                <p>
                  If the destination island is hospitable, it will be populated
                  with the 5 voyagers. If there are any dispersable resources on
                  this island, one will be chosen at random and transferred to
                  the destination island.
                </p>
              </li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

export { VoyageChoicesList }
