import React from 'react'
import { Link } from 'office-ui-fabric-react'

function IslandAction(props) {
  const {
    icon,
    text,
    children,
    onActionClick,
    requirements,
    requiresSettlement
  } = props

  const allRequirementsMet =
    requirements.map(({ met }) => met).length === requirements

  const requirementsList = (
    <ul>
      {requirements.map(({ text, met }) => (
        <li key={text}>
          needs {text} {met ? '✔️' : '(not met)'}
        </li>
      ))}
    </ul>
  )

  return requiresSettlement ? null : (
    <li>
      {icon}
      <Link onClick={onActionClick} disabled={!allRequirementsMet}>
        {text}
      </Link>
      <div className={'island-options-details'}>{children}</div>
      {requirementsList}
    </li>
  )
}

function IslandActionsList(props) {
  const { island, player, world, gameEvents } = props
  const { name } = island
  const { food, wood, wind, energy } = player

  const {
    spendEnergy,
    addSettlement,
    addPerson,
    addDwelling,
    addGarden,
    addTemple
  } = gameEvents

  /*
    const canAddPerson = population < IslandMaxPopulations[type] && food >= 50
    const canAddDwelling = island.numDwellings < 5 && wood >= 100
    const canAddSettlement = wood >= 250 && population >= 5
  */

  return (
    <ul className={'island-options measure'}>
      <IslandAction
        icon={'⚡'}
        text={'receive offerings'}
        requiresSettlement={false}
        requirements={[]}
        onActionClick={() => spendEnergy(name)}
      >
        <p>
          Receive a one-off boost of the food and materials from {name} in
          exchange for the current energy. You will receive <b>{}</b> materials
          and <b>{}</b> food.
        </p>
      </IslandAction>

      <IslandAction
        icon={'🏠'}
        text={'build settlement'}
        requiresSettlement={false}
        requirements={[]}
        onActionClick={() => {
          addSettlement(name)
        }}
      >
        <p>
          Build a settlement on {name}. Costs <b>250 materials</b>. At least{' '}
          <b>5 people</b> need to be present on the island.
        </p>
        <p>
          A settlement allows new structures to be built and children to be born
          on the island.
        </p>
      </IslandAction>

      <IslandAction
        icon={'👶'}
        text={'add person'}
        requiresSettlement={true}
        requirements={[]}
        onActionClick={() => {
          addPerson(name)
        }}
      >
        <p>
          Cause a child to be born on {name}. Costs <b>50 food</b>.{' '}
          <b>50 energy</b> and then <b>1 food per day</b>.
        </p>
        <p>
          You need people to explore other islands, upgrade your development
          level and harvest certain resources.
        </p>
      </IslandAction>

      <IslandAction
        icon={'🏠'}
        text={'build dwelling'}
        requiresSettlement={true}
        requirements={[]}
        onActionClick={() => {
          addDwelling(name)
        }}
      >
        <p>
          Build a dwelling on ${name} to house more people on this island. Up to
          five dwellings can be built on this island. Costs <b>100 materials</b>
          .
        </p>
      </IslandAction>

      <IslandAction
        icon={'🥬'}
        text={'plant garden'}
        requirements={[]}
        onActionClick={() => addGarden(name)}
        requiresSettlement={true}
      >
        <p>
          Build a garden on ${name} to harvest more horticultural resources per
          day. Up to five gardens can be planted. Costs <b>500 materials</b> and
          then <b>1 materials per week</b>.
        </p>
      </IslandAction>

      <IslandAction
        icon={'🙏'}
        text={'build temple'}
        requirements={[]}
        onActionClick={() => addTemple(name)}
        requiresSettlement={true}
      >
        <p>
          Build a temple to find treasures to increase the prestige of the
          island. Costs <b>1000 food</b> and <b>1000 energy</b>. Once a temple
          is built, bonus energy will be received from ${name}
        </p>
        <h5>scattering</h5>
        <p>
          Building a temple will bring forth a scattering: a blessing or burden
          that will be carried by this island and its descendants (any islands
          that are discovered from here).
        </p>
        <h5>treasures</h5>
        <p>
          Treasures will periodically appear when a temple is built. Acquire all
          the treasures to maximise an island's development level.
        </p>
      </IslandAction>
    </ul>
  )
}

export { IslandActionsList }
