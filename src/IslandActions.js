import React from 'react'
import { Link } from 'office-ui-fabric-react'
import { Colors } from './Theme'
import { ActionTypes, Actions } from './Actions'

function IslandAction(props) {
  const { children, actionType, onActionClicked, hide, validate } = props
  const action = Actions[actionType]

  const { emoji, text } = action
  const requirements = validate()
  const allRequirementsMet =
    requirements.filter(({ met }) => met).length === requirements.length

  const reqs =
    requirements.length > 0 ? (
      <ul className={'requirements'}>{requirements.map(({ text }) => (text ? <li>{text}</li> : null))}</ul>
    ) : null

  return hide ? null : (
    <li>
      {emoji}
      <Link
        onClick={onActionClicked}
        disabled={!allRequirementsMet}
        styles={props => ({
          root: props.isDisabled ? { color: Colors.Disabled } : {}
        })}
      >
        {text}
      </Link>
      <div className={'island-options-details'}>{children}</div>
      {reqs}
    </li>
  )
}

function IslandActionsList(props) {
  const { game, island, doAction } = props
  const { name, hasSettlement } = island

  /* TODO hide actions if there is an incomplete progress item for the action */

  return (
    <ul className={'island-options measure'}>
      <IslandAction
        actionType={ActionTypes.SpendEnergy}
        onActionClicked={() => {
          doAction(ActionTypes.SpendEnergy, name, {})
        }}
        validate={() => Actions[ActionTypes.SpendEnergy].validate(game, name, {})}
      >
        <p>
          Receive a bounty of food and materials from {name} in exchange for all of your current energy.
          {/*You will receive <b>{}</b> materials
          and <b>{}</b> food.*/}
        </p>
      </IslandAction>

      <IslandAction
        actionType={ActionTypes.AddSettlement}
        hide={hasSettlement}
        onActionClicked={() => {
          doAction(ActionTypes.AddSettlement, name, {})
        }}
        validate={() => Actions[ActionTypes.AddSettlement].validate(game, name, {})}
      >
        <p>
          Raise a settlement on {name}. At least <b>5 people</b> need to be
          present on the island.
        </p>
        <p>
          A settlement allows new structures to be built and children to be born
          on the island.
        </p>
      </IslandAction>

      <IslandAction
        hide={!hasSettlement}
        actionType={ActionTypes.AddPerson}
        onActionClicked={() => {
          doAction(ActionTypes.AddPerson, name, {})
        }}
        validate={() => Actions[ActionTypes.AddPerson].validate(game, name)}
      >
        <p>
          Cause a child to be born on {name}. Uses <b>1 food per day</b> after
          the initial cost.
        </p>
        <p>
          You need people to explore other islands, upgrade your development
          level and harvest certain resources. You need at least on {name} to get resources from here.
        </p>
      </IslandAction>

      <IslandAction
        hide={!hasSettlement}
        actionType={ActionTypes.AddDwelling}
        onActionClicked={() => {
          doAction(ActionTypes.AddDwelling, name, {})
        }}
        validate={() => Actions[ActionTypes.AddDwelling].validate(game, name)}
      >
        <p>
          Build a dwelling on {name} to house more people on this island. Up to
          five dwellings can be built.
        </p>
      </IslandAction>

      <IslandAction
        actionType={ActionTypes.AddGarden}
        hide={!hasSettlement}
        onActionClicked={() => {
          doAction(ActionTypes.AddGarden, name, {})
        }}
        validate={() => Actions[ActionTypes.AddGarden].validate(game, name)}
      >
        <p>
          Plant a garden on {name} to harvest more bonus food per
          day. Gardens can only be planted on islands with horticultural resources (<b>root vegetables</b> and <b>fruit trees</b>).
          Up to five gardens can be planted.
        </p>
      </IslandAction>

      <IslandAction
        hide={!hasSettlement}
        actionType={ActionTypes.AddTemple}
        onActionClicked={() => {
          doAction(ActionTypes.AddTemple, name, {})
        }}
        validate={() => Actions[ActionTypes.AddTemple].validate(game, name)}
      >
        <p>
          Build a temple to find treasures to increase the prestige of {name}. 
          Once a temple is built, bonus energy will be received per day.
        </p>
        {/*<h5>scattering</h5>
        <p style={{textDecoration:'line-through'}}>
          Building a temple will bring forth a scattering: a blessing or burden
          that will be carried by this island and its descendants (any islands
          that are discovered from here).
        </p> coming soon
        <h5>treasures</h5>
        <p style={{textDecoration:'line-through'}}>
          Treasures will periodically appear when a temple is built. Acquire all
          the treasures to maximise an island's development level.
          </p> coming soon */}
      </IslandAction>
    </ul>
  )
}

export { IslandActionsList, IslandAction }
