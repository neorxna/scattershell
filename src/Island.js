import React from 'react'
import './App.css'
import {
  ResourceTypes,
  RequiresGathering,
  FoodPerResources,
  WoodPerResources,
  IsDispersable
} from './Resources'
import { Colors } from './Theme'
import {
  IslandTypes,
  IslandMaxPopulations,
  IslandDescriptions,
  IslandIllustrations
} from './IslandProperties'
import { developmentLevelForIsland, Actions } from './Game'
import { Link } from 'office-ui-fabric-react'

function VoyageChoices(props) {
  const { island, islands, launchVoyage, progressItems } = props

  const canLaunchOutrigger = true
  const canLaunchFleet = true

  /* allow voyages to neighbours that have a population less than 5  */
  const voyagableNeighbours = island.neighbours.filter(
    neighbourName =>
      //!islands[neighbourName].isDiscovered &&
      islands[neighbourName].population < 5 &&
      progressItems.filter(
        progressItem => progressItem.destName === neighbourName
      ).length === 0
  )

  let undiscoveredMessage = (
    <i>
      The wind and sea whisper rumors of nearby islands waiting to be
      discovered.
    </i>
  )

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
            Launch voyage to <b>{neighbour.isDiscovered ? neighbourName : 'a rumored land'}</b> -
            <i> {island.neighbourDistance[neighbourName]} km away</i>{' '}
            {neighbour.isDiscovered ? (
              '(already discovered)'
            ) : null}
            <br />
            <br />
            <ul>
              <li>
                <Link
                  onClick={() =>
                    launchVoyage(
                      island.name,
                      neighbourName,
                      Actions.LaunchOutrigger
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
                      Actions.LaunchFleet
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

function CurrentIsland(props) {
  const {
    island,
    islands,
    launchVoyage,
    wood,
    food,
    energy,
    wind,
    addDwelling,
    addPerson,
    progressItems,
    spendEnergy,
    addSettlement
  } = props

  const { type, population, name, hasSettlement } = island

  const canAddPerson = population < IslandMaxPopulations[type] && food >= 50
  const canAddDwelling = island.numDwellings < 5 && wood >= 100
  const canAddSettlement = wood >= 250 && population >= 5

  const islandOptions = () => (
    <ul className={'island-options measure'}>
      <li>
        ⚡
        <Link onClick={() => spendEnergy(island, Actions.SpendEnergy)}>
          spend energy
        </Link>
        <div className={'island-options-details'}>
          Exchange your current energy for food and materials. The bonus food
          and materials received is the food and materials on this island
          multiplied by the current energy.
        </div>
      </li>
      {hasSettlement ? null : (
        <li>
          🏠
          <Link
            onClick={() => {
              addSettlement(name)
            }}
            disabled={!canAddSettlement}
            className={'island-options-link'}
          >
            build settlement
          </Link>
          <div className={'island-options-details'}>
            <p>
              Build a settlement. Costs <b>500 materials</b>. At least{' '}
              <b>5 people</b> need to be present on the island. A settlement
              allows you to build and add more people to the island.
            </p>
            <p>
              {!canAddSettlement && wood < 250 ? '🙅‍♀️ not enough materials' : ''}
            </p>
            <p>
              {!canAddSettlement && population < 5
                ? '🙅‍♀️ 5 people required'
                : ''}
            </p>
          </div>
        </li>
      )}
      {!hasSettlement ? null : (
        <li>
          👶
          <Link
            onClick={() => {
              addPerson(island.name)
            }}
            disabled={!canAddPerson}
            className={'island-options-link'}
          >
            add person
          </Link>
          <div className={'island-options-details'}>
            <p className={'measure'}>
              Add a person to this island's population. Costs an initial{' '}
              <b>50 food</b> and then <b>1 food per day</b>.
            </p>
            <p className={'measure'}>
              You need people to explore other islands, upgrade your development
              level, and harvest certain resources such as{' '}
              <b>root vegetables</b> and <b>precious shells</b>.
            </p>
            <p>
              {!canAddPerson && food < 50 ? '🙅‍♀️ not enough food' : ''}
              {!canAddPerson && food >= 50 ? '🙅‍♀️ max population reached' : ''}
            </p>
          </div>
        </li>
      )}
      {!hasSettlement ? null : (
        <li>
          🏠
          <Link
            onClick={() => {
              addDwelling(island.name)
            }}
            disabled={!canAddDwelling}
            className={'island-options-link'}
          >
            build dwelling
          </Link>
          <div className={'island-options-details'}>
            <p>
              Build a dwelling to house more people on this island. Up to five
              dwellings can be built on this island. Costs <b>100 materials</b>.
            </p>
            {!canAddDwelling && wood < 100 ? '🙅‍♀️ not enough materials' : ''}
            {!canAddDwelling && wood >= 100 ? '🙅‍♀️ max dwellings reached' : ''}
          </div>
        </li>
      )}
      {!hasSettlement ? null : (
        <li>
          🙏
          <Link disabled className={'island-options-link'}>
            build temple
          </Link>
          <div className={'island-options-details'}>
            <p>
              Build a temple to find treasures to increase the prestige of the
              island. Costs <b>1000 food</b> and <b>1000 energy</b>. Once a
              temple is built, resources will be gathered at a faster rate.
            </p>
            <h5>scattering</h5>
            <p>
              Building a temple will bring forth a scattering: a boon or burden
              will be given to this island and its descendants.
            </p>
            <h5>treasures</h5>
            <p>
              Treasures will periodically appear when a temple is built. Acquire
              all the treasures to maximise an island's development level.
            </p>
          </div>
        </li>
      )}
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
          Has settlement: <b>{island.hasSettlement ? 'yes' : 'no'}</b>
        </li>
        <li>
          Population: <b>{island.population}</b>/
          {IslandMaxPopulations[island.type]}{' '}
          {island.bonusPopulation > 0 ? (
            <b className={'bonus'}>+{island.bonusPopulation}</b>
          ) : (
            ''
          )}
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
              <h5>{res}</h5>
              <p>
                ({FoodPerResources[res]} food, {WoodPerResources[res]} materials
                per day)
              </p>
              {RequiresGathering[res] ? (
                <p>Requires at least 5 people on the island to gather.</p>
              ) : (
                ''
              )}
              {IsDispersable[res] ? <p>Dispersable</p> : ''}
            </li>
          )
        })}
      </ul>
    </section>
  )

  const unexploredIslands = (
    <section className={'current-island-expeditions mv2'}>
      <h4>Voyages from {island.name}</h4>
      <VoyageChoices
        island={island}
        islands={islands}
        launchVoyage={launchVoyage}
        progressItems={progressItems}
      />
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

function Treasure(props) {
  // TODO add treasure tickers in App state
  // treasure appears for 1 week each year (a random week)
  // increasing each time.
  // player clicks to get the reward. can collect max 10 treasure per island.
  // takes some time to get the reward.

  const { harvestTreasure } = {
    ...defaultTreasureProps,
    ...props
  }

  return <Link onClick={harvestTreasure}>Harvest the rewards of treasure</Link>
}

export { CurrentIsland }
