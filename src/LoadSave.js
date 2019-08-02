import React, { useState, useRef, useEffect } from 'react'
import { Panel, PanelType, Link } from 'office-ui-fabric-react'
import * as lzutf8 from 'lzutf8'

function useLoadSave() {
  const loadState = saveFile => {
    return _ => {
      try {
        const decoded = lzutf8.decodeBase64(saveFile)
        const decompressed = lzutf8.decompress(decoded)
        const game = JSON.parse(decompressed)
        return game
      } catch (e) {
        console.error('Error loading game :(')
        return _
      }
    }
  }

  const serializeState = gameState => {
    try {
      //compressed
      const json = JSON.stringify(gameState)
      const compressed = lzutf8.compress(json)
      const b64 = lzutf8.encodeBase64(compressed)
       
      return b64
    } catch (e) {
      console.error('Error creating save file :(')
    }
  }
  return { loadState, serializeState }
}

function LoadSavePanel(props) {
  const { loadSaveProvider, game } = props
  const { loadState, serializeState } = loadSaveProvider
  const [showPanel, setShowPanel] = useState(false)
  const textareaRef = useRef()

  useEffect(() => {
    if (showPanel && textareaRef.current) {
      const { current } = textareaRef
      current.value = serializeState(game)
      current.focus()
    }
  }, [showPanel && textareaRef.current])

  const loadText = () => {
    const { current } = textareaRef
    loadState(current.value)
  }

  return (
    <>
      <Panel
        isOpen={showPanel}
        onDismiss={() => {
          setShowPanel(false)
        }}
        type={PanelType.smallFixedNear}
        headerText={'Load and save'}
      >
        <p>
          Copy the save file below to capture your current game, or paste in a
          save file to load a previous game.
        </p>
        <textarea className={'savefile-textarea'} ref={textareaRef} />
        <p>
          <Link
            onClick={() => {
              loadText()
            }}
          >
            load saved game
          </Link>
        </p>
      </Panel>
      <Link
        onClick={() => {
          setShowPanel(true)
        }}
      >
        load and save games
      </Link>
    </>
  )
}

export { useLoadSave, LoadSavePanel }
