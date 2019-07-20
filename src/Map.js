import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import * as SVG from 'svg.js'
import rough from 'roughjs/dist/rough.umd'
import Colors from './Theme'

const defaultScattershellMapProps = {
  places: [
    { id: 'a', x: 80, y: 120, name: 'A' },
    {
      id: 'b',
      x: 200,
      y: 100,
      name: 'B',
      isActive: true,
      isBig: true
    },
    { id: 'c', x: 150, y: 250, name: 'C', isBig: true }
  ],

  paths: [['a', 'b'], ['b', 'c']],

  baseMarkerOptions: {
    stroke: 'white',
    fill: 'rgba(255,255,255,0.6)',
    hachureAngle: 65,
    roughness: 1.5
  },

  activePlaceOptions: {
    fill: 'yellow'
  },
  inactivePlaceOptions: {},
  thingOptions: {},
  pathOptions: {},
  sizes: {
    bigPlace: 50,
    smallPlace: 25
  }
}

function ScattershellMap(props) {
  const svgRef = useRef(null)

  function renderMap(svg) {
    const rc = rough.svg(svg)
    const draw = SVG(svg) //svg.js draw

    const {
      places,
      paths,
      baseMarkerOptions,
      activePlaceOptions,
      inactivePlaceOptions,
      lineOptions,
      sizes
    } = {
      ...defaultScattershellMapProps,
      ...props
    }

    // turn places prop into an object with place.id as key
    const _places = places.reduce((map, obj) => ((map[obj.id] = obj), map), {})
    const opts = baseMarkerOptions

    const placeMarker = ({ x, y, isBig, isActive, markerOptions }) => {
      let circleOpts = {
        ...opts,
        ...(isActive ? activePlaceOptions : inactivePlaceOptions),
        ...markerOptions
      }
      return rc.circle(
        x,
        y,
        isBig ? sizes.bigPlace : sizes.smallPlace,
        circleOpts
      )
    }
    const pathMarker = (place1, place2) =>
      rc.line(place1.x, place1.y, place2.x, place2.y, {
        ...opts,
        ...lineOptions,
        stroke: Colors.Light
      })

    const labelMarker = place => {
      draw
        .text(place.name)
        .fill(Colors.Shallow)
        .x(place.x)
        .y(place.y + (place.isBig ? 30 : 20))
        .font({
          size: 16,
          anchor: 'middle'
        })
    }

    Object.values(_places).forEach(place => {
      let marker = placeMarker(place)
      svg.appendChild(marker)
      labelMarker(place)
    })

    paths.forEach(([fromId, toId]) => {
      let marker = pathMarker(_places[fromId], _places[toId])
      svg.appendChild(marker)
    })
  }

  useEffect(() => {
    let svg = svgRef.current
    renderMap(svg)
  }, [svgRef.current])

  return <svg ref={svgRef} className={'map-svg'} />
}
export default ScattershellMap
