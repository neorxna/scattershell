import React, { useState, useRef, useEffect } from 'react'
import './App.css'

const Colors = {
  Deep: '#121258',
  Med: '#5ba9ff',
  Shallow: '#7ccbff',
  Light: '#f3f1f1',
  Outline: '#000d16'
}

function App() {
  return (
    <main>
      <header>
        <h2 className={'title title-subtitle'}>sailsongs of</h2>
        <h1 className={'title title-title'}>scattershell</h1>
      </header>
      <section>
        <p>
          Hello <b> foobar </b>world
        </p>
      </section>
    </main>
  )
}

export default App
