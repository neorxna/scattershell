import React, { useState, useRef, useEffect } from 'react'
import { Fabric, registerIcons, loadTheme } from 'office-ui-fabric-react'
import './App.css'
import { fabricIcons, fabricTheme, Colors } from './Theme'

import { Island } from './Island'
import ScattershellMap from './Map'
import { GameMeters } from './GameMeters'
import { useScattershellEngine, tickInterval } from './Engine'
import { StartingLocation, islandsDetails } from './Game'
import { ProgressStatus, useProgress } from './Progress'
import { Messages, useMessaging } from './Messages'
import { Calendar } from './Calendar'

const VERSION = '0.7'
const intervalDuration = tickInterval

const json = _ => JSON.stringify(_, undefined, 4)

registerIcons(fabricIcons)
loadTheme(fabricTheme)

/* https://overreacted.io/making-setinterval-declarative-with-react-hooks/ */
function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

function App() {
  const messaging = useMessaging()
  const progress = useProgress()

  const { gameState, tick, doAction, deltas } = useScattershellEngine(
    messaging,
    progress
  )
  const { world, player } = gameState
  // the island that is currently being viewed.
  const [currentIsland, setCurrentIsland] = useState(StartingLocation)

  // Set the game loop interval
  useInterval(tick, intervalDuration)

  const islands = islandsDetails(gameState.islands)
  return (
    <Fabric>
      <main className={'game'}>
        <aside className={'left'}>
          <h2 className={'title title-subtitle'}>sailsongs of</h2>
          <h1 className={'title title-title'} title={VERSION}>
            scattershell
          </h1>

          <div className={'fixed'}>
            <GameMeters deltas={deltas} player={player} />
            <ProgressStatus progress={progress} />
            <Messages messaging={messaging} />
            <Calendar world={world} />
          </div>

          <section style={{marginTop:'8em'}}>
            <ScattershellMap
              islands={islands}
              currentIsland={currentIsland}
              setCurrentIsland={setCurrentIsland}
            />
          </section>
        </aside>

        <section className={'right'}>
          <Island
            game={gameState}
            player={player}
            island={islands[currentIsland]}
            islands={islands}
            progress={progress}
            doAction={doAction}
          />
        </section>
      </main>
    </Fabric>
  )
}

export default App

/* scatterings
- slower/faster travel (harness wind)
- slower/faster harvesting of {materials|food}
- higher/lower population cost
- intensive agriculture / intensive foraging / intensive fishing
- trade routes / isolation
*/
