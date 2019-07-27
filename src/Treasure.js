
import React from 'react'

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

  return <Link onClick={harvestTreasure}>Reap treasure reward</Link>
}

export { Treasure }